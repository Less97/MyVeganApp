using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.APIModels
{
    public class ExceptionMessage
    {
        public Boolean Error { get; set; }

        public Exception Exception { get; set; }

        public String Message { get; set; }

        public ExceptionMessage(Exception ex) {
            this.Error = true;
            Exception = ex;
            Message = ex.Message;
        }
    }
}
