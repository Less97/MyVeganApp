using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using myVegAppDbAPI.Helpers;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.Model.APIModels;
using myVegAppDbAPI.Model.DbModels;
using myVegAppDbAPI.Model.DbModels.ReadModels;
using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/Reviews")]
    [EnableCors("MyPolicy")]
    public class ReviewsApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private GridFSBucket _imagesBucket;
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
       

        public ReviewsApiController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings, IViewRenderService viewRenderService)
        {
            _MongoSettings = mongoSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _imagesBucket = new GridFSBucket(_database, new GridFSBucketOptions()
            {
                BucketName = "gallery"
            });
        }

        [NonAction]
        public async Task<String> SaveImage(String image)
        {
            image = image.Replace("data:image/jpeg;base64,", String.Empty)
                .Replace("data:image/png;base64,", String.Empty)
                .Replace("data:image/gif;base64,", String.Empty)
                .Replace("data:image/bmp;base64,", String.Empty);
            byte[] toBytes = Convert.FromBase64String(image);
           
            using (Stream mystream = new MemoryStream(toBytes)) {
                var myId = await _imagesBucket.UploadFromStreamAsync(String.Empty, mystream);
                return myId.ToString();
            }

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

                var imgId = await SaveImage(model.Image);

                await reviewsCollection.InsertOneAsync(new BsonDocument() {
                    { "placeId",ObjectId.Parse(model.PlaceId)},
                    { "reviewerId",ObjectId.Parse(model.ReviewerId)},
                    { "rating",model.Rating},
                    { "description",model.Description},
                    { "title",model.Title},
                    { "imageId",imgId}
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
                             { "rating",1},
                             { "imageId",1},
                             { "title",1}
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
