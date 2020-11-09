$(document).ready(function () {

    if (document.getElementById('mnno_input').value !== "") {
        let traineeNo = document.getElementById('mnno_input').value;
        getHistory(traineeNo);
    }


    $(document).on('change', '#mnno_input', function () {
        let traineeNo = document.getElementById('mnno_input').value;
        getHistory(traineeNo);
    });

    var historyTable = "";
    function getHistory(traineeNo) {
        $.ajax({
            url: '/SAMPortal/Api/Forms/GetOffSiteAccommodationHistory',
            type: 'GET',
            dataType: 'JSON',
            data: { mnno: traineeNo },
            success: function (result) {

                let content = "";

                if (historyTable != "") {
                    historyTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {
                    let checkInDate = result[i].CheckInDate.split('T');
                    let checkOutDate = result[i].CheckOutDate.split('T');
                    for (var i = 0; i < result.length; i++) {
                        content += "<tr><td>" + result[i].HotelName + "</td>" +
                            "<td>" + (result[i].RoomType == 1 ? "Single (deluxe room)" : "Double (deluxe room)") + "</td><td>" + fixDateFormat(result[i].CheckInDate.split('T')[0]) + "</td><td>" + fixDateFormat(result[i].CheckOutDate.split('T')[0]) + "</td>" +
                            "<td>" + (result[i].ModeOfPayment == 0 ? "Company Sponsored" : "Personal Account") + "</td><td>" + result[i].ReservationBy + "</td><td>" + result[i].Status + "</td><td>" + result[i].BookerRemarks + "</td></tr>";
                    }
                }

                $('#offSiteAccommodationHistory_tbl tbody').html(content);
                historyTable = $('#offSiteAccommodationHistory_tbl').DataTable();
                $('#offSiteAccommodationHistory_tbl_div').css('display', 'block');
                $("#offSiteAccommodationHistory_tbl").css('width', 'inherit');

            }
        });
    }

    var date = new Date();

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#off_site_accommodation_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }

    $('#off_site_date').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        }});

    $('#off_site_date').prev().click(function () {
        $(this).next().focus();
    });

    //=== set breadcrumbs
    $('.content-header h1').html("Off-Site Accommodation");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Accommodation");
    //===

    $(document).on('click', '#off_site_rates_and_inclusions_btn', function () {
        $('#off_site_rates_and_inclusions_modal').modal();
    });

    var offSiteAccommodationParameters = [];
    $(document).on('click', '#save_off_site_btn', function () {
        var mnno = $('#mnno_input').val();
        var rank = $('#rank_input').val();

        var name = $('#name_input').val().split(',');

        let firstName = name[1].split(' ')[1].substring(0, name[1].split(' ')[1].length);
        //let lastName = name[0].substring(0, name[0].length - 1);
        let lastName = name[0];

        var name = $('#name_input').val();
        var date = $('#off_site_date').val();
        var hotel = $('#off_site_hotel_name option:selected').val();
        var room_type = $('#off_site_room_type option:selected').val();
        var payment = $('#off_site_mode_of_payment option:selected').val();
        var reason = $('#off_site_reason option:selected').val();
        var remarks = $('#off_site_remarks_input').val();

        if (mnno === "" || rank === "" || date === "") {
            //$('#off_site_err_msg').css('display', 'block');
            generateWarningModal('off_site_accommodation_warning_modal', 2, '', "Please make sure that the required fields are not left blank before clicking Submit...");
        } else {
            //$('#off_site_err_msg').css('display', 'none');

            $('#modal_offSiteAccommodation_submit .modal-body p').html("Are you sure you want to submit?");
            $('#modal_offSiteAccommodation_submit').modal();

            offSiteAccommodationParameters = [mnno, rank, lastName, firstName, date, hotel, room_type, payment, reason, remarks];
        }
    });

    $(document).on('click', '#modal_offSiteAccommodation_submit_yes', function () {
        saveOffSiteAccommodation(offSiteAccommodationParameters);
    });

    function saveOffSiteAccommodation(parameters) {
        $.ajax({
            url: '/SAMPortal/Forms/SaveOffSiteAccomodation',
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                $.blockUI({ message:null});
            },
            data: { parameters: parameters },
            success: function (result) {
                $.unblockUI();
                if (result.data === 1) {
                    $('#modal_success_accommodation .modal-body p').html("Accommodation Request Successful!");
                    $('#modal_success_accommodation').modal();
                } else {
                    $('.modal-danger .modal-body p').html("Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    $('.modal-danger').modal();
                }

            }
        });
    }

    $('.modal-success').on('hidden.bs.modal', function () {
        //hrefSplit can be seen in userscript.js
        if (typeof (hrefSplit) !== 'undefined') {
            window.close();
        } else {
            window.location.reload();
        }
    });

    $(document).on('click', '#clear_off_site_btn', function () {
        window.location.reload();
    });

});