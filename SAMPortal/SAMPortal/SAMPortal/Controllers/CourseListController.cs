using SAMPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SAMPortal.Controllers
{
    [AccountController.CustomAuthorize]
    public class CourseListController : Controller
    {
        private officecadetprogramEntities _context;
        private dbidentityEntities _usercontext;

        public CourseListController()
        {
            _context = new officecadetprogramEntities();
            _usercontext = new dbidentityEntities();
        }

        // GET: CourseList
        public ActionResult Index()
        {
            _context.Database.SqlQuery<CourseListViewModel>("SELECT tt.CourseCode AS CourseCode, tt.SubjectName AS SubjectName, tc.id AS TrainingClassification, tc.classification AS Classification "
                                        + "FROM tblschedule ts "
                                        + "JOIN tbltrainings tt ON ts.TrainingID = tt.SubjectCode "
                                        + "JOIN tbltrainingclassification tc ON  tt.Training_classification = tc.id "
                                        + "WHERE bookergroup LIKE '%5%' GROUP BY tt.CourseCode, tt.SubjectName");
            return View();
        }

    }
}