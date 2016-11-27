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
using Microsoft.AspNetCore.Cors;
using MongoDB.Bson;
using MongoDB.Bson.IO;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/images")]
    [EnableCors("MyPolicy")]
    public class ImagesApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _mongoSettings;
        private IHostingEnvironment hostingEnv;
        private GridFSBucket _imagesBucket;
        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

        public ImagesApiController(IHostingEnvironment env, IOptions<MongoSettings> mongoSettings)
        {
            hostingEnv = env;
            _mongoSettings = mongoSettings.Value;
            _client = new MongoClient(_mongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_mongoSettings.DatabaseName);
            _imagesBucket = new GridFSBucket(_database, new GridFSBucketOptions() {
                BucketName = "gallery"
            });
        }


        [HttpPost("uploadImage")]
        [Produces("application/json")]
        [Consumes("application/json","application/json-patch+json","multipart/form-data")]
        public async Task<IActionResult> UploadImage(IFormFile file)
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
                    var myId = await _imagesBucket.UploadFromStreamAsync(filename, stream);
                    return Json(new { result = 1, imageId = myId }.ToJson(jsonWriterSettings));
                }
              
            }
            catch (Exception ex) {
                return Json(ex.RaiseException());
            }
        }

        [HttpPost("uploadImage64")]
        [Produces("application/json")]
        [Consumes("application/json", "application/json-patch+json", "multipart/form-data")]
        public async Task<IActionResult> UploadImage64([FromBody] UploadImage img)
        {
            throw new NotImplementedException();
        }



        [HttpGet("get")]
        public async Task<IActionResult> Get(String imgId)
        {
            try
            {
                ObjectId oid = new ObjectId(imgId);
                Byte[] result;
                using (var d = new MemoryStream())
                {
                    await _imagesBucket.DownloadToStreamAsync(oid, d);
                    result = d.ToArray();
                }
                return File(result, "image/jpeg");
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
        }
    }
}
