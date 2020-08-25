﻿$(document).ready(function () {
    //var date = new Date();
    var inputFile = document.getElementById('InputFile');
    var imageSizeLimit = 5000000;//5245329;

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#transportation_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }

    //===set breadcrumbs
    $('.content-header h1').html("Transportation");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Transportation");
    //===

    $(document).on('change', '#InputFile', function () {
        var inputFile = document.getElementById('InputFile');
        var reader = new FileReader();
        reader.readAsDataURL(inputFile.files[0]);
        reader.onload = function () {
            inputFile = reader.result;
            $('#output').val(inputFile);
        };

    });

    $('#transportation_lnk').parent().addClass('active');

    $('#transportation_date').datepicker();
    $('#transportation_date_outbound').datepicker();

    var dailyTransferDate = new Date();

    var dailyTransferDateMonth = dailyTransferDate.getMonth() + 1;
    var dailyTransferDateDay = dailyTransferDate.getDate();

    var dailyTransferDateOutput = (dailyTransferDateMonth < 10 ? '0' : '') + dailyTransferDateMonth + '/' +
        (dailyTransferDateDay < 10 ? '0' : '') + dailyTransferDateDay + '/' + dailyTransferDate.getFullYear() ;

    $('#pick_up_date').datepicker().val(dailyTransferDateOutput);
    $('#pick_up_date_2').datepicker().val(dailyTransferDateOutput);
    $('#pick_up_time').timepicker({interval: '15'}).val('08:00 AM');
    $('#pick_up_time_2').timepicker({ interval: '15' }).val('08:00 AM');

    $(document).on('click', '#transportation_search_btn', function () {
        var mnno = $('#transportation_mnno_input').val();
        getCrewDetails(mnno, 'transportation');
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

    $(document).on('change', '#transportation_type', function () {
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

    $(document).on('click', '#transportation_rates_btn', function () {
        $('#transportation_rates_modal').modal();
    });

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

    var saveTransportationParameter = [];
    var saveTranspoDetails = "";
    var saveDate = "";
    var saveNotes = "";
    $(document).on('click', '#save_transportation_btn', function () {
        let mnno = $('#mnno_input').val();
        let rank = $('#rank_input').val();
        let name = $('#name_input').val();
        let type = $('#transportation_type option:selected').val();
        let vehicle = $('#transportation_vehicle').val();
        let notes = $('#transportation_details').val();

        if ($('#transportation_type').val() == "Airport Transfer") {
            if (mnno === "" || file === "" || date === "") {
                generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
                return false;
            }

            let inbound = $('#airport_cb_i').is(':checked');
            let outbound = $('#airport_cb_o').is(':checked');
            let inboundDate = $('#transportation_date').val();
            let outboundDate = $('#transportation_date_outbound').val();
            let file = $('#output').val();
            let splitString = $('#InputFile').val().split("\\");
            let fileName = splitString[splitString.length - 1];
            let fileNameSplit = fileName.split(".");
            let fileExtension = fileNameSplit[fileNameSplit.length - 1];

            saveTransportationParameter[mnno, rank, name, type, vehicle, notes, inbound, outbound, inboundDate, outboundDate, file, fileExtension];

            generateWarningModal("save_transportation_warning", 1, "", "Are you sure you want to submit?");
        } else {
            //if (mnno === "" || date === "") {
            //    $('#meal_err_msg').css('display', 'inline-block');
            //    return false;
            //}


        }

        //===============================================Old Code===========================================
        //var mnno = $('#mnno_input').val();
        //var rank = $('#rank_input').val();
        //var name = $('#name_input').val();
        //var type = $('#transportation_type option:selected').val();
        //var vehicle = $('#transportation_vehicle option:selected').val();
        //var date = $('#transportation_date').val();
        //var dailyTransfer = $('input[name=dt_optradio]:checked').val();
        //var inbound = $('#airport_cb_i').is(':checked');
        //var outbound = $('#airport_cb_o').is(':checked');
        //var notes = $('#transportation_details').val();
        //var file = $('#output').val();

        //var pickup_input = $('#pickup_input').val();
        //var datetime_input = $('#datetime_input').val();
        //var dropoff_input = $('#dropoff_input').val();

        //var second_pickup_input = $('#2ndpickup_input').val();
        //var second_datetime_input = $('#2nddatetime_input').val();
        //var second_dropoff_input = $('#2nddropoff_input').val();

        //var splitName = name.split(' ');

        //var firstName = splitName[1];
        //var lastName = splitName[0].substring(0, splitName[0].length - 1);

        //var oneTrip = 0;
        //var twoTrips = 0;

        //var splitString = $('#InputFile').val().split("\\");
        //var fileName = splitString[splitString.length - 1];
        //var fileNameSplit = fileName.split(".");
        //var fileExtension = fileNameSplit[fileNameSplit.length - 1];

        //if ($('#transportation_type').val() == "Airport Transfer") {
        //    if (mnno === "" || file === "" || date === "") {
        //        $('#meal_err_msg').css('display', 'inline-block');
        //        return false;
        //    }
        //} else {
        //    if (mnno === "" || date === "") {
        //        $('#meal_err_msg').css('display', 'inline-block');
        //        return false;
        //    }
        //}

        //if ((dailyTransfer === "1" || dailyTransfer === "2") || (inbound === true || outbound === true)) {

        //    if (dailyTransfer === "1") {
        //        oneTrip = "true";
        //        saveTranspoDetails = pickup_input !== "" && datetime_input !== "" && dropoff_input !== "";
        //    } else if (dailyTransfer === "2") {
        //        twoTrips = "true";
        //        saveTranspoDetails = pickup_input !== "" && datetime_input !== "" && dropoff_input !== "" && second_pickup_input !== "" && second_datetime_input !== "" && second_dropoff_input !== "";
        //    }

        //    saveTransportationParameter = [mnno, rank, firstName, lastName, type, vehicle, date, oneTrip, twoTrips, inbound, outbound, notes, file,
        //        pickup_input, datetime_input, dropoff_input, second_pickup_input, second_datetime_input, second_dropoff_input, fileExtension];

        //    saveDate = date;
        //    saveNotes = notes;

        //    //saveTransportation(date, notes, parameters, details);
        //    $('#modal_warning_transpo_submit .modal-body p').html("Are you sure you want to submit?");
        //    $('#modal_warning_transpo_submit').modal();

        //} else {
        //    //$('.modal-warning').modal();
        //    $('#meal_err_msg').css('display', 'inline-block');
        //}

    });

    $(document).on('click', '#modal_close_btn', function () {
        window.location.reload();
    });

    $(document).on('click', '#modal_warning_transpo_submit_yes', function () {
        saveTransportation(saveDate, saveNotes, saveTransportationParameter, saveTranspoDetails);
    });

    function saveTransportation(date, notes, parameters, details) {
        //alert(parameters);
        if (date !== "" && notes !== "" && (details === true || details === "")) {
            $.ajax({
                url: '/SAMPortal/Forms/SaveTransportation',
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    $.blockUI({ message: null });
                },
                data: { parameters: parameters },
                success: function (result) {
                    $.unblockUI();
                    if (result.data === 1) {
                        $('#modal_success .modal-body p').html("Request sent successfully!");
                        $('#modal_success').modal();

                    } else {
                        $('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                        $('.modal-danger').modal();
                    }
                }
            });
        } else {
            $('#meal_err_msg').css('display', 'block');
        }
    }

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
            "<td>" + pickup_date_2 + " " + pickup_time_2 + "</td><td style='padding: 1px;'><button id='remove_daily_transfer_entry' class='btn btn-default' style='width: 100%'><i class='fa fa-times'></i></button></td></tr > ";

        $('#daily_transfer_table div table tbody').append(details);
    });

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

    $(document).on('click', '#transportation_warning_yes', function () {
        dailyTransferEntryToRemove.remove();
    });

});