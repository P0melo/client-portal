using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using MySql.Data.MySqlClient;
using SAMPortal.DTO;
using SAMPortal.Models;
using SAMPortal.Enum;

namespace SAMPortal.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AdministrationController : Controller
    {
        private officecadetprogramEntities _cadetContext;
        private dbidentityEntities _context;
        private Logging logging;
        private SendEmail mail;

        public AdministrationController()
        {
            _context = new dbidentityEntities();
            _cadetContext = new officecadetprogramEntities();
            logging = new Logging();
            mail = new SendEmail();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult RegisteredAccounts()
        {
            return View();
        }

        public ActionResult GetPartialOfReviewTransportationRequests()
        {
            return PartialView("_ReviewTransportationRequests");
        }

        public ActionResult GenerateLink()
        {
            _cadetContext = new officecadetprogramEntities();

            var result = _cadetContext.tbltpcompanies.Select(m => new Company { CompanyId = m.companyID, CompanyName = m.companyName }).ToList();

            var ListOfCompanies = new Companies
            {
                ListOfCompanies = result
            };

            return View(ListOfCompanies);
        }

        public ActionResult GetRegisteredAccountsForReview()
        {
            var result = _context.users.Where(m => m.LockoutEnabled == true && m.EmailConfirmed == true).Select(m => new ReviewAccounts { Email = m.Email, Name = m.FirstName + " " + m.LastName, Company = m.CompanyName, CompanyId = m.CompanyId }).ToList();

            var jsonResult = Json(new { data = result },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult ReviewAction(string email, int action)
        {
            var jsonStatus = (int)Status.Initialize;

            var user = User.Identity.Name;

            var guid = GetGUID(email);

            var firstName = _context.users.Where(m => m.Email == email).Select(m => m.FirstName).FirstOrDefault();

            if (ModelState.IsValid)
            {
                try
                {
                    if (action == 0)
                    {
                        _context.Database.ExecuteSqlCommand("UPDATE users SET LockoutEnabled = " + action + " WHERE email=@email",
                                new MySqlParameter("email", email));

                        _context.Database.ExecuteSqlCommand("INSERT INTO userroles(UserId, RoleId) VALUES (@userid, @roleid)",
                            new MySqlParameter("@userid", guid),
                            new MySqlParameter("@roleid", 1));

                        //smtp server
                        //WebMail.SmtpServer = "smtp.gmail.com";
                        //WebMail.SmtpServer = "mail.umtc.com.ph";
                        WebMail.SmtpServer = "172.16.16.11";
                        // port to send emails
                        WebMail.SmtpPort = 25;
                        //WebMail.SmtpUseDefaultCredentials = true;
                        //sending email with secure protocol
                        WebMail.EnableSsl = false;
                        // email id used to send emails from application
                        WebMail.UserName = "no-reply@umtc.com.ph";
                        WebMail.Password = "Norep6682";

                        // sender email address
                        WebMail.From = "no-reply@umtc.com.ph";

                        // send email
                        WebMail.Send(to: email, subject: "UMTC Client Portal Account Approved!", body:
                            //"Please confirm your account by clicking this <a href=\"" + callbackUrl + "\">link</a>", 
                            "Dear " + firstName + ", <br /><br />" +
                            "Your registration has been approved. <br /><br />" +
                            "You may now try and log in by clicking the link below: <br/><br />" +
                            "<a href='http://clientportal.umtc.com.ph/SAMPortal/Account/Login'>http://clientportal.umtc.com.ph/SAMPortal/Account/Login</a><br /><br />" +
                            "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                            "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged. " +
                            "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>"

                            , cc: "", bcc: "", isBodyHtml: true);

                        //For Logging
                        string[] logparameters = { "LockoutEnabled:" + action, "email:" + email, "INSERTED REGULAR USER:" + guid };
                        string data1 = logging.ConvertToLoggingParameter(logparameters);
                        logging.Log(user, "ReviewAction", data1);
                    }
                    else
                    {
                        _context.Database.ExecuteSqlCommand("DELETE FROM users WHERE email = @email",
                            new MySqlParameter("email", email));

                        string[] logparameters = { "DELETED NEW USER REQUEST", "email:" + email };
                        string data1 = logging.ConvertToLoggingParameter(logparameters);
                        logging.Log(user, "ReviewAction", data1);
                    }

                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "ReviewAction", e);
                }
            }

            var jsonResult = Json(new { jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult Partial(int id)
        {
            var user = User.Identity.Name;

            var data = id;

            var giud = Int2Guid(data);

            var ticks = DateTime.Now.Ticks;

            var result = new LinkModel
            {
                link = giud + "/" + ticks
            };

            //For Logging
            string[] logparameters = { "link:" + result.link };
            string data1 = logging.ConvertToLoggingParameter(logparameters);
            logging.Log(user, "GetLink", data1);

            return PartialView("_Link", result);
        }

        public ActionResult GetLink(Companies model)
        {

            var data = model.ListId;

            var giud = Int2Guid(data);

            var ticks = DateTime.Now.Ticks;

            var result = new LinkModel
            {
                link = giud + "/" + ticks
            };

            return PartialView("_Link", result);
        }

        public static Guid Int2Guid(int value)
        {
            byte[] bytes = new byte[16];
            BitConverter.GetBytes(value + 66826682).CopyTo(bytes, 4);
            return new Guid(bytes);
        }

        public ActionResult GetPartialOfGenerateLink()
        {
            var result = _cadetContext.tbltpcompanies.Select(m => new Company { CompanyId = m.companyID, CompanyName = m.companyName }).ToList();

            var ListOfCompanies = new Companies
            {
                ListOfCompanies = result
            };

            return PartialView("_GenerateLink", ListOfCompanies);
        }

        public ActionResult GetPartialOfReviewRegisteredAccounts()
        {

            return PartialView("_RegisteredAccounts");
        }

        public ActionResult GetPartialOfReviewNewCrewRequest()
        {
            return PartialView("_ReviewNewCrewRequest");
        }

        public ActionResult GetPartialOfOffSiteAccommodationRequest()
        {
            var result = _cadetContext.tbloff_site_status.Select(m => new OffSiteStatus { Id = m.Id, Name = m.Name }).ToList();

            var ListOfStatus = new OffSiteAccommodationStatusViewModel
            {
                Option = result
            };

            return PartialView("_ReviewOffSiteAccommodationRequests", ListOfStatus);
        }

        public ActionResult GetPartialOfReviewSpecialScheduleRequests()
        {
            return PartialView("_ReviewSpecialScheduleRequests");
        }

        public ActionResult GetImage(string imageName)
        {
            string imagePath = "../Pictures/" + imageName + ".jpeg";
            byte[] array = System.IO.File.ReadAllBytes(imagePath);
            var result = array;
            var jsonResult = Json(new { data = result },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        //[rank, lastName, firstName, middleInitial, birthday, birthplace, company, recordId];
        public ActionResult ApproveNewCrew(params string[] parameters)
        {
            string rank = parameters[0];
            string recordId = parameters[7];
            string lastName = parameters[1];
            string firstName = parameters[2];
            string middleInitial = parameters[3];
            string birthday = parameters[4].Split('T')[0];
            string birthplace = parameters[5];
            string company = parameters[6];

            var companyId = _cadetContext.tbltpcompanies.Where(m => m.companyName == company).Select(m => new { m.companyID }).FirstOrDefault();

            var mnno = _cadetContext.keygennoyears.Where(m => m.seqID == "TPSerial").Select(m => new { m.KeySequence }).FirstOrDefault();

            var tempId = _cadetContext.Database.SqlQuery<string>("SELECT MNNo FROM tblcrew c WHERE c.Rank = @rank AND LName = @lname AND FName = @fname AND " +
                "MName = @mname AND BDate = @bdate AND BPlace = @bplace AND Employer = @employer",
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@lname", lastName),
                        new MySqlParameter("@fname", firstName),
                        new MySqlParameter("@mname", middleInitial),
                        new MySqlParameter("@bdate", birthday),
                        new MySqlParameter("@bplace", birthplace),
                        new MySqlParameter("@employer", companyId.companyID)).FirstOrDefault();


            //var tempId = _cadetContext.Database.SqlQuery<string>("SELECT MNNo FROM tblcrew WHERE Rank = '" + rank + "' AND LName = '" + lastName + "' AND FName = '" + firstName + "' AND " +
            //    "MName = '" + middleInitial + "' AND BDate = '" + birthday + "' AND BPlace = '" + birthplace + "' AND Employer = '"+ companyId.companyID + "'").FirstOrDefault();

            var user = User.Identity.Name;

            var jsonStatus = (int)Status.Initialize;

            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tblcrew SET mnno = @NewMnno WHERE mnno = @TempMnno",
                        new MySqlParameter("@NewMnno", "TP0" + mnno.KeySequence),
                        new MySqlParameter("@TempMnno", tempId));

                    //For Logging
                    string[] logparameters = {"mnno:" + "TP0" + mnno.KeySequence, "rank:"+rank, "lname:" + lastName, "fname:"+firstName, "mname:"+middleInitial, "bdate:"+birthday, "bplace:"+birthplace,
                                              "employer:"+companyId.companyID};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "ApproveNewCrew", data);

                    _cadetContext.Database.ExecuteSqlCommand("UPDATE keygennoyear SET KeySequence = '" + (mnno.KeySequence + 1) + "' WHERE seqID = 'TPSerial'");
                    //For Logging
                    string[] logparameters2 = { "KeySequence:" + (mnno.KeySequence + 1) };
                    string data2 = logging.ConvertToLoggingParameter(logparameters2);
                    logging.Log(user, "KeySequenceChange", data2);

                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tblnewcrewrequest SET Status=@status, TimeOfApproval=@datetime, ProcessedBy=@user WHERE Id = @recordid",
                        new MySqlParameter("@recordid", recordId),
                        new MySqlParameter("@status", 2),
                        new MySqlParameter("@datetime", DateTime.Now),
                        new MySqlParameter("@user", user));

                    //Send Email Notif to requestor
                    mail.SendNotificationToClient(GetRequestor(Convert.ToInt32(recordId)), (int)Requests.NewCrewRequest, parameters, (int)ApprovalStatus.Aprroved);

                    jsonStatus = (int)Status.Success;

                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "ApproveNewCrew", e);
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult DenyNewCrew(int recordId, string tempMNNO)
        {
            var user = User.Identity.Name;
            int status = 0;
            var jsonStatus = (int)Status.Initialize;
            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tblnewcrewrequest SET Status=@status, TimeOfApproval=@datetime, ProcessedBy=@user WHERE Id = @recordid",
                        new MySqlParameter("@recordid", recordId),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@datetime", DateTime.Now),
                        new MySqlParameter("@user", user));

                    _cadetContext.Database.ExecuteSqlCommand("DELETE FROM tblcrew WHERE MNNO = @tempMNNO",
                        new MySqlParameter("@tempMNNO", tempMNNO));

                    //For Logging
                    string[] logparameters3 = { "recordId:" + recordId };
                    string data3 = logging.ConvertToLoggingParameter(logparameters3);
                    logging.Log(user, "DenyNewCrew", data3);

                    //Send Email Notif to requestor
                    var newCrewRequestDetails = _cadetContext.Database.SqlQuery<NewCrewRegistrationViewModel>("SELECT Position, LastName, FirstName, MiddleName, Birthday, Birthplace FROM tblnewcrewrequest WHERE Id = " + recordId).FirstOrDefault();
                    string[] parameters = { newCrewRequestDetails.Position, newCrewRequestDetails.LastName, newCrewRequestDetails.FirstName, newCrewRequestDetails.MiddleName,
                        newCrewRequestDetails.Birthday, newCrewRequestDetails.BirthPlace };
                    mail.SendNotificationToClient(GetRequestor(Convert.ToInt32(recordId)), (int)Requests.NewCrewRequest, parameters, (int)ApprovalStatus.Denied);

                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "DenyNewCrew", e);
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;

        }

        public ActionResult UpdateOffSiteStatusId(int statusId, int recordId, string adminRemarks)
        {
            var jsonStatus = (int)Status.Initialize;
            var user = User.Identity.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tbloff_site_reservation SET Status = '" + statusId + "', Remarks = '" + adminRemarks + "' WHERE Id = '" + recordId + "'");
                    //For Logging
                    string[] logparameters = { "statusId:" + statusId, "recordId:" + recordId, "remarks:" + adminRemarks };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "UpdateOffSiteStatusId", data);

                    int status = 0;

                    switch (statusId)
                    {
                        case 2: status = (int)ApprovalStatus.Arranged; break;
                        case 3: status = (int)ApprovalStatus.Billed; break;
                        case 4: status = (int)ApprovalStatus.Paid; break;
                        case 5: status = (int)ApprovalStatus.PersonalAccount; break;
                        case 6: status = (int)ApprovalStatus.Cancelled; break;
                        default: break;
                    }

                    var requestor = _cadetContext.Database.SqlQuery<string>("SELECT ReservationBy FROM tbloff_site_reservation WHERE Id = " + recordId).FirstOrDefault();

                    var offSiteAccommodationRequestParameters = _cadetContext.Database.SqlQuery<OffSiteAccommodationViewModel>("SELECT * FROM tblnewcrewrequest WHERE Id = " + recordId).FirstOrDefault();
                    string[] parameters = offSiteAccommodationRequestParameters.ToArray();
                    mail.SendNotificationToClient(requestor, (int)Requests.OffSiteAccommodationRequest, parameters, status);


                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "UpdateOffSiteStatusId", e);
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult CompleteTransportationRequest(int recordId)
        {
            var jsonStatus = (int)Status.Initialize;
            var user = User.Identity.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tbltransportation SET Status = 'Booked' WHERE Id = '" + recordId + "'");

                    //For Logging
                    string[] logparameters = { "recordId:" + recordId, "status:Booked" };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "CompleteTransportationRequest", data);

                    //send email notification to client
                    var requestDetail = _cadetContext.Database.SqlQuery<TransportationRequestModel>("SELECT MNNO, Rank, FirstName, LastName, Type, Vehicle, DateBooked, Notes, RequestedBy " +
                        "FROM tbltransportation WHERE Id = " + recordId).FirstOrDefault();

                    string[] parameters = requestDetail.ToArray();

                    mail.SendNotificationToClient(requestDetail.RequestedBy, (int)Requests.TransportationRequest, parameters, (int)ApprovalStatus.Booked);

                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    var exception = Json(new { data = e.Message },
                  JsonRequestBehavior.AllowGet);

                    return exception;
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult DenySpecialSchedule(int recordId)
        {
            var jsonStatus = (int)Status.Initialize;

            var user = User.Identity.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tblspecialcourserequests SET Status = 'Denied' WHERE Id = @id",
                        new MySqlParameter("@id", recordId));

                    //For Logging
                    string[] logparameters = { "status: Denied", "id:" + recordId };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "DenySpecialSchedule", data);

                    //send email notification to client
                    var requestDetail = _cadetContext.Database.SqlQuery<SpecialCourseRequest>("SELECT CourseName, StartDate, NumberOfParticipants, Notes, DateRequested FROM tblspecialcourserequests WHERE Id = " + recordId).FirstOrDefault();
                    var formatStartDate = requestDetail.StartDate.ToString("MM/dd/yyyy");
                    var formatDateRequested = requestDetail.DateRequested.ToString("MM/dd/yyyy");
                    string[] parameters = { requestDetail.CourseName, formatStartDate, requestDetail.NumberOfParticipants.ToString(), requestDetail.Notes, formatDateRequested, requestDetail.RequestedBy };
                    mail.SendNotificationToClient(requestDetail.RequestedBy, (int)Requests.SpecialScheduleRequest, parameters, (int)ApprovalStatus.Denied);

                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    var exception = Json(new { data = e.Message },
                  JsonRequestBehavior.AllowGet);

                    return exception;
                }

            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult ApproveSpecialSchedule(int recordId, string rate)
        {
            var jsonStatus = (int)Status.Initialize;

            var user = User.Identity.Name;
            var flag = 0;
            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tblspecialcourserequests SET Status = 'Approved', Rate = '" + rate + "' WHERE Id = @id",
                        new MySqlParameter("@id", recordId));

                    //For Logging
                    string[] logparameters = { "status: Approved", "id:" + recordId, "rate:" + rate };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "ApproveSpecialSchedule", data);

                    //send notification to client
                    var requestDetail = _cadetContext.Database.SqlQuery<SpecialCourseRequest>("SELECT CourseName, StartDate, NumberOfParticipants, Notes, DateRequested, RequestedBy FROM tblspecialcourserequests WHERE Id = " + recordId).FirstOrDefault();
                    var formatStartDate = requestDetail.StartDate.ToString("MM/dd/yyyy");
                    var formatDateRequested = requestDetail.DateRequested.ToString("MM/dd/yyyy");
                    string[] parameters = { requestDetail.CourseName, formatStartDate, requestDetail.NumberOfParticipants.ToString(), requestDetail.Notes, formatDateRequested, requestDetail.RequestedBy };
                    mail.SendNotificationToClient(requestDetail.RequestedBy, (int)Requests.SpecialScheduleRequest, parameters, (int)ApprovalStatus.Aprroved);

                    jsonStatus = (int)Status.Success;
                    flag = 1;
                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "ApproveSpecialSchedule", e);
                }

            }

            var jsonResult = Json(new { data = flag },
                JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public string GetGUID(string email)
        {

            var guid = "";

            guid = _context.users.Where(m => m.Email == email).Select(m => m.Id).FirstOrDefault();

            return guid;
        }

        public string GetRequestor(int recordId)
        {
            return _cadetContext.Database.SqlQuery<string>("SELECT EnteredBy FROM tblnewcrewrequest WHERE Id = " + recordId).FirstOrDefault();
        }

        public ActionResult SaveDormFees(int dormStandard, int dormSuperior, int hotelDouble, int hotelSingle, int executiveRoom)
        {
            var jsonStatus = (int)Status.Initialize;

            var user = User.Identity.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _cadetContext.Database.ExecuteSqlCommand("UPDATE tbldorm_fees tdf1 JOIN tbldorm_fees tdf2 JOIN tbldorm_fees tdf3 JOIN tbldorm_fees tdf4 JOIN tbldorm_fees tdf5 " +
                                                        "ON tdf1.dorm_fee_id = '1' AND tdf2.dorm_fee_id = '2' AND tdf3.dorm_fee_id = '3' AND tdf4.dorm_fee_id = '4' AND tdf5.dorm_fee_id = '5' " +
                                                       "SET tdf1.price = @dormstandard, tdf2.price = @dormsuperior, tdf3.price = @hoteldouble, tdf4.price = @hotelsingle, tdf5.price = @executiveroom",
                        new MySqlParameter("@dormstandard", dormStandard),
                        new MySqlParameter("@dormsuperior", dormSuperior),
                        new MySqlParameter("@hoteldouble", hotelDouble),
                        new MySqlParameter("@hotelsingle", hotelSingle),
                        new MySqlParameter("@executiveroom", executiveRoom));

                    //For Logging
                    string[] logparameters = { "dormStandard:" + dormStandard, "dormSuperior:" + dormSuperior, "hotelDouble:" + hotelDouble, "hotelSingle:" + hotelSingle, "executiveRoom:" + executiveRoom };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveDormFees", data);

                    jsonStatus = (int)Status.Success;

                }
                catch (Exception e)
                {
                    var exception = Json(new { data = e.Message },
                  JsonRequestBehavior.AllowGet);

                    return exception;
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                  JsonRequestBehavior.AllowGet);

            return jsonResult;
        }


    }

}