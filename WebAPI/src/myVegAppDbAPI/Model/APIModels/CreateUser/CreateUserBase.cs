using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.CreateUser
{
    public class CreateUserBase
    {
        public String FirstName { get; set; }

        public String LastName { get; set; }

        public String Email { get; set; }
    }
}
