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
    
    public partial class tbltraining_attendees
    {
        public int Attendance_id { get; set; }
        public Nullable<int> SchedID { get; set; }
        public Nullable<System.DateTime> SchedDate { get; set; }
        public Nullable<System.TimeSpan> TimeFrom { get; set; }
        public Nullable<System.TimeSpan> TimeTo { get; set; }
        public Nullable<int> RoomNo { get; set; }
        public Nullable<int> TrainerID { get; set; }
        public Nullable<int> TrainerID2 { get; set; }
        public string Attendees { get; set; }
        public string Absent { get; set; }
        public Nullable<System.DateTime> TimeChecked { get; set; }
    }
}
