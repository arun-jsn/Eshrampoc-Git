using EshramPoc.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Web.Mvc;

namespace EshramPoc.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetResultData(string dataObject )
        {
            try
            {
                var obj = JObject.Parse(dataObject);
                var img = obj["img"].ToString();
                string imagePath = img;
                byte[] byesArray = System.IO.File.ReadAllBytes(Server.MapPath(imagePath));
                string docbase64 = Convert.ToBase64String(byesArray);
                var contentId = Convert.ToInt32(obj["contentId"]);
                var checkeddoc = Documentvalidation.DocValidator(docbase64);
                if (checkeddoc)
                {
                    ReadExtractor.ExtractText(docbase64);
                    var Docdata = ReadExtractor.RTList;

                    var jsonResult = JsonConvert.SerializeObject(ReadExtractor.JSONresult);
                    //var SerializedJsonOutput = JsonConvert.SerializeObject(jsonResult);
                    //var dummy = "dummy";
                    //try
                    //{
                    //    var TestText = jsonResult["analyzeResult"]["readResults"][0]["lines"][0]["text"];
                    //    var LinesCount = (jsonResult["analyzeResult"]["readResults"][0]["lines"]).Count;

                    //}
                    //catch (Exception ex)

                    //{

                    //}



                    if (contentId == 1)
                    {
                        var VDF = ReadExtractor.ValidateDataFormat4(Docdata);
                        if (VDF.isvalid == true) 
                        { 
                            return Json(new { StatusCode = "100", Result = VDF, ResultJson = jsonResult }); 
                        }
                        else
                        {
                            return Json(new { StatusCode = "102", Message = "Invalid" });
                        }
                            
                        

                    }
                    else if (contentId == 2)
                    {
                        
                        var VDF = ReadExtractor.ValidateDataFormat2(Docdata);
                        if (VDF.isvalid == true)
                        {
                            return Json(new { StatusCode = "100", Result = VDF, ResultJson = jsonResult });
                        }
                        else
                        {
                            return Json(new { StatusCode = "102", Message = "Invalid" });
                        }
                    }
                    else if (contentId == 3)
                    {
                       
                        var VDF = ReadExtractor.ValidateDataFormat3(Docdata);
                        if (VDF.isvalid == true)
                        {
                            return Json(new { StatusCode = "100", Result = VDF, ResultJson = jsonResult });
                        }
                        else
                        {
                            return Json(new { StatusCode = "102", Message = "Invalid" });
                        }

                    }
                    else if (contentId == 4)
                    {
                        var VDF = ReadExtractor.ValidateDataFormat1(Docdata);
                        if (VDF.isvalid == true)
                        {
                            return Json(new { StatusCode = "100", Result = VDF, ResultJson = jsonResult });
                        }
                        else
                        {
                            return Json(new { StatusCode = "102", Message = "Invalid" });
                        }
                    }
                    else
                    {
                        return Json(new { StatusCode = "101", Message = "NoN Trained format " });
                    }

                    
                }
                else
                {
                    return Json(new { StatusCode = "102", Message = "Invalid" });
                }

                
            }
            catch(Exception ex)
            {
                return Json(new { StatusCode = "300", Message = ex.Message });
            }
            
        }


    }
}