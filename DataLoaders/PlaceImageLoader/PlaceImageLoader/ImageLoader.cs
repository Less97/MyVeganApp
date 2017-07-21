using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RestSharp;
using static System.Net.Mime.MediaTypeNames;

namespace PlaceImageLoader
{
    public class ImageLoader
    {
        private String apiRoot = ConfigurationManager.AppSettings["apiRoot"];
        private String rootFolder = ConfigurationManager.AppSettings["rootDirectory"];

        public void Load()
        {
            DirectoryInfo rootInfo = new DirectoryInfo(rootFolder);
            DirectoryInfo[] subInfos = rootInfo.GetDirectories();
            foreach (var s in subInfos)
            {
                List<FileInfo> imgs = s.EnumerateFiles().ToList();
                foreach (var f in imgs)
                {
                    Upload(LoadImage(Path.Combine(rootFolder, s.Name,f.Name)),s.Name);
                }
            }
        }

        private String LoadImage(String imgPath)
        {
            Byte[] imageArray = File.ReadAllBytes(imgPath);
            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
            return base64ImageRepresentation;
        }

        private void Upload(String img,String placeId)
        {
            Console.WriteLine($"Uploading Img for {placeId}");
            var client = new RestClient($"{apiRoot}");
            var request = new RestRequest("places/addGalleryItem", Method.POST);
            request.RequestFormat = DataFormat.Json;
            request.AddBody(new
            {
                placeId,  
                image = img
            });
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            Console.Write(content);
            Console.WriteLine("<!----------------    -------------------!>");
        }
    }
  
}
