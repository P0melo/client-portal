using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Models
{
    public class CompanyProfileViewModel
    {

    }

    public class CompanyProfile
    {
        //public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
        public string ContactPerson { get; set; }
        public string ContactPersonPosition { get; set; }
        public string ContactNumber { get; set; }
        public string Country { get; set; }
        public byte[] Picture { get; set; }
        public string FileType { get; set; }
        public string Description { get; set; }

    }
}