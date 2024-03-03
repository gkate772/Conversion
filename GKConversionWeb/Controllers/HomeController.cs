using Microsoft.AspNetCore.Mvc;

namespace GKConversionWeb.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
