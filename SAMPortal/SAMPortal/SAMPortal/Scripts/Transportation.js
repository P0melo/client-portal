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

    $(document).on('click', '#transportation_search_btn', function () {
        var mnno = $('#transportation_mnno_input').val();
        getCrewDetails(mnno, 'transportation');
    });

    $(document).on('change', '#transportation_type', function () {
        var selected = $("#transportation_type option:selected").val();
        if (selected === "Daily Transfer") {
            $('.daily_transfer').css('display', 'inline-block');
            $('.airport_transfer').css('display', 'none');
            $('#airport_cb_i').prop('checked', false);
            $('#airport_cb_o').prop('checked', false);

            $('#output').val("");
            $('#InputFile').val("");

        } else if (selected === "Airport Transfer") {
            $('.airport_transfer').css('display', 'inline-block');
            $('.daily_transfer').css('display', 'none');
            $('input[name=dt_optradio]').prop('checked', false);

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
        var mnno = $('#mnno_input').val();
        var rank = $('#rank_input').val();
        var name = $('#name_input').val();
        var type = $('#transportation_type option:selected').val();
        var vehicle = $('#transportation_vehicle option:selected').val();
        var date = $('#transportation_date').val();
        var dailyTransfer = $('input[name=dt_optradio]:checked').val();
        var inbound = $('#airport_cb_i').is(':checked');
        var outbound = $('#airport_cb_o').is(':checked');
        var notes = $('#transportation_details').val();
        var file = $('#output').val();

        var pickup_input = $('#pickup_input').val();
        var datetime_input = $('#datetime_input').val();
        var dropoff_input = $('#dropoff_input').val();

        var second_pickup_input = $('#2ndpickup_input').val();
        var second_datetime_input = $('#2nddatetime_input').val();
        var second_dropoff_input = $('#2nddropoff_input').val();

        var splitName = name.split(' ');

        var firstName = splitName[1];
        var lastName = splitName[0].substring(0, splitName[0].length - 1);

        var oneTrip = 0;
        var twoTrips = 0;

        var splitString = $('#InputFile').val().split("\\");
        var fileName = splitString[splitString.length - 1];
        var fileNameSplit = fileName.split(".");
        var fileExtension = fileNameSplit[fileNameSplit.length - 1];

        if ($('#transportation_type').val() == "Airport Transfer") {
            if (mnno === "" || file === "" || date === "") {
                $('#meal_err_msg').css('display', 'inline-block');
                return false;
            }
        } else {
            if (mnno === "" || date === "") {
                $('#meal_err_msg').css('display', 'inline-block');
                return false;
            }
        }

        if ((dailyTransfer === "1" || dailyTransfer === "2") || (inbound === true || outbound === true)) {

            if (dailyTransfer === "1") {
                oneTrip = "true";
                saveTranspoDetails = pickup_input !== "" && datetime_input !== "" && dropoff_input !== "";
            } else if (dailyTransfer === "2") {
                twoTrips = "true";
                saveTranspoDetails = pickup_input !== "" && datetime_input !== "" && dropoff_input !== "" && second_pickup_input !== "" && second_datetime_input !== "" && second_dropoff_input !== "";
            }

            saveTransportationParameter = [mnno, rank, firstName, lastName, type, vehicle, date, oneTrip, twoTrips, inbound, outbound, notes, file,
                pickup_input, datetime_input, dropoff_input, second_pickup_input, second_datetime_input, second_dropoff_input, fileExtension];

            saveDate = date;
            saveNotes = notes;

            //saveTransportation(date, notes, parameters, details);
            $('#modal_warning_transpo_submit .modal-body p').html("Are you sure you want to submit?");
            $('#modal_warning_transpo_submit').modal();

        } else {
            //$('.modal-warning').modal();
            $('#meal_err_msg').css('display', 'inline-block');
        }

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


});