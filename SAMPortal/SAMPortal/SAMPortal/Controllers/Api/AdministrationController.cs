using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using SAMPortal.Models;

namespace SAMPortal.Controllers.Api
{
    [System.Web.Http.Authorize]
    public class AdministrationController : ApiController
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;

        public AdministrationController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
        }

        public IHttpActionResult GetNewCrewRequest()
        {
            //status = 1 is new request, status = 2 is approved, status = 0 is denied
            var data = _context.Database.SqlQuery<ReviewNewCrewRegistration>("select n.Id, n.Position, n.FirstName, n.LastName, n.MiddleName as MiddleInitial, " +
                                                                             "n.Birthday, n.BirthPlace, n.Company, t.companyName, n.EnteredBy, n.Picture, n.MNNO " +
                                                                             "from tblnewcrewrequest n join tbltpcompany t on n.Company = t.companyID where status = 1 order by position asc").ToList();
            return Ok(data);
        }

        public IHttpActionResult GetNewCrewRequestFromRequests()
        {
            //status = 1 is new request, status = 2 is approved, status = 0 is denied
            var data = _context.Database.SqlQuery<ReviewNewCrewRegistration>("select n.Id, n.Position, n.FirstName, n.LastName, n.MiddleName as MiddleInitial, n.Gender, n.Nationality, " +
                                                                             "n.Birthday, n.BirthPlace, n.Contact, n.Company, t.companyName, n.EnteredBy, n.Picture, n.Status " +
                                                                             "from tblnewcrewrequest n join tbltpcompany t on n.Company = t.companyID order by position asc").ToList();
            return Ok(data);
        }

        public IHttpActionResult GetOffSiteAccommodationRequest()
        {
            var data = _context.Database.SqlQuery<OffSiteAccommodationViewModel>("SELECT Id, MNNO, `Rank`, LastName, FirstName, HotelName, RoomType, Status, CheckInDate, CheckOutDate, c.CompanyName, ModeOfPayment, h.h_rmrk AS ReasonOfStay, BookerRemarks " +
                                                                                "FROM tbloff_site_reservation o JOIN tbltpcompany c on o.CompanyId = c.CompanyID JOIN tblhotel_guest_remark_type h on h.id_h_rmrk = ReasonOfStay WHERE o.Status = 1 " +
                                                                                "OR o.Status = 2 OR o.Status = 3 ORDER BY MNNO ASC").ToList();
            return Ok(data);
        }

        public IHttpActionResult GetAccomodationDetailsById(int Id)
        {
            var data = _context.Database.SqlQuery<OffsiteAccomodationById>("SELECT Id, Status, h_rmrk AS ReasonOfStay, Remarks FROM tbloff_site_reservation osr JOIN tblhotel_guest_remark_type hgrt on osr.ReasonOfStay = hgrt.id_h_rmrk WHERE Id = " + Id).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationRequests()
        {
            //var data = _context.tbltransportations.OrderBy(m => m.Status).OrderByDescending(m => m.DateBooked).ToList();

            var data = _context.Database.SqlQuery<GetTransportationRequest>("SELECT * FROM tbltransportation ORDER BY status ASC, datebooked DESC").ToList();

            return Ok(data);
        }

        //public IHttpActionResult GetTransportationRequestById(int recordId)
        //{
        //    //var data = _context.Database.SqlQuery<TransportationModel>("SELECT tp.companyName, Inbound, Outbound, OneTrip, TwoTrips, Status, PickUp, DateTimeOfPickUp, " +
        //    //                "DropOff, SecondPickUp, SecondDateTimeOfPickUp, SecondDropOff, Notes FROM tbltransportation t JOIN tbltpcompany tp ON t.Company = tp.companyID " +
        //    //                "WHERE Id = " + recordId).ToList();

        //    var type = _context.Database.SqlQuery<string>("SELECT Type FROM tbltransportation WHERE Id = @id", new MySqlParameter("@id", recordId)).FirstOrDefault();

        //    if (type.Equals("Daily Transfer"))
        //    {
        //        List<DailyTransportationModel> dt_data = new List<DailyTransportationModel>();

        //        var data = _context.Database.SqlQuery<DailyTransportationModel>("SELECT IsRoundTrip, PickUpPlace, DateTimeOfPickUp, DropOffPlace, SecondPickUpPlace, SecondDateTimeOfPickUp, SecondDropOffPlace " +
        //                                                               "FROM tbldaily_transfer_details " +
        //                                                               "WHERE TransportationId = @id", new MySqlParameter("@id", recordId)).ToList();

        //        return Ok(data);
        //    }
        //    else if(type.Equals("Airport Transfer"))
        //    {
        //        //var data = _context.Database.SqlQuery<>
        //    }

        //    return Ok("");
        //}

        public IHttpActionResult GetSpecialScheduleRequests()
        {
            //var user = User.Identity.Name;

            //var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            var data = _context.tblspecialcourserequests.Where(m => m.Status == "In Process").Select(m => new SpecialCourseRequest
            {
                Id = m.Id,
                CourseName = m.CourseName,
                DateRequested = m.DateRequested,
                Notes = m.Notes,
                NumberOfParticipants = m.NumberOfParticipants,
                RequestedBy = m.RequestedBy,
                StartDate = m.StartDate,
                Status = m.Status
            }).OrderBy(m => m.CourseName).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetDormFees()
        {
            var data = _context.tbldorm_fees.Select(m => new DormFees
            {
                Id = m.dorm_fee_id,
                Price = m.price
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationAttachment(int recordId)
        {
            var data = _context.tbltransportations.Where(m => m.Id == recordId).Select(m => new Attachment
            {
                FileType = m.FileType,
                Picture = m.Attachment
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetNewCrewPicture(int recordId)
        {
            var data = _context.tblnewcrewrequests.Where(m => m.Id == recordId).Select(m => new Attachment
            {
                Picture = m.Picture
            }).ToList();

            return Ok(data);
        }

    }
}
