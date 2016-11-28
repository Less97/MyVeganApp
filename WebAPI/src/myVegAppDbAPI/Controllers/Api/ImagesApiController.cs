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

        [HttpPost("uploadImage64")]
        [Produces("application/json")]
        [Consumes("application/json", "application/json-patch+json", "multipart/form-data")]
        public async Task<IActionResult> UploadImage64([FromBody] UploadImage img)
        {
            try
            {
                img.Image = img.Image.Replace("data:image/jpeg;base64,", String.Empty)
                    .Replace("data:image/png;base64,", String.Empty)
                    .Replace("data:image/gif;base64,", String.Empty)
                    .Replace("data:image/bmp;base64,", String.Empty);
                byte[] toBytes = Convert.FromBase64String(img.Image);

                using (Stream mystream = new MemoryStream(toBytes))
                {
                    var myId = await _imagesBucket.UploadFromStreamAsync(String.Empty, mystream);
                    return Json(new {id = myId.ToString()}.ToJson(jsonWriterSettings));
                }
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
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
