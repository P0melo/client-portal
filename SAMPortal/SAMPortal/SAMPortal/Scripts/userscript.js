
//footerType: 1 = Yes and No, 2 = Ok
function generateWarningModal(modalId, footerType, modalButtonId, modalMessage) {
    $('.modal_warning_template').attr('id', modalId);
    $('.modal_warning_template .modal-content .modal-body p').html(modalMessage);

    if (footerType === 1) {
        $('.modal_warning_template .modal-content .modal-footer').html('<button type="button" id="' + modalButtonId + '" class="btn btn-outline pull-right" data-dismiss="modal">Yes</button><button type="button" class="btn btn-outline pull-right" data-dismiss="modal"> No</button>');

        $('#' + modalId).modal();

    } else if (footerType === 2) {
        $('.modal_warning_template .modal-content .modal-footer').html('<button type="button" id="" class="btn btn-outline pull-right" data-dismiss="modal">Ok</button>');
        $('#' + modalId).modal();

    }

}

function generateSuccessModal(modalId, footerType, modalButtonId, modalMessage) {
    $('.modal_success_template').attr('id', modalId);
    $('.modal_success_template .modal-content .modal-body p').html(modalMessage);

    if (footerType === 1) {
        $('.modal_success_template .modal-content .modal-footer').html('<button type="button" id="' + modalButtonId + '" class="btn btn-outline pull-right" data-dismiss="modal">Yes</button><button type="button" class="btn btn-outline pull-right" data-dismiss="modal"> No</button>');
        $('#' + modalId).modal();

    } else if (footerType === 2) {
        $('.modal_success_template .modal-content .modal-footer').html('<button type="button" id="" class="btn btn-outline pull-right" data-dismiss="modal">Ok</button>');
        $('#' + modalId).modal();

    }
}

function generateDangerModal(modalId, modalMessage) {
    $('.modal_danger_template').attr('id', modalId);
    $('.modal_danger_template .modal-content .modal-body p').html(modalMessage);

    $('.modal_danger_template .modal-content .modal-footer').html('<button type="button" id="" class="btn btn-outline pull-right" data-dismiss="modal">Ok</button>');
    $('#' + modalId).modal();

}


function getServerDate() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetServerDate',
            type: 'GET',
            dataType: 'JSON',
            success: function (result) {
                resolve(result);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}


function verify_btn_validation(firstname, lastname, birthdate, rank, birthplace) {
    if (firstname === "" || lastname === "" || birthdate === "" || rank === "" || birthplace === "") {
        return 1;
    }

    return 0;

}


function fixServerDateFormat(serverDate) {
    let parts = serverDate.split('/');
    let yearDate = parts[2].split(' ');
    //alert(parts);
    //dd/MM/YYYY
    return yearDate[0] + "-" + (parts[1].length == 1 ? "0" + parts[1] : parts[1]) + "-" + (parts[0].length == 1 ? "0" + parts[0] : parts[0]) + "T" + yearDate[1];
}


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

var o_courseTable = "";

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
                "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'><button id='enroll_crew' class='btn btn-default' style='width: 100%'>" + renderButtonFontAwesome() + "</button></td></tr>";
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
        generateDangerModal("get_server_date_modal", "Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
    });

}

function renderButtonFontAwesome() {
    if ($('.content-wrapper section h1').html() == "Register New Crew") {
        return "<i class='fa fa-user-plus'></i>"
    } else {
        return "<i class='fa fa-plus'></i>"
    }
}

var courseTable = "";

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
                "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'><button id='enroll_crew' class='btn btn-default' style='width: 100%'>" + renderButtonFontAwesome() + "</button></td></tr>";

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
        generateDangerModal("get_server_date_modal", "Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
    });

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
    //alert(getWeekNumber(fixServerDateFormat(serverDate)));
    if (getWeekNumber(data.DateFrom) - getWeekNumber(fixServerDateFormat(serverDate)) === 2 && data.Slots < data.MinCapacity) {
        return "<span id='indicator_orange' class='pull-right'><i style='color: orange; font-size: large' class='fa fa-warning'></i></span>";
    } else if (getWeekNumber(data.DateFrom) - getWeekNumber(fixServerDateFormat(serverDate)) < 2 && data.Slots < data.MinCapacity) {
        return "<span id='indicator_red' class='pull-right'><i style='color: red; font-size: large'' class='fa fa-ban'></i></span>";
    }

    return "";
}


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

$(document).on('change', '#InputFile', function () {
    $('#inputFilename').html($(this).val());
    var inputFile = document.getElementById('InputFile');
    var reader = new FileReader();
    reader.readAsDataURL(inputFile.files[0]);
    reader.onload = function () {
        inputFile = reader.result;
        $('#output').val(inputFile);
    };

});


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

$(document).ready(function () {

    $(document).on('click', '#company_profile', function () {
        var id = $(this).attr('id');
        getPartial(id);
        window.history.pushState("", "Company Profile", "/About/CompanyProfile");
    });

    $(document).on('click', '#vision_mission', function () {
        var id = $(this).attr('id');
        getPartial(id);
        window.history.pushState("", "Vision and Mission", "/About/VisionAndMission");
    });

    $(document).on('click', '#accreditations', function () {
        var id = $(this).attr('id');
        getPartial(id);
        window.history.pushState("", "Acreditations", "/About/Accreditations");
    });

    $(document).on('click', '#our_team', function () {
        var id = $(this).attr('id');
        getPartial(id);
        window.history.pushState("", "Team", "/About/Team");
    });

    $(document).on('click', '#contact', function () {
        goToContact();
        window.history.pushState("", "Contact", "/Contact");
    });

    $(document).on('click', '#side_links li', function () {
        $('#side_links li').removeClass('active');
        $(this).addClass('active');
    });

    $(document).on('click', '#generate', function () {
        var id = $('#companies_dropdown option:selected').val();
        getLink(parseInt(id));
        //window.history.pushState("", "GenerateLink", "/Administration/About/Team");
    });

    function getLink(id) {
        $.ajax({
            url: '/SAMPortal/Administration/Partial',
            type: 'get',
            data: { id: id },
            success: function (result) {
                $('#link_placeholder').html(result);
                $('#copy_link').css('display', 'block');
            }
        });
    }

    function goToContact() {
        $.ajax({
            url: '/SAMPortal/Home/Contact',
            type: 'get',
            success: function (result) {
                $('.content').html(result);
            }
        });
    }

    function getPartial(id) {
        $.ajax({
            url: '/SAMPortal/Home/Partial',
            type: 'get',
            data: { id: id },
            success: function (result) {
                $('.content').html(result);
            }
        });
    }

    $(document).on('click', '#copy_link', function () {
        /* Get the text field */
        var copyText = document.getElementById("register_lnk");

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("copy");

    });

    $(function () {
        $('.fadein div:gt(0)').hide();
        //$('.fadein :first-child').css({ "transform": "scale(1.1)", "transition": "transform 18s ease" });

        setInterval(function () {
            //$('.fadein :last-child').css({
            //    "transform": "none"
            //});
            $('.fadein :first-child').fadeOut(3000)
                .next('div').fadeIn(3000)
                .end().appendTo('.fadein');

            //$('.fadein :first-child').css({ "transform": "scale(1.1)", "transition": "transform 18s ease" });
        },
            18000);
    });

    $(document).on('focusin : click', '#password_txtbox', function (e) {
        //$("#dialog").dialog({
        //    position: {
        //        my: 'left bottom',
        //        at: 'right top',
        //        collision: 'fit flip',
        //        of: $(this)
        //    }
        //});
        $('#dialog').css('position', 'absolute');
        $('#dialog').css('top', $(this).offset().top - $('#dialog').height());
        $('#dialog').css('left', $(this).offset().left + $(this).parent().width());
        $('#dialog').fadeIn();
    });

    //$(document).on('click', '#password_txtbox', function () {
    //    $("#dialog").dialog({
    //        position: {
    //            my: 'left bottom',
    //            at: 'right top',
    //            collision: 'fit flip',
    //            of: $(this)
    //        }
    //    });
    //});


    //if ($('#password_txtbox').is(":focus")) {
    //    alert(1);
    //}

    var selector = {
        management: '#management_lnk',
        courseReservation: '#course_reservation_lnk'
    };

    $(document).on('click', selector.management, function (e) {
        $(this).parent().find('ul').slideToggle("fast", function () {
            $(selector.courseReservation).find('span').css('color', '#b8c7ce');
            //$('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
            $(selector.courseReservation).parent().removeClass('active menu-open');
            $(selector.management).parent().addClass('active menu-open');

            $(selector.courseReservation).next().slideUp("fast");
        });
    });

    $(document).on('click', selector.courseReservation, function (e) {
        $(this).parent().find('ul').slideToggle("fast", function () {
            $(selector.management).find('span').css('color', '#b8c7ce');
            //$('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
            $(selector.courseReservation).parent().addClass('active menu-open');
            $(selector.management).parent().removeClass('active menu-open');

            $(selector.management).next().slideUp("fast");
        });
    });

});