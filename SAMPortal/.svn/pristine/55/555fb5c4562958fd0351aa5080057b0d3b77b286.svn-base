$(document).ready(function () {
    var date = new Date();
    $('#dashboard_lnk').parent().addClass('active');

    getCrewList();

    function getCrewList() {
        $.ajax({
            url: '/SAMPortal/api/Forms/GetCrewList',
            type: 'get',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var content = "";

                for (var i = 0; i < result.length; i++) {
                    content += "<tr><td>" + result[i].Mnno + "</td><td>" + result[i].Position + "</td><td>" + result[i].Name + "</td><td>" + (result[i].Nation == null ? "" : result[i].Nation) + "</td><td>" + result[i].Birthday +
                        "</td><td>" + result[i].BirthPlace + "</td><td>" + result[i].Contact + "</td><td>" + result[i].Gender + "</td></tr>";
                

                $('#crew_list_tbl_tbody').html(content);
                $('#crew_list_tbl').DataTable();
            }
        });
    }

});