using MySql.Data.MySqlClient;
using SAMPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace SAMPortal.Controllers.Api
{
    [System.Web.Http.Authorize]
    public class FormsController : ApiController
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;

        public FormsController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
        }

        //GET: /api/GetCrewList
        public IHttpActionResult GetCrewList()
        {
            var company = GetCompany();

            var data = _context.tblcrews.Where(m => m.Employer == company).Select(m => new Crew
            {
                Mnno = m.MNNO,
                Position = m.Rank,
                Name = string.Concat(m.LName, ", ", m.FName, " ", m.MName),
                Nation = m.Nationality,
                Birthday = m.BDate.ToString(),
                BirthPlace = m.BPlace,
                Contact = m.ContactNo,
                Gender = m.Gender
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetNewCrewRequestFromRequests()
        {
            var company = GetCompany();

            //status = 1 is new request, status = 2 is approved, status = 0 is denied
            var data = _context.Database.SqlQuery<ReviewNewCrewRegistration>("select n.Id, n.MNNO, n.Position, n.FirstName, n.LastName, n.MiddleName as MiddleInitial, " +
                                                                             "n.Birthday, n.BirthPlace,n.Company, t.companyName, n.EnteredBy, n.Picture, n.Status " +
                                                                             "from tblnewcrewrequest n join tbltpcompany t on n.Company = t.companyID where companyID = @company order by position asc",
                                                                             new MySqlParameter("@company", company)).ToList();
            return Ok(data);
        }

        public IHttpActionResult GetCrewDetails(string mnno)
        {
            var company = GetCompany();

            var data = _context.tblcrews.Where(m => m.Employer == company && m.MNNO == mnno).Select(m => new MealProvision
            {
                Position = m.Rank,
                Name = m.LName + ", " + m.FName + " " + m.MName,
                Mnno = m.MNNO
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetMealProvisionLog(string mnno)
        {

            var data = _context.Database.SqlQuery<MealProvisionLog>("SELECT meal_id as Id, MIN(meal_date_from) as FromDate, max(meal_date_from) as ToDate, meal_reason as Reason, " +
                                                             "reference_id as ReferenceId FROM tblmeal_provision WHERE Mnno = @mnno GROUP BY reference_id",
                                                             new MySqlParameter("@mnno", mnno)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetMealsProvisionByReference(string referenceId)
        {
            //var data = _context.tblmeal_provision.Where(m => m.reference_id == referenceId).Select(m => new MealProvisionLog
            //{
            //    Id = m.meal_id,
            //    Breakfast = m.meal_b,
            //    MorningSnack = m.meal_ms,
            //    Lunch = m.meal_l,
            //    AfternoonSnack = m.meal_as,
            //    Dinner = m.meal_d,
            //    FromDate = m.meal_date_from,
            //    ToDate = m.meal_date_to,
            //    Reason = m.meal_reason,
            //}).ToList();

            var data = _context.Database.SqlQuery<MealProvisionLog>("SELECT meal_id as Id, meal_b as Breakfast, meal_ms as MorningSnack, meal_l as Lunch, meal_as as AfternoonSnack, meal_d as Dinner, " +
                "meal_date_from as FromDate, meal_date_to as ToDate, meal_reason as Reason FROM tblmeal_provision WHERE reference_id = '" + referenceId + "'").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCrewDetailsForAccomodation(string mnno)
        {

            var company = GetCompany();

            var data = _context.tblcrews.Where(m => m.Employer == company && m.MNNO == mnno).Select(m => new MealProvision
            {
                Position = m.Rank,
                Name = m.LName + ", " + m.FName + " " + m.MName,
                Mnno = m.MNNO
            }).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetOffSiteAccommodationRequests()
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<OffSiteAccommodationRequests>("SELECT Mnno, `Rank`, FirstName, LastName, HotelName, RoomType, CheckInDate" + 
                                                                            ", CheckOutDate, ModeOfPayment, ReservationBy, oss.Name AS Status, BookerRemarks FROM tbloff_site_reservation osr JOIN tbloff_site_status oss ON osr.Status = oss.Id WHERE CompanyId = @company",
                                                                            new MySqlParameter("@company", company)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationRequests()
        {
            var company = GetCompany();

            //var data = _context.tbltransportations.Where(m => m.Company == company).OrderBy(m => m.Status).OrderByDescending(m => m.DateBooked).ToList();

            var data = _context.Database.SqlQuery<GetTransportationRequest>("SELECT * FROM tbltransportation ORDER BY status ASC, datebooked DESC").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetOnSiteAccommodationRequests()
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<OnSiteAccommodationRequests>("SELECT rsrvtn_id AS Id, MNNO, `Rank`, FirstName, LastName, type_of_reservation AS ReservationType, room_type AS RoomType, expctd_checkInDate AS CheckInDate, " +
                                                                            "expctd_checkOutDate AS CheckOutDate, mode_of_pymnt as Payment, stats AS Status FROM tbldorm_reservation_bank WHERE company_name = @company AND stats = 'Reserved'",
                                                                            new MySqlParameter("@company", company)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetOnSiteReservationById(int id)
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<OnSiteAccommodationEdit>("SELECT MNNO, `Rank`, FirstName, LastName, type_of_reservation AS ReservationType, room_type AS RoomType, expctd_checkInDate AS CheckInDate, " +
                                                                        "expctd_checkOutDate AS CheckOutDate, mode_of_pymnt as Payment, reason_of_stay AS Reason, remarks AS Remarks FROM tbldorm_reservation_bank WHERE rsrvtn_id = @id",
                                                                        new MySqlParameter("@id", id)).FirstOrDefault();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationAttachment(int recordId)
        {
            //var data = _context.tbltransportations.Where(m => m.Id == recordId).Select(m => new Attachment
            //{
            //    FileType = m.FileType,
            //    Picture = m.Attachment
            //}).ToList();

            var data = _context.Database.SqlQuery<Attachment>("SELECT FileType, Attachment as Picture FROM tblairport_transfer_details WHERE TransportationId = @id", new MySqlParameter("@id", recordId)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetCompanyProfileDetails()
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<CompanyProfile>("SELECT companyName, companyEmail as Email, companyLocation as Location, contactPerson, contactPersonPos as ContactPersonPosition, " + 
                                                                "companyContactNo as ContactNumber, description, logo as Picture, imageFileType as FileType FROM tbltpcompany WHERE companyID = @company",
                                                                new MySqlParameter("@company", company)).FirstOrDefault();

            return Ok(data);
        }

        public int GetCompany()
        {
            var user = User.Identity.Name;

            var company = _usercontext.users.Where(m => m.Email == user).Select(m => m.CompanyId).FirstOrDefault();

            return company;
        }

        public IHttpActionResult GetServerDate()
        {
            var data = _context.Database.SqlQuery<string>("SELECT CURDATE()").FirstOrDefault();

            return Ok(data);
        }

        public IHttpActionResult GetRanks()
        {
            var data = _context.tblranks.Select(m => new Rank { CrewRank = m.rank, Description = m.description, RankDesc = string.Concat(m.rank, " - ", m.description) }).ToList();

            return Ok(data);
        }

        //public IHttpActionResult 
    }
}
