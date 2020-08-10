using MySql.Data.MySqlClient;
using System;
using System.Web.Mvc;
using SAMPortal.Models;

namespace SAMPortal
{
    public class Logging : Controller
    {
        private officecadetprogramEntities _context;
        public Logging()
        {
            _context = new officecadetprogramEntities();
        }

        public string ConvertToLoggingParameter(string[] data)
        {
            string convertedData = "";

            for (var i = 0; i <= data.Length; i++)
            {
                if (i == data.Length)
                {
                    return convertedData;
                }
                else
                {
                    convertedData += data[i] + "|";
                }
            }

            return "";
        }

        public void Log(string user, string logEvent, string data)
        {
            try
            {
                _context.Database.ExecuteSqlCommand("INSERT INTO tblsamportallogs(Event, Description, User, Timestamp) VALUES(@event, @description, @user, @timestamp)",
                                new MySqlParameter("event", logEvent),
                                new MySqlParameter("description", data),
                                new MySqlParameter("user", user),
                                new MySqlParameter("timestamp", DateTime.Now)
                            );

            }
            catch (Exception e)
            {

            }
        }

        public int LogError(string user, string logEvent, Exception e)
        {
            string data = "Message: " + e.Message + "| InnerException: " + e.InnerException.Message;

            var logError = new tblsamportallog()
            {
                Description = data,
                Event = logEvent,
                User = user,
                Timestamp = DateTime.Now
            };

            _context.tblsamportallogs.Add(logError);
            _context.SaveChanges();

            //_context.Database.ExecuteSqlCommand("INSERT INTO tblsamportallogs(Event, Description, User, Timestamp) VALUES(@event, @description, @user, @timestamp)",
            //    new MySqlParameter("event", logError.Event),
            //    new MySqlParameter("description", logError.Description),
            //    new MySqlParameter("user", logError.User),
            //    new MySqlParameter("timestamp", logError.Timestamp)
            //);

            int logId = logError.LogId;

            return logId;
        }

    }
}