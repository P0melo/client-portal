﻿$(document).ready(function () {

    //var myHref = window.location.href;
    //var hrefSplit = myHref.split('?')[1];

    //if (typeof (hrefSplit) !== 'undefined') {
    //    let traineeNo = hrefSplit.split('+')[0];
    //    let rank = hrefSplit.split('+')[1];
    //    let name = hrefSplit.split('+')[2].replaceAll('%20', ' ');

    //    //trying vanilla javascript
    //    document.getElementById('mnno_input').value = traineeNo;
    //    document.getElementById('rank_input').value = rank;
    //    document.getElementById('name_input').value = name;

    //}


    if (document.getElementById('mnno_input').value !== "") {
        let traineeNo = document.getElementById('mnno_input').value;
        getHirstory(traineeNo);
    }


    $(document).on('change', '#mnno_input', function () {
        let traineeNo = document.getElementById('mnno_input').value;
        getHirstory(traineeNo);
    });

    function getHirstory(traineeNo) {
        $.ajax({
            url: '/SAMPortal/Api/Forms/GetOnSiteAccommodationHistory',
            type: 'GET',
            dataType: 'JSON',
            data: { mnno: traineeNo },
            success: function (result) {

                let content = "";

                for (var i = 0; i < result.length; i++) {
                    let checkInDate = result[i].CheckInDate.split('T');
                    let checkOutDate = result[i].CheckOutDate.split('T');
                    content += "<tr><td>" + (result[i].ReservationType == 1 ? "New Booking" : "Extension") + "</td><td>" + (result[i].RoomType == 1 ? "Dorm - Standard" : "Dorm - Superior") + "</td><td>" + fixDateFormat(checkInDate[0]) + ' ' + checkInDate[1] + "</td><td>" + fixDateFormat(checkOutDate[0]) + ' ' + checkOutDate[1] + "</td><td>" + (result[i].Payment == 0 ? "Company Sponsored" : "Personal Account") + "</td><td>" + result[i].Status + "</td></tr>"
                }

                $('#onSiteAccommodationHistory_tbl tbody').html(content);
                $('#onSiteAccommodationHistory_tbl').dataTable();
                $('#onSiteAccommodationHistory_tbl_div').css('display', 'block');
                $("#onSiteAccommodationHistory_tbl").css('width', 'inherit');

            }
        });
    }

    var date = new Date();
    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#accommodation_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }
    //===set breadcrumbs
    $('.content-header h1').html("On-Site Accommodation");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Accommodation");
    //===
    $('#accomodation_date').daterangepicker({locale : {
        format: 'DD/MM/YYYY'
    }});

    $('#accomodation_date').prev().click(function () {
        $(this).next().focus();
    });

    $(document).on('click', '#accommodation_search_btn', function () {
        var mnno = $('#mnno_input').val();
        getCrewDetails(mnno, 'accomodation');
    });

    $(document).on('click', '#single_occupancy_img', function () {
        $('#room_picture img').css('display', 'none');
        $('#room_picture #hotel_single_room').css('display', 'block');
        $('#room_picture .modal-title').html('Single Occupancy Room');
        $('#room_picture').modal();
    });

    $(document).on('click', '#double_occupancy_img', function () {
        $('#room_picture img').css('display', 'none');
        $('#room_picture #hotel_double_room').css('display', 'block');
        $('#room_picture .modal-title').html('Double Occupancy Room');
        $('#room_picture').modal();
    });

    $(document).on('click', '#standard_dormitory_img', function () {
        $('#room_picture img').css('display', 'none');
        $('#room_picture #dorm_standard_room').css('display', 'block');
        $('#room_picture .modal-title').html('Standard Dormitory Room');
        $('#room_picture').modal();
    });

    $(document).on('click', '#superior_dormitory_img', function () {
        $('#room_picture img').css('display', 'none');
        $('#room_picture #dorm_superior_room').css('display', 'block');
        $('#room_picture .modal-title').html('Superior Dormitory Room');
        $('#room_picture').modal();
    });

    $(document).on('click', '#view_rates_btn', function () {
        $('#rates_and_inclusions_modal').modal();
    });

    $(document).on('change', '#room_type', function () {
        if ($('#room_type option:selected').val() == 3) {
            $('#hotel_single_double_modal').modal();
            $('#save_accomodation_btn').attr('disabled', true);
        } else if ($('#room_type option:selected').val() == 4) {
            $('#hotel_single_double_modal').modal();
            $('#save_accomodation_btn').attr('disabled', true);
        } else {
            $('#save_accomodation_btn').attr('disabled', false);

        }
    });

    var saveAccommodationParameters = [];
    $(document).on('click', '#save_accomodation_btn', function () {
        var mnno = $('#mnno_input').val();
        var rank = $('#rank_input').val();
        var name = $('#name_input').val().split(',');

        let firstName = name[1].split(' ')[1].substring(1, name[1].split(' ')[1].length);
        //let lastName = name[0].substring(0, name[0].length - 1);
        let lastName = name[0];

        var date = $('#accomodation_date').val();
        var reservation_type = $('#reservation_type option:selected').val();
        var room_type = $('#room_type option:selected').val();
        var payment = $('#mode_of_payment option:selected').val();
        var reason = $('#accomodation_reason option:selected').val();
        var remarks = $('#accomodation_remarks_input').val();

        if (mnno === "" || rank === "" || name === "") {
            //$('#accomodation_err_msg').css('display', 'block');
            generateWarningModal('on_site_accommodation_warning_modal', 2, '', "Please make sure that the required fields are not left blank before clicking Submit...");
        } else {

            $('#modal_warning_accommodation_submit .modal-body p').html("Are you sure you want to submit?");
            $('#modal_warning_accommodation_submit').modal();

            $('#accomodation_err_msg').css('display', 'none');

            saveAccommodationParameters = [mnno, rank, lastName, firstName, reservation_type, room_type, date, payment, reason, remarks];

            //saveAccomodation(saveAccommodationParameters);
        }

    });

    $(document).on('click', '#modal_warning_accommodation_submit_yes', function () {
        $(this).attr('disabled', true);
        saveAccomodation(saveAccommodationParameters);
    });

    

    $('.modal-success').on('hidden.bs.modal', function () {
        window.location.reload();
    });

    function getCrewDetails(mnno, htmlId) {

        $.ajax({
            url: '/SAMPortal/api/Forms/GetCrewDetails',
            type: 'get',
            dataType: 'json',
            data: { mnno: mnno },
            success: function (result) {
                if (result.length <= 0) {
                    $('.modal-warning .modal-body p').html("The Marlow number you entered is not found in the database. Please enter an existing Marlow number and try again.");
                    $('.modal-warning').modal();
                } else {
                    var name = result[0].Name;
                    var position = result[0].Position;

                    $('#' + htmlId + '_rank_input').val(position);
                    $('#' + htmlId + '_name_input').val(name);

                    $('#' + htmlId + '_crew_picture img').attr('src', 'http://matrix.umtc.com.ph/CadetPictures/' + mnno + '.jpg?' + date.getMilliseconds());

                    $('#' + htmlId + '_crew_picture img').on('error', function () {
                        $(this).attr('src', '/SAMPortal/Content/images/default.jpg');
                    });
                }
            }
        });
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    function formatDate(data) {

        if (data == null) {
            return "";
        }

        var result = data.replace(/[^0-9 +]/g, '');

        var fdate = new Date(parseInt(result));

        return monthNames[fdate.getMonth()]  + "/" + fdate.getDate() + "/" + fdate.getFullYear();
    }


});