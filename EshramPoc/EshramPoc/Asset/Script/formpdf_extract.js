$(".all_pdf_content").hide();
$(".nav_header_content_data").hide();
$(".hide_perview_document_data_pdf").hide();
$("#generate_crid").hide();
$("#generate_tc").hide();
$("#generate_smc").hide();
var storePicutrValue;
$(document).ready(function () {
    $("#btn_id").click(function () {
        encodeImageFileAsURL(storePicutrValue);
        console.log("btn temp1" + storePicutrValue);
        //setTimeout(canvasImage1, 3);
        //console.log("canvas fun read");
        //simple(temp);
    });
});
$(document).ready(function () {
    $("#btn_id2").click(function () {
        canvasImage1();
        console.log("canvas fun read");
        //simple(temp);
    });
});
//------------------- store image in variable storePictureValue onchange in file
function simple(element) {
    storePicutrValue = element;
    document.getElementById("btn_id").disabled = false;
    //console.log("runngin insied" + temp1);
}

function encodeImageFileAsURL1(element) {
    debugger;
    console.log("runngin insied" + element);
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function (e) {
        imagebase64 = reader.result;
        //console.log(imagebase64);
        $("#img_id").attr("src", e.target.result);
        $("#our_disp_id").text("SELECTED IMAGE");
        //$("#img_display_name_id").text("Selected Image");

        storePicutrValue = reader.result.split(',')[1];
        SendToGetImageControll();

    }
    reader.readAsDataURL(file);

}

function getiframedata(data) {
    console.log('id data', data);
}


$("#preview_img101").load(function () {
    $(this).contents().on("mousedown, mouseup, click", function () {
        alert("Click detected inside iframe.");
    });
});

function getdatacheck(datacheck) {
    console.log('data check');
}

function get_document_content(content,button_id) {
    $(".get_content_pdf").hide();
    $("#" + content).show();
    $('.btnstyle_text').removeClass("btn-success");
    $("." + button_id).addClass("btn-success");
}

$('iframe').load(function () {
    $(this).contents().find("body").on('click', function (event) { alert('test'); });
});

jQuery(function ($) { // DOM ready
    $('.iframeWrapper').on('click', function (e) {
        e.preventDefault();
        $("#invalid_image_message_div").hide();
        var iframe_id = $(this).attr('iframeid');
        var pdf_content_id = $(this).attr('pdf_content_id');
        console.log(iframe_id , pdf_content_id);
        var iframe_src = $("#" + iframe_id).attr('src')
        console.log($("#" + iframe_id).attr('src'));
        image_tag = '<iframe id="preview_img2" class="doc custom_img_border" src="' + iframe_src + '" frameborder="0" style="width:100%;" height="500px"></iframe>';
        $("#div_preview_content_filepdf").html(image_tag);
        show_pdf_content_data(pdf_content_id);
        $("#show_loader").show();
        scroll_content();
        var dataObject = JSON.stringify({ img: iframe_src, contentId: pdf_content_id });
        $.ajax({
            url: "/Home/GetResultData/",
            type: "POST",
            data: { dataObject: dataObject} ,
            success: function (data) {
                console.log('data', data);
                //debugger;
                $("#show_loader").hide();
                if (data.StatusCode == 100) {
                   
                    if (pdf_content_id == 1) {
                        
                        $('#certificate').html(capitalizeFirstLetter(data.Result.Certificate));
                        $('#caste').html(capitalizeFirstLetter(data.Result.Caste));
                        $('#son_daughter').html(capitalizeFirstLetter(data.Result.Son_Daughter));
                        $('#name').html(capitalizeFirstLetter(data.Result.Name));
                       // $('#isvalid').html(capitalizeFirstLetter(data.Result.isvalid));
                        //$('#result_json').html(capitalizeFirstLetter(data.ResultJson));


      
                      
                    }
                    else if (pdf_content_id == 2) {
                        $('#certificate_By').html(capitalizeFirstLetter(data.Result.Certificate_By));
                        $('#state').html(capitalizeFirstLetter(data.Result.State));
                        $('#certificate1').html(capitalizeFirstLetter(data.Result.Certificate));
                        $('#year').html(capitalizeFirstLetter(data.Result.Year));
                        $('#name1').html(capitalizeFirstLetter(data.Result.Name));
                        $('#parents').html(capitalizeFirstLetter(data.Result.Parents));
                        $('#income').html(capitalizeFirstLetter(data.Result.Income));
                       // $('#isvalid').html(capitalizeFirstLetter(data.Result.isvalid));
                        //$('#result_json').html(capitalizeFirstLetter(data.ResultJson));


 
                    }
                    else if (pdf_content_id == 3) {
                         // $('.content_pdftitle_logs').html(capitalizeFirstLetter(data.Tag_list[18].Value));
                        $('#certificate2').html(capitalizeFirstLetter(data.Result.Certificate));
                        $('#state1').html(capitalizeFirstLetter(data.Result.State));
                        $('#son_Wife_daughter').html(capitalizeFirstLetter(data.Result.Son_Wife_daughter));
                        $('#district').html(capitalizeFirstLetter(data.Result.District));
                        $('#motherName').html(capitalizeFirstLetter(data.Result.MotherName));
                        $('#nameOfTrade').html(capitalizeFirstLetter(data.Result.NameOfTrade));
                        $('#name2').html(capitalizeFirstLetter(data.Result.Name));
                       // $('#isvalid').html(capitalizeFirstLetter(data.Result.isvalid));
                        //$('#result_json').html(capitalizeFirstLetter(data.ResultJson));

                       
                    }
                    else if (pdf_content_id == 4) {
                        $('#name3').html(capitalizeFirstLetter(data.Result.Name));
                        $('#motherName1').html(capitalizeFirstLetter(data.Result.MotherName));
                        $('#gardianName').html(capitalizeFirstLetter(data.Result.GardianName));
                        $('#board').html(capitalizeFirstLetter(data.Result.Board));
                       // $('#isvalid').html(capitalizeFirstLetter(data.Result.isvalid));
                        //$('#result_json').html(capitalizeFirstLetter(data.ResultJson));

                    }

                    
                    $('#result_json').html(JSON.stringify(JSON.parse(data.ResultJson), null, "\t"));
                }
                else if (data.StatusCode == 102) {

                    $("#invalid_image_message_div").show();
                    $("#invalid_image_message").html("Invalid Document");

                    //alert("Invalid Document");
                    $(".nav_header_content_data").hide();
                    $(".hide_perview_document_data_pdf").hide();
                }
                else {
                    console.log(data.Message);
                    $(".nav_header_content_data").hide();
                    $(".hide_perview_document_data_pdf").hide();
                }
            },
            error: function (data) {
                console.log("error in ajax");
                $(".nav_header_content_data").hide();
                $(".hide_perview_document_data_pdf").hide();
            }
        });
       
        //Check File is not Empty
       
    });

});

function scroll_content() {
    $('html, body').animate({
        scrollTop: $(".nav_header_content_data").offset().top
    }, 2000);
}

function guessImageMime(data) {
    // console.log('first leter', data.substring(0, 5).toUpperCase);
    var first_letter = data.substring(0, 5).toUpperCase();
    console.log(first_letter);
    if (first_letter == '/9J/2') {
        return "image/jpeg";
    } else if (first_letter == '/9J/4') {
        return "image/jpg";
    } else if (first_letter == 'IVBOR') {
        return "image/png";
    } else if (first_letter == 'SUKQA') {
        return "image/tiff";
    } else if (first_letter == 'JVBER') {
        return "image/pdf";
    } else {
        return "";
    }
}

function show_pdf_content_data(pdf_content_id) {
    $(".all_pdf_content").hide();
    $(".nav_header_content_data").show();
    $(".hide_perview_document_data_pdf").show();
    if (pdf_content_id == 1) {
        $("#content_caste_pdf").show();
    } else if (pdf_content_id == 2) {
        $("#content_ppp_pdf").show();
    } else if (pdf_content_id == 3) {
        $("#content_tc_pdf").show();
    } else if (pdf_content_id == 4) {
        $("#content_smc_pdf").show();
    } else if (pdf_content_id == 5) {
        $("#content_smc_pdf1").show();
    } else if (pdf_content_id == 6) {
        $("#content_smc_pdf2").show();
    } else if (pdf_content_id == 7) {
        $("#content_smc_pdf3").show();
    }
}

function encodeImageFileAsURL(element) {
    debugger;
    var ext = $('#file_id').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'tiff', 'tif', 'pdf']) == -1) {
        console.log('invalid Doc');
        error_doc_format();
    } else {
        console.log('valid Doc');
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            //debugger;
            imagebase64 = reader.result;
            //console.log(imagebase64);
            storePicutrValue = reader.result.split(',')[1];
            //  console.log("global file  =>               " + global_file);
            //var mime_type = guessImageMime(storePicutrValue);
            //console.log('mime_type', mime_type);
            SendToGetImageControll();
        }
        reader.readAsDataURL(file);
    }
}

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return "";
    }

}



function SendToGetImageControll() {
    debugger;
    var img_obj = { img: storePicutrValue };
    $.ajax({
        url: "/Home/ocr_extraction/",
        type: "POST",
        data: img_obj,
        success: function (data) {
            var topFaceCount;
            //alert("success in ajax");
            //$("#com_vis_res_disp_id").text("Computer Vision Predition : " + data.Voice);
            //$("#com_vis_res_disp_title_id").text("READ PEDICTION");
            //console.log("data " + data.Voice);
            var obj = JSON.parse(data.Voice);
            console.log("data 2 " + obj.predictions[0].boundingBox.left);
            console.log("tagname " + obj.predictions[7].tagName);
            for (i = 0; i < obj.predictions.length; i++) {
                if (obj.predictions[i].tagName == "face") {
                    topFaceCount = i;
                    break
                }
            }
            console.log("return alue " + topFaceCount);
            canvasImage(20, 10, 50, 40, obj.predictions[0], obj.predictions[topFaceCount]);
            $("#res_disp_id").text("CUSTOM VISION PREDICTED IMAGE");
        },
        error: function (data) {
            alert("error in ajax");
        }
    });
}