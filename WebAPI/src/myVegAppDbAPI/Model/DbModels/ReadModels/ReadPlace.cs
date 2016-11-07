using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using myVegAppDbAPI.Model.DbModels.BaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels.ReadModels
{
    public class ReadPlace : BasePlace
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("distance")]
        public Double Distance { get; set; }

        [BsonElement("rating")]
        public Double? rating { get; set; }

        [BsonElement("nReviews")]
        public Int32 nReviews { get; set; }

        [BsonElement("country")]
        public Country Country { get; set; }
    }
}
