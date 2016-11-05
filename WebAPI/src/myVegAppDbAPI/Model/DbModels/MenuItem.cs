using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels
{
    public class MenuItem
    {
        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("price")]
        public Double Price { get; set; }

        [BsonElement("tipology")]
        public Int32 tipology { get; set; }
    }
}
