﻿using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using SAMPortal.Models;
using SAMPortal.DTO;
using static SAMPortal.Controllers.ManageController;
using System.Text.RegularExpressions;
using SAMPortal.Enum;
using MySql.Data.MySqlClient;
using System.Web.Routing;
using System.Net.Mail;
using System.Net;

namespace SAMPortal.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private dbidentityEntities _context;
        private officecadetprogramEntities _cadetContext;
        private int changePasswordNotifShowInDays = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["changePasswordNotifShowInDays"]);
        private int passwordDurationLimitInDays = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["passwordDurationLimitInDays"]);
        private Logging logging;

        public AccountController()
        {
            _context = new dbidentityEntities();
            _cadetContext = new officecadetprogramEntities();
            logging = new Logging();
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var lockoutEnabled = _context.Database.SqlQuery<int>("SELECT LockoutEnabled FROM users WHERE Email = '" + model.Email + "'").FirstOrDefault();

            if (lockoutEnabled == 1)
            {
                return View("AccountLocked");
            }

            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    var UserId = SignInManager.AuthenticationManager.AuthenticationResponseGrant.Identity.GetUserId();
                    var latestPassword = _context.useroldpasswords.Where(m => m.UserId == UserId).Select(m => new UserPassword { PasswordHash = m.Password, TimeStamp = m.Timestamp }).OrderByDescending(m => m.TimeStamp).FirstOrDefault();

                    if (latestPassword != null)
                    {
                        //get servertime

                        var dt = DateTime.Now;

                        //get the timestamp of the latest password

                        var lastChangePasswordDate = latestPassword.TimeStamp;

                        //get the time difference of server time and last change of password
                        var differenceInDays = dt - lastChangePasswordDate;

                        if (passwordDurationLimitInDays - differenceInDays.Value.Days <= 0)
                        {
                            return RedirectToAction("Index", "Manage", new { Message = ManageMessageId.PasswordIsExpired });
                        }
                        else if (passwordDurationLimitInDays - differenceInDays.Value.Days <= changePasswordNotifShowInDays)
                        {
                            return RedirectToAction("Index", "Manage", new { Message = ManageMessageId.PasswordExpirationCountdown, days = (passwordDurationLimitInDays - differenceInDays.Value.Days) });
                        }
                    }

                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register(Guid companyId, long dateTicks)
        {
            DateTime createdDate = new DateTime(dateTicks);

            if ((DateTime.Now.Day - createdDate.Day) < 0 || (DateTime.Now.Day - createdDate.Day) > 1)
            {
                return View("RegisterLinkExpired");
            }

            var Id = Guid2Int(companyId);

            var result = _cadetContext.tbltpcompanies.Where(m => m.companyID == Id).Select(m => m.companyName).FirstOrDefault();

            var company = new RegisterViewModel
            {
                Company = result
            };

            return View(company);
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            try
            {
                Guid guid = new Guid(model.CompanyId);

                var companyId = Guid2Int(guid);

                var companyName = _cadetContext.tbltpcompanies.Where(m => m.companyID == companyId).Select(m => m.companyName).FirstOrDefault();

                if (ModelState.IsValid)
                {
                    var user = new ApplicationUser { UserName = model.Email, Email = model.Email, CompanyId = companyId, CompanyName = companyName, FirstName = model.FirstName, LastName = model.LastName };
                    var result = await UserManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {

                        var password = new useroldpassword { Password = user.PasswordHash, UserId = user.Id, Timestamp = DateTime.Now };
                        _context.useroldpasswords.Add(password);
                        _context.SaveChanges();

                        string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                        var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code }, protocol: Request.Url.Scheme);

                        WebMail.SmtpServer = @System.Configuration.ConfigurationManager.AppSettings["smtpServer"];
                        WebMail.SmtpPort = Convert.ToInt32(@System.Configuration.ConfigurationManager.AppSettings["smtpPort"]);
                        WebMail.EnableSsl = bool.Parse(@System.Configuration.ConfigurationManager.AppSettings["enableSSL"]);
                        WebMail.UserName = @System.Configuration.ConfigurationManager.AppSettings["userName"];
                        WebMail.Password = @System.Configuration.ConfigurationManager.AppSettings["password"];

                        WebMail.From = @System.Configuration.ConfigurationManager.AppSettings["sender"];

                        // send email
                        WebMail.Send(to: user.Email, subject: "Confirm your Account", body:
                            "Dear " + model.FirstName + ", <br /><br />" +
                            "Please click the following link to confirm your account:<br /><br />" +
                            "<a href=\"" + callbackUrl + "\">Confirm Account</a><br /><br />" +
                            "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                            "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged. " +
                            "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>"

                            , cc: "", bcc: "", isBodyHtml: true);

                        return View("ConfirmEmailSent", model);
                    }
                    AddErrors(result);
                }


                // If we got this far, something failed, redisplay form
                model.Company = companyName;
            }
            catch (Exception e)
            {
                logging.LogError(model.Email, "Register", e);
            }
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            //var data = _context.users.Where(m => m.Id == userId).Select(m => new { m.Email, m.FirstName }).FirstOrDefault();

            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);

            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                var x = await UserManager.IsEmailConfirmedAsync(user.Id);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code }, protocol: Request.Url.Scheme);
                //await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");

                SendEmail sendEmail = new SendEmail();
                sendEmail.SendForgotPassword(model.Email, callbackUrl);

                return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            PasswordHasher Hasher = new PasswordHasher();

            var passwords = _context.useroldpasswords.Where(m => m.UserId == user.Id).Select(m => new { m.UserId, m.Password }).ToList();

            foreach (var p in passwords)
            {
                var compareResult = Hasher.VerifyHashedPassword(p.Password, model.ConfirmPassword);
                if (compareResult == PasswordVerificationResult.Success)
                {
                    ModelState.AddModelError("", "One of your last 3 previous passwords is the same with your desired password");
                    return View(model);
                }
            }

            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);

            if (result.Succeeded)
            {

                //var user = await UserManager.FindByIdAsync(UserId);
                if (user != null)
                {
                    if (passwords.Count == 3)
                    {
                        var data = _context.useroldpasswords.Where(m => m.UserId == user.Id).Select(m => new UserPassword { Id = m.Id, UserId = m.UserId, TimeStamp = m.Timestamp, PasswordHash = m.Password }).OrderBy(m => m.TimeStamp).FirstOrDefault();

                        var oldestPassword = new useroldpassword
                        {
                            Id = data.Id,
                            Password = data.PasswordHash,
                            UserId = data.UserId
                        };
                        _context.useroldpasswords.Attach(oldestPassword);
                        _context.useroldpasswords.Remove(oldestPassword);
                        _context.SaveChanges();
                    }

                    var pass = Hasher.HashPassword(model.ConfirmPassword);

                    var NewPassword = new useroldpassword { Password = pass, UserId = user.Id, Timestamp = DateTime.Now };

                    _context.useroldpasswords.Add(NewPassword);
                    _context.SaveChanges();

                }

                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Login", "Account");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                if (error.StartsWith("Name"))
                {
                    var NameToEmail = Regex.Replace(error, "Name", "Email");
                    ModelState.AddModelError("", NameToEmail);
                }
                else
                {
                    ModelState.AddModelError("", error);
                }
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }

        public static int Guid2Int(Guid value)
        {
            byte[] b = value.ToByteArray();
            int bint = BitConverter.ToInt32(b, 4);
            return bint - 66826682;
        }

        public class CustomAuthorize: AuthorizeAttribute
        {
            protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
            {
                if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
                {
                    filterContext.Result = new HttpUnauthorizedResult();
                }
                else
                {
                    filterContext.Result = new RedirectToRouteResult(new
                        RouteValueDictionary(new { controller = "Account" }));
                }
            }
        }
        #endregion
    }
}