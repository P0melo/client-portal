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
    
    public partial class tblcountry
    {
        public int country_id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string full_name { get; set; }
        public string iso3 { get; set; }
        public int number { get; set; }
        public string continent_code { get; set; }
        public int display_order { get; set; }
    
        public virtual tblcontinent tblcontinent { get; set; }
    }
}
