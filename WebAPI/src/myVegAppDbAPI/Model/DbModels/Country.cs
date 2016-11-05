using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels
{
    public class Country
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("language")]
        public String Language { get; set; }

        [BsonElement("currencyIso")]
        public String CurrencyISO { get; set; }

        [BsonElement("currencySymbol")]
        public String CurrencySymbol { get; set; }
    }
}
