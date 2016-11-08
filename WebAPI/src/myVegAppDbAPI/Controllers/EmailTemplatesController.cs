using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.ViewModels.EmailTemplates;
using System.IO;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Controllers
{
    public class EmailTemplateController : Controller
    {

        private readonly IViewRenderService _viewRenderService;

        public ActionResult ConfirmEmail() {
            return View(new ConfirmEmailViewModel() {
                Name = "Alessandro",
                Code = "MGX198"
            });
         }
        

        public ActionResult EmailVerificationSuccessful() {
            return View();
        }
    }
}
