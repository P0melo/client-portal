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
    
    public partial class tbldormbed
    {
        public int bedNo { get; set; }
        public string bedName { get; set; }
        public string roomNo { get; set; }
        public string availability { get; set; }
        public string active { get; set; }
        public string matrix_display { get; set; }
        public string bldg_no { get; set; }
        public string floor { get; set; }
        public string type { get; set; }
        public Nullable<int> allow_auto_search { get; set; }
        public Nullable<int> allow_batch_booking { get; set; }
        public Nullable<int> backup_rooms_for_booking { get; set; }
        public Nullable<int> pandi_room { get; set; }
    }
}
