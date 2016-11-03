using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace myVegAppDbAPI.Model.DbModels
{
    public class User 
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("email")]
        public String Email { get; set; }

        [BsonElement("password")]
        public String Password { get; set; }

        [BsonElement("type")]
        public Int32 Type { get; set; }

        [BsonElement("firstName")]
        public String FirstName { get; set; }

        [BsonElement("lastName")]
        public String LastName { get; set; }
    }
}
