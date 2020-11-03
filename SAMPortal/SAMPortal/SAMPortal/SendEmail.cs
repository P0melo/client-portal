using Microsoft.AspNet.Identity;
using SAMPortal.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Helpers;

namespace SAMPortal
{
    public class SendEmail
    {

        private readonly string smtpServer = null;
        private readonly int smtpPort = 0;
        private readonly bool enableSSL = false;
        private readonly string userName = null;
        private readonly string password = null;
        private readonly string sender = null;
        private readonly string receipient = null;


        public SendEmail()
        {
            smtpServer = @System.Configuration.ConfigurationManager.AppSettings["smtpServer"];
            smtpPort = Convert.ToInt32(@System.Configuration.ConfigurationManager.AppSettings["smtpPort"]); ;
            enableSSL = bool.Parse(@System.Configuration.ConfigurationManager.AppSettings["enableSSL"]); ;
            userName = @System.Configuration.ConfigurationManager.AppSettings["userName"]; ;
            password = @System.Configuration.ConfigurationManager.AppSettings["password"]; ;
            sender = @System.Configuration.ConfigurationManager.AppSettings["sender"]; ;
            receipient = @System.Configuration.ConfigurationManager.AppSettings["emailreceipients"]; ;
        }

        public void Send(IIdentity user, int request, string additionalMessage)
        {
            WebMail.SmtpServer = smtpServer;
            // port to send emails
            WebMail.SmtpPort = smtpPort;
            //WebMail.SmtpUseDefaultCredentials = true;
            //sending email with secure protocol
            WebMail.EnableSsl = enableSSL;
            // email id used to send emails from application
            WebMail.UserName = userName;
            WebMail.Password = password;
            WebMail.From = sender;

            string email = receipient;
            // create a cleaner solution

            if (request == (int)Requests.OnSiteAccommodationRequest)
            {
                //"MNNO:" + mnno +"|reservationtype:" + reservation_type + "|room_type:" + room_type + "|classification:" + 
                //classification + "|checkindatefrom:" + checkInDateTimeFrom + "|checkindateto:" + checkInDateTimeTo

                var data = additionalMessage.Split('|');
                var mnno = data[0].Split(':')[1];
                var reservationtype = data[1].Split(':')[1];
                var roomType = data[2].Split(':')[1];
                var classification = data[3].Split(':')[1];
                var checkInDateFrom = data[4].Split(':')[1].Substring(0, data[4].Split(':')[1].Length - 2);
                var checkInDateTo = data[5].Split(':')[1].Substring(0, data[5].Split(':')[1].Length - 2);

                WebMail.Send(to: email, subject: "[NOTIFICATION] A NEW REQUEST HAS BEEN MADE!", body:
                user.Name + " sent a request (On Site Accommodation Request). <br/>MNNo: " + mnno + "<br/>Reservation Type: " + reservationtype + "<br/>Room Type: " + roomType +
                "<br/>Classification: " + classification + "<br/>From(dd/MM/yyyy): " + checkInDateFrom + "<br/>To(dd/MM/yyyy): " + checkInDateTo, cc: "", bcc: "", isBodyHtml: true);

            }
            else if (request == (int)Requests.UpdateOnSiteAccommodationReservation)
            {
                //"reservationId:"+id+"|roomType:"+roomType+"|checkindate:"+checkInDate+"|checkoutdate:"+checkOutDate+"|payment:"+payment
                //+"|reason:" + reason + "remarks:" + remarks
                var data = additionalMessage.Split('|');
                var reservationId = data[0].Split(':')[1];
                var reservationType = data[1].Split(':')[1];
                var roomType = data[2].Split(':')[1];
                var checkindate = data[3].Split(':')[1].Substring(0, data[3].Split(':')[1].Length - 2); ;
                var checkoutdate = data[4].Split(':')[1].Substring(0, data[4].Split(':')[1].Length - 2); ;
                var payment = data[5].Split(':')[1];
                var reason = data[6].Split(':')[1];
                var remarks = data[7].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] ON SITE ACCOMMODATION UPDATE!", body:
                user.Name + " has UPDATED his/her On Site Accommodation Request.<br />Reservation ID: " + reservationId + "<br />Reservation Type: " + reservationType + "<br />Room Type: " + roomType +
                "<br />Check In date(dd/MM/yyyy): " + checkindate + "<br/>Check Out Date: " + checkoutdate + "<br />Payment: " + payment + "<br />Reason: " + reason + "<br />Remarks: " + remarks, cc: "", bcc: "", isBodyHtml: true);

            }
            else if (request == (int)Requests.CancelAccommodationReservation)
            {
                WebMail.Send(to: email, subject: "[NOTIFICATION] ON SITE ACCOMMODATION CANCELLED!", body:
                user.Name + " has CANCELLED his/her On Site Accommodation Request.", cc: "", bcc: "", isBodyHtml: true);

            }
            else if (request == (int)Requests.MealProvision)
            {

                var data = additionalMessage.Split('|');
                var date = data[0].Split(':')[1];
                var breakfast = data[1].Split(':')[1];
                var amsnack = data[2].Split(':')[1];
                var lunch = data[3].Split(':')[1];
                var pmsnack = data[4].Split(':')[1];
                var dinner = data[5].Split(':')[1];
                var referenceid = data[6].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] A NEW REQUEST HAS BEEN MADE!", body:
                user.Name + " has arranged a " + (breakfast == "True" ? "breakfast, " : "") + "" +
                                                 (amsnack == "True" ? "AM snack, " : "") + "" +
                                                 (lunch == "True" ? "lunch, " : "") + "" +
                                                 (pmsnack == "True" ? "PM snack, " : "") + "" +
                                                 (dinner == "True" ? "dinner, " : "") + " on " + date + " with reference # " + referenceid, cc: "", bcc: "", isBodyHtml: true);
            }
            else if (request == (int)Requests.EnrollCrew)
            {
                //schedid: "+parameters[0]+" | mnno:"+parameters[1]+" | groupid:"+groupId+" | employer:"+userDetail.CompanyId+" | batchno:"+141+" | crewrank:" + parameters[2]
                var data = additionalMessage.Split('|');
                var schedid = data[0].Split(':')[1];
                var mnno = data[1].Split(':')[1];
                var groupid = data[2].Split(':')[1];
                var employer = data[3].Split(':')[1];
                var batchno = data[4].Split(':')[1];
                var crewrank = data[5].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] A CREW HAS BEEN ENROLLED!", body:
                user.Name + " has enrolled " + mnno + " in Schedule ID: " + schedid + "<br /><br />Group ID: " + groupid + "<br />Employer: " + employer + "<br />Batch No: " + batchno + "<br />Crew Rank: " + crewrank, cc: "", bcc: "", isBodyHtml: true);

            }
            else if (request == (int)Requests.SwapEnrolledCrew)
            {
                //"schedid:" + parameters[0] + "|mnno:" + parameters[1] + "|crewrank:"+parameters[2] + "|mnnoforswap:"+parameters[3]+"|rankforswap:"+parameters[4]
                var data = additionalMessage.Split('|');
                var schedid = data[0].Split(':')[1];
                var mnno = data[1].Split(':')[1];
                var crewrank = data[2].Split(':')[1];
                var mnnoforswap = data[3].Split(':')[1];
                var rankforswap = data[4].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] A CREW HAS BEEN SWAPPED!", body:
                user.Name + " swapped " + mnnoforswap + "(former enrollee) and " + mnno + " in Schedule ID: " + schedid, cc: "", bcc: "", isBodyHtml: true);
            }
            else if (request == (int)Requests.UnenrollThisCrew)
            {
                var data = additionalMessage.Split('|');
                var schedid = data[0].Split(':')[1];
                var mnno = data[1].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] A CREW HAS BEEN UNENROLLED!", body:
                user.Name + " unenrolled " + mnno + " in Schedule ID: " + schedid, cc: "", bcc: "", isBodyHtml: true);
            }
            else if (request == (int)Requests.UpdateCrewRank)
            {
                var data = additionalMessage.Split('|');
                var mnno = data[0].Split(':')[1];
                var newRank = data[1].Split(':')[1];
                var oldRank = data[2].Split(':')[1];

                WebMail.Send(to: email, subject: "[NOTIFICATION] A CREW'S RANK HAS BEEN UPDATED!", body:
                    user.Name + " has updated " + mnno + "'s rank from " + oldRank + " to " + newRank, cc: "", bcc: "", isBodyHtml: true);
            }
            else
            {
                WebMail.Send(to: email, subject: "[NOTIFICATION] A NEW REQUEST HAS BEEN MADE!", body:
                user.Name + " sent a request (" + GetRequestType(request) + "). You can view this in Administration page.", cc: "", bcc: "", isBodyHtml: true);
            }
        }

        public void SendNotificationToClient(string clientReceipient, int request, string[] parameters, int approvalStatus)
        {
            WebMail.SmtpServer = smtpServer;
            // port to send emails
            WebMail.SmtpPort = smtpPort;
            //WebMail.SmtpUseDefaultCredentials = true;
            //sending email with secure protocol
            WebMail.EnableSsl = enableSSL;
            // email id used to send emails from application
            WebMail.UserName = userName;
            WebMail.Password = password;
            WebMail.From = sender;

            if (request == (int)Requests.NewCrewRequest)
            {
                string rank = parameters[0];
                //string recordId = parameters[7];
                string lastName = parameters[1];
                string firstName = parameters[2];
                string middleInitial = parameters[3];
                string birthday = parameters[4].Split('T')[0];
                string birthplace = parameters[5];

                var status = "";

                if (approvalStatus == (int)ApprovalStatus.Aprroved)
                {
                    status = "APPROVED";
                }
                else if (approvalStatus == (int)ApprovalStatus.Denied)
                {
                    status = "DENIED";
                }

                WebMail.Send(to: clientReceipient, subject: "[NOTIFICATION] UPDATE FROM YOUR REQUEST!", body:
                  "Your request for a new crew has been " + status + ". Please see details below: <br /><br /> " +
                  "Rank: " + rank + "<br />" +
                  "Lastname: " + lastName + "<br />" +
                  "Firstname: " + firstName + "<br />" +
                  "Middle Initial: " + middleInitial + "<br />" +
                  "Birthday: " + birthday + "<br />" +
                  "Birthplace: " + birthplace + "<br /><br />" +
                  "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                  "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged." +
                  "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>", cc: "", bcc: "", isBodyHtml: true);

            }
            else if (request == (int)Requests.SpecialScheduleRequest)
            {
                string courseName = parameters[0];
                string startDate = parameters[1];
                string numberOfParticipants = parameters[2];
                string notes = parameters[3];
                string dateRequested = parameters[4];
                string requestedBy = parameters[5];

                var status = "";

                if (approvalStatus == (int)ApprovalStatus.Aprroved)
                {
                    status = "APPROVED";
                }
                else if (approvalStatus == (int)ApprovalStatus.Denied)
                {
                    status = "DENIED";
                }

                WebMail.Send(to: clientReceipient, subject: "[NOTIFICATION] UPDATE FROM YOUR REQUEST!", body:
                  "Your request for a special schedule has been " + status + ". Please see details below: <br /><br /> " +
                  "Course Title: " + courseName + "<br />" +
                  "Start Date: " + startDate + "<br />" +
                  "Number of Participants: " + numberOfParticipants + "<br />" +
                  "Date Requested: " + dateRequested + "<br />" +
                  "Requested By: " + requestedBy + "<br />" +
                  "Remarks: " + notes + "<br /><br />" +
                  "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                  "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged." +
                  "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>", cc: "", bcc: "", isBodyHtml: true);
            }
            else if (request == (int)Requests.TransportationRequest)
            {
                string MNNO = parameters[0];
                string rank = parameters[1];
                string firstName = parameters[2];
                string lastName = parameters[3];
                string type = parameters[4];
                string vehicle = parameters[5];
                string dateRequested = parameters[20];
                string Notes = parameters[18];

                WebMail.Send(to: clientReceipient, subject: "[NOTIFICATION] UPDATE FROM YOUR REQUEST!", body:
                  "Your request for a transportation has been tagged as BOOKED. Please see details below: <br /><br /> " +
                  "Trainee No.: " + MNNO + "<br />" +
                  "Rank: " + rank + "<br />" +
                  "Firstname: " + firstName + "<br />" +
                  "Lastname: " + lastName + "<br />" +
                  "Type: " + type + "<br />" +
                  "Vehicle: " + vehicle + "<br />" +
                  "Date Requested: " + dateRequested + "<br />" +
                  "Notes: " + Notes + "<br />" +
                  //"Outbound: " + outbound + "<br />" +
                  //"One Trip: " + oneTrip + "<br />" +
                  //"Two Trips: " + twoTrips + "<br />" +
                  //"Status: " + status + "<br />" +
                  //"Pick Up: " + pickUp + "<br /><br />" +
                  //"Date and Time of Pick Up: " + dateTimeOfPickUp + "<br />" +
                  //"Drop Off: " + dropOff + "<br />" +
                  //"Second Pick Up: " + secondPickUp + "<br />" +
                  //"Second Date and Time of Pick Up: " + secondDateTimeOfPickUp + "<br />" +
                  //"Second Drop Off: " + secondDropOff + "<br />" +
                  //"Remarks: " + notes + "<br />" +
                  //"Reference ID: " + referenceId + "<br />" +
                  //"Date Booked: " + dateBooked + "<br />" +
                  //"Requested By: " + requestedBy + "<br /><br />" + 
                  "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                  "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged." +
                  "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>", cc: "", bcc: "", isBodyHtml: true);

            }else if (request == (int)Requests.OffSiteAccommodationRequest)
            {

                string MNNO = parameters[1];
                string Rank = parameters[2];
                string LastName = parameters[3];
                string FirstName = parameters[4];
                string HotelName = parameters[5];
                string RoomType = parameters[6];
                string Status = parameters[7];
                string CompanyName = parameters[8];
                string CheckInDate = parameters[9];
                string CheckOutDate = parameters[10];
                string ModeOfPayment = parameters[11];
                string ReasonOfStay = parameters[12];

                var status = "";

                switch (approvalStatus)
                {
                    case (int)ApprovalStatus.Arranged:
                        status = "ARRANGED";
                        break;
                    case (int)ApprovalStatus.Billed:
                        status = "BILLED";
                        break;
                    case (int)ApprovalStatus.Paid:
                        status = "PAID";
                        break;
                    case (int)ApprovalStatus.PersonalAccount:
                        status = "PERSONAL ACCOUNT";
                        break;
                    case (int)ApprovalStatus.Cancelled:
                        status = "CANCELLED";
                        break;
                    case (int)ApprovalStatus.Booked:
                        status = "BOOKED";
                        break;
                    default:
                        status = null;
                        break;
                }

                WebMail.Send(to: clientReceipient, subject: "[NOTIFICATION] UPDATE FROM YOUR REQUEST!", body:
                  "Your request for a hotel has been set to " + status + ". Please see details below: <br /><br /> " +
                  "Training No.: " + MNNO + "<br />" +
                  "Rank: " + Rank + "<br />" +
                  "Lastname: " + LastName + "<br />" +
                  "Firstname: " + FirstName + "<br />" +
                  "Hotel Name: " + HotelName + "<br />" +
                  "Room Type: " + (RoomType == "1" ? "Single (deluxe room)" : "Double (deluxe room)") + "<br />" +
                  "Check-in Date: " + CheckInDate + "<br />" +
                  "Check-out Date: " + CheckOutDate + "<br />" +
                  "Mode of Payment: " + (ModeOfPayment == "0" ? "Company Sponsored" : "Personal Account") + "<br />" +
                  "Reason of Stay: " + (ReasonOfStay == "12" ? "Accommodation Only" : "Due tp In-house training") + "<br />" +
                  "For any inquiries, please email us at marketing@umtc.com.ph or call +63 2 981 6682 local 2128, 2144, 2131, 2133, 2141. <br /><br />" +
                  "<i>*This is a system-generated email, please do not reply. This email and any attachments are confidential and may also be privileged." +
                  "If you are not the intended recipient, please delete all copies and notify the sender immediately.</i>", cc: "", bcc: "", isBodyHtml: true);

            }

        }


        public string GetRequestType(int request)
        {
            if (request == (int)Requests.NewCrewRequest)
            {
                return "New Crew Request";
            }
            else if (request == (int)Requests.SpecialScheduleRequest)
            {
                return "Special Schedule Request";
            }
            else if (request == (int)Requests.OffSiteAccommodationRequest)
            {
                return "Off Site Accommodation Request";
            }
            else if (request == (int)Requests.TransportationRequest)
            {
                return "Transportation Request";
            }
            else if (request == (int)Requests.RegisterAccount)
            {
                return "Register Account Request";
            }

            return "";
        }

    }
}