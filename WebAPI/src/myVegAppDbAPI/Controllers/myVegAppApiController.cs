﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using myVegAppDbAPI.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson.Serialization.Serializers;
using myVegAppDbAPI.Model.APIModels;
using Microsoft.Extensions.Options;
using myVegAppDbAPI.Helpers;
using myVegAppDbAPI.Model.DbModels;
using Microsoft.AspNetCore.Cors;
using MongoDB.Bson.IO;
using MongoDB.Driver.Linq;
using MongoDB.Driver.GeoJsonObjectModel;
using myVegAppDbAPI.Model.DbModels.InsertModels;
using myVegAppDbAPI.Model.DbModels.ReadModels;
using System.Text.RegularExpressions;
using myVegAppDbAPI.Model.Settings;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.ViewModels.EmailTemplates;

namespace myVegAppDbAPI.Controllers
{
    [Route("api/myVegAppAPI")]
    [EnableCors("MyPolicy")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private EmailSettings _EmailSettings;
        private EmailHelper _emailHelper;
        private IViewRenderService _renderService;

        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict};
        private static Dictionary<String, InsertUser> temporaryUsers = new Dictionary<String,InsertUser>();
        

        public myVegAppAPIController(IOptions<MongoSettings> mongoSettings,IOptions<EmailSettings> emailSettings,IViewRenderService viewRenderService)
        {
            _MongoSettings = mongoSettings.Value;
            _EmailSettings = emailSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _emailHelper = new EmailHelper(_EmailSettings);
            this._renderService = viewRenderService;
        }

        // GET api/values
        [HttpGet]
        public String Get()
        {
            return "Hello MyVegAppDbAPI";
        }

        [HttpPost("login")]
        public async Task<JsonResult> Login([FromBody]Login model)
        {
            try
            {
                model.Email = model.Email.ToLower();
                var users = _database.GetCollection<ReadUser>("users").AsQueryable();
                var myUser = users.Single(u => u.Email == model.Email);

                var isValid = AuthHelper.CheckPassword(model.Password, myUser.Password, myUser.Salt);

                if (!isValid)
                    return Json(new { isLoggedIn = false }.ToJson());
                else
                    return Json(new { isLoggedIn = true, user = 
                    new {
                        FirstName = myUser.FirstName,
                        LastName = myUser.LastName,
                        Email = myUser.Email,
                        Id = myUser.Id
                    } }.ToJson());
            }
            catch (Exception ex)
            {
                return Json(new { Error = 1, Message = ex });
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
                var isAlreadyPresent = await collForReading.AsQueryable().AnyAsync(u => u.Email == model.Email);
                if(isAlreadyPresent)
                     return Json(new { Error = 0, Message = "Sorry, the email has already been used. Please use the procedure to retrieve your password instead" });

                String salt = String.Empty;
                user.Password = AuthHelper.EncryptPassword(user.Password, out salt);
                user.Salt = salt;
                if (temporaryUsers.ContainsKey(model.Email))
                    temporaryUsers.Remove(model.Email);

                temporaryUsers.Add(model.Email, user);
                var randomCode = Randomizer.RandomString(5);
                var body = await _renderService.RenderToStringAsync("EmailTemplates/ConfirmEmail", new ConfirmEmailViewModel() {
                    Name = user.FirstName,
                    Code = randomCode
                });
                 await Task.Run(()=>_emailHelper.SendEmail("The Curious Carrot - Verify Your Email", "noreply@thecuriouscarrot.com", user.Email,body));

                return Json(new { Error = 0, GeneratedCode = randomCode});

            }

            catch (Exception ex)
            {

                return Json(ex.RaiseException());
            }
        }

        [HttpPost("confirmEmail")]
        public async Task<JsonResult> ConfirmEmail([FromBody] ConfirmEmail model) {
            InsertUser t;
            if (!temporaryUsers.TryGetValue(model.Email, out t)) {
                return Json(new { Error = 1, Message = "Sorry there was a problem with the registration procedure, Please try again" });
            }

            var users = _database.GetCollection<InsertUser>("users");
            await users.InsertOneAsync(t);
            var body = await _renderService.RenderToStringAsync("EmailTemplates/RegistrationComplete", new RegistrationCompleteViewModel()
            {
                Name = t.FirstName
            });
            await Task.Run(() => _emailHelper.SendEmail("The Curious Carrot - Registration Completed", "noreply@thecuriouscarrot.com", t.Email, body));
            return Json(new { Error = 0, Result= "User correctly created"});
        }

        [HttpGet("getplaces")]
        public async Task<JsonResult> GetPlaces(Double latitude, Double longitude, String searchText, Int32 maxDistance = Int32.MaxValue, Int32 tipology = 0)
        {
            try
            {

                if (String.IsNullOrEmpty(searchText)) searchText = String.Empty;
                BsonArray location = new BsonArray();
                location.AddRange(new Double[] { longitude, latitude });
                var reviews = _database.GetCollection<Review>("reviews");
                var places = _database.GetCollection<ReadPlace>("places");


                var builder = Builders<BsonDocument>.Filter;
                var postGeoFilter = builder.Empty;

                if (!String.IsNullOrEmpty(searchText))
                    postGeoFilter = postGeoFilter & builder.Regex("name", "/" + searchText + "/i") | builder.Regex("menu.dishName", "/" + searchText + "/i");

                if (tipology != 0)
                    postGeoFilter = postGeoFilter & builder.BitsAllSet("menu.tipology", tipology);


                var docs = await places.Aggregate().AppendStage<BsonDocument>(new BsonDocument() {
                    { "$geoNear",new BsonDocument() {
                        { "near", new BsonDocument() {
                            { "type","Point"},
                            { "coordinates",new BsonArray(new Double[] { longitude,latitude})}
                        } },
                        { "distanceField","dist.calculated"},
                        { "spherical",true},
                        { "maxDistance", maxDistance*1000},
                    } }
                })
                .Match(postGeoFilter) // filtro menu & nome del posto
                .Lookup<BsonDocument, Review, BsonDocument>(reviews, x => x["_id"], y => y.PlaceId, z => z["reviews"])
                .Unwind(x => x["reviews"], new AggregateUnwindOptions<BsonDocument>() { PreserveNullAndEmptyArrays = true })
                .Group(new BsonDocument() // Espande l'array di reviews e tira fuori nReviews e rating
                {
                    { "_id", new BsonDocument() {
                        { "_id","$_id"},
                        { "name","$name" },
                        { "distance","$dist.calculated"},
                        { "phoneNumber","$phoneNumber"},
                        { "address","$address"},
                        { "description","$description"},
                        { "website","$website"},
                        { "type","$type"},
                        { "location","$location"}
                    } },
                       { "nReviews",new BsonDocument(){
                           { "$sum",1}
                       } },
                       { "rating",new BsonDocument() {
                           {"$avg","$reviews.rating" }
                  } }
                })
                .Project(new BsonDocument() {
                    { "_id","$_id._id" },
                    { "name","$_id.name"},
                    { "phoneNumber","$_id.phoneNumber"},
                    { "address","$_id.address"},
                    { "website","$_id.website"},
                    { "description","$_id.description"},
                    { "nReviews","$nReviews"},
                    { "type","$_id.type"},
                    { "rating","$rating"},
                    { "distance","$_id.distance"},
                    { "location","$_id.location"}
                })
                .SortBy<BsonDocument>(x=>x["distance"]) //Forse sono gia ordinati
                .As<ReadPlace>()

                .ToListAsync();

                return Json(docs.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


        [HttpGet("getPlaceDetails")]
        public async Task<JsonResult> GetPlaceDetails(String placeId, Double latitude, Double longitude)
        {
            try
            {
                IMongoCollection<ReadPlace> places = _database.GetCollection<ReadPlace>("places");
                IMongoCollection<Review> reviews = _database.GetCollection<Review>("reviews");
                IMongoCollection<Country> countries = _database.GetCollection<Country>("countries");
                var place = await places.Aggregate().Match(x => x.Id == ObjectId.Parse(placeId)).Lookup<ReadPlace, Review, BsonDocument>(reviews, x => x.Id, y => y.PlaceId, d => d["reviews"])
                    .Unwind(x => x["reviews"], new AggregateUnwindOptions<BsonDocument>() { PreserveNullAndEmptyArrays = true })
                   .Group(new BsonDocument()
                   {
                       { "_id",new BsonDocument(){
                           { "placeId","$placeId" },
                           { "description","$description" },
                           { "phoneNumber","$phoneNumber" },
                           { "address","$address" },
                           { "website","$website" },
                           { "name","$name"},
                           { "openingHours","$openingHours"},
                           { "type","$type"},
                           { "email","$email"},
                           { "location","$location"},
                           { "menu","$menu"},
                           { "countryId","$countryId"},
                            { "_id","$_id"}
                       }},
                       { "nReviews",new BsonDocument(){
                           { "$sum",1}
                       } },
                       { "rating",new BsonDocument() {
                           {"$avg","$reviews.rating" }
                       } }

                   })
                   .Lookup<BsonDocument, Country, BsonDocument>(countries, x => x["_id.countryId"], x => x.Id, z => z["country"])
                   .Unwind(x => x["country"])
                   .Project(new BsonDocument() {
                       { "_id", "$_id._id"},
                       { "nReviews","$nReviews"},
                       { "rating","$rating"},
                       { "name","$_id.name"},
                       { "description","$_id.description"},
                       { "type","$_id.type"},
                       { "website","$_id.website"},
                       { "email","$_id.email"},
                       { "address","$_id.address"},
                       { "location","$_id.location"},
                       { "menu","$_id.menu"},
                       { "openingHours","$_id.openingHours"},
                       { "phoneNumber","$_id.phoneNumber"},
                       { "country","$country"}
                   }).As<ReadPlace>()
                   .FirstAsync();

                place.Distance = GeoHelper.CalculateDistance(new Location(latitude, longitude), new Location(place.Location.Location[1], place.Location.Location[0]));
                return Json(place.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


        [HttpPost("createPlace")]
        public async Task<JsonResult> CreatePlace([FromBody]CreatePlace model)
        {
            try
            {
                IMongoCollection<InsertPlace> places = _database.GetCollection<InsertPlace>("places");

                var myNewPlace = new InsertPlace() {
                    Name = model.Name,
                    Description = model.Description,
                    Website = model.Website,
                    OpeningHours = model.OpeningHours,
                    Type = model.Type,
                    Address = model.Address,
                    Email = model.Email,
                    CountryId = new ObjectId(model.CountryId),
                    Menu = new MenuItem[0],
                    Location = new GeoLoc(model.Latitude,model.Longitude),
                    PhoneNumber = model.PhoneNumber
                };
                await places.InsertOneAsync(myNewPlace);
                return Json(new { result = true });
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
        }

        [HttpPost("createMenuItem")]
        public async Task<JsonResult> CreateMenuItem([FromBody]CreateMenuItem model)
        {
            return Json(new { });
        }

        [HttpPost("addReview")]
        public async Task<JsonResult> AddReview([FromBody] CreateReview model)
        {
            try
            {
                var placesCollection = _database.GetCollection<BsonDocument>("places");
                var usersCollection = _database.GetCollection<BsonDocument>("users");
                var reviewsCollection = _database.GetCollection<BsonDocument>("reviews");

                var findMyPlaceFilter = Builders<BsonDocument>.Filter.Where(x => x["_id"] == ObjectId.Parse(model.PlaceId));
                var findMyReviewerFilter = Builders<BsonDocument>.Filter.Where(x => x["_id"] == ObjectId.Parse(model.ReviewerId));
                var place = await placesCollection.Find(findMyPlaceFilter).FirstAsync();
                if (place == null)
                    return Json(new { error = 1, errorMessage = "Place not found" });
                var reviewer = await usersCollection.Find(findMyReviewerFilter).FirstAsync();
                if (reviewer == null)
                    return Json(new { error = 1, errorMessage = "Reviewer not found" });
                await reviewsCollection.InsertOneAsync(new BsonDocument() {
                    { "placeId",ObjectId.Parse(model.PlaceId)},
                    { "reviewerId",ObjectId.Parse(model.ReviewerId)},
                    { "rating",model.Rating},
                    { "description",model.Description}
                });
                return Json(new { error = 0, result = 1 });
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
        }


        [HttpGet("getReviews")]
        public async Task<JsonResult> GetReviews(String placeId)
        {
            try
            {
                var reviews = _database.GetCollection<Review>("reviews");
                var users = _database.GetCollection<ReadUser>("users");
                var result = await reviews.Aggregate().Match(x => x.PlaceId == ObjectId.Parse(placeId))
                        .Lookup<Review, ReadUser, BsonDocument>(users, x => x.ReviewerId, y => y.Id, d => d["reviewer"])
                         .Unwind(x => x["reviewer"]).Project(new BsonDocument() {
                             { "reviewer","$reviewer.firstName"},
                             { "reviewerId",1},
                             { "placeId",1},
                             { "description",1},
                             { "rating",1}
                         }).As<Review>().
                         ToListAsync();
                return Json(result.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
        }




    }
}
