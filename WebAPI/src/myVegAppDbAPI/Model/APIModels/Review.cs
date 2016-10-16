using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class Review
    {
        public String PlaceId { get; set; }
        public String Description { get; set; }
        public String ReviewerId { get; set; }
        public Int32 Rating { get; set; }
    }
}
