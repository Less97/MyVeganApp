using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI
{
    public static class Settings
    {

        public static EmailSettings EmailSettings { get; set; }

        public static MongoSettings DataBaseSettings { get; set; }
    }
}
