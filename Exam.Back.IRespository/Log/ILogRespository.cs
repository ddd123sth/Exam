using Exam.Back.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Exam.Back.IRespository.Log
{
    public interface ILogRespository
    {
        /// <summary>
        /// 添加日志
        /// </summary>
        /// <param name="UserId">用户ID</param>
        /// <param name="Operate">执行操作</param>
        /// <param name="State">操作结果</param>
        /// <returns></returns>
        int Add(int UserId, string Operate, int State);
        /// <summary>
        /// 分页显示
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        PageList GetLog(int UserId,int pageindex,int pagesize);
        /// <summary>
        /// 分页显示
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        Pageing<List<Journal>> GetList(string UserName, int pageindex, int pagesize);
    }
}
