var CURRENT_URL = window.location.href.split('#')[0].split('?')[0];
var REGEX_IMAGE = RegExp("(.*?)\.(png|jpg|gif|bmp|jpeg|svg)$", "i");
var REGEX_PORT = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;
var REGEX_EMAIL = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
var REGEX_ID = /^[a-zA-Z0-9]{5,32}$/g;
var REGEX_CELLNO = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
var REGEX_PHONENO = /^(\d{2,3}-\d{3,4}-\d{4})|(\d{4}-\d{4})$/;
var REGEX_IP = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;
var REGEX_IP_WITH_SM = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])((\/)([1-9]|[1-2][0-9]|3[0-2])){0,1}$/;
var REGEX_MAC = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;
var REGEX_URL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
var REGEX_MATERIAL_ID = /^([A-Z]){1}([0-9]){7}$/;
var REGEX_BUSINESS_NO = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
var close_callbacks = {};
var yes_callbacks = {};
var no_callbacks = {};

$BODY = $('body');
$NAVBAR_NAV = $('#navMenu');
$NAVBAR_VER = $('.nav-vertical');
PAGE_PARAM = $BODY.data("param");

var CURRENT_HOST = window.location.protocol + "//" + window.location.hostname;

if(CURRENT_HOST.indexOf("http://") !== -1) {
    if(window.location.port !== '') {
        CURRENT_HOST += ":" + window.location.port;
    }
}
else if(CURRENT_HOST.indexOf("https://") !== -1) {
    if(window.location.port !== '') {
        CURRENT_HOST += ":" + window.location.port;
    }
}

var datatable_options = {
    "paging"       : true,
    "ordering"     : true,
    "filter"       : false,
    "searching"    : false,
    "lengthChange" : true,
    "pagingType"   : "simple_numbers",
    "processing"   : true,
    "serverSide"   : true,
    "dom"          : "frtip"
};

var SearchCondition = function SearchCondition(template) {
    template = template || {};

    this.start = template.start || 0;
    this.length = template.length || 10;
    this.orderBy = template.orderBy || '';
    this.sortDir = template.sortDir || 'desc';

    this.id = template.id || "";
    this.pid = template.pid || "";
    this.aryPid = [];
    this.userId = template.userId || "";

    this.from = template.from || '';
    this.to = template.to || '';
    this.keyword = template.keyword || '';
    this.status = template.status || "";
    this.aryStatus = [];
    this.positionId = template.positionId || "";
    this.aryPositionId = [];
    this.deptId = template.deptId || "";
    this.aryDeptId = [];
    this.categoryId = template.categoryId || "";
    this.companyId = template.companyId || "";
    this.aryCompany = [];
    this.brandId = template.brandId || "";
    this.aryBrandId = [];
    this.type = template.type || "";
    this.aryType = [];
    this.boardId = template.boardId || "";
    this.dateType = template.dateType || "";
    this.aryDateType = [];
    this.userType = template.userType || "";
    this.aryUserType = [];
    this.ingredientId = template.ingredientId || "";
    this.aryIngredientId = [];
    this.tags = template.tags || "";
    this.productId = template.productId || "";
    this.aryProductId = [];
    this.processId = template.processId || "";
    this.aryProcessId = [];
    this.processingId = template.processingId || "";
    this.aryProcessingId = [];
    this.recipeId = template.recipeId || "";
    this.aryRecipeId = [];
    this.facilityId = template.facilityId || "";
    this.aryFacilityId = [];
    this.byFacility = template.byFacility || "";
};

SearchCondition.getInstance = function getInstance() {
    return new SearchCondition(null);
};

var addComma = function addComma(value, point){
    if(isNaN(value)) {
        value = 0;
    }
    if(!point) {
        point = 0;
    }

    let bigValue = new Big(value.toFixed(point));

    if(point > 0) {
        let divider = new Big(1);
        for(let i = 0; i<point; i++) {
            if(!bigValue.mod(divider).eq(0)) {
                divider = divider.div(10);
            }
            else {
                bigValue = new Big(value.toFixed(i));
                break;
            }
        }
    }
    const parts = bigValue.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

var getMaterialValue = function getMaterialValue(material, item) {
    let history = null;
    if(material.historyList) {
        if(material.historyList.length > 0) {
            for(let ht of material.historyList) {
                if(ht.closed) {
                    history = ht;
                    break;
                }
            }
        }
    }

    if(history !== null) {
        return history[item];
    }
    return material[item];
}

var getPercentStr = function getPercentStr(value, point) {
    if(isNaN(value)) {
        return "0%";
    }
    return addComma(value, point) + "%";
}

var getSizeStr = function getSizeStr(value) {
    let bigValue = new Big(value);
    if(bigValue.lt(1024)) {
        return addComma(bigValue, 0) + " B";
    }
    else if(bigValue.lt(new Big(1024).times(1024))) {
        return addComma(bigValue.div(1024).toNumber(), 2) + " KB";
    }
    else if(bigValue.lt(new Big(1024).times(1024).times(1024))) {
        return addComma(bigValue.div(1024).div(1024).toNumber(), 2) + " MB";
    }
    else if(bigValue.lt(new Big(1024).times(1024).times(1024).times(1024))) {
        return addComma(bigValue.div(1024).div(1024).div(1024), 2) + " GB";
    }
    else {
        return addComma(bigValue.div(1024).div(1024).div(1024).div(1024), 2) + " TB";
    }
}

var getMomentDate = function getMomentDate(today) {
    if(today.length === 21) {
        today = today.substr(0, 19);
    }
    today = today.replace(/-/g, "/");
    let date = new Date(today);
    return moment(date);
}

var getDateTimeStr = function getDateTimeStr(today) {
    if(today.length === 21) {
        today = today.substr(0, 19);
    }
    today = today.replace(/-/g, "/");
    let date = new Date(today);
    return moment(date).format('L') + " " + moment(date).format('HH:mm');
}

var getTodayDateStr = function getTodayDateStr() {
    let date = moment().format("YYYY-MM-DD");
    return date + " 00:00:00";
}

var getDayTimeStr = function getDayTimeStr(today) {
    if(!today) {
        return;
    }
    if(today.length === 21) {
        today = today.substr(0, 19);
    }
    today = today.replace(/-/g, "/");
    let date = new Date(today);
    return moment(date).format('L') + "(" + moment(date).format('ddd') + ") " + moment(date).format('HH:mm');
}

var getShortDateStr = function getShortDateStr(today) {
    if(today.length === 21) {
        today = today.substr(0, 19);
    }
    today = today.replace(/-/g, "/");
    return moment(new Date(today)).format('YYYY-MM-DD');
}

var getDateStr = function getDateStar(today) {
    if(today.length === 21) {
        today = today.substr(0, 19);
    }
    today = today.replace(/-/g, "/");
    return moment(new Date(today)).format('ll');
}

var showCloseModal = function showCloseModal(title, body, callback) {
    let modal = new bootstrap.Modal(document.getElementById('modalClose'), {backdrop: 'static'}) ;

    $("#modalClose .modal-title").html(title);
    $("#modalClose .modal-body").html(body);

    close_callbacks[title] = callback;

    $("#modalClose").off("hidden.bs.modal").on("hidden.bs.modal", function(e) {
        e.preventDefault();
        let html = $("#modalClose .modal-title").html();
        let callback = close_callbacks[html];
        if(callback !== null && typeof callback !== "undefined") {
            callback();
        }
    }).off("shown.bs.modal").on("shown.bs.modal", function(e) {
        e.preventDefault();
        $("#btnModalClose").focus();
    });

    modal.show();
}

var showYesNoModal = function showYesNoModal(title, body, yes_callback, no_callback) {
    let modal = new bootstrap.Modal(document.getElementById('modalYesNo'), {backdrop: 'static'}) ;
    let confirmed = false;

    $("#modalYesNo .modal-title").html(title);
    $("#modalYesNo .modal-body").html(body);

    yes_callbacks[title] = yes_callback;
    no_callbacks[title] = no_callback;

    $("#modalYesNo").off("hidden.bs.modal").on("hidden.bs.modal", function(e) {
        if(!confirmed) {
            if(typeof no_callback === "function") {
                no_callback();
            }
        }
    }).off("shown.bs.modal").on("shown.bs.modal", function(e) {
        e.preventDefault();
        $("#btnModalYes").focus();
    });

    $("#btnModalYes").off("click").on("click", function (e) {
        e.preventDefault();
        let html = $("#modalYesNo .modal-title").html();
        let callback = yes_callbacks[html];
        if (typeof callback === "function") {
            confirmed = true;
            callback();
        }
    });

    $("#btnModalNo").off("click").on("click", function(e) {
        e.preventDefault();
        let html = $("#modalYesNo .modal-title").html();
        let callback = no_callbacks[html];
        if (typeof callback === "function") {
            confirmed = true;
            callback();
        }
    });

    modal.show();
}

var isSelect2Elem = function isSelect2Elem(elem) {
    let classList = elem.attr('class').split(/\s+/);
    let item = classList.find(function(aryItem) {
        return aryItem.indexOf("js-select2") !== -1;
    });
    if(item) {
        return true;
    }
    return false;
}

var initTextKeydownBind = function initTextKeydownBind(elem, required, nextElem, event) {
    if(isSelect2Elem(elem)) {
        elem.on("select2:close", function (e) {
            if (event === "click") {
                nextElem.trigger("click");
            } else {
                if (isSelect2Elem(nextElem)) {
                    nextElem.select2("focus");
                    nextElem.select2("open");
                } else {
                    nextElem.focus().select();
                }
            }
        });


    }
    else {
        elem.bind("keydown", function (e) {
            if (e.keyCode === 13 && (!required || elem.val() !== "")) {
                e.preventDefault();
                if (event === "click") {
                    nextElem.trigger("click");
                } else {
                    if (isSelect2Elem(nextElem)) {
                        nextElem.select2("focus");
                        nextElem.select2("open");
                    } else {
                        if(nextElem.hasClass("js-tagify")) {
                            $(nextElem).data("tagify").DOM.input.focus();
                        }
                        else {
                            nextElem.focus().select();
                        }
                    }
                }
            }
        });
    }
}

var bindCheckEvent = function bindCheckEvent(elem, childs) {
    elem.on("click", function (e) {
        let checked = $(this).is(":checked");
        childs.forEach(function (child) {
            if(child.hasClass("js-tagify")) {
                let objs = child.closest("div").find(".js-tagify");
                objs[0].readOnly = !checked;
                if(checked) {
                    objs.removeAttr("readonly");
                }
                else {
                    objs.attr("readonly", "readonly");
                }
            }
            else {
                child.prop("disabled", !checked);
            }
        });
    });
}

var getItemFromLocalStorage = function(itemName) {
    var itemObject = null;
    try {
        if (window.localStorage) {
            itemObject = localStorage.getItem(itemName);
        }
    } catch (ignore) {}
    return itemObject;
};

var deleteItemFromLocalStorage = function(itemName) {
    try {
        if (window.localStorage) {
            localStorage.removeItem(itemName);
        }
    } catch (ignore) {}
};

var setItemToLocalStorage = function(itemName, itemValue) {
    try {
        if (window.localStorage) {
            localStorage.setItem(itemName, itemValue);
        }
    } catch (ignore) {}
};

var collapseAllChilds = function collapseAllChilds(elem) {
    elem.removeClass("show");
    elem.find("ul.js-navbar-vertical-aside-submenu").each(function () {
        $(this).hide();
        $(this).find("a.nav-link").removeClass("active").removeClass("font-weight-bold");
        $(this).find("li.navbar-vertical-aside-has-menu").each(function () {
            collapseAllChilds($(this));
        });
    });
}

var expandAllParents = function expandAllParents(elem) {
    if(elem.length) {
        elem.addClass("show");
        elem.find("a.js-navbar-vertical-aside-menu-link").first().addClass("active");
        $("<li class=\"breadcrumb-item\"><a class=\"breadcrumb-link\" href=\"javascript:;\">" + elem.find("a.js-navbar-vertical-aside-menu-link").first().attr("title") + "</a></li>").prependTo($(".page-header ol.breadcrumb"));
        let subParent = elem.closest("ul.js-navbar-vertical-aside-submenu");
        if(subParent) {
            if(!$BODY.hasClass("navbar-vertical-aside-mini-mode")) {
                subParent.show();
            }
            expandAllParents(subParent.closest("li.navbar-vertical-aside-has-menu"));
        }
    }
}

var escapeHtml = function escapeHtml(value) {
    if(!value) {
        return "";
    }
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

var init_framework = function init_framework() {
    $('.js-navbar-vertical-aside-toggle-invoker').click(function () {
        $('.js-navbar-vertical-aside-toggle-invoker i').tooltip('hide');
    });

    // initialization of navbar vertical navigation
    var sidebar = $('.js-navbar-vertical-aside').hsSideNav();

    // initialization of tooltip in navbar vertical menu
    $('.js-nav-tooltip-link').tooltip({ boundary: 'window' })

    $(".js-nav-tooltip-link").on("show.bs.tooltip", function(e) {
        if (!$("body").hasClass("navbar-vertical-aside-mini-mode")) {
            return false;
        }
    });

    // initialization of Nav Scroller
    $('.js-nav-scroller').each(function () {
        new HsNavScroller($(this)).init()
    });

    // initialization of hs-add-field
    $('.js-add-field').each(function () {
        new HSAddField($(this)).init();
    });

    // initialization of form search
    $('.js-form-search').each(function () {
        new HSFormSearch($(this)).init()
    });

    // initialization of unfold
    $('.js-hs-unfold-invoker').each(function () {
        var unfold = new HSUnfold($(this)).init();
    });

    // initialization of select2
    $('.js-select2-custom').each(function () {
        var select2 = $.HSCore.components.HSSelect2.init($(this), {
            "language": {
                "searching": function () {
                    return "검색 중...";
                },
                "noResults": function () {
                    return "검색결과가 없습니다.";
                },
                "errorLoading": function () {
                    return "검색과정에서 오류가 발생했습니다.";
                }
            }
        });
    });

    // initialization of file attach
    $('.js-file-attach').each(function () {
        var customFile = new HSFileAttach($(this)).init();
    });

    // initialization of Show Password
    $('.js-toggle-password').each(function () {
        new HSTogglePassword(this).init()
    });

    // initialization of sticky blocks
    $('.js-sticky-block').each(function () {
        var stickyBlock = new HSStickyBlock($(this), {
            targetSelector: $('#header').hasClass('navbar-fixed') ? '#header' : null
        }).init();
    });

    // initialization of scroll nav
    var scrollspy = new HSScrollspy($('body'), {
        // !SETTING "resolve" PARAMETER AND RETURNING "resolve('completed')" IS REQUIRED
        beforeScroll: function(resolve) {
            if (window.innerWidth < 992) {
                $('#navbarVerticalNavMenu').collapse('hide').on('hidden.bs.collapse', function () {
                    return resolve('completed');
                });
            } else {
                return resolve('completed');
            }
        }
    }).init();

    // initialization of tagify
    $('.js-tagify').each(function () {
        var tagify = $.HSCore.components.HSTagify.init($(this), {
            originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(','),
            maxTags : 10
        });

        $(this).data("tagify", tagify);
    });
}

var activityOpened = function activityOpened() {
    $("#activitySearch").focus().select();
}

var init_nav_menu = function init_nav_menu() {
    if($("#activitySearch").length > 0) {
        $(".activity-search-content .nav-link[data-toggle='tab']").on("shown.bs.tab", function (e) {
            e.preventDefault();
            if($("#contactInternal").is(":visible")) {
                searchInternal($("#activitySearch").val());
            }

            if($("#contactExternal").is(":visible")) {
                searchExternal($("#activitySearch").val());
            }

            $("#activitySearch").focus().select();
        });

        let searchInternal = function searchInternal(keyword) {
            if(keyword === "") {
                $("#contactInternal .contact-result").hide();
                $("#contactInternal .empty-result").show();
                $("#contactInternal .contact-result").html("");
                return;
            }

            $.ajax({
                url         : $NAVBAR_NAV.data("context") + "/api/common/user/list",
                type        : "POST",
                data        : {
                    keyword : keyword,
                    length  : 0,
                    userId  : $NAVBAR_NAV.data("userid")
                },
                success: function (res) {
                    if(!res || !res.data) {
                        showCloseModal(
                            "사내연락처 검색",
                            `사내연락처를 검색하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.`,
                            function () {
                                $("#activitySearch").focus().select();
                            }
                        );
                        return;
                    }
                    else {
                        if(res.data.length === 0) {
                            $("#contactInternal .contact-result").hide();
                            $("#contactInternal .empty-result").show();
                        }
                        else {
                            $("#contactInternal .empty-result").hide();
                            $("#contactInternal .contact-result").show();

                            $("#contactInternal .contact-result").html("");

                            for(let member of res.data) {
                                let html =
                                    "<li class=\"list-group-item custom-checkbox-list-wrapper\">\n" +
                                    "    <div class=\"row\">\n" +
                                    "        <div class=\"col-auto position-static\">\n" +
                                    "            <div class=\"d-flex align-items-center mr-2\">\n" +
                                    "                <div class=\"avatar avatar-md avatar-circle\">\n" +
                                    "                    <img class=\"avatar-img\" src=\"|CONTEXT||IMAGE|\" alt=\"|USERNAME|\">\n" +
                                    "                    <span class=\"avatar-status avatar-sm-status avatar-status-|STATECOLOR| user-state\"></span>\n" +
                                    "                </div>\n" +
                                    "            </div>\n" +
                                    "        </div>\n" +
                                    "        <div class=\"col ml-n3\">\n" +
                                    "            <span class=\"card-title h5\">|USERNAME| |POSITION|</span>\n" +
                                    "            <p class=\"card-text font-size-sm\">|EMAIL|</p>\n" +
                                    "        </div>\n" +
                                    "        <div class=\"col-auto text-muted text-right\">\n" +
                                    "            <div class=\"font-size-sm\">|DEPT|</div>\n" +
                                    "            <div class=\"font-size-sm\">|CELLNO|</div>\n" +
                                    "        </div>\n" +
                                    "    </div>\n" +
                                    "</li>";

                                html = html.replace(/\|CONTEXT\|/g, $NAVBAR_NAV.data("context"));

                                if(member.picture) {
                                    html = html.replace(/\|IMAGE\|/g, "/resources/upload/member/" + member.picture);
                                }
                                else {
                                    html = html.replace(/\|IMAGE\|/g, "/resources/assets/img/unknown.jpg");
                                }

                                html = html.replace(/\|USERNAME\|/g, escapeHtml(member.userName));

                                if(member.state === "AVAILABLE") {
                                    html = html.replace(/\|STATECOLOR\|/g, "success");
                                }
                                else if(member.state === "BUSY") {
                                    html = html.replace(/\|STATECOLOR\|/g, "danger");
                                }
                                else if(member.state === "AWAY") {
                                    html = html.replace(/\|STATECOLOR\|/g, "warning");
                                }
                                else {
                                    html = html.replace(/\|STATECOLOR\|/g, "dark");
                                }

                                html = html.replace(/\|POSITION\|/g, (member.position ? member.position.name : ""));
                                html = html.replace(/\|EMAIL\|/g, member.email);
                                html = html.replace(/\|DEPT\|/g, member.dept.name);
                                html = html.replace(/\|CELLNO\|/g, member.cellNo);

                                $(html).appendTo($("#contactInternal .contact-result"));
                            }
                        }
                    }
                },
                error: function(xhr, status, error) {
                    showCloseModal(
                        "사내연락처 검색",
                        `사내연락처를 검색하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>통신오류</small>`,
                        function () {
                            $("#activitySearch").focus().select();
                        }
                    )
                }
            });
        }

        let searchExternal = function searchExternal(keyword) {
            if(keyword === "") {
                $("#contactExternal .contact-result").hide();
                $("#contactExternal .empty-result").show();
                $("#contactExternal .contact-result").html("");
                return;
            }

            $.ajax({
                url         : $NAVBAR_NAV.data("context") + "/api/partner/contact/list",
                type        : "POST",
                data        : {
                    keyword : keyword,
                    length  : 0,
                    userId  : $NAVBAR_NAV.data("userid")
                },
                success: function (res) {
                    if(!res || !res.data) {
                        showCloseModal(
                            "연락처 검색",
                            `연락처를 검색하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.`,
                            function () {
                                $("#activitySearch").focus().select();
                            }
                        );
                        return;
                    }
                    else {
                        if(res.data.length === 0) {
                            $("#contactExternal .contact-result").hide();
                            $("#contactExternal .empty-result").show();
                        }
                        else {
                            $("#contactExternal .empty-result").hide();
                            $("#contactExternal .contact-result").show();

                            $("#contactExternal .contact-result").html("");

                            for(let contact of res.data) {
                                let html =
                                    "<li class=\"list-group-item custom-checkbox-list-wrapper\">\n" +
                                    "    <div class=\"row\">\n" +
                                    "        <div class=\"col ml-n3\">\n" +
                                    "            <span class=\"card-title h5\">|USERNAME| |POSITION| |COMPANY|</span>\n" +
                                    "            <p class=\"card-text font-size-sm\">|EMAIL|</p>\n" +
                                    "        </div>\n" +
                                    "        <div class=\"col-auto text-muted text-right\">\n" +
                                    "            <div class=\"font-size-sm\">|CELLNO|</div>\n" +
                                    "            <div class=\"font-size-sm\">|PHONENO|</div>\n" +
                                    "        </div>\n" +
                                    "    </div>\n" +
                                    "</li>";

                                html = html.replace(/\|CONTEXT\|/g, $NAVBAR_NAV.data("context"));


                                html = html.replace(/\|USERNAME\|/g, contact.name);
                                html = html.replace(/\|COMPANY\|/g, contact.company.name);
                                html = html.replace(/\|POSITION\|/g, contact.position);
                                html = html.replace(/\|EMAIL\|/g, contact.email);
                                html = html.replace(/\|PHONENO\|/g, contact.phoneNo);
                                html = html.replace(/\|CELLNO\|/g, contact.cellNo);

                                $(html).appendTo($("#contactExternal .contact-result"));
                            }
                        }
                    }
                },
                error: function(xhr, status, error) {
                    showCloseModal(
                        "연락처 검색",
                        `연락처를 검색하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>통신오류</small>`,
                        function () {
                            $("#activitySearch").focus().select();
                        }
                    )
                }
            });
        }

        let searchContact = function searchContact(keyword) {
            if($("#contactInternal").is(":visible")) {
                searchInternal(keyword);
            }

            if($("#contactExternal").is(":visible")) {
                searchExternal(keyword);
            }
        }

        $("#activitySearch").bind("keydown", function(e) {
            if(e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                searchContact($(this).val());
            }
        });
    }

    init_framework();

    if($NAVBAR_NAV.length > 0) {

        let update_navbar = function update_navbar() {
            $NAVBAR_NAV.find("li.navbar-vertical-aside-has-menu").each(function () {
                collapseAllChilds($(this));
            });

            let me = $NAVBAR_NAV.find('a').filter(function () {
                if((this.href === CURRENT_URL) || (CURRENT_URL.indexOf(this.href) !== -1)) {
                    return true;
                }
                else {
                    if(CURRENT_URL.indexOf("/board/write")!==-1) {
                        if(CURRENT_URL.replace("/write/", "/").indexOf(this.href) !== -1) {
                            return true;
                        }
                    }
                }
                return false;
            });

            $(".page-header ol.breadcrumb").html("");

            me.addClass("active").addClass("font-weight-bold");
            $("<li class=\"breadcrumb-item active\" aria-current=\"page\">" + me.text() + "</li>").prependTo($(".page-header ol.breadcrumb"));
            $("h1.page-header-title").html(me.text());

            let subParent = me.closest("ul.js-navbar-vertical-aside-submenu");
            if (subParent) {
                if (!$BODY.hasClass("navbar-vertical-aside-mini-mode")) {
                    subParent.show();
                }
                expandAllParents(subParent.closest("li.navbar-vertical-aside-has-menu"));
            }

            let title = "";
            $(".page-header ol.breadcrumb li").each(function () {
                if(title !== "") {
                    title = title + " / ";
                }
                title = title + $(this).text();
            });

            $(document).attr("title", $NAVBAR_NAV.data("title") + " : " + title);
        }
        update_navbar();

        $(".js-navbar-vertical-aside-toggle-invoker").on("click", function (e) {
            e.preventDefault();
            $("html").scrollTop(0);
            update_navbar();
        });

        $(".dropdown-logout").on("click", function (e) {
            e.preventDefault();
            let logout_callback = function logout_callback() {
                location.href = $NAVBAR_NAV.data("context") + "/logout";
            }
            showYesNoModal(
                $NAVBAR_NAV.data("title"),
                "지금 로그아웃 하시겠습니까?",
                logout_callback
            );
        });

        $(".dropdown-member-state").on("click", function (e) {

            let userId = $(this).data("userid");
            let state = $(this).data("state");

            if(!userId || !state) {
                return;
            }

            $.ajax({
                url         : $NAVBAR_NAV.data("context") + "/api/common/member/state/change",
                type        : "POST",
                data        : {
                    userId : userId,
                    state  : state
                },
                success: function (res) {
                    if(!res || res.code !== 0) {
                        showCloseModal(
                            "업무상태 변경",
                            `업무상태를 변경하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>${"${(!res) ? '서버오류' : res.msg}"}</small>`,
                            function () {
                                if(res && res.code === 102) {
                                    location.href = $NAVBAR_NAV.data("context") + "/logout";
                                }
                            }
                        );
                        return;
                    }
                    else {
                        showCloseModal(
                            "업무상태 변경",
                            res.msg,
                            function () {
                                $(".dropdown-member-state")
                                    .removeClass("badge-soft-success")
                                    .removeClass("badge-soft-danger")
                                    .removeClass("badge-soft-warning")
                                $(".dropdown-member-state > span.text-truncate")
                                    .removeClass("font-weight-bold");
                                if(state === "AVAILABLE") {
                                    $(".dropdown-member-state[data-state='AVAILABLE']").addClass("badge-soft-success");
                                    $(".dropdown-member-state[data-state='AVAILABLE'] > span.text-truncate").addClass("font-weight-bold");
                                    $(".member-state")
                                        .removeClass("avatar-status-success")
                                        .removeClass("avatar-status-danger")
                                        .removeClass("avatar-status-warning")
                                        .addClass("avatar-status-success")
                                }
                                else if(state == "BUSY") {
                                    $(".dropdown-member-state[data-state='BUSY']").addClass("badge-soft-danger");
                                    $(".dropdown-member-state[data-state='BUSY'] > span.text-truncate").addClass("font-weight-bold");
                                    $(".member-state")
                                        .removeClass("avatar-status-success")
                                        .removeClass("avatar-status-danger")
                                        .removeClass("avatar-status-warning")
                                        .addClass("avatar-status-danger")
                                }
                                else {
                                    $(".dropdown-member-state[data-state='AWAY']").addClass("badge-soft-warning");
                                    $(".dropdown-member-state[data-state='AWAY'] > span.text-truncate").addClass("font-weight-bold");
                                    $(".member-state")
                                        .removeClass("avatar-status-success")
                                        .removeClass("avatar-status-danger")
                                        .removeClass("avatar-status-warning")
                                        .addClass("avatar-status-warning")
                                }
                            }
                        );
                    }
                },
                error: function(xhr, status, error) {
                    showCloseModal(
                        "업무상태 변경",
                        "업무상태를 변경하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>통신오류</small>"
                    )
                }
            });
        });

        if($("#detailSearch").length) {
            $("#detailSearch").on("shown.bs.collapse", function (e) {
                $("#btnDetailSearch")
                    .removeClass("btn-white")
                    .addClass("btn-ghost-primary");
                $("#btnDetailSearch").closest("div.input-group-append").removeClass("dropdown").addClass("dropup");
            }).on("hidden.bs.collapse", function (e) {
                $("#btnDetailSearch")
                    .removeClass("btn-ghost-primary")
                    .addClass("btn-white");
                $("#btnDetailSearch").closest("div.input-group-append").removeClass("dropup").addClass("dropdown");
                $("#btnResetCustomSearch").trigger("click");
            });
        }

        if($("#detailSearch2").length) {
            $("#detailSearch2").on("shown.bs.collapse", function (e) {
                $("#btnDetailSearch2")
                    .removeClass("btn-white")
                    .addClass("btn-ghost-primary");
                $("#btnDetailSearch2").closest("div.input-group-append").removeClass("dropdown").addClass("dropup");
            }).on("hidden.bs.collapse", function (e) {
                $("#btnDetailSearch2")
                    .removeClass("btn-ghost-primary")
                    .addClass("btn-white");
                $("#btnDetailSearch2").closest("div.input-group-append").removeClass("dropup").addClass("dropdown");
                $("#btnResetCustomSearch2").trigger("click");
            });
        }

        if($('#js-daterangepicker-predefined').length) {
            let type = $('#js-daterangepicker-predefined').data("type");

            let cb = function cb(start, end) {
                $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html(start.format('YYYY년 MMM Do') + ' - ' + end.format('YYYY년 MMM Do'));
            }

            let start = moment();
            let end = moment();

            let opt = $('#js-daterangepicker-predefined').data("options");
            if(!opt) {
                opt = {};
            }

            opt = $.extend(true, {
                startDate: start,
                endDate: end,
                locale: {
                    customRangeLabel : "별도지정",
                    applyLabel       : "적용하기",
                    cancelLabel      : "기간지정 취소하기"
                },
                ranges: {
                    '오늘': [moment(), moment()],
                    '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '내일': [moment().add(1, 'days'), moment().add(1, 'days')],
                    '이전 1주일': [moment().subtract(6, 'days'), moment()],
                    '이전 1개월': [moment().subtract(30, 'days'), moment()],
                    '다음 1주일': [moment(), moment().add(6, 'days')],
                    '다음 1개월': [moment(), moment().add(30, 'days')],
                    '이번 달': [moment().startOf('month'), moment().endOf('month')],
                    '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    '다음 달': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
                }
            }, opt);

            $('#js-daterangepicker-predefined').daterangepicker(opt, cb).on('apply.daterangepicker', function (ev, picker) {
                $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html(picker.startDate.format('YYYY년 MMM Do') + ' - ' + picker.endDate.format('YYYY년 MMM Do'));
            }).on('cancel.daterangepicker', function (ev, picker) {
                picker.setStartDate(moment());
                picker.setEndDate(moment());
                $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html("지정되지 않음");
            });

            cb(start, end);


            $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html("지정되지 않음");
        }

        if($('#js-daterangepicker-predefined2').length) {
            let type = $('#js-daterangepicker-predefined2').data("type");

            let cb = function cb(start, end) {
                $('#js-daterangepicker-predefined2 .js-daterangepicker-predefined-preview').html(start.format('YYYY년 MMM Do') + ' - ' + end.format('YYYY년 MMM Do'));
            }

            let start = moment();
            let end = moment();

            let opt = $('#js-daterangepicker-predefined2').data("options");
            if(!opt) {
                opt = {};
            }

            opt = $.extend(true, {
                startDate: start,
                endDate: end,
                locale: {
                    customRangeLabel : "별도지정",
                    applyLabel       : "적용하기",
                    cancelLabel      : "기간지정 취소하기"
                },
                ranges: {
                    '오늘': [moment(), moment()],
                    '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '내일': [moment().add(1, 'days'), moment().add(1, 'days')],
                    '이전 1주일': [moment().subtract(6, 'days'), moment()],
                    '이전 1개월': [moment().subtract(30, 'days'), moment()],
                    '다음 1주일': [moment(), moment().add(6, 'days')],
                    '다음 1개월': [moment(), moment().add(30, 'days')],
                    '이번 달': [moment().startOf('month'), moment().endOf('month')],
                    '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    '다음 달': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
                }
            }, opt);

            $('#js-daterangepicker-predefined2').daterangepicker(opt, cb).on('apply.daterangepicker', function (ev, picker) {
                $('#js-daterangepicker-predefined2 .js-daterangepicker-predefined-preview').html(picker.startDate.format('YYYY년 MMM Do') + ' - ' + picker.endDate.format('YYYY년 MMM Do'));
            }).on('cancel.daterangepicker', function (ev, picker) {
                picker.setStartDate(moment());
                picker.setEndDate(moment());
                $('#js-daterangepicker-predefined2 .js-daterangepicker-predefined-preview').html("지정되지 않음");
            });

            cb(start, end);


            $('#js-daterangepicker-predefined2 .js-daterangepicker-predefined-preview').html("지정되지 않음");
        }

    }
}
