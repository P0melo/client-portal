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
    
    public partial class tblcbtscheddetail
    {
        public int RecordNo { get; set; }
        public int SchedID { get; set; }
        public int CBTID { get; set; }
        public Nullable<System.DateTime> SchedDate { get; set; }
        public Nullable<double> HoursTaken { get; set; }
        public Nullable<System.DateTime> DateTaken { get; set; }
        public string Score { get; set; }
        public string TotalCompleted { get; set; }
        public string Status { get; set; }
        public string CertNo { get; set; }
        public string serialno { get; set; }
        public string Export { get; set; }
        public string Graded_by { get; set; }
        public Nullable<System.DateTime> Date_graded { get; set; }
        public string Edited_by { get; set; }
        public Nullable<System.DateTime> Date_edited { get; set; }
        public string Uploaded_status { get; set; }
        public string vesselcode { get; set; }
        public Nullable<System.DateTime> Uploaded_date { get; set; }
        public string MNNo { get; set; }
        public string import_id { get; set; }
    
        public virtual tblcbtsched tblcbtsched { get; set; }
        public virtual tblcbttraining tblcbttraining { get; set; }
    }
}
