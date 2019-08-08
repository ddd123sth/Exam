using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Exam.Back.Model;
using Exam.Back.Common;
using Exam.Back.IRespository.Personal;
namespace Exam.Back.Respository
{
   public class PersonalRespository:IPersonalRespository
    {
        static string strSql = ConfigurationManager.AppSettings["group"].ToString();

        public List<Users> UsersList(string name)
        {
            List<Users> TestList = DapperHelper.GetList<Users>("SELECT * From users where AccountName='"+name+"'");
            return TestList;
        }

    }
}
