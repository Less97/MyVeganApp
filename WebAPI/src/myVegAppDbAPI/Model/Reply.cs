using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.Feed
{
    public class Reply
    {
        [BsonElement("replyId")]
        public Int32 ReplyId { get; set; }

        [BsonElement("userId")]
        public ObjectId UserId { get; set; }

        [BsonElement("text")]
        public String Text { get; set; }

    }
}
