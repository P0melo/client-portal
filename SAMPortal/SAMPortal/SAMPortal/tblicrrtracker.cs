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
    
    public partial class tblicrrtracker
    {
        public int ID { get; set; }
        public string Department { get; set; }
        public string DepartmentHead { get; set; }
        public string SystemName { get; set; }
        public string ICRRNumber { get; set; }
        public System.DateTime DocumentDate { get; set; }
        public string RequestedBy { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public string Reason { get; set; }
        public string DetailsOfEvaluation { get; set; }
        public string Recommendation { get; set; }
        public string AssignedTo { get; set; }
        public string EnteredBy { get; set; }
        public System.DateTime DateEntered { get; set; }
        public Nullable<int> Attachment { get; set; }
    }
}
