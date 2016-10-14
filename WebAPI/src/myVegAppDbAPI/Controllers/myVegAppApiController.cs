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




namespace myVegAppDbAPI.Controllers
{
    [Route("api/[controller]")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;

        public myVegAppAPIController()
        {
            _client = new MongoClient("mongodb://127.0.0.1:4321");
            _database = _client.GetDatabase("myVegAppDb");
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
                var collection = _database.GetCollection<BsonDocument>("users");
                var filter = new FilterDefinitionBuilder<BsonDocument>().And(new FilterDefinitionBuilder<BsonDocument>().Eq("email",model.Email)& new FilterDefinitionBuilder<BsonDocument>().Eq("password", model.Password));
                var document = await collection.Find(filter).FirstOrDefaultAsync();
                if (document == null)
                    return Json(new {Error = 1});
                else
                    return  Json(document.ToJson());
            }
            catch (Exception ex) {
                return Json(ex);
            }
        }

        [HttpGet("getplaces")]
        public JsonResult GetPlaces() {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("places");
                return Json(collection.ToJson());
            }
            catch (Exception ex) {
                return Json(new { error = true, errorMessage = ex.Message });
            }

        }

        

        
    }
}
