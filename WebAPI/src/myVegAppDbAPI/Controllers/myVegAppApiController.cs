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




namespace myVegAppDbAPI.Controllers
{
    [Route("api/[controller]")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;

        public myVegAppAPIController()
        {
            _client = new MongoClient("mongodb://localhost:43210");
            _database = _client.GetDatabase("MyVegAppDb");
        }

        // GET api/values
        [HttpGet]
        public String Get()
        {
            return "Hello MyVegAppDbAPI";
        }

        [HttpPost("login")]
        public JsonResult Login([FromBody]Login model)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("places");
                var filter = Builders<BsonDocument>.Filter.Eq("email", model.Email);
                var result = collection.Count(filter);
                return Json(new { login = result == 1 });
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
