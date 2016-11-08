using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using myVegAppDbAPI.Controllers;
using myVegAppDbAPI.Model.DbModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using myVegAppDbAPI.Model;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;
using myVegAppDbAPI.Model.Settings;
using myVegAppDbAPI.Helpers.Project.Utilities;

namespace myVegAppDbAPI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();

            }));
            // Add framework services.

            services.Configure<MongoSettings>(Configuration.GetSection("MongoSettings"));
            services.Configure<EmailSettings>(Configuration.GetSection("MailSettings"));
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddScoped<IViewRenderService, ViewRenderingService>();
            services.AddMvc();
          
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            if (/*env.IsDevelopment()*/true)
            {
                app.UseDeveloperExceptionPage();
            }
            loggerFactory.AddDebug();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), @"Content")),
                RequestPath = new PathString("/Content")
            });
            app.UseMvc();
           

        }
    }
}
