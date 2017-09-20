using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.Feed
{
    public class AddLike
    {
        public String FeedId { get; set; }

        public String UserId { get; set; }
    }
}
