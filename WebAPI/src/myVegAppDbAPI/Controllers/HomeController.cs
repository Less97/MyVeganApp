﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace myVegAppDbAPI.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        public ActionResult Index() {
            return View();
        }
    }
}