﻿using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using myVegAppDbAPI.Helpers;
using myVegAppDbAPI.Helpers.Project.Utilities;
using myVegAppDbAPI.Model;
using myVegAppDbAPI.Model.APIModels;
using myVegAppDbAPI.Model.DbModels;
using myVegAppDbAPI.Model.DbModels.InsertModels;
using myVegAppDbAPI.Model.DbModels.ReadModels;
using myVegAppDbAPI.Model.Settings;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver.Builders;
using MongoDB.Driver.GridFS;

namespace myVegAppDbAPI.Controllers.Api
{
    [Route("api/Places")]
    [EnableCors("MyPolicy")]
    public class PlacesApiController : Controller
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private MongoSettings _MongoSettings;
        private EmailSettings _EmailSettings;
        private EmailHelper _emailHelper;
        private GridFSBucket _imagesBucket;
        private IViewRenderService _renderService;
      

        private readonly JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

        public PlacesApiController(IOptions<MongoSettings> mongoSettings, IOptions<EmailSettings> emailSettings, IViewRenderService viewRenderService)
        {
            _MongoSettings = mongoSettings.Value;
            _EmailSettings = emailSettings.Value;
            _client = new MongoClient(_MongoSettings.MongoDbHost);
            _database = _client.GetDatabase(_MongoSettings.DatabaseName);
            _emailHelper = new EmailHelper(_EmailSettings);
            _imagesBucket = new GridFSBucket(_database, new GridFSBucketOptions()
            {
                BucketName = "gallery"
            });
            this._renderService = viewRenderService;
        }

        [HttpGet("getplaces")]
        public async Task<JsonResult> GetPlaces(Double latitude, Double longitude, String searchText,String tags = "", Int32 maxDistance = Int32.MaxValue, Int32 tipology = 0)
        {
            try
            {

                if (String.IsNullOrEmpty(searchText)) searchText = String.Empty;
                BsonArray location = new BsonArray();
                location.AddRange(new Double[] { longitude, latitude });
                var reviews = _database.GetCollection<Review>("reviews");
                var places = _database.GetCollection<ReadPlace>("places");


                var builder = Builders<BsonDocument>.Filter;
                var postGeoFilter = builder.Empty;

                if (!String.IsNullOrEmpty(searchText))
                    postGeoFilter = postGeoFilter & builder.Regex("name", "/" + searchText + "/i") | builder.Regex("menu.dishName", "/" + searchText + "/i");

                if (tipology != 0)
                    postGeoFilter = postGeoFilter & builder.BitsAllSet("menu.tipology", tipology);

                if (!String.IsNullOrEmpty(tags))
                {
                    var tagArray = tags.Split(',');
                    postGeoFilter = postGeoFilter & builder.In("tags", tagArray);
                }

                var docs = await places.Aggregate().AppendStage<BsonDocument>(new BsonDocument() {
                    { "$geoNear",new BsonDocument() {
                        { "near", new BsonDocument() {
                            { "type","Point"},
                            { "coordinates",new BsonArray(new Double[] { longitude,latitude})}
                        } },
                        { "distanceField","dist.calculated"},
                        { "spherical",true},
                        { "maxDistance", maxDistance*1000},
                    } }
                })
                .Match(postGeoFilter) // filtro menu & nome del posto
                .Lookup<BsonDocument, Review, BsonDocument>(reviews, x => x["_id"], y => y.PlaceId, z => z["reviews"])
                .Unwind(x => x["reviews"], new AggregateUnwindOptions<BsonDocument>() { PreserveNullAndEmptyArrays = true })
                .Group(new BsonDocument() // Espande l'array di reviews e tira fuori nReviews e rating
                {
                    { "_id", new BsonDocument() {
                        { "_id","$_id"},
                        { "name","$name" },
                        { "distance","$dist.calculated"},
                        { "phoneNumber","$phoneNumber"},
                        { "address","$address"},
                        { "description","$description"},
                        { "website","$website"},
                        { "gallery","$gallery"},
                        { "type","$type"},
                        { "location","$location"}
                    } },
                       { "nReviews",new BsonDocument(){
                           { "$sum",1}
                       } },
                       { "rating",new BsonDocument() {
                           {"$avg","$reviews.rating" }
                  } }
                })
                .Project(new BsonDocument() {
                    { "_id","$_id._id" },
                    { "name","$_id.name"},
                    { "phoneNumber","$_id.phoneNumber"},
                    { "address","$_id.address"},
                    { "website","$_id.website"},
                    { "description","$_id.description"},
                    { "nReviews","$nReviews"},
                    { "type","$_id.type"},
                    { "gallery","$_id.gallery"},
                    { "rating","$rating"},
                    { "distance","$_id.distance"},
                    { "location","$_id.location"}
                })
                .SortBy<BsonDocument>(x => x["distance"]) //Forse sono gia ordinati
                .As<ReadPlace>()

                .ToListAsync();

                return Json(docs.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


        [HttpGet("getPlaceDetails")]
        public async Task<JsonResult> GetPlaceDetails(String placeId, Double latitude, Double longitude)
        {
            try
            {
                IMongoCollection<ReadPlace> places = _database.GetCollection<ReadPlace>("places");
                IMongoCollection<Review> reviews = _database.GetCollection<Review>("reviews");
                IMongoCollection<Country> countries = _database.GetCollection<Country>("countries");
                var place = await places.Aggregate().Match(x => x.Id == ObjectId.Parse(placeId)).Lookup<ReadPlace, Review, BsonDocument>(reviews, x => x.Id, y => y.PlaceId, d => d["reviews"])
                    .Unwind(x => x["reviews"], new AggregateUnwindOptions<BsonDocument>() { PreserveNullAndEmptyArrays = true })
                   .Group(new BsonDocument()
                   {
                       { "_id",new BsonDocument(){
                           { "placeId","$placeId" },
                           { "description","$description" },
                           { "phoneNumber","$phoneNumber" },
                           { "address","$address" },
                           { "website","$website" },
                           { "name","$name"},
                           { "openingHours","$openingHours"},
                           { "tags","$tags"},
                           { "type","$type"},
                           { "gallery","$gallery"},
                           { "email","$email"},
                           { "location","$location"},
                           { "countryId","$countryId"},
                            { "_id","$_id"}
                       }},
                       { "nReviews",new BsonDocument(){
                           { "$sum",1}
                       } },
                       { "rating",new BsonDocument() {
                           {"$avg","$reviews.rating" }
                       } }

                   })
                   .Lookup<BsonDocument, Country, BsonDocument>(countries, x => x["_id.countryId"], x => x.Id, z => z["country"])
                   .Unwind(x => x["country"])
                   .Project(new BsonDocument() {
                       { "_id", "$_id._id"},
                       { "nReviews","$nReviews"},
                       { "rating","$rating"},
                       { "name","$_id.name"},
                       { "description","$_id.description"},
                       { "type","$_id.type"},
                       { "gallery","$_id.gallery"},
                       { "website","$_id.website"},
                       { "email","$_id.email"},
                       { "address","$_id.address"},
                       { "location","$_id.location"},
                       { "openingHours","$_id.openingHours"},
                       { "tags","$_id.tags"},
                       { "phoneNumber","$_id.phoneNumber"},
                       { "country","$country"}
                   }).As<ReadPlace>()
                   .FirstAsync();

                place.Distance = GeoHelper.CalculateDistance(new Location(latitude, longitude), new Location(place.Location.Location[1], place.Location.Location[0]));
                return Json(place.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }

        }


        [HttpPost("createPlace")]
        public async Task<JsonResult> CreatePlace([FromBody]CreatePlace model)
        {
            try
            {
                IMongoCollection<InsertPlace> places = _database.GetCollection<InsertPlace>("places");

                var myNewPlace = new InsertPlace()
                {
                    Name = model.Name,
                    Description = model.Description,
                    Website = model.Website,
                    OpeningHours = model.OpeningHours,
                    Type = model.Type,
                    Address = model.Address,
                    Email = model.Email,
                    CountryId = new ObjectId(model.CountryId),
                    Location = new GeoLoc(model.Latitude, model.Longitude),
                    PhoneNumber = model.PhoneNumber
                };
                await places.InsertOneAsync(myNewPlace);
                return Json(new { result = true }.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException());
            }
        }

        [HttpPost("AddGalleryItem")]
        public async Task<JsonResult> AddGalleryItem([FromBody] GalleryItem model)
        {
            try
            {
                IMongoCollection<ReadPlace> places = _database.GetCollection<ReadPlace>("places");
                var myPlaceId = ObjectId.Parse(model.PlaceId);
                var myImgId = await SaveImage(model.Image);
                var addImageFilter = Builders<ReadPlace>.Update.Push(x => x.Gallery, ObjectId.Parse(myImgId));
                await places.UpdateOneAsync(x=>x.Id== myPlaceId, addImageFilter);
                return Json(new {result = 1}.ToJson(jsonWriterSettings));
            }
            catch (Exception ex)
            {
                return Json(ex.RaiseException().ToJson(jsonWriterSettings));
            }
        }

        [NonAction]
        public async Task<String> SaveImage(String image)
        {
            image = image.Replace("data:image/jpeg;base64,", String.Empty)
                .Replace("data:image/png;base64,", String.Empty)
                .Replace("data:image/gif;base64,", String.Empty)
                .Replace("data:image/bmp;base64,", String.Empty);
            byte[] toBytes = Convert.FromBase64String(image);

            using (Stream mystream = new MemoryStream(toBytes))
            {
                var myId = await _imagesBucket.UploadFromStreamAsync(String.Empty, mystream);
                return myId.ToString();
            }

        }



    }
}
