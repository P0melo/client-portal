$(document).ready(function () {

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

    $('#transportation_date').datepicker({ format: "dd/mm/yyyy" });
    $('#transportation_date_outbound').datepicker({ format: "dd/mm/yyyy" });

    $('#transportation_date').prev().click(function () {
        $(this).next().focus();
    });

    $('#transportation_date_outbound').prev().click(function () {
        $(this).next().focus();
    });

    var dailyTransferDate = new Date();

    var dailyTransferDateMonth = dailyTransferDate.getMonth() + 1;
    var dailyTransferDateDay = dailyTransferDate.getDate();

    var dailyTransferDateOutput = (dailyTransferDateDay < 10 ? '0' : '') + dailyTransferDateDay + '/' + (dailyTransferDateMonth < 10 ? '0' : '') + dailyTransferDateMonth + '/' + dailyTransferDate.getFullYear();
        

    $('#pick_up_date').datepicker({ format: "dd/mm/yyyy"}).val(dailyTransferDateOutput);
    $('#pick_up_date_2').datepicker({ format: "dd/mm/yyyy" }).val(dailyTransferDateOutput);
    $('#pick_up_time').timepicker({interval: '15', timeFormat: 'HH:mm'}).val('08:00');
    $('#pick_up_time_2').timepicker({ interval: '15', timeFormat: 'HH:mm' }).val('08:00');

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

    var saveDailyTransportationParameter = [];
    var dailyTransferDetails = [];

    $(document).on('click', '#save_transportation_btn', function () {
        let mnno = $('#mnno_input').val();
        let rank = $('#rank_input').val();
        let name = $('#name_input').val();
        let type = $('#transportation_type option:selected').val();
        let vehicle = $('#transportation_vehicle').val();
        let notes = $('#transportation_details').val();

        if (mnno === "") {
            generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
            return false;
        }

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
                    generateWarningModal("save_transportation_warning", 2, "", "Please make sure that no fields are left blank before clicking submit");
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

    var dailyTransferCounter = 0;

    $(document).on('change', 'input[name=dt_optradio]', function () {
        $('#pickup_input').val('');
        $('#dropoff_input').val('');
        $('#2ndpickup_input').val('');
        $('#2nddropoff_input').val('');
    });

    $(document).on('change', '#pickup_input', function () {
        if ($('input[name=dt_optradio]:checked').val() == 2) {
            $('#2ndpickup_input').val($(this).val());
        }
    });

    $(document).on('change', '#dropoff_input', function () {
        if ($('input[name=dt_optradio]:checked').val() == 2) {
            $('#2nddropoff_input').val($(this).val());
        }
    });

    $(document).on('change', '#pick_up_date', function () {
        if ($('input[name=dt_optradio]:checked').val() == 2) {
            $('#pick_up_date_2').val($(this).val());
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
            "<td>" + pickup_date_2 + " " + pickup_time_2 + "</td><td style='padding: 1px;'><button id='remove_daily_transfer_entry' dtid = '" + dailyTransferCounter +"' class='btn btn-default' style='width: 100%'><i class='fa fa-times'></i></button></td></tr > ";

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
        
        let id = dailyTransferEntryToRemove.children().eq(7).find('button').attr('dtid');

        //code below is ES6 so beware...
        dailyTransferDetails = dailyTransferDetails.filter(item => item[7] != id);

        dailyTransferEntryToRemove.remove();

    });

    $('.modal-success').on('hidden.bs.modal', function () {
        window.location.reload();
    });

});