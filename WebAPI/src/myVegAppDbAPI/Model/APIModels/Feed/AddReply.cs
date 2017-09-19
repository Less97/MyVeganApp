using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.Feed
{
    public class AddReply
    {
        public String FeedId { get; set; }

        public String Idx { get; set; }

        public String Text { get; set; }

        public String UserId { get; set; }
    }
}
