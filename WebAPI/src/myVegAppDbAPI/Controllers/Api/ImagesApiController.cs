using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using MongoDB.Driver;
using myVegAppDbAPI.Model.APIModels;
using myVegAppDbAPI.Model.Settings;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver.GridFS;
using myVegAppDbAPI.Helpers;

namespace myVegAppDbAPI.Controllers.Api
{
    public class ImagesApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _mongoSettings;
        private IHostingEnvironment hostingEnv;
        private GridFSBucket _galleryBucket;
      

        public ImagesApiController(IHostingEnvironment env, IOptions<MongoSettings> mongoSettings)
        {
            hostingEnv = env;
            _mongoSettings = mongoSettings.Value;
            _client = new MongoClient(_mongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_mongoSettings.DatabaseName);
            _galleryBucket = new GridFSBucket(_database, new GridFSBucketOptions() {
                BucketName = "gallery"
            });
        }


        [HttpPost("uploadToGallery")]
        public async Task<IActionResult> UploadToGallery(IFormFile file)
        {
            try
            {
                long size = 0;

                var filename = ContentDispositionHeaderValue
                                .Parse(file.ContentDisposition)
                                .FileName
                                .Trim('"');
                filename = hostingEnv.WebRootPath + $@"\{file.FileName}";
                size += file.Length;
                Stream stream = file.OpenReadStream();
                using (var memoryStream = new MemoryStream())
                {
                   await _galleryBucket.UploadFromStreamAsync(filename, stream);
                }
                return Json(new { Result = 1 });
            }
            catch (Exception ex) {
                return Json(ex.RaiseException());
            }
        }
    }
}
