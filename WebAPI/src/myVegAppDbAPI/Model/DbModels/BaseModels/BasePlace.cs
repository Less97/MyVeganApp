using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels.BaseModels
{
    public class BasePlace
    {
        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("type")]
        public String Type { get; set; }

        [BsonElement("phoneNumber")]
        public String PhoneNumber { get; set; }

        [BsonElement("description")]
        public String Description { get; set; }

        [BsonElement("website")]
        public String Website { get; set; }

        [BsonElement("address")]
        public String Address { get; set; }

        [BsonElement("email")]
        public String Email { get; set; }
       
        [BsonElement("location")]
        public GeoLoc Location { get; set; }

       
        [BsonElement("openingHours")]
        public String OpeningHours { get; set; }

        [BsonElement("menu")]
        public MenuItem[] Menu { get; set; }


    }
}
