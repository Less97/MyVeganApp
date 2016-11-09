using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using myVegAppDbAPI.Helpers;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.Model.APIModels;
using myVegAppDbAPI.Model.DbModels.InsertModels;
using myVegAppDbAPI.Model.DbModels.ReadModels;
using myVegAppDbAPI.Model.Settings;
using myVegAppDbAPI.ViewModels.EmailTemplates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/Users")]
    [EnableCors("MyPolicy")]
    public class UsersApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private EmailSettings _EmailSettings;
        private EmailHelper _emailHelper;
        private IViewRenderService _renderService;

        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
        private static Dictionary<String, InsertUser> temporaryUsers = new Dictionary<String, InsertUser>();

        public UsersApiController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings, IViewRenderService viewRenderService) {
            _MongoSettings = mongoSettings.Value;
            _EmailSettings = emailSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _emailHelper = new EmailHelper(_EmailSettings);
            this._renderService = viewRenderService;
        }

        [HttpPost("login")]
        public async Task<JsonResult> Login([FromBody]Login model)
        {
            try
            {
                model.Email = model.Email.ToLower();
                var users = _database.GetCollection<ReadUser>("users").AsQueryable();
                var userExists = users.Any(u => u.Email == model.Email);

                if (!userExists)
                    return Json(new { isLoggedIn = false });

                var myUser = users.Single(x => x.Email == model.Email);
                var isValid = AuthHelper.CheckPassword(model.Password, myUser.Password, myUser.Salt);

                if (!isValid)
                    return Json(new { isLoggedIn = false }.ToJson());
                else
                    return Json(new
                    {
                        isLoggedIn = true,
                        user =
                    new
                    {
                        FirstName = myUser.FirstName,
                        LastName = myUser.LastName,
                        Email = myUser.Email,
                        Id = myUser.Id
                    }
                    }.ToJson());
            }
            catch (Exception ex)
            {
                return Json(new { Error = true, Message = ex });
            }
        }

        [HttpPost("createUser")]
        public async Task<JsonResult> CreateUser([FromBody] CreateUser model)
        {
            try
            {
                var collForInserting = _database.GetCollection<InsertUser>("users");
                var collForReading = _database.GetCollection<ReadUser>("users");

                var user = new InsertUser()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    Type = 0,
                    Password = model.Password
                };

                //checking if the user already exists.
                var isAlreadyPresent = collForReading.AsQueryable().Any(x=>x.Email == model.Email);
                if (isAlreadyPresent)
                    return Json(new { Error = 0, Message = "Sorry, the email has already been used. Please use the procedure to retrieve your password instead" });

                String salt = String.Empty;
                user.Password = AuthHelper.EncryptPassword(user.Password, out salt);
                user.Salt = salt;
                if (temporaryUsers.ContainsKey(model.Email))
                    temporaryUsers.Remove(model.Email);

                temporaryUsers.Add(model.Email, user);
                var randomCode = Randomizer.RandomString(5);
                var body = await _renderService.RenderToStringAsync("EmailTemplates/ConfirmEmail", new ConfirmEmailViewModel()
                {
                    Name = user.FirstName,
                    Code = randomCode
                });
                await Task.Run(() => _emailHelper.SendEmail("The Curious Carrot - Verify Your Email", "noreply@thecuriouscarrot.com", user.Email, body));

                return Json(new { Error = 0, GeneratedCode = randomCode });

            }

            catch (Exception ex)
            {

                return Json(ex.RaiseException());
            }
        }

        [HttpPost("confirmEmail")]
        public async Task<JsonResult> ConfirmEmail([FromBody] ConfirmEmail model)
        {
            InsertUser t;
            if (!temporaryUsers.TryGetValue(model.Email, out t))
            {
                return Json(new { Error = 1, Message = "Sorry there was a problem with the registration procedure, Please try again" });
            }

            var users = _database.GetCollection<InsertUser>("users");
            await users.InsertOneAsync(t);
            var body = await _renderService.RenderToStringAsync("EmailTemplates/RegistrationComplete", new RegistrationCompleteViewModel()
            {
                Name = t.FirstName
            });
            await Task.Run(() => _emailHelper.SendEmail("The Curious Carrot - Registration Completed", "noreply@thecuriouscarrot.com", t.Email, body));
            return Json(new { Error = 0, Result = "User correctly created" });
        }
    }
}
