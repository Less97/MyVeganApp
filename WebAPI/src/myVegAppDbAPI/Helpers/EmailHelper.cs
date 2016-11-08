using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace myVegAppDbAPI.Helpers
{
    public class EmailHelper
    {
        private EmailSettings _settings { get; set; }
       
        public EmailHelper(EmailSettings settings) {
            _settings = settings;
        }

        public async Task SendEmail(String subject,String sender,String recipient, String message) {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("The Curious Carrot", sender));
            emailMessage.To.Add(new MailboxAddress("", recipient));
            emailMessage.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = message;

            emailMessage.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.LocalDomain = "thecuriouscarrot.com";
                
                await client.ConnectAsync(_settings.Url, _settings.Port, SecureSocketOptions.SslOnConnect).ConfigureAwait(false);
                await client.AuthenticateAsync(_settings.Username, _settings.Password);
                await client.SendAsync(emailMessage).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }
    }
}
