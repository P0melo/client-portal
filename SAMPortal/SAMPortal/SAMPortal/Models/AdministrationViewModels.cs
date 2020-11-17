using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Models
{
    public class AdministrationViewModels
    {

    }

    public class ReviewNewCrewRegistration
    {
        public string Position { get; set; }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleInitial { get; set; }
        public string Gender { get; set; }
        public string Nationality { get; set; }
        public DateTime? Birthday { get; set; }
        public string BirthPlace { get; set; }
        public string Contact { get; set; }
        public int Company { get; set; }
        public string CompanyName { get; set; }
        public string EnteredBy { get; set; }
        public byte[] Picture { get; set; }
        public int Status { get; set; }
        public string MNNO { get; set; }
    }

    public class OffSiteAccommodationViewModel
    {
        public int Id { get; set; }
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string HotelName { get; set; }
        public int RoomType { get; set; }
        public string Status { get; set; }
        public string CompanyName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int ModeOfPayment { get; set; }
        public string ReasonOfStay { get; set; }
        public string BookerRemarks { get; set; }

        public String[] ToArray()
        {
            List<string> arr = new List<string>();

            foreach (var prop in typeof(OffSiteAccommodationViewModel).GetProperties())
            {
                string value = "";
                if (prop.GetValue(this, null) != null)
                {
                    value = prop.GetValue(this, null).ToString();
                }

                arr.Add(value);
            }

            return arr.ToArray();
        }
    }

    public class OffSiteAccommodationStatusViewModel
    {
        public string Status { get; set; }
        public IEnumerable<OffSiteStatus> Option { get; set; }
    }

    public class OffSiteStatus
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class OffsiteAccomodationById
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public string ReasonOfStay { get; set; }
        public string Remarks { get; set; }
    }


    public class TransportationModel
    {
        public string CompanyName { get; set; }
        public int Inbound { get; set; }
        public int Outbound { get; set; }
        public int OneTrip { get; set; }
        public int TwoTrips { get; set; }
        public string Status { get; set; }
        public string PickUp { get; set; }
        public string DateTimeOfPickUp { get; set; }
        public string DropOff { get; set; }
        public string SecondPickUp { get; set; }
        public string SecondDateTimeOfPickUp { get; set; }
        public string SecondDropOff { get; set; }
        public string Notes { get; set; }
    }

    public class AirportTransportationModel
    {
        public int Id { get; set; }
        public int Inbound { get; set; }
        public int Outbound { get; set; }
        public DateTime? InboundDate { get; set; }
        public DateTime? OutboundDate { get; set; }
        public string FileType { get; set; }
        public byte[] Picture { get; set; }
        public string Notes { get; set; }

    }

    public class CancelOffSiteAccommodationModel
    {
        public string MNNO { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string HotelName { get; set; }
        public int RoomType { get; set; }
    }

    //public class CancelTransportationModel
    //{
    //    public string MNNO { get; set; }
    //    public string Type { get; set; }
    //    public string Vehicle { get; set; }
    //    public string ReferenceId { get; set; }
    //}

    public class Attachment
    {
        public string FileType { get; set; }
        public byte[] Picture { get; set; }
    }

    public class DailyTransportationModel
    {
        public int IsRoundTrip { get; set; }
        public string PickUpPlace { get; set; }
        public string DateTimeOfPickUp { get; set; }
        public string DropOffPlace { get; set; }
        public string SecondPickUpPlace { get; set; }
        public string SecondDateTimeOfPickUp { get; set; }
        public string SecondDropOffPlace { get; set; }
        public string Notes { get; set; }

    }

    public class DailyTransportationTypeAndNotes
    {
        public string Type { get; set; }
        public string Notes { get; set; }

    }

    public class TransportationRequestModel
    {
        public string MNNO { get; set; }
        public string Rank { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Type { get; set; }
        public string Vehicle { get; set; }
        public DateTime Date { get; set; }
        public bool Inbound { get; set; }
        public bool Outbound { get; set; }
        public bool OneTrip { get; set; }
        public bool TwoTrips { get; set; }
        public string Status { get; set; }
        public string PickUp { get; set; }
        public string DateTimeOfPickUp { get; set; }
        public string DropOff { get; set; }
        public string SecondPickUp { get; set; }
        public string SecondDateTimeOfPickUp { get; set; }
        public string SecondDropOff { get; set; }
        public string Notes { get; set; }
        public string ReferenceId { get; set; }
        public DateTime DateBooked { get; set; }
        public string RequestedBy { get; set; }

        public String[] ToArray()
        {
            List<string> arr = new List<string>();

            foreach (var prop in typeof(TransportationRequestModel).GetProperties())
            {
                string value = "";
                if (prop.GetValue(this, null) != null)
                {
                    value = prop.GetValue(this, null).ToString();
                }

                arr.Add(value);
            }

            return arr.ToArray();
        }
    }

    public class GetTransportationRequest
    {
        public int Id { get; set; }
        public string Mnno { get; set; }
        public string Rank { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Company { get; set; }
        public string Type { get; set; }
        public string Vehicle { get; set; }
        public System.DateTime Date { get; set; }
        public bool Inbound { get; set; }
        public bool Outbound { get; set; }
        public bool OneTrip { get; set; }
        public bool TwoTrips { get; set; }
        public string Status { get; set; }
        public string PickUp { get; set; }
        public string DateTimeOfPickUp { get; set; }
        public string DropOff { get; set; }
        public string SecondPickUp { get; set; }
        public string SecondDateTimeOfPickUp { get; set; }
        public string SecondDropOff { get; set; }
        public string Notes { get; set; }
        public string FileType { get; set; }
        public byte[] Attachment { get; set; }
        public string ReferenceId { get; set; }
        public System.DateTime DateBooked { get; set; }
        public string RequestedBy { get; set; }
    }

    public class GetTransportationHistory
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Vehicle { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string ReferenceId { get; set; }
        public DateTime DateBooked { get; set; }
    }

    public class DormFees
    {
        public int Id { get; set; }
        public float? Price { get; set; }
    }
}