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
using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/images")]
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


        public async Task<JsonResult> AddFeed([FromBody] Feed myFeed) {

            try
            {

                IMongoCollection<Feed> feedCollection = _database.GetCollection<Feed>("feed");
                await feedCollection.InsertOneAsync(myFeed);
                return Json(new { result = true }.ToJson(jsonWriterSettings));

            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


        public async Task<JsonResult> Feeds(Double latitude,Double longitude,Int32 fromItm,Int32 pageSize) {

            try
            {

                var feedCollection = _database.GetCollection<Feed>("feed");
                var myFeeds = (from f in feedCollection.AsQueryable<Feed>()
                             where LinqToMongo.Inject(Query.Near("location", latitude, longitude, 1000))
                             select f
                            ).Select((itm, index) => new { feed = itm, idx = index }).Skip(fromItm - 1).Take(pageSize).Select(itm => itm.feed);

                return Json(myFeeds.ToJson(jsonWriterSettings));             

                            

            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


    }
}
