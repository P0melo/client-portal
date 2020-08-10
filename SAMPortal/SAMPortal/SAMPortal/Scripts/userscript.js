
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
    //MM/dd/YYYY
    return yearDate[0] + "-" + (parts[0].length == 1 ? "0" + parts[0] : parts[0]) + "-" + (parts[1].length == 1 ? "0" + parts[1] : parts[1]) + "T" + yearDate[1];
}


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