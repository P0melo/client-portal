$(document).ready(function () {
    if (!$('#management_lnk').parent().hasClass('active')) {
        $('#management_lnk').parent().addClass('active menu-open');
    }


    //===set breadcrumbs
    $('.content-header h1').html("Contact Us");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("Contact Us");
    //===
});