$(document).ready(function () {

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#administration').find('span').css('color', 'white');

    if (!$('#management_lnk').parent().hasClass('active')) {
        $('#management_lnk').parent().addClass('active menu-open');
        $('#management_lnk').next().show();
    }

    //===set breadcrumbs
    $('.content-header h1').html("Administration");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Administration");
    //===

    $('#administration').parent().addClass('active');
    getPartialOfGenerateLink();
    getPartialOfReviewRegisteredAccounts();
    getPartialOfReviewNewCrewRequest();
    getPartialOfOffSiteAccomodationRequests();
    getPartialOfReviewTransportationRequests();
    getPartialOfReviewSpecialScheduleRequests();
    getSpecialScheduleRequests();
    getDormFees();

    var table = "";
    var transportationTable = "";
    var recordId;
    var gOffSiteStatusId;
    var gOffSiteRecordId;
    var tempMNNO;

    var clickedButton = "";

    function getPartialOfGenerateLink() {
        var id = "generatelink";
        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfGenerateLink',
            type: 'get',
            success: function (result) {

                $('#generate_link').html(result);

                $('#companies_dropdown').select2({ theme: "bootstrap", placeholder: "Select Company" });

                $('.select2-container--bootstrap .select2-selection--single').css({'padding-top': '10px', 'border-radius' : '0px'});

            }
        });
    }

    function getPartialOfReviewTransportationRequests() {
        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfReviewTransportationRequests',
            type: 'get',
            success: function (result) {
                $('#transportation_div').html(result);
            },
            complete: function () {
                getTransportationRequests();
            }
        });
    }

    $(document).on('click', '#refresh_transportation_btn', function () {
        getTransportationRequests();
    });

    function getPartialOfOffSiteAccomodationRequests() {
        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfOffSiteAccommodationRequest',
            type: 'get',
            success: function (result) {
                $('#review_off_site_accomodation').html(result);

            }, complete: function () {
                getOffSiteAccommodationRequest();
            }
        });
    }

    $(document).on('click', '#refresh_off_site_accomodation_btn', function () {
        getOffSiteAccommodationRequest();
    });

    var offSiteAccommodationTable = "";

    function getOffSiteAccommodationRequest() {
        $.ajax({
            url: '/SAMPortal/api/Administration/GetOffSiteAccommodationRequest',
            type: 'get',
            success: function (result) {
                var content = "";

                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var modeOfPayment = result[i].ModeOfPayment === 0 ? "Company Sponsored" : "Personal Account";
                        var name = result[i].LastName + ", " + result[i].FirstName;
                        var room = result[i].RoomType === 1 ? "Single (Deluxe Room)" : "Double (Deluxe Room)";

                        content += "<tr><td><a id='" + result[i].Id + "'>" + result[i].MNNO + "</a></td><td>" + result[i].Rank + "</td><td>" + name + "</td><td>" + result[i].HotelName + "</td><td>" + room + "</td>" +
                            "<td>" + fixDateFormat(result[i].CheckInDate.split('T')[0]) + "</td><td>" + fixDateFormat(result[i].CheckOutDate.split('T')[0]) + "</td><td>" + result[i].CompanyName + "</td><td>" + modeOfPayment + "</td><td>" + result[i].BookerRemarks + "</td></tr>";
                    }
                } else {
                    if (offSiteAccommodationTable !== "") {
                        content = "<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >No data available in table</td></tr>";
                    }
                }

                $("#off_site_accomodation_tbl_body").html(content);

                if (offSiteAccommodationTable === "" ) {
                    offSiteAccommodationTable = $("#off_site_accomodation_tbl").DataTable();

                } 
                //else {
                //    offSiteAccommodationTable.draw(false);
                //}

                $("#off_site_accomodation_tbl").css('width', 'inherit');
            }
        });
    }

    function getPartialOfReviewRegisteredAccounts() {

        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfReviewRegisteredAccounts',
            type: 'get',
            success: function (result) {

                $('#review_registered_accounts').html(result);
            }
        });
    }

    function getPartialOfReviewNewCrewRequest() {
        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfReviewNewCrewRequest',
            type: 'get',
            success: function (result) {

                $('#review_new_crew_tbl').html(result);
            }, complete: function () {
                getNewCrewRequest();
            }
        });
    }

    function getNewCrewRequest() {
        $.ajax({
            url: '/SAMPortal/api/Administration/GetNewCrewRequest',
            type: 'get',
            beforeSend: function () {
                $('#crew_list_tbl_tbody').html("<tr><td style='text-align: center' colspan='11' valign='top' >Please wait while loading the data...</td></tr>");
            },
            success: function (result) {
                if (table != "") {
                    table.destroy();
                }

                var content = "";
                for (var i = 0; i < result.length; i++) {
                    content += "<tr id='" + result[i].Id + "'><td>" + result[i].Position + "</td><td>" + result[i].MNNO + "</td><td><a id='" + result[i].Position + "~" + result[i].LastName + "~" + result[i].FirstName + "~" + result[i].MiddleInitial + "'>" + result[i].LastName + ", " + result[i].FirstName + " " + result[i].MiddleInitial + "</a></td>" +
                        "<td id='" + result[i].Birthday + "'>" + formatDate(result[i].Birthday) + "</td><td>" + result[i].BirthPlace + "</td><td>" + result[i].CompanyName + "</td>" +
                        "<td style='padding: 1px'><button title='Approve' id='approve_btn' style='width: 50%' class='btn btn-default'><i class='fa fa-check form-group'></i></button><button title='Deny' id='deny_btn' style='width: 50%' class='btn btn-default'><i class='fa fa-close form-group'></button></td></tr> ";
                }
                //<input id='approve_btn' class='btn btn-default' type='button' value='Approve' />&nbsp;<input id='deny_btn' class='btn btn-default' type=button value='Deny' />

                $('#crew_list_tbl_tbody').html(content);

                table = $('#crew_list_tbl').DataTable({
                    "columnDefs": [
                        {
                            "targets": [5],
                            "visible": true,
                            "searchable": false,
                            "orderable": false
                        }
                    ]
                });

                $('#crew_list_tbl').css('width', 'inherit');

            }
        });
    }

    $(document).on('click', '#crew_list_tbl_tbody tr td a', function () {
        var imageName = $(this).attr('id');
        var imageNameSplit = imageName.split('~');
        var crewName = imageNameSplit[1] + ", " + imageNameSplit[2] + " " + imageNameSplit[3];
        var row = $(this).parent().parent();
        var recordId = $(this).parent().parent().attr('id');

        $('.modal_picture .modal-title').html(crewName);

        $.ajax({
            url: '/SAMPortal/api/Administration/GetNewCrewPicture',
            dataType: 'JSON',
            type: 'GET',
            data: { recordId: recordId },
            success: function (result) {
                src = result[0].Picture;
                //fileType = result[0].FileType;

                if (src === null) {
                    $('.modal_picture .modal-body div').html('<p style="text-align: center">No photo to show</p>');
                } else {
                    $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/jpeg;base64,' + src + '" /><br /><p>This photo will not be the official photo of the crew</p>');
                }
            },
            complete: function () {
                $('.modal_picture').modal();
            }
        });

    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    function formatDate(data, redirect) {

        if (data == null) {
            return "";
        }

        if (redirect) {
            return data.replace(/\//g, "-");
        }

        var result = data.replace(/[^0-9 +]/g, '');

        var date = new Date(data);

        return date.getDate() + "." + monthNames[date.getMonth()] + "." + date.getFullYear();
    }
    var tr = "";
    var clickedApproveButton = "";
    $(document).on('click', '#approve_btn', function () {
        clickedApproveButton = $(this);
        tr = $(this).parent().parent();
        recordId = tr.attr('id');

        $('#modal_approve_crew_request .modal-body p').html("Are you sure you want to approve this request?");
        $('#modal_approve_crew_request').modal();
    });

    $(document).on('click', '#modal_approve_crew_request_yes', function () {

        var rankPlusName = tr.find('td:eq(2) a').attr('id').split('~');
        var lastName = rankPlusName[1];
        var firstName = rankPlusName[2];
        var middleInitial = rankPlusName[3];
        //var rank = clickedApproveButton.parent().prev().prev().prev().prev().prev().prev().html();//table.row(tr).data()[0];
        var rank = clickedApproveButton.parent().prevAll().eq(5).html();
        var birthday = clickedApproveButton.parent().prevAll().eq(2).attr('id');
        var birthplace = clickedApproveButton.parent().prevAll().eq(1).html();
        var company = clickedApproveButton.parent().prev().html();

        var parameters = [rank, lastName, firstName, middleInitial, birthday, birthplace, company, recordId];

        $.ajax({
            url: '/SAMPortal/Administration/ApproveNewCrew',
            type: 'post',
            data: { parameters: parameters },
            success: function (result) {

                if (result.data == 1) {
                    $('#modal_success .modal-body p').html("Request successfully approved!");
                    $('#modal_success').modal();
                    getNewCrewRequest();
                } else {
                    $('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the IT Department.");
                    $('.modal-danger').modal();
                }
            }
        });
    });

    $('#modal_success').on('hidden.bs.modal', function () {
        if (clickedButton == 'save_dorm_fees') {
            getDormFees();
        } else if (clickedButton == "special_schedule_modal_yes" || clickedButton == "special_schedule_modal_deny_yes") {
            getSpecialScheduleRequests();
        }
    });

    $(document).on('click', '#refresh_dormitory_fees_btn', function () {
        getDormFees();
    });

    $(document).on('click', '#deny_btn', function () {
        var tableRow = $(this).parent().parent();
        tempMNNO = $(this).parent().prev().prev().prev().prev().prev().html();
        recordId = tableRow.attr('id');

        let rank = $(this).parent().prev().prev().prev().prev().prev().prev().html();
        let name = $(this).parent().prev().prev().prev().prev().children().html();
        let birthday = $(this).parent().prev().prev().prev().html();
        let birthplace = $(this).parent().prev().prev().html();
        let company = $(this).parent().prev().html();

        let message = "Are you sure you want to Deny this request?<br /><br />Rank: " + rank + "<br />Name: " + name + "<br />Birthday: " + birthday + "<br />Birthpace: " + birthplace + "<br />Company: " + company;

        $('#modal-warning .modal-body p').html(message);
        $('#modal-warning').modal();
    });

    $(document).on('click', '#refresh_new_crew_tbl', function () {
        getNewCrewRequest();

    });

    $(document).on('click', '#modal_yes', function () {

        let message = "Are you REALLY sure that you want to Deny this request?<br />Please be informed that once you press YES, this request will be deleted and will never be retrieved from the database";

        $('#modal-second-warning .modal-body p').html(message);
        $('#modal-second-warning').modal();
    });

    $(document).on('click', '#modal_yes_second', function () {
        $.ajax({
            url: '/SAMPortal/Administration/DenyNewCrew',
            type: 'post',
            data: { recordId: recordId, tempMNNO: tempMNNO },
            success: function (result) {
                if (result.data == 1) {
                    //$('#modal_success .modal-body p').html("Request denied!");
                    //$('#modal_success').modal();
                    generateSuccessModal("deny_new_crew_request_modal", 2, "", "The REQUEST has been successfully DENIED!");
                    getNewCrewRequest();
                } else {
                    //call modal stating that something went wrong
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the IT Department.");
                    //$('.modal-danger').modal();
                    generateDangerModal("deny_new_crew_request_modal", "Sorry for the inconvenience. Please send this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the IT Department.");
                }
            }
        });
    });

    $(document).on('click', '#off_site_accomodation_tbl_body tr td a', function () {
        var id = $(this).attr('id');

        $('#review_off_site_accommodation_modal').modal();
        $.ajax({
            url: '/SAMPortal/api/Administration/GetAccomodationDetailsById',
            type: 'get',
            data: { id: id },
            success: function (result) {
                var content = "";
                var Id = result[0].Id;
                //for (var i = 0; i <= result.length; i++) {
                content += "<label class='radio-inline'><input type='radio' record_id='" + Id + "' class='off_site_accommodation_radio' name='optradio' value='2' />Arranged</label>" +
                    "<label class='radio-inline'><input type='radio' record_id='" + Id + "' class='off_site_accommodation_radio' name='optradio' value='3' />Billed</label>" +
                    "<label class='radio-inline'><input type='radio' record_id='" + Id + "' class='off_site_accommodation_radio' name='optradio' value='4' />Paid</label>" +
                    "<label class='radio-inline'><input type='radio' record_id='" + Id + "' class='off_site_accommodation_radio' name='optradio' value='5' />Personal Account</label>" + 
                    "<label class='radio-inline'><input type='radio' record_id='" + Id + "' class='off_site_accommodation_radio' name='optradio' value='6' />Cancelled</label>";

                $('#review_off_site_accommodation_modal .modal-body form').html(content);
                //$('#off_site_modal_form .radio-inline').css('padding-left', '50px');


                if (result[0].Status === 3) {
                    $('input[name=optradio]')[1].checked = true;
                } else if (result[0].Status === 4) {
                    $('input[name=optradio]')[2].checked = true;
                } else if (result[0].Status === 5) {
                    $('input[name=optradio]')[3].checked = true;
                } else if (result[0].Status === 2) {
                    $('input[name=optradio]')[0].checked = true;
                } else if (result[0].Status === 6) {
                    $('input[name=optradio]')[4].checked = true;
                }

                $('#reason_of_stay_input').val(result[0].ReasonOfStay);
                $('#reason_of_stay_input').attr('disabled', true);
                $('#admin_remarks').val(result[0].Remarks);
            }
        });
    });

    $(document).on('click', '.off_site_accommodation_radio', function () {
        gOffSiteStatusId = $(this).val();
        gOffSiteRecordId = $(this).attr('record_id');

    });

    var adminRemarks = "";
    $(document).on('click', '#off_site_accommodation_save_btn', function () {

        adminRemarks = $('#admin_remarks').val();

        $('#modal_warning_review_offsite_accommodation .modal-body p').html("Are you sure you want to update this record?");
        $('#modal_warning_review_offsite_accommodation').modal();
    });

    $(document).on('click', '#modal_warning_review_offsite_accommodation_yes', function () {

        $.ajax({
            url: '/SAMPortal/Administration/UpdateOffSiteStatusId',
            type: 'get',
            data: { statusId: gOffSiteStatusId, recordId: gOffSiteRecordId, adminRemarks: adminRemarks },
            success: function (result) {
                $('#review_off_site_accommodation_modal').modal('hide');
                if (result.data === 1) {
                    $('#modal_success .modal-body p').html("Update record successfully!");
                    $('#modal_success').modal();

                    getOffSiteAccommodationRequest();
                } else {
                    $('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the IT Department.");
                    $('.modal-danger').modal();
                }
            }
        });
    });

    var transportationRequestRecordId = "";

    $(document).on('click', '#transportation_confirm_btn', function () {

        $('#modal_complete_transportation_modal .modal-body p').html('Are you sure you want to mark this item as Complete?');
        $('#modal_complete_transportation_modal').modal();
    });

    $(document).on('click', '#modal_complete_transportation_modal_yes', function () {

        $.ajax({
            url: '/SAMPortal/Administration/CompleteTransportationRequest',
            type: 'get',
            data: { recordId: transportationRequestRecordId },
            success: function (result) {
                if (result.data == 1) {
                    $('#modal_transpo_completed_modal').modal();
                } else {
                    $('#modal_complete_transportation_modal  .modal-body p').html('Something went wrong, please try again and if the problem persists please contact the Sales and Marketing Team.');
                    $('#modal_complete_transportation_modal ').modal();

                }
            }
        });
    });

    $(document).on('click', '#moda_transpo_completed_modal_yes', function () {
        getTransportationRequests();
    });

    function getTransportationRequests() {
        $.ajax({
            url: '/SAMPortal/api/Administration/GetTransportationRequests',
            type: 'get',
            success: function (result) {
                if (transportationTable != "") {
                    transportationTable.destroy();
                }

                var content = "";
                var data = result;
                var style = "";

                for (var i = 0; i < data.length; i++) {
                    if (data[i].Status == "Requested") {
                        style = "color: red";
                    } else {
                        style = "color: green";
                    }

                    content += '<tr style="' + style + '"><td><a id="detailed_view" name="' + data[i].Id + '">' + data[i].Mnno + '</a></td><td>' + data[i].Rank + '</td><td>' + data[i].LastName + ', ' + data[i].FirstName + '</td><td>' + data[i].Type + '</td>' +
                        '<td>' + data[i].Vehicle + '</td><td>' + (data[i].DateBooked.split('T')[0] + " " + data[i].DateBooked.split('T')[1]) + '</td><td style="padding: 1px" id="' + data[i].Id + '"><button title="View Attachment" style="width: 100%" id="view_attachment" class="btn btn-default"><i class="fa fa-paperclip"></i></button></td></tr>';
                }

                $('#review_transportation_tbl_body').html(content);

                transportationTable = $('#review_transportation_tbl').DataTable({
                    "order": [],
                    "columnDefs": [{
                        "targets": [7],
                        "searchable": false,
                        "orderable": false
                    }]
                });
                   
                $('#review_transportation_tbl').css('width', 'inherit');
            }
        });
    }

    $(document).on('click', '#review_transportation_tbl_body tr td #detailed_view', function () {
        //var row = $(this).parent().parent();
        transportationRequestRecordId = $(this).attr('name');
        var mnno = $(this).html();
        var name = $(this).parent().next().next().html();
        var vehicle = $(this).parent().next().next().next().next().html();
        var type = $(this).parent().next().next().next().html();
        $.ajax({
            url: '/SAMPortal/api/Administration/GetTransportationRequestById',
            type: 'get',
            dataType: 'json',
            data: { recordId: transportationRequestRecordId },
            success: function (result) {
                $('.modal_transportation .modal-body #company').html(result[0].CompanyName);
                $('.modal_transportation .modal-body #type').html(type);
                $('.modal_transportation .modal-body #vehicle').html(vehicle);
                $('.modal_transportation .modal-body #inbound').html(result[0].Inbound === 0 ? "No" : "Yes");
                $('.modal_transportation .modal-body #outbound').html(result[0].Outbound === 0 ? "No" : "Yes");
                $('.modal_transportation .modal-body #onetrip').html(result[0].OneTrip === 0 ? "No" : "Yes");
                $('.modal_transportation .modal-body #twotrips').html(result[0].TwoTrips === 0 ? "No" : "Yes");
                $('.modal_transportation .modal-body #pickup').html(result[0].PickUp === "" ? "N/A" : result[0].PickUp);
                $('.modal_transportation .modal-body #dt_pickup').html(result[0].DateTimeOfPickUp === "" ? "N/A" : result[0].DateTimeOfPickUp);
                $('.modal_transportation .modal-body #dropoff').html(result[0].DropOff === "" ? "N/A" : result[0].DropOff);
                $('.modal_transportation .modal-body #pickup_2').html(result[0].SecondPickUp === "" ? "N/A" : result[0].SecondPickUp);
                $('.modal_transportation .modal-body #dt_pickup_2').html(result[0].SecondDateTimeOfPickUp === "" ? "N/A" : result[0].SecondDateTimeOfPickUp);
                $('.modal_transportation .modal-body #dropoff_2').html(result[0].SecondDropOff === "" ? "N/A" : result[0].SecondDropOff);
                $('.modal_transportation .modal-body #notes').val(result[0].Notes === "" ? "N/A" : result[0].Notes);

                if (type === "Airport Transfer") {
                    $('#one_trip_div').css('display', 'none');
                    $('#two_trips_div').css('display', 'none');
                    $('#pick_up_div').css('display', 'none');
                    $('#dt_div').css('display', 'none');
                    $('#drop_off_div').css('display', 'none');
                    $('#second_pick_up_div').css('display', 'none');
                    $('#dt_2_div').css('display', 'none');
                    $('#second_drop_off_div').css('display', 'none');

                    $('#inbound_div').css('display', 'block');
                    $('#outbound_div').css('display', 'block');
                } else {
                    $('#inbound_div').css('display', 'none');
                    $('#outbound_div').css('display', 'none');

                    $('#one_trip_div').css('display', 'block');
                    $('#two_trips_div').css('display', 'block');
                    $('#pick_up_div').css('display', 'block');
                    $('#dt_div').css('display', 'block');
                    $('#drop_off_div').css('display', 'block');
                    $('#second_pick_up_div').css('display', 'block');
                    $('#dt_2_div').css('display', 'block');
                    $('#second_drop_off_div').css('display', 'block');
                }

                $('.modal_transportation .modal-title').html(mnno + " - " + name);
                $('.modal_transportation').modal();
            }
        });
    });

    $(document).on('click', '#review_transportation_tbl_body tr td #view_attachment', function () {
        $('.modal_picture .modal-body div').html("");
        var recordId = $(this).parent().attr('id');
        var src = "";
        var fileType = "";

        $.ajax({
            url: '/SAMPortal/api/Administration/GetTransportationAttachment',
            dataType: 'JSON',
            type: 'GET',
            data: { recordId: recordId },
            success: function (result) {
                src = result[0].Picture;
                fileType = result[0].FileType;

                $('.modal_picture .modal-title').html();
                if (src !== null && src !== "" && src !== "null") {
                    if (fileType === "pdf" || fileType === "PDF") {
                        $('.modal_picture .modal-body div').html('<embed src="data:application/pdf;base64,' + src + '" frameborder="0" width="100%" height="400px">');
                    } else if (fileType === "jpg" || fileType === "jpeg" || fileType === "JPG") {
                        $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/jpeg;base64,' + src + '" />');
                    } else if (fileType === "png" || fileType === "PNG") {
                        $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/png;base64,' + src + '" />');
                    }

                } else {
                    $('.modal_picture .modal-body div').html('<p style="text-align: center">No data to show</p>');
                }
            },
            complete: function () {
                $('.modal_picture').modal();
            }
        });
    });




    $(document).on('click', '#refresh_special_schedule_requests_tbl', function () {
        getSpecialScheduleRequests();
    });

    var specialScheduleTable = "";
    function getSpecialScheduleRequests() {
        $.ajax({
            url: '/SAMPortal/api/Administration/GetSpecialScheduleRequests',
            dataType: 'JSON',
            type: 'GET',
            beforeSend: function () {
                $('#review_special_schedule_requests_tbl tbody').html("<tr><td style='text-align: center' colspan='11' valign='top' >Please wait while loading the data...</td></tr>");
            },
            success: function (result) {
                if (specialScheduleTable != "") {
                    specialScheduleTable.destroy();
                }

                var content = "";

                for (var i = 0; i < result.length; i++) {
                    content += "<tr id='" + result[i].Id + "'><td>" + result[i].CourseName + "</td><td>" + fixDateFormat(result[i].StartDate.split('T')[0]) + "</td><td>" + result[i].NumberOfParticipants + "</td><td>" + result[i].Notes + "</td>" +
                        "<td>" + fixDateFormat(result[i].DateRequested.split('T')[0]) + "</td><td>" + result[i].RequestedBy + "</td><td style='padding: 1px'><button title='Approve' id='special_schedule_approve_btn' style='width: 50%' class='btn btn-default'><i class='fa fa-check form-group'></i></button><button title='Deny' id='special_schedule_deny_btn' style='width: 50%' class='btn btn-default'><i class='fa fa-close form-group'></button></td></tr>";
                }

                $('#review_special_schedule_requests_tbl tbody').html(content);

                specialScheduleTable = $('#review_special_schedule_requests_tbl').DataTable();

                $('#review_special_schedule_requests_tbl').css('width', 'inherit');
            }
        });
    }

    function getPartialOfReviewSpecialScheduleRequests() {
        $.ajax({
            url: '/SAMPortal/Administration/GetPartialOfReviewSpecialScheduleRequests/',
            type: 'GET',
            success: function (result) {
                $('#special_schedule_requests_tbl').html(result);
            }
        });
    }

    var specialScheduleId = "";
    $(document).on('click', '#special_schedule_approve_btn', function () {

        specialScheduleId = $(this).parent().parent().attr('id');

        $('#special_schedule_modal .modal-body p').html('Are you sure you want to approve this request?');
        $('#special_schedule_modal').modal();
    });

    $(document).on('click', '#special_schedule_deny_btn', function () {
        specialScheduleId = $(this).parent().parent().attr('id');

        $('#special_schedule_modal_deny .modal-body p').html('Are you sure you want to deny this request?');
        $('#special_schedule_modal_deny').modal();
    });

    $(document).on('click', '#special_schedule_modal_deny_yes', function () {
        
        $.ajax({
            url: '/SAMPortal/Administration/DenySpecialSchedule',
            type: 'POST',
            dataType: 'JSON',
            data: { recordId: specialScheduleId },
            success: function (result) {
                if (result.data == 1) {
                    //$('#modal_success .modal-body p').html('Request has been Denied!');
                    //$('#modal_success').modal();
                    generateSuccessModal("deny_special_schedule", 2, "", "The REQUEST has been successfully DENIED!");
                }
            }
        });

        clickedButton = "special_schedule_modal_deny_yes";
    });

    $(document).on('click', '#special_schedule_modal_yes', function () {
        $.ajax({
            url: '/SAMPortal/Administration/ApproveSpecialSchedule',
            type: 'POST',
            dataType: 'JSON', 
            data: { recordId: specialScheduleId },
            success: function (result) {
                if (result.data == 1) {
                    //$('#modal_success .modal-body p').html('Request successfuly apprpoved!');
                    //$('#modal_success').modal();
                    generateSuccessModal("approve_special_schedule", 2, "", "The REQUEST has been successfully APPROVED!");

                } else if (result.status == "Error") {
                    generateDangerModal("save_new_crew_error_modal", "Please send the this error ID (" + (result.logId == null || result.logId == "" ? "000" : result.logId) + ") to IT Department for investigation.");
                }
            }
        });

        clickedButton = "special_schedule_modal_yes";
    });

    function getDormFees() {
        $.ajax({
            url: '/SAMPortal/api/Administration/GetDormFees',
            dataType: 'json',
            type: 'get',
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Id == "1") {
                        $("#dorm_standard").val(data[i].Price);
                    } else if (data[i].Id == "2") {
                        $("#dorm_superior").val(data[i].Price);
                    } else if (data[i].Id == "3") {
                        $("#hotel_double").val(data[i].Price);
                    } else if (data[i].Id == "4") {
                        $("#hotel_single").val(data[i].Price);
                    } else if (data[i].Id == "5") {
                        $("#executive_room").val(data[i].Price);
                    }
                }
            }
        });
    }

    $(document).on('click', '#update_dormitory_modal_yes', function () {
        var dormStandard = $("#dorm_standard").val();
        var dormSuperior = $("#dorm_superior").val();
        var hotelDouble = $("#hotel_double").val();
        var hotelSingle = $("#hotel_single").val();
        var executiveRoom = $("#executive_room").val();

        //if (!Number.isInteger(dormStandard) || !Number.isInteger(dormSuperior) || !Number.isInteger(hotelDouble) || !Number.isInteger(hotelSingle) || !Number.isInteger(executiveRoom)) {
        //    alert(1);
        //    $('#valid_number_warning').modal();
        //    return false;
        //}

        $.ajax({
            url: '/SAMPortal/Administration/SaveDormFees',
            dataType: 'json',
            type: 'post',
            data: { dormStandard: dormStandard, dormSuperior: dormSuperior, hotelDouble: hotelDouble, hotelSingle: hotelSingle, executiveRoom: executiveRoom },
            success: function (result) {
                var data = result.data;

                if (result.data == 1) {
                    $('#modal_success .modal-body p').html('Changes have been successfully saved!');
                    $('#modal_success').modal();
                } else {
                    $('.modal-danger .modal-body p').html('Please contact the IT department and send the error ID (' + result.data + ') to them.');
                    $('.modal-danger').modal();
                }
            }
        });
    });

    $(document).on('click', '#save_dorm_fees', function () {
        var dormStandard = $("#dorm_standard").val();
        var dormSuperior = $("#dorm_superior").val();
        var hotelDouble = $("#hotel_double").val();
        var hotelSingle = $("#hotel_single").val();
        var executiveRoom = $("#executive_room").val();

        if ($.isNumeric(dormStandard) && $.isNumeric(dormSuperior) && $.isNumeric(hotelDouble)
            && $.isNumeric(hotelSingle) && $.isNumeric(executiveRoom)) {

            $('#update_dormitory_modal .modal-body p').html("Are you sure you want to save the changes you made?");
            $('#update_dormitory_modal').modal();

        } else {
            $('#valid_number_warning').modal();
            return false;
        }

        clickedButton = 'save_dorm_fees';
    });
});