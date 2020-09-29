using MySql.Data.MySqlClient;
using SAMPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SAMPortal.Controllers
{
    [Authorize]
    public class CourseBookingController : Controller
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;
        private Logging logging;
        private SendEmail sendEmail;

        public CourseBookingController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
            logging = new Logging();
            sendEmail = new SendEmail();
        }

        public ActionResult CourseList()
        {
            return View();
        }

        public ActionResult UnenrollThisCrew(params string[] parameters)
        {
            int flag = 0;

            var user = User.Identity.Name;

            int schedId = Convert.ToInt32(parameters[0]);
            string mnno = parameters[1];

            try
            {
                if (ModelState.IsValid)
                {
                    _context.Database.ExecuteSqlCommand("DELETE FROM tblscheddata WHERE SchedId = " + schedId + " AND MNNo = '" + mnno + "'");

                    //for logging
                    string[] logparameters = { "schedid:"+parameters[0], "|mnno:" + parameters[1]};
                    string logdata = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "UnenrollThisCrew", logdata);

                    sendEmail.Send(User.Identity, (int)Enum.Requests.UnenrollThisCrew, "schedid:" + parameters[0] + "|mnno:" + parameters[1]);
                }
            }
            catch (Exception e)
            {
                flag = logging.LogError(user, "UnenrollThisCrew", e);
            }

            var jsonResult = Json(new { data = flag },
                 JsonRequestBehavior.AllowGet);

            return jsonResult;

        }

        public ActionResult EnrollThisCrew(params string[] parameters /*string mnno, string rank, string schedId, string action*/ )
        {
            int flag = 0;

            var user = User.Identity.Name;

            var userDetail = _usercontext.users.Where(m => m.Email == user).Select(m => new { m.CompanyId, m.CompanyName, m.Id }).FirstOrDefault();

            int groupId = 0;

            if (userDetail.CompanyName.ToString().Contains("TEEKAY") || userDetail.CompanyName.ToString().Contains("Teekay") || userDetail.CompanyName.ToString().Contains("TeeKay"))
            {
                groupId = 31;
            }
            else
            {
                groupId = 30;
            }

            var data = _context.Database.SqlQuery<CourseEnrollees>("select sd.MNNO, c.`Rank`, c.LName, c.FName, c.MName, c.ContactNo as Contact, c.Employer from tblscheddata sd " +
                "join tblcrew c on sd.MNNo = c.MNNo where SchedID = " + parameters[0] + " and c.MNNo = '" + parameters[1] + "'").ToList();

            if (data.Count == 0) //check if crew is already enrolled 
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        if (parameters.Length == 3) //Enroll
                        {
                            _context.Database.ExecuteSqlCommand("INSERT INTO tblscheddata (SchedId, MNNo, GroupId, Scheduler_no, DateScheduled, Employer, BatchNo, CrewRank)" +
                                                        " VALUE(@schedid, @mnno, @groupid, @schedulerno, @datescheduled, @employer, @batchno, @crewrank)",
                                                        new MySqlParameter("@schedid", parameters[0]),
                                                        new MySqlParameter("@mnno", parameters[1]),
                                                        new MySqlParameter("@groupid", groupId),
                                                        new MySqlParameter("@schedulerno", userDetail.Id),
                                                        new MySqlParameter("@datescheduled", DateTime.Now),
                                                        new MySqlParameter("@employer", userDetail.CompanyId),
                                                        new MySqlParameter("@batchno", 141),
                                                        new MySqlParameter("@crewrank", parameters[2])); //always 141 because external

                            //for logging
                            string[] logparameters = { "schedid:"+parameters[0], "mnno:"+parameters[1], "groupid:"+groupId, "schedulerno:" + userDetail.Id, "datescheduled:" + DateTime.Now,
                                                "employer:" + userDetail.CompanyId, "batchno:" + 141, "crewrank:" + parameters[2] };
                            string logdata = logging.ConvertToLoggingParameter(logparameters);
                            logging.Log(user, "EnrollThisCrew", logdata);

                            sendEmail.Send(User.Identity, (int)Enum.Requests.EnrollCrew, "schedid:" + parameters[0] + "|mnno:" + parameters[1] + "|groupid:" + groupId + "|employer:" + userDetail.CompanyId + "|batchno:" + 141 + "|crewrank:" + parameters[2]);

                        }
                        else if (parameters.Length > 3) //Swap
                        {
                            _context.Database.ExecuteSqlCommand("UPDATE tblscheddata SET MNNo = @mnno, DateScheduled = @datescheduled, CrewRank = @crewrank " +
                                "WHERE MNNo = @mnnoforswap and CrewRank = @rankforswap and SchedId = @schedid",
                                new MySqlParameter("@schedid", parameters[0]),
                                new MySqlParameter("@mnno", parameters[1]),
                                new MySqlParameter("@crewrank", parameters[2]),
                                new MySqlParameter("@mnnoforswap", parameters[3]),
                                new MySqlParameter("@rankforswap", parameters[4]),
                                new MySqlParameter("@datescheduled", DateTime.Now));

                            //for logging
                            string[] logparameters = { "schedid:" + parameters[0], "mnno:" + parameters[1], "crewrank:" + parameters[2], "mnnoforswap:" + parameters[3], "rankforswap:" + parameters[4],
                                               "datescheduled:" + DateTime.Now };
                            string logdata = logging.ConvertToLoggingParameter(logparameters);
                            logging.Log(user, "EnrollThisCrew", logdata);

                            sendEmail.Send(User.Identity, (int)Enum.Requests.SwapEnrolledCrew, "schedid:" + parameters[0] + "|mnno:" + parameters[1] + "|crewrank:" + parameters[2] + "|mnnoforswap:" + parameters[3] + "|rankforswap:" + parameters[4]);
                        }
                        flag = 1;
                    }
                    catch (Exception e)
                    {
                        flag = logging.LogError(user, "EnrollThisCrew", e);
                    }

                }
            }

            var jsonResult = Json(new { data = flag },
                             JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveSpecialRequest(params string[] parameters)
        {
            //parameters[0] = courseName;
            //parameters[1] = startDate;
            //parameters[2] = numberOfParticipants;
            //parameters[3] = notes;

            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            int flag = 0;

            string courseName = parameters[0];
            DateTime startDate = DateTime.ParseExact(parameters[1], "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
            //DateTime startDate = Convert.ToDateTime(parameters[1]);
            int numberOfParticipants = Convert.ToInt32(parameters[2]);
            string notes = parameters[3];
            string status = "In Process";
            JsonResult jsonResult = new JsonResult();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("INSERT INTO tblspecialcourserequests (CourseName, StartDate, NumberOfParticipants, Notes, DateRequested, RequestedBy, Status, CompanyId) " +
                        "VALUES (@coursename, @startdate, @numberofparticipants, @notes, @daterequested, @requestedby, @status ,@company)",
                        new MySqlParameter("@coursename", courseName),
                        new MySqlParameter("@startdate", startDate),
                        new MySqlParameter("@numberofparticipants", numberOfParticipants),
                        new MySqlParameter("@notes", notes),
                        new MySqlParameter("@daterequested", DateTime.Now),
                        new MySqlParameter("@requestedby", user),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@company", company)
                       );

                    //for logging
                    string[] logparameters = { "coursename:" + courseName, "startdate:" + startDate, "numberofparticipants:" + numberOfParticipants, "notes:" + notes, "daterequested:" + DateTime.Now,
                                               "status:" + status };
                    string logdata = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveSpecialRequest", logdata);

                    sendEmail.Send(User.Identity, (int)Enum.Requests.SpecialScheduleRequest, "");

                    flag = 1;
                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "SaveNewCrew", e);
                }
            }
            jsonResult = Json(new { data = flag },
                             JsonRequestBehavior.AllowGet);

            return jsonResult;
        }
    }
}