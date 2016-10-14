using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace myVegAppDbAPI.Model.DbModels
{
    public class Place
    {
        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("type")]
        public String Type { get; set; }

        [BsonElement("phoneNumber")]
        public String PhoneNumber { get; set; }

        [BsonElement("address")]
        public String Address { get; set; }

        [BsonElement("rating")]
        public Double Rating { get; set; }

        [BsonElement("totalFeed")]
        public Int32 TotalFeed { get; set; }

        public Dish[] Menu { get; set; }
    }

    public class Dish
    {
        [BsonElement("rating")]
        public String Name { get; set; }

        [BsonElement("price")]
        public Double Price { get; set; }
    }

}
