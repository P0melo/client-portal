using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAMPortal.Enum
{
    public class SamPortalEnum
    {
    }

    public enum DashboardMessageId
    {
        RequestSuccessful
    }

    public enum ManageMessageId
    {
        AddPhoneSuccess,
        ChangePasswordSuccess,
        SetTwoFactorSuccess,
        SetPasswordSuccess,
        RemoveLoginSuccess,
        RemovePhoneSuccess,
        Error,
        PasswordIsExpired,
        PasswordExpirationCountdown
    }

    public enum Status
    {
        Success = 1,
        Failed = 0,
        Initialize = -1
    }

    enum Requests
    {
        NewCrewRequest = 1,
        SpecialScheduleRequest = 2,
        OffSiteAccommodationRequest = 3,
        TransportationRequest = 4,
        RegisterAccount = 5,
        OnSiteAccommodationRequest = 6,
        UpdateOnSiteAccommodationReservation = 7,
        CancelAccommodationReservation = 8,
        MealProvision = 9,
        EnrollCrew = 10,
        SwapEnrolledCrew = 11,
        UnenrollThisCrew = 12,
        UpdateCrewRank = 13,
        ApproveNewAccount = 14
    }

    public enum ApprovalStatus
    {
        Denied = 0,
        Aprroved = 1,
        NotNeeded = 2,
        Completed = 3,
        Arranged = 4,
        Billed = 5,
        Paid = 6,
        PersonalAccount = 7,
        Cancelled = 8,
        Booked = 9
    }

}