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