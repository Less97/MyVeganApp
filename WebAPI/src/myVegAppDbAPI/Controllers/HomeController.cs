using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using myVegAppDbAPI.Model.Website;

namespace myVegAppDbAPI.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        public ActionResult Index() {
            var message = new HomeViewModel();
            return View(message);
        }

        [HttpPost]
        public ActionResult SendEmail(MessageViewModel messageToSend)
        {
            try
            {
                ViewBag.IsMessageSent = true;
            }
            catch (Exception ex) {
                ViewBag.IsMessageSent = false;
            }
            
            return View("Index",new HomeViewModel() { Message = messageToSend});
        }
    }
}
