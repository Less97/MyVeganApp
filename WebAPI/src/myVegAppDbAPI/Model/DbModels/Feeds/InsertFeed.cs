using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using myVegAppDbAPI.Model.APIModels.Feed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels.Feeds
{
    public class InsertFeed
    {
        [BsonElement("userId")]
        public ObjectId UserId { get; set; }

        [BsonElement("text")]
        public String Text { get; set; }

        [BsonElement("imageId")]
        public ObjectId ImageId { get; set; }

        [BsonElement("location")]
        public GeoLoc Location { get; set; }

        [BsonElement("replies")]
        public Reply[] Replies { get; set; }

        [BsonElement("likes")]
        public ObjectId[] Likes { get; set; }
    }
}
