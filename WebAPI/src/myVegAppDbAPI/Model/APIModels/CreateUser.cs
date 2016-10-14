using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class CreateUser
    {
        public String  FirstName { get; set; }

        public String LastName { get; set; }

        public String Email { get; set; }

        public String Password { get; set; }

        public String Type { get; set; }
    }
}
