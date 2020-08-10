$(document).ready(function () {
    if (!$('#management_lnk').parent().hasClass('active')) {
        $('#management_lnk').parent().addClass('active menu-open');
    }

    //===set breadcrumbs
    $('.content-header h1').html("Certificates");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Certificates");
    //===

    var mnnoForRequest = "";

    $(document).on('click', '#single_request_btn', function () {
        mnnoForRequest = $('#mnno_input').val();

        $('#warning_certificates_modal .modal-body p').html("Are you sure you want to submit this request?");
        $('#warning_certificates_modal').modal();

    });

    $(document).on('click', '#warning_certificates_modal_yes', function () {
        sendEmailRequest(mnnoForRequest);
    });

    function sendEmailRequest(mnnoForRequest) {
        $.ajax({
            url: '/SAMPortal/Forms/SendRequestEmail',
            dataType: 'JSON',
            type: 'POST',
            data: { mnno: mnnoForRequest },
            success: function(result) {
                if (result.data == 1) {
                    $('#success_certificates_modal .modal-body p').html("Your certificate request for " + mnnoForRequest + " has been sent!");
                    $('#success_certificates_modal').modal();
                    $('#mnno_input').val('');
                }
            }
        });
    }

    $(document).on('click', '#warning_batch_certificates_modal_yes', function () {
        var mnnos = $('#mnno_input_batch').val().split(',');

        $.ajax({
            url: '/SAMPortal/Forms/SendRequestEmailBatch',
            dataType: 'JSON',
            type: 'POST',
            data: { mnnos: mnnos },
            success: function (result) {
                if (result.data == 1) {
                    $('#success_certificates_modal .modal-body p').html("Your certificate request for " + mnnos + " has been sent!");
                    $('#success_certificates_modal').modal();

                    $('#mnno_input_batch').val();
                }
            }
        });
    });

    $(document).on('click', '#batch_request_btn', function () {
        $('#warning_batch_certificates_modal .modal-body p').html("Are you sure you want to submit this request?");
        $('#warning_batch_certificates_modal').modal();
    });

});