$(document).ready(function () {
    //===set breadcrumbs
    $('.content-header h1').html("Change Password");
    $('.content-header ol #home_lnk').html('<a href="/SAMPortal/"><i class="fa fa-home"></i> Home</a>');
    $('.content-header ol #current_page').html("<a href='/SAMPortal/Manage'>Manage</a>");
    $('.content-header ol #current_page').removeAttr("class", "Active");
    $('.content-header ol').append("<li class='active'>Change Password</li>");
    //===
});