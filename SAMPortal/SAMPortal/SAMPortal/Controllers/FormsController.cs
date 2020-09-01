using MySql.Data.MySqlClient;
using SAMPortal.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using SAMPortal.Enum;
using System.Web.Helpers;
using System.Security.Principal;
using System.Runtime.InteropServices;
using System.Web.Script.Serialization;
using Org.BouncyCastle.Crypto.Tls;
using Org.BouncyCastle.Asn1.Mozilla;
using Newtonsoft.Json;

namespace SAMPortal.Controllers
{
    [Authorize]
    public class FormsController : Controller
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;
        private Logging logging;
        private SendEmail sendEmail;

        public FormsController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
            logging = new Logging();
            sendEmail = new SendEmail();
        }

        public ActionResult Requests()
        {
            return View();
        }

        public ActionResult NewCrewRegistration()
        {
            var nations = _context.tblcountries.Select(m => new Nation { Name = m.name, Iso3 = m.iso3 }).ToList();

            var ranks = _context.tblranks.Select(m => new Rank { CrewRank = m.rank, Description = m.description, RankDesc = string.Concat(m.rank, " - ", m.description) }).ToList();

            IEnumerable<Nation> nationList = nations;
            IEnumerable<Rank> ranksList = ranks;

            NewCrewRegistrationViewModel ncrvm = new NewCrewRegistrationViewModel()
            {
                Nations = nationList,
                Ranks = ranksList
            };

            return View(ncrvm);
        }

        public ActionResult Meals()
        {
            return View();
        }

        public ActionResult OnSiteAccommodation()
        {
            return View();
        }

        public ActionResult OnSiteAccommodationExt()
        {
            return View();
        }

        public ActionResult OffSiteAccommodation()
        {
            return View();
        }

        public ActionResult OffSiteAccommodationExt()
        {
            return View();
        }

        public ActionResult Transportation()
        {
            return View();
        }

        public ActionResult CompanyProfile()
        {
            return View();
        }

        public ActionResult Certificates()
        {
            return View();
        }

        public ActionResult CustomerFeedback()
        {
            return View();
        }

        //public ActionResult SendCustomerFeedback()
        //{

        //}

        public ActionResult SendRequestEmailBatch(string[] mnnos)
        {
            var flag = 0;
            var user = GetUser();

            if (ModelState.IsValid)
            {
                try
                {
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

                    //WebMail.UserName = "markkevinboy@gmail.com";

                    // sender email address
                    WebMail.From = User.Identity.Name;

                    // send email
                    WebMail.Send(to: "markkevin.boy@umtc.com.ph", subject: "Certificate Request - " + string.Join(",", mnnos), body:
                        //"Please confirm your account by clicking this <a href=\"" + callbackUrl + "\">link</a>", 
                        "Dear Sir or Madam, <br /><br />" +
                        "Please click the following link to confirm your account:<br /><br />" +
                        "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                        "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged. " +
                        "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>"

                        , cc: "", bcc: "", isBodyHtml: true);

                    _context.Database.ExecuteSqlCommand("INSERT INTO tblcertificaterequests (Email, Description, DateOfRequest) VALUE (@email, @description, @dateOfRequest)",
                        new MySqlParameter("email", user),
                        new MySqlParameter("description", "Requested certificate for - " + mnnos),
                        new MySqlParameter("dateOfRequest", DateTime.Now)
                     );

                    //For Logging
                    string[] parameters = { "email:" + user, "description: Requested certificate for - " + mnnos, "dateOfRequest: " + DateTime.Now };
                    string data = logging.ConvertToLoggingParameter(parameters);
                    logging.Log(user, "SendRequestEmail", data);

                    flag = 1;
                }
                catch (Exception e)
                {
                    //add exception handling
                    flag = logging.LogError(user, "SendRequestEmail", e);
                }

            }

            var jsonResult = Json(new { data = flag },
                             JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SendRequestEmail(string mnno)
        {
            var flag = 0;
            var user = GetUser();

            if (ModelState.IsValid)
            {
                try
                {
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

                    //WebMail.UserName = "markkevinboy@gmail.com";

                    // sender email address
                    WebMail.From = User.Identity.Name;

                    // send email
                    WebMail.Send(to: "markkevin.boy@umtc.com.ph", subject: "Certificate Request - " + mnno, body:
                        //"Please confirm your account by clicking this <a href=\"" + callbackUrl + "\">link</a>", 
                        "Dear Sir or Madam, <br /><br />" +
                        "Please click the following link to confirm your account:<br /><br />" +
                        "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                        "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged. " +
                        "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>"

                        , cc: "", bcc: "", isBodyHtml: true);

                    _context.Database.ExecuteSqlCommand("INSERT INTO tblcertificaterequests (Email, Description, DateOfRequest) VALUE (@email, @description, @dateOfRequest)",
                        new MySqlParameter("email", user),
                        new MySqlParameter("description", "Requested certificate for - " + mnno),
                        new MySqlParameter("dateOfRequest", DateTime.Now)
                     );

                    //For Logging
                    string[] parameters = { "email:" + user, "description: Requested certificate for - " + mnno, "dateOfRequest: " + DateTime.Now };
                    string data = logging.ConvertToLoggingParameter(parameters);
                    logging.Log(user, "SendRequestEmail", data);

                    flag = 1;
                }
                catch (Exception e)
                {
                    //add exception handling
                    flag = logging.LogError(user, "SendRequestEmail", e);
                }

            }

            var jsonResult = Json(new { data = flag },
                             JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult ContactUs()
        {
            return View();
        }

        // GET: Dashboard
        public ActionResult Index(DashboardMessageId? message, int? days)
        {
            ViewBag.StatusMessage =
                message == DashboardMessageId.RequestSuccessful ? "Request Successful"
                : "";

            return View();
        }

        public ActionResult GetPartialOfOffSiteAccommodation()
        {
            return PartialView("_OffSiteAccommodation");
        }

        public ActionResult GetPartialOfTransportationSingle()
        {
            return PartialView("_Transportation");
        }

        public ActionResult SaveNewCrew(string firstName, string position, string lastName, string middleName, string datepicker, string birthPlace, string inputFile)
        {
            //JsonResult inHouseBookingResponse = new JsonResult();
            //JsonResult transportationResponse = new JsonResult();
            //JsonResult mealsResponse = new JsonResult();
            //JsonResult outHouseBookingResponse = new JsonResult();

            var byteArr = new object();
            DateTime dateValue = new DateTime();
            int flag = 0;

            if (inputFile != "")
            {
                byte[] bytes = Convert.FromBase64String(inputFile.Split(',')[1]);
                byteArr = bytes;
            }
            else
            {
                byteArr = null;
            }

            var user = GetUser();

            var company = GetCompanyId(user);

            try
            {
                dateValue = DateTime.ParseExact(datepicker, "MM/dd/yyyy", System.Globalization.CultureInfo.InvariantCulture);
            }
            catch (Exception e)
            {
                flag = logging.LogError(user, "SaveNewCrew", e);

                return Json(new { status = "Error", logId = flag },
                 JsonRequestBehavior.AllowGet); ;
            }

            var tempId = _context.keygennoyears.Where(m => m.seqID == "TempId").Select(m => new { m.KeySequence }).FirstOrDefault();

            if (!middleName.Equals(""))
            {
                middleName = middleName.Substring(0, 1);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("INSERT INTO tblnewcrewrequest (Position, FirstName, LastName, MiddleName, Birthday, BirthPlace, Company, EnteredBy, Picture, Status, MNNO) " +
                                                        "VALUES(@position, @firstname, @lastname, @middlename, @birthday, @birthplace, @company, @enteredby, @picture, @status, @mnno)",
                        new MySqlParameter("position", position),
                        new MySqlParameter("firstname", firstName),
                        new MySqlParameter("lastname", lastName),
                        new MySqlParameter("middlename", middleName),
                        new MySqlParameter("birthday", dateValue.Date),
                        new MySqlParameter("birthplace", birthPlace),
                        new MySqlParameter("company", company),
                        new MySqlParameter("enteredby", user),
                        new MySqlParameter("picture", byteArr),
                        new MySqlParameter("status", "1"),
                        new MySqlParameter("mnno", "Temp" + tempId.KeySequence)
                     );


                    //For Logging
                    string[] parameters = { "rank:" + position, "firstname:" + firstName, "lastname:" + lastName, "middlename:" + middleName,
                        "birthdate:" + dateValue.Date.ToString(), "birthplace:" + birthPlace, "companyid:" + company, "timeinserted:" + DateTime.Now };
                    string data = logging.ConvertToLoggingParameter(parameters);
                    logging.Log(user, "SaveNewCrew", data);

                    _context.Database.ExecuteSqlCommand("INSERT INTO tblcrew (MNNO, `Rank`, LName, FName, MName, BDate, BPlace, Employer, Accounted)" +
                        "VALUE (@mnno, @rank, @lname, @fname, @mname, @bdate, @bplace, @employer, @accounted)",
                        new MySqlParameter("@mnno", "Temp" + tempId.KeySequence),
                        new MySqlParameter("@rank", position),
                        new MySqlParameter("@lname", lastName),
                        new MySqlParameter("@fname", firstName),
                        new MySqlParameter("@mname", middleName),
                        new MySqlParameter("@bdate", dateValue.Date),
                        new MySqlParameter("@bplace", birthPlace),
                        new MySqlParameter("@employer", company),
                        new MySqlParameter("@accounted", 0)
                     );

                    //For Logging
                    string[] logparameters = { "mnno:" + "Temp" + tempId.KeySequence, "rank:" + position, "lname:" + lastName, "fname:" + firstName, "mname:" + middleName, "bdate:" + dateValue.Date, "bplace:" + birthPlace, "employer:" + company };
                    string data2 = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveNewCrew", data2);

                    _context.Database.ExecuteSqlCommand("UPDATE keygennoyear SET KeySequence = '" + (tempId.KeySequence + 1) + "' WHERE seqID = 'TempId'");
                    //For Logging
                    string[] logparameters2 = { "KeySequence:" + (tempId.KeySequence + 1) };
                    string data3 = logging.ConvertToLoggingParameter(logparameters2);
                    logging.Log(user, "KeySequenceChange", data3);

                    //For Email Notif
                    //sendEmail.Send(User.Identity, (int)Enum.Requests.NewCrewRequest, "");

                    //flag = 1;
                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "SaveNewCrew", e);

                    return Json(new { status = "Error", logId = flag },
                             JsonRequestBehavior.AllowGet);
                }
            }
            /*
             * Add a code that will handle invalid ModelState correctly
             */

            //string[] ihbp, string[] tap, string[] map, string[] ohbp

            //string[] myParameters = new string[1];
            //myParameters[0] = "Temp" + tempId.KeySequence.ToString();

            //if (ihbp != null)
            //{
            //    string[] combined = myParameters.Concat(ihbp).ToArray();

            //    inHouseBookingResponse = (JsonResult)SaveAccomodation(combined);

            //}

            //if (tap != null)
            //{
            //    string[] combined = myParameters.Concat(tap).ToArray();

            //    transportationResponse = (JsonResult)SaveTransportation(combined);

            //}

            //if (map != null)
            //{
            //    string[] combined = myParameters.Concat(map).ToArray();

            //    mealsResponse = (JsonResult)SaveMealProvision(combined);
            //}

            //if (ohbp != null)
            //{
            //    string[] combined = myParameters.Concat(ohbp).ToArray();

            //    outHouseBookingResponse = (JsonResult)SaveOffSiteAccomodation(combined);
            //}

            return Json(new { status = "Success", tempId = tempId.KeySequence },
                             JsonRequestBehavior.AllowGet);
        }

        //mnno, rank, name, date, reason, breakfast_cb, am_snack_cb, lunch_cb, pm_snack_cb, dinner_cb
        public ActionResult SaveMealProvision(params string[] parameters)
        {
            //reference number should be marlow number

            var user = GetUser();

            string mnno = parameters[0];
            string rank = parameters[1];
            string name = parameters[2];
            string date = parameters[3];
            string reason = parameters[4];
            bool breakfast_cb = parameters[5] == "true";
            bool am_snack_cb = parameters[6] == "true";
            bool lunch_cb = parameters[7] == "true";
            bool pm_snack_cb = parameters[8] == "true";
            bool dinner_cb = parameters[9] == "true";

            var guid = GetGuid(user);

            string[] dateSplit = date.Split('-');

            DateTime dateFrom = DateTime.ParseExact(dateSplit[0].Trim(), "M/dd/yyyy", CultureInfo.GetCultureInfo("en-PH"));
            DateTime dateTo = DateTime.ParseExact(dateSplit[1].Trim(), "M/dd/yyyy", CultureInfo.GetCultureInfo("en-PH"));

            //string vDateFrom = dateFrom.ToString("yyyy-MM-dd");


            var duration = (dateTo - dateFrom).TotalDays + 1;
            var reference_id = mnno + "" + DateTime.Now.ToString("yyMMddHHmmssff");

            int flag = 0;

            if (ModelState.IsValid)
            {
                try
                {
                    for (var i = 0; i < duration; i++)
                    {

                        string vDateFrom = dateFrom.ToString("yyyy-MM-dd");
                        string mealDateAssigned = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + " " + DateTime.Now.Hour +
                                    ":" + DateTime.Now.Minute + ":" + DateTime.Now.Second;

                        _context.Database.ExecuteSqlCommand("INSERT INTO tblmeal_provision (MNNO, meal_group, meal_b, meal_l, meal_d, meal_ms, meal_as, meal_date_from, meal_date_to, " +
                            "meal_reason, meal_assigned_by, meal_date_assigned, reference_id)" +
                                    "VALUE (@mnno, @meal_group, @meal_b, @meal_l, @meal_d, @meal_ms, @meal_as, @meal_date_from, " +
                                    "@meal_date_to, @meal_reason, @meal_assigned_by, @meal_date_assigned, @reference_id)",
                                    new MySqlParameter("@mnno", mnno),
                                    new MySqlParameter("@meal_group", 4),
                                    new MySqlParameter("@meal_b", breakfast_cb),
                                    new MySqlParameter("@meal_l", lunch_cb),
                                    new MySqlParameter("@meal_d", dinner_cb),
                                    new MySqlParameter("@meal_ms", am_snack_cb),
                                    new MySqlParameter("@meal_as", pm_snack_cb),
                                    new MySqlParameter("@meal_date_from", vDateFrom),
                                    new MySqlParameter("@meal_date_to", vDateFrom),
                                    new MySqlParameter("@meal_reason", reason),
                                    new MySqlParameter("@meal_assigned_by", guid),
                                    new MySqlParameter("@meal_date_assigned", mealDateAssigned),
                                    new MySqlParameter("@reference_id", reference_id));

                        dateFrom = dateFrom.AddDays(1);

                        //for logging
                        string[] logparameters = { "mnno:" + mnno, "mealgroup:" + 4, "meal_b:" + breakfast_cb, "meal_l:" + lunch_cb, "meal_d:" + dinner_cb, "meal_ms:" + am_snack_cb,
                                    "meal_as:" + pm_snack_cb, "meal_date_from:" + vDateFrom, "meal_date_to:" + vDateFrom, "meal_reason:" + reason, "meal_assigned_by:" + guid,
                                    "meal_Date_assigned:" + mealDateAssigned, "reference_id:" + reference_id};
                        string data = logging.ConvertToLoggingParameter(logparameters);
                        logging.Log(user, "SaveMealProvision", data);

                    }

                    sendEmail.Send(User.Identity, (int)Enum.Requests.MealProvision, "date:" + date + "|breakfast:" + breakfast_cb + "|amsnack:" + am_snack_cb + "|lunch:" + lunch_cb + "|pmsnack:" + pm_snack_cb + "|dinner:" + dinner_cb + "|referenceid:" + reference_id);

                    flag = 1;
                }
                catch (Exception e)
                {
                    //add exception handling
                    flag = logging.LogError(user, "SaveMealProvision", e);
                }

            }

            var jsonResult = Json(new { data = flag },
                             JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveMealLogEdit(params string[] parameters)
        {
            string id = parameters[0];
            bool breakfast_cb = parameters[1] == "true";
            bool am_snack_cb = parameters[2] == "true";
            bool lunch_cb = parameters[3] == "true";
            bool pm_snack_cb = parameters[4] == "true";
            bool dinner_cb = parameters[5] == "true";

            int flag = 0;

            var user = GetUser();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("UPDATE tblmeal_provision SET meal_b = @breakfast, meal_l = @lunch, meal_d = @dinner, meal_ms = @morningSnack, meal_as = @afternoonSnack " +
                   "WHERE meal_id = @id",
                    new MySqlParameter("@id", id),
                    new MySqlParameter("@breakfast", breakfast_cb),
                    new MySqlParameter("@lunch", lunch_cb),
                    new MySqlParameter("@dinner", dinner_cb),
                    new MySqlParameter("@morningSnack", am_snack_cb),
                    new MySqlParameter("@afternoonSnack", pm_snack_cb));

                    //for logging
                    string[] logparameters = { "id:" + id, "breakfast:" + breakfast_cb, "lunch:" + lunch_cb, "dinner:" + dinner_cb, "morningSnack:" + am_snack_cb, "afternoonSnack:" + pm_snack_cb };
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveMealLogEdit", data);

                    flag = 1;
                }
                catch (Exception e)
                {
                    //add error handling
                    flag = logging.LogError(user, "SaveMealLogEdit", e);
                }
            }

            var jsonResult = Json(new { data = flag },
                      JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveOffSiteAccomodation(params string[] parameters)
        {
            //parameters = [mnno, rank, name, date, hotel, room_type, payment, reason, remarks];
            var user = GetUser();

            var company = GetCompanyId(user);
            //var guid = _usercontext.users.Where(model => model.Email == user).Select(model => model.Id).FirstOrDefault();

            var mnno = parameters[0];
            var rank = parameters[1];
            var lastName = parameters[2];
            var firstName = parameters[3];
            var date = parameters[4].Split('-');
            var hotel = parameters[5];
            var roomType = parameters[6];
            var payment = parameters[7];
            var reason = parameters[8];
            var remarks = parameters[9];


            DateTime checkInDate = DateTime.ParseExact(date[0].Trim() + " 13:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            DateTime checkOutDate = DateTime.ParseExact(date[1].Trim() + " 12:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            var classification = "CREW";

            //Status = Request/Confirmed/Billed/Paid/ClientArrangedPayment
            var status = 1;

            var crewBatch = 141;

            int flag = 0;
            if (ModelState.IsValid)
            {
                try
                {

                    _context.Database.ExecuteSqlCommand("INSERT INTO tbloff_site_reservation(MNNO, `Rank`, LastName, FirstName, HotelName, RoomType, Classification, Status, CheckInDate, CheckOutDate, CompanyId," +
                        "ModeOfPayment, ReasonOfStay, Remarks, CrewBatch, BookerRemarks, ReservationBy, ReservationDate, LastUpdatedBy, LastUpdated)" +
                        "VALUE (@mnno, @rank, @lastName, @firstName, @hotelName, @roomType, @classification, @status, @checkInDate, @checkOutDate, @companyId," +
                        "@modeOfPayment, @reasonOfStay, @remarks, @crewBatch, @bookerremarks, @reservationBy, @reservationDate, @lastUpdatedBy, @lastUpdated)",
                        new MySqlParameter("@mnno", mnno),
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@lastName", lastName),
                        new MySqlParameter("@firstName", firstName),
                        new MySqlParameter("@hotelName", hotel),
                        new MySqlParameter("@roomType", roomType),
                        new MySqlParameter("@classification", classification),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@checkInDate", checkInDate),
                        new MySqlParameter("@checkOutDate", checkOutDate),
                        new MySqlParameter("@companyId", company),
                        new MySqlParameter("@modeOfPayment", payment),
                        new MySqlParameter("@reasonOfStay", reason),
                        new MySqlParameter("@remarks", ""),
                        new MySqlParameter("@crewBatch", crewBatch),
                        new MySqlParameter("@bookerremarks", remarks),
                        new MySqlParameter("@reservationBy", user),
                        new MySqlParameter("@reservationDate", DateTime.Now),
                        new MySqlParameter("@lastUpdatedBy", user),
                        new MySqlParameter("@lastUpdated", DateTime.Now));

                    //for logging
                    string[] logparameters = { "mnno:"+mnno, "rank:"+rank, "lastName:"+lastName, "firstName:"+firstName, "hotelName:"+hotel, "roomType:"+roomType, "classification:"+classification,
                                    "status:" + status, "checkInDate:" + checkInDate, "checkOutDate:"+checkOutDate, "companyId:"+company, "modeOfPayment:"+payment, "reasonOfStay:"+reason,
                                    "bookerremarks:" + remarks, "crewBacth:" + crewBatch, "reservationBy:" + user};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveOffSiteAccomodation", data);

                    flag = 1;

                    //For Email Notif
                    //sendEmail.Send(User.Identity, (int)Enum.Requests.OffSiteAccommodationRequest, "");

                }
                catch (Exception e)
                {
                    //add error handling   
                    flag = logging.LogError(user, "SaveOffSiteAccomodation", e);
                }
            }

            var jsonResult = Json(new { data = flag },
                JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveAccomodation(params string[] parameters)
        {
            JsonResult jsonResult = new JsonResult();

            var user = GetUser();
            var company = GetCompanyId(user);
            var guid = GetGuid(user);

            var mnno = parameters[0];
            var rank = parameters[1];
            var lastName = parameters[2];
            var firstName = parameters[3];
            var date = parameters[6].Split('-');
            var reservation_type = parameters[4];
            var payment = parameters[7];
            var reason = parameters[8];
            var remarks = parameters[9];
            var room_type = Convert.ToInt32(parameters[5]);

            DateTime checkInDateTimeFrom = DateTime.ParseExact(date[0].Trim() + " 13:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            DateTime checkInDateTimeTo = DateTime.ParseExact(date[1].Trim() + " 12:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            var classification = "CREW";
            var status = "Reserved";
            var crew_batch = 141;

            var duplicateBooking = _context.Database.SqlQuery<DuplicateReservation>("CALL CheckDuplicateAccommodationBooking(@pMNNO, @pRank, @pLastName, @pFirstName, @pCheckInDate, @pCheckOutDate, @pCompanyId);",
                new MySqlParameter("@pMNNO", mnno),
                new MySqlParameter("@pRank", rank),
                new MySqlParameter("@pLastName", lastName),
                new MySqlParameter("@pFirstName", firstName),
                new MySqlParameter("@pCheckInDate", checkInDateTimeFrom),
                new MySqlParameter("@pCheckOutDate", checkInDateTimeTo),
                new MySqlParameter("@pCompanyId", company)).ToList();

            if (duplicateBooking.Count > 0)
            {
                jsonResult = Json(new { data = "Duplicates", data2 = duplicateBooking },
                JsonRequestBehavior.AllowGet);

                return jsonResult;
            }

            var roomsFullDates = _context.Database.SqlQuery<RoomsFull>("CALL AccommodationReservationCheck(@roomType, @cid, @cod);",
            new MySqlParameter("@roomType", room_type),
            new MySqlParameter("@cid", checkInDateTimeFrom),
            new MySqlParameter("@cod", checkInDateTimeTo)).FirstOrDefault();

            //var roomsFullDates = _context.AccommodationReservationCheck(room_type, checkInDateTimeFrom, checkInDateTimeTo);

            if (roomsFullDates.RoomsFullDates != "")
            {
                jsonResult = Json(new { data = "Rooms", data2 = roomsFullDates.RoomsFullDates },
                JsonRequestBehavior.AllowGet);

                return jsonResult;
            }

            int flag = 0;
            if (ModelState.IsValid)
            {
                try
                {

                    _context.Database.ExecuteSqlCommand("INSERT INTO tbldorm_reservation_bank(MNNO, `rank`, LastName, FirstName, type_of_reservation, room_type, classification, stats, expctd_checkInDate," +
                        "expctd_checkOutDate, company_name, mode_of_pymnt, reason_of_stay, remarks, rsrvtn_by, rsrvtn_date, rsrvtn_last_updated_by, rsrvtn_last_updated, crew_batch)" +
                        "VALUE (@mnno, @rank, @lastName, @firstName, @type_of_reservation, @room_type, @classification, @stats, @expctd_checkInDate," +
                        "@expctd_checkOutDate, @company_name, @mode_of_pymnt, @reason_of_stay, @remarks, @rsrvtn_by, @rsrvtn_date, @rsrvtn_last_updated_by, @rsrvtn_last_updated, @crew_batch)",
                        new MySqlParameter("@mnno", mnno),
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@lastName", lastName),
                        new MySqlParameter("@firstName", firstName),
                        new MySqlParameter("@type_of_reservation", reservation_type),
                        new MySqlParameter("@room_type", room_type),
                        new MySqlParameter("@classification", classification),
                        new MySqlParameter("@stats", status),
                        new MySqlParameter("@expctd_checkInDate", checkInDateTimeFrom),
                        new MySqlParameter("@expctd_checkOutDate", checkInDateTimeTo),
                        new MySqlParameter("@company_name", company),
                        new MySqlParameter("@mode_of_pymnt", payment),
                        new MySqlParameter("@reason_of_stay", reason),
                        new MySqlParameter("@remarks", remarks),
                        new MySqlParameter("@rsrvtn_by", guid),
                        new MySqlParameter("@rsrvtn_date", DateTime.Now),
                        new MySqlParameter("@rsrvtn_last_updated_by", guid),
                        new MySqlParameter("@rsrvtn_last_updated", DateTime.Now),
                        new MySqlParameter("@crew_batch", crew_batch));

                    string[] logparameters = { "mnno:"+mnno, "rank:"+rank, "lastName:"+lastName, "firstName:"+firstName, "type_of_reservation:"+reservation_type, "room_type:"+room_type, "classification:"+classification,
                                    "stats:" + status, "expctd_checkInDate:" + checkInDateTimeFrom, "expctd_checkOutDate:"+checkInDateTimeTo, "company_name:"+company, "mode_of_pymnt:"+payment, "reason_of_stay:"+reason,
                                    "remarks:" + remarks, "rsrvtn_by:" + guid, "rsrvtn_date:" + DateTime.Now, "rsrvtn_last_updated_by:" + guid, "rsrvtn_last_updated:" + DateTime.Now, "crew_batch:" + crew_batch};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveAccomodation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.OnSiteAccommodationRequest, "MNNO:" + mnno + "|reservationtype:" + reservation_type + "|room_type:" + room_type + "|classification:" +
                        classification + "|checkindatefrom:" + checkInDateTimeFrom + "|checkindateto:" + checkInDateTimeTo);

                    flag = 1;

                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "SaveAccomodation", e);
                }
            }
            jsonResult = Json(new { data = flag },
                JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        //[HttpPut]
        public ActionResult SaveTransportation(params string[] parameters)
        {
            //[mnno, rank, firstName, lastName, type, vehicle, date, oneTrip, twoTrips, inbound, outbound, notes, file,
            //    pickup_input, datetime_input, dropoff_input, second_pickup_input, second_datetime_input, second_dropoff_input, fileExtension]
            var user = GetUser();

            var mnno = parameters[0];
            var rank = parameters[1];
            var firstName = parameters[2];
            var lastName = parameters[3];
            var type = parameters[4];
            var vehicle = parameters[5];
            var date = parameters[6];
            var oneTrip = parameters[7] == "true" ? 1 : 0;
            var twoTrips = parameters[8] == "true" ? 1 : 0;
            var inbound = parameters[9] == "true" ? 1 : 0;
            var outbound = parameters[10] == "true" ? 1 : 0;
            var notes = parameters[11];
            var inputFile = parameters[12];

            var pickUp = parameters[13];
            var dateTimeOfPickUp = parameters[14];
            var dropOff = parameters[15];
            var secondPickUp = parameters[16];
            var secondDateTimeOfPickUp = parameters[17];
            var secondDropOff = parameters[18];
            var filetype = "";

            if (parameters.Length > 19)
            {
                filetype = parameters[19];
            }
            else
            {
                filetype = null;
            }

            DateTime transportationDate = DateTime.ParseExact(date, "M/dd/yyyy", CultureInfo.GetCultureInfo("en-PH"));
            var dateBooked = DateTime.Now;
            var referenceId = mnno + "" + DateTime.Now.ToString("yyMMddHHmmssff");

            var byteArr = new object();

            if (inputFile != "")
            {
                byte[] bytes = Convert.FromBase64String(inputFile.Split(',')[1]);
                byteArr = bytes;
            }
            else
            {
                byteArr = null;
            }

            var status = "Requested";
            var company = _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault();

            var flag = 0;
            if (ModelState.IsValid)
            {
                try
                {

                    _context.Database.ExecuteSqlCommand("INSERT INTO tbltransportation(Mnno, `Rank`, FirstName, LastName, Company, Type, Vehicle, Date, Inbound, " +
                        "Outbound, OneTrip, TwoTrips, Status, PickUp, DateTimeOfPickUp, DropOff, SecondPickUp, SecondDateTimeOfPickUp, SecondDropOff, Notes, FileType, Attachment, ReferenceId, DateBooked, RequestedBy)" +
                        "VALUE (@mnno, @rank, @firstName, @lastName,  @company, @type, @vehicle, @date, @inbound, @outbound, @onetrip, @twotrips, @status, " +
                        "@pickup, @dateTimeOfPickUp, @dropOff, @secondPickUp, @secondDateTimeOfPickUp, @secondDropOff, @notes, @filetype, @attachment, @referenceId, @dateBooked, @requestedBy)",
                        new MySqlParameter("@mnno", mnno),
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@lastName", lastName),
                        new MySqlParameter("@firstName", firstName),
                        new MySqlParameter("@company", company),
                        new MySqlParameter("@type", type),
                        new MySqlParameter("@vehicle", vehicle),
                        new MySqlParameter("@date", transportationDate),
                        new MySqlParameter("@inbound", inbound),
                        new MySqlParameter("@outbound", outbound),
                        new MySqlParameter("@onetrip", oneTrip),
                        new MySqlParameter("@twoTrips", twoTrips),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@pickup", pickUp),
                        new MySqlParameter("@dateTimeOfPickUp", dateTimeOfPickUp),
                        new MySqlParameter("@dropOff", dropOff),
                        new MySqlParameter("@secondPickUp", secondPickUp),
                        new MySqlParameter("@secondDateTimeOfPickUp", secondDateTimeOfPickUp),
                        new MySqlParameter("@secondDropOff", secondDropOff),
                        new MySqlParameter("@notes", notes),
                        new MySqlParameter("@filetype", filetype),
                        new MySqlParameter("@attachment", byteArr),
                        new MySqlParameter("@referenceId", referenceId),
                        new MySqlParameter("@dateBooked", dateBooked),
                        new MySqlParameter("@requestedBy", user));

                    //for logging
                    string[] logparameters = { "mnno:"+mnno, "rank:"+rank, "lastName:"+lastName, "firstName:"+firstName, "company:"+company, "type:" + type, "vehicle:" + vehicle, "date:" + transportationDate,
                                            "inbound:"+inbound, "outbound:"+outbound, "onetrip:"+oneTrip, "twoTrops:"+twoTrips, "status:" + status,"pickup:"+pickUp, "dateTimeOfPickUp:"+dateTimeOfPickUp,
                                            "dropOff:" + dropOff, "secondDateTimeOfPickUp:"+secondDateTimeOfPickUp, "secondDropOff:"+secondDropOff, "notes:"+notes, "fileType:"+filetype, "referenceId:" + referenceId,
                                            "dateBooked:"+dateBooked};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveTransportation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.TransportationRequest, "");

                    flag = 1;

                }
                catch (Exception e)
                {
                    //add error handling   
                    flag = logging.LogError(user, "SaveTransportation", e);
                }
            }

            var jsonResult = Json(new { data = flag },
                JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveAirportTransportation(params string[] parameters)
        {
            JsonResult jsonResult = new JsonResult();
            var user = GetUser();
            //saveTransportationParameter = [mnno, rank, name, type, vehicle, notes, inbound, outbound, inboundDate, outboundDate, file, fileExtension];
            var mnno = parameters[0];
            var rank = parameters[1];
            var name = parameters[2].Split(',');
            var firstName = name[1].Split(' ')[1];
            var lastName = name[0];
            var type = parameters[3];
            var vehicle = parameters[4];
            var notes = parameters[5];
            var inbound = parameters[6] == "true" ? 1 : 0; ;
            var outbound = parameters[7] == "true" ? 1 : 0; ;
            var inboundDate = DateTime.ParseExact(parameters[8], "M/dd/yyyy", CultureInfo.GetCultureInfo("en-PH"));
            var outboundDate = DateTime.ParseExact(parameters[9], "M/dd/yyyy", CultureInfo.GetCultureInfo("en-PH"));
            var file = parameters[10];
            var fileExtension = parameters[11];
            var status = "Requested";
            var company = _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault();
            var referenceId = mnno + "" + DateTime.Now.ToString("yyMMddHHmmssff");
            var dateBooked = DateTime.Now;

            var flag = 0;
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("INSERT INTO tbltransportation (Mnno, `Rank`, FirstName, LastName, Company, Type, Vehicle, Status, Notes, ReferenceId, DateBooked, RequestedBy) " +
                        "VALUE (@mnno, @rank, @firstName, @lastName, @company, @type, @vehicle, @status, @notes, @referenceId, @dateBooked, @requestedBy)",
                        new MySqlParameter("@mnno", mnno),
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@firstName", firstName),
                        new MySqlParameter("@lastName", lastName),
                        new MySqlParameter("@company", company),
                        new MySqlParameter("@type", type),
                        new MySqlParameter("@vehicle", vehicle),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@notes", notes),
                        new MySqlParameter("@referenceId", referenceId),
                        new MySqlParameter("@dateBooked", dateBooked),
                        new MySqlParameter("@requestedBy", user));

                    var transportationId = _context.Database.SqlQuery<int>("SELECT Id FROM tbltransportation WHERE referenceId = @referenceId",
                        new MySqlParameter("@referenceId", referenceId)).FirstOrDefault();

                    _context.Database.ExecuteSqlCommand("INSERT INTO tblairport_transfer_details (Inbound, Outbound, InboundDate, OutboundDate, FileType, Attachment, TransportationId) " +
                        "VALUE (@inbound, @outbound, @inboundDate, @outboundDate, @fileType, @attachment, @transportationId)",
                        new MySqlParameter("@inbound", inbound),
                        new MySqlParameter("@outbound", outbound),
                        new MySqlParameter("@inboundDate", inboundDate),
                        new MySqlParameter("@outboundDate", outboundDate),
                        new MySqlParameter("@fileType", fileExtension),
                        new MySqlParameter("@attachment", file),
                        new MySqlParameter("@transportationId", transportationId));

                    //for logging
                    string[] logparameters = { "mnno:"+mnno, "rank:"+rank, "lastName:"+lastName, "firstName:"+firstName, "company:"+company, "type:" + type, "vehicle:" + vehicle, "status:" + status, "referenceId: " + dateBooked,
                        "inbound:" + inbound, "outbound:" + outbound, "inboundDate:" + inboundDate, "outboundDate:" + outboundDate, "fileType:" + fileExtension, "attachment:" + file};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveAirportTransportation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.TransportationRequest, "");

                    flag = 1;

                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "SaveAirportTransportation", e);
                }
            }

            jsonResult = Json(new { data = flag },
            JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult SaveDailyTransportation(params string[] parameters)
        {
            JsonResult jsonResult = new JsonResult();
            var flag = 0;
            var user = GetUser();

            var mnno = parameters[0];
            var rank = parameters[1];
            var name = parameters[2].Split(',');
            var firstName = name[1].Split(' ')[1];
            var lastName = name[0];
            var type = parameters[3];
            var vehicle = parameters[4];
            var notes = parameters[5];

            var status = "Requested";
            var referenceId = mnno + "" + DateTime.Now.ToString("yyMMddHHmmssff");
            var dateBooked = DateTime.Now;
            var company = _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault();

            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            dynamic details = jsonSerializer.DeserializeObject(parameters[6]);

            var stringToAppend = "";

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("INSERT INTO tbltransportation (Mnno, `Rank`, FirstName, LastName, Company, Type, Vehicle, Status, Notes, ReferenceId, DateBooked, RequestedBy) " +
                        "Values(@mnno, @rank, @firstName, @lastName, @company, @type, @vehicle, @status, @notes, @referenceId, @dateBooked, @requestedBy)",
                        new MySqlParameter("@mnno", mnno),
                        new MySqlParameter("@rank", rank),
                        new MySqlParameter("@firstName", firstName),
                        new MySqlParameter("@lastName", lastName),
                        new MySqlParameter("@company", company),
                        new MySqlParameter("@type", type),
                        new MySqlParameter("@vehicle", vehicle),
                        new MySqlParameter("@status", status),
                        new MySqlParameter("@notes", notes),
                        new MySqlParameter("@referenceId", referenceId),
                        new MySqlParameter("@dateBooked", dateBooked),
                        new MySqlParameter("@requestedBy", user)
                        );

                    var transportationId = _context.Database.SqlQuery<int>("SELECT Id FROM tbltransportation WHERE referenceId = @referenceId",
                           new MySqlParameter("@referenceId", referenceId)).FirstOrDefault();

                    foreach (var items in details)
                    {
                        int dtType = 0;

                        if (items[0] == "One-way")
                        {
                            dtType = 0;
                        }
                        else if (items[0] == "Round-trip")
                        {
                            dtType = 1;
                        }

                        var pickUp = items[1];
                        var dropOff = items[2];
                        var pickup_date_time = items[3];
                        var pickUp2 = items[4];
                        var dropOff2 = items[5];
                        var pickup_date_time2 = items[6];

                        stringToAppend += "(" + dtType + ",'" + pickUp + "','" + pickup_date_time + "','" + dropOff + "','" + pickUp2 + "','" + pickup_date_time2 + "','" + dropOff2 + "'," + transportationId + "),";
                    }

                    stringToAppend = stringToAppend.Remove(stringToAppend.Length - 1, 1);

                    _context.Database.ExecuteSqlCommand("INSERT INTO tbldaily_transfer_details (IsRoundTrip, PickUpPlace, DateTimeOfPickUp, DropOffPlace, SecondPickUpPlace, SecondDateTimeOfPickUp, SecondDropOffPlace, TransportationId) " +
                           "VALUES " + stringToAppend);

                    //for logging
                    string[] logparameters = { "mnno:"+mnno, "rank:"+rank, "lastName:"+lastName, "firstName:"+firstName, "company:"+company, "type:" + type, "vehicle:" + vehicle, "status:" + status, "referenceId: " + dateBooked,
                        "foreign key in tbldaily_transfer_details:" + transportationId};

                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "SaveDailyTransportation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.TransportationRequest, "");

                    flag = 1;
                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "SaveDailyTransportation", e);
                }

            }

            jsonResult = Json(new { data = flag },
            JsonRequestBehavior.AllowGet);

            return jsonResult;
        }
        public ActionResult UpdateOnSiteReservation(params string[] parameters)
        {
            var jsonResult = new JsonResult();
            var user = GetUser();
            var userId = GetUserId(user);
            var company = GetCompanyId(user);

            //onSiteAccommodationRecordId, pReservationType, pRoomType, pCheckInDate, pCheckOutDate, pPayment, pReason, pRemarks
            var id = parameters[0];
            var reservationType = parameters[1];
            var roomType = parameters[2];
            var payment = parameters[5];
            var reason = parameters[6];
            var remarks = parameters[7];


            DateTime checkInDate = DateTime.ParseExact(parameters[3].Trim() + " 13:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            DateTime checkOutDate = DateTime.ParseExact(parameters[4] + " 12:00:00", "MM/dd/yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            var roomsFullDates = _context.Database.SqlQuery<RoomsFull>("CALL UpdateAccommodationReservationCheck(@reservationId, @roomType, @cid, @cod);",
            new MySqlParameter("@reservationId", id),
            new MySqlParameter("@roomType", roomType),
            new MySqlParameter("@cid", checkInDate),
            new MySqlParameter("@cod", checkOutDate)).FirstOrDefault();

            if (roomsFullDates.RoomsFullDates != "")
            {
                jsonResult = Json(new { data = "Rooms", data2 = roomsFullDates.RoomsFullDates },
                JsonRequestBehavior.AllowGet);

                return jsonResult;
            }

            var flag = 0;
            if (ModelState.IsValid)
            {
                try
                {

                    var lastUpdated = DateTime.Now;
                    _context.Database.ExecuteSqlCommand("UPDATE tbldorm_reservation_bank SET type_of_reservation = @reservationtype, room_type = @roomType, expctd_checkInDate = @checkInDate, " +
                        "expctd_checkOutDate = @checkOutDate, mode_of_pymnt = @payment, reason_of_stay = @reason, remarks = @remarks, rsrvtn_last_updated = @lastupdated, rsrvtn_last_updated_by = @lastupdatedby WHERE rsrvtn_id = @id",
                    new MySqlParameter("@id", id),
                    new MySqlParameter("@reservationtype", reservationType),
                    new MySqlParameter("@roomType", roomType),
                    new MySqlParameter("@checkInDate", checkInDate),
                    new MySqlParameter("@checkOutDate", checkOutDate),
                    new MySqlParameter("@payment", payment),
                    new MySqlParameter("@reason", reason),
                    new MySqlParameter("@remarks", remarks),
                    new MySqlParameter("@lastupdated", lastUpdated),
                    new MySqlParameter("@lastupdatedby", userId));

                    //for logging
                    string[] logparameters = { "id:" + id, "reservationtype:" + reservationType, "roomType:" + roomType, "checkInDate:" + checkInDate, "checkOutDate:" + checkOutDate,
                                               "payment:" + payment, "reason:" + reason, "remarks:" + remarks, "lastUpdated:" + lastUpdated, "lastupdatedby:" + userId};
                    string data = logging.ConvertToLoggingParameter(logparameters);
                    logging.Log(user, "UpdateOnSiteReservation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.UpdateOnSiteAccommodationReservation, "reservationId:" + id + "|reservationType:" + reservationType + "|roomType:" + roomType + "|checkindate:" + checkInDate + "|checkoutdate:" + checkOutDate + "|payment:" + payment
                        + "|reason:" + reason + "|remarks:" + remarks);

                    flag = 1;

                }
                catch (Exception e)
                {
                    flag = logging.LogError(user, "UpdateOnSiteReservation", e);
                }
            }

            jsonResult = Json(new { data = flag },
                JsonRequestBehavior.AllowGet);

            return jsonResult;

        }

        public ActionResult CancelAccommodationReservation(int id)
        {
            var jsonStatus = (int)Status.Initialize;
            var user = GetUser();
            var userId = GetUserId(user);

            var x = DateTime.Now.ToString();

            //DateTime dateNow = DateTime.ParseExact(x, "dd/M/yyyy HH:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture);

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("UPDATE tbldorm_reservation_bank SET stats = 'Cancelled', rsrvtn_last_updated_by = @userId, rsrvtn_last_updated = @reservationLastUpdated WHERE rsrvtn_id = @id",
                        new MySqlParameter("@userId", userId),
                        new MySqlParameter("@reservationLastUpdated", DateTime.Now.ToString("yyyy-M-dd HH:mm:ss")),
                        new MySqlParameter("@id", id));

                    //for logging
                    string[] logparameters = { "id:" + id, "stats:Cancelled", "rsrvtn_last_updated_by:" + userId, "rsrvtn_last_updated:" + DateTime.Now.ToString("yyyy-M-dd HH:mm:ss") };
                    string data = logging.ConvertToLoggingParameter(logparameters);

                    logging.Log(user, "CancelAccommodationReservation", data);

                    //For Email Notif
                    sendEmail.Send(User.Identity, (int)Enum.Requests.CancelAccommodationReservation, "");

                    jsonStatus = (int)Status.Success;
                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "CancelAccommodationReservation", e);
                }
            }

            var jsonResult = Json(new { data = jsonStatus },
                JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult UpdateCompanyProfile(params string[] parameters)
        {
            //parameters = [name, location, email, contact, contactPersonPos, contactNumber, description, logo, fileExtension]

            var byteArr = new object();

            if (parameters[7] != "")
            {
                byte[] bytes = Convert.FromBase64String(parameters[7]);
                byteArr = bytes;
            }
            else
            {
                byteArr = null;
            }

            var user = GetUser();
            var company = GetCompanyId(user);

            JsonResult jsonResult = new JsonResult();
            var jsonStatus = (int)Status.Initialize;

            if (ModelState.IsValid)
            {
                try
                {
                    if (byteArr != null)
                    {
                        _context.Database.ExecuteSqlCommand("UPDATE tbltpcompany SET companyName = @name, companyLocation = @location, companyEmail = @email, " +
                                   "contactPerson = @contact, contactPersonPos = @contactPersonPos, companyContactNo = @contactNumber, Description = @description, " +
                                   "Logo = @logo, ImageFileType = @fileExtension WHERE companyId = @company",
                                new MySqlParameter("@name", parameters[0]),
                                new MySqlParameter("@location", parameters[1]),
                                new MySqlParameter("@email", parameters[2]),
                                new MySqlParameter("@contact", parameters[3]),
                                new MySqlParameter("@contactPersonPos", parameters[4]),
                                new MySqlParameter("@contactNumber", parameters[5]),
                                new MySqlParameter("@description", parameters[6]),
                                new MySqlParameter("@logo", byteArr),
                                new MySqlParameter("@fileExtension", parameters[8]),
                                new MySqlParameter("@company", company));
                    }
                    else
                    {
                        _context.Database.ExecuteSqlCommand("UPDATE tbltpcompany SET companyName = @name, companyLocation = @location, companyEmail = @email, " +
                                   "contactPerson = @contact, contactPersonPos = @contactPersonPos, companyContactNo = @contactNumber, Description = @description " +
                                   "WHERE companyId = @company",
                                new MySqlParameter("@name", parameters[0]),
                                new MySqlParameter("@location", parameters[1]),
                                new MySqlParameter("@email", parameters[2]),
                                new MySqlParameter("@contact", parameters[3]),
                                new MySqlParameter("@contactPersonPos", parameters[4]),
                                new MySqlParameter("@contactNumber", parameters[5]),
                                new MySqlParameter("@description", parameters[6]),
                                new MySqlParameter("@company", company));
                    }

                    jsonStatus = (int)Status.Success;

                    jsonResult = Json(new { data = jsonStatus },
                       JsonRequestBehavior.AllowGet);

                }
                catch (Exception e)
                {
                    jsonStatus = logging.LogError(user, "UpdateCompanyProfile", e);
                }
            }

            jsonResult = Json(new { data = jsonStatus },
               JsonRequestBehavior.AllowGet);

            return jsonResult;
        }

        public ActionResult CheckForCrewDuplicate(params string[] parameters)
        {
            //position, firstName, lastName, middleName, birthdate, birthplace

            var user = GetUser();

            //var rank = parameters[0];
            var firstName = parameters[0];
            var lastName = parameters[1];
            //var middleInitial = parameters[3];
            var birthdate = parameters[2];
            //var birthplace = parameters[5];

            if (ModelState.IsValid)
            {
                try
                {
                    var duplicate = _context.Database.SqlQuery<CheckForDuplicateRecord>("SELECT c.MNNO, c.Rank, c.FName, c.MName, c.LName, c.BDate " +
                                                                            "FROM tblcrew c " +
                                                                            "WHERE c.FName = @firstName AND c.LName = @lastName AND " +
                                                                            "c.BDate = @birthdate",
                        //new MySqlParameter("rank", rank),
                        new MySqlParameter("firstName", firstName),
                        new MySqlParameter("lastName", lastName),
                        //new MySqlParameter("middleInitial", middleInitial),
                        new MySqlParameter("birthdate", birthdate)
                        ).FirstOrDefault();

                    if (duplicate != null)
                    {
                        return Json(new { data = duplicate },
                            JsonRequestBehavior.AllowGet);
                    }

                }
                catch (Exception e)
                {
                    return Json(new { data = logging.LogError(user, "CheckForCrewDuplicate", e) },
                            JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new { data = 0 },
                        JsonRequestBehavior.AllowGet);

        }

        public ActionResult UpdateCrewRank(string mnno, string newRank, string oldRank)
        {
            var flag = 0;
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("UPDATE tblcrew SET tblcrew.rank = '" + newRank + "' WHERE MNNO = '" + mnno + "'");

                    string[] parameters = { "mnno:" + mnno, "newRank:" + newRank, "oldRank: " + oldRank };
                    string data = logging.ConvertToLoggingParameter(parameters);
                    logging.Log(GetUser(), "UpdateCrewRank", data);

                    sendEmail.Send(GetIdentity(), (int)Enum.Requests.UpdateCrewRank, "mnno:" + mnno + "|newRank:" + newRank + "|oldRank:" + oldRank);

                    flag = 1;

                }
                catch (Exception e)
                {
                    return Json(new { logId = logging.LogError(GetUser(), "UpdateCrewRank", e) },
                        JsonRequestBehavior.AllowGet);
                }

            }

            return Json(new { data = flag },
                        JsonRequestBehavior.AllowGet);

        }

        public ActionResult UpdateNewCrewRequest(string[] parameters)
        {
            var tempNo = parameters[0];
            var rank = parameters[1];
            var firstname = parameters[2];
            var middleInitial = parameters[3];
            var lastname = parameters[4];
            var birthPlace = parameters[5];
            var birthdate = parameters[6];
            string inputFile = parameters[7];

            var byteArr = new object();

            if (inputFile != "")
            {
                byte[] bytes = Convert.FromBase64String(inputFile.Split(',')[1]);
                byteArr = bytes;
            }
            else
            {
                byteArr = null;
            }

            try
            {
                _context.Database.ExecuteSqlCommand("UPDATE tblnewcrewrequest SET Position = @rank, FirstName = @firstname, LastName = @lastname, MiddleName = @middleInitial, BirthPlace  = @birthPlace, Birthday = @birthdate, Picture = @picture " +
                    "WHERE MNNO = @tempNo",
                    new MySqlParameter("@rank", rank),
                    new MySqlParameter("@firstname", firstname),
                    new MySqlParameter("@lastname", lastname),
                    new MySqlParameter("@middleInitial", middleInitial),
                    new MySqlParameter("@birthPlace", birthPlace),
                    new MySqlParameter("@birthdate", birthdate),
                    new MySqlParameter("@picture", byteArr),
                    new MySqlParameter("@tempNo", tempNo));

            }
            catch (Exception e)
            {
                return Json(new { logId = logging.LogError(GetUser(), "UpdateNewCrewRequest", e) },
                    JsonRequestBehavior.AllowGet);
            }

            return Json(new { status = Status.Success },
                JsonRequestBehavior.AllowGet);
        }

        public IIdentity GetIdentity()
        {
            return User.Identity;
        }

        public string GetUser()
        {
            return User.Identity.Name;
        }

        public string GetUserId(string user)
        {
            return _usercontext.users.Where(m => m.Email == user).Select(m => m.Id).FirstOrDefault();
        }

        public string GetCompanyId(string user)
        {
            return _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault().ToString();
        }

        public string GetGuid(string user)
        {
            return _usercontext.users.Where(model => model.Email == user).Select(model => model.Id).FirstOrDefault();
        }

        public ActionResult GetPartialOfUpdateNewCrewRequest()
        {
            //var nations = _context.tblcountries.Select(m => new Nation { Name = m.name, Iso3 = m.iso3 }).ToList();

            var ranks = _context.tblranks.Select(m => new Rank { CrewRank = m.rank, Description = m.description, RankDesc = string.Concat(m.rank, " - ", m.description) }).ToList();

            //IEnumerable<Nation> nationList = nations;
            IEnumerable<Rank> ranksList = ranks;

            NewCrewRegistrationViewModel ncrvm = new NewCrewRegistrationViewModel()
            {
                //Nations = nationList,
                Ranks = ranksList
            };

            return PartialView("_UpdateNewCrewRequest", ncrvm);
        }

    }
}