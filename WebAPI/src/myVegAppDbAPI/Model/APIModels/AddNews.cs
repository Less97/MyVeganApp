using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model
{
    public class AddFeed
    {
        [BsonId]
        public String UserId { get; set; }

        public String Text { get; set; }

        public String Image { get; set; }
        
        public Double Latitude { get; set; }

        public Double Longitude { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
