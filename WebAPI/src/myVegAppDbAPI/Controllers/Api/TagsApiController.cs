using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using MongoDB.Driver;
using myVegAppDbAPI.Model.Settings;
using MongoDB.Driver.GridFS;
using MongoDB.Bson.IO;
using Microsoft.Extensions.Options;
using MongoDB.Bson;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/tags")]
    [EnableCors("MyPolicy")]
    public class TagsApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

        public TagsApiController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings)
        {
            _MongoSettings = mongoSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
        }


        // GET: api/values
        [HttpGet("getTags")]
        public JsonResult Get()
        {
            var placesCollection = _database.GetCollection<BsonDocument>("places");
            var builder = Builders<BsonDocument>.Filter;

            var tagList =  placesCollection.Aggregate().AppendStage<BsonDocument>(new BsonDocument() {
                { "$unwind","$tags" }
            })
            .AppendStage<BsonDocument>(new BsonDocument() {
                { "$group",new BsonDocument(){
                    { "_id","$tags"}
                } }
            })
            .ToList();

            return Json(tagList.ToJson(jsonWriterSettings));

        }
    }
}
