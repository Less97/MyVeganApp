using MongoDB.Bson.Serialization.Attributes;
using myVegAppDbAPI.Model.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model
{
    public class Feed
    {
        [BsonId]
        public String UserId { get; set; }

        public String Text { get; set; }

        public String Image { get; set; }
        
        public GeoLoc Location { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
