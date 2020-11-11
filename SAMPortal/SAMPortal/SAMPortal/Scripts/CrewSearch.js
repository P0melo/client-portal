$(document).ready(function () {
    var searchCrewTable = "";
    var selectedType = "";
    var selectedCrews = [];

    $(document).on('click', '#crew_search_btn', function () {

        renderSearchCrewWindow("single");

        $('#modal_search_crew').modal();
    });

    $(document).on('click', '#batch_crew_search_btn', function () {
        selectedCrews = [];
        renderSearchCrewWindow("batch");

        $('#modal_search_crew').modal();
    });


    function renderSearchCrewWindow(type) {
        var buttonType = "";

        if (type === "single") {
            buttonType = "<button type='button' class='btn btn-default' id='choose_this_crew' style='width: 100%'>Select</button>";
        } else if (type === "batch") {

            $("#modal_search_crew_submit").css('display', 'inline-block');
            buttonType = "<button type='button' class='btn btn-default' id='add_this_crew'>Select</button>";
        }

        $.ajax({
            url: '/SAMPortal/api/Forms/GetCrewList',
            type: 'get',
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $('#crew_list_tbl_tbody_search').html('<tr><td colspan="8">Loading please wait...</td></tr>');
            },
            success: function (result) {
                var content = "";

                if (searchCrewTable != "") {
                    searchCrewTable.destroy();
                }

                for (var i = 0; i < result.length; i++) {
                    content += "<tr><td>" + result[i].Mnno + "</td><td>" + result[i].Position + "</td><td>" + result[i].Name + "</td><td>" + fixDateFormat(result[i].Birthday) +
                        "</td><td>" + result[i].Gender + "</td><td style='padding: 1px'>" + buttonType + "</td></tr>";
                }

                $('#crew_list_tbl_tbody_search').html(content);
                searchCrewTable = $('#crew_list_tbl_search').DataTable({
                    "columnDefs": [{
                        "targets": [5],
                        "searchable": false,
                        "orderable": false
                    }]
                });
            }
        });
    }

    var chosenCrewMnno = "";
    var chosenCrewRank = "";
    var chosenCrewName = "";
    $(document).on('click', '#choose_this_crew', function () {

        chosenCrewMnno = $(this).parent().prev().prev().prev().prev().prev().html();
        chosenCrewRank = $(this).parent().prev().prev().prev().prev().html();
        chosenCrewName = $(this).parent().prev().prev().prev().html();

        $('#modal_search_crew_warning .modal-body p').html("Are you sure you want to choose this crew? <br /><br />" + chosenCrewMnno + " " + chosenCrewName);
        $('#modal_search_crew_warning').modal();
    });

    $('#crew_picture img').bind("error", function () {
        $(this).attr('src', '/SAMPortal/Content/images/default.jpg');
    });

    $(document).on('click', '#modal_search_crew_warning_yes', function () {
        $('#mnno_input').val(chosenCrewMnno);
        $('#mnno_input').trigger('change');
        $('#rank_input').val(chosenCrewRank);
        $('#name_input').val(chosenCrewName);

        $('#crew_picture img').attr('src', 'http://pics.umtc.com.ph/CadetPictures/' + chosenCrewMnno + '.jpg?' + date.getMilliseconds());

        //$('#crew_picture img').on('error', function () {
        //    $(this).attr('src', '/SAMPortal/Content/images/default.jpg');
        //});

        $('#modal_search_crew').modal('hide');
    });

    $(document).on('click', '#add_this_crew', function () {
        $('#selected_crews_div').css("display", "inline-block");

        var mnno = $(this).parent().parent().find(">:first-child").html();

        if (!selectedCrews.includes(mnno)) {
            selectedCrews.push(mnno);
        }
        

        document.getElementById("selected_crews").innerHTML = selectedCrews;

    });

    $('#modal_search_crew').on('hidden.bs.modal', function () {
        $('#selected_crews_div').css("display", "none");
        $('#modal_search_crew_submit').css("display", "none");
    });

    $(document).on('click', '#modal_search_crew_submit', function () {
        $('#modal_batch_search_crew_warning .modal-body p').html("Are you sure you want to choose these crews? " + selectedCrews);
        $('#modal_batch_search_crew_warning').modal();
    });

    $(document).on('click', '#modal_batch_search_crew_warning_yes', function () {
        $('#mnno_input_batch').val(selectedCrews);
        $('#mnno_input_batch').trigger('change');

        $('#modal_batch_search_crew_warning').modal('hide');
    });

});