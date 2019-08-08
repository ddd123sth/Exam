using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Exam.Back.Model;
namespace Exam.Back.IRespository.Personal
{
    public interface IPersonalRespository
    {
        /// <summary>
        /// 登录信息显示
        /// </summary>
        /// <returns></returns>
        List<Users> UsersList(string name);
    }
}
