$(document).ready(function () {

    $('.custom_treeview-menu').find('span').css('color', '#b8c7ce');
    $('#requests_link').find('span').css('color', 'white');

    if (!$('#management_lnk').parent().hasClass('active')) {
        $('#management_lnk').parent().addClass('active menu-open');
        $('#management_lnk').next().show();
    }


    //===set breadcrumbs
    $('.content-header h1').html("Requests");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Requests");
    //===

    $('#requests_link').parent().addClass('active');

    var table = "";

    getNewCrewRequest();
    getSpecialScheduleRequests();
    getOffSiteAccommodationRequests();
    getTransportationRequests();
    getOnSiteAccommodationRequests();

    $(document).on('click', '#new_crew_refresh_tbl', function () {
        getNewCrewRequest();
    });

    $(document).on('click', '#special_schedule_refresh_tbl', function () {
        getSpecialScheduleRequests();
    });

    $(document).on('click', '#on_site_accommodation_refresh_tbl', function () {
        getOnSiteAccommodationRequests();
    });

    $(document).on('click', '#off_site_accommodation_refresh_tbl', function () {
        getOffSiteAccommodationRequests();
    });

    $(document).on('click', '#transportation_refresh_tbl', function () {
        getTransportationRequests();
    });

    function getNewCrewRequest() {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetNewCrewRequestFromRequests',
            type: 'get',
            beforeSend: function () {
                $('#crew_list_requests_tbl_tbody').html("<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >Loading please wait...</td></tr>");
            },
            success: function (result) {
                if (table !== "") {
                    table.destroy();
                }

                var content = "";
                var requestStatus = "";

                for (var i = 0; i < result.length; i++) {
                    if (result[i].Status == 1) {
                        requestStatus = "In Process";
                    } else if (result[i].Status == 2) {
                        requestStatus = "Approved";
                    } else {
                        requestStatus = "Denied";
                    }
                    content += "<tr id='" + result[i].Id + "'><td><a id='update_new_crew_request'>" + result[i].MNNO + "</a></td><td>" + result[i].Position + "</td><td><a id='" + result[i].Position + "~" + result[i].LastName + "~" + result[i].FirstName + "~" + result[i].MiddleInitial + "'>" + result[i].LastName + ", " + result[i].FirstName + " " + result[i].MiddleInitial + "</a></td>" +
                        "<td id='" + result[i].Birthday + "'>" + newCrewRequestsFormatDate(result[i].Birthday) + "</td><td>" + result[i].BirthPlace + "</td>" +
                        "<td>" + result[i].EnteredBy + "</td><td>" + requestStatus + "</td></tr> ";
                }

                $('#crew_list_requests_tbl_tbody').html(content);

                table = $('#crew_list_requests_tbl').DataTable();

                $('#crew_list_requests_tbl').css('width', 'inherit');
            }
        });
    }

    $(document).on('click', '#crew_list_requests_tbl_tbody tr td:nth-child(3) a', function () {
        var recordId = $(this).parent().parent().attr('id');
        var imageName = $(this).attr('id');
        var imageNameSplit = imageName.split('~');
        var crewName = imageNameSplit[1] + ", " + imageNameSplit[2] + " " + imageNameSplit[3];
        var row = $(this).parent().parent();
        var src = table.row(row).data()[8];

        $('.modal_picture .modal-title').html(crewName);

        $.ajax({
            url: '/SAMPortal/api/Administration/GetNewCrewPicture',
            dataType: 'JSON',
            type: 'GET',
            data: { recordId: recordId },
            success: function (result) {
                src = result[0].Picture;

                if (src == null || src == "null" || src == "") {
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

    var specialScheduleTable = "";
    function getSpecialScheduleRequests() {

        $.ajax({
            url: '/SAMPortal/api/CourseBooking/GetSpecialScheduleRequests',
            dataType: 'JSON',
            type: 'GET',
            beforeSend: function () {
                $('#special_schedule_requests_tbl tbody').html("<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >Loading please wait...</td></tr>");
            },
            success: function (result) {

                if (specialScheduleTable != "") {
                    specialScheduleTable.destroy();
                }
                var content = "";

                for (var i = 0; i < result.length; i++) {
                    var dateTime = result[i].DateRequested.split('T');
                    content += "<tr><td>" + result[i].CourseName + "</td><td>" + (result[i].StartDate.split('T')[0]) + "</td><td>" + result[i].NumberOfParticipants + "</td><td>" + result[i].Notes + "</td>" +
                        "<td>" + (dateTime[0] + ' ' + dateTime[1]) + "</td><td>" + result[i].RequestedBy + "</td><td>" + result[i].CompanyName + "</td><td>" + result[i].Status + "</td></tr>";
                }
                $('#special_schedule_requests_tbl tbody').html(content);

                specialScheduleTable = $('#special_schedule_requests_tbl').DataTable();

                $('#special_schedule_requests_tbl').css('width', 'inherit');
            }
        });
    }

    var offSiteAccommodationRequests = "";
    function getOffSiteAccommodationRequests() {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetOffSiteAccommodationRequests',
            dataType: 'JSON',
            type: 'GET',
            beforeSend: function () {
                $('#off_site_accommodation_requests_tbl tbody').html("<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >Loading please wait...</td></tr>");
            },
            success: function (result) {
                if (offSiteAccommodationRequests != "") {
                    offSiteAccommodationRequests.destroy();
                }

                var content = "";

                for (var i = 0; i < result.length; i++) {
                    content += "<tr><td>" + result[i].MNNO + "</td><td>" + result[i].Rank + "</td><td>" + (result[i].LastName + ", " + result[i].FirstName) + "</td><td>" + result[i].HotelName + "</td>" +
                        "<td>" + (result[i].RoomType == 1 ? "Single (deluxe room)" : "Double (deluxe room)") + "</td><td>" + result[i].CheckInDate.split('T')[0] + "</td><td>" + result[i].CheckOutDate.split('T')[0] + "</td>" +
                        "<td>" + (result[i].ModeOfPayment == 0 ? "Company Sponsored" : "Personal Account") + "</td><td>" + result[i].ReservationBy + "</td><td>" + result[i].Status + "</td><td>" + result[i].BookerRemarks + "</td></tr>";
                }

                $('#off_site_accommodation_requests_tbl tbody').html(content);

                offSiteAccommodationRequests = $('#off_site_accommodation_requests_tbl').DataTable();

                $('#off_site_accommodation_requests_tbl').css('width', 'inherit');
            }
        });
    }

    var transportationTable = "";
    function getTransportationRequests() {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetTransportationRequests',
            type: 'get',
            beforeSend: function () {
                $('#transportation_requests_tbl tbody').html("<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >Loading please wait...</td></tr>");
            },
            success: function (result) {

                if (transportationTable != "") {
                    transportationTable.destroy();
                }

                var content = "";
                var data = result;
                var style = "";

                for (var i = 0; i < data.length; i++) {
                    content += '<tr style="' + style + '"><td><a id="detailed_view" name="' + data[i].Id + '">' + data[i].Mnno + '</a></td><td>' + data[i].Rank + '</td><td>' + data[i].LastName + ', ' + data[i].FirstName + '</td><td>' + data[i].Type + '</td>' +
                        '<td>' + data[i].Vehicle + '</td><td>' + (fixDateFormat(data[i].DateBooked.split('T')[0]) + " " + data[i].DateBooked.split('T')[1]) + '</td><td>' + result[i].Status + '</td></tr>';
                }

                $('#transportation_requests_tbl tbody').html(content);

                transportationTable = $('#transportation_requests_tbl').DataTable();

                $('#transportation_requests_tbl').css('width', 'inherit');

            }
        });
    }

    var onSiteAccommodationRecordId = "";
    var e_accomodation_date = "";
    $(document).on('click', '#on_site_accommodation_requests_tbl tr td a', function () {
        onSiteAccommodationRecordId = $(this).attr('id');

        $.ajax({
            url: '/SAMPortal/api/Forms/GetOnSiteReservationById',
            type: 'get',
            dataType: 'json',
            data: { Id: onSiteAccommodationRecordId },
            success: function (result) {
                var e_name = result.LastName + ", " + result.FirstName;
                var e_date = formatDate(result.CheckInDate) + " - " + formatDate(result.CheckOutDate);

                $('#e_mnno_input').val(result.MNNO);
                $('#e_rank_input').val(result.Rank);
                $('#e_name_input').val(e_name);
                $('#e_reservation_type').val(result.ReservationType);
                $('#e_room_type').val(result.RoomType);
                $('#e_accomodation_date').daterangepicker({ startDate: newCrewRequestsFormatDate(result.CheckInDate), endDate: newCrewRequestsFormatDate(result.CheckOutDate) });
                $('#e_mode_of_payment').val(result.Payment);
                $('#e_accomodation_reason').val(result.Reason);
                $('#e_accomodation_remarks_input').val(result.Remarks);
            },
            complete: function () {
                e_accomodation_date = $('#e_accomodation_date').val();
                $('#edit_onsite_booking_modal').modal();
            }
        });
    });

    $(document).on('change', '#e_room_type', function () {
        if ($('#e_room_type option:selected').val() == 3) {
            $('#hotel_single_double_modal').modal();
        } else if ($('#e_room_type option:selected').val() == 4) {
            $('#hotel_single_double_modal').modal();
        }
    });

    $(document).on('click', '#e_save_accomodation_btn', function () {

        if ($('#e_room_type option:selected').val() == 3) {
            $('#hotel_single_double_modal').modal();
            return false;
        } else if ($('#e_room_type option:selected').val() == 4) {
            $('#hotel_single_double_modal').modal();
            return false;
        }

        var pReservationType = $('#e_reservation_type option:selected').val();
        var pRoomType = $('#e_room_type option:selected').val();

        var dates = $('#e_accomodation_date').val().split(' - ');
        var pCheckInDate = dates[0];
        var pCheckOutDate = dates[1];
        var pPayment = $('#e_mode_of_payment option:selected').val();
        var pReason = $('#e_accomodation_reason option:selected').val();
        var pRemarks = $('#e_accomodation_remarks_input').val();

        var onSiteAccomodationParameters = [onSiteAccommodationRecordId, pReservationType, pRoomType, pCheckInDate, pCheckOutDate, pPayment, pReason, pRemarks];

        $.ajax({
            url: '/SAMPortal/Forms/UpdateOnSiteReservation',
            dataType: 'json',
            type: 'post',
            data: { parameters: onSiteAccomodationParameters },
            success: function (result) {
                if (result.data == 1) {
                    $('#modal_success .modal-body p').html("Reservation updated successfully!");
                    $('#modal_success').modal();
                } else if (result.data == "Rooms") {
                    var fixedFormatting = result.data2.substring(0, result.data2.length - 2);
                    $('#modal_warning_update_reservation .modal-body p').html("Reservation was not successful. Rooms are full during this/these date/s: " + fixedFormatting);
                    $('#modal_warning_update_reservation').modal();
                } else {
                    generateDangerModal("update_on_site_reservation_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + result.data + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }
            }
        });
    });

    function newCrewRequestsFormatDate(rawDate) {
        var data = rawDate.split('T')[0];
        var dataSplit = data.split('-');

        var year = dataSplit[0];
        var month = dataSplit[1];
        var day = dataSplit[2];

        return month + '/' + day + '/' + year;
    }

    var onSiteAccommodationRequests = "";
    function getOnSiteAccommodationRequests() {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetOnSiteAccommodationRequests',
            type: 'get',
            beforeSend: function () {
                $('#on_site_accommodation_requests_tbl tbody').html("<tr><td style='text-align: center; font-size: 15px' colspan='11' valign='top' >Loading please wait...</td></tr>");
            },
            success: function (result) {
                if (onSiteAccommodationRequests != "") {
                    onSiteAccommodationRequests.destroy();
                }

                var content = "";
                var data = result;

                for (var i = 0; i < data.length; i++) {

                    content += "<tr><td><a id='" + data[i].Id + "'>" + data[i].MNNO + "</a></td><td>" + data[i].Rank + "</td><td>" + (data[i].LastName + ", " + data[i].FirstName) + "</td><td>" + (data[i].ReservationType == 1 ? "New Booking" : "Extension") + "</td>" +
                        "<td>" + (data[i].RoomType == 1 ? "Dorm - Standard" : "Dorm - Superior") + "</td><td>" + data[i].CheckInDate.replace('T', ' ') + "</td><td>" + data[i].CheckOutDate.replace('T', ' ') + "</td><td>" + (data[i].Payment == 0 ? "Company Sponsored" : "Personal Account") + "</td><td>" + data[i].Status + "</td></tr> ";
                }

                $('#on_site_accommodation_requests_tbl tbody').html(content);

                onSiteAccommodationRequests = $('#on_site_accommodation_requests_tbl').DataTable();

                $("#on_site_accommodation_requests_tbl").css('width', 'inherit');

            }
        });
    }

    $(document).on('click', '#transportation_requests_tbl tbody tr td #detailed_view', function () {
        var row = $(this).parent().parent();
        transportationRequestRecordId = $(this).attr('name');
        var mnno = $(this).html();
        var name = transportationTable.row(row).data()[2];
        var vehicle = transportationTable.row(row).data()[4];
        var type = transportationTable.row(row).data()[3];
        $('.modal_daily_transportation table tbody').html('');

        $.ajax({
            url: '/SAMPortal/Forms/GetTransportationRequestById',
            type: 'get',
            dataType: 'json',
            data: { recordId: transportationRequestRecordId },
            success: function (result) {
                if (result.typeAndNotes.Type == "Daily Transfer") {
                    let content = "";

                    for (let i = 0; i < result.data.length; i++) {
                        let type = result.data[i].IsRoundTrip == 1 ? "Round-trip" : "One-way";
                        let pickUp = result.data[i].PickUpPlace;
                        let dropOff = result.data[i].DropOffPlace;
                        let dateTimePickUp = result.data[i].DateTimeOfPickUp;

                        let pickUp2 = result.data[i].SecondPickUpPlace;
                        let dropOff2 = result.data[i].SecondDropOffPlace;
                        let dateTimePickUp2 = result.data[i].SecondDateTimeOfPickUp;

                        content += "<tr><td>" + type + "</td><td>" + pickUp + "</td><td>" + dropOff + "</td><td>" + dateTimePickUp + "</td>" +
                            "<td>" + pickUp2 + "</td><td>" + dropOff2 + "</td><td>" + dateTimePickUp2 + "</td></tr>"
                    }

                    $('.modal_daily_transportation table tbody').append(content);
                    $('.modal_daily_transportation .modal-title').html(mnno + " - " + name);
                    $('.modal_daily_transportation .modal-body #notes').val(result.typeAndNotes.Notes);
                    $('.modal_daily_transportation').modal();

                } else if (result.typeAndNotes.Type == "Airport Transfer") {
                    let inbound = result.data.Inbound == 1 ? "Yes" : " No";
                    let outbound = result.data.Outbound == 1 ? "Yes" : " No";
                    let inboundDate = result.data.InboundDate === null ? "-----------------" : formatDate(result.data.InboundDate);
                    let outboundDate = result.data.OutboundDate === null ? "-----------------" : formatDate(result.data.OutboundDate);

                    $('.modal_airport_transportation .modal-body #inboundDate').html(inboundDate);
                    $('.modal_airport_transportation .modal-body #outboundDate').html(outboundDate);
                    $('.modal_airport_transportation .modal-body #notes').val(result.typeAndNotes.Notes);
                    $('.modal_airport_transportation .modal-body #attachment').html('<button title="View Attachment" id="view_attachment" rid="' + transportationRequestRecordId + '" class="btn btn-default"><i class="fa fa-paperclip"></i></button>');
                    //$('.modal_airport_transportation .modal-body #attachment').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/jpeg;base64,' + result.data.Attachment + '" />');

                    $('.modal_airport_transportation .modal-title').html(mnno + " - " + name);
                    $('.modal_airport_transportation').modal();
                }
                //$('.modal_transportation .modal-body #company').html(result[0].CompanyName);
                //$('.modal_transportation .modal-body #type').html(type);
                //$('.modal_transportation .modal-body #vehicle').html(vehicle);
                //$('.modal_transportation .modal-body #inbound').html(result[0].Inbound === 0 ? "No" : "Yes");
                //$('.modal_transportation .modal-body #outbound').html(result[0].Outbound === 0 ? "No" : "Yes");
                //$('.modal_transportation .modal-body #onetrip').html(result[0].OneTrip === 0 ? "No" : "Yes");
                //$('.modal_transportation .modal-body #twotrips').html(result[0].TwoTrips === 0 ? "No" : "Yes");
                //$('.modal_transportation .modal-body #pickup').html(result[0].PickUp === "" ? "N/A" : result[0].PickUp);
                //$('.modal_transportation .modal-body #dt_pickup').html(result[0].DateTimeOfPickUp === "" ? "N/A" : result[0].DateTimeOfPickUp);
                //$('.modal_transportation .modal-body #dropoff').html(result[0].DropOff === "" ? "N/A" : result[0].DropOff);
                //$('.modal_transportation .modal-body #pickup_2').html(result[0].SecondPickUp === "" ? "N/A" : result[0].SecondPickUp);
                //$('.modal_transportation .modal-body #dt_pickup_2').html(result[0].SecondDateTimeOfPickUp === "" ? "N/A" : result[0].SecondDateTimeOfPickUp);
                //$('.modal_transportation .modal-body #dropoff_2').html(result[0].SecondDropOff === "" ? "N/A" : result[0].SecondDropOff);
                //$('.modal_transportation .modal-body #notes').val(result[0].Notes === "" ? "N/A" : result[0].Notes);

                //if (type === "Airport Transfer") {
                //    $('#one_trip_div').css('display', 'none');
                //    $('#two_trips_div').css('display', 'none');
                //    $('#pick_up_div').css('display', 'none');
                //    $('#dt_div').css('display', 'none');
                //    $('#drop_off_div').css('display', 'none');
                //    $('#second_pick_up_div').css('display', 'none');
                //    $('#dt_2_div').css('display', 'none');
                //    $('#second_drop_off_div').css('display', 'none');

                //    $('#inbound_div').css('display', 'block');
                //    $('#outbound_div').css('display', 'block');
                //} else {
                //    $('#inbound_div').css('display', 'none');
                //    $('#outbound_div').css('display', 'none');

                //    $('#one_trip_div').css('display', 'block');
                //    $('#two_trips_div').css('display', 'block');
                //    $('#pick_up_div').css('display', 'block');
                //    $('#dt_div').css('display', 'block');
                //    $('#drop_off_div').css('display', 'block');
                //    $('#second_pick_up_div').css('display', 'block');
                //    $('#dt_2_div').css('display', 'block');
                //    $('#second_drop_off_div').css('display', 'block');
                //}

                //$('.modal_transportation .modal-title').html(mnno + " - " + name);
                //$('.modal_transportation').modal();
            }
        });
    });


    //$(document).on('click', '#transportation_requests_tbl tbody tr td #view_attachment', function () {
    //    $('.modal_picture .modal-title').html("Attached File");
    //    $('.modal_picture .modal-body div').html("");
    //    var row = $(this).parent().parent();
    //    var src = transportationTable.row(row).data()[9];
    //    var fileType = transportationTable.row(row).data()[10];
    //    //alert(src);
    //    $('.modal_picture .modal-title').html();
    //    if (src !== 'null') {
    //        if (fileType === "pdf" || fileType === "PDF") {
    //            $('.modal_picture .modal-body div').html('<embed src="data:application/pdf;base64,' + src + '" frameborder="0" width="100%" height="400px">');
    //        } else if (fileType === "jpg" || fileType === "jpeg" || fileType ==="JPG") {
    //            $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/jpeg;base64,' + src + '" />');
    //        } else if (fileType === "png" || fileType === "PNG") {
    //            $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/png;base64,' + src + '" />');
    //        }

    //    } else {
    //        $('.modal_picture .modal-body div').html('<p style="text-align: center">No data to show</p>');
    //    }

    //    $('.modal_picture').modal();
    //});

    $(document).on('click', '#e_cancel_accomodation_btn', function () {

        getServerDate().then(function (data) {
            // Run this when your request was successful
            var serverDate = fixServerDateFormat(data.split(' ')[0]);
            var selectedDate = e_accomodation_date.split(' - ')[0];

            let validatedSchedule = validateSchedule(selectedDate, serverDate);

            if (validatedSchedule == 0) {
                //parameters: modal id, button modal id, modal message
                let modalMessage = "You are no longer allowed to cancel because your accommodation will start next week. <br />If you really need to CANCEL, kindly contact our Sales and Marketing Team instead. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph";
                generateWarningModal('cancel_reservation_not_allowed', 2, '', modalMessage);
            } else {
                let modalMessage = "Are you sure you want to CANCEL this reservation?";

                generateWarningModal('e_cancel_accommodation_warning_modal', 1, 'e_cancel_accommodation_warning_modal_yes', modalMessage);
            }

        }).catch(function (err) {
            generateDangerModal("e_cancel_accommodation_error", "Cannot get the Server Date. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

            //$('.modal-danger .modal-body p').html("Cannot get the Server Date. Please contact the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
            //$('.modal-danger').modal();
        });

    });

    $(document).on('click', '#e_cancel_accommodation_warning_modal_yes', function () {
        $.ajax({
            url: '/SAMPortal/Forms/CancelAccommodationReservation',
            data: { id: onSiteAccommodationRecordId },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            success: function (result) {
                $.unblockUI();
                if (result.data == 1) {
                    $('#modal_success .modal-body p').html('Reservation cancelled successfully!');
                    $('#modal_success').modal();
                } else {
                    generateDangerModal("ecancel_accommodation_reservation_error", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");

                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }

                getOnSiteAccommodationRequests();
            }
        });
    });

    $('#modal_success').on('hidden.bs.modal', function () {
        $('#edit_onsite_booking_modal').modal('toggle');
    });

    $(document).on('click', '.modal #view_attachment', function () {
        $('.modal_picture .modal-header .modal-title').html("");
        var recordId = $(this).attr('rid');
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
                if (src !== null && src !== "" && src !== "null") {
                    if (fileType === "pdf" || fileType === "PDF") {
                        $('.modal_picture .modal-body div').html('<embed src="data:application/pdf;base64,' + src + '" frameborder="0" width="100%" height="400px">');
                    } else if (fileType === "jpg" || fileType === "jpeg" || fileType === "JPG") {
                        $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/jpeg;base64,' + src + '" />');
                    } else if (fileType === "png" || fileType === "PNG") {
                        $('.modal_picture .modal-body div').html('<img style="margin-left: auto; margin-right: auto;" class="img-responsive" id="crewPhoto" src="data:image/png;base64,' + src + '" />');
                    } else {
                        $('.modal_picture .modal-body div').html('<p style="text-align: center">Could not show attachment. The type of the file uploaded is not a PDF/PNG or a JPEG type.</p>');
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

    // return values: 0 - not allowed to book, 1 - allowed to book
    function validateSchedule(date, serverDate) {

        let chosenDate = date;

        let difference = getWeekNumber(chosenDate) - getWeekNumber(serverDate);

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



    $(document).on('click', '#modal_update_new_crew_request_save', function () {
        let datepickerSplit = $('#datepicker').val().split('/');
        let birthDate = datepickerSplit[2] + "-" + datepickerSplit[0] + "-" + datepickerSplit[1];
        let firstname = $('#FirstName').val();
        let lastname = $('#LastName').val();
        let tempNo = $('#modal_update_new_crew_request .modal-title').html().split(' - ')[0];
        let rank = $('#modal_update_new_crew_request #position option:selected').val();
        let picture = $('#modal_update_new_crew_request #output').val();

        if (verify_btn_validation(firstname, lastname, birthDate) === 1) {
            let message = "<p>Please make sure that the fields First Name, Last Name and Birthday are not left blank before clicking the Save button</p>";

            generateWarningModal("verify_btn_validation_modal", 2, "", message);

        } else {

            let allParameters = [tempNo, rank, $('#FirstName').val(), $('#MiddleName').val(), $('#LastName').val(), $('#BirthPlace').val(), birthDate, picture];

            $.ajax({
                url: '/SAMPortal/Forms/UpdateNewCrewRequest',
                type: 'POST',
                dataType: 'JSON',
                data: { parameters: allParameters },
                success: function (result) {
                    if (result.status === 1) {
                        let message = "Request has been updated successfully!";
                        generateSuccessModal("request_updated_modal", 2, "", message);

                        getNewCrewRequest();

                    } else {
                        $('#check_crew_duplicates_error_modal .modal-body p').html("Please send the this error ID (" + (result.logId == null || result.logId == "" ? "000" : result.logId) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                        $('#check_crew_duplicates_error_modal').modal();
                    }
                },
                error: function (data) {
                    $('#check_crew_duplicates_error_modal .modal-body p').html("Please send the this error ID (" + (result.logId == null || result.logId == "" ? "000" : result.logId) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    $('#check_crew_duplicates_error_modal').modal();
                }
            });

        }

    });

    $(document).on('click', '#update_new_crew_request', function () {
        let tempNo = $(this).html();//$('#crew_list_requests_tbl_tbody tr td:first-child a').html();
        let position = $(this).parent().nextAll().eq(0).html();//$('#crew_list_requests_tbl_tbody tr td:nth-child(2)').html();
        let birthday = $(this).parent().nextAll().eq(2).html();//$('#crew_list_requests_tbl_tbody tr td:nth-child(4)').html();
        let birthplace = $(this).parent().nextAll().eq(3).html();
        let fullName = $(this).parent().nextAll().eq(1).find('a').attr('id').split('~');
        let firstName = fullName[2];
        let lastName = fullName[1];
        let middleInitial = fullName[3];

        $.ajax({
            url: '/SAMPortal/Forms/GetPartialOfUpdateNewCrewRequest',
            type: 'GET',
            success: function (data) {
                $('#modal_update_new_crew_request .modal-content').html(data);
                $("#modal_update_new_crew_request #position").select2({ theme: "bootstrap", placeholder: "Select Rank", width: 'auto' });
                $('.select2-container--bootstrap .select2-selection--single').css({ 'padding-top': '10px', 'border-radius': '0px' });

            },
            complete: function () {
                $('#FirstName').val(firstName);
                $('#position').val(position);
                $('.select2-selection__rendered').html($('#position option:selected').html());

                $('#MiddleName').val(middleInitial);
                $('#LastName').val(lastName);
                $('#BirthPlace').val(birthplace);
                $('#datepicker').val(birthday);
                $('#datepicker').datepicker();
                $('#modal_update_new_crew_request .modal-title').prepend(tempNo + ' - ');

                $('#modal_update_new_crew_request').modal();

            }
        });

    });

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function formatDate(data) {

        if (data == null) {
            return "";
        }

        var result = data.replace(/[^0-9 +]/g, '');

        var fdate = new Date(parseInt(result));

        return fdate.getDate() + " " +monthNames[fdate.getMonth()] + " " + fdate.getFullYear();
    }

});
