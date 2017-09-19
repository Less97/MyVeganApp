using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using myVegAppDbAPI.Model.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.Feed
{
    public class CreateFeed
    {
        [BsonElement("userId")]
        public String UserId { get; set; }

        [BsonElement("text")]
        public String Text { get; set; }

        [BsonElement("imageId")]
        public String ImageId { get; set; }

        [BsonElement("location")]
        public GeoLoc Location { get; set; }

    }
}
