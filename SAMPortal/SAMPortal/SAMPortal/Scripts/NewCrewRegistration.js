$(document).ready(function () {
    var date = new Date();

    //var inputWidth = document.getElementById('LastName').clientWidth + "px";

    var checkforduplicate_mnno = "";
    var checkforduplicate_rank = "";

    //this two is needed in the coursebooking part of register new crew page
    var mnnoAfterRegistration = "";
    var position = 0;

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#newCrewRegistration_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }

    //===set breadcrumbs
    $('.content-header h1').html("Register New Crew");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Register New Crew");
    //===

    $('#datepicker').datepicker();
    $('#accomodation_date').daterangepicker();
    $('#accomodation_date').val('');
    $('#off_site_date').daterangepicker();
    $('#off_site_date').val('');
    $('#meal_reservation').daterangepicker();
    $('#meal_reservation').val('');
    $('#transportation_date').datepicker();
    $('#transportation_date_outbound').datepicker();

    var dailyTransferDateMonth = date.getMonth() + 1;
    var dailyTransferDateDay = date.getDate();

    var dailyTransferDateOutput = (dailyTransferDateMonth < 10 ? '0' : '') + dailyTransferDateMonth + '/' +
        (dailyTransferDateDay < 10 ? '0' : '') + dailyTransferDateDay + '/' + date.getFullYear();

    $('#pick_up_date').datepicker().val(dailyTransferDateOutput);

    $('#pick_up_date').prev().click(function () {
        $(this).next().focus();
    });

    $('#pick_up_date_2').datepicker().val(dailyTransferDateOutput);

    $('#pick_up_date_2').prev().click(function () {
        $(this).next().focus();
    });

    $('#pick_up_time').timepicker({ interval: '15' }).val('08:00 AM');

    $('#pick_up_time_2').timepicker({ interval: '15' }).val('08:00 AM');

    $('#datepicker').prev().click(function () {
        $(this).next().focus();
    });

    $('#accomodation_date').prev().click(function () {
        $(this).next().focus();
    });

    $('#off_site_date').prev().click(function () {
        $(this).next().focus();
    });

    $('#transportation_date').prev().click(function () {
        $(this).next().focus();
    });

    $('#transportation_date_outbound').prev().click(function () {
        $(this).next().focus();
    });

    $('#meal_reservation').prev().click(function () {
        $(this).next().focus();
    });

    $(document).on('click', '#modal_success_new_crew_registration_no', function () {
        window.location.reload();
    });
    
    $("#update_rank_modal #position_update").select2({ theme: "bootstrap", placeholder: "Select Rank", width: "auto" });

    $("#new_crew_registration #position").select2({ theme: "bootstrap", placeholder: "Select Rank", width: 'auto' });

    $('.select2-container--bootstrap .select2-selection--single').css({ 'padding-top': '10px', 'border-radius': '0px' });

    $(document).on('click', '#view_rates_btn', function () {
        $('#rates_and_inclusions_modal').modal();
    });

    $(document).on('click', '#off_site_rates_and_inclusions_btn', function () {
        $('#off_site_rates_and_inclusions_modal').modal();
    });

    $(document).on('click', '#transportation_rates_btn', function () {
        $('#transportation_rates_modal').modal();
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

    $(document).on('click', '#request_btn', function (e) {
        var inputFile = document.getElementById('InputFile');
        var imageSizeLimit = 5000000;//5245329;
        var firstName = 0;
        //var position = 0; see at top of javascript file
        var lastName = 0;
        var middleName = 0;
        var nationality = 0;
        var datepicker = 0;
        var birthPlace = 0;
        var contact = 0;

        if ($('#FirstName').val() == "") {
            $('#FirstName').css('border-color', 'red');
            e.preventDefault();
        } else {
            firstName = 1;
            $('#FirstName').css('border-color', '#ccc');
        }

        if ($('#position option:selected').val() == "") {
            $('#position + span .select2-selection').css('border-color', 'red');
            e.preventDefault();
        } else {
            position = 1;
            $('#position + span .select2-selection').css('border-color', '#ccc');
        }

        if ($('#LastName').val() == "") {
            $('#LastName').css('border-color', 'red');
            e.preventDefault();
        } else {
            lastName = 1;
            $('#LastName').css('border-color', '#ccc');
        }

        if ($('#MiddleName').val() == "") {
            $('#MiddleName').css('border-color', 'red');
            e.preventDefault();
        } else {
            middleName = 1;
            $('#MiddleName').css('border-color', '#ccc');
        }

        if ($('#datepicker').val() == "") {
            $('#datepicker').css('border-color', 'red');
            e.preventDefault();
        } else {
            datepicker = 1;
            $('#datepicker').css('border-color', '#ccc');
        }

        if ($('#BirthPlace').val() == "") {
            $('#BirthPlace').css('border-color', 'red');
            e.preventDefault();
        } else {
            birthPlace = 1;
            $('#BirthPlace').css('border-color', '#ccc');
        }

        if (inputFile.files[0] != null) {
            if (inputFile.files[0].size > imageSizeLimit) {
                $('.modal-warning .modal-title').html("Warning!");
                $('.modal-warning .modal-body p').html("Please limit your image file to 5mb only.");
                $('.modal-warning').modal();
                e.preventDefault();
            } else {
                $('#InputFile').css('border-color', '#ccc');
            }
        }

        if (firstName == 1 && position == 1 && lastName == 1 && middleName == 1 && nationality == 1 && datepicker == 1 && birthPlace == 1 && contact == 1) {

            $('#modal_warning_request .modal-body p').html('Are you sure you want to submit this request?');
            $('#modal_warning_request').modal();
        } else {
            $('#new_crew_registration_err_msg').css('display', 'block');
        }
    });

    //removed so that variables will not get refreshed
    //$(document).on('click', '#modal_close_btn', function () {
    //    window.location.reload();
    //});

    $(document).on('focusin : click', '#FirstName', function () {
        $('#dialog').css('position', 'absolute');
        $('#dialog').css('top', $(this).offset().top - $('#dialog').height());
        $('#dialog').css('left', $(this).offset().left + $(this).parent().width());
        $('#dialog').fadeIn();
    });

    /******************Transportation Arrangement*************************/
    var dailyTransferCounter = 0;

    var dailyTransferEntryToRemove = "";
    $(document).on('click', '#remove_daily_transfer_entry', function () {
        let row = $(this).parent().parent();
        let type = row.children().eq(0).html();
        let pickup = row.children().eq(1).html();
        let dropoff = row.children().eq(2).html();
        let pickup_date_time = row.children().eq(3).html();
        let pickup_2 = row.children().eq(4).html();
        let dropoff_2 = row.children().eq(5).html();
        let pickup_date_time_2 = row.children().eq(6).html();
        let rowEntry = ""

        if (pickup_2.trim() != "") {
            rowEntry = type + ", " + pickup + ", " + dropoff + ", " + pickup_date_time + ", " + pickup_2 + ", " + dropoff_2 + ", " + pickup_date_time_2;
        } else {
            rowEntry = type + ", " + pickup + ", " + dropoff + ", " + pickup_date_time
        }

        dailyTransferEntryToRemove = row;

        generateWarningModal("transportation_warning", 1, "transportation_warning_yes", "Are you sure you want to remove this item? <br /><br /> " + rowEntry);
    });

    $(document).on('change', '#transportation_type', function () {
        ////$('#transportation_type').val('');
        //$('#transportation_vehicle').val('');
        //$('#transportation_date').val('');
        //$('#dt_optradio_1').prop('checked', true);
        //$('#dt_optradio_2').prop('checked', false);
        //$('#airport_cb_i').prop('checked', true);
        //$('#airport_cb_o').prop('checked', false);
        //$('#InputFileTransportation').val('');
        //$('#pickup_input').val('');
        //$('#datetime_input').val('');
        //$('#dropoff_input').val('');
        //$('#2ndpickup_input').val('');
        //$('#2nddatetime_input').val('');
        //$('#2nddropoff_input').val('');
        //$('#transportation_details').val('');
        //var selected = $("#transportation_type option:selected").val();

        //if (selected === "Daily Transfer") {
        //    $('.daily_transfer').css('display', 'inline-block');
        //    $('.airport_transfer').css('display', 'none');
        //    //$('#airport_cb_i').prop('checked', false);
        //    //$('#airport_cb_o').prop('checked', false);

        //} else if (selected === "Airport Transfer") {
        //    $('.airport_transfer').css('display', 'inline-block');
        //    $('.daily_transfer').css('display', 'none');
        //    //$('input[name=dt_optradio]').prop('checked', false);

        //    $('.one_trip_details').css('display', 'none');
        //    $('.two_trip_details').css('display', 'none');
        //}

        var selected = $("#transportation_type option:selected").val();
        if (selected === "Daily Transfer") {
            $('.daily_transfer').css('display', 'inline-block');
            $('.airport_transfer').css('display', 'none');

            $('#airport_cb_i').prop('checked', true);
            $('#airport_cb_o').prop('checked', false);

            $('.one_trip_details').css('display', 'block');
            //$('#dt_optradio_1]').prop('checked', true);
            $('#inbound_date').parent().css('display', 'none');
            $('#daily_transfer_table').css('display', 'block');

            $('#output').val("");
            $('#InputFile').val("");

        } else if (selected === "Airport Transfer") {
            $('.airport_transfer').css('display', 'inline-block');
            $('.daily_transfer').css('display', 'none');

            $('#inbound_date').parent().css('display', 'inline-block');
            $('#daily_transfer_table').css('display', 'none');

            $('.one_trip_details').css('display', 'none');
            $('.two_trip_details').css('display', 'none');
        }

    });

    //$(document).on('click', 'input[name=dt_optradio]', function () {
    //    var selected = $('input[name=dt_optradio]:checked').val();

    //    if (selected === "1") {
    //        $('.one_trip_details').css('display', 'inline-block');
    //        $('.two_trip_details').css('display', 'none');

    //        $('#2ndpickup_input').val('');
    //        $('#2nddatetime_input').val('');
    //        $('#2nddropoff_input').val('');

    //    } else if (selected === "2") {
    //        $('.one_trip_details').css('display', 'inline-block');
    //        $('.two_trip_details').css('display', 'inline-block');
    //    }

    //});
    $(document).on('click', 'input[name=dt_optradio]', function () {
        var selected = $('input[name=dt_optradio]:checked').val();

        if (selected === "1") {
            $('.one_trip_details').css('display', 'inline-block');
            $('.two_trip_details').css('display', 'none');
        } else if (selected === "2") {
            $('.one_trip_details').css('display', 'inline-block');
            $('.two_trip_details').css('display', 'inline-block');
        }

    });

    $(document).on('change', '#airport_cb_i', function () {
        $('#transportation_date').val('');
        if ($('#airport_cb_i').is(':checked')) {
            $('#transportation_date').prop('disabled', false);
        } else {
            $('#transportation_date').prop('disabled', true);

        }
    });

    $(document).on('change', '#airport_cb_o', function () {
        $('#transportation_date_outbound').val('');
        if ($('#airport_cb_o').is(':checked')) {
            $('#transportation_date_outbound').prop('disabled', false);
        } else {
            $('#transportation_date_outbound').prop('disabled', true);

        }
    });

    $(document).on('click', '#add_daily_transfer', function () {
        let type = $('input[name=dt_optradio]:checked').val() == 1 ? "One-way" : "Round-trip";
        let pickup = $('#pickup_input').val();
        let dropoff = $('#dropoff_input').val();
        let pickup_date = $('#pick_up_date').val();
        let pickup_time = $('#pick_up_time').val();
        let pickup_2 = "";
        let dropoff_2 = "";
        let pickup_date_2 = "";
        let pickup_time_2 = "";

        let entry = [];

        if (pickup == '' || dropoff == '' || pickup_date == '' || pickup_time == '') {

            generateWarningModal("transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking 'Add to table'");
            return false;
        }

        if ($('#2ndpickup_input').is(':visible') === true) {
            pickup_2 = $('#2ndpickup_input').val();
            dropoff_2 = $('#2nddropoff_input').val();
            pickup_date_2 = $('#pick_up_date_2').val();
            pickup_time_2 = $('#pick_up_time_2').val();

            if (pickup_2 == '' || dropoff_2 == '' || pickup_date_2 == '' || pickup_time_2 == '') {

                generateWarningModal("transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking 'Add to table'");
                return false;
            }
        }

        let details = "<tr><td>" + type + "</td><td>" + pickup + "</td><td>" + dropoff + "</td><td>" + pickup_date + " " + pickup_time + "</td><td>" + pickup_2 + "</td><td>" + dropoff_2 + "</td>" +
            "<td>" + pickup_date_2 + " " + pickup_time_2 + "</td><td style='padding: 1px;'><button id='remove_daily_transfer_entry' dtid = '" + dailyTransferCounter + "' class='btn btn-default' style='width: 100%'><i class='fa fa-times'></i></button></td></tr > ";

        $('#daily_transfer_table div table tbody').append(details);

        entry[0] = type;
        entry[1] = pickup;
        entry[2] = dropoff;
        entry[3] = pickup_date + " " + pickup_time;
        entry[4] = pickup_2;
        entry[5] = dropoff_2;
        entry[6] = pickup_2 != '' ? pickup_date_2 + " " + pickup_time_2 : "";
        entry[7] = dailyTransferCounter;

        dailyTransferDetails.push(entry);

        dailyTransferCounter++;

    });

    //*****************************Clear Fields*********************************
    $(document).on('click', '#clear_in_house_booking', function () {
        clearInHouse();
    });

    function clearInHouse() {
        $('#reservation_type').val('');
        $('#room_type').val('');
        $('#accomodation_date').val('');
        $('#mode_of_payment').val('');
        $('#accomodation_reason').val('');
        $('#accomodation_remarks_input').val('');
    }

    $(document).on('click', '#clear_transportation', function () {
        clearTransportation();
    });

    function clearTransportation() {
        $('#transportation_type').val('');
        $('#transportation_vehicle').val('');
        $('#transportation_date').val('');
        //$('#dt_optradio_1').prop('checked', false);
        //$('#dt_optradio_2').prop('checked', false);
        //$('#airport_cb_i').prop('checked', false);
        //$('#airport_cb_o').prop('checked', false);
        $('#InputFileTransportation').val('');
        $('#outputTransportation').val('');
        $('#pickup_input').val('');
        $('#datetime_input').val('');
        $('#dropoff_input').val('');
        $('#2ndpickup_input').val('');
        $('#2nddatetime_input').val('');
        $('#2nddropoff_input').val('');
        $('#transportation_details').val('');
        dailyTransferDetails = [];
        $('#daily_transfer_table div table tbody').html('');
    }

    $(document).on('click', '#clear_meals_arrangement', function () {
        clearMeals();
    });

    function clearMeals() {
        $('#meal_reservation').val('');
        $('#reason_input').val('');
        $('#breakfast_cb').prop('checked', false);
        $('#am_snack_cb').prop('checked', false);
        $('#lunch_cb').prop('checked', false);
        $('#pm_snack_cb').prop('checked', false);
        $('#dinner_cb').prop('checked', false);
    }

    $(document).on('click', '#clear_out_house_booking', function () {
        clearOutHouse();
    });

    function clearOutHouse() {
        $('#off_site_hotel_name').val('');
        $('#off_site_room_type').val('');
        $('#off_site_date').val('');
        $('#off_site_mode_of_payment').val('');
        $('#off_site_reason').val('');
        $('#off_site_remarks_input').val('');
    }

    function clearRegisterNewCrew() {
        $('#FirstName').val('');
        $('#new_crew_registration #position').val('').trigger('change');
        $('#LastName').val('');
        $('#MiddleName').val('');
        $('#datepicker').val('');
        $('#BirthPlace').val('');
    }

    function clearAllFields() {
        clearRegisterNewCrew();
        clearOutHouse();
        clearTransportation();
        clearMeals();
        clearInHouse();
    }

    //*******************************************Check form boxes if changed***********************************************
    var i_reservation_type;
    var i_room_type;
    var i_accommodation;
    var i_mode_of_payment;
    var i_accommodation_reason;
    var i_accommodation_remarks_input;

    var t_transportation_type;
    var t_transportation_vehicle;
    var t_transportation_date;
    var t_dt_optradio_1;
    var t_dt_optradio_2;
    var t_airport_cb_i;
    var t_airport_cb_o;
    var t_InputFileTransportation;
    var t_outputTransportation;
    var t_pickup_input;
    var t_datetime_input;
    var t_dropoff_input;
    var t_2ndpickup_input;
    var t_2nddatetime_input;
    var t_2nddropoff_input;
    var t_transpotation_details;

    var m_meal_reservation;
    var m_reason_input;
    var m_breakfast_cb;
    var m_am_snack_cb;
    var m_lunch_cb;
    var m_pm_snack_cb;
    var m_dinner_cb;

    var o_off_site_hotel_name;
    var o_off_site_room_type;
    var o_off_site_date;
    var o_off_site_mode_of_payment;
    var o_off_site_reason;
    var o_off_site_remarks_input;

    //function getTransportationFieldsValues() {
    //    t_transportation_type = $('#transportation_type').val();
    //    t_transportation_vehicle = $('#transportation_vehicle').val();
    //    t_transportation_date = $('#transportation_date').val();
    //    t_dt_optradio_1 = $('#dt_optradio_1').is(':checked');
    //    t_dt_optradio_2 = $('#dt_optradio_2').is(':checked');
    //    t_airport_cb_i = $('#airport_cb_i').is(':checked');
    //    t_airport_cb_o = $('#airport_cb_o').is(':checked');
    //    t_InputFileTransportation = $('#InputFileTransportation').val();
    //    t_pickup_input = $('#pickup_input').val();
    //    t_datetime_input = $('#datetime_input').val();
    //    t_dropoff_input = $('#dropoff_input').val();
    //    t_2ndpickup_input = $('#2ndpickup_input').val();
    //    t_2nddatetime_input = $('#2nddatetime_input').val();
    //    t_2nddropoff_input = $('#2nddropoff_input').val();
    //    t_transpotation_details = $('#transportation_details').val();
    //    t_outputTransportation = $('#outputTransportation').val();

    //    if (t_transportation_type == '' && t_transportation_vehicle == '' && t_transportation_date == '' && t_dt_optradio_1 == false && t_dt_optradio_2 == false && t_airport_cb_i == false &&
    //        t_airport_cb_o == false && t_InputFileTransportation == '' && t_pickup_input == '' && t_datetime_input == '' && t_dropoff_input == '' && t_2ndpickup_input == '' && t_2nddatetime_input == '' &&
    //        t_2nddropoff_input == '' && t_transpotation_details == '') {

    //        transportation = 1;
    //        return true;


    //    } else {
    //        if (t_transportation_type == "Airport Transfer") {
    //            if (t_transportation_type == '' || t_transportation_vehicle == '' || t_transportation_date == '' || (t_airport_cb_i == false && t_airport_cb_o == false) ||
    //                t_InputFileTransportation == '' || t_transpotation_details == '') {
    //                alert("Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                return false;
    //            } else {
    //                transportation = 0;
    //                return true;
    //            }
    //        } else if (t_transportation_type == "Daily Transfer") {
    //            if (t_transportation_type == '' || t_transportation_vehicle == '' || t_transportation_date == '' || (t_dt_optradio_1 == false && t_dt_optradio_2 == false)) {
    //                alert("Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                return false;
    //            } else if (t_dt_optradio_1 == true) {
    //                if (t_pickup_input == '' || t_datetime_input == '' || t_dropoff_input == '') {
    //                    alert("Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                    return false;
    //                } else {
    //                    transportation = 0;
    //                    return true;
    //                }
    //            } else if (t_dt_optradio_2 == true) {
    //                if (t_pickup_input == '' || t_datetime_input == '' || t_dropoff_input == '' || t_2ndpickup_input == '' || t_2nddatetime_input == '' ||
    //                    t_2nddropoff_input == '' || t_transpotation_details == '') {
    //                    alert("Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                    return false;
    //                } else {
    //                    transportation = 0;
    //                    return true;
    //                }
    //            }
    //        }
    //    }
    //}

    //function getMealsArrangementFieldsValues() {
    //    m_meal_reservation = $('#meal_reservation').val();
    //    m_reason_input = $('#reason_input').val();
    //    m_breakfast_cb = $('#breakfast_cb').is(':checked');
    //    m_am_snack_cb = $('#am_snack_cb').is(':checked');
    //    m_lunch_cb = $('#lunch_cb').is(':checked');
    //    m_pm_snack_cb = $('#pm_snack_cb').is(':checked');
    //    m_dinner_cb = $('#dinner_cb').is(':checked');


    //    if (m_meal_reservation == '' && m_reason_input == '' && m_breakfast_cb == false && m_am_snack_cb == false && m_lunch_cb == false && m_pm_snack_cb == false && m_dinner_cb == false) {
    //        mealsArrangement = 1;
    //        return true;

    //    } else {
    //        if (m_meal_reservation == '' || m_reason_input == '' || (m_breakfast_cb == false && m_am_snack_cb == false && m_lunch_cb == false && m_pm_snack_cb == false && m_dinner_cb == false)) {
    //            alert("Please make sure that no field is left blank or press the Clear button if you do not want to arrange a meal...");
    //            return false;
    //        } else {
    //            mealsArrangement = 0;
    //            return true;
    //        }
    //    }

    //}

    //function getOutHouseBookingFieldsValues() {
    //    o_off_site_hotel_name = $('#off_site_hotel_name').val();
    //    o_off_site_room_type = $('#off_site_room_type').val();
    //    o_off_site_date = $('#off_site_date').val();
    //    o_off_site_mode_of_payment = $('#off_site_mode_of_payment').val();
    //    o_off_site_reason = $('#off_site_reason').val();
    //    o_off_site_remarks_input = $('#off_site_remarks_input').val();

    //    if (o_off_site_hotel_name == '' && o_off_site_room_type == '' && o_off_site_date == '' && o_off_site_mode_of_payment == '' && o_off_site_reason == '' && o_off_site_remarks_input == '') {
    //        outHouseBooking = 1;
    //        return true;

    //    } else {
    //        if (o_off_site_hotel_name == '' || o_off_site_room_type == '' || o_off_site_date == '' || o_off_site_mode_of_payment == '' || o_off_site_reason == '' || o_off_site_remarks_input == '') {
    //            alert("Please make sure that no field is left blank or press the Clear button if you do not want book for a Hotel Accommodation...");
    //            return false;
    //        } else {
    //            outHouseBooking = 0;
    //            return true;
    //        }
    //    }

    //}


    $(document).on('click', '#modal_warning_request_yes', function () {
        $('#new_crew_registration_err_msg').css('display', 'none');
        firstName = $('#FirstName').val();
        position = $('#position option:selected').val();
        lastName = $('#LastName').val();
        middleName = $('#MiddleName').val();
        datepicker = $('#datepicker').val();
        birthPlace = $('#BirthPlace').val();
        let picture = $('#output').val();

        //let inHouseBookingStatus = "";
        //let outHouseBookingStatus = "";
        //let transportationStatus = "";
        //let mealsStatus = "";

        //let mergeMessage = "";

        //let ihbp = [];
        //let tap = [];
        //let map = [];
        //let ohbp = [];

        //if (inHouseBooking == 0) {
        //    ihbp = [position, lastName, firstName, i_reservation_type, i_room_type, i_accommodation, i_mode_of_payment, i_accommodation_reason, i_accommodation_remarks_input];
        //}

        //if (transportation == 0) {
        //    let splitString = t_InputFileTransportation.split("\\");
        //    let fileName = splitString[splitString.length - 1];
        //    let fileNameSplit = fileName.split(".");
        //    let fileExtension = fileNameSplit[fileNameSplit.length - 1];

        //    tap = [position, firstName, lastName, t_transportation_type, t_transportation_vehicle, t_transportation_date, t_dt_optradio_1, t_dt_optradio_2, t_airport_cb_i, t_airport_cb_o,
        //        t_transpotation_details, t_outputTransportation, t_pickup_input, t_datetime_input, t_dropoff_input, t_2ndpickup_input, t_2nddatetime_input, t_2nddropoff_input, fileExtension];
        //}

        //if (mealsArrangement == 0) {
        //    map = [position, lastName + ", " + firstName + " " + middleName.charAt(0), m_meal_reservation, m_reason_input, m_breakfast_cb, m_am_snack_cb, m_lunch_cb, m_pm_snack_cb, m_dinner_cb];
        //}

        //if (outHouseBooking == 0) {
        //    ohbp = [position, lastName, firstName, o_off_site_date, o_off_site_hotel_name, o_off_site_room_type, o_off_site_mode_of_payment, o_off_site_reason, o_off_site_remarks_input];
        //}

        $.ajax({
            url: '/SAMPortal/Forms/SaveNewCrew',
            dataType: 'json',
            type: 'POST',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { firstName: firstName, position: position, lastName: lastName, middleName: middleName, datepicker: datepicker, birthPlace: birthPlace, inputFile: picture/*, ihbp, tap, map, ohbp*/ },
            success: function (result) {
                $.unblockUI();
                if (result.status == "Success") {

                    //let inHouseBookingMessage = "<br /><hr /><h4>In House Booking <h4/><br />";
                    //let fixedFormatting = "";
                    //let transportationMessage = "<br /><hr /><h4>Transportation Arrangement <h4/><br />";
                    //let outHouseBookingMessage = "<br /><hr /><h4>Off Site Booking <h4/><br />";
                    //let mealsMessage = "<br /><hr /><h4>Meals Arrangement <h4/><br />";

                    //if (inHouseBooking == 0) {

                    //    if (result.inHouseBookingResponse.data === 1) {
                    //        inHouseBookingMessage += "In House Booking Request Sent!";
                    //        inHouseBookingStatus = 1;
                    //    } else if (result.inHouseBookingResponse.data === "Rooms") {
                    //        fixedFormatting = result.inHouseBookingResponse.data2.substring(0, result.inHouseBookingResponse.data2.length - 2);
                    //        inHouseBookingMessage += "Reservation was not successful. Rooms are full during this/these date/s: " + fixedFormatting + ". To choose a different date, kindly go to In House Booking section of this page or request to Book for a hotel outside UMTC in the Out House Booking section of this page.";
                    //        inHouseBookingStatus = 0;

                    //    }

                    //    mergeMessage += inHouseBookingMessage;

                    //}

                    //if (transportation == 0) {

                    //    if (result.transportationResponse.data === 1) {
                    //        transportationMessage += "Transportation Arrangement Request Sent!";
                    //        transportationStatus = 1;
                    //    } else {
                    //        transportationMessage += "Please send this error ID (" + (result.transportationResponse.data == null || result.transportationResponse.data == "" ? "000" : result.transportationResponse.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph";
                    //        transportationStatus = 0;

                    //    }

                    //    mergeMessage += transportationMessage;

                    //}

                    //if (mealsArrangement == 0) {

                    //    if (result.mealsResponse.data == 1) {
                    //        mealsMessage += "Meals Arrangement Request Request Sent!";
                    //        mealsStatus = 1;
                    //    } else {
                    //        mealsMessage += "Please send the this error ID (" + (result.mealsResponse.data == null || result.mealsResponse.data == "" ? "000" : result.mealsResponse.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph";
                    //        mealsStatus = 0;
                    //    }

                    //    mergeMessage += mealsMessage;

                    //}


                    //if (outHouseBooking == 0) {

                    //    if (result.outHouseBookingResponse.data === 1) {
                    //        outHouseBookingMessage += "Out House Booking Request Sent!";
                    //    } else {
                    //        outHouseBookingMessage += "Please send the this error ID (" + result.outHouseBookingResponse.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph";
                    //    }

                    //    mergeMessage += outHouseBookingMessage;

                    //}

                    //$('#modal-success .modal-body p').html("New Crew Request Sent! " + mergeMessage);
                    mnnoAfterRegistration = "Temp" + result.tempId;
                    //$('#modal-success .modal-body p').html("New Crew Request Sent!<br/><br/>Would you like to enroll the newly registered crew or book him/her to our other services?");
                    //$('#modal-success').modal();
                    generateSuccessModal("modal_success_new_crew_registration", 1, "modal_success_new_crew_registration_yes", "New Crew Request Sent!<br/><br/>Would you like to enroll the newly registered crew or book him/her to our other services?", "modal_success_new_crew_registration_no")

                } else if (result.status == "Error") {
                    generateDangerModal("save_new_crew_error_modal", "Please send the this error ID (" + (result.logId == null || result.logId == "" ? "000" : result.logId) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                }

            }
        });
    });

    $(document).on('click', '#modal_success_new_crew_registration_yes', function () {
        $('#crouse_booking').css('display', 'block');
        $('#left_box').css('display', 'block');
        $('#right_box').css('display', 'block');
    });

    function submit_new_crew_request() {
        let inputFile = document.getElementById('InputFile');
        let imageSizeLimit = 5000000;//5245329;
        //let firstName = 0;
        //let position = 0;
        //let lastName = 0;
        //let middleName = 0;
        //let nationality = 0;
        //let datepicker = 0;
        //let birthPlace = 0;
        //let contact = 0;

        //let inHouseBookingParameters = [];
        //let outHouseBookingParameters = [];
        //let transportationArrangementParameters = [];
        //let mealsArrangementParameters = [];


        //if ($('#FirstName').val() == "") {
        //    $('#FirstName').css('border-color', 'red');
        //    //e.preventDefault();
        //} else {
        //    firstName = 1;
        //    $('#FirstName').css('border-color', '#ccc');
        //}

        //if ($('#position option:selected').val() == "") {
        //    $('#position + span .select2-selection').css('border-color', 'red');
        //    //e.preventDefault();
        //} else {
        //    position = 1;
        //    $('#position + span .select2-selection').css('border-color', '#ccc');
        //}

        //if ($('#LastName').val() == "") {
        //    $('#LastName').css('border-color', 'red');
        //    //e.preventDefault();
        //} else {
        //    lastName = 1;
        //    $('#LastName').css('border-color', '#ccc');
        //}

        ////commented becuase Middle Initial field is not required
        ////if ($('#MiddleName').val() == "") {
        ////    $('#MiddleName').css('border-color', 'red');
        ////    //e.preventDefault();
        ////} else {
        ////    middleName = 1;
        ////    $('#MiddleName').css('border-color', '#ccc');
        ////}

        //if ($('#datepicker').val() == "") {
        //    $('#datepicker').css('border-color', 'red');
        //    //e.preventDefault();
        //} else {
        //    datepicker = 1;
        //    $('#datepicker').css('border-color', '#ccc');
        //}

        //if ($('#BirthPlace').val() == "") {
        //    $('#BirthPlace').css('border-color', 'red');
        //    //e.preventDefault();
        //} else {
        //    birthPlace = 1;
        //    $('#BirthPlace').css('border-color', '#ccc');
        //}

        if (inputFile.files[0] != null) {
            if (inputFile.files[0].size > imageSizeLimit) {
                //$('.modal-warning .modal-title').html("Warning!");
                //$('.modal-warning .modal-body p').html("Please limit your image file to 5mb only.");
                //$('.modal-warning').modal();
                //e.preventDefault();
                generateWarningModal('image_size_limit_modal', 2, 'image_size_limit_modal_ok', "Please limit your image file to 5mb only.");
                return;
            } else {
                $('#InputFile').css('border-color', '#ccc');
            }
        }

        //if (firstName == 1 && position == 1 && lastName == 1 /*&& middleName == 1*/ && datepicker == 1 && birthPlace == 1 /*&& checkFormBoxesError() == 1*/) {

        $('#modal_warning_request .modal-body p').html('Are you sure you want to submit this request?');
        $('#modal_warning_request').modal();

        //} else {
        //    $('#new_crew_registration_err_msg').css('display', 'block');
        //}

    }

    //var inHouseBooking = 0, transportation = 0, mealsArrangement = 0, outHouseBooking = 0;

    //function checkFormBoxesError() {

    //    var inHouseBookingStatus = getInHouseBookingFieldsValues();
    //    var transportationStatus = getTransportationFieldsValues();
    //    var mealsArrangementStatus = getMealsArrangementFieldsValues();
    //    var outHouseBookingStatus = getOutHouseBookingFieldsValues();

    //    if (inHouseBookingStatus && transportationStatus && mealsArrangementStatus && outHouseBookingStatus) {
    //        return 1;
    //    } else {
    //        return 0;
    //    }

    //}

    $(document).on('change', '#position', function () {
        $('#position + span .select2-selection').css('border-color', '#ccc');
    });

    $(document).on('change', '#FirstName', function () {
        $(this).css('border-color', '#ccc');
    });

    $(document).on('change', '#LastName', function () {
        $(this).css('border-color', '#ccc');
    });

    $(document).on('change', '#datepicker', function () {
        $(this).css('border-color', '#ccc');
    });

    $(document).on('change', '#BirthPlace', function () {
        $(this).css('border-color', '#ccc');
    });

    $(document).on('change', '#MiddleName', function () {
        $(this).css('border-color', '#ccc');
    });

    $(document).on('change', '#InputFileTransportation', function () {
        let inputFile = document.getElementById('InputFileTransportation');
        let reader = new FileReader();
        reader.readAsDataURL(inputFile.files[0]);
        reader.onload = function () {
            inputFile = reader.result;
            $('#outputTransportation').val(inputFile);
        };

    });

    $(document).on('click', '#check_crew_duplicates_modal_cancel', function () {
        clearAllFields();

    });

    $(document).on('click', '#check_crew_duplicates_modal_continue', function () {
        $('#right_box, #left_box, #footer_box').css('display', 'block');
    });


    $(document).on('click', '#submit_request_btn', function () {
        if (verify_btn_validation($('#FirstName').val(), $('#LastName').val(), $('#datepicker').val(), $('#position option:selected').val(), $('#BirthPlace').val())) {

            let message = "<p>Please make sure that the required fields are not left blank before clicking the Submit button</p>";
            generateWarningModal("verify_btn_validation_modal", 2, "", message);

        } else {
            //let middleInitial = [...$('#MiddleName').val()];
            let datepickerSplit = $('#datepicker').val().split('/');
            let birthDate = datepickerSplit[2] + "-" + datepickerSplit[0] + "-" + datepickerSplit[1];

            let parameters = [$('#FirstName').val(), $('#LastName').val(), birthDate];

            $.ajax({
                url: '/SAMPortal/Forms/CheckForCrewDuplicate',
                type: 'POST',
                dataType: 'JSON',
                data: { parameters: parameters },
                success: function (result) {
                    if (!isNaN(result.data)) {
                        if (result.data === 0) {
                            //let modalMessage = "No duplicates found. Press OK to continue";
                            ////$('#no_duplicates_found_modal .modal-body').html();
                            ////$('#no_duplicates_found_modal').modal();

                            //generateSuccessModal("no_duplicates_found_modal", 2, '', modalMessage);
                            //$("#check_for_duplicate_div").css('display', 'none');
                            //$('#right_box, #left_box, #footer_box').css('display', 'block');
                            submit_new_crew_request();

                        } else {

                            $('#check_crew_duplicates_error_modal .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                            $('#check_crew_duplicates_error_modal').modal();
                        }
                    } else {
                        let message = "<p>Looks like the crew is already in the database. Please review the information shown below thoroughly." +
                            "<br /><br />Trainee No.: <span id='checkforduplicate_mnno'>" + result.data.MNNO + "</span><br />" +
                            "Rank: <span id='checkforduplicate_rank'>" + result.data.Rank + "</span>&nbsp;&nbsp;<span id='update_rank' class='fa fa-edit' title='Edit the Rank of this crew'></span><br />" +
                            "First Name: " + result.data.FName + "<br />" +
                            "Last Name: " + result.data.LName + "<br />" +
                            "Middle Initial: " + result.data.MName + "<br />" +
                            "Birthdate: " + formatDuplicateBirthdate(result.data.BDate) + "</p>";
                        //"<br /> If you are sure that the person you are trying to register is a new crew, press Continue.<br />Otherwise, Press Cancel to clear the fields and close this message.";

                        $('#check_crew_duplicates_modal .modal-body').html(message);
                        $('#check_crew_duplicates_modal').modal();
                    }
                },
                complete: function () {
                    checkforduplicate_mnno = $('span#checkforduplicate_mnno').html();
                    checkforduplicate_rank = $('span#checkforduplicate_rank').html();

                }
            });
        }

    });

    $(document).on('change', '#FirstName, #LastName, #MiddleName, #datepicker, #position', function () {
        $('#right_box, #left_box, #footer_box').css('display', 'none');
    });

    /*
     * /Date(1572969600000)/
     */
    function formatDuplicateBirthdate(data) {
        let temp = data.substring(0, data.length - 2).split('(');
        let ticks = temp[1];

        let d = new Date(parseInt(ticks));

        return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    }

    $(document).on('change', '#room_type', function () {
        if ($('#room_type option:selected').val() == 3) {
            $('#on_site_booking_info_modal').modal();
            clearInHouse();
        } else if ($('#room_type option:selected').val() == 4) {
            $('#on_site_booking_info_modal').modal();
            clearInHouse();
        }
    });


    $(document).on('click', 'span#update_rank', function () {

        $('#update_rank_modal .modal-title').html(checkforduplicate_mnno + " - Update Rank ");
        $('#update_rank_modal').modal();

    });

    $(document).on('click', '#update_rank_modal_save', function () {
        let mnno = checkforduplicate_mnno;
        let oldRank = checkforduplicate_rank;
        let newRank = $("#update_rank_modal #position_update option:selected").val();

        $.ajax({
            url: '/SAMPortal/Forms/UpdateCrewRank',
            type: 'POST',
            dataType: 'JSON',
            data: { mnno: checkforduplicate_mnno, newRank: newRank, oldRank: oldRank },
            success: function (result) {
                if (result.data === 1) {
                    $('.modal').modal('hide');
                    $('#new_crew_registration input[type="text"]').val('');
                    generateSuccessModal('update_success_modal', 2, '', 'Rank of the crew has been successfully updated!');
                } else {
                    $('.modal').modal('hide');
                    $('#new_crew_registration input[type="text"]').val('');
                    generateDangerModal('update_error_modal', "Please send the this error ID (" + (result.logId === null || result.logId === "" ? "000" : result.logId) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                }
            }
        });
    });

    //=======================================================Course Booking=============================================================

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    var d = new Date();
    var currentMonth = d.getMonth() + 1;
    var currentYear = d.getFullYear();

    //var totalEnrollees = [];
    //var courseStartDate = "";

    if (currentMonth < 10) {
        getCourseList("0" + currentMonth, currentYear);
        getOCourseList("0" + currentMonth, currentYear);
    } else {
        getCourseList(currentMonth, currentYear);
        getOCourseList(currentMonth, currentYear);
    }

    //getAllCourseList();

    for (var i = 0; i <= 12; i++) {
        if (i == 12) {
            if (currentMonth < 10) {
                $('#month_select option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#month_select_yc_from option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#month_select_yc_to option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select_yc_from option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select_yc_to option[value="0' + currentMonth + '"]').prop('selected', true);
            } else {
                $('#month_select option[value="' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select option[value="' + currentMonth + '"]').prop('selected', true);
                $('#month_select_yc_from option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#month_select_yc_to option[value="' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select_yc_from option[value="0' + currentMonth + '"]').prop('selected', true);
                $('#o_month_select_yc_to option[value="' + currentMonth + '"]').prop('selected', true);
            }
        } else {
            if (i < 9) {
                $('#month_select').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#month_select_yc_from').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#month_select_yc_to').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select_yc_from').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select_yc_to').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
            }
            else {
                $('#month_select').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#month_select_yc_from').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#month_select_yc_to').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select_yc_from').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                $('#o_month_select_yc_to').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
            }
        }
    }

    $('#year_input').val(currentYear);
    $('#o_year_input').val(currentYear);

    $(document).on('click', '#submit_month_year', function () {

        if ($('input#date_rb_range').is(':checked')) {
            let monthFrom = $('#month_select_yc_from option:selected').val();
            let monthTo = $('#month_select_yc_to option:selected').val();
            let currentYear = $('#year_input').val();
            getCourseListRange(monthFrom, monthTo, currentYear);

        } else {
            let currentMonth = $('#month_select option:selected').val();
            let currentYear = $('#year_input').val();
            getCourseList(currentMonth, currentYear);
        }

    });

    $(document).on('click', '#o_submit_month_year', function () {

        if ($('input#o_date_rb_range').is(':checked')) {
            let monthFrom = $('#o_month_select_yc_from option:selected').val();
            let monthTo = $('#o_month_select_yc_to option:selected').val();
            let currentYear = $('#o_year_input').val();
            getOCourseListRange(monthFrom, monthTo, currentYear);

        } else {
            var currentMonth = $('#o_month_select option:selected').val();
            var currentYear = $('#o_year_input').val();
            getOCourseList(currentMonth, currentYear);
        }

    });

    $('#course_list_lnk').parent().addClass('active');
    let totalEnrollees = [];
    let enrollThisCrewParameters;
    $(document).on('click', '#enroll_crew', function () {

        let courseStartDate = "";

        //var schedId = $(this).parent().parent().attr('id');
        let schedId = $(this).parent().parent().attr('id');
        let mnno = mnnoAfterRegistration;
        let rank = position;
        //let courseName = $(this).parent().prevAll().eq(4).find('a').html();
        //let e_numberOfEnrollees = 0;

        totalEnrollees = $(this).parent().prev().html().split(' / ');

        courseStartDate = $(this).parent().prev().prev().html();

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetNumberOfEnrollees',
            dataType: 'json',
            type: 'get',
            data: { schedId: schedId },
            success: function (result) {
                e_numberOfEnrollees = result;
            },
            complete: function () {
                let enrollees = parseInt(totalEnrollees[0]);
                let maxEnrolless = parseInt(totalEnrollees[1]);

                let startDate = new Date(courseStartDate);
                let d = new Date();

                if (d.getTime() >= startDate.getTime()) {
                    $('#enroll_this_crew_not_allowed .modal-body p').html("You are no longer allowed to enroll because the course is finished or has already started.");
                    $('#enroll_this_crew_not_allowed').modal();
                    return false;
                }
                //(daysBeforeStart + 1) <= 7
                if ((getWeekNumber(startDate) - getWeekNumber(d)) === 1) {
                    //$('#enroll_this_crew_not_allowed .modal-body p').html("You are no longer allowed to enroll because the course will already start in " + (daysBeforeStart + 1) + " day/s.");
                    $('#enroll_this_crew_not_allowed .modal-body p').html("You are no longer allowed to enroll because the course will already start next week.");
                    $('#enroll_this_crew_not_allowed').modal();
                    return false;
                }

                if (enrollees >= maxEnrolless) {
                    $('#enroll_this_crew_not_allowed .modal-body p').html("You are no longer allowed to enroll because the course has already reached the maximum enrollees.");
                    $('#enroll_this_crew_not_allowed').modal();
                    return false;
                }

                //let schedId = $('#enroll_modal .modal-title').html().split(' - ')[0].split('. ')[1];
                //crewNameToBeEnrolledContact = $(this).parent().prev().html();
                //crewNameToBeEnrolled = $(this).parent().prev().prev().html();

                let parameters = [];
                parameters[0] = schedId;
                parameters[1] = mnno;
                parameters[2] = rank;
                //parameters[3] = name;

                enrollThisCrewParameters = parameters;
                //enrollThisCrew(enrollThisCrewParameters);
                $('#enroll_this_crew_warning .modal-body p').html('Are you sure you want to enroll this crew?');
                $('#enroll_this_crew_warning').modal();
            }
        });

    });

    $(document).on('click', '#enroll_this_crew_warning_yes', function () {
        totalEnrollees[0] = parseInt(totalEnrollees[0]) + 1;
        enrollThisCrew(enrollThisCrewParameters);
    });

    //=====================================================On-Site Booking===========================================================

    function getInHouseBookingFieldsValues() {

        if (i_reservation_type == '' && i_room_type == '' && i_accommodation == '' && i_mode_of_payment == '' && i_accommodation_reason == '' && i_accommodation_remarks_input == '') {
            inHouseBooking = 1;
            return true;
        } else {
            if (i_reservation_type == '' || i_room_type == '' || i_accommodation == '' || i_mode_of_payment == '' || i_accommodation_reason == '' || i_accommodation_remarks_input == '') {
                alert("Please make sure that no field is left blank or press the Clear button if you do not want to book for On Site Accommodation...");
                return false;
            } else {
                inHouseBooking = 0;
                return true;
            }
        }
    }

    $(document).on('click', '#submit_in_house_booking', function () {
        let mnno = mnnoAfterRegistration;
        let rank = position;
        let lastName = $('#LastName').val();
        let firstName = $('#FirstName').val();
        i_reservation_type = $('#reservation_type').val();
        i_room_type = $('#room_type').val();
        i_accommodation = $('#accomodation_date').val();
        i_mode_of_payment = $('#mode_of_payment').val();
        i_accommodation_reason = $('#accomodation_reason').val();
        i_accommodation_remarks_input = $('#accomodation_remarks_input').val();

        if (i_reservation_type == '' || i_room_type == '' || i_accommodation == '' || i_mode_of_payment == '' || i_accommodation_reason == '' || i_accommodation_remarks_input == '') {
            generateWarningModal("on_site_accommodation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to book for On Site Accommodation...");
            return false;
        }

        let parameters = [mnno, rank, lastName, firstName, i_reservation_type, i_room_type, i_accommodation, i_mode_of_payment, i_accommodation_reason, i_accommodation_remarks_input];

        saveAccomodation(parameters);

    });

    //====================================================Off-Site Booking========================================================================

    $(document).on('click', '#submit_out_house_booking', function () {
        let mnno = mnnoAfterRegistration;
        let rank = position;
        let lastName = $('#LastName').val();
        let firstName = $('#FirstName').val();
        o_off_site_hotel_name = $('#off_site_hotel_name').val();
        o_off_site_room_type = $('#off_site_room_type').val();
        o_off_site_date = $('#off_site_date').val();
        o_off_site_mode_of_payment = $('#off_site_mode_of_payment').val();
        o_off_site_reason = $('#off_site_reason').val();
        o_off_site_remarks_input = $('#off_site_remarks_input').val();

        if (o_off_site_hotel_name == '' || o_off_site_room_type == '' || o_off_site_date == '' || o_off_site_mode_of_payment == '' || o_off_site_reason == '' || o_off_site_remarks_input == '') {
            //alert("Please make sure that no field is left blank or press the Clear button if you do not want book for a Hotel Accommodation...");
            generateWarningModal("off_site_accommodation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want book for a Hotel Accommodation...");
            return false;
        }

        let parameters = [mnno, rank, lastName, firstName, o_off_site_date, o_off_site_hotel_name, o_off_site_room_type, o_off_site_mode_of_payment, o_off_site_reason, o_off_site_remarks_input];

        $.ajax({
            url: '/SAMPortal/Forms/SaveOffSiteAccomodation',
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { parameters: parameters },
            success: function (result) {
                $.unblockUI();
                if (result.data === 1) {
                    //$('#modal_success_accommodation .modal-body p').html("Accommodation Request Successful!");
                    //$('#modal_success_accommodation').modal();
                    generateSuccessModal("off_site_accommodation_success", 2, "", "Accommodation Request Successful!")
                } else {
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                    generateDangerModal("off_site_accommodation_error", "Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

                }

            }
        });
        //SaveOffSiteAccomodation


    });

    //====================================================Transportation========================================================================
    var saveTransportationParameter = [];
    var saveTranspoDetails = "";
    var saveDate = "";
    var saveNotes = "";

    var saveDailyTransportationParameter = [];
    var dailyTransferDetails = [];

    $(document).on('click', '#submit_transportation', function () {

        let mnno = mnnoAfterRegistration;
        let rank = position;
        let name = $('#LastName').val() + ", " + $('#FirstName').val();
        let type = $('#transportation_type option:selected').val();
        let vehicle = $('#transportation_vehicle').val();
        let notes = $('#transportation_details').val();

        if ($('#transportation_type').val() == "Airport Transfer") {

            let inboundDate = $('#transportation_date').val();
            let outboundDate = $('#transportation_date_outbound').val();
            let file = $('#output').val();
            let splitString = $('#InputFile').val().split("\\");
            let fileName = splitString[splitString.length - 1];
            let fileNameSplit = fileName.split(".");
            let fileExtension = fileNameSplit[fileNameSplit.length - 1];
            let inbound = $('#airport_cb_i').is(':checked');
            let outbound = $('#airport_cb_o').is(':checked');

            saveTransportationParameter = [mnno, rank, name, type, vehicle, notes, inbound, outbound, inboundDate, outboundDate, file, fileExtension];

            if (file === "") {
                generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
                return false;
            }

            if (inbound == false && outbound == false) {
                generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
                return false;
            }

            if (inbound == true) {
                if ($('#transportation_date').val().trim() == "") {
                    generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
                    return false;
                }
            }

            if (outbound == true) {
                if ($('#transportation_date_outbound').val().trim() == "") {
                    generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking Submit");
                    return false;
                }
            }

            generateWarningModal("save_transportation_warning", 1, "save_airport_transportation_warning_yes", "Are you sure you want to submit?");

        } else if ($('#transportation_type').val() == "Daily Transfer") {
            if (dailyTransferDetails.length == 0) {
                generateWarningModal("save_transportation_warning", 2, "", "Please make sure to add details before clicking submit...");
                return false;
            }

            saveDailyTransportationParameter = saveTransportationParameter = [mnno, rank, name, type, vehicle, notes, JSON.stringify(dailyTransferDetails)]

            generateWarningModal("save_transportation_warning", 1, "save_daily_transportation_warning_yes", "Are you sure you want to submit?");

        } else if ($('#transportation_type').val() == "Daily Transfer" || $('#transportation_vehicle').val() == "") {
            generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking Submit");
        }

    });

    $(document).on('click', '#save_airport_transportation_warning_yes', function () {

        $.ajax({
            url: '/SAMPortal/Forms/SaveAirportTransportation',
            type: 'POST',
            dataType: 'JSON',
            data: { parameters: saveTransportationParameter },
            success: function (result) {
                if (result.data == 1) {
                    generateSuccessModal("save_airport_transfer_modal", 2, "", "Airport Transfer request successfully submitted...");
                } else {
                    generateDangerModal("save_airport_transfer_danger", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph")
                }
            }
        });

    });

    $(document).on('click', '#save_daily_transportation_warning_yes', function () {
        $.ajax({
            url: '/SAMPortal/Forms/SaveDailyTransportation',
            type: 'POST',
            dataType: 'JSON',
            data: { parameters: saveDailyTransportationParameter },
            success: function (result) {
                if (result.data == 1) {
                    generateSuccessModal("save_daily_transfer_modal", 2, "", "Daily Transportation request successfully submitted!");
                } else {
                    generateDangerModal("save_daily_transfer_danger", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph")
                }
            }
        });
    });


    $(document).on('click', '#transportation_warning_yes', function () {

        let id = dailyTransferEntryToRemove.children().eq(7).find('button').attr('dtid');

        //code below is ES6 so beware...
        dailyTransferDetails = dailyTransferDetails.filter(item => item[7] != id);

        dailyTransferEntryToRemove.remove();

    });
    //$(document).on('click', '#submit_transportation', function () {

    //    let mnno = mnnoAfterRegistration;
    //    let rank = position;
    //    let lastName = $('#LastName').val();
    //    let firstName = $('#FirstName').val();

    //    t_transportation_type = $('#transportation_type').val();
    //    t_transportation_vehicle = $('#transportation_vehicle').val();
    //    t_transportation_date = $('#transportation_date').val();
    //    t_dt_optradio_1 = $('#dt_optradio_1').is(':checked');
    //    t_dt_optradio_2 = $('#dt_optradio_2').is(':checked');
    //    t_airport_cb_i = $('#airport_cb_i').is(':checked');
    //    t_airport_cb_o = $('#airport_cb_o').is(':checked');
    //    t_InputFileTransportation = $('#InputFileTransportation').val();
    //    t_pickup_input = $('#pickup_input').val();
    //    t_datetime_input = $('#datetime_input').val();
    //    t_dropoff_input = $('#dropoff_input').val();
    //    t_2ndpickup_input = $('#2ndpickup_input').val();
    //    t_2nddatetime_input = $('#2nddatetime_input').val();
    //    t_2nddropoff_input = $('#2nddropoff_input').val();
    //    t_transpotation_details = $('#transportation_details').val();
    //    t_outputTransportation = $('#outputTransportation').val();

    //    let splitString = $('#InputFileTransportation').val().split("\\");
    //    let fileName = splitString[splitString.length - 1];
    //    let fileNameSplit = fileName.split(".");
    //    let fileExtension = fileNameSplit[fileNameSplit.length - 1];

    //    let parameters = [mnno, rank, firstName, lastName, t_transportation_type, t_transportation_vehicle, t_transportation_date, t_dt_optradio_1, t_dt_optradio_2, t_airport_cb_i, t_airport_cb_o, t_pickup_input, t_outputTransportation,
    //        t_datetime_input, t_dropoff_input, t_2ndpickup_input, t_2nddatetime_input, t_2nddropoff_input, t_transpotation_details, fileExtension]

    //    if (t_transportation_type === '') {
    //        generateWarningModal("transportation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //        return false;

    //    } if (t_transportation_type == "Airport Transfer") {
    //        if (t_transportation_type == '' || t_transportation_vehicle == '' || t_transportation_date == '' || (t_airport_cb_i == false && t_airport_cb_o == false) ||
    //            t_InputFileTransportation == '' || t_transpotation_details == '') {
    //            generateWarningModal("transportation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //            return false;
    //        }
    //    } else if (t_transportation_type == "Daily Transfer") {
    //        if (t_transportation_type == '' || t_transportation_vehicle == '' || t_transportation_date == '' || (t_dt_optradio_1 == false && t_dt_optradio_2 == false)) {
    //            generateWarningModal("transportation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //            return false;
    //        } else if (t_dt_optradio_1 == true) {
    //            if (t_pickup_input == '' || t_datetime_input == '' || t_dropoff_input == '') {
    //                generateWarningModal("transportation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                return false;
    //            }
    //        } else if (t_dt_optradio_2 == true) {
    //            if (t_pickup_input == '' || t_datetime_input == '' || t_dropoff_input == '' || t_2ndpickup_input == '' || t_2nddatetime_input == '' ||
    //                t_2nddropoff_input == '' || t_transpotation_details == '') {
    //                generateWarningModal("transportation_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a transportation...");
    //                return false;
    //            }
    //        }
    //    }

    //    $.ajax({
    //        url: '/SAMPortal/Forms/SaveTransportation',
    //        type: 'post',
    //        dataType: 'json',
    //        beforeSend: function () {
    //            $.blockUI({ message: null });
    //        },
    //        data: { parameters: parameters },
    //        success: function (result) {
    //            $.unblockUI();
    //            if (result.data === 1) {
    //                generateSuccessModal("transportation_accommodation_success", 2, "", "Request sent successfully!")

    //            } else {
    //                generateDangerModal("transportation_accommodation_danger", "Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

    //            }
    //        }
    //    }); 

    //});

    //====================================================Meal Arrangement=======================================================================

    $(document).on('click', '#submit_meals_arrangement', function () {
        let mnno = mnnoAfterRegistration;
        let rank = position;
        let lastName = $('#LastName').val();
        let firstName = $('#FirstName').val();
        
        m_meal_reservation = $('#meal_reservation').val();
        m_reason_input = $('#reason_input').val();
        m_breakfast_cb = $('#breakfast_cb').is(':checked');
        m_am_snack_cb = $('#am_snack_cb').is(':checked');
        m_lunch_cb = $('#lunch_cb').is(':checked');
        m_pm_snack_cb = $('#pm_snack_cb').is(':checked');
        m_dinner_cb = $('#dinner_cb').is(':checked');

        let parameters = [mnno, rank, "", m_meal_reservation, m_reason_input, m_breakfast_cb, m_am_snack_cb, m_lunch_cb, m_pm_snack_cb, m_dinner_cb];

        if (m_meal_reservation == '' || m_reason_input == '' || (m_breakfast_cb == false && m_am_snack_cb == false && m_lunch_cb == false && m_pm_snack_cb == false && m_dinner_cb == false)) {
            generateWarningModal("meals_arrangement_warning", 2, "", "Please make sure that no field is left blank or press the Clear button if you do not want to arrange a meal...");
            return false;
        }

        $.ajax({
            url: '/SAMPortal/Forms/SaveMealProvision',
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { parameters: parameters },
            success: function (result) {
                $.unblockUI();
                if (result.data == 1) {
                    //$('#modal-success .modal-body p').html("Meal Request Successful!");
                    //$('#modal-success').modal();
                    generateSuccessModal("meal_provision_success", 2, "", "Meal Request Successful!");
                } else {
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                    generateDangerModal("meal_provision_danger", "Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                }
            }
        });
    })
});
