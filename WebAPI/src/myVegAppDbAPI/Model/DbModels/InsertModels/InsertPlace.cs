using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using myVegAppDbAPI.Model.DbModels.BaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.DbModels.InsertModels
{
    public class InsertPlace : BasePlace
    {
        [BsonElement("countryId")]
        public ObjectId CountryId { get; set; }

       
    }
}
