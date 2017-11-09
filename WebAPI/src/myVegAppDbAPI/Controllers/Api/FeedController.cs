using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.GridFS;
using MongoDB.Driver.Linq;
using myVegAppDbAPI.Helpers;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.Model;
using myVegAppDbAPI.Model.APIModels.Feed;
using myVegAppDbAPI.Model.DbModels.Feeds;
using myVegAppDbAPI.Model.DbModels.ReadModels;
using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/feed")]
    [EnableCors("MyPolicy")]
    public class FeedController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private EmailSettings _EmailSettings;
        private EmailHelper _emailHelper;
        private GridFSBucket _imagesBucket;
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };


        public FeedController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings, IViewRenderService viewRenderService) {
            _MongoSettings = mongoSettings.Value;
            _EmailSettings = emailSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _emailHelper = new EmailHelper(_EmailSettings);
            _imagesBucket = new GridFSBucket(_database, new GridFSBucketOptions()
            {
                BucketName = "gallery"
            });

        }

        [HttpPost("addFeed")]
        public async Task<JsonResult> AddFeed([FromBody] CreateFeed myFeed) {

            try
            {

                IMongoCollection<InsertFeed> feedCollection = _database.GetCollection<InsertFeed>("feed");
                await feedCollection.InsertOneAsync(new InsertFeed() {
                    ImageId = new ObjectId(myFeed.ImageId),
                    UserId = new ObjectId(myFeed.UserId),
                    Location = myFeed.Location,
                    Text = myFeed.Text,
                    Likes = new ObjectId[] { },
                    Replies = new Reply[] { }
                });
                return Json(new { result = true }.ToJson(jsonWriterSettings));

            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }

        [HttpGet("feeds")]
        public JsonResult Feeds(Double latitude,Double longitude,Int32 fromItm,Int32 pageSize) {

            try
            {

                var feedCollection = _database.GetCollection<ReadFeed>("feed");
               
                var myQuery = (from f in feedCollection.AsQueryable<ReadFeed>() select f).AsQueryable().Where(x=>LinqToMongo.Inject(Query.Near("location", latitude, longitude, 50))).Skip(fromItm).Take(pageSize).
                    ToList<ReadFeed>();

                return Json(myQuery.ToJson(jsonWriterSettings));             

                            

            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }

        [HttpPost("addReply")]
        public async Task<JsonResult> AddReply([FromBody] AddReply reply)
        {

            try
            {
                var feedCollection = _database.GetCollection<ReadFeed>("feed");
                var filter = Builders<ReadFeed>.Filter.Eq("_id", new ObjectId(reply.FeedId));
                var update = Builders<ReadFeed>.Update.Push("replies",new Reply() {
                         ReplyId = reply.ReplyId,
                         Text = reply.Text,
                         UserId = new ObjectId(reply.UserId)
                });
                var result = await feedCollection.UpdateOneAsync(filter,update);
              
                return Json(new {result = true}.ToJson(jsonWriterSettings));

            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }

        [HttpPost("addLike")]
        public async Task<JsonResult> AddLike([FromBody] AddLike addLike)
        {
            try
            {
                var feedCollection = _database.GetCollection<ReadFeed>("feed");
                var filter = Builders<ReadFeed>.Filter.Eq("_id", new ObjectId(addLike.FeedId));
                var update = Builders<ReadFeed>.Update.Push("likes", new ObjectId(addLike.UserId));
                var result = await feedCollection.UpdateOneAsync(filter, update);
                return Json(new { result = true }.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


    }
}
