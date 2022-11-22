function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_mime_type(base64String) {
    debugger;
    var strings = base64String.split(",");
    var extension = "";
    switch (strings[0].toLowerCase()) {//check image's extension
        case "data:image/jpeg;base64":
            extension = "jpeg";
            break;
        case "data:image/png;base64":
            extension = "png";
            break;
        case "data:image/jpg;base64":
            extension = "jpg";
            break;
        case "data:application/pdf;base64":
            extension = "pdf";
            break;
        default://should write cases for more images types
            extension = "others";
            break;
    }
    return extension;
}

function single_convertToBase64(event) {
    $("#process_err_msg").html("");
    //console.log($("#" + event.id + "").val().split(".").pop());
    //console.log(event.getAttribute("pan_name"));

    var selectedFile = document.getElementById("" + event.id + "").files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
        // Select the very first file from list
        var fileToLoad = selectedFile[0];
        // FileReader function for read the file.
        var fileReader = new FileReader();
        var base64;
        // Onload of file read the file content
        fileReader.onload = function (fileLoadedEvent) {
            base64 = (fileLoadedEvent.target.result).split(",")[1];




            // Print data in console
            //console.log(base64);

            if ($("#" + event.id + "_base64").length == 1) {
                $("#" + event.id + "_base64").attr("href", base64);

            } else {
                $("#base64_content").append("<a id='" + event.id + "_base64' href='" + base64 + "' ></a>");
            }


            var get_file_type = get_mime_type(fileLoadedEvent.target.result);

            if (get_file_type == "jpeg" || get_file_type == "jpg" || get_file_type == "png" || get_file_type == "pdf") {
                var image_tag = '';

                if (get_file_type == "pdf") {
                    image_tag = '<iframe id="preview_img2" class="doc custom_img_border" src="' + fileLoadedEvent.target.result + '" frameborder="0" style="width:100%;" height="500px"></iframe>';

                }
                else {

                    image_tag = '<img src="' + fileLoadedEvent.target.result + '" alt="Preview" class="img custom_img_border" style="width: 100%;height: 354px;" id="preview_img2">';
                }
                $("#div_preview_content_file").html(image_tag);
            }
            else {
                $('#preview_img2').attr('src', '/assets/img/img12.jpg');
            }

            //console.log(base64);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);

    }

}

$("#submit_btn_id").click(function () {
    $("#process_err_msg").html("");

    if ($("#document_file").val() == "") {
        $("#process_err_msg").html("Please select a file");
    }
    else {
        var obj = {};
        obj.bank_name = $("#get_bank_name").val();
        obj.document_file_base64 = $("#document_file_base64").attr("href");
        var dataObject = JSON.stringify(obj);
        var get_data = $('#submit_btn_id').attr('data-loading-text');
        $('#submit_btn_id').html(get_data);
        $('#submit_btn_id').attr("disabled", true);
        $("#generate_table_data").empty();
        $.ajax({
            url: "/Ajax/BankaccountstatementForm/",
            type: "POST",
            data: { dataObject: dataObject },
            success: function (data) {
                console.log(data);

                if (data.StatusCode == 200) {

                    $('#account_name').val(data.CustomerName);
                    $('#account_number').val(data.AccountNumber);
                    $('#customer_id').val(data.CustomerID);
                    $('#ifsc_code').val(data.IFSCCode);
                    $('#email_id').val(data.EmailID);
                    $('#phone_no').val(data.PhoneNumber);
                    $('#customer_address').val(data.CustomerAddress);
                    $('#bank_branch').val(data.AccountBranch);
                    $('#account_type').val(data.AccountType);
                    $('#statement_period').val(data.StatementPeriod);

                    var generate_data = "";
                    if (data.Model.length > 0) {
                        for (var i = 0; i < data.Model.length; i++) {
                            //  console.log(data.Invoice_result[i][0] + '  ---   ' + data.Invoice_result[i][1]);
                            generate_data += "<tr><td>" + data.Model[i][0] + "</td><td>" + data.Model[i][1] + "</td><td>" + data.Model[i][2] + "</td><td>" + data.Model[i][3] + "</td><td>" + data.Model[i][4] + "</td><td>" + data.Model[i][5] +"</td></tr>";
                        }
                        $("#generate_table_data").append(generate_data);
                    } else {
                        $("#generate_table_data").append("No Data Available");
                    }

                    $("#initial_hide").show();
                    $('#submit_btn_id').html("Process");
                    $('#submit_btn_id').attr("disabled", false);

                }
                else {
                    $("#initial_hide").hide();
                    $("#process_err_msg").html(data.error);
                    $('#submit_btn_id').html("Process");
                    $('#submit_btn_id').attr("disabled", false);

                }
            },
            error: function (data) {
                $("#initial_hide").hide();
                $("#process_err_msg").html("Something Went Wrong. Please Try Again.");
                $('#submit_btn').html("Process");
                $('#submit_btn').attr("disabled", false);

            }
        });

    }




});




