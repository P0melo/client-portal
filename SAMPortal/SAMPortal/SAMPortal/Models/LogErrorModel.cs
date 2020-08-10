using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Models
{
    public class LogErrorModel
    {
        public int LogId { get; set; }
        public string Event { get; set; }
        public string Description { get; set; }
        public string User { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}