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
    
    public partial class tbltraining
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbltraining()
        {
            this.tblschedules = new HashSet<tblschedule>();
        }
    
        public int SubjectCode { get; set; }
        public string SubjectArea { get; set; }
        public string Category { get; set; }
        public string SubjectName { get; set; }
        public string Subject_Shortname { get; set; }
        public string Active { get; set; }
        public Nullable<int> Training_classification { get; set; }
        public Nullable<int> web_display_courses { get; set; }
        public Nullable<int> Calendar_view_grp { get; set; }
        public Nullable<int> ThirdPartyOffer { get; set; }
        public Nullable<int> Vsble_CDandD { get; set; }
        public Nullable<int> STCW_courses { get; set; }
        public Nullable<int> DisplaySubject { get; set; }
        public Nullable<int> YearsValid { get; set; }
        public Nullable<int> OpeningMonths { get; set; }
        public string CourseCode { get; set; }
        public Nullable<float> NoHours { get; set; }
        public Nullable<float> CourseDuration { get; set; }
        public string AssignedRoom { get; set; }
        public Nullable<int> PassingMarks_Type { get; set; }
        public string PassingMarks { get; set; }
        public string PassingMarks_Remarks { get; set; }
        public string Min { get; set; }
        public Nullable<int> Max { get; set; }
        public Nullable<float> CourseFee { get; set; }
        public Nullable<float> PublishRate { get; set; }
        public string EntryStandards { get; set; }
        public string Prerequisite { get; set; }
        public string CourseOwner { get; set; }
        public string AssignedInstructor { get; set; }
        public string Assessor { get; set; }
        public string Supervisor { get; set; }
        public Nullable<System.DateTime> AccreditationExpirationDate { get; set; }
        public string RequestingCompany { get; set; }
        public Nullable<int> OnDemandOnly { get; set; }
        public string ResponsibleUser { get; set; }
        public Nullable<int> OpenTP { get; set; }
        public Nullable<int> UtilizationCount { get; set; }
        public Nullable<int> Classification { get; set; }
        public Nullable<int> MatrixCourse { get; set; }
        public Nullable<int> CertIssued { get; set; }
        public string Accreditor { get; set; }
        public string DocumentFormat { get; set; }
        public string Cadet_crse_clsfctn { get; set; }
        public Nullable<int> certAllowedNoGrade { get; set; }
        public Nullable<int> OnQuartSchedDispOnly { get; set; }
        public Nullable<int> IMTT_sub { get; set; }
        public Nullable<int> OnTheDayBooking { get; set; }
        public Nullable<int> CulinaryOrdering { get; set; }
        public Nullable<int> cdt_crse_dsply_matrix { get; set; }
        public string bus_act_id { get; set; }
        public Nullable<int> ETOOrdering { get; set; }
        public Nullable<int> MainCourse { get; set; }
        public Nullable<int> SubCourseClassification { get; set; }
        public Nullable<int> PaidCourse { get; set; }
        public Nullable<int> POTP_allowed_courses { get; set; }
        public Nullable<int> MNPI_cert_to_display { get; set; }
        public string TrainingType { get; set; }
        public string TrainingGroup { get; set; }
        public string Report_Course_Display { get; set; }
        public string AllowedConflictTraining { get; set; }
        public string UseTimeRestriction { get; set; }
        public string issue_certificate { get; set; }
        public string with_bhve_asstmnt { get; set; }
        public string opn_scheduling { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblschedule> tblschedules { get; set; }
    }
}
