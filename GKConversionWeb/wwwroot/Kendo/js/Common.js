var pageUrlArray = window.location.pathname.split('/');
var StaticLink = "/" + pageUrlArray[1] + "/" + pageUrlArray[2];
StaticLink = "/" + pageUrlArray[1];//comment this for UAT
var FilePathStaticLink = "/" + pageUrlArray[1] + "/" + pageUrlArray[2];
FilePathStaticLink = "/" + pageUrlArray[1]; //comment this for UAT
var URLPath = window.location.pathname;
var isDateField = [];
$(function () {
    $.ajaxSetup({
        contents: {
            javascript: false
        }
    });

    // Acceptable: disable text to javascript promotion (but will break intended manual conversions)
    $.ajaxSetup({
        converters: {
            "test => javascript": false
        }
    });

    // Preferred: use a prefilter to be more specific (only crossDomain)
    $.ajaxPrefilter(function (s) {
        if (s.crossDomain) {
            s.contents.javascript = false;
        }
    });

    var notification = $("#notification").kendoNotification({
        autoHideAfter: 3000,
        stacking: "default",
        position: {
            pinned: true,
            top: null,
            left: null,
            bottom: 50
        },
        templates:
            [{
                type: "info",
                template: $("#infoTemplate").html()
            }, {
                type: "error",
                template: $("#errorTemplate").html()
            }, {
                type: "success",
                template: $("#successTemplate").html()
            }]

    }).data("kendoNotification");
    $(document).one("kendo:pageUnload", function () { if (notification) { notification.hide(); } });
});
function handleErrorMessage(errorlist) {
    var msg = '';
    $.each(errorlist, function (k, v) {
        msg += OracleORA(v) + "<br />";
    });

    if (msg == '') msg = null;
    if (msg !== null) {
        $("#toolbar").show();
        $("#errmsg").html(msg);
        $("#ErrorDisplay").show();
        //DisplayPushNotification("Error Message", msg, "error");
        window.scrollTo(0, 0);
        return true;
    }

    if (typeof window['ClearErrorMessage'] == 'function')
        ClearErrorMessage();
    return false;
}
function ClearErrorMessage() {
    $("#errmsg").text('');
    $("#ErrorDisplay").hide();
    $(".k-invalid-msg").hide();
}
function DisplayPushNotification(title, message, type) {//type: error,info,success
    $("#notification").data("kendoNotification").show({
        title: title,
        message: message
    }, type);
};
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function LogOutOnSessionExpiry() {
    window.location.href = "../../UserManagement/Forms/Logout.aspx";
}

function gridDataBound(e) {
    var grid = e.sender;
    if (grid.dataSource.total() == 0) {
        var colCount = grid.columns.length;
        $(e.sender.wrapper)
            .find('tbody')
            .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">No Record Found! Please Add the details.</td></tr>');
    }
}
function gridDataBoundValue(e, Value) {
    var grid = e.sender;
    if (grid.dataSource.total() == 0) {
        if (Value != "")
            DivRemove(Value);
        var colCount = grid.columns.length;
        $(e.sender.wrapper)
            .find('tbody')
            .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">No Record Found!!!</td></tr>');
    }
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + s4() + '-' +
        s4() + s4() + '-' + s4() + s4();
}

function GetValue() {
    var uniqueId = guid();
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.getItem("tabId")) {
            return sessionStorage.getItem("tabId");
        }
        else {
            window.sessionStorage.setItem("tabId", uniqueId);
            return uniqueId;
        }
    } else {
        if (typeof window.name != undefined) {
            if (window.name == '') {
                var d = new Date();
                window.name = '_myWnd_' + d.getUTCHours() + d.getUTCMinutes() + d.getUTCSeconds() + d.getUTCMilliseconds();
            }
        }
        return uniqueId;
    }
}

function ajax_call(path, data, success_function, error_function, async) {
    if (typeof success_function === 'function' && typeof error_function === 'function') {
        $.ajax({
            type: "POST",
            url: URLPath + path,
            async: async != undefined ? async : true,
            //dataType: "json",
            data: data,
            contentType: "application/json; charset=utf-8",
            timeout: 50000
        }).then(success_function).fail(error_function);
    }
}
function ajax_callFixedPath(path, data, success_function, error_function, async) {
    if (typeof success_function === 'function' && typeof error_function === 'function') {
        $.ajax({
            type: "POST",
            url: path,
            async: async != undefined ? async : true,
            dataType: "json",
            data: data,
            contentType: "application/json; charset=utf-8",
            timeout: 50000
        }).then(success_function).fail(error_function);
    }
}

function DivRemove(Value) {
    $("#div" + Value).css("display", "none");
}
function GetMenu(path) {
    var listofErrorMessage = {};
    var Enter = {};
    Enter["URL"] = URLPath;
    Enter["Type"] = "P";
    ajax_callFixedPath(path, JSON.stringify({ jason: Enter }),
        function (msg) {
            try {
                if (msg.d != "" && msg.d != "[]") {
                    if (msg.d.hasOwnProperty("Error") || msg.d.hasOwnProperty("error")) {
                        listofErrorMessage["Error"] = msg.d.Error || msg.d.error;
                        handleErrorMessage(listofErrorMessage);
                    }
                    else if (msg.d.hasOwnProperty("Session") || msg.d.hasOwnProperty("session")) {
                        LogOutOnSessionExpiry();
                    }
                    else {
                        $("#Menu1").html(msg.d.HtmlMap);
                        //$(".imgUser").attr("src", "../../../Handler/ImageView.ashx?Image=" + msg.d.ProfileCd + ".jpg");
                    }

                } else if (msg.d == "" || msg.d == "[]") {
                    LogOutOnSessionExpiry();
                }
            }
            catch (e) {
                listofErrorMessage["Error"] = e.message;
                handleErrorMessage(listofErrorMessage);
            }
        },
        function (xhr, dt, errorThrown) {
            listofErrorMessage["Error"] = errorThrown;
            handleErrorMessage(listofErrorMessage);
        }
    );

}

function Read(options, Value, Enter, ReBindGrid, async) {
    var listofErrorMessage = {};
    kendo.ui.progress($(document.body), true);
    ajax_call(Value, Enter,
        function (msg) {
            try {
                kendo.ui.progress($(document.body), false);
                if (msg.d == "SessionExpire") { LogOutOnSessionExpiry() }
                else if (msg.d != "" && msg.d != "[]") {
                    var obj = $.parseJSON(msg.d);
                    if (obj.hasOwnProperty("Error") || obj.hasOwnProperty("error")) {
                        options.success("");
                        listofErrorMessage["Error"] = obj.Error || obj.error;
                        handleErrorMessage(listofErrorMessage);
                    }
                    else if (obj.hasOwnProperty("Session") || obj.hasOwnProperty("session")) {
                        LogOutOnSessionExpiry();
                    }
                    else {
                        if (obj.result == undefined)
                            options.success(msg.d);
                        else
                            options.success($.parseJSON(obj.result));
                        if (typeof ReBindGrid === 'function')
                            ReBindGrid();
                    }

                } else if (msg.d == "" || msg.d == "[]") {
                    options.success("");
                }
            }
            catch (e) {
                listofErrorMessage["Error"] = e.message;
                handleErrorMessage(listofErrorMessage);
            }
        },
        function (xhr, dt, errorThrown) {
            listofErrorMessage["Error"] = errorThrown;
            handleErrorMessage(listofErrorMessage);
        },
        async
    );
}
function Update(options, Value, Enter, ReBindGrid) {
    var listofErrorMessage = {};
    ajax_call(Value, Enter,
        function (msg) {
            if (msg.d == "SessionExpire") { LogOutOnSessionExpiry(); }
            else {
                try {
                    if (msg.d != "" && msg.d != "[]") {
                        var obj = $.parseJSON(msg.d);
                        if (obj.hasOwnProperty("Error") || obj.hasOwnProperty("error")) {
                            listofErrorMessage["Error"] = obj.Error || obj.error;
                            handleErrorMessage(listofErrorMessage);
                            options.error("");
                        }
                        else if (obj.hasOwnProperty("Session") || obj.hasOwnProperty("session")) {
                            LogOutOnSessionExpiry();
                        }
                        else {
                            ClearErrorMessage();
                            options.success("");
                            DisplayPushNotification("Message", "Saved Successfully", "success");

                            if (typeof ReBindGrid === 'function')
                                ReBindGrid();
                        }
                    }
                } catch (e) {
                    listofErrorMessage["Error"] = e.message;
                    handleErrorMessage(listofErrorMessage);
                }
            }
        },
        function (err) {
            alert(err.statusText);
        }
    );
}
function Destroy(options, Value, Enter, ReBindGrid) {
    var listofErrorMessage = {};
    ajax_call(Value, Enter,
        function (msg) {
            if (msg.d == "SessionExpire") { LogOutOnSessionExpiry(); }
            else {
                try {
                    if (msg.d != "" && msg.d != "[]") {
                        var obj = $.parseJSON(msg.d);
                        if (obj.hasOwnProperty("Error") || obj.hasOwnProperty("error")) {
                            listofErrorMessage["Error"] = obj.Error || obj.error;
                            handleErrorMessage(listofErrorMessage);
                            options.error("");

                        }
                        else if (obj.hasOwnProperty("Session") || obj.hasOwnProperty("session")) {
                            LogOutOnSessionExpiry();
                        }
                        else {
                            ClearErrorMessage();
                            options.success("");
                            DisplayPushNotification("Message", "Deleted Successfully", "success");
                            if (typeof ReBindGrid === 'function')
                                ReBindGrid();
                        }
                    }
                } catch (e) {
                    listofErrorMessage["Error"] = e.message;
                    handleErrorMessage(listofErrorMessage);
                }
            }
        },
        function (err) {
            alert(err.statusText);
        }
    );
}
function Create(options, Value, Enter, ReBindGrid) {
    var listofErrorMessage = {};
    ajax_call(Value, Enter,
        function (msg) {
            if (msg.d == "SessionExpire") { LogOutOnSessionExpiry(); }
            else {
                try {
                    if (msg.d != "" && msg.d != "[]") {
                        var obj = $.parseJSON(msg.d);
                        if (obj.hasOwnProperty("Error") || obj.hasOwnProperty("error")) {
                            listofErrorMessage["Error"] = obj.Error || obj.error;
                            handleErrorMessage(listofErrorMessage);
                            options.error("");

                        }
                        else if (obj.hasOwnProperty("Session") || obj.hasOwnProperty("session")) {
                            LogOutOnSessionExpiry();
                        }
                        else {
                            ClearErrorMessage();
                            options.success("");
                            DisplayPushNotification("Message", "Saved Successfully", "success");
                            if (typeof ReBindGrid === 'function')
                                ReBindGrid();
                        }
                    }
                } catch (e) {
                    alert(e.message);
                    listofErrorMessage["Error"] = e.message;
                    handleErrorMessage(listofErrorMessage);
                }
            }
        },
        function (err) {
            alert(err.statusText);
        }
    );
}

function CollapseExpandPanel(spnId, divId, iInfo) {
    $("#" + spnId).click(function () {
        $("#" + divId).toggle(100);
        if ($("#" + spnId).hasClass("k-span-active")) {
            $("#" + spnId).removeClass("k-span-active");
            $("#" + iInfo).removeClass("expandicon").addClass("collapseicon");
        }
        else {
            $("#" + spnId).addClass("k-span-active");
            $("#" + iInfo).removeClass("collapseicon").addClass("expandicon");
        }
    });

}
function CollapseExpandPanelByDefault(spnId, divId, iInfo) {
    $("#" + divId).toggle(100);
    $("#" + iInfo).removeClass("expandicon").addClass("collapseicon");
    $("#" + spnId).click(function () {
        $("#" + divId).toggle(100);
        if ($("#" + spnId).hasClass("k-span-active")) {
            $("#" + spnId).removeClass("k-span-active");
            $("#" + iInfo).removeClass("collapseicon").addClass("expandicon");
        }
        else {
            $("#" + spnId).addClass("k-span-active");
            $("#" + iInfo).removeClass("expandicon").addClass("collapseicon");
        }
    });
}

function BindToolTip(divID, templateid, autoHideP, widthP, heightP, positionP) {
    $("#" + divID).kendoTooltip({
        autoHide: autoHideP,
        content: kendo.template($("#" + templateid).html()),
        width: widthP,
        height: heightP,
        position: positionP
    });
}
function FloatTextBox(txtBoxId, label, isMandatory, readonly) {
    if (!$("#" + txtBoxId).data("kendoTextBox")) {
        $("#" + txtBoxId).kendoTextBox({
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            },
            readonly: readonly != undefined ? readonly : false
        });
    }
}
function FloatAutoComplete(txtBoxId, label, isMandatory, readonly, dataSource, dataTextField) {
    if (!$("#" + txtBoxId).data("kendoAutoComplete")) {
        $("#" + txtBoxId).kendoAutoComplete({
            label: {
                content: isMandatory == 1 && label != "" ? label + " *" : label,
                floating: label == "" ? false : true
            },
            readonly: readonly != undefined ? readonly : false,
            dataTextField: dataTextField,
            filter: "contains",
            dataSource: dataSource
        });
    }
}

function FloatMaskedTextBox(txtBoxId, label, isMandatory, maskText) {
    if (!$("#" + txtBoxId).data("kendoMaskedTextBox")) {
        $("#" + txtBoxId).kendoMaskedTextBox({
            mask: maskText,//"#0000000000000",
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            }
        });
    }
}
function FloatTextArea(txtBoxId, label, row, isMandatory, maxlength, readonly) {
    if (!$("#" + txtBoxId).data("kendoTextArea")) {
        $("#" + txtBoxId).kendoTextArea({
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            },
            rows: row,
            maxLength: maxlength,
            readonly: readonly
        });
    }
}
function FloatNumericTextBox(txtBoxId, label, isMandatory, min, max, format, readonly) {
    if (!$("#" + txtBoxId).data("kendoNumericTextBox")) {
        $("#" + txtBoxId).kendoNumericTextBox({
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            },
            readonly: readonly,
            format: format,
            min: min,
            max: max
        });
    }
}
function FloatDatePicker(dtBoxId, label, minDate, maxDate, isMandatory, ChangeEvent, readonly) {
    if (!$("#" + dtBoxId).data("kendoDatePicker")) {
        $("#" + dtBoxId).kendoDatePicker({
            label: {
                content: isMandatory == 1 && label != "" ? label + " * " : label,
                floating: label == "" ? false : true
            },
            readonly: readonly != undefined ? readonly : false,
            format: "dd-MMM-yyyy",
            dateInput: false,
            culture: "en-US",
            min: minDate,
            max: maxDate,
            change: function (e) {
                if (typeof ChangeEvent === 'function')
                    ChangeEvent();
            }
        });
    }
}
function FloatDateTimePicker(dtBoxId, label, minDate, maxDate, isMandatory, ChangeEvent, readonly) {
    if (!$("#" + dtBoxId).data("kendoDateTimePicker")) {
        $("#" + dtBoxId).kendoDateTimePicker({
            label: {
                content: isMandatory == 1 && label != "" ? label + " *" : label,
                floating: label == "" ? false : true
            },
            readonly: readonly != undefined ? readonly : false,
            format: "dd-MMM-yyyy hh:mm tt",
            dateInput: false,
            culture: "en-US",
            min: minDate,
            max: maxDate,
            change: function (e) {
                if (typeof ChangeEvent === 'function')
                    ChangeEvent();
            }
        });
    }
}
function FloatDropDown(ddlId, label, textfield, valuefield, autoBind, isMandatory, ddlCascadeId, datasource, ChangeEvent, readonly, levelNo, headerData, fieldData) {
    if (!$("#" + ddlId).data("kendoDropDownList")) {
        var headtemplate = "";
        var template = "";
        var width = 600;
        if (levelNo == 3) {
            headtemplate = '<td class="combo-hd-td" style="text-align: center;">' + headerData["L1"] + '</td><td class="combo-hd-td" style="text-align: center;">' + headerData["L2"] + '</td><td class="combo-hd-td" style="text-align: center;">' + headerData["L3"] + '</td>';
            template = '<td class="combo-td" style="text-align: center;">#: data.' + fieldData["L1"] + ' #</td><td class="combo-td" style="text-align: center;">#: data.' + fieldData["L2"] + ' #</td><td class="combo-td" style="text-align: center;">#: data.' + fieldData["L3"] + ' #</td>';
            width = width - (width / levelNo);
        }
        else if (levelNo == 2) {
            headtemplate = '<td class="combo-hd-td" style="text-align: center;">' + headerData["L1"] + '</td><td class="combo-hd-td" style="text-align: center;">' + headerData["L2"] + '</td>';
            template = '<td class="combo-td" style="text-align: center;">#: data.' + fieldData["L1"] + ' #</td><td class="combo-td" style="text-align: center;">#: data.' + fieldData["L2"] + ' #</td>';
            width = width - (width / levelNo);
        }
        else {
            headtemplate = '<td class="combo-hd-td" style="text-align: center;">' + label + '</td>';
            template = '<td>#: data.' + fieldData["L1"] + ' #</td>';
            width = width / 2;

        }
        var dropdown = $("#" + ddlId).kendoDropDownList({
            optionLabel: 'Please select ' + label + '...',
            label: {
                content: isMandatory == 1 && label != "" ? label + '*' : label,
                floating: label == "" ? false : true
            },
            autoBind: autoBind != undefined ? autoBind : false,
            readonly: readonly != undefined ? readonly : false,
            cascadeFrom: ddlCascadeId != undefined ? ddlCascadeId : "",
            dataTextField: textfield,
            dataValueField: valuefield,
            height: 300,
            width: width,
            //headerTemplate: '<table><tr class="combo-tr">' + headtemplate + '</tr></table>',
            footerTemplate: '<table><tr class="combo-tr" style="width:' + width + 'px">' + headtemplate + '</tr></table>' + 'Total #: instance.dataSource.total() # items found',
            template: '<table><tr>' + template + '</tr></table> ',
            filter: "contains",
            dataSource: datasource,
            change: function (e) {
                if (this.selectedIndex == -1) {
                    this.select(-1);
                    this.value('');
                }
                if (typeof ChangeEvent === 'function')
                    ChangeEvent(e);
            },
            dataBound: function (e) {
                var ds = this.dataSource.data();
                if (ds.length == 1) {
                    this.select(1);
                    this.trigger("change");
                }
            }
        }).data("kendoDropDownList");
        dropdown.list.width(width);
        dropdown.list.height(300);
        dropdown.readonly(readonly != undefined ? readonly : false);
        //dropdown.floatingLabel.refresh()
    }
}
function FloatComboBox(ddlId, label, textfield, valuefield, autoBind, isMandatory, filterFields, columns, ddlCascadeId, ddlCascadeField, datasource, ChangeEvent, readonly) {
    if (!$("#" + ddlId).data("kendoMultiColumnComboBox")) {
        $("#" + ddlId).kendoMultiColumnComboBox({
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            },
            autoBind: autoBind != undefined ? autoBind : false,
            readonly: readonly != undefined ? readonly : false,
            cascadeFrom: ddlCascadeId != undefined ? ddlCascadeId : "",
            cascadeFromField: ddlCascadeField != undefined ? ddlCascadeField : "",
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 300
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 300
                }
            },
            dropDownWidth: 600,
            cascadeOnCustomValue: true,
            filter: "contains",
            filterFields: filterFields,
            minLength: 0,
            enforceMinLength: true,
            dataTextField: textfield,
            dataValueField: valuefield,
            dataSource: datasource,
            change: function (e) {
                if (this.selectedIndex == -1) {
                    this.select(-1);
                    this.value('');
                }
                if (typeof ChangeEvent === 'function')
                    ChangeEvent();
            },
            dataBound: function (e) {
                var ds = this.dataSource.data();
                if (ds.length == 1) {
                    this.select(1);
                }
            },
            columns: columns
        });
    }
}
function FloatMultiSelect(ddlId, label, textfield, valuefield, autoBind, isMandatory, ReadEvent, ChangeEvent, readonly) {
    if (!$("#" + ddlId).data("kendoMultiSelect")) {
        $("#" + ddlId).kendoMultiSelect({
            label: {
                content: isMandatory == 1 && label != "" ? label + " <span class='mandatory'>*</span>" : label,
                floating: label == "" ? false : true
            },
            autoBind: autoBind != undefined ? autoBind : false,
            readonly: readonly != undefined ? readonly : false,
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 300
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 300
                }
            },
            filter: "contains",
            dataTextField: textfield,
            dataValueField: valuefield,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        if (typeof ReadEvent === 'function')
                            ReadEvent();
                    }
                }
            },
            change: function (e) {
                if (this.selectedIndex == -1) {
                    this.select(-1);
                    this.value('');
                }
                if (typeof ChangeEvent === 'function')
                    ChangeEvent();
            },
            dataBound: function (e) {
                var ds = this.dataSource.data();
                if (ds.length == 1) {
                    this.select(1);
                }
            }
        });
    }
}
function FloatSwitch(swId, checked, unchecked, statemode, change) {
    if (!$("#" + swId).data("kendoSwitch")) {
        var switchInstance = $("#" + swId).kendoSwitch({
            messages: {
                checked: checked,
                unchecked: unchecked
            },
            change: change
        }).data("kendoSwitch");
        switchInstance.check(statemode);
    }
}
function BindButton(btnId, type, clickevent) {
    var themeColor = "primary";
    var icon = "save";
    if (type == "U") {
        themeColor = "secondary";
        icon = "pencil";
    } else if (type == "C") {
        themeColor = "inverse";
        icon = "x";
    }
    if (!$("#" + btnId).data("kendoButton")) {
        $("#" + btnId).kendoButton({
            themeColor: themeColor,
            icon: icon,
            click: clickevent
        });
    }
}
function BindListBoxUnSelected(lstId, connectWith, dataSource, field, value, changeevent)
{
    if ($("#" + lstId).data("kendoListBox")) {
        //$("#" + lstId).kendoListBox('destroy').empty();
       // $("#" + lstId).data("kendoListBox").destroy();

    }
    if (!$("#" + lstId).data("kendoListBox")) {
        $("#" + lstId).kendoListBox({
            connectWith: connectWith,
            toolbar: {
                tools: ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
            },
            selectable: "multiple",
            dataSource: dataSource,
            dataTextField: field,
            dataValueField: value,
            change: changeevent
        });
        $("#" + lstId).parent().get(0).addEventListener('keydown', function (e) {
            if (e.keyCode == kendo.keys.DELETE) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    }
}
function BindListBoxSelected(lstId, connectWith,  field, value, changeevent) {
    if (!$("#" + lstId).data("kendoListBox")) {
        $("#" + lstId).kendoListBox({
            connectWith: connectWith,
            selectable: "multiple",
            dropSources: [connectWith],
            dataTextField: field,
            dataValueField: value,
            change: changeevent
        });
        $("#" + lstId).parent().get(0).addEventListener('keydown', function (e) {
            if (e.keyCode == kendo.keys.DELETE) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    }
}
function BindGridField(container, fieldtype, Name, maxLength) {
    var input;
    if (fieldtype == "dropdown")
        input = $('<input id="ddl' + Name + '" name="' + Name + '" required style="width:100%" title="This field is required.">');
    else if (fieldtype == "date")
        input = $('<input id="dt' + Name + '" name="' + Name + '" required style="width:100%" title="This field is required.">');
    else if (fieldtype == "textarea")
        input = $('<textarea id="txt' + Name + '" name="' + Name + '" rows="6" style="width:100%" class="k-input k-textbox" required title="This field is required." maxLength=' + maxLength + ' ></textarea>');
    else if (fieldtype == "input")
        input = $('<input id="txt' + Name + '" name="' + Name + '" style="width:100%" class="k-input k-textbox" required title="This field is required." maxLength=' + maxLength + ' />');
    else if (fieldtype == "numeric")
        input = $('<input id="txt' + Name + '" name="' + Name + '" required title="This field is required.">');
    else if (fieldtype == "switch")
        input = $('<input id="sw' + Name + '" style="width:100%">');
    input.appendTo(container);
}
function BindTabControl(ControlName) {
    $("#" + ControlName).kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        },
        select: function (e) {
            var oldContentDiv = e.sender.wrapper.children(".k-content:visible");
            oldContentDiv.data("scrolltop", oldContentDiv.scrollTop());
        },
        activate: function (e) {
            var newContentDiv = $(e.contentElement);
            newContentDiv.scrollTop(newContentDiv.data("scrolltop"));
        }
    });
}
function BindKendoGrid(gridName, dataSourceData, columnData, toolbar, editable, edit, isStorage, filename, height, tooltip) {
    ClearErrorMessage();
    if ($("#" + gridName).data("kendoGrid")) {
        $("#" + gridName).kendoGrid('destroy').empty();
    }
    var grid = $("#" + gridName).kendoGrid({
        dataSource: dataSourceData,
        height: height,
        columns: columnData,
        sortable: true,
        resizable: true,
        filterable: true,
        groupable: true,
        pageable: {
            buttonCount: 5,
            numeric: true,
            previousNext: true
        },
        toolbar: toolbar,
        editable: editable,
        edit: edit,
        excel: {
            allPages: true
        },
        excelExport: function (e) {
            e.preventDefault();
            var columns = e.workbook.sheets[0].columns;
            columns.forEach(function (column) {
                delete column.width;
                column.autoWidth = true;
            });
            var dataURL = new kendo.ooxml.Workbook(e.workbook).toDataURL();
            window.open(FilePathStaticLink + '/PopUp/FileDownload.aspx', 'FileDownload', 'width=750,height=450');
            kendo.saveAs({
                dataURI: dataURL,
                fileName: filename + ".xlsx",
                proxyURL: FilePathStaticLink + '/PopUp/FileDownload.aspx',
                forceProxy: true,
                proxyTarget: "FileDownload"
            });
        },
        pdf: {
            fileName: filename + ".pdf",
            forcePageBreak: ".k-grouping-row:not(:first-child)",
            allPages: true,
            avoidLinks: true,
            paperSize: "A4",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            template: $("#pdftemplate").html(),
            scale: 0.8,
            creator: "System",
            author: "Azentio",
            date: new Date(),
            subject: "FileDownload"
        },
        dataBound: function (e) {
            var grid = this;
            $(".k-grouping-row").each(function (e) {
                grid.collapseGroup(this);
            });
        }
    }).data("kendoGrid");
    if (tooltip == 1) {
        if ($("#" + gridName).data("kendoTooltip")) {
            $("#" + gridName).kendoTooltip('destroy').empty();
        }
        $("#" + gridName).kendoTooltip({
            show: function (e) {
                if (this.content.text().length > 35) {
                    this.content.parent().css("visibility", "visible");
                }
            },
            hide: function (e) {
                this.content.parent().css("visibility", "hidden");
            },
            filter: "td", // Select the th elements of the Grid.
            position: "bottom",
            width: 250,
            content: function (e) {
                // Return the text content of the hovered header.
                return e.target.text();
            }
        }).data("kendoTooltip");
    }
    if (isStorage) {
        if (isStorage == 1) {
            var options = localStorage["kendo-grid-options"];
            if (options) {
                var parsedOptions = JSON.parse(options);
                parsedOptions.columns = grid.columns;
                grid.setOptions(parsedOptions);
                localStorage.removeItem("kendo-grid-options");
            }
        }
    }
}
function generateGrid(response, gridName, filenametext) {
    var model = generateModel(response);
    var columns = generateColumns(response);

    var grid = $("#" + gridName).kendoGrid({
        dataSource: {
            transport: {
                read: function (options) {
                    options.success(response.data);
                }
            },
            schema: {
                model: model
            }, pageSize: 10
        },
        toolbar: ["excel"],
        excel: {
            allPages: true
        },
        columns: columns,
        pageable: true,
        editable: false,
        resizable: true,
        filterable: true,
        sortable: true,
        dataBound: function (e) {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
            }
            var grid = e.sender;
            if (grid.dataSource.total() == 0) {
                var colCount = grid.columns.length;
                $(e.sender.wrapper)
                    .find('tbody')
                    .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">No Record Found!!!</td></tr>');
            }
        },
        excelExport: function (e) {
            e.preventDefault();
            var columns = e.workbook.sheets[0].columns;
            columns.forEach(function (column) {
                delete column.width;
                column.autoWidth = true;
            });
            var dataURL = new kendo.ooxml.Workbook(e.workbook).toDataURL();
            window.open('/' + pageUrlArray[1] + '/PopUp/FileDownload.aspx', 'FileDownload', 'width=750,height=450');
            kendo.saveAs({
                dataURI: dataURL,
                fileName: (filenametext == '' || filenametext == undefined ? gridName.slice(3) : filenametext) + ".xlsx",
                proxyURL: '/' + pageUrlArray[1] + '/PopUp/FileDownload.aspx',
                forceProxy: true,
                proxyTarget: "FileDownload"
            });
        }
    });
}
function generateColumns(response) {
    var columnNames = response["columns"];
    return columnNames.map(function (name) {
        return { field: "['" + name.columns + "']", title: titleCase(name.columns), encoded: false };//,footerTemplate: "#=['" + titleCase(name.columns) + "']#"
    })
}
function generateModel(response) {

    var sampleDataItem = response["data"][0];

    var model = {};
    var fields = {};
    for (var property in sampleDataItem) {
        property = "['" + property + "']";
        if (property.indexOf("ID") !== -1) {
            model["id"] = property;
        }
        var propType = typeof sampleDataItem[property];

        if (propType === "number") {
            fields[property] = {
                type: "number",
                validation: {
                    required: true
                }
            };
            if (model.id === property) {
                fields[property].editable = false;
                fields[property].validation.required = false;
            }
        } else if (propType === "boolean") {
            fields[property] = {
                type: "boolean"
            };
        } else if (propType === "string") {
            var parsedDate = kendo.parseDate(sampleDataItem[property]);
            if (parsedDate) {
                fields[property] = {
                    type: "date",
                    validation: {
                        required: true
                    }
                };
                isDateField[property] = true;
            } else {
                fields[property] = {
                    validation: {
                        required: true
                    }
                };
            }
        } else {
            fields[property] = {
                validation: {
                    required: true
                }
            };
        }
    }

    model.fields = fields;
    return model;
}
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}
function addDays(date, days) {
    var dat = new Date(date);
    dat.setDate(dat.getDate() + days);
    return dat;
}
function BindDMSWindow(path, dataItem, type) {
    var Enter = {};
    if (type == 'U')
        Enter["QueryString"] = dataItem.uploadquery;
    else Enter["QueryString"] = dataItem.viewquery;
    ajax_call("/" + path, JSON.stringify({ jason: Enter }),
        function (msg) {
            try {
                if (msg.d != "" && msg.d != "[]") {
                    var myWindow = $("#window");
                    var contentURL = dataItem.link + '?portal=' + msg.d;

                    myWindow.kendoWindow({
                        width: "90%",
                        height: "90%",
                        title: "Documents Upload",
                        actions: ["Refresh", "Maximize", "Close"],
                        content: contentURL,
                        iframe: true
                    });
                    myWindow.data("kendoWindow").center().open();
                }
            }
            catch (e) {
                listofErrorMessage["Error"] = e.message;
                handleErrorMessage(listofErrorMessage);
            }
        },
        function (xhr, dt, errorThrown) {
            listofErrorMessage["Error"] = errorThrown;
            handleErrorMessage(listofErrorMessage);
        });
}
function OracleORARemove(code, error) {
    var i;
    var n = '';
    if (error != undefined) {
        var text = error.split(code);
        for (i = 1; i < text.length; i++) {
            if (text[i].search("ORA-") != -1) {
                n += text[i].substr(
                    '1',
                    (text[i].search("ORA-") == -1 ? text[i].length : text[i].indexOf("ORA-") - '1')) + "<br>";
            }
            else
                n += text[i] + "<br>";
        }
    }
    return n.length <= 0 ? error : n;
}
function OracleORA(error) {
    return OracleORARemove("ORA-20101:", OracleORARemove("ORA-20102:", error));
}
function TextToSpeech(text) {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[2];
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = text;

        msg.onend = function (e) {
            console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };
        speechSynthesis.speak(msg);
    }
    else {
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[2];
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = text;

        msg.onend = function (e) {
            console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };
        window.speechSynthesis.speak(msg);
    }
}
function FloatMonthYearDatePicker(dtBoxId, label, minDate, maxDate, isMandatory, ChangeEvent, readonly) {
    if (!$("#" + dtBoxId).data("kendoDatePicker")) {
        $("#" + dtBoxId).kendoDatePicker({
            label: {
                content: isMandatory == 1 && label != "" ? label + " * " : label,
                floating: label == "" ? false : true
            },
            readonly: readonly != undefined ? readonly : false,
            format: "dd-MMM-yyyy",
            dateInput: false,
            culture: "en-US",
            min: minDate,
            max: maxDate,
            depth: "year",
            start: "year",
            change: function (e) {
                if (typeof ChangeEvent === 'function')
                    ChangeEvent();
            }
        });
    }
}
