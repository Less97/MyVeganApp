using myVegAppDbAPI.Model.APIModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Helpers
{
    public static class ExceptionHelper
    {
        public static ExceptionMessage RaiseException(this Exception ex) {

            //Log errors doing something here
            return new ExceptionMessage(ex);
        }

    }
}
