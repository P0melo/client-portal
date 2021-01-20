
//for the redirection found in CourseBooking page
var myHref = window.location.href;
var hrefSplit = myHref.split('?')[1];
var signalR = $.connection.myHub;

if (typeof (hrefSplit) !== 'undefined') {
    let traineeNo = hrefSplit.split('+')[0];
    let rank = hrefSplit.split('+')[1];
    let name = hrefSplit.split('+')[2].replaceAll('%20', ' ');

    //trying vanilla javascript
    document.getElementById('mnno_input').value = traineeNo;
    document.getElementById('rank_input').value = rank;
    document.getElementById('name_input').value = name;

}

var protocol = window.location.protocol;
var hostName = window.location.hostname;

function openToNewTab(actionName, traineeNo, rank, name, schedId) {
    window.open(protocol + "//" + hostName + "/SAMPortal/Forms/" + actionName + "?" + traineeNo + "+" + rank + "+" + name + "+" + schedId);
}

function getTransportationRates() {
    $.ajax({
        url: '/SAMPortal/Api/Forms/GetTransportationRates',
        dataType: 'JSON',
        type: 'GET',
        success: function(result) {
            let content = "";
            let dtr = result.dailyTransferRate;
            let atr = result.airportTransferRate;

            for (let i = 0; i < dtr.length; i++) {
                content += "<tr><td>" + dtr[i].VehicleType + "</td><td>" + dtr[i].Manila + "</td><td>" + dtr[i].Makati + "</td><td>" + dtr[i].Pasay + "</td><td>" + atr[i].Rate + "</td></</tr>";
            }

            $('#transportation_rates_tbl tbody').append(content);
        }
    });
}


$(document).on('click', '#onSite_lnkbtn', function () {
    let traineeNo = $(this).parent().prev().prev().prev().html();
    let rank = $(this).parent().prev().prev().html();
    let name = $(this).parent().prev().html();
    let schedId = $(this).attr('sched_id');
    let actionName = "OnSiteAccommodation";

    openToNewTab(actionName, traineeNo, rank, name, schedId)
});

$(document).on('click', '#offSite_lnkbtn', function () {
    let traineeNo = $(this).parent().prev().prev().prev().html();
    let rank = $(this).parent().prev().prev().html();
    let name = $(this).parent().prev().html();
    let schedId = $(this).attr('sched_id');
    let actionName = "OffSiteAccommodation";

    openToNewTab(actionName, traineeNo, rank, name, schedId)
});

$(document).on('click', '#meals_lnkbtn', function () {
    let traineeNo = $(this).parent().prev().prev().prev().html();
    let rank = $(this).parent().prev().prev().html();
    let name = $(this).parent().prev().html();
    let schedId = $(this).attr('sched_id');
    let actionName = "Meals";

    openToNewTab(actionName, traineeNo, rank, name, schedId)
});

$(document).on('click', '#transportation_lnkbtn', function () {
    let traineeNo = $(this).parent().prev().prev().prev().html();
    let rank = $(this).parent().prev().prev().html();
    let name = $(this).parent().prev().html();
    let schedId = $(this).attr('sched_id');
    let actionName = "Transportation";

    openToNewTab(actionName, traineeNo, rank, name, schedId)
});

//footerType: 1 = Yes and No, 2 = Ok
function generateWarningModal(modalId, footerType, modalButtonId, modalMessage, modalButtonNoId) {
    $('.modal_warning_template').attr('id', modalId);
    $('.modal_warning_template .modal-content .modal-body p').html(modalMessage);

    if (footerType === 1) {
        $('.modal_warning_template .modal-content .modal-footer').html('<button type="button" id="' + modalButtonId + '" class="btn btn-outline pull-right" data-dismiss="modal">Yes</button><button type="button" id="' + modalButtonNoId + '" class="btn btn-outline pull-right" data-dismiss="modal"> No</button>');

        $('#' + modalId).modal();

    } else if (footerType === 2) {
        $('.modal_warning_template .modal-content .modal-footer').html('<button type="button" id="" class="btn btn-outline pull-right" data-dismiss="modal">Ok</button>');
        $('#' + modalId).modal();

    }

}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function renderImageForZoom(recordId, motif) {
    var src = "";
    var fileType = "";

    $.ajax({
        url: '/SAMPortal/api/Forms/GetTransportationAttachment',
        dataType: 'JSON',
        type: 'GET',
        data: { recordId: recordId },
        success: function (result) {
            src = result[0].Picture;
            fileType = result[0].FileType;

            if (motif == "View") {
                if (src !== null && src !== "" && src !== "null") {
                    if (fileType === "pdf" || fileType === "PDF") {
                        $('#attachment_div #attachment #imgForZoom').prop('src', 'data:application/pdf;base64,' + src);
                    } else if (fileType === "jpg" || fileType === "jpeg" || fileType === "JPG") {
                        $('#attachment_div #attachment #imgForZoom').prop('src', 'data:image/jpeg;base64,' + src);

                    } else if (fileType === "png" || fileType === "PNG") {
                        $('#attachment_div #attachment #imgForZoom').prop('src', 'data:image/png;base64,' + src);

                    }

                }
                //else {
                //    $('.modal_picture .modal-body div').html('<p style="text-align: center">No data to show</p>');
                //}

                $('.modal_airport_transportation').modal();
                $('#attachment').zoom({ on: 'grab' });

            } else if (motif == "Edit") {
                if (src !== null && src !== "" && src !== "null") {
                    if (fileType === "pdf" || fileType === "PDF") {
                        $('#attachment_div #e_attachment #imgForZoom').prop('src', 'data:application/pdf;base64,' + src);
                    } else if (fileType === "jpg" || fileType === "jpeg" || fileType === "JPG") {
                        $('#attachment_div #e_attachment #imgForZoom').prop('src', 'data:image/jpeg;base64,' + src);

                    } else if (fileType === "png" || fileType === "PNG") {
                        $('#attachment_div #e_attachment #imgForZoom').prop('src', 'data:image/png;base64,' + src);

                    }

                }
                //else {
                //    $('.modal_picture .modal-body div').html('<p style="text-align: center">No data to show</p>');
                //}

                $('#edit_airport_transfer_modal').modal();
                $('#e_attachment').zoom({ on: 'grab' });
            }
            
        }

    });
};

// return values: 0 - not allowed to book, 1 - allowed to book
function validateSchedule(date, serverDate) {
    let dateSplit = date.split('/');
    let sDate = serverDate.split('-');

    let chosenDate = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
    let fixedServerDate = new Date(sDate[2], sDate[1] - 1, sDate[0]);

    var startDate = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);

    let diffTime = Math.abs(chosenDate - fixedServerDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {

        return 0;
    }

    return 1;
}


function refreshBookingTable() {
    let currentMonth = $('#month_select option:selected').val();
    let currentYear = $('#year_input').val();

    let o_currentMonth = $('#o_month_select option:selected').val();
    let o_currentYear = $('#o_year_input').val();

    if ($('#date_rb_range').is(':checked') === false) {
        getCourseList(currentMonth, currentYear);
    } else {

        let currentMonthTo = $('#month_select_yc_to option:selected').val();
        let currentMonthFrom = $('#month_select_yc_from option:selected').val();

        getCourseListRange(currentMonthFrom, currentMonthTo, currentYear);
    }

    if ($('#o_date_rb_range').is(':checked') === false) {

        getOCourseList(o_currentMonth, o_currentYear);
    } else {

        let o_currentMonthTo = $('#o_month_select_yc_to option:selected').val();
        let o_currentMonthFrom = $('#o_month_select_yc_from option:selected').val();

        getOCourseListRange(o_currentMonthFrom, o_currentMonthTo, o_currentYear);

    }
}

//footerType: 1 = 'Yes' and 'No', 2 = 'Ok'
function generateSuccessModal(modalId, footerType, modalButtonId, modalMessage, modalButtonNoId) {
    $('.modal_success_template').attr('id', modalId);
    $('.modal_success_template .modal-content .modal-body p').html(modalMessage);

    if (footerType === 1) {
        $('.modal_success_template .modal-content .modal-footer').html('<button type="button" id="' + modalButtonId + '" class="btn btn-outline pull-right" data-dismiss="modal">Yes</button><button type="button" id="' + modalButtonNoId + '" class="btn btn-outline pull-right" data-dismiss="modal"> No</button>');
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
    let parts = serverDate.split('-');
    //let yearDate = parts[2].split(' ');
    //dd/MM/YYYY
    //return yearDate[0] + "-" + (parts[1].length == 1 ? "0" + parts[1] : parts[1]) + "-" + (parts[0].length == 1 ? "0" + parts[0] : parts[0]) + "T" + yearDate[1];
    //YYYY-MM-ddT00:00:00
    return parts[2] + "-" + parts[1] + "-" + parts[0] + "T00:00:00";
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
var o_minCapacity = ""
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

            if (result[i].MinCapacity == null) {
                o_minCapacity = "N/A";
            } else if (result[i].MinCapacity >= result[i].MaxCapacity) {
                o_minCapacity = result[i].MaxCapacity / 2;
            } else {
                o_minCapacity = result[i].MinCapacity;
            }


            content += "<tr id='" + result[i].SchedID + "'><td style='text-align: left'><a>" + result[i].CourseName + "</a>" + generateIndicator(result[i], serverDate) + "</td><td>" + o_minCapacity +
                "</td><td>" + (result[i].CourseDuration == null ? "N/A" : result[i].CourseDuration) + "</td><td>" + fixDateFormat(result[i].DateFrom.split('T')[0]) +
                "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'>" + renderButtonFontAwesome(result[i], serverDate) + "</td></tr>";
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

function renderButtonFontAwesome(data, serverDate) {

    var myServerDate = new Date(fixServerDateFormat(serverDate));
    var courseDate = new Date(data.DateFrom);
    let diffTime = Math.abs(courseDate - myServerDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let minCap = data.MinCapacity;

    if (data.MinCapacity >= data.MaxCapacity) {
        minCap = data.MaxCapacity / 2;
    }
    //let date = new Date();

    //let dateNow = (date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + date.getDate() + "T00:00:00");

    if (!(diffDays < 8 && data.Slots < minCap)) {
        //if (getWeekNumber(data.DateFrom) <= getWeekNumber(dateNow)) {
        //    return "-";
        //}

        if (courseDate <= myServerDate) {
            return "-";
        }

        if ($('.content-wrapper section h1').html() == "Register New Crew") {
            return "<button id='enroll_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-user-plus'></i></button>"

        } else {
            return "<button id='enroll_crew' class='btn btn-default' style='width: 100%'><i class='fa fa-plus'></i></button>"
        }
    }

    return "-";

}

var courseTable = "";
var minCapacity = "";
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

            if (result[i].MinCapacity == null) {
                minCapacity = "N/A";
            } else if (result[i].MinCapacity >= result[i].MaxCapacity) {
                minCapacity = result[i].MaxCapacity / 2;
            } else {
                minCapacity = result[i].MinCapacity;
            }

            content += "<tr id='" + result[i].SchedID + "'><td style='text-align: left'><a>" + result[i].CourseName + "</a>" + generateIndicator(result[i], serverDate) + "</td><td>" + minCapacity +
                "</td><td>" + (result[i].CourseDuration == null ? "N/A" : result[i].CourseDuration) + "</td><td>" + fixDateFormat(result[i].DateFrom.split('T')[0]) +
                "</td><td>" + result[i].Slots + " / " + result[i].MaxCapacity + "</td><td style='padding: 1px'>" + renderButtonFontAwesome(result[i], serverDate) + "</td></tr>";

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

//function getDateDiff(date) {
//    let splitDate = date.split(' - ');

//    let newDateFrom = new Date();
//    let df = splitDate[0];
//    let dfd = df.split('/')[0];
//    let dfm = df.split('/')[1] - 1;
//    let dfy = df.split('/')[2];

//    newDateFrom.setDate(dfd);
//    newDateFrom.setMonth(dfm);
//    newDateFrom.setFullYear(dfy);

//    let newDateTo = new Date();
//    let dt = splitDate[1];
//    let dtd = dt.split('/')[0];
//    let dtm = dt.split('/')[1] - 1;
//    let dty = dt.split('/')[2];

//    newDateTo.setDate(dtd);
//    newDateTo.setMonth(dtm);
//    newDateTo.setFullYear(dty);

//    let dateDifference = new Date(newDateTo - newDateFrom);

//    let intDifference = Math.round((dateDifference / (1000 * 3600 * 24)));

//    return intDifference;
//}

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

    var myServerDate = new Date(fixServerDateFormat(serverDate));
    var courseDate = new Date(data.DateFrom);
    let diffTime = Math.abs(courseDate - myServerDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //alert(getWeekNumber(data.DateFrom) + " " + getWeekNumber(fixServerDateFormat(serverDate)));
    let minCap = data.MinCapacity;

    if (data.MinCapacity >= data.MaxCapacity) {
        minCap = data.MaxCapacity / 2;
    }

    if ((diffDays >= 8 && diffDays <= 14) && data.Slots < minCap) {
        //alert('orange');
        return "<span id='indicator_orange' class='pull-right'><i style='color: orange; font-size: large' class='fa fa-warning'></i></span>";
    } else if (diffDays < 7 && data.Slots < minCap) {
        //alert('red');
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
    try {
        reader.readAsDataURL(inputFile.files[0]);

    } catch (err) {
        generateWarningModal("transportation_attacment_warning_modal", 2, "", "Please make sure that you insert a valid attachment.")
        return false;
    }

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

            let linkButtons = '<button class="btn btn-default" id="onSite_lnkbtn" sched_id="' + schedId + '" title="On Site Accommodation" style= "width: 25%;"><i class="fa fa-hotel"></i></button>' +
                '<button class="btn btn-default" id="offSite_lnkbtn" sched_id="' + schedId + '" title="Off Site Accommodation" style="width: 25%;"><i class="fa fa-suitcase"></i></button>' +
                '<button class="btn btn-default" id="meals_lnkbtn" sched_id="' + schedId + '" title="Meals" style="width: 25%;"><i class="fa fa-spoon"></i></button>' +
                '<button class="btn btn-default" id="transportation_lnkbtn" sched_id="' + schedId + '" title="Transportation" style="width: 25%;"><i class="fa fa-bus"></i></button>';

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
                                (result[i].MName === null ? "" : result[i].MName) + "</td><td style='padding: 0px;'>" + linkButtons + "</td></tr>";
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

            let linkButtons = '<button class="btn btn-default" id="onSite_lnkbtn" sched_id="' + schedId + '" title="On Site Accommodation" style= "width: 25%;"><i class="fa fa-hotel"></i></button>' +
                '<button class="btn btn-default" id="offSite_lnkbtn" sched_id="' + schedId + '" title="Off Site Accommodation" style="width: 25%;"><i class="fa fa-suitcase"></i></button>' +
                '<button class="btn btn-default" id="meals_lnkbtn" sched_id="' + schedId + '" title="Meals" style="width: 25%;"><i class="fa fa-spoon"></i></button>' +
                '<button class="btn btn-default" id="transportation_lnkbtn" sched_id="' + schedId + '" title="Transportation" style="width: 25%;"><i class="fa fa-bus"></i></button>';

            $.ajax({
                url: '/SAMPortal/api/CourseBooking/GetEnrollees',
                type: 'get',
                dataType: 'json',
                data: { schedId: schedId },
                beforeSend: function () {
                    $.blockUI({ message: null });
                },
                success: function (result) {
                    $.unblockUI();
                    let content = "";
                    let data = result;
                    //let data = result.data;


                    if (course_enrollee_tbl != "") {
                        course_enrollee_tbl.destroy();
                    }

                    for (var i = 0; i < data.length; i++) {
                        content += "<tr><td>" + data[i].MNNO + "</td><td>" + data[i].Rank + "</td><td>" + data[i].LName + ", " + data[i].FName + " " +
                            (data[i].MName === null ? "" : data[i].MName) + "</td><td>" + linkButtons + "</td></tr>";
                    }

                    $('#course_enrollee_tbl_body').html(content);

                    course_enrollee_tbl = $('#course_enrollee_tbl').DataTable();

                    //$('#course_fee').html(result.courseFee);
                    //$('#course_total_cost').html(result.courseFee * data.length);
                    //$('#on_site_accommodation_total_cost').html(result.onSiteAccommodationTotalCost);

                    //$('#dorm_standard_fee').html(result.data2[0].PricePerPax);
                    //$('#total_standard_fee').html(result.data2[0].TotalCost)
                    //$('#dorm_superior_fee').html(result.data2[1].PricePerPax);
                    //$('#total_superior_fee').html(result.data2[1].TotalCost)

                    //$('#number_of_people_standard').html("(" + result.data2[0].NumberOfBooking + ")");
                    //$('#number_of_people_superior').html("(" + result.data2[1].NumberOfBooking + ")");

                    //$('#breakfast_fee').html(result.mealPricesList[0].price);
                    //$('#lunch_fee').html(result.mealPricesList[1].price);
                    //$('#dinner_fee').html(result.mealPricesList[2].price);
                    //$('#am_snack_fee').html(result.mealPricesList[3].price);
                    //$('#pm_snack_fee').html(result.mealPricesList[4].price);

                    //$('#number_of_people_b').html("(" + result.mealCountAndTotalCost[0].BreakfastCount + ")");
                    //$('#number_of_people_l').html("(" + result.mealCountAndTotalCost[0].LunchCount + ")");
                    //$('#number_of_people_d').html("(" + result.mealCountAndTotalCost[0].DinnerCount + ")");
                    //$('#number_of_people_am').html("(" + result.mealCountAndTotalCost[0].MorningSnackCount + ")");
                    //$('#number_of_people_pm').html("(" + result.mealCountAndTotalCost[0].AfternoonSnackCount + ")");
                    //$('#meals_cost').html(result.mealCountAndTotalCost[0].BreakfastCount + result.mealCountAndTotalCost[0].LunchCost +
                    //    result.mealCountAndTotalCost[0].DinnerCost + result.mealCountAndTotalCost[0].MorningSnackCost + result.mealCountAndTotalCost[0].AfternoonSnackCost);

                    //$('#car_fee').html(result.airportTransportationFee[0].Price);
                    //$('#mini_van_fee').html(result.airportTransportationFee[1].Price);
                    //$('#van_fee').html(result.airportTransportationFee[2].Price);

                    //$('#number_of_people_car').html("(" + result.atBookingAndCosts[0].NumberOfBooking + ")");
                    //$('#number_of_people_minivan').html("(" + result.atBookingAndCosts[1].NumberOfBooking + ")");
                    //$('#number_of_people_van').html("(" + result.atBookingAndCosts[2].NumberOfBooking + ")");

                    //$('#transportation_cost').html((result.atBookingAndCosts[0].NumberOfBooking * result.airportTransportationFee[0].Price) +
                    //    (result.atBookingAndCosts[1].NumberOfBooking * result.airportTransportationFee[1].Price) +
                    //    (result.atBookingAndCosts[2].NumberOfBooking * result.airportTransportationFee[2].Price));

                    //$('#dt_mn_car_fee').html(result.dtPricesAndDestination[0].Price);
                    //$('#dt_mn_mini_van_fee').html(result.dtPricesAndDestination[1].Price);
                    //$('#dt_mn_van_fee').html(result.dtPricesAndDestination[2].Price);

                    //$('#dt_mk_car_fee').html(result.dtPricesAndDestination[3].Price);
                    //$('#dt_mk_mini_van_fee').html(result.dtPricesAndDestination[4].Price);
                    //$('#dt_mk_van_fee').html(result.dtPricesAndDestination[5].Price);

                    //$('#dt_pa_car_fee').html(result.dtPricesAndDestination[6].Price);
                    //$('#dt_pa_mini_van_fee').html(result.dtPricesAndDestination[7].Price);
                    //$('#dt_pa_van_fee').html(result.dtPricesAndDestination[8].Price);

                    $('#enrollees_modal').modal();

                    //signalR.client.updateOffSiteAccommodationFee = function (courseFee, onSiteAccommodationFee) {
                    //    $('#course_fee').html(courseFee);
                    //    alert(courseFee * data.length);
                    //    $('#course_total_cost').html(courseFee * data.length);
                  
                    //    
                    //};

                    //$.connection.hub.start().done(function () {
                    //    signalR.server.updateOffSiteAccommodationTotalFee(result.courseFee, result.onSiteAccomodationTotalCost, signalR.connection.id);
                    //});

                }
            });
        }
    });
});
var myEnrolledCrewTable = "";
var enrollThisCrewParameters = [];

var crewNameToBeEnrolled = "";
var crewNameToBeEnrolledContact = "";

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
                //$('#modal_success .modal-body p').html('Crew is successfully enrolled.');
                //$('#modal_success').modal();

                generateSuccessModal("crew_enrolled_modal", 2, "", "Crew is successfully enrolled.")


                if ($('.content-wrapper .content-header h1').html() == "Course Booking") {
                    var newRow = myEnrolledCrewTable.row.add([
                        enrollThisCrewParameters[1],
                        enrollThisCrewParameters[2],
                        crewNameToBeEnrolled,
                        "<button id='swap_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-exchange'></i></button><button id='remove_crew' class='btn btn-default' style='width: 50%'><i class='fa fa-times'></i></button>",
                        myEnrolledCrewTable.rows().count() + 1
                    ]).draw(false);

                    newRow.nodes().to$().css({ 'background-color': 'lightgreen' });
                }

            } else if (result.data === 0) {
                //$('#enroll_warning .modal-body p').html('This crew is already enrolled in this schedule.');
                //$('#enroll_warning').modal();
                generateWarningModal("crew_already_enrolled_warning", 2, "", "This crew is already enrolled in this schedule.")
            } else {
                generateDangerModal("enroll_this_crew_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                //$('.modal-danger').modal();
            }
        }
    });
}

function formatDate(data) {
    
    if (data == null) {
        return "";
    }

    if (data.includes("Date")) {
        let result = data.replace(/[^0-9 +]/g, '');

        let fdate = new Date(parseInt(result));

        return fdate.getDate() + " " + monthNames[fdate.getMonth()] + " " + fdate.getFullYear();
    } else {
        let fdate = new Date(data.split('T')[0]);

        return fdate.getDate() + " " + monthNames[fdate.getMonth()] + " " + fdate.getFullYear();
    }

}

function saveAccomodation(parameters) {
    $.ajax({
        url: '/SAMPortal/Forms/SaveAccomodation',
        type: 'post',
        dataType: 'json',
        beforeSend: function () {
            $.blockUI({ message: null });
        },
        data: { parameters: parameters },
        success: function (result) {
            $.unblockUI();
            if (result.data === 1) {
                generateSuccessModal("save_accomodation_success", 2, "", "Accommodation Request Successful!");

            } else if (result.data == "Rooms") {
                var fixedFormatting = result.data2.substring(0, result.data2.length - 2);
                generateWarningModal("rooms_full_warning", 2, "", "Reservation was not successful. Rooms are full during this/these date/s: " + fixedFormatting)

            } else if (result.data == "Duplicates") {
                var data = result.data2;
                var content = "";
                for (var i = 0; i < data.length; i++) {
                    content += "<tr><td>" + data[i].Mnno + "</td><td>" + data[i].Rank + "</td><td>" + (data[i].LastName + ", " + data[i].FirstName) + "</td><td>" + (data[i].ReservationType == 1 ? "New Booking" : "Extension") +
                        "</td><td>" + (data[i].RoomType == 1 ? "Dorm - Standard" : "Dorm - Superior") + "</td><td>" + formatDate(data[i].CheckInDate) + "</td><td>" + formatDate(data[i].CheckOutDate) + "</td><td>" + data[i].Status + "</td></tr>";
                }
                  
                $('#duplicate_booking_modal .modal-body p').html("Our system found out that there is already an existing reservation in our database.");
                $('#duplicate_booking_modal_tbl tbody').html(content);
                $('#duplicate_booking_modal').modal();

            } else {
                generateDangerModal("save_accommodation_error", "Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

            }

            $('#modal_warning_accommodation_submit_yes').attr('disabled', false);

        }
    });
}

function fixDateFormat(date) {
    let dateSplit = date.split('-');
    return dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
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