using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Exam.Back.IRespository.Personal;
using Newtonsoft.Json;
using Exam.Back.Model;
namespace Exam.Back.Mvc.Controllers
{
    public class PersonalController : Controller
    {
        IPersonalRespository itestcores;
        public PersonalController(IPersonalRespository itestcoress)
        {
            itestcores = itestcoress;
        }
        // GET: Personal
        public ActionResult PersonalList()
        {
            return View();
        }
        public string PersonalIndex(string name)
        {
            List<Users> list = itestcores.UsersList(name);
            return Newtonsoft.Json.JsonConvert.SerializeObject(list);
        }

    }
}