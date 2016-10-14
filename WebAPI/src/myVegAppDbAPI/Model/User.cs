using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace myVegAppDbAPI.Controllers
{
    public class User : BsonDocument
    {
        [BsonElement("email")]
        public String Email { get; set; }

        [BsonElement("password")]
        public String Password { get; set; }

        [BsonElement("tipology")]
        public String Tipology { get; set; }

        [BsonElement("firstName")]
        public String FirstName { get; set; }

        [BsonElement("lastName")]
        public String LastName { get; set; }
    }
}
