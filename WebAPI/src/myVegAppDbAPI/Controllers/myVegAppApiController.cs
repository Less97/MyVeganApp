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

namespace myVegAppDbAPI.Controllers
{
    [Route("api/[controller]")]
    public class myVegAppAPIController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MySettings MySettings { get; set; }

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
                var collection = _database.GetCollection<BsonDocument>("users");
                var filter = new FilterDefinitionBuilder<BsonDocument>().And(new FilterDefinitionBuilder<BsonDocument>().Eq("email",model.Email)& new FilterDefinitionBuilder<BsonDocument>().Eq("password", model.Password));
                var document = await collection.Find(filter).FirstOrDefaultAsync();
                if (document == null)
                    return Json(new {}.ToJson());
                else
                    return  Json(document.ToJson());
            }
            catch (Exception ex) {
                return Json(ex);
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
                    return Json(new {error = 1, Message = "User already exists"});
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
                    return Json(new {error=1,Message="Couldn't create the user" }.ToJson());
                else
                    return Json(document.ToJson());
            }
            catch (Exception ex)
            {

                return Json(new {Error=1,Message= ex});
            }
        }

        [HttpGet("getplaces")]
        public async Task<JsonResult> GetPlaces(Double latitude,Double longitude,String searchText) {
            try
            {
                if (String.IsNullOrEmpty(searchText)) searchText = String.Empty;
                var collection = _database.GetCollection<BsonDocument>("places");

                var builder = Builders<BsonDocument>.Filter;
                var filter = (builder.Regex("name", "/" + searchText + "/i") | builder.Regex("menu.dishName", "/" + searchText + "/i")) & builder.NearSphere("location", longitude, latitude/*,MySettings.PlaceRadius*/);
                var docs =  await collection.Find(filter).ToListAsync();
               
                if (docs != null)
                    return Json(docs.ToJson());
                return Json(new {});
            }
            catch (Exception ex) {
                return Json(new { error = true, errorMessage = ex.Message });
            }

        }

        

        
    }
}
