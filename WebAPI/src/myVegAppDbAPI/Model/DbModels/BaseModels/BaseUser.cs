using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels.BaseModels
{
    public abstract class BaseUser
    {
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
