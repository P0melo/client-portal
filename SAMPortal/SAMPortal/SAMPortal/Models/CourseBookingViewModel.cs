using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Models
{
    public class CourseBookingViewModel
    {

    }

    public class CourseListModel
    {
        public string SchedID { get; set; }
        public string CourseName { get; set; }
        public int? CourseDuration { get; set; }
        public string MinCapacity { get; set; }
        public int? MaxCapacity { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int Slots { get; set; }
    }

    public class CourseEnrollees
    {
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string LName { get; set; }
        public string FName { get; set; }
        public string MName { get; set; }
        public string Contact { get; set; }
        public string CompanyId { get; set; }
        public string RegistrationNo { get; set; }
    }

    public class OnSiteAccommodationFeesModel
    {
        public int RoomType { get; set; }
        public string AccommodationType { get; set; }
        public float PricePerPax { get; set; }
        public int NumberOfBooking { get; set; }
        public float TotalCost { get; set; }
    }

    public class MealFeesModel
    {
        public int Id { get; set; }
        public string Meal { get; set; }
        public float price { get; set; }
    }

    public class MealCountAndTotalCostModel
    {
        public int BreakfastCount { get; set; }
        public int BreakfastCost { get; set; }
        public int LunchCount { get; set; }
        public int LunchCost { get; set; }
        public int DinnerCount { get; set; }
        public int DinnerCost { get; set; }
        public int MorningSnackCount { get; set; }
        public int MorningSnackCost { get; set; }
        public int AfternoonSnackCount { get; set; }
        public int AfternoonSnackCost { get; set; }
    }

    public class AirportTransportationFees
    {
        public int FeeId { get; set; }
        public string VehicleType { get; set; }
        public float Price { get; set; }
    }

    public class CourseNames
    {
        public string CourseName { get; set; }
        public string Min { get; set; }
        public string Max { get; set; }
        public int CourseDuration { get; set; }
    }

    //public class Company
    //{
    //    public int CompanyId { get; set; }
    //    public string CompanyName { get; set; }
    //}

    public class SpecialCourseRequest
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public DateTime StartDate { get; set; }
        public int NumberOfParticipants { get; set; }
        public string Notes { get; set; }
        public DateTime DateRequested { get; set; }
        public string RequestedBy { get; set; }
        public string Status { get; set; }
        public string CompanyName { get; set; }
    }

    public class CourseFirstDateTime
    {
        public DateTime? SchedDate { get; set; }
        public string TimeFrom { get; set; }
    }

}