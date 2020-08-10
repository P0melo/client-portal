$(document).ready(function () {

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#course_list_lnk').find('span').css('color', 'white');

    if (!$('#course_reservation_lnk').parent().hasClass('active')) {
        $('#course_reservation_lnk').parent().addClass('active menu-open');
        $('#course_reservation_lnk').next().show();
    }


    //===set breadcrumbs
    $('.content-header h1').html("Course Booking");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Course Booking");
    //===

    //temp
    //var companyId = 116;
    //var year = 2018;
    //

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    var d = new Date();
    var currentMonth = d.getMonth() + 1;
    var currentYear = d.getFullYear();

    var totalEnrollees = [];
    var courseStartDate = "";

    if (currentMonth < 10) {
        getCourseList("0" + currentMonth, currentYear);
        getOCourseList("0" + currentMonth, currentYear);
    } else {
        getCourseList(currentMonth, currentYear);
        getOCourseList(currentMonth, currentYear);
    }

    getAllCourseList();

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

    var o_courseTable = "";
    function getOCourseList(month, year) {
        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetCourseListO',
            dataType: 'json',
            type: 'get',
            data: { month: month, year: year },
            success: function (result) {
                generateOCourseListTable(result);
            }
        });
    }

    function getOCourseListRange(monthFrom, monthTo, year) {
        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetCourseListRangeO',
            dataType: 'json',
            type: 'get',
            data: { monthFrom: monthFrom, monthTo: monthTo, year: year },
            success: function (result) {
                generateOCourseListTable(result);
            }
        });
    }

    function generateOCourseListTable(result) {
        var content = "";
        let serverDate = "";
        //course_list_tbl_tbody
        getServerDate().then(function (data) {
            serverDate = data;

            if (o_courseTable != "") {
                o_courseTable.destroy();
            }

            for (var i = 0; i < result.length; i++) {
                content += "<tr id='" + result[i].SchedID + "'><td style='text-align: left'><a>" + result[i].CourseName + "</a>" + generateIndicator(result[i], serverDate) + "</td><td>" + (result[i].MinCapacity == null ? "N/A" : result[i].MinCapacity) +
                    "</td><td>" + (result[i].CourseDuration == null ? "N/A" : result[i].CourseDuration) + "</td><td>" + result[i].DateFrom.split('T')[0] +
                    "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'><button id='enroll_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-plus'></i></button></td></tr>";
            }

            $('#o_course_list_tbl_tbody').html(content);

            o_courseTable = $('#o_course_list_tbl').DataTable({
                "columnDefs": [{
                    "targets": [4],
                    "orderable": false
                }, {
                    "width": "50%",
                    "targets": [0]
                }]
            });
            $('#o_course_list_tbl').css({ 'width': 'inherit' });
        }).catch(function (err) {
            generateDangerModal("get_server_date_modal", 2, '', "Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
        });

    }

    var courseTable = "";
    function getCourseList(month, year) {

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetCourseList',
            dataType: 'json',
            type: 'get',
            data: { month: month, year: year },
            success: function (result) {
                generateCourseListTable(result);
            }
        });
    }

    function getCourseListRange(monthFrom, monthTo, year) {
        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetCourseListRange',
            dataType: 'json',
            type: 'get',
            data: { monthFrom: monthFrom, monthTo: monthTo, year: year },
            success: function (result) {
                generateCourseListTable(result);
            }
        });
    }

    function generateCourseListTable(result) {
        var content = "";
        let serverDate = "";
        //course_list_tbl_tbody

        getServerDate().then(function (data) {
            serverDate = data;

            if (courseTable != "") {
                courseTable.destroy();
            }


            for (var i = 0; i < result.length; i++) {

                content += "<tr id='" + result[i].SchedID + "'><td style='text-align: left'><a>" + result[i].CourseName + "</a>" + generateIndicator(result[i], serverDate) + "</td><td>" + (result[i].MinCapacity == null ? "N/A" : result[i].MinCapacity) +
                    "</td><td>" + (result[i].CourseDuration == null ? "N/A" : result[i].CourseDuration) + "</td><td>" + result[i].DateFrom.split('T')[0] +
                    "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'><button id='enroll_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-plus'></i></button></td></tr>";

            }

            $('#course_list_tbl_tbody').html(content);

            courseTable = $('#course_list_tbl').DataTable({
                "columnDefs": [{
                    "targets": [4],
                    "orderable": false
                }, {
                    "width": "50%",
                    "targets": [0]
                }]
            });
            $('#course_list_tbl').css({ 'width': 'inherit' });

        }).catch(function (err) {
            generateDangerModal("get_server_date_modal", 2, '', "Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
        });

    }

    $('#date_select').datepicker();

    var inputWidth = document.getElementById('date_select').clientWidth + "px";

    function getAllCourseList() {
        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetAllCourseList',
            dataType: 'JSON',
            type: 'GET',
            success: function (result) {
                var content = "<option></option>";
                for (var i = 0; i < result.length; i++) {
                    content += "<option value='Min. of " + result[i].Min + " / Max of " + result[i].Max + "' data-duration=" + result[i].CourseDuration + ">" + result[i].CourseName.toUpperCase() + "</option>";
                }

                $('#course_select').html(content);
            }, complete: function () {

                $('#course_select').select2({ theme: "bootstrap", placeholder: "Select Course", width: '"' + inputWidth + '"' });

                $('.select2-container--bootstrap .select2-selection--single').css({ 'padding-top': '10px', 'border-radius': '0px' });

                $('#min_max_students').css({ 'padding-top': '5px' });
                $('#course_duration').css({ 'padding-top': '5px' });

            }
        });

    }

    $(document).on('change', '#course_select', function () {
        var selectedMax = "";

        if ($(this).val() == "") {
            return;
        }

        selectedMax = $(this).val().split(' / ')[1].split(' ')[2];

        var courseDuration = $('option:selected', this).attr('data-duration');

        $('#min_max_students').html($(this).val());

        $('#course_duration').html(courseDuration + " day/s");

        var options = "<option></option>";
        for (var i = 0; i < selectedMax; i++) {
            options += "<option>" + (i + 1) + "</option>";
        }

        $('#number_of_participants_select').html(options);

        $('#number_of_participants_select').select2({ theme: "bootstrap", placeholder: "Select Number", width: '"' + inputWidth + '"' });

        $('.select2-container--bootstrap .select2-selection--single').css({ 'padding-top': '10px', 'border-radius': '0px' });
    });

    var myEnrollmentTable = "";
    var myEnrolledCrewTable = "";
    $(document).on('click', '#enroll_crew', function () {
        totalEnrollees = [];
        courseStartDate = "";
        //var schedId = $(this).parent().parent().attr('id');
        var schedId = $(this).parent().parent().attr('id');
        var courseName = $(this).parent().prevAll().eq(4).find('a').html();
        var e_numberOfEnrollees = 0;

        totalEnrollees = $(this).parent().prev().html().split(' / ');

        courseStartDate = $(this).parent().prev().prev().html();

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetNumberOfEnrollees',
            dataType: 'json',
            type: 'get',
            data: { schedId: schedId },
            success: function (result) {
                e_numberOfEnrollees = result;
                $('#enroll_modal .modal-title').html("Schedule no. " + schedId + " - " + courseName);
                $('.modal-body #message').html('Number of enrollees from other company: ' + e_numberOfEnrollees);

                getEnrolleesAndCrewList(schedId);
            }
        });

        $('#enroll_modal').modal();

    });

    var rowForRemoval = "";
    $(document).on('click', '#unenroll_modal_yes', function () {
        let mnnoForRemoval = rowForRemoval.children().first().html();
        let scheduleNo = $('#enroll_modal .modal-title').html().split(' ')[2];

        let parameters = [scheduleNo, mnnoForRemoval];

        $.ajax({
            url: '/SAMPortal/CourseBooking/UnenrollThisCrew',
            dataType: 'JSON',
            type: 'POST',
            data: { parameters: parameters },
            success: function (result) {
                myEnrolledCrewTable.row(rowForRemoval).remove().draw();
            }
        });

    });

    $(document).on('click', '#remove_crew', function () {
        rowForRemoval = $(this).parent().parent();
        let mnnoForRemoval = rowForRemoval.children().first().html();

        $('#unenroll_warning .modal-body p').html('Are you sure that you want to unenroll ' + mnnoForRemoval + '?');
        $('#unenroll_warning').modal();
    });

    var swapEnrollmentTable = "";
    var mnnoForSwap = "";
    var rankForSwap = "";
    var rowForSwap = "";
    $(document).on('click', '#swap_crew', function () {
        rowForSwap = $(this);
        mnnoForSwap = $(this).parent().prev().prev().prev().prev().html();
        rankForSwap = $(this).parent().prev().prev().prev().html();
        var schedId = $('#enroll_modal .modal-title').html().split(' - ')[0].split('. ')[1];

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetEarliesTimeOfCourse',
            type: 'GET',
            dataType: 'JSON',
            data: { schedId: schedId },
            success: function (result) {
                var schedDate = result.SchedDate;
                var timeFrom = result.TimeFrom;
                var hhMMss = timeFrom.split(':');

                var dateNow = new Date();
                var startDate = new Date(schedDate);
                startDate.setHours(hhMMss[0], hhMMss[1], hhMMss[2]);

                if (startDate <= dateNow) {
                    $('#enroll_this_crew_not_allowed .modal-body p').html("You are no longer allowed to swap because the course is finished or has already started.");
                    $('#enroll_this_crew_not_allowed').modal();
                    return false;
                }

                $.ajax({
                    url: '/SAMPortal/api/CourseBooking/GetCrewListForEnrollment',
                    dataType: 'json',
                    type: 'get',
                    success: function (result) {
                        if (swapEnrollmentTable !== "") {
                            $('#swap_enrollees_tbl tbody').html();
                            swapEnrollmentTable.destroy();
                        }

                        var content = "";

                        for (var i = 0; i < result.length; i++) {
                            content += "<tr id='" + result[i].MNNO + "'><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                                (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + result[i].Contact + "</td><td style='padding: 1px'><button id='swap_this_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-user-plus'></i></button></td></tr>";
                        }

                        $('#swap_enrollees_tbl tbody').html(content);

                        swapEnrollmentTable = $('#swap_enrollees_tbl').DataTable({
                            pageLength: 5, lengthChange: false,
                            "columnDefs": [{
                                "targets": [4],
                                "orderable": false
                            }]
                        });

                        $('#swap_enrollees').modal();
                    }
                });

            }
        });

    });

    var enrollThisCrewParameters = [];
    var crewNameToBeEnrolled = "";
    var crewNameToBeEnrolledContact = "";

    var enrollees;
    var maxEnrolless;


    $(document).on('click', '#enroll_this_crew', function () {

        enrollees = parseInt(totalEnrollees[0]);
        maxEnrolless = parseInt(totalEnrollees[1]);

        var startDate = new Date(courseStartDate);
        var d = new Date();

        var dateDiff = Math.abs(d.getTime() - d.getTime());

        var timeDiff = Math.abs(startDate.getTime() - d.getTime());
        var daysBeforeStart = (Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1);

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

        var schedId = $('#enroll_modal .modal-title').html().split(' - ')[0].split('. ')[1];
        var mnno = $(this).parent().parent().attr('id');
        crewNameToBeEnrolledContact = $(this).parent().prev().html();
        var rank = $(this).parent().prev().prev().prev().html();
        crewNameToBeEnrolled = $(this).parent().prev().prev().html();

        var parameters = [];
        parameters[0] = schedId;
        parameters[1] = mnno;
        parameters[2] = rank;
        //parameters[3] = name;

        enrollThisCrewParameters = parameters;
        //enrollThisCrew(enrollThisCrewParameters);
        $('#enroll_this_crew_warning .modal-body p').html('Are you sure you want to enroll this crew?');
        $('#enroll_this_crew_warning').modal();
    });

    $(document).on('click', '#enroll_this_crew_warning_yes', function () {
        totalEnrollees[0] = parseInt(totalEnrollees[0]) + 1;
        enrollThisCrew(enrollThisCrewParameters);
    });

    function enrollThisCrew(parameters) {
        $.ajax({
            url: '/SAMPortal/CourseBooking/EnrollThisCrew',
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { parameters: parameters },
            success: function (result) {
                $.unblockUI();
                if (result.data === 1) {
                    //temp
                    $('#modal_success .modal-body p').html('Crew is successfully enrolled.');
                    $('#modal_success').modal();

                    var newRow = myEnrolledCrewTable.row.add([
                        enrollThisCrewParameters[1],
                        enrollThisCrewParameters[2],
                        crewNameToBeEnrolled,
                        crewNameToBeEnrolledContact,
                        "<button id='swap_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-exchange'></i></button><button id='remove_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-times'></i></button>",
                        myEnrolledCrewTable.rows().count() + 1
                    ]).draw(false);

                    newRow.nodes().to$().css({ 'background-color': 'lightgreen' });

                } else if (result.data === 0) {
                    $('#enroll_warning .modal-body p').html('This crew is already enrolled in this schedule.');
                    $('#enroll_warning').modal();
                } else {
                    generateDangerModal("enroll_this_crew_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }
            }
        });
    }
    var course_enrollee_tbl = "";
    $(document).on('click', '#course_list_tbl tr td a', function () {
        var schedId = $(this).parent().parent().attr('id');
        var numberOfEnrollees = 0;

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetNumberOfEnrollees',
            dataType: 'json',
            type: 'get',
            data: { schedId: schedId },
            success: function (result) {
                numberOfEnrollees = result;

                //if (numberOfEnrollees != 0) {
                $('.modal-body #message').html('Number of enrollees from other company: ' + numberOfEnrollees);
                //}

                $.ajax({
                    url: '/SAMPortal/api/CourseBooking/GetEnrollees',
                    type: 'get',
                    dataType: 'json',
                    data: { schedId: schedId },
                    success: function (result) {
                        var content = "";

                        if (course_enrollee_tbl != "") {
                            course_enrollee_tbl.destroy();
                        }

                        for (var i = 0; i < result.length; i++) {
                            content += "<tr><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                                (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + (result[i].Contact === null ? "N/A" : result[i].Contact) + "</td></tr>";
                        }

                        $('#course_enrollee_tbl_body').html(content);
                        $('#enrollees_modal').modal();

                        course_enrollee_tbl = $('#course_enrollee_tbl').DataTable({ "bProcessing": true });
                    }
                });
            }
        });
    });

    $(document).on('click', '#o_course_list_tbl tr td a', function () {
        var schedId = $(this).parent().parent().attr('id');
        var o_numberOfEnrollees = 0;

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetNumberOfEnrollees',
            dataType: 'json',
            type: 'get',
            data: { schedId: schedId },
            success: function (result) {
                o_numberOfEnrollees = result;

                $('.modal-body #message').html('Number of enrollees from other company: ' + o_numberOfEnrollees);

                $.ajax({
                    url: '/SAMPortal/api/CourseBooking/GetEnrollees',
                    type: 'get',
                    dataType: 'json',
                    data: { schedId: schedId },
                    success: function (result) {
                        var content = "";

                        if (course_enrollee_tbl != "") {
                            course_enrollee_tbl.destroy();
                        }

                        for (var i = 0; i < result.length; i++) {
                            content += "<tr><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                                (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + (result[i].Contact === null ? "N/A" : result[i].Contact) + "</td></tr>";
                        }

                        $('#course_enrollee_tbl_body').html(content);
                        $('#enrollees_modal').modal();

                        course_enrollee_tbl = $('#course_enrollee_tbl').DataTable();
                    }
                });
            }
        });
    });

    var swapThisCrewParameters = [];
    var crewNameToBeSwapped = "";
    var crewNameToBeSwappedContact = "";
    $(document).on('click', '#swap_this_crew', function () {
        var schedId = $('#enroll_modal .modal-title').html().split(' - ')[0].split('. ')[1];
        var mnno = $(this).parent().parent().attr('id');
        crewNameToBeSwappedContact = $(this).parent().prev().html();
        var rank = $(this).parent().prev().prev().prev().html();
        crewNameToBeSwapped = $(this).parent().prev().prev().html();

        var parameters = [];
        parameters[0] = schedId;
        parameters[1] = mnno;
        parameters[2] = rank;
        parameters[3] = mnnoForSwap;
        parameters[4] = rankForSwap;

        swapThisCrewParameters = parameters;

        $('#swap_this_crew_warning .modal-body p').html("Are you sure you want to swap this crew?");
        $('#swap_this_crew_warning').modal();
    });

    $(document).on('click', '#submit_special_request', function () {
        let courseName = $('#course_select option:selected').html();
        let startDate = $('#date_select').val();
        let numberOfParticipants = $('#number_of_participants_select option:selected').val();

        if (courseName === '' || startDate === '' || numberOfParticipants === '') {
            $('#request_special_schedule_modal .modal-body p').html("Please do not leave Course Name, Start Date and Number of Participants fields when submitting.");
            $('#request_special_schedule_modal .modal-footer').html('<button type="button" class="btn btn-outline pull-right" data-dismiss="modal">OK</button>');
            $('#request_special_schedule_modal').modal();
            return;
        }

        if (validateSchedule() === 0) {
            $('#request_special_schedule_modal .modal-body p').html("You are not allowed to request a schedule on any days of the following week. Please contact the Sales and Marketing team instead. <br />" +
                "<br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
            $('#request_special_schedule_modal .modal-footer').html('<button type="button" class="btn btn-outline pull-right" data-dismiss="modal">OK</button>');
            $('#request_special_schedule_modal').modal();

            $('#min_max_students').html('');
            $('#course_duration').html('');
            $('#date_select').val('');
            $("#course_select").val('').trigger('change');
            $('#number_of_participants_select').empty();
            $('#notes_special_request').val('');

        } else {
            $('#request_special_schedule_modal .modal-body p').html("Are you sure you want to request this schedule?");
            $('#request_special_schedule_modal .modal-footer').html('<button type="button" id="request_special_schedule_modal_yes" class="btn btn-outline pull-right" data-dismiss="modal">Yes</button>' +
                '<button type="button" class="btn btn-outline pull-right" data-dismiss="modal">No</button>');
            $('#request_special_schedule_modal').modal();
        }

    });

    $(document).on('click', '#request_special_schedule_modal_yes', function () {
        let courseName = $('#course_select option:selected').html();
        let startDate = $('#date_select').val();
        let numberOfParticipants = $('#number_of_participants_select option:selected').val();
        let notes = $('#notes_special_request').val();

        let parameters = [];

        parameters[0] = courseName;
        parameters[1] = startDate;
        parameters[2] = numberOfParticipants;
        parameters[3] = notes;

        $.ajax({
            url: '/SAMPortal/CourseBooking/SaveSpecialRequest',
            dataType: 'JSON',
            type: 'POST',
            data: { parameters: parameters },
            success: function (result) {
                if (result.data == 1) {
                    $('#modal_success .modal-body p').html('Your request has been successfully sent! You may check the status of your request in the Requests page.');
                    $('#modal_success').modal();

                    $('#min_max_students').html('');
                    $('#course_duration').html('');
                    $('#date_select').val('');

                    $("#course_select").val('').trigger('change');
                    $('#number_of_participants_select').empty();

                    $('#notes_special_request').val('');

                } else {
                    generateDangerModal("save_special_request_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }
            }
        });
    });

    $(document).on('click', '#swap_this_crew_warning_yes', function () {
        swapThisCrew(swapThisCrewParameters);
    });

    function swapThisCrew(parameters) {

        $.ajax({
            url: '/SAMPortal/CourseBooking/EnrollThisCrew',
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            data: { parameters: parameters },
            success: function (result) {
                $.unblockUI();
                if (result.data === 1) {
                    //temp
                    $('#modal_success .modal-body p').html('Crew is successfully swapped.');
                    $('#modal_success').modal();
                    //getEnrollees(parameters[0]);
                    myEnrolledCrewTable.row(rowForSwap.parents('tr')).remove().draw();

                    var newRow = myEnrolledCrewTable.row.add([
                        parameters[1],
                        parameters[2],
                        crewNameToBeSwapped,
                        crewNameToBeSwappedContact,
                        "<button id='swap_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-exchange'></i></button><button id='remove_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-times'></i></button>",
                        myEnrolledCrewTable.rows().count() + 1
                    ]).draw(false);

                    newRow.nodes().to$().css({ 'background-color': 'lightgreen' });
                } else if (result.data == 0) {
                    $('#enroll_warning .modal-body p').html('This crew is already enrolled in this schedule.');
                    $('#enroll_warning').modal();

                } else {
                    generateDangerModal("course_booking_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }

                $('#swap_enrollees').modal('hide');
            }
        });
    }

    function getEnrollees(schedId) {
        var content1 = "";
        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetEnrollees',
            type: 'get',
            dataType: 'json',
            data: { schedId: schedId },
            success: function (result) {

                if (myEnrolledCrewTable !== "") {
                    $('#enrolled_crews_tbl').css('visibility', 'hidden');
                    myEnrolledCrewTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {

                    content1 += "<tr><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                        (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + (result[i].Contact === null ? "N/A" : result[i].Contact) + "</td><td style='padding: 1px'>" +
                        "<button id='swap_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-exchange'></i></button></td>" +
                        "<td style='padding: 1px'><button id='remove_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-times'></i></button></td><td>" + i + "</td></tr> ";
                }


                //$('#enrollees_modal').modal();
                $('#enrolled_crews_tbl tbody').html(content1);

                myEnrolledCrewTable = $('#enrolled_crews_tbl').DataTable({
                    pageLength: 5, lengthChange: false, info: false,
                    "columnDefs": [{
                        "targets": [4],
                        "orderable": false
                    }, {
                        "targets": [5],
                        "orderable": false
                    }, {
                        "targets": [6],
                        "visible": false
                    }],
                    order: [[5, 'desc']]
                });

                $('#enrolled_crews_tbl').css('width', 'inherit');

                /*myEnrolledCrewTable =*/

            }, complete: function () {
                $('#enrolled_crews_tbl').css('visibility', 'visible');
            }
        });

    }

    function getEnrolleesAndCrewList(schedId) {
        var content1 = "";

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetEnrollees',
            type: 'get',
            dataType: 'json',
            data: { schedId: schedId },
            success: function (result) {
                if (myEnrolledCrewTable !== "") {
                    $('#enrolled_crews_tbl').css('visibility', 'hidden');
                    myEnrolledCrewTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {

                    let buttons = "";

                    //this is to check if payment is personal account
                    if (result[i].RegistrationNo === '' || result[i].RegistrationNo === null) {
                        buttons = "<button id='swap_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-exchange'></i></button>" +
                            "<button id='remove_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-times'></i></button>";
                    }

                    content1 += "<tr><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                        (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + (result[i].Contact === null ? "N/A" : result[i].Contact) + "</td><td style='padding: 1px'>" + buttons + "</td><td>" + i + "</td></tr> ";
                }


                //$('#enrollees_modal').modal();
                $('#enrolled_crews_tbl tbody').html(content1);

                myEnrolledCrewTable = $('#enrolled_crews_tbl').DataTable({
                    pageLength: 5, lengthChange: false, info: false,
                    "columnDefs": [{
                        "targets": [4],
                        "orderable": false
                    }, {
                        "targets": [5],
                        "visible": false
                    }],
                    order: [[5, 'desc']]
                });

                $('#enrolled_crews_tbl').css('width', 'inherit');
                /*myEnrolledCrewTable =*/

            },
            complete: function (result) {
                $('#enrolled_crews_tbl').css('visibility', 'visible');
                $.ajax({
                    url: '/SAMPortal/api/CourseBooking/GetCrewListForEnrollment',
                    dataType: 'json',
                    type: 'get',
                    beforeSend: function () {
                        $('#enroll_crew_tbl tbody').html('<tr><td colspan="5">Loading please wait...</td></tr>');
                    },
                    success: function (result) {
                        if (myEnrollmentTable !== "") {
                            $('#enroll_crew_tbl tbody').html();
                            myEnrollmentTable.destroy();
                        }

                        var content = "";

                        for (var i = 0; i < result.length; i++) {
                            content += "<tr id='" + result[i].MNNO + "'><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + result[i].LName + ", " + result[i].FName + " " +
                                (result[i].MName === null ? "" : result[i].MName) + "</td><td>" + result[i].Contact + "</td><td style='padding: 1px'><button id='enroll_this_crew' class='btn btn-default'" +
                                " style='width: 100%'><i class='fa fa-user-plus'></i></button></td></tr>";
                        }

                        $('#enroll_crew_tbl tbody').html(content);

                        myEnrollmentTable = $('#enroll_crew_tbl').DataTable({
                            pageLength: 5,
                            lengthChange: false,
                            "columnDefs": [{
                                "targets": [4],
                                "orderable": false
                            }]
                        });
                    }
                });
            }
        });
    }

    $('#enroll_modal').on('hidden.bs.modal', function () {

        //alert($('#date_rb_range').is(':checked'));

        var currentMonth = $('#month_select option:selected').val();
        var currentYear = $('#year_input').val();

        var o_currentMonth = $('#o_month_select option:selected').val();
        var o_currentYear = $('#o_year_input').val();

        if ($('#date_rb_range').is(':checked') === false) {
            getCourseList(currentMonth, currentYear);
        } else {
            let currentMonthTo = $('#month_select_yc_to option:selected').val();
            getCourseListRange(currentMonth, currentMonthTo, currentYear);
        }

        if ($('#o_date_rb_range').is(':checked') === false) {
            getOCourseList(o_currentMonth, o_currentYear);
        } else {
            let o_currentMonthTo = $('#o_month_select_yc_to option:selected').val();
            getOCourseListRange(o_currentMonth, o_currentMonthTo, o_currentYear);

        }

        //if (currentMonth < 10) {
        //    getCourseList(currentMonth, currentYear);
        //} else {
        //    getCourseList(currentMonth, currentYear);
        //}

        //if (o_currentMonth < 10) {
        //    getOCourseList(o_currentMonth, o_currentYear);
        //} else {
        //    getOCourseList(currentMonth, currentYear);
        //}

    });


    // return values: 0 - not allowed to book, 1 - allowed to book
    function validateSchedule() {

        let chosenDate = $('#date_select').val();

        let dateToday = new Date();

        let difference = getWeekNumber(chosenDate) - getWeekNumber(dateToday);

        if (difference < 2) {

            return 0;
        }

        return 1;
    }

    function getWeekNumber(myDate) {
        let d = new Date(myDate);
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
    }

    function generateIndicator(data, serverDate) {
        //alert(fixServerDateFormat(serverDate));
        //alert(data.DateFrom);
        if (getWeekNumber(data.DateFrom) - getWeekNumber(fixServerDateFormat(serverDate)) === 2 && data.Slots < data.MinCapacity) {
            return "<span id='indicator_orange' class='pull-right'><i style='color: orange; font-size: large' class='fa fa-warning'></i></span>";
        } else if (getWeekNumber(data.DateFrom) - getWeekNumber(fixServerDateFormat(serverDate)) < 2 && data.Slots < data.MinCapacity) {
            return "<span id='indicator_red' class='pull-right'><i style='color: red; font-size: large'' class='fa fa-ban'></i></span>";//<div id='test_diva'>hey hey hey</div>
        }

        return "";
    }

    $(document).on('click', 'input#date_rb_single', function () {
        $('#multiple_date_div_yc').css('display', 'none');
        $('#single_date_div_yc').css('display', 'block');

    });

    $(document).on('click', 'input#date_rb_range', function () {
        $('#single_date_div_yc').css('display', 'none');
        $('#multiple_date_div_yc').css('display', 'block');

    });

    $(document).on('click', 'input#o_date_rb_single', function () {
        $('#o_multiple_date_div_yc').css('display', 'none');
        $('#o_single_date_div_yc').css('display', 'block');

    });

    $(document).on('click', 'input#o_date_rb_range', function () {
        $('#o_single_date_div_yc').css('display', 'none');
        $('#o_multiple_date_div_yc').css('display', 'block');

    });

    $(document).on('mouseover', 'span#indicator_red', function () {
        $('.alert').css('display', 'none');
        $('#indicator_red_dialog').css('position', 'absolute');
        $('#indicator_red_dialog').css('top', $(this).offset().top);
        $('#indicator_red_dialog').css('left', $(this).offset().left + $(this).width());
        $('#indicator_red_dialog').css('z-index', 100);
        //$('#indicator_red_dialog').css('display', 'block');
        $('#indicator_red_dialog').fadeIn();
    });

    $(document).on('mouseleave', 'span#indicator_red', function () {
        $('#indicator_red_dialog').css('display', 'none');
    });

    $(document).on('click', '#indicator_red_dialog .close', function () {
        $('#indicator_red_dialog').css('display', 'none');
    });

    $(document).on('click', '#indicator_orange_dialog .close', function () {
        $('#indicator_orange_dialog').css('display', 'none');
    });

    $(document).on('mouseover', 'span#indicator_orange', function () {
        $('.alert').css('display', 'none');
        $('#indicator_orange_dialog').css('position', 'absolute');
        $('#indicator_orange_dialog').css('top', $(this).offset().top);
        $('#indicator_orange_dialog').css('left', $(this).offset().left + $(this).width());
        $('#indicator_orange_dialog').css('z-index', 100);
        $('#indicator_orange_dialog').fadeIn();
    });

    $(document).on('mouseleave', 'span#indicator_orange', function () {
        $('#indicator_orange_dialog').css('display', 'none');
    });



});