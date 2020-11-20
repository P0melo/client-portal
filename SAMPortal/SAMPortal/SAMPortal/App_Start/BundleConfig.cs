using System.Web;
using System.Web.Optimization;

namespace SAMPortal
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.signalR-2.4.1.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/themes/base/jquery-ui.css",
                      "~/Content/site.css",
                      "~/admin-lte/css/AdminLTE.css",
                      "~/admin-lte/css/skins/skin-red.css",
                      "~/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css",
                      "~/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css",
                      "~/Content/font-awesome/css/font-awesome.min.css",
                      "~/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
                      "~/admin-lte/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
                      "~/admin-lte/bower_components/bootstrap-daterangepicker/daterangepicker.css",
                      "~/admin-lte/plugins/pace/pace.css",
                      "~/Content/jquery.timepicker.min.css",
                      "~/Content/select2-4.0.6-rc.1/dist/css/select2.min.css",
                      "~/Content/select2-4.0.6-rc.1/dist/css/select2-bootstrap.min.css",
                      "~/DataTables/datatables.min.css"
                      ));

            bundles.Add(new ScriptBundle("~/adminlte/js").Include(
             "~/Scripts/jquery-ui-{version}.js",
             "~/Scripts/modernizr-*",
             "~/admin-lte/js/adminlte.js",
             "~/admin-lte/plugins/fastclick/fastclick.js",
             "~/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js",
             "~/admin-lte/bower_components/PACE/pace.js",
             "~/admin-lte/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
             "~/admin-lte/bower_components/moment/moment.js",
             "~/admin-lte/bower_components/bootstrap-daterangepicker/daterangepicker.js",
             "~/Scripts/jquery.timepicker.min.js",
             "~/Content/select2-4.0.6-rc.1/dist/js/select2.min.js",
             "~/Scripts/jquery.blockUi.js",
             "~/Scripts/jquery.zoom.min.js",
             "~/DataTables/datatables.min.js",
             "~/Scripts/userscript.js",
             "~/Scripts/dashboard.js",
             "~/Scripts/CrewSearch.js"
             ));

            bundles.Add(new ScriptBundle("~/bundles/accommodation").Include(
             "~/Scripts/Accommodation.js"    
            ));

            bundles.Add(new ScriptBundle("~/bundles/administration").Include(
             "~/Scripts/administration.js",
             "~/Scripts/registeredaccounts.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/certificates").Include(
             "~/Scripts/Certificates.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/companyprofile").Include(
             "~/Scripts/CompanyProfile.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/contactus").Include(
             "~/Scripts/ContactUs.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/coursebooking").Include(
             "~/Scripts/CourseBooking.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/customerfeedback").Include(
             "~/Scripts/CustomerFeedback.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/home").Include(
             "~/Scripts/Home.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/newcrewregistration").Include(
             "~/Scripts/NewCrewRegistration.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/manage").Include(
             "~/Scripts/Manage.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/meals").Include(
             "~/Scripts/Meals.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/offsiteaccommodation").Include(
             "~/Scripts/OffSiteAccommodation.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/requests").Include(
             "~/Scripts/Requests.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/transportation").Include(
             "~/Scripts/Transportation.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/crewlist").Include(
             "~/Scripts/CrewList.js"
            ));
        }
    }
}
