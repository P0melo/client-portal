using MySql.Data.MySqlClient;
using SAMPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using SAMPortal.DTO;
using Microsoft.AspNet.SignalR;

namespace SAMPortal.Controllers.Api
{
    [System.Web.Http.Authorize]
    public class CourseBookingController : ApiController
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;
        private IHubContext hubContext;

        public CourseBookingController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
            hubContext = GlobalHost.ConnectionManager.GetHubContext<MyHub>();
        }

        public IHttpActionResult GetCourseList(string month, int year)
        {

            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, t.Min as MinCapacity, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
                                                                    "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left join tblscheddata sd on s.SchedID = sd.SchedID " +
                                                                    "where originalowner = '" + company + "' and Active = 1 and DateFrom like '%" + year + "-" + month + "-%' group by s.SchedID order by dateFrom desc").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCourseListRange(string monthFrom, string monthTo, int year)
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, t.Min as MinCapacity, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
                                                                    "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left join tblscheddata sd on s.SchedID = sd.SchedID " +
                                                                    "where originalowner = '" + company + "' and Active = 1 and DateFrom between '" + year + "-" + monthFrom + "-01' and '" + year + "-" + monthTo + "-31' group by s.SchedID order by dateFrom desc").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCourseListRangeO(string monthFrom, string monthTo, int year)
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var bookerGroup = _context.tblbookergroups.Where(m => m.bookerCompany == company.ToString()).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, t.Min as MinCapacity, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
                                                                    "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left " +
                                                                    "join tblscheddata sd on s.SchedID = sd.SchedID " +
                                                                    "where (OriginalOwner != " + company + " OR(OriginalOwner IS NULL OR OriginalOwner = '')) and CONCAT(';',s.BookerGroup) LIKE '%;" + bookerGroup.bookergroupID + ";%' and t.Active = 1 " +
                                                                    "and DateFrom between '" + year + "-" + monthFrom + "-01' and '" + year + "-" + monthTo + "-31' group by s.SchedID order by dateFrom desc").ToList();



            //var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
            //                                                        "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left join tblscheddata sd on s.SchedID = sd.SchedID " +
            //                                                        "where originalowner != " + company + " and Active = 1 and DateFrom like '%" + year + "-" + month + "-%' group by s.SchedID order by dateFrom desc").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCourseListO(string month, int year)
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var bookerGroup = _context.tblbookergroups.Where(m => m.bookerCompany == company.ToString()).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, t.Min as MinCapacity, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
                                                                    "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left " +
                                                                    "join tblscheddata sd on s.SchedID = sd.SchedID " +
                                                                    "where (OriginalOwner != " + company + " OR(OriginalOwner IS NULL OR OriginalOwner = '')) and CONCAT(';',s.BookerGroup) LIKE '%;" + bookerGroup.bookergroupID + ";%' and t.Active = 1 " +
                                                                    "and DateFrom like '%" + year + "-" + month + "-%' group by s.SchedID order by dateFrom desc").ToList();



            //var data = _context.Database.SqlQuery<CourseListModel>("select s.SchedID, SubjectName as CourseName, CourseDuration, MaxCapacity, DateFrom, DateTo, Count(MNNo) as Slots " +
            //                                                        "from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID left join tblscheddata sd on s.SchedID = sd.SchedID " +
            //                                                        "where originalowner != " + company + " and Active = 1 and DateFrom like '%" + year + "-" + month + "-%' group by s.SchedID order by dateFrom desc").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetAllCourseList()
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseNames>("select SubjectName as CourseName, t.Min, t.Max, t.CourseDuration from tbltrainings t join tblschedule s on t.SubjectCode = s.TrainingID join tblscheddata sd on s.SchedID = sd.SchedID " +
                                                        "where Active = 1 and t.web_display_courses is not null and t.web_display_courses != 0 group by CourseName, t.Min, t.Max, t.CourseDuration").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetEnrollees(int schedId)
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault();

            var data = _context.Database.SqlQuery<CourseEnrollees>("select sd.MNNO, c.`Rank`, c.LName, c.FName, c.MName, c.ContactNo as Contact, c.Employer, sd.RegistrationNo from tblscheddata sd join tblcrew c on sd.MNNo = c.MNNo where SchedID = " + schedId + " and c.Employer = " + company).ToList();

            int courseFee = _context.Database.SqlQuery<int>("SELECT tf.courseFee  FROM tbltrainings t " +
                                                            "INNER JOIN tbltrainingsfee tf ON t.CourseCode = tf.courseCode " +
                                                            "INNER JOIN tblschedule s ON t.SubjectCode = s.TrainingID " +
                                                            "WHERE s.SchedID = " + schedId + " " +
                                                            "ORDER BY courseFeeUpdate DESC").FirstOrDefault();
            //for on-site
            float? onSiteAccommodationTotalCost = _context.Database.SqlQuery<float?>("SELECT SUM(df.price) AS 'TotalCost' " +
                            "FROM tbldorm_reservation_bank drb JOIN tbldorm_fees df ON df.accom_type = drb.room_type " +
                            "WHERE company_name = @company AND stats = 'Reserved' AND drb.SchedID=@schedId",
                            new MySqlParameter("@company", company),
                            new MySqlParameter("@schedId", schedId)).FirstOrDefault();

            var dormPricesList = _context.Database.SqlQuery<Decimal>("SELECT price FROM tbldorm_fees WHERE accommodation LIKE '%Dorm%'").ToList();

            var onSiteAccommodationTotalCostData = _context.Database.SqlQuery<OnSiteAccommodationFeesModel>("SELECT COUNT(room_type) AS 'NumberOfBooking' " +
                            "FROM tbldorm_reservation_bank drb INNER JOIN tbldorm_fees df ON df.accom_type = drb.room_type " +
                            "WHERE company_name = @company AND stats = 'Reserved' AND drb.SchedID = @schedId GROUP BY room_type ORDER BY room_Type ASC",
                            new MySqlParameter("@company", company),
                            new MySqlParameter("@schedId", schedId)).ToList();


            //var onSiteAccommodationTotalCostData = _context.Database.SqlQuery<OnSiteAccommodationFeesModel>("SELECT room_type AS 'RoomType', accommodation AS AccommodationType, df.price AS 'PricePerPax', " +
            //                "COUNT(room_type) AS 'NumberOfBooking', SUM(df.price) AS 'TotalCost' " +
            //                "FROM tbldorm_reservation_bank drb INNER JOIN tbldorm_fees df ON df.accom_type = drb.room_type " +
            //                "WHERE company_name = @company AND stats = 'Reserved' AND drb.SchedID = @schedId GROUP BY room_type ORDER BY room_Type ASC",
            //                new MySqlParameter("@company", company),
            //                new MySqlParameter("@schedId", schedId)).ToList();

            //for meals
            var mealPricesList = _context.Database.SqlQuery<MealFeesModel>("SELECT meal_fee_id, meal, price FROM tblmeal_fees WHERE meal_fee_id < 6").ToList();

            var mealCountAndTotalCost = _context.Database.SqlQuery<MealCountAndTotalCostModel>("SELECT SUM(meal_b) AS BreakfastCount, " +
                                        "((SELECT price FROM tblmeal_fees WHERE meal_fee_id = mp.meal_b_fee_id) * SUM(meal_b)) AS BreakfastCost, " +
                                        "SUM(meal_l) AS LunchCount, " +
                                        "((SELECT price FROM tblmeal_fees WHERE meal_fee_id = mp.meal_l_fee_id) *SUM(meal_l)) AS LunchCost, " +
                                        "SUM(meal_d) AS DinnerCount, " +
                                        "((SELECT price FROM tblmeal_fees WHERE meal_fee_id = mp.meal_d_fee_id) *SUM(meal_d)) AS DinnerCost," +
                                        "SUM(meal_ms) AS MorningSnackCount, " +
                                        "((SELECT price FROM tblmeal_fees WHERE meal_fee_id = mp.meal_ms_fee_id) *SUM(meal_ms)) AS MorningSnackCost, " +
                                        "SUM(meal_as) AS AfternoonSnackCount, " +
                                        "((SELECT price FROM tblmeal_fees WHERE meal_fee_id = mp.meal_ms_fee_id) *SUM(meal_as)) AS AfternoonSnackCost " +
                                        "FROM tblmeal_provision mp INNER JOIN tblcrew c ON mp.MNNO = c.MNNO " +
                                        "WHERE schedId = @schedId AND c.Employer = @company",
                                        new MySqlParameter("@schedId", schedId),
                                        new MySqlParameter("@company", company)).ToList();

            Decimal? mealTotalCost = mealCountAndTotalCost[0].AfternoonSnackCost + mealCountAndTotalCost[0].BreakfastCost + mealCountAndTotalCost[0].DinnerCost +
                mealCountAndTotalCost[0].LunchCost + mealCountAndTotalCost[0].MorningSnackCost;

            int?[] mealCountArr = new int?[5];
            mealCountArr[0] = mealCountAndTotalCost[0].BreakfastCount;
            mealCountArr[1] = mealCountAndTotalCost[0].LunchCount;
            mealCountArr[2] = mealCountAndTotalCost[0].DinnerCount;
            mealCountArr[3] = mealCountAndTotalCost[0].MorningSnackCount;
            mealCountArr[4] = mealCountAndTotalCost[0].AfternoonSnackCount;

            var airportTransportationFee = _context.Database.SqlQuery<AirportTransportationFees>("SELECT transpo_fee_id AS FeeId, vehicle_type AS VehicleType, rate_usd AS Price FROM tbltransportation_fee WHERE transpo_type = 'Airport Transfer'").ToList();

            var atBookingAndCosts = _context.Database.SqlQuery<AirportTransportationBookingsAndCosts>("SELECT COUNT(t.Id) AS NumberOfBooking, SUM(rate_usd) AS TotalCost, Vehicle " +
                            "FROM tbltransportation_fee tf RIGHT JOIN tbltransportation t " +
                            "ON tf.vehicle_type = t.Vehicle COLLATE utf8_unicode_ci " +
                            "WHERE transpo_type = 'Airport Transfer' AND t.SchedID = @schedId GROUP By Vehicle",
                            new MySqlParameter("@schedId", schedId)).ToList();

            var dtPricesAndDestination = _context.Database.SqlQuery<DailyTransporationPrices>("SELECT transpo_fee_id AS FeeId, vehicle_type AS VehicleType, rate_usd AS Price, destination AS Destination " +
                            "FROM tbltransportation_fee " +
                            "WHERE transpo_type = 'Daily Transfer'").ToList();

            var dtVehicleAndNumberOfBookings = _context.Database.SqlQuery<DailyTransportationNumberOfBookings>("SELECT Vehicle, Count(Vehicle) AS NumberOfBookings, AreaOfDestination, IsRoundTrip FROM tbltransportation t JOIN tbldaily_transfer_details dfd ON t.Id = dfd.TransportationId WHERE schedid = " + schedId + " AND type = 'Daily Transfer' GROUP BY vehicle, AreaOfDestination").ToList();

            //return Json(new { data, data2, courseFee, onSiteAccommodationTotalCost, mealPricesList, mealCountAndTotalCost, airportTransportationFee, atBookingAndCosts, dtPricesAndDestination });
            return Json(new { data, courseFee, onSiteAccommodationTotalCost, dormPricesList, onSiteAccommodationTotalCostData, mealPricesList, mealTotalCost, mealCountArr, airportTransportationFee, atBookingAndCosts, dtPricesAndDestination, dtVehicleAndNumberOfBookings });
        }

        public IHttpActionResult GetNumberOfEnrollees(int schedId)
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(model => model.Email == user).Select(model => model.CompanyId).FirstOrDefault();

            var data = _context.Database.SqlQuery<int>("select count(*) AS Count from tblscheddata sd join tblcrew c on sd.MNNo = c.MNNo where SchedID = " + schedId + " and c.Employer != " + company).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCrewListForEnrollment()
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var data = _context.tblcrews.Where(m => m.Employer == company).Select(m => new CourseEnrollees
            {
                MNNO = m.MNNO,
                Rank = m.Rank,
                LName = m.LName,
                FName = m.FName,
                MName = m.MName,
                Contact = m.ContactNo
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetSpecialScheduleRequests()
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => new Company { CompanyId = m.CompanyId, CompanyName = m.CompanyName}).FirstOrDefault();

            var data = _context.tblspecialcourserequests.Where(m => m.CompanyId == company.CompanyId).Select(m => new SpecialCourseRequest
            {
                CourseName = m.CourseName,
                DateRequested = m.DateRequested,
                Notes = m.Notes,
                NumberOfParticipants = m.NumberOfParticipants,
                RequestedBy = m.RequestedBy,
                CompanyName = company.CompanyName,
                StartDate = m.StartDate,
                Status = m.Status
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetEarliesTimeOfCourse(int schedId)
        {
            var data = _context.Database.SqlQuery<CourseFirstDateTime>("SELECT SchedDate, TimeFrom FROM tbltraining_attendees WHERE schedid = '" + schedId + "' ORDER BY SchedDate ASC, TimeFrom ASC LIMIT 1").FirstOrDefault();

            return Ok(data);
        }

        public IHttpActionResult GetNumberOfAllEnrollees(int schedId)
        {
            var data = _context.Database.SqlQuery<int>("select count(*) AS Count from tblscheddata sd join tblcrew c on sd.MNNo = c.MNNo where SchedID = @schedId", new MySqlParameter("@schedId", schedId)).FirstOrDefault();

            return Ok(data);
        }
    }
}
