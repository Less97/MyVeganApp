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

namespace myVegAppDbAPI.Controllers
{
    [Route("api/myVegAppAPI")]
    [EnableCors("MyPolicy")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MySettings MySettings { get; set; }
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

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
                var collection = _database.GetCollection<BsonDocument>("users");
                var filter = new FilterDefinitionBuilder<BsonDocument>().And(new FilterDefinitionBuilder<BsonDocument>().Eq("email", model.Email) & new FilterDefinitionBuilder<BsonDocument>().Eq("password", model.Password));
                var document = await collection.Find(filter).FirstOrDefaultAsync();
                if (document == null)
                    return Json(new { isLoggedIn = false }.ToJson());
                else
                    return Json(new { isLoggedIn = true, document = document.ToJson(jsonWriterSettings) }.ToJson());
            }
            catch (Exception ex)
            {
                ////TODO:Error logging
                return Json(new { isLoggedIn = false });
            }
        }

        [HttpPost("createUser")]
        public async Task<JsonResult> CreateUser([FromBody] CreateUser model)
        {
            try
            {
                var userCollection = _database.GetCollection<BsonDocument>("users");

                //check if already existing
                var filter = new FilterDefinitionBuilder<BsonDocument>().And(new FilterDefinitionBuilder<BsonDocument>().Eq("email", model.Email) & new FilterDefinitionBuilder<BsonDocument>().Eq("password", model.Password));
                var document = await userCollection.Find(filter).FirstOrDefaultAsync();

                if (document != null)
                {
                    return Json(new { error = 1, Message = "User already exists" });
                }

                var bsonDocument = new BsonDocument()
                {
                    { "email" ,model.Email},
                    { "password",model.Password},
                    { "firstName" ,model.FirstName},
                    { "lastName",model.LastName},
                    { "tipology",model.Type},
                };
                await userCollection.InsertOneAsync(bsonDocument);
                document = await userCollection.Find(filter).FirstOrDefaultAsync();
                if (document == null)
                    return Json(new { error = 1, Message = "Couldn't create the user" }.ToJson());
                else
                    return Json(document.ToJson(jsonWriterSettings));
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
                var agg = new BsonDocument[] {
                    new BsonDocument() {
                        { "$lookup" ,new BsonDocument()
                            {
                                { "from", "countries" },
                                { "localField","country" },
                                { "foreignField","_id" },
                                { "as","country" },
                            }
                        }
                    },
                    new BsonDocument() {
                        {
                            "$lookup" ,new BsonDocument()
                            {
                                { "from", "reviews" },
                                { "localField","reviews" },
                                { "foreignField","place" },
                                { "as","reviews" },
                            }
                        }
                    },
                };
                var collection = _database.GetCollection<BsonDocument>("places");

                var builder = Builders<BsonDocument>.Filter;
                var filter = (builder.Regex("name", "/" + searchText + "/i") | builder.Regex("menu.dishName", "/" + searchText + "/i")) & builder.NearSphere("location", longitude, latitude, maxDistance / 6378.1);

                if (tipology != 0)
                    filter = filter & builder.BitsAllSet("menu.tipology", tipology);

                var docs = await collection.Find(filter).ToListAsync();

                docs.ForEach(x =>
                {
                    var loc = x["location"]["coordinates"].AsBsonArray;
                    x.Add("distance", GeoHelper.CalculateDistance(new Location(latitude, longitude), new Location(loc[1].ToDouble(), loc[0].ToDouble())));
                });
                if (docs != null)
                    return Json(docs.ToJson(jsonWriterSettings));

                return Json(new { });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, errorMessage = ex.Message });
            }

        }

        [HttpGet]
        public async Task<JsonResult> GetPlaceDetails(String placeId)
        {
            try
            {
                var places = _database.GetCollection<BsonDocument>("places");
                var filter = Builders<BsonDocument>.Filter.Where(x => x["_id"] == ObjectId.Parse(placeId));
                var doc = await places.Find(filter).FirstAsync();
                return Json(doc.ToJson(jsonWriterSettings));
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
                var placesCollection = _database.GetCollection<BsonDocument>("places");
                var myNewPlace = new BsonDocument() {
                    { "name",  model.Name },
                    { "type",  model.Type },
                    { "phoneNumber",model.PhoneNumber},
                    { "address",model.Address},
                    { "location", new BsonDocument()
                        {
                            {"coordinates",new BsonArray() {
                                model.Longitude,model.Latitude
                            } },
                            {  "type","Point" }
                        }
                    },
                    { "menu",new BsonArray() },
                    { "nReviews",0 },
                    { "rating",0}
                 };
                await _database.GetCollection<BsonDocument>("places").InsertOneAsync(myNewPlace);
                return Json(new { error = 0, result = 1 });
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }

        [HttpPost("createMenuItem")]
        public async Task<JsonResult> CreateMenuItem([FromBody]CreateMenuItem model)
        {
            try
            {
                var placesCollection = _database.GetCollection<BsonDocument>("places");
                var findMyPlaceFilter = Builders<BsonDocument>.Filter.Where(x => x["_id"] == ObjectId.Parse(model.PlaceId));
                var update = Builders<BsonDocument>.Update.AddToSet("menu", new BsonDocument()
                {
                    { "dishName",model.Name},
                    { "price",model.Price},
                    { "tipology",model.Tipology},
                });
                await placesCollection.UpdateOneAsync(findMyPlaceFilter, update);
                return Json(new { error = 0, result = 1 });
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }

        [HttpPost("addReview")]
        public async Task<JsonResult> AddReview([FromBody]Review model)
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
                var nReviews = Convert.ToInt32(place["nReviews"]);
                var currentRating = Convert.ToDouble(place["rating"]);
                var newRating = Convert.ToDouble((currentRating * nReviews + model.Rating) / (++nReviews));
                newRating = Math.Round(newRating * 2, MidpointRounding.AwayFromZero) / 2;
                var updateReviewInPlace = Builders<BsonDocument>.Update.Set("nReviews", nReviews).Set("rating", newRating);
                await placesCollection.UpdateOneAsync(findMyPlaceFilter, updateReviewInPlace);
                return Json(new { error = 0, result = 1 });
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }


        [HttpPost("getReviews")]
        public async Task<JsonResult> GetReviews(String placeId)
        {
            try
            {
                var reviewsCollection = _database.GetCollection<BsonDocument>("reviews");
                var findPlaceReviews = Builders<BsonDocument>.Filter.Where(x => x["_placeId"] == ObjectId.Parse(placeId));
                var reviews = await reviewsCollection.Find(findPlaceReviews).ToListAsync();
                return Json(reviews);
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }




    }
}
