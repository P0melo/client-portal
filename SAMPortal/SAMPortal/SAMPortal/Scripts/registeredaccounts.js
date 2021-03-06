﻿$(document).ready(function () {
    var myTable = "";
    var action;
    GetRegisteredAccountsForReview();
    
    $(document).on('click', '#approve_account', function () {
        $('#modal_approve_crew_request .modal-body p').html('Are you sure you want to approve this request?');
        $('#modal_approve_crew_request .modal-footer').html('<button type="button" class="btn btn-outline pull-right" id="approve_account_yes" data-dismiss="modal">Yes</button>' +
            '<button type="button" class="btn btn-outline pull-right" data-dismiss="modal">No</button >');
        $('#modal_approve_crew_request').modal();
    });

    $(document).on('click', '#approve_account_yes', function () {
        var email = $('#approve_account').parent().prev().prev().prev().html();
        action = 0;

        $.ajax({
            url: '/SAMPortal/Administration/ReviewAction',
            type: 'post',
            data: { email: email, action: action },
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            success: function (result) {
                if (result.jsonStatus === 1) {
                    $.unblockUI();
                    //$('#modal_success .modal-body p').html('Request successfully approved!');
                    //$('#modal_success').modal();
                    generateSuccessModal("approve_account_modal", 2, "", "The REQUEST has been successfully APPROVED!");
                    GetRegisteredAccountsForReview();
                } else {
                    generateDangerModal("review_action_error_modal", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph")
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }
            }
        });
    });

    $(document).on('click', '#deny_account', function () {
        $('#modal_approve_crew_request .modal-body p').html('Are you sure you want to deny this request?');
        $('#modal_approve_crew_request .modal-footer').html('<button type="button" class="btn btn-outline pull-right" id="deny_account_yes" data-dismiss="modal">Yes</button>'+
                                               '<button type="button" class="btn btn-outline pull-right" data-dismiss="modal">No</button >');
        $('#modal_approve_crew_request').modal();
    });

    $(document).on('click', '#deny_account_yes', function () {
        var email = $('#deny_account').parent().prev().prev().prev().html();
        action = 1;

        $.ajax({
            url: '/SAMPortal/Administration/ReviewAction',
            type: 'post',
            data: { email: email, action: action },
            beforeSend: function () {
                $.blockUI({ message: null });
            },
            success: function (result) {
                if (result.jsonStatus === 1) {
                    //$('.modal-success .modal-body p').html('Request successfully denied!');
                    //$('.modal-success').modal();
                    $.unblockUI();
                    generateSuccessModal("deny_account_modal", 2, "", "The REQUEST has been successfully DENIED!");

                } else {
                    generateDangerModal("review_action_error_modal", "Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph")
                    //$('.modal-danger .modal-body p').html("Please send the this error ID (" + (result.data == null || result.data == "" ? "000" : result.data) + ") to the Sales and Marketing Team. <br /><br />T:  +63 2 981 6682 local 2133, 2141, 2144, 2133 <br />E:  marketing@umtc.com.ph");
                    //$('.modal-danger').modal();
                }
            }, complete: function () {
                GetRegisteredAccountsForReview();
            }
        });
    });

    function GetRegisteredAccountsForReview() {
        $.ajax({
            url: '/SAMPortal/Administration/GetRegisteredAccountsForReview',
            type: 'get',
            dataType: 'json',
            success: function (result) {
                $(document).ajaxStart(function () { Pace.restart(); }); 
                if (myTable != "") {
                    myTable.destroy();
                }

                var data = result.data;
                var content = "";
                for (var i = 0; i < data.length; i++) {
                    content += "<tr><td>" + data[i].Email + "</td><td>" + data[i].Name + "</td><td>" + data[i].Company + "</td><td style='padding: 1px'><button title='Approve' id='approve_account' style='width: 50%' class='btn btn-default'><i class='fa fa-check form-group'></i></button><button title='Deny' id='deny_account' style='width: 50%' class='btn btn-default'><i class='fa fa-close form-group'></i></button></td></tr>";
                }

                $('#review_tbl #review_tbl_tbody').html(content);


                myTable = $('#review_tbl').DataTable({
                    "columnDefs": [
                        { "orderable": false, "targets": 3 }
                    ]
                });

                $('#review_tbl #review_tbl').css('width', 'inherit');
            }
        });
    }

    $(document).on('click', '#refresh_tbl', function () {
        GetRegisteredAccountsForReview();
    });
});