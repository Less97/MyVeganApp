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
            var message = new HomeViewModel()
            {
                Message = new MessageViewModel() { Status = 0 }
            };

            return View(message);
        }

        [HttpPost]
        public ActionResult SendEmail(MessageViewModel messageToSend)
        {
            try
            {
                messageToSend.Status = 1;
            }
            catch (Exception ex) {
                messageToSend.Status = -1;
            }
            
            return View("Index",new HomeViewModel() { Message = messageToSend});
        }
    }
}
