using System;
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

namespace myVegAppDbAPI.Controllers
{
    [Route("api/myVegAppAPI")]
    [EnableCors("MyPolicy")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MySettings MySettings { get; set; }
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict};

        public myVegAppAPIController(IOptions<MySettings> settings)
        {
            MySettings = settings.Value;

            _client = new MongoClient(MySettings.MongoDbHost);
            _database = _client.GetDatabase(MySettings.DatabaseName);
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
                var collection = _database.GetCollection<User>("users");
                var filter = new FilterDefinitionBuilder<User>().And(new FilterDefinitionBuilder<User>().Eq("email", model.Email) & new FilterDefinitionBuilder<User>().Eq("password", model.Password));
                var document = await collection.Find(filter).FirstOrDefaultAsync();
                if (document == null)
                    return Json(new { isLoggedIn = false }.ToJson());
                else
                    return Json(new { isLoggedIn = true, document = document.ToJson(jsonWriterSettings) }.ToJson());
            }
            catch (Exception ex)
            {
                ////TODO:Error logging
                return Json(new { Error = 1, Message = ex });
            }
        }

        [HttpPost("createUser")]
        public async Task<JsonResult> CreateUser([FromBody] CreateUser model)
        {
            try
            {
                return Json(new { });
            }
            catch (Exception ex)
            {

                return Json(new { Error = 1, Message = ex });
            }
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
                var places = _database.GetCollection<Place>("places");


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
                .As<Place>()

                .ToListAsync();

                return Json(docs.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(new { error = true, errorMessage = ex.Message });
            }

        }


        [HttpGet("getPlaceDetails")]
        public async Task<JsonResult> GetPlaceDetails(String placeId, Double latitude, Double longitude)
        {
            try
            {
                IMongoCollection<Place> places = _database.GetCollection<Place>("places");
                IMongoCollection<Review> reviews = _database.GetCollection<Review>("reviews");
                IMongoCollection<Country> countries = _database.GetCollection<Country>("countries");
                var place = await places.Aggregate().Match(x => x.Id == ObjectId.Parse(placeId)).Lookup<Place, Review, BsonDocument>(reviews, x => x.Id, y => y.PlaceId, d => d["reviews"])
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
                   }).As<Place>()
                   .FirstAsync();

                place.Distance = GeoHelper.CalculateDistance(new Location(latitude, longitude), new Location(place.Location.Location[1], place.Location.Location[0]));
                return Json(place.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(new { error = true, errorMessage = ex.Message });
            }

        }


        [HttpPost("createPlace")]
        public async Task<JsonResult> CreatePlace([FromBody]CreatePlace model)
        {
            try
            {
                return Json(new { });
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
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
                {
                    return Json(new { error = 1, errorMessage = "Reviewer not found" });
                }
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
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }


        [HttpGet("getReviews")]
        public async Task<JsonResult> GetReviews(String placeId)
        {
            try
            {
                var reviews = _database.GetCollection<Review>("reviews");
                var users = _database.GetCollection<User>("users");
                var result = await reviews.Aggregate().Match(x => x.PlaceId == ObjectId.Parse(placeId))
                        .Lookup<Review, User, BsonDocument>(users, x => x.ReviewerId, y => y.Id, d => d["reviewer"])
                         .Unwind(x => x["reviewer"]).Project(new BsonDocument() {
                             { "reviewer","$reviewer.firstName"},
                             { "reviewerId",1},
                             { "placeId",1},
                             { "description",1},
                             { "rating",1}
                         }).As<Review>().
                         ToListAsync();
                return Json(result.ToJson());
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }




    }
}
