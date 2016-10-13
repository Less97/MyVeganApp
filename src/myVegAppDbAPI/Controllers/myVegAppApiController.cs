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
    public class MyVegApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;

        public MyVegApiController ()
        {
            _client = new MongoClient("mongodb://localhost:4321");
            _database = _client.GetDatabase("MyVegAppDb");
        }

        // GET api/values
        [HttpGet]
        public String Get()
        {
            return "Hello MyVegAppDbAPI";
        }

        // GET api/values/5
        [HttpPost]
        public JsonResult Login(Login model)
        {
            var collection = _database.GetCollection<User>("restaurants");
            var builder = Builders<User>.Filter;
            var filter = builder.Eq("email", model.email) & builder.Eq("password", model.password);
            var result = collection.Count(filter);
            return Json(new {Login = (result == 1)});
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
