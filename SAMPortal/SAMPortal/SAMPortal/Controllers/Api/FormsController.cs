﻿using MySql.Data.MySqlClient;
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

            var companyGroupId = GetCompanyGroupId();

            //var data = _context.tblcrews.Where(m => m.Employer == company).Select(m => new Crew
            //{
            //    Mnno = m.MNNO,
            //    Position = m.Rank,
            //    Name = string.Concat(m.LName, ", ", m.FName, " ", m.MName),
            //    Nation = m.Nationality,
            //    Birthday = m.BDate.ToString(),
            //    BirthPlace = m.BPlace,
            //    Contact = m.ContactNo,
            //    Gender = m.Gender
            //}).ToList();

            List<Crew> data = new List<Crew>();

            data = _context.Database.SqlQuery<Crew>("SELECT MNNO, Rank AS Position, CONCAT(COALESCE(LName, ''), ', ', COALESCE(FName, ''), ' ', COALESCE(LEFT(MName, 1), '')) AS Name, BDate AS Birthday, Gender, c.Employer " +
                    "FROM tblcrew c JOIN tbltpcompany tp ON c.Employer = tp.companyID " +
                    "WHERE tp.companygroupID = " + companyGroupId).ToList();

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

            var data = _context.Database.SqlQuery<MealProvisionLog>("SELECT meal_id as Id, MIN(meal_date_from) as FromDate, max(meal_date_from) as ToDate, meal_reason as Reason, DietaryRequirement, " +
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

        public IHttpActionResult GetOffSiteAccommodationHistory(string mnno)
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<GetOffSiteAccommodationHistory>("SELECT osr.Id, HotelName, RoomType, CheckInDate" +
                                                                            ", CheckOutDate, ModeOfPayment, ReservationBy, oss.Name AS Status, BookerRemarks, ReasonOfStay AS Reason FROM tbloff_site_reservation osr JOIN tbloff_site_status oss ON osr.Status = oss.Id WHERE CompanyId = @company AND MNNO = @mnno",
                                                                            new MySqlParameter("@company", company),
                                                                            new MySqlParameter("@mnno", mnno)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationRequests()
        {
            var company = GetCompany();

            //var data = _context.tbltransportations.Where(m => m.Company == company).OrderBy(m => m.Status).OrderByDescending(m => m.DateBooked).ToList();

            var data = _context.Database.SqlQuery<GetTransportationRequest>("SELECT * FROM tbltransportation ORDER BY status ASC, datebooked DESC").ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationHistory(string mnno)
        {
            var company = GetCompany();

            //var data = _context.tbltransportations.Where(m => m.Company == company).OrderBy(m => m.Status).OrderByDescending(m => m.DateBooked).ToList();

            var data = _context.Database.SqlQuery<GetTransportationHistory>("SELECT Id, Type, Vehicle, Status, Notes, ReferenceId, DateBooked FROM tbltransportation WHERE Company = @company AND Mnno = @mnno ORDER BY status ASC, datebooked DESC",
                                                                          new MySqlParameter("@company", company),
                                                                          new MySqlParameter("@mnno", mnno)).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationHistoryDetails(string referenceId, string type)
        {
            var data = "";

            if (type == "Airport Transfer")
            {
                var details = _context.Database.SqlQuery<AirportTransportationModel>("SELECT t.Id, Inbound, Outbound, InboundDate, OutboundDate, FileType, Attachment as Picture, Notes " +
                                                           "FROM tbltransportation t JOIN tblairport_transfer_details atd ON t.Id = atd.TransportationId " +
                                                           "WHERE ReferenceId = @rid", new MySqlParameter("@rid", referenceId)).FirstOrDefault();

                return Ok(details);
            }
            else if (type == "Daily Transfer")
            {

                var details = _context.Database.SqlQuery<DailyTransportationModel>("SELECT IsRoundTrip, PickUpPlace, DateTimeOfPickUp, DropOffPlace, SecondPickUpPlace, SecondDateTimeOfPickUp, SecondDropOffPlace, Notes " +
                                                                       "FROM tbltransportation t JOIN tbldaily_transfer_details dtd ON t.Id = dtd.TransportationId " +
                                                                       "WHERE ReferenceId = @id", new MySqlParameter("@id", referenceId)).ToList();

                return Ok(details);
            }


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

        public IHttpActionResult GetOnSiteAccommodationHistory(string mnno)
        {
            var company = GetCompany();

            var data = _context.Database.SqlQuery<GetOnSiteAccommodationHistory>("SELECT rsrvtn_id AS Id, MNNO, `Rank`, FirstName, LastName, type_of_reservation AS ReservationType, room_type AS RoomType, expctd_checkInDate AS CheckInDate, " +
                                                                            "expctd_checkOutDate AS CheckOutDate, mode_of_pymnt as Payment, remarks AS Remarks, stats AS Status, reason_of_stay AS Reason FROM tbldorm_reservation_bank WHERE company_name = @company AND MNNO = @mnno",
                                                                            new MySqlParameter("@company", company),
                                                                            new MySqlParameter("@mnno", mnno)).ToList();

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

        public int GetCompanyGroupId()
        {
            var companyGroupId = _context.Database.SqlQuery<int>("SELECT companyGroupId " +
                "FROM dbidentity.users u JOIN officecadetprogram.tbltpcompany tp ON u.companyId = tp.companyID " +
                "WHERE u.email = '" + User.Identity.Name + "' AND u.companyId = " + GetCompany()).FirstOrDefault();

            return companyGroupId;
        }

        public IHttpActionResult GetServerDate()
        {
            var data = _context.Database.SqlQuery<string>("SELECT DATE_FORMAT(CURDATE(), '%d-%m-%Y')").FirstOrDefault();



            return Ok(data);
        }

        public IHttpActionResult GetDailyTransferRequestForEdit(int recordId)
        {
            var data = _context.Database.SqlQuery<GetDailyTransferRequestForEditModel>("SELECT t.Id, IsRoundTrip AS Type, Vehicle, Status, Notes, ReferenceId,IsRoundTrip,PickUpPlace,DateTimeOfPickUp,DropOffPlace,SecondPickUpPlace,SecondDateTimeOfPickUp,SecondDropOffPlace, td.Id AS DtId " +
                            "FROM tbltransportation t JOIN tbldaily_transfer_details td " +
                            "on t.Id = td.TransportationId " +
                            "WHERE t.Id = " + recordId).ToList();

            return Ok(data);
        }

        public IHttpActionResult GetTransportationRates()
        {
            //var data = _context.Database.SqlQuery<GetTransportationRatesModel>("SELECT transpo_fee_id AS Id, transpo_type AS Type, vehicle_type AS Vehicle, destination AS Destination, rate_usd AS Price " +
            //                "FROM tbltransportation_fee").ToList();

            var dailyTransferRate = _context.Database.SqlQuery<DailyTransportationRates>("SELECT vehicle_type AS VehicleType, sum(CASE WHEN destination = 'Manila' THEN rate_usd ELSE 0 END) AS Manila," +
                "sum(CASE WHEN destination = 'Makati' THEN rate_usd ELSE 0 END) AS Makati," +
                "sum(CASE WHEN destination = 'Pasay' THEN rate_usd ELSE 0 END) AS Pasay " +
                "FROM tbltransportation_fee " +
                "WHERE transpo_type = 'Daily Transfer' " +
                "AND destination IN('Manila', 'Makati', 'Pasay') " +
                "GROUP BY vehicle_type").ToList();

            var airportTransferRate = _context.Database.SqlQuery<AirportTransportationRates>("SELECT rate_usd AS Rate " +
                "FROM tbltransportation_fee " +
                "WHERE transpo_type = 'Airport Transfer'").ToList();

            return Json(new { dailyTransferRate, airportTransferRate });
        }

        public IHttpActionResult GetMealsRates()
        {
            var data = _context.Database.SqlQuery<MealsRates>("SELECT meal_description AS MealDescription, meal, price FROM tblmeal_fees").ToList();

            return Ok(data);
        }
    }
}
