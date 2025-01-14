using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AB.DEX.PeopleSync.Customization
{
    public static class AppConfig
    {
        public static string GetWorkdayUser()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"), optional: false)
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.Development.json"), optional: true)
                .Build();
            return configuration.GetSection("AppSettings").GetSection("WorkdayUser").Value;
        }
        public static string GetWorkdayPassword()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"), optional: false)
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.Development.json"), optional: true)
                .Build();
            return configuration.GetSection("AppSettings").GetSection("WorkdayPassword").Value;
        }
        public static string GetWorkdayReportUrl()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"), optional: false)
                .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.Development.json"), optional: true)
                .Build();
            return configuration.GetSection("AppSettings").GetSection("WorkdayReportUrl").Value;
        }
    }
}
