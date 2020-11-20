using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using MySql.Data.MySqlClient;

namespace SAMPortal
{
    public class MyHub : Hub
    { 
        public void UpdateOnSiteAccommodationTotalFee(int onSiteAccommodationFee)
        {
            Clients.All.updateOnSiteAccommodationFee(onSiteAccommodationFee);
        }

        public void UpdateOffSiteAccommodationTotalFee(int courseFee, int offSiteAccommodationFee, string connectionId)
        {
            Clients.Client(connectionId).updateOffSiteAccommodationFee(courseFee, offSiteAccommodationFee);
        }

        public void UpdateMealsTotalFee(int mealFee)
        {
            Clients.All.updateMealsFee(mealFee);
        }

        public void UpdateTransportationTotalFee(int transportationFee)
        {
            Clients.All.updateTransportationFee(transportationFee);
        }
    }
}