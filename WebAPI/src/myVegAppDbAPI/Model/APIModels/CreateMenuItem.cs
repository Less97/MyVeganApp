﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class CreateMenuItem
    {
        public String PlaceId { get; set; }
        public String Name { get; set; }
        public Double Price { get; set; }
        public Int32 Tipology { get; set; }
    }
}
