using GKConversionWeb.Classes;
using Microsoft.AspNetCore.Mvc;

namespace GKConversionWeb.Controllers
{
    public class JsonToController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index([FromBody] Dictionary<string, object> jsondata)
        {
            string data = Convert.ToString(jsondata["jsondata"]);
            string csharpClasses = JsonToCSharpClassGenerator.GenerateCSharpClassesFromJson(data);
            return Ok(csharpClasses);
        }
    }
}
