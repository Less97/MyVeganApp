using myVegAppDbAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Helpers
{
    public static class GeoHelper
    {
        public static double CalculateDistance(Location currentPos, Location place)
        {
            double theta = currentPos.Longitude - place.Longitude;
            double dist = Math.Sin(Deg2Rad(currentPos.Latitude)) * Math.Sin(Deg2Rad(place.Latitude)) + Math.Cos(Deg2Rad(currentPos.Latitude)) * Math.Cos(Deg2Rad(place.Latitude)) * Math.Cos(Deg2Rad(theta));
            dist = Math.Acos(dist);
            dist = Rad2Deg(dist);
            dist = dist * 60 * 1.1515 * 1.609344;
            return dist;
        }

        private static double Deg2Rad(double deg)
        {
            return (deg * Math.PI / 180.0);
        }

        private static double Rad2Deg(double rad)
        {
            return (rad / Math.PI * 180.0);
        }
    }
}
