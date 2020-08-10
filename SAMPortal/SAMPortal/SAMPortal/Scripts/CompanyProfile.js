$(document).ready(function () {

    if (!$('#management_lnk').parent().hasClass('active')) {
        $('#management_lnk').parent().addClass('active menu-open');
    }

    //===set breadcrumbs
    $('.content-header h1').html("Company Profile");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Company Profile");
    //===

    var newLogo = null;

    var reader = new FileReader();

    reader.onload = function (e) {
        $('#preview').attr('src', e.target.result);
        newLogo = reader.result;
    };

    function readURL(input) {
        if (input.files && input.files[0]) {
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#cp_logo_input").change(function () {
        readURL(this);
    });

    $.ajax({
        url: '/SAMPortal/api/Forms/GetCompanyProfileDetails',
        type: 'GET',
        dataType: 'JSON',
        success: function (result) {
            $('#cp_name_input').val(result.CompanyName);
            $('#cp_location_input').val(result.Location);
            $('#cp_email_input').val(result.Email);
            $('#cp_contact_person_input').val(result.ContactPerson);
            $('#cp_contact_person_position_input').val(result.ContactPersonPosition);
            $('#cp_contact_number_input').val(result.ContactNumber);
            $('#cp_description_textarea').val(result.Description);

            var src = result.Picture;
            var fileType = result.FileType;

            if (src !== null) {

                if (fileType === "jpg" || fileType === "jpeg" || fileType === "JPG") {
                    $('#preview').attr("src", "data:image/jpeg;base64," + src);
                } else if (fileType === "png" || fileType === "PNG") {
                    $('#preview_div').html('<img class="img-responsive" id="preview" src="data:image/png;base64,' + src + '" />');
                }
            } else {
                $('#preview').attr("src", "/SAMPortal/Content/images/Default-Logo.jpg");
            }
        }
    });

    $(document).on('click', '#submit_special_request', function () {
        $('#warning_company_profile_modal .modal-body p').html("Are you sure you want to submit?");        
        $('#warning_company_profile_modal').modal();
    });

    $(document).on('click', '#warning_company_profile_modal_yes', function () {

        var parameters = getParameters();

        $.ajax({
            url: '/SAMPortal/Forms/UpdateCompanyProfile',
            type: 'POST',
            dataType: 'JSON',
            data: { parameters: parameters },
            success: function (result) {

                if (result.data === 1) {
                    $('#success_company_profile_modal .modal-body p').html("Company Profile successfuly updated!");
                    $('#success_company_profile_modal').modal();

                    enableDisableAttribute();
                    $('#cancel_changes_btn').css('display', 'none');
                    $('#submit_special_request').css('display', 'none');
                    $('#update_profile_btn').css('display', 'inline-block');
                }
                
            }
        });
    });

    $(document).on('click', '#update_profile_btn', function () {
        removeDisableAttribute();

        $(this).css('display', 'none');
        $('#submit_special_request').css('display', 'inline-block');
        $('#cancel_changes_btn').css('display', 'inline-block');

    });

    $(document).on('click', '#cancel_changes_btn', function () {
        enableDisableAttribute();

        $(this).css('display', 'none');
        $('#submit_special_request').css('display', 'none');
        $('#update_profile_btn').css('display', 'inline-block');
    });

    function removeDisableAttribute() {
        $('#cp_name_input').removeAttr('disabled');
        $('#cp_location_input').removeAttr('disabled');
        $('#cp_email_input').removeAttr('disabled');
        $('#cp_contact_person_input').removeAttr('disabled');
        $('#cp_contact_person_position_input').removeAttr('disabled');
        $('#cp_contact_number_input').removeAttr('disabled');
        $('#cp_description_textarea').removeAttr('disabled');
        $('#choose_input').removeAttr('disabled');
    }

    function enableDisableAttribute() {
        $('#cp_name_input').attr('disabled', 'disabled');
        $('#cp_location_input').attr('disabled', 'disabled');
        $('#cp_email_input').attr('disabled', 'disabled');
        $('#cp_contact_person_input').attr('disabled', 'disabled');
        $('#cp_contact_person_position_input').attr('disabled', 'disabled');
        $('#cp_contact_number_input').attr('disabled', 'disabled');
        $('#cp_description_textarea').attr('disabled', 'disabled');
        $('#choose_input').attr('disabled', 'disabled');
    }

    function getParameters() {

        var name = $('#cp_name_input').val();
        var location = $('#cp_location_input').val();
        var email = $('#cp_email_input').val();
        var contact = $('#cp_contact_person_input').val();
        var contactPersonPos = $('#cp_contact_person_position_input').val();
        var contactNumber = $('#cp_contact_number_input').val();
        var description = $('#cp_description_textarea').val();

        var logo = newLogo === null ? null : newLogo.split(',')[1];

        var splitString = $('#cp_logo_input').val().split("\\");
        var fileName = splitString[splitString.length - 1];
        var fileNameSplit = fileName.split(".");
        var fileExtension = fileNameSplit[fileNameSplit.length - 1];

        var parameters = [name, location, email, contact, contactPersonPos, contactNumber, description, logo, fileExtension];

        return parameters;
    }
});