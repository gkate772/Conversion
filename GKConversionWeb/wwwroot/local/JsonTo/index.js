$(document).ready(function () {
    initializationinput();
});

function initializationinput() {
    $("#editor1").kendoEditor();
    $("#editor1").data("kendoEditor").wrapper.find(".k-toolbar").remove();

    $("#editor2").kendoEditor();
    $("#editor2").data("kendoEditor").wrapper.find(".k-toolbar").remove();

    $("#myButton").kendoButton(
        {
            click: function () {
                var editorHtml = $("#editor1").data("kendoEditor").value();
                var editorText = $("<div>").html(editorHtml).text();
                Enter = {};
                Enter = editorText;
                ajax_call("/Index", JSON.stringify({ jsondata: Enter }), Success, error, false);

                function Success(Response) {
                    $("#editor2").data("kendoEditor").value(Response);
                }
                function error(xht, dt, error) {
                    console.log("error : " + error);
                }
            }
        }
    );
}

