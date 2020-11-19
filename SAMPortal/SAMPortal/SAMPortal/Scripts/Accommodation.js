$(document).ready(function () {

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
        getHistory(traineeNo);
    }


    $(document).on('change', '#mnno_input', function () {
        let traineeNo = document.getElementById('mnno_input').value;
        getHistory(traineeNo);
    });

    var historyTable = "";
    function getHistory(traineeNo) {
        $.ajax({
            url: '/SAMPortal/Api/Forms/GetOnSiteAccommodationHistory',
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
                    content += "<tr><td>" + (result[i].ReservationType == 1 ? "New Booking" : "Extension") + "</td><td>" + (result[i].RoomType == 1 ? "Dorm - Standard" : "Dorm - Superior") +
                        "</td><td>" + fixDateFormat(checkInDate[0]) + ' ' + checkInDate[1] + "</td><td>" + fixDateFormat(checkOutDate[0]) + ' ' + checkOutDate[1] +
                        "</td><td>" + (result[i].Payment == 0 ? "Company Sponsored" : "Personal Account") + "</td><td>" + (result[i].Reason == 12 ? "Accommodation Only" : "Due to In-house Training") +
                        "</td><td>" + result[i].Remarks + 
                        "</td><td>" + result[i].Status + " </td><td style='padding: 0'>" +
                        (result[i].Status == "RESERVED" || result[i].Status == "Reserved" ?
                        "<input type='button' class='btn btn-default' value='Edit' id='edit_accommodation_btn' reservation_id='" + result[i].Id + "' style='width: 50%;'>" +
                        "<input type='button' class='btn btn-danger' value='Cancel' id='cancel_accommodation_btn' reservation_id='" + result[i].Id + "' style='width: 50%;'>" 

                        : "--") +

                        "</td></tr>"
                }

                $('#onSiteAccommodationHistory_tbl tbody').html(content);
                historyTable = $('#onSiteAccommodationHistory_tbl').DataTable();
                $('#onSiteAccommodationHistory_tbl_div').css('display', 'block');
                $("#onSiteAccommodationHistory_tbl").css('width', 'inherit');

            }
        });
    }

    var recordId = "";
    var e_reservation_type = "";
    var e_room_type = "";
    var e_accomodation_date = "";
    var e_mode_of_payment = "";
    var e_accomodation_reason = "";
    var e_accomodation_remarks_input = "";

    $(document).on('click', '#edit_accommodation_btn', function () {
        recordId = $(this).attr('reservation_id');
        let row = $(this).parent().parent();
        let checkInDate = row.children(':eq(2)').html().split(' ')[0];
        let checkOutDate = row.children(':eq(3)').html().split(' ')[0];
        let reservation_type = row.children(':eq(0)').html() == "New Booking" ? "1" : "2";
        let room_type = row.children(':eq(1)').html() == "Dorm - Standard" ? "1" : "2";
        let mode_of_payment = row.children(':eq(4)').html() == "Company Sponsored" ? "0" : "1";
        let accomodation_reason = row.children(':eq(5)').html() == "Accommodation Only" ? "12" : "1";

        $('#e_reservation_type').val(reservation_type);
        $('#e_room_type').val(room_type)
        $('#e_accomodation_date').val(checkInDate + " - " + checkOutDate);
        $('#e_mode_of_payment').val(mode_of_payment);
        $('#e_accomodation_reason').val(accomodation_reason);
        $('#e_accomodation_remarks_input').val(row.children(':eq(6)').html());

        $('#edit_accommodation_modal').modal();
    });

    $(document).on('click', '#save_edited_accomodation_btn', function () {

        if ($('#e_room_type option:selected').val() == 3) {
            $('#hotel_single_double_modal').modal();
            return false;
        } else if ($('#e_room_type option:selected').val() == 4) {
            $('#hotel_single_double_modal').modal();
            return false;
        }

        let modalMessage = "Are you sure you want to submit?";

        generateWarningModal('edit_accommodation_warning_modal', 1, 'edit_accommodation_warning_modal_yes', modalMessage);
    });

    $(document).on('click', '#edit_accommodation_warning_modal_yes', function () {
        e_reservation_type = $('#e_reservation_type').val();
        e_room_type = $('#e_room_type').val();
        e_accomodation_date = $('#e_accomodation_date').val();
        //let checkInDate = e_accomodation_date.split(' - ')[0];
        //let checkOutDate = e_accomodation_date.split(' - ')[1];
        e_mode_of_payment = $('#e_mode_of_payment').val();
        e_accomodation_reason = $('#e_accomodation_reason').val();
        e_accomodation_remarks_input = $('#e_accomodation_remarks_input').val();

        let onSiteAccomodationParameters = [recordId, e_reservation_type, e_room_type, e_accomodation_date, e_mode_of_payment, e_accomodation_reason, e_accomodation_remarks_input];

        $.ajax({
            url: '/SAMPortal/Forms/UpdateOnSiteReservation',
            dataType: 'json',
            type: 'post',
            data: { parameters: onSiteAccomodationParameters },
            beforeSend: function () {
                $.blockUI({
                    baseZ: 2000,
                    message: null
                });
            },
            success: function (result) {
                $.unblockUI();
                if (result.data == 1) {
                    generateSuccessModal("update_on_site_reservation_modal", 2, "", "Reservation UPDATED successfully!");
                    $('#edit_accommodation_modal').modal('hide');

                    let traineeNo = document.getElementById('mnno_input').value;
                    getHistory(traineeNo);

                } else if (result.data == "Rooms") {
                    var fixedFormatting = result.data2.substring(0, result.data2.length - 2);
                    generateWarningModal('e_submit_accommodation_warning_modal', 2, "", "Reservation was not successful. Rooms are full during this/these date/s: " + fixedFormatting);

                } else {
                    generateDangerModal("update_on_site_reservation_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                }
            }
        });
        
    });

    $(document).on('click', '#cancel_accommodation_btn', function () {

        getServerDate().then(function (data) {

            // Run this when your request was successful
            let serverDate = fixServerDateFormat(data);
            let checkInDate = $('#cancel_accommodation_btn').parent().parent().children(':eq(2)').html().split(' ')[0];

            let validatedSchedule = validateSchedule(checkInDate, serverDate);

            if (validatedSchedule == 0) {
                //parameters: modal id, button modal id, modal message
                let modalMessage = "You are no longer allowed to cancel because your accommodation will start next week. <br />If you really need to CANCEL, kindly contact our Sales and Marketing Team instead. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph";
                generateWarningModal('cancel_reservation_not_allowed', 2, '', modalMessage);
            } else {
                recordId = $('#cancel_accommodation_btn').attr('reservation_id');
                let modalMessage = "Are you sure you want to CANCEL this reservation?";

                generateWarningModal('cancel_accommodation_warning_modal', 1, 'cancel_accommodation_warning_modal_yes', modalMessage);
            }

        }).catch(function (err) {
            generateDangerModal("e_cancel_accommodation_error", "Cannot get the Server Date. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

            //$('.modal-danger .modal-body p').html("Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
            //$('.modal-danger').modal();
        });


        //let modalMessage = "Are you sure you want to CANCEL this reservation?";
        //generateWarningModal('cancel_accommodation_warning_modal', 1, 'cancel_accommodation_warning_modal_yes', modalMessage);

    });

    $(document).on('click', '#cancel_accommodation_warning_modal_yes', function () {
        $.ajax({
            url: '/SAMPortal/Forms/CancelAccommodationReservation',
            data: { id: recordId },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                $.blockUI({
                    baseZ: 2000,
                    message: null
                });
            },
            success: function (result) {
                $.unblockUI();
                if (result.data == 1) {
                    generateSuccessModal("cancel_accommodation_reservation_success_modal", 2, "", "Reservation CANCELLED successfully!");

                    let traineeNo = document.getElementById('mnno_input').value;
                    getHistory(traineeNo);
                } else {
                    generateDangerModal("cancel_accommodation_reservation_error_modal", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                }

            }
        });
    });

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

    $('#e_accomodation_date').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        }
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
        let schedId = "";

        //let firstName = name[1].split(' ')[1].substring(1, name[1].split(' ')[1].length);
        let firstName = name[1].split(' ')[1].trim();
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

            if (typeof (hrefSplit) !== 'undefined') {
                schedId = hrefSplit.split('+')[3];
            } 

            saveAccommodationParameters = [mnno, rank, lastName, firstName, reservation_type, room_type, date, payment, reason, remarks, schedId];

            //saveAccomodation(saveAccommodationParameters);
        }

    });

    $(document).on('click', '#modal_warning_accommodation_submit_yes', function () {
        $(this).attr('disabled', true);
        saveAccomodation(saveAccommodationParameters);
    });

    

    $(document).on('hidden.bs.modal', '#save_accomodation_success', function () {
        //let myHref = window.location.href;
        //let hrefSplit = myHref.split('?')[1];

        //hrefSplit can be seen in userscript.js
        if (typeof (hrefSplit) !== 'undefined') {
            window.close();
        } else {
            window.location.reload();
        }
    });

    $(document).on('click', '#clear_accomodation_btn', function () {
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