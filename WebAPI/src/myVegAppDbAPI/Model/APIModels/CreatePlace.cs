using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class CreatePlace
    {
        public String Name { get; set;}

        public String Type { get; set; }

        public String PhoneNumber { get; set; }

        public String Address { get; set; }

        public Double Latitude { get; set; }

        public Double Longitude { get; set; }
    }
}
