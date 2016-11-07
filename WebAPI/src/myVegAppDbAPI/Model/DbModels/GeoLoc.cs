using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels
{
    public class GeoLoc
    {
        [BsonElement("type")]
        public String Type { get; set; }

        [BsonElement("coordinates")]
        public Double[] Location{ get;set; }

        public GeoLoc() { }
        public GeoLoc(Double lat, Double lng)
        {
            this.Type = "Point";
            this.Location = new Double[] { lng, lat };
        }
    }
}
