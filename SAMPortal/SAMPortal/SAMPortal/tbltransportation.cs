//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SAMPortal
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbltransportation
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
    
        public virtual tblcrew tblcrew { get; set; }
    }
}
