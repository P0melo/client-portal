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
    
    public partial class tbldormbooking
    {
        public long transNo { get; set; }
        public string bookingNo { get; set; }
        public Nullable<int> guestNo { get; set; }
        public string mnnum { get; set; }
        public string rank { get; set; }
        public string lastname { get; set; }
        public string firstname { get; set; }
        public string batchname { get; set; }
        public Nullable<System.DateTime> checkInDate { get; set; }
        public Nullable<System.DateTime> checkOutDate { get; set; }
        public string roomNo { get; set; }
        public string bedNo { get; set; }
        public string stats { get; set; }
        public string guest_remarks { get; set; }
        public string remarks { get; set; }
        public string booker_id { get; set; }
        public Nullable<long> extnsn_orgnl_id { get; set; }
        public Nullable<int> payee_guest { get; set; }
        public string maRefNo { get; set; }
        public Nullable<float> dollarAmount { get; set; }
        public Nullable<float> pesoAmount { get; set; }
        public string written_remarks { get; set; }
        public Nullable<int> guest_company { get; set; }
        public string vessel_designation { get; set; }
        public Nullable<int> crew_batch_no { get; set; }
        public Nullable<long> res_reference { get; set; }
        public string additional_comment { get; set; }
        public string crew_status_in { get; set; }
        public Nullable<System.DateTime> cc_date_in { get; set; }
        public string vessel_id_in { get; set; }
        public string crew_status_out { get; set; }
        public Nullable<System.DateTime> cc_date_out { get; set; }
        public string vessel_id_out { get; set; }
        public Nullable<System.DateTime> cc_date_declared { get; set; }
        public string vessel_id_declared { get; set; }
        public string crew_stat_declared { get; set; }
        public Nullable<System.DateTime> cc_signoffdate { get; set; }
        public string last_vessel_in { get; set; }
        public string last_vessel_out { get; set; }
    }
}
