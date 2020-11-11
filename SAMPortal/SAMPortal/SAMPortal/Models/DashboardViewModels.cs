using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Models
{
    public class DashboardViewModels
    {
    }

    public class NewCrewRegistrationViewModel
    {
        public string Position { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Birthday { get; set; }
        public string Contact { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Nation { get; set; }
        public string BirthPlace { get; set; }

        public IEnumerable<Nation> Nations { get; set; }
        public IEnumerable<Rank> Ranks { get; set; }
    }

    public class CheckForDuplicateRecord
    {
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string FName { get; set; }
        public string MName { get; set; }
        public string LName { get; set; }
        public DateTime BDate { get; set; }
    }

    public class Nation
    {
        public string Name { get; set; }
        public string Iso3 { get; set; }
    }

    public class Rank
    {
        public string CrewRank { get; set; }
        public string Description { get; set; }
        public string RankDesc { get; set; }
    }

    public class CrewViewModel
    {
        public IEnumerable<Crew> ListOfCrews { get; set; }
       
    }

    public class Crew
    {
        public string Mnno { get; set; }
        public string Position { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Birthday { get; set; }
        public string Contact { get; set; }
        public string Nation { get; set; }
        public string BirthPlace { get; set; }
    }

    public class MealProvision
    {
        public string Mnno { get; set; }
        public string Position { get; set; }
        public string Name { get; set; }
    }

    public class DuplicateReservation
    {
        public string Mnno { get; set; }
        public string Rank { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string ReservationType { get; set; }
        public string RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Status { get; set; }
    }

    public class RoomsFull
    {
        public string RoomsFullDates { get; set; }
    }

    public class MealProvisionLog
    {
        public long Id { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? Breakfast { get; set; }
        public int? Lunch { get; set; }
        public int? Dinner { get; set; }
        public int? MorningSnack { get; set; }
        public int? AfternoonSnack { get; set; }
        public string DietaryRequirement { get; set; }
        public string Reason { get; set; }
        public string ReferenceId { get; set; }
    }

    public class OffSiteAccommodationRequests
    {
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string HotelName { get; set; }
        public int RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int ModeOfPayment { get; set; }
        public string ReservationBy { get; set; }
        public string Status { get; set; }
        public string BookerRemarks { get; set; }
    }

    public class GetOffSiteAccommodationHistory
    {
        public int Id { get; set; }
        public string HotelName { get; set; }
        public int RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int ModeOfPayment { get; set; }
        public string ReservationBy { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string BookerRemarks { get; set; }
    }

    public class OnSiteAccommodationRequests
    {
        public int Id { get; set; }
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ReservationType { get; set; }
        public string RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Payment { get; set; }
        public string Status { get; set; }
    }

    public class GetOnSiteAccommodationHistory
    {
        public int Id{ get; set; }
        public string ReservationType { get; set; }
        public string RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Payment { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string Remarks { get; set; }
    }

    public class OnSiteAccommodationEdit
    {
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ReservationType { get; set; }
        public string RoomType { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Payment { get; set; }
        public string Reason { get; set; }
        public string Remarks { get; set; }

    }

    public class ServerDate
    {
        public string Day { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }
}