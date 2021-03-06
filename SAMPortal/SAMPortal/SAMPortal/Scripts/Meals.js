﻿$(document).ready(function () {

    if (document.getElementById('mnno_input').value !== "") {
        let traineeNo = document.getElementById('mnno_input').value;
        getMealProvisionLog(traineeNo);
    }


    //$(document).on('change', '#mnno_input', function () {
    //    let traineeNo = document.getElementById('mnno_input').value;
    //    getMealProvisionLog(traineeNo);
    //});

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var date = new Date();
    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#meal_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }
    $('#meal_reservation').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    $('#meal_reservation').prev().click(function () {
        $(this).next().focus();
    });

    //===set breadcrumbs
    $('.content-header h1').html("Meals");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Meals");
    //===

    var clickedReferenceId = "";
    $(document).on('click', '#reference_id_btn', function () {
        var reference_id = $(this).html();
        clickedReferenceId = reference_id;
        getMealsProvisionByReference(reference_id);

    });

    $(document).on('click', '#meals_rates_btn', function () { 
        $.ajax({
            url: '/SAMPortal/Api/Forms/GetMealsRates',
            type: 'GET',
            dataType: 'JSON',
            success: function (result) {
                let content = "";

                for (let i = 0; i < result.length; i++) {
                    content += "<tr><td>" + result[i].Meal + "</td><td>" + result[i].MealDescription  + "</td><td>" + result[i].Price + "</td></tr>"
                }

                $('#meals_rates_tbl tbody').append(content);

                $('#meals_rates_modal').modal();
            }
        })
    });

    $(document).on('change', '#mnno_input', function () {
        getMealProvisionLog($('#mnno_input').val()/*mnno*/);
    });

    $(document).on('click', '#meal_log_edit_btn', function () {
        var isDisabled = $(this).attr('disabled');
        if (isDisabled != 'disabled') {
            $(this).css('display', 'none');
            $(this).siblings().css('display', 'inline');
            $('.meal_log_edit').prop('disabled', true);
            $('.meal_log_edit').css('color', 'gray');
            //$('#meal_log_save_btn').css('display', 'inline');

            var breakfast_cb_log = $(this).closest('tr').find(':nth-child(4) input');
            var morning_snack_cb_log = $(this).closest('tr').find(':nth-child(5) input');
            var lunch_cb_log = $(this).closest('tr').find(':nth-child(6) input');
            var afternoon_cb_log = $(this).closest('tr').find(':nth-child(7) input');
            var dinner_cb_log = $(this).closest('tr').find(':nth-child(8) input');

            breakfast_cb_log.prop('disabled', false);
            morning_snack_cb_log.prop('disabled', false);
            lunch_cb_log.prop('disabled', false);
            afternoon_cb_log.prop('disabled', false);
            dinner_cb_log.prop('disabled', false);
        }
    });

    $(document).on('click', '#meal_log_cancel_btn', function () {
        $(this).css('display', 'none');
        $(this).siblings('#meal_log_edit_btn').css('display', 'inline');
        $(this).siblings('#meal_log_save_btn').css('display', 'none');
        $('.meal_log_edit').prop('disabled', false);
        $('.meal_log_edit').css('color', 'black');

        var breakfast_cb_log = $(this).closest('tr').find(':nth-child(4) input');
        var morning_snack_cb_log = $(this).closest('tr').find(':nth-child(5) input');
        var lunch_cb_log = $(this).closest('tr').find(':nth-child(6) input');
        var afternoon_cb_log = $(this).closest('tr').find(':nth-child(7) input');
        var dinner_cb_log = $(this).closest('tr').find(':nth-child(8) input');

        breakfast_cb_log.prop('disabled', true);
        morning_snack_cb_log.prop('disabled', true);
        lunch_cb_log.prop('disabled', true);
        afternoon_cb_log.prop('disabled', true);
        dinner_cb_log.prop('disabled', true);

        $.ajax({
            url: '/SAMPortal/api/Forms/GetMealsProvisionByReference',
            type: 'get',
            dataType: 'json',
            data: { referenceId: clickedReferenceId },
            success: function (result) {
                var tableContent = "";
                $('#meal_modal .modal-body #meal_log_tbl tbody').html();

                for (var i = 0; i < result.length; i++) {
                    var id = result[i].Id;
                    var fromDate = result[i].FromDate;
                    var toDate = result[i].ToDate;
                    var breakfast = result[i].Breakfast;
                    var morningSnack = result[i].MorningSnack;
                    var lunch = result[i].Lunch;
                    var afternoonSnack = result[i].AfternoonSnack;
                    var dinner = result[i].Dinner;

                    tableContent += "<tr><td id='" + id + "'>" + id + "</td><td>" + formatDate(fromDate) + "</td><td>" + formatDate(toDate) + "</td><td id='#breakfast'>" + RenderCheckBox(breakfast, fromDate) + "</td>" +
                        "<td>" + RenderCheckBox(morningSnack, fromDate) + "</td><td>" + RenderCheckBox(lunch, fromDate) + "</td><td>" + RenderCheckBox(afternoonSnack, fromDate) + "</td><td>" +
                        RenderCheckBox(dinner, fromDate) + "</td><td>" + result[i].Reason + "</td><td>" + renderEditButton(fromDate) +
                        "<button id='meal_log_save_btn' class='btn btn-default' style='width: 50%'><i class='fa fa-save'></i></button><button id='meal_log_cancel_btn' class='btn btn-default' style='width: 50%'><i class='fa fa-close'></i></button></td></tr>";
                }
                $('#meal_modal .modal-body p').html('Note: You are not allowed to edit a record within 3 days before the start of the meal');
                $('#meal_modal .modal-body #meal_log_tbl tbody').html(tableContent);
            }
        });

    });

    $(document).on('click', '#meal_log_save_btn', function () {
        var id = $(this).closest('tr').find('td').html();

        var breakfast_cb_log = $(this).closest('tr').find(':nth-child(4) input').is(':checked');
        var morning_snack_cb_log = $(this).closest('tr').find(':nth-child(5) input').is(':checked');
        var lunch_cb_log = $(this).closest('tr').find(':nth-child(6) input').is(':checked');
        var afternoon_cb_log = $(this).closest('tr').find(':nth-child(7) input').is(':checked');
        var dinner_cb_log = $(this).closest('tr').find(':nth-child(8) input').is(':checked');

        var parameters = [id, breakfast_cb_log, morning_snack_cb_log, lunch_cb_log, afternoon_cb_log, dinner_cb_log];

        $.ajax({
            url: '/SAMPortal/Forms/SaveMealLogEdit',
            type: 'post',
            dataType: 'json',
            data: { parameters: parameters },
            success: function (result) {
                if (result.data != 1) {
                    $('.modal-danger .modal-body p').html("Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    $('.modal-danger').modal();
                }
            }
        });

        $(this).css('display', 'none');
        $(this).siblings('#meal_log_edit_btn').css('display', 'inline');
        $(this).siblings('#meal_log_cancel_btn').css('display', 'none');
        $('.meal_log_edit').prop('disabled', false);
        $('.meal_log_edit').css('color', 'black');

        $(this).closest('tr').find(':nth-child(4) input').prop('disabled', true);
        $(this).closest('tr').find(':nth-child(5) input').prop('disabled', true);
        $(this).closest('tr').find(':nth-child(6) input').prop('disabled', true);
        $(this).closest('tr').find(':nth-child(7) input').prop('disabled', true);
        $(this).closest('tr').find(':nth-child(8) input').prop('disabled', true);

    });


    function getDateDiff(date) {
        let splitDate = date.split(' - ');

        let df = splitDate[0];
        let newDateFrom = new Date(df.split('/')[2], df.split('/')[1] - 1, df.split('/')[0]);

        let dt = splitDate[1];
        let newDateTo = new Date(dt.split('/')[2], dt.split('/')[1] - 1, dt.split('/')[0]);

        let dateDifference = new Date(newDateTo - newDateFrom);

        let intDifference = Math.round((dateDifference / (1000 * 3600 * 24)));

        return intDifference;
    }

    var saveMealProvistionParameter = [];
    $(document).on('click', '#save_meal_btn', function (e) {
        
        var mnno = $('#mnno_input').val();
        var rank = $('#rank_input').val();
        var name = $('#name_input').val();
        var date = $('#meal_reservation').val();
        var breakfast_cb = $('#breakfast_cb').prop('checked');
        var am_snack_cb = $('#am_snack_cb').prop('checked');
        var lunch_cb = $('#lunch_cb').prop('checked');
        var pm_snack_cb = $('#pm_snack_cb').prop('checked');
        var dinner_cb = $('#dinner_cb').prop('checked');
        var reason = $('#reason_input').val();
        var dietaryRequirement = $('#dietaryRequirement_input').val();
        var schedId = "";

        if (typeof (hrefSplit) !== 'undefined') {
            schedId = hrefSplit.split('+')[3];
        } 

        var dateDiff = getDateDiff(date);

        if (dateDiff > 30) {
            //$('.modal-warning .modal-body p').html("The max length of a request is 30 days. If you want to book more than 30, we advice that you first book the 30 days then do another request for the remaining days");
            //$('.modal-warning').modal();
            generateWarningModal('meal_reservation_warning_modal', 2, '', "The max length of a request is 30 days. If you want to book more than 30, we advice that you first book the 30 days then do another request for the remaining days")
            return false;
        } 

        if (mnno === "" || rank === "" || name === "" || reason === "" || dietaryRequirement == "" || (breakfast_cb === false && am_snack_cb === false && lunch_cb === false && pm_snack_cb === false && dinner_cb === false)) {
            //$('#meal_err_msg').css('display', 'block');
            generateWarningModal('meal_reservation_warning_modal', 2, '', "Please make sure that required fields are not left blank before clicking submit");
            return false;
        } 
        
        saveMealProvistionParameter = [mnno, rank, name, date, reason, dietaryRequirement, breakfast_cb, am_snack_cb, lunch_cb, pm_snack_cb, dinner_cb, schedId];

        generateWarningModal("submit_meals_arrangement_modal", 1, "modal_warning_meal_yes", "Are you sure you want to submit?");
        //$('#modal_warning_meal .modal-body p').html("Are you sure you want to submit?");
        //$('#modal_warning_meal').modal();
        
    });

    $(document).on('click', '#modal_warning_meal_yes', function () {
        saveMealProvision(saveMealProvistionParameter);
    });

    function saveMealProvision(saveMealProvistionParameter) {
        $.ajax({
            url: '/SAMPortal/Forms/SaveMealProvision',
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { parameters: saveMealProvistionParameter },
            success: function (result) {
                $.unblockUI();
                if (result.data == 1) {
                    //$('#modal-success .modal-body p').html("Meal Request Successful!");
                    //$('#modal-success').modal();
                    generateSuccessModal("meal_provision_modal", 2, "", "Meal Request Successful!");

                } else {
                    generateWarningModal("meal_provision_warning", 2, "meal_provision_warning_yes", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }

                getMealProvisionLog(saveMealProvistionParameter[0]/*mnno*/);
            }
        });
    }

    var mealLogTable = "";
    function getMealsProvisionByReference(reference_id) {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetMealsProvisionByReference',
            type: 'get',
            dataType: 'json',
            data: { referenceId: reference_id },
            success: function (result) {
                var tableContent = "";

                if (mealLogTable != "") {
                    mealLogTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {
                    let id = result[i].Id;
                    let fromDate = result[i].FromDate;
                    let toDate = result[i].ToDate;
                    let breakfast = result[i].Breakfast;
                    let morningSnack = result[i].MorningSnack;
                    let lunch = result[i].Lunch;
                    let afternoonSnack = result[i].AfternoonSnack;
                    let dinner = result[i].Dinner;

                    tableContent += "<tr><td id='" + id + "'>" + id + "</td><td>" + fixDateFormat(fromDate.split('T')[0]) + "</td><td>" + fixDateFormat(toDate.split('T')[0]) + "</td><td id='#breakfast'>" + RenderCheckBox(breakfast, fromDate) + "</td>" +
                        "<td>" + RenderCheckBox(morningSnack, fromDate) + "</td><td>" + RenderCheckBox(lunch, fromDate) + "</td><td>" + RenderCheckBox(afternoonSnack, fromDate) + "</td><td>" +
                        RenderCheckBox(dinner, fromDate) + "</td><td>" + result[i].Reason + "</td><td style='padding: 1px'>" + renderEditButton(fromDate) +
                        "<button id='meal_log_save_btn' class='btn btn-default' style='width: 50%'><i class='fa fa-save'></i></button><button id='meal_log_cancel_btn' class='btn btn-default' style='width: 50%'><i class='fa fa-close'></i></button></td></tr>";
                }
                $('#meal_modal .modal-body p').html('Note: You are not allowed to edit a record within 3 days before the start of the meal');
                $('#meal_modal .modal-body #meal_log_tbl tbody').html(tableContent);
                mealLogTable = $('#meal_log_tbl').DataTable({
                    "columnDefs": [{
                        "targets": [9],
                        "orderable": false
                    }],
                    order: [[0, 'desc']]
                });
                $('#meal_log_tbl').css('width','inherit');
                $('#meal_modal').modal();
            }
        });
    }


    function renderEditButton(fromDate) {
        var dateToday = new Date();
        dateToday.setHours(0);
        dateToday.setMinutes(0);
        dateToday.setSeconds(0);
        var fDate = new Date(fromDate);

        var dateDiff = fDate - dateToday;
        var intDiff = Math.round(dateDiff / (1000 * 60 * 60 * 24));

        if (intDiff > 3) {
            return "<button id='meal_log_edit_btn' class='btn btn-default meal_log_edit' style='width: 100%'>Edit</button>";
            //<button id='swap_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-exchange'></i></button>
        } else {
            //<button id='meal_log_edit_btn' class='btn btn-default meal_log_edit' style='width: 100%' disabled>Edit</button>
            return "";
        }
    }

    function RenderCheckBox(checked) {
        var checkedValue = "";
        if (checked == 1) {
            checkedValue = "checked";
        }

        return "<input id='meal_log_edit_cb' type='checkbox' " + checkedValue + " disabled='true'/>";
    }



    //function formatDate(data, redirect) {

    //    if (data == null) {
    //        return "";
    //    }

    //    if (redirect) {
    //        return data.replace(/\//g, "-");
    //    }

    //    var result = data.replace(/[^0-9 +]/g, '');

    //    var date = new Date(data);

    //    return date.getDate() + "." + monthNames[date.getMonth()] + "." + date.getFullYear();
    //}

    var mealTable = "";
    function getMealProvisionLog(mnno) {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetMealProvisionLog',
            type: 'get',
            dataType: 'json',
            data: { mnno: mnno },
            success: function (result) {
                var content = "";

                if (mealTable != "") {
                    mealTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {
                    if (result[i].ReferenceId != null) {
                        content += "<tr id='" + result[i].Id + "'><td>" + (i + 1) + "</td><td id='fromDate'>" + fixDateFormat(result[i].FromDate.split('T')[0]) + "</td><td id='toDate'>" + fixDateFormat(result[i].ToDate.split('T')[0]) +
                            "<td id='reason'>" + result[i].Reason + "</td><td>" + result[i].DietaryRequirement + "</td><td><a id='reference_id_btn'>" + result[i].ReferenceId + "</a></td></tr>";
                    }
                }

                $("#meal_tbl tbody").html(content);
                mealTable = $("#meal_tbl").DataTable();
                $("#meal_tbl").css('width', 'inherit');
                $('#meal_tbl_div').css('display', 'block');
            }
        });
    }

    $(document).on('click', '#clear_meal_btn', function () {
        window.location.reload();
    });

    $('.modal-success').on('hidden.bs.modal', function () {
        //hrefSplit can be seen in userscript.js
        if (typeof (hrefSplit) !== 'undefined') {
            window.close();
        }
        else
        {
            window.location.reload();
        }
    });

});