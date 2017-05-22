using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers
{
    [Route("Vegan-Place")]
    public class VeganPlaceController
    {
        public ActionResult Find()
        {
            return View()
        }
    }
}
