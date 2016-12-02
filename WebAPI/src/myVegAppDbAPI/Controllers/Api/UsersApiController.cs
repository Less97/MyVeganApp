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
        private static Dictionary<String, ReadUser> usersChangingPassword = new Dictionary<String, ReadUser>();


        public UsersApiController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings, IViewRenderService viewRenderService)
        {
            _MongoSettings = mongoSettings.Value;
            _EmailSettings = emailSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _emailHelper = new EmailHelper(_EmailSettings);
            this._renderService = viewRenderService;
        }

        [HttpPost("login")]
        public JsonResult Login([FromBody]Login model)
        {
            try
            {
                model.Email = model.Email.ToLower();
                var users = _database.GetCollection<ReadUser>("users").AsQueryable();
                var userExists = users.Any(u => u.Email == model.Email);

                if (!userExists)
                    return Json(new { isLoggedIn = false }.ToJson(jsonWriterSettings));

                var myUser = users.Single(x => x.Email == model.Email);
                var isValid = AuthHelper.CheckPassword(model.Password, myUser.Password, myUser.Salt);

                if (!isValid)
                    return Json(new { isLoggedIn = false }.ToJson(jsonWriterSettings));
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
                    }.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(new { Error = true, Message = ex }.ToJson(jsonWriterSettings));
            }
        }

        [HttpPost("register")]
        public async Task<JsonResult> Register([FromBody] CreateUser model)
        {
            try
            {
                var collForInserting = _database.GetCollection<InsertUser>("users");
                var collForReading = _database.GetCollection<ReadUser>("users");

                model.Email = model.Email.ToLower();

                var user = new InsertUser()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    Type = 0,
                    Password = model.Password
                };

                //checking if the user already exists.
                var isAlreadyPresent = collForReading.AsQueryable().Any(x => x.Email == model.Email);
                if (isAlreadyPresent)
                    return Json(new { Error = 0, Message = "Sorry, the email has already been used. Please use the procedure to retrieve your password instead" }.ToJson(jsonWriterSettings));

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

                return Json(new { Error = 0, GeneratedCode = randomCode }.ToJson(jsonWriterSettings));

            }

            catch (Exception ex)
            {

                return Json(ex.RaiseException());
            }
        }

        [HttpPost("confirmEmail")]
        public async Task<JsonResult> ConfirmEmail([FromBody] ConfirmEmail model)
        {
            try
            {
                model.Email = model.Email.ToLower();

                InsertUser t;
                if (!temporaryUsers.TryGetValue(model.Email, out t))
                {
                    return Json(new { Error = 1, Message = "Sorry there was a problem with the registration procedure, Please try again" }.ToJson(jsonWriterSettings));
                }

                var users = _database.GetCollection<InsertUser>("users");
                await users.InsertOneAsync(t);
                var body = await _renderService.RenderToStringAsync("EmailTemplates/RegistrationComplete", new RegistrationCompleteViewModel()
                {
                    Name = t.FirstName
                });
                await Task.Run(() => _emailHelper.SendEmail("The Curious Carrot - Registration Completed", "noreply@thecuriouscarrot.com", t.Email, body));
                temporaryUsers.Remove(model.Email);
                return Json(new { Error = 0, Result = "User correctly created" }.ToJson(jsonWriterSettings));
            }
            catch (Exception ex) {
                return Json(ex.RaiseException());
            }
        }

        [HttpPost("restorePassword")]
        public async Task<JsonResult> RestorePassword([FromBody] ForgotPassword model)
        {
            try
            {
                model.Email = model.Email.ToLower();

                var collForInserting = _database.GetCollection<InsertUser>("users");
                var collForReading = _database.GetCollection<ReadUser>("users");

                //checking if the user already exists.
                var user = collForReading.AsQueryable().SingleOrDefault(x => x.Email == model.Email);
                if (user == null)
                    return Json(new { Error = 1, Message = "Sorry, there is no a user with that email" }.ToJson(jsonWriterSettings));

                if (usersChangingPassword.ContainsKey(model.Email))
                    usersChangingPassword.Remove(model.Email);

                usersChangingPassword.Add(model.Email, user);
                var randomCode = Randomizer.RandomString(5);
                var body = await _renderService.RenderToStringAsync("EmailTemplates/ChangingPassword", new ChangingPasswordViewModel()
                {
                    Name = user.FirstName,
                    Code = randomCode
                });
                await Task.Run(() => _emailHelper.SendEmail("The Curious Carrot - Forgot your Password?", "noreply@thecuriouscarrot.com", user.Email, body));

                return Json(new { Error = 0, GeneratedCode = randomCode }.ToJson(jsonWriterSettings));

            }

            catch (Exception ex)
            {

                return Json(ex.RaiseException());
            }
        }

        [HttpPost("changePassword")]
        public async Task<JsonResult> ChangePassword([FromBody] ChangePassword changePassword)
        {
            try
            {

                changePassword.Email = changePassword.Email.ToLower();

                if (!usersChangingPassword.ContainsKey(changePassword.Email))
                    return Json(new { Error = 1, Message = "Sorry we haven't found any request of changing password from this email. Please try again." }.ToJson());

                ReadUser myUser = null;
                usersChangingPassword.TryGetValue(changePassword.Email ,out myUser);

                var users = _database.GetCollection<ReadUser>("users");
             
                if (myUser == null)
                    return Json(new { Error = 1, Message= "Sorry there has been a problem during changing your password" }.ToJson());

                String salt = String.Empty;
                myUser.Password = AuthHelper.EncryptPassword(changePassword.Password, out salt);

                var updatePasswordDefinition = Builders<ReadUser>.Update.Set("password", myUser.Password).Set("salt", salt);

                await users.UpdateOneAsync<ReadUser>(u => u.Email == changePassword.Email, updatePasswordDefinition);
                usersChangingPassword.Remove(myUser.Email);

                return Json(new { Error = 0, Message = "Password Changed correctly" }.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }


        }

    }
}
