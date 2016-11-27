using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class CreateReview
    {
        public String PlaceId { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
        public String ReviewerId { get; set; }
        public Int32 Rating { get; set; }
        public String Image { get; set; }
    }
}
