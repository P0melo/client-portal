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
    
    public partial class tblcbtsched
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tblcbtsched()
        {
            this.tblcbtscheddetails = new HashSet<tblcbtscheddetail>();
        }
    
        public int SchedID { get; set; }
        public string MNNo { get; set; }
        public Nullable<System.DateTime> DateFrom { get; set; }
        public string DateTo { get; set; }
        public string Remarks { get; set; }
        public Nullable<int> RequestedBy { get; set; }
        public Nullable<int> ScheduledBy { get; set; }
        public Nullable<System.DateTime> DateScheduled { get; set; }
        public string NormalInput { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblcbtscheddetail> tblcbtscheddetails { get; set; }
    }
}
