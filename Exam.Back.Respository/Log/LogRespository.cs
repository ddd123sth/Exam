using Exam.Back.IRespository.Log;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Exam.Back.Model;

namespace Exam.Back.Respository.Log
{
    public class LogResultpository : ILogRespository
    {
        string mysqlConnectionStr = ConfigurationManager.ConnectionStrings["group5"].ToString();
        /// <summary>
        /// 添加日志
        /// </summary>
        /// <param name="UserId">用户ID</param>
        /// <param name="Operate">执行操作</param>
        /// <param name="State">操作结果</param>
        /// <returns></returns>
        public int Add(int UserId, string Operate, int State)
        {
            using (IDbConnection conn = new MySqlConnection(mysqlConnectionStr))
            {
                string sql = string.Format("insert  into Journal(UserId,Operate,OpreateResult,OperateTime) values({0},'{1}',{2},default)", UserId, Operate, State);
                return conn.Execute(sql);
            }
        }
        /// <summary>
        /// 分页显示
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public Pageing<List<Journal>> GetList(string UserName, int pageindex, int pagesize)
        {
            Pageing<List<Journal>> list = new Pageing<List<Journal>>();
            int index = (pageindex - 1) * pagesize;
            string sql = $"select a.*,b.AccountName from Journal a inner join users b on a.UserId=b.Id where 1=1";
            string sqlcount = $"select * from Journal a inner join users b on a.UserId=b.Id where 1=1";
            if (!string.IsNullOrEmpty(UserName))
            {
                sql += " and b.AccountName=@UserName ORDER BY a.operatetime DESC  limit @index,@pagesize";
                sqlcount += " and b.AccountName=@UserName";
            }
            else
            {
                sql += " ORDER BY a.operatetime DESC  limit @index,@pagesize";
            }
            using (IDbConnection conn = new MySqlConnection(mysqlConnectionStr))
            {
                list.Data = conn.Query<Journal>(sql, new { UserName = UserName, index = index, pagesize = pagesize }).ToList();
                list.Count = conn.Query<Journal>(sqlcount, new { UserName = UserName }).ToList().Count();
            }
            return list;
        }

        /// <summary>
        /// 分页显示
        /// </summary>
        /// <param name="UserId">用户ID</param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public PageList GetLog(int UserId, int pageindex, int pagesize)
        {
            using (IDbConnection conn = new MySqlConnection(mysqlConnectionStr))
            {
                PageList pa = new PageList();
                DynamicParameters parm = new DynamicParameters();
                parm.Add("@UserId", UserId);
                parm.Add("@pageindex", pageindex);
                parm.Add("@pagesize", pagesize);
                parm.Add("@count", null, DbType.Int32, ParameterDirection.Output);
                //pa.list = conn.Query<Journal>($"LogList", parm, commandType: CommandType.StoredProcedure).ToList();
                pa.list = conn.Query<Journal>("LogList", parm, null, true, null, CommandType.StoredProcedure).ToList();
                

                int count = parm.Get<int>("count");
                pa.Count = count;
                return pa;
            }
        }
    }
}
