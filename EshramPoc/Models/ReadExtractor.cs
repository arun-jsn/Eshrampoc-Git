using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;

namespace EshramPoc.Models
{
    public class Documentvalidation   
    {
        public static bool DocValidator(string img)
        {
            var client = new RestClient("https://eshramcomputervision.cognitiveservices.azure.com/vision/v3.1/analyze");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/octet-stream");
            request.AddHeader("Ocp-Apim-Subscription-Key", "ebb7471203354c0f9b139280be61c8ef");
            //request.AddParameter("application/octet-stream", "<file contents here>", ParameterType.RequestBody);
            request.AddParameter(" application/octet-stream", Convert.FromBase64String(img), ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            Console.WriteLine(response.Content);
            dynamic result = JsonConvert.DeserializeObject(response.Content);
            if (result.categories[0].name == "text_menu")
            {
                return true;
            }
            return false;
        }
    }
    public class ReadExtractor
    {
    
            public static string jsonString = null, Error = null;
            public static dynamic JSONresult, result;
            public string CompleteString = "";
            public static List<string> RTList = new List<string>();

            public static string OcrApiEndpoint = ConfigurationManager.AppSettings["ComputerVisionEndpoint"];
            public static string OcrApiKey = ConfigurationManager.AppSettings["ComputerVisionApiKey"];
            public static void ExtractText(string imageData)
            {
                try
                {
                RTList = new List<string>();
                if (imageData != null)
                    {
                        var client = new RestClient(OcrApiEndpoint);
                        client.Timeout = -1;
                        var request = new RestRequest(Method.POST);
                        request.AddHeader("Content-Type", " application/octet-stream");
                        request.AddHeader("Ocp-Apim-Subscription-Key", OcrApiKey);
                        request.AddParameter(" application/octet-stream", Convert.FromBase64String(imageData), ParameterType.RequestBody);
                        IRestResponse response = client.Execute(request);
                        Console.WriteLine(response.Content);
                        result = JsonConvert.DeserializeObject(response.Content);
                        if ((int)response.StatusCode == 202)
                        {
                            if (response.Headers.Count > 0)
                            {
                                string operationLocation = response.Headers.ToList().Find(x => x.Name == "Operation-Location").Value.ToString();
                                var client1 = new RestClient(operationLocation);
                                client1.Timeout = -1;
                                var request1 = new RestRequest(Method.GET);
                                request1.AddHeader("Ocp-Apim-Subscription-Key", OcrApiKey);
                                IRestResponse response1;
                                do
                                {
                                    Thread.Sleep(500);
                                    response1 = client1.Execute(request1);
                                    JSONresult = JsonConvert.DeserializeObject(response1.Content);
                                } while ((int)response1.StatusCode == 200 && JSONresult.status != "succeeded" && JSONresult.status != "failed");
                                if ((int)response1.StatusCode == 200 && JSONresult.status == "succeeded")
                                {
                                    jsonString = JsonConvert.SerializeObject(JSONresult);
                                    var readResult = JSONresult.analyzeResult.readResults;
                                    for (var i=0; i< readResult.Count; i++)
                                    {
                                    var readResultPage = JSONresult.analyzeResult.readResults[i];
                                        for (var j=0; j< readResultPage.lines.Count; j++)
                                        {
                                        RTList.Add(readResultPage.lines[j].text.ToString());
                                        }
                                    }
                              //  ["readResults"]["lines"]["text"]
                                   
                                }
                                else if (JSONresult.status == "failed")
                                {
                                   
                                }
                                else
                                {
                                   
                                }
                            }
                            else
                            {
                                
                            }
                        }
                    }
                   
                }
                catch (Exception ex)
                {
                   
                }
            }


        public static ValidateDataFormat1 ValidateDataFormat1(List<string> imageData)
            
        {
            ValidateDataFormat1 VDF1 = new Models.ValidateDataFormat1();
            var Name = "";
            var MotherName = "";
            var GardianName="";
            var Board = "";
            //var RollNo = "";
            bool isvalid = true;

            var test_data = imageData;

            var test = test_data[0];
            string s1 = string.Join(", ", test_data);


           // List<string> mother_data = [ "Mother's", "Mother", "MOTHER" ];
            for (var i=0;i< test_data.Count;i++)
            {
                isvalid = test_data.Any(s => s.Contains("EDUCATION"));
                if (isvalid)
                {
                    if (test_data[i].Contains("EDUCATION"))
                    {
                        Board = test_data[i];
                        Console.WriteLine(Board);

                    }

                    if (test_data[i].Contains("Mother's"))
                    {
                        MotherName = test_data[i + 1];
                        Console.WriteLine(MotherName);

                    }



                    //if (test_data[i].Contains(mother_data.ToString())
                    //listOfStrings.Any(s => test_data[i].Contains(s));
                    //{
                    //    MotherName = test_data[i+1];
                    //    Console.WriteLine(Board);
                    //    break;
                    // }

                    if (test_data[i].Contains("Candidate"))
                    {
                        var Raw_Name = test_data[i];
                        Name = StringHandler.RemoveBeforeText(Raw_Name, "Name of Candidate ");
                        Console.WriteLine(Name);

                    }


                    if (test_data[i].Contains("Guardian's Name"))
                    {
                        GardianName = test_data[i + 1];
                        Console.WriteLine(GardianName);

                    }
                }
                   

            }
            VDF1.Name = Name;
            VDF1.Board = Board;
            VDF1.Name = Name;
            VDF1.GardianName = GardianName;
            VDF1.MotherName = MotherName;
            VDF1.isvalid = isvalid;
            return VDF1;

            //Console.WriteLine(test);
        }

        public static ValidateDataFormat2 ValidateDataFormat2(List<string> imageData)
        {
            ValidateDataFormat2 VDF2 = new ValidateDataFormat2();
            var Certificate_By = "";
            var State = "";
            var Certificate = "";
            var Year = "";
            var Name = "";
            var Parents = "";
            var Income = "";
            bool isvalid = true;
            //var RollNo = "";


            var test_data = imageData;

            var test = test_data[0];
            string s1 = string.Join(", ", test_data);


            // List<string> mother_data = [ "Mother's", "Mother", "MOTHER" ];
            for (var i = 0; i < test_data.Count; i++)
            {
                isvalid = test_data.Any(s => s.Contains("INCOME"));
                if (isvalid)
                {
                    if (test_data[i].Contains("GOVERNMENT OF"))
                    {
                        Certificate_By = test_data[i];
                        Console.WriteLine(Certificate_By);

                    }

                    if (test_data[i].Contains("GOVERNMENT OF"))
                    {
                        var Raw_Name = test_data[i];
                        State = StringHandler.RemoveBeforeText(Raw_Name, "GOVERNMENT OF ");
                        Console.WriteLine(State);

                    }

                    if (test_data[i].Contains("INCOME CERTIFICATE"))
                    {
                        Certificate = test_data[i];
                        Console.WriteLine(Certificate);

                    }

                    if (test_data[i].Contains("Financial Year"))
                    {
                        var Raw_Name = test_data[i];
                        var Year_to_trim = StringHandler.RemoveBeforeText(Raw_Name, "Financial Year ");
                        Year = Regex.Replace(Year_to_trim, @"[^0-9-]", String.Empty).Trim();
                        Console.WriteLine(Year);

                    }
                    if (test_data[i].Contains("Shri"))
                    {
                        var Raw_Name = test_data[i];
                        var Name_before = StringHandler.RemoveBeforeText(Raw_Name, "certify that ");
                        Name = StringHandler.RemoveAfterText(Name_before, "son of").Trim();

                        Parents = StringHandler.RemoveBeforeText(Raw_Name, "son of").Trim();

                        Console.WriteLine(Certificate);

                    }

                    if (test_data[i].Contains("Total"))
                    {
                        Income = test_data[i + 1];
                        Console.WriteLine(Certificate_By);

                    }

                }



            }
            VDF2.Name = Name;
            VDF2.State = State;
            VDF2.Certificate = Certificate;
            VDF2.Year = Year;
            VDF2.Parents = Parents;
            VDF2.Income = Income;
            VDF2.Certificate_By = Certificate_By;
            VDF2.isvalid = isvalid;
       
            return VDF2;

        }

        public static ValidateDataFormat3 ValidateDataFormat3(List<string> imageData)
        {
            ValidateDataFormat3 VDF3 = new ValidateDataFormat3();
            var Certificate = "";
            var State = "";
            var Son_Wife_daughter = "";
            var District = "";
           // var DOB = "";
            var MotherName = "";
            var NameOfTrade = "";
            var Name = "";
            bool isvalid = true;
            //var RollNo = "";


            var test_data = imageData;

            var test = test_data[0];
            string s1 = string.Join(", ", test_data);
            for (var i = 0; i < test_data.Count; i++)
            {
                isvalid = test_data.Any(s => s.Contains("NATIONAL TRADE"));
                if (isvalid)
                {
                    if (test_data[i].Contains("CERTIFICATE"))
                    {
                        Certificate = test_data[i];
                        Console.WriteLine(Certificate);

                    }
                    if (test_data[i].Contains("State"))
                    {
                        var Raw_Name = test_data[i];
                        State = StringHandler.RemoveBeforeText(Raw_Name, "State");
                        Console.WriteLine(State);
                    }


                    if (test_data[i].Contains("Son/Wife/Daughter"))
                    {
                        var Raw_Name = test_data[i];
                        Son_Wife_daughter = StringHandler.RemoveBeforeText(Raw_Name, "Daughter of").Trim();
                        Console.WriteLine(Son_Wife_daughter);

                    }

                    if (test_data[i].Contains("Mother's"))
                    {
                        MotherName = test_data[i + 1];
                        Console.WriteLine(MotherName);

                    }


                    if (test_data[i].Contains("District"))
                    {
                        var Raw_Name = test_data[i];
                        District = StringHandler.RemoveBeforeText(Raw_Name, "District").Trim();
                        Console.WriteLine(District);

                    }

                    if (test_data[i].Contains("Name of the Trade"))
                    {
                        NameOfTrade = test_data[i + 1];
                        Console.WriteLine(NameOfTrade);

                    }


                    if (test_data[i].Contains("Shri/Smt/Kumari"))
                    {
                        Name = test_data[i + 1];
                        Console.WriteLine(Name);

                    }
                }

                else
                {
                    break;
                }

            }
            VDF3.Certificate = Certificate;
            VDF3.State = State;
            VDF3.Son_Wife_daughter = Son_Wife_daughter;
            VDF3.District = District;
            VDF3.MotherName = MotherName;
            VDF3.NameOfTrade = NameOfTrade;
            VDF3.Name = Name;
            VDF3.isvalid = isvalid;
            return VDF3;
        }

        public static ValidateDataFormat4 ValidateDataFormat4(List<string> imageData)
        {
            ValidateDataFormat4 VDF4 = new ValidateDataFormat4();
            var Certificate = "";
            var Caste = "";
            var Son_Daughter = "";
            var Name = "";
            bool isvalid = true;
            //var Address = "";
         
            //var RollNo = "";


            var test_data = imageData;

            var test = test_data[0];
            string s1 = string.Join(", ", test_data);
            for (var i = 0; i < test_data.Count; i++)
            {
                isvalid = test_data.Any(s=>s.Contains("CASTE"));
                
                if (isvalid)
                {
                    if (test_data[i].Contains("CERTIFICATE"))
                    {
                        Certificate = test_data[i];
                        Console.WriteLine(Certificate);

                    }

                    if (test_data[i].Contains("belongs to the"))
                    {
                        var Raw_Name = test_data[i];
                        var Caste_to_trim = StringHandler.RemoveBeforeText(Raw_Name, "belongs to the").Trim();
                        Caste = StringHandler.RemoveAfterText(Caste_to_trim, "which is recognized").Replace("Caste", String.Empty).Trim();
                        Console.WriteLine(Caste);

                    }
                    if (test_data[i].Contains("Son/Daughter"))
                    {
                        var Raw_Name = test_data[i];
                        var Son_Daughter_to_trim = StringHandler.RemoveBeforeText(Raw_Name, "Son/Daughter of").Trim();
                        Son_Daughter = StringHandler.RemoveAfterText(Son_Daughter_to_trim, "Resident of").Trim();
                        Console.WriteLine(Son_Daughter);

                    }
                    if (test_data[i].Contains("Shri/Shirmati/Kumari"))
                    {
                        var Raw_Name = test_data[i];
                        var Name_to_trim = StringHandler.RemoveBeforeText(Raw_Name, "Shri/Shirmati/Kumari").Trim();
                        Name = StringHandler.RemoveAfterText(Name_to_trim, "Son/Daughter of").Trim();
                        Console.WriteLine(Name);

                    }
                }
                else
                {
                    break;
                }
            }
            VDF4.Certificate = Certificate;
            VDF4.Caste = Caste;
            VDF4.Son_Daughter = Son_Daughter;
            VDF4.Name = Name;
            VDF4.isvalid = isvalid;
            return VDF4;

        }
    }
}



public class StringHandler
{
    public string RemoveBeforeTextOnly(string inputString, string stringToRemove)
    {
        string outputString = inputString;
        if (inputString.IndexOf(stringToRemove) > -1)
        {
            outputString = stringToRemove + inputString.Substring(inputString.IndexOf(stringToRemove) + stringToRemove.Length);
        }
        return outputString;
    }
    public static string RemoveBeforeText(string inputString, string stringToRemove)
    {
        string outputString = inputString;
        if (inputString.IndexOf(stringToRemove) > -1)
        {
            outputString = inputString.Substring(inputString.IndexOf(stringToRemove) + stringToRemove.Length);
        }
        return outputString;
    }
    public string RemoveAfterTextOnly(string inputString, string stringToRemove)
    {
        string outputString = inputString;
        if (inputString.IndexOf(stringToRemove) > -1)
        {
            var test = inputString.IndexOf(stringToRemove);
            var tes2t = stringToRemove.Length;
            outputString = stringToRemove + inputString.Substring(0, inputString.LastIndexOf(stringToRemove));
        }
        return outputString;
    }
    public static string RemoveAfterText(string inputString, string stringToRemove)
    {
        string outputString = inputString;
        if (inputString.IndexOf(stringToRemove) > -1)
        {
            var test = inputString.IndexOf(stringToRemove);
            var tes2t = stringToRemove.Length;
            outputString = inputString.Substring(0, inputString.LastIndexOf(stringToRemove));
        }
        return outputString;
    }
}

