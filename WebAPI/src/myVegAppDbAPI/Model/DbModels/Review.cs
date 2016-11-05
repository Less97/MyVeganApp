using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace myVegAppDbAPI.Model.DbModels
{
    [BsonIgnoreExtraElements]
    public class Review
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("placeId")]
        public ObjectId? PlaceId { get; set; }

        [BsonElement("reviewerId")]
        public ObjectId? ReviewerId { get; set; }

        [BsonElement("reviewer")]
        public String Reviewer { get; set; }

        [BsonElement("rating")]
        public Double Rating { get; set; }

        [BsonElement("description")]
        public String Description { get; set; }
    }
}
