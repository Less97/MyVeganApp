using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.Settings
{
    public class EmailSettings
    {
        public String Url { get; set; }
        public Int32 Port { get; set; }
        public String Username { get; set; }
        public String Password { get; set; }
    }
}
