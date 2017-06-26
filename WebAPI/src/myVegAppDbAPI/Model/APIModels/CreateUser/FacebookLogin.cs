using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels.CreateUser
{
    public class FacebookLogin : CreateUserBase
    {
        public Boolean IsFacebookLogin { get; set; }

        public String UserId { get; set; }
    }
}
