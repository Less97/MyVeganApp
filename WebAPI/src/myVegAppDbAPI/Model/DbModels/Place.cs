using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace myVegAppDbAPI.Model.DbModels
{
    
    [BsonIgnoreExtraElements]
    public class Place
    {
        [BsonId]
        public ObjectId Id { get; set; }

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

        [BsonElement("nReviews")]
        public Int32 nReviews { get; set; }

        [BsonElement("rating")]
        public Double? rating { get; set; }

        [BsonElement("distance")]
        public Double Distance { get; set; }
        
        [BsonElement("location")]
        public GeoLoc Location { get; set; }

        [BsonElement("menu")]
        public MenuItem[] Menu { get; set; }

        [BsonElement("country")]
        public Country Country { get; set; }

        [BsonElement("openingHours")]
        public String OpeningHours { get; set; }
    }
}
