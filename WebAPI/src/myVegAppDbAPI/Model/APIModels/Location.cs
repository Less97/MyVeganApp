﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model
{
    public class Location
    {
        public Double Latitude { get; set; }

        public Double Longitude { get; set; }

        public Location() { }
        public Location(Double latitude, Double longitude)
        {
            this.Latitude = latitude;
            this.Longitude = longitude;
        }
    }
}
