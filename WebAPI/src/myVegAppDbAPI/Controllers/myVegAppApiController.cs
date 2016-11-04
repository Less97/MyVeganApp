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
                var collection = _database.GetCollection<Place>("places");

                var builder = Builders<Place>.Filter;
                var filter = (builder.Regex("name", "/" + searchText + "/i") | builder.Regex("menu.dishName", "/" + searchText + "/i")) & builder.NearSphere("location", longitude, latitude, maxDistance / 6378.1);

                if (tipology != 0)
                    filter = filter & builder.BitsAllSet("menu.tipology", tipology);

                var docs = await collection.Find(filter).ToListAsync();

                if (docs != null)
                    return Json(docs.ToJson(jsonWriterSettings));

                return Json(new { });
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
                var place = places.Aggregate().Match(x => x.Id == ObjectId.Parse(placeId)).Lookup<Place, Review, Review>(reviews, x => x.Id, y => y.PlaceId, d => new Place { });
                return Json(place.ToJson());
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


        [HttpGet("getReviews")]
        public async Task<JsonResult> GetReviews(String placeId)
        {
            try
            {
                var reviews = _database.GetCollection<Review>("reviews").AsQueryable();
                var result = reviews.Where(x=>x.PlaceId==ObjectId.Parse(placeId)).Select(X=>new Review() {
                    Id = X.Id,
                    Description = X.Description,
                    Rating = X.Rating,
                    PlaceId = X.PlaceId,
                    ReviewerId = X.ReviewerId
                });
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { error = 1, errorMessage = ex.Message });
            }
        }




    }
}
