﻿using MySql.Data.MySqlClient;
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

            float onSiteAccomodationTotalCost = _context.Database.SqlQuery<int>("SELECT (COUNT(drb.rsrvtn_by) * df.price) AS 'Total Cost' " +
                            "FROM tbldorm_reservation_bank drb JOIN tbldorm_fees df ON df.accom_type = drb.room_type " +
                            "WHERE company_name = @company AND stats = 'Reserved'", new MySqlParameter("@company", company)).FirstOrDefault();


            return Json(new { data, courseFee, onSiteAccomodationTotalCost });
            //return Ok(data);
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
