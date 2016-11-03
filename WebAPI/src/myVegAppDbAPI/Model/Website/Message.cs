using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.Website
{
    public class MessageViewModel
    {
        public String Subject { get; set; }

        public String Body { get; set; }

        public String SenderName { get; set; }

        public String SenderEmail { get; set; }

        public Int32 Status { get; set; }
    }
}
