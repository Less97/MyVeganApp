using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.IO;
using System.Text;

namespace myVegAppDbAPI.Helpers
{
    public class AuthHelper
    {
        private static readonly Random random = new Random();

        public static String EncryptPassword(String pwd,out String mySalt)
        {
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: pwd,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            mySalt = Convert.ToBase64String(salt);
            return hashed;
        }

        public static Boolean CheckPassword(String pToCheck,String pReal, String salt) {

            var bytesSalt = Convert.FromBase64String(salt);
            string hashedToCheck = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: pToCheck,
            salt: bytesSalt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));
            return hashedToCheck == pReal;

        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

       

    }
}
