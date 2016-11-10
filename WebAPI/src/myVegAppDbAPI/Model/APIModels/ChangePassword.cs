using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class ChangePassword
    {
        public String Email { get; set; }

        public String Password { get; set; }
    }
}
