using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using myVegAppDbAPI.Model.APIModels.CreateUser;

namespace myVegAppDbAPI.Model.APIModels.CreateUser
{
    public class CreateUser : CreateUserBase
    {
        public String Password { get; set; }

        public String ConfirmPassword { get; set; }

        public Int32 Type { get; set; }
    }
}
