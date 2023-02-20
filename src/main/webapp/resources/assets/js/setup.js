let showMailTestModal = function showMailTestModal(callback) {
    let modal = new bootstrap.Modal(document.getElementById('modalMailTest'), {backdrop: 'static'});

    $("#modalMailTest").off("shown.bs.modal").on("shown.bs.modal", function(e) {
        $("#testEmail").focus().select();
    });

    $("#testEmail").val("");

    $("#modalMailTest").find(".btn-modal-test").off("click").on("click", function(e) {
        e.preventDefault();
        if($("#testEmail").hasClass("is-valid")) {
            callback($("#modalMailTest"), modal);
        }
        else {
            $("#testEmail").valid();
            $("#testEmail").focus().select()
        }
    });

    $("#testEmail").unbind("keydown").bind("keydown", function(e) {
        if(e.keyCode === 13 && $(this).val() !== "" && $(this).hasClass("is-valid")) {
            e.preventDefault();
            callback($("#modalMailTest"), modal);
        }
    });

    modal.show();
}

$(document).on('ready', function () {
    // initialization of tagify
    $('.js-tagify').each(function () {
        var tagify = $.HSCore.components.HSTagify.init($(this), {
            originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
        });

        tagify.on("keydown", function (e) {
            if(e.detail.originalEvent.keyCode === 13 && $(e.detail.tagify.DOM.input).html().trim() === "") {
                $("#sCopyright").focus().select();
            }
        });
        $(this).data("tagify", tagify);
    });

    // initialization of clipboard
    $('.js-clipboard').each(function() {
        $.HSCore.components.HSClipboard.init(this);
    });

    $('.js-validate').each(function() {
        $.HSCore.components.HSValidation.init($(this));
    });


    $("#btnCompanyNext").on("click", function (e) {
        e.preventDefault();
        if($("#sCompanyName").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "회사정보 입력",
                "회사명을 입력하세요.",
                function () {
                    $("#sCompanyName").focus().select();
                }
            );
            return;
        }

        if($("#sCompanyAddr").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "회사정보 입력",
                "회사주소를 입력하세요.",
                function () {
                    $("#sCompanyAddr").focus().select();
                }
            );
            return;
        }

        if($("#sCompanyCeo").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "회사정보 입력",
                "대표자 이름을 입력하세요.",
                function () {
                    $("#sCompanyCeo").focus().select();
                }
            );
            return;
        }

        if($("#sCompanyPhone").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "회사정보 입력",
                "전화번호를 입력하세요.",
                function () {
                    $("#sCompanyPhone").focus().select();
                }
            );
            return;
        }

        $.ajax({
            url         : `${PAGE_PARAM.context}/inf/setup/save`,
            type        : "POST",
            data        : {
                category      : "company",
                sCompanyName  : $("#sCompanyName").val(),
                sCompanyAddr  : $("#sCompanyAddr").val(),
                sCompanyPhone : $("#sCompanyPhone").val()
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader(PAGE_PARAM.csrf.header, PAGE_PARAM.csrf.token);
            },
            success: function (res) {
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    showCloseModal(
                        "회사정보 입력",
                        `회사정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>${(!res) ? '서버오류' : res.msg}</small>`,
                        function () {
                            $("#btnServicePrev").trigger("click");
                        }
                    );
                    return;
                }
                else {
                    setTimeout(function() {
                        $("#sServiceName").focus().select();
                    }, 500);
                }
            },
            error: function(xhr, status, error) {
                e.stopImmediatePropagation();
                showCloseModal(
                    "회사정보 입력",
                    "회사정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>통신오류</small>",
                    function () {
                        $("#btnServicePrev").trigger("click");
                    }
                )
            }
        });
    });

    $("#btnServicePrev").on("click", function (e) {
        setTimeout(function() {
            $("#sCompanyName").focus().select();
        }, 500);
    });

    $("#btnServiceNext").on("click", function (e) {
        e.preventDefault();
        if($("#sServiceName").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "서비스정보 입력",
                "서비스명을 입력하세요.",
                function () {
                    $("#sServiceName").focus().select();
                }
            );
            return;
        }

        if($("#sServiceAddr").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "서비스정보 입력",
                "서비스주소를 입력하세요.",
                function () {
                    $("#sServiceAddr").focus().select();
                }
            );
            return;
        }

        if($("#sAdminAllowedIp").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "서비스정보 입력",
                "관리자의 접속을 허용할 IP주소를 입력하세요.",
                function () {
                    $("#sAdminAllowedIp").data("tagify").DOM.input.focus();
                }
            );
            return;
        }

        if($("#sCopyright").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "서비스정보 입력",
                "서비스 저작권을 입력하세요.",
                function () {
                    $("#sCopyright").focus().select();
                }
            );
            return;
        }

        $.ajax({
            url         : `${PAGE_PARAM.context}/inf/setup/save`,
            type        : "POST",
            data        : {
                category        : "service",
                sServiceName    : $("#sServiceName").val(),
                sServiceAddr    : $("#sServiceAddr").val(),
                sAdminAllowedIp : $("#sAdminAllowedIp").val(),
                sCopyright      : $("#sCopyright").val()

            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader(PAGE_PARAM.csrf.header, PAGE_PARAM.csrf.token);
            },
            success: function (res) {
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    showCloseModal(
                        "서비스정보 입력",
                        `서비스정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>${(!res) ? '서버오류' : res.msg}</small>`,
                        function () {
                            $("#btnMailPrev").trigger("click");
                        }
                    );
                    return;
                }
                else {
                    $(document).attr("title",$("#sServiceName").val());
                    $("#copyright").html(escapeHtml($("#sCopyright").val()));

                    setTimeout(function() {
                        $("#sMailServer").focus().select();
                    }, 500);
                }
            },
            error: function(xhr, status, error) {
                e.stopImmediatePropagation();
                showCloseModal(
                    "서비스정보 입력",
                    "서비스정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>통신오류</small>",
                    function () {
                        $("#btnMailPrev").trigger("click");
                    }
                )
            }
        });
    });

    $("#btnMailPrev").on("click", function (e) {
        setTimeout(function() {
            $("#sServiceName").focus().select();
        }, 500);
    });

    $("#btnMailNext").on("click", function (e) {
        e.preventDefault();
        if($("#sMailServer").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일서버의 주소를 입력하세요.",
                function () {
                    $("#sMailServer").focus().select();
                }
            );
            return;
        }

        if($("#nMailPort").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일서버의 포트번호를 입력하세요.",
                function () {
                    $("#nMailPort").focus().select();
                }
            );
            return;
        }

        $("#nMailPort").val($("#nMailPort").val().trim());

        let regOk = REGEX_PORT.test($("#nMailPort").val());
        REGEX_PORT.test($("#nMailPort").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일서버의 포트번호가 유효하지 않습니다.",
                function () {
                    $("#nMailPort").focus().select();
                }
            );
            return;
        }


        if($("#sMailAccount").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일서버의 아이디를 입력하세요.",
                function () {
                    $("#sMailAccount").focus().select();
                }
            );
            return;
        }

        if($("#pMailPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일서버의 비밀번호를 입력하세요.",
                function () {
                    $("#pMailPassword").focus().select();
                }
            );
            return;
        }

        if($("#pConfPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일서버 설정",
                "확인용 비밀번호를 입력하세요.",
                function () {
                    $("#pConfPassword").focus().select();
                }
            );
            return;
        }

        if($("#pMailPassword").val() !== $("#pConfPassword").val()) {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일서버 설정",
                "확인용 비밀번호가 일치하지 않습니다.",
                function () {
                    $("#pConfPassword").focus().select();
                }
            );
            return;
        }

        if($("#sMailSender").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "메일발송시 사용할 보내는이의 메일주소를 입력하세요.",
                function () {
                    $("#sMailSender").focus().select();
                }
            );
            return;
        }

        $("#sMailSender").val($("#sMailSender").val().trim());

        regOk = REGEX_EMAIL.test($("#sMailSender").val());
        REGEX_EMAIL.test($("#sMailSender").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 입력",
                "보내는이의 메일주소가 유효하지 않습니다.",
                function () {
                    $("#sMailSender").focus().select();
                }
            );
            return;
        }

        $.ajax({
            url         : `${PAGE_PARAM.context}/inf/setup/save`,
            type        : "POST",
            data        : {
                "category"      : "mail",
                "sMailServer"   : $("#sMailServer").val(),
                "nMailPort"     : $("#nMailPort").val(),
                "sMailAccount"  : $("#sMailAccount").val(),
                "pMailPassword" : window.btoa($("#sMailAccount").val() + "," + $("#pMailPassword").val()),
                "pConfPassword" : window.btoa($("#sMailAccount").val() + "," + $("#pConfPassword").val()),
                "sMailSender"   : $("#sMailSender").val()
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader(PAGE_PARAM.csrf.header, PAGE_PARAM.csrf.token);
            },
            success: function (res) {
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    $("#pMailPassword").val("");
                    $("#pConfPassword").val("");
                    showCloseModal(
                        "메일설정 입력",
                        `메일설정 정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>${(!res) ? '서버오류' : res.msg}</small>`,
                        function () {
                            $("#btnAdminPrev").trigger("click");
                        }
                    );
                    return;
                }
                else {
                    $("#pMailPassword").val("");
                    $("#pConfPassword").val("");
                    setTimeout(function() {
                        $("#sUserId").focus().select();
                    }, 500);
                }
            },
            error: function(xhr, status, error) {
                e.stopImmediatePropagation();
                $("#pMailPassword").val("");
                $("#pConfPassword").val("");
                showCloseModal(
                    "메일설정 입력",
                    "메일설정 정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>통신오류</small>",
                    function () {
                        $("#btnAdminPrev").trigger("click");
                    }
                )
            }
        });
    });

    $("#btnMailTest").on("click", function (e) {
        e.preventDefault();
        if($("#sMailServer").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일서버의 주소를 입력하세요.",
                function () {
                    $("#sMailServer").focus().select();
                }
            );
            return;
        }

        if($("#nMailPort").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일서버의 포트번호를 입력하세요.",
                function () {
                    $("#nMailPort").focus().select();
                }
            );
            return;
        }

        $("#nMailPort").val($("#nMailPort").val().trim());

        let regOk = REGEX_PORT.test($("#nMailPort").val());
        REGEX_PORT.test($("#nMailPort").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일서버의 포트번호가 유효하지 않습니다.",
                function () {
                    $("#nMailPort").focus().select();
                }
            );
            return;
        }


        if($("#sMailAccount").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일서버의 아이디를 입력하세요.",
                function () {
                    $("#sMailAccount").focus().select();
                }
            );
            return;
        }

        if($("#pMailPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일서버의 비밀번호를 입력하세요.",
                function () {
                    $("#pMailPassword").focus().select();
                }
            );
            return;
        }

        if($("#pConfPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일서버 설정",
                "확인용 비밀번호를 입력하세요.",
                function () {
                    $("#pConfPassword").focus().select();
                }
            );
            return;
        }

        if($("#pMailPassword").val() !== $("#pConfPassword").val()) {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일서버 설정",
                "확인용 비밀번호가 일치하지 않습니다.",
                function () {
                    $("#pConfPassword").focus().select();
                }
            );
            return;
        }

        if($("#sMailSender").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "메일설정 테스트",
                "메일발송시 사용할 보내는이의 메일주소를 입력하세요.",
                function () {
                    $("#sMailSender").focus().select();
                }
            );
            return;
        }

        $("#sMailSender").val($("#sMailSender").val().trim());

        regOk = REGEX_EMAIL.test($("#sMailSender").val());
        REGEX_EMAIL.test($("#sMailSender").val());
        if(!regOk) {
            showCloseModal(
                "메일설정 테스트",
                "보내는이의 메일주소가 유효하지 않습니다.",
                function () {
                    $("#sMailSender").focus().select();
                }
            );
            return;
        }

        let test_callback = function test_callback(modal, inst) {
            modal.hide();
            $.ajax({
                url         : `${PAGE_PARAM.context}/inf/setup/mailtest`,
                type        : "POST",
                data        : {
                    "server"   : $("#sMailServer").val(),
                    "port"     : $("#nMailPort").val(),
                    "account"  : $("#sMailAccount").val(),
                    "password" : $("#pMailPassword").val(),
                    "sender"   : $("#sMailSender").val(),
                    "receiver" : $("#testEmail").val()
                },
                beforeSend : function(xhr) {
                    xhr.setRequestHeader(PAGE_PARAM.csrf.header, PAGE_PARAM.csrf.token);
                },
                success: function (res) {
                    if(!res || res.code !== 0) {
                        showCloseModal(
                            "메일설정 테스트",
                            `메일설정을 테스트하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>${(!res) ? '서버오류' : res.msg}</small>`,
                            function () {
                                if(res && res.code === 102) {
                                    location.href = `${PAGE_PARAM.context}/logout`;
                                }
                                else {
                                    modal.show();
                                    $("#testEmail").focus().select();
                                }
                            }
                        );
                        return;
                    }
                    else {
                        inst.hide();
                        showCloseModal(
                            "메일설정 테스트",
                            res.msg,
                            function () {
                                $("#testEmail").focus().select();
                            }
                        );
                    }
                },
                error: function(xhr, status, error) {
                    showCloseModal(
                        "메일설정 테스트",
                        "메일설정을 테스트하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.<br><br><small>오류내용:</small> <small>통신오류</small>",
                        function () {
                            modal.show();
                            $("#testEmail").focus().select();
                        }
                    )
                }
            });
        }

        showMailTestModal(test_callback);
    });

    $("#btnAdminPrev").on("click", function (e) {
        setTimeout(function() {
            $("#sServiceName").focus().select();
        }, 500);
    });

    $("#btnSaveAdmin").on("click", function (e) {
        e.preventDefault();
        if($("#sUserId").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "아이디를 입력하세요.",
                function () {
                    $("#sUserId").focus().select();
                }
            );
            return;
        }

        $("#sUserId").val($("#sUserId").val().trim());

        let regOk = REGEX_ID.test($("#sUserId").val());
        REGEX_ID.test($("#sUserId").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "아이디는 5 ~ 32문자로서 숫자 또는 영문으로만 입력해야 합니다.",
                function () {
                    $("#sUserId").focus().select();
                }
            );
            return;
        }

        if($("#sEmail").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "이메일 주소를 입력하세요.",
                function () {
                    $("#sEmail").focus().select();
                }
            );
            return;
        }

        $("#sEmail").val($("#sEmail").val().trim());

        regOk = REGEX_EMAIL.test($("#sEmail").val());
        REGEX_EMAIL.test($("#sEmail").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "이메일주소의 형식이 유효하지 않습니다.",
                function () {
                    $("#sEmail").focus().select();
                }
            );
            return;
        }

        if($("#sUserName").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "이름을 입력하세요.",
                function () {
                    $("#sUserName").focus().select();
                }
            );
            return;
        }

        if($("#sPhone").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "전화번호를 입력하세요.",
                function () {
                    $("#sPhone").focus().select();
                }
            );
            return;
        }

        if($("#sCellNo").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "휴대전화번호를 입력하세요.",
                function () {
                    $("#sCellNo").focus().select();
                }
            );
            return;
        }

        $("#sCellNo").val($("#sCellNo").val().trim());

        regOk = REGEX_CELLNO.test($("#sCellNo").val());
        REGEX_CELLNO.test($("#sCellNo").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "휴대전화번호의 형식이 유효하지 않습니다.",
                function () {
                    $("#sCellNo").focus().select();
                }
            );
            return;
        }

        if($("#sPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "비밀번호를 입력하세요.",
                function () {
                    $("#sPassword").focus().select();
                }
            );
            return;
        }

        if($("#sConfPassword").val() === "") {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "확인용 비밀번호를 입력하세요.",
                function () {
                    $("#sConfPassword").focus().select();
                }
            );
            return;
        }

        if($("#sPassword").val() !== $("#sConfPassword").val()) {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "확인용 비밀번호가 일치하지 않습니다.",
                function () {
                    $("#sConfPassword").focus().select();
                }
            );
            return;
        }

        $.ajax({
            url         : `${PAGE_PARAM.context}/inf/setup/save`,
            type        : "POST",
            data        : {
                "category"      : "admin",
                "sUserId"       : $("#sUserId").val(),
                "sEmail"        : $("#sEmail").val(),
                "sUserName"     : $("#sUserName").val(),
                "sCellNo"       : $("#sCellNo").val(),
                "sPassword"     : window.btoa($("#sUserId").val() + "," + $("#sPassword").val()),
                "sConfPassword" : window.btoa($("#sUserId").val() + "," + $("#sConfPassword").val())
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader(PAGE_PARAM.csrf.header, PAGE_PARAM.csrf.token);
            },
            success: function (res) {
                $("#sPassword").val("");
                $("#sConfPassword").val("");
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    showCloseModal(
                        "관리자정보 입력",
                        `관리자정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>${(!res) ? '서버오류' : res.msg}</small>`,
                        function () {
                            $("#sUserId").focus().select();
                        }
                    );
                    return;
                }
                else {
                    $("#code").val(res.installCode);
                    // initialization of clipboard
                    $('.js-clipboard').each(function() {
                        $.HSCore.components.HSClipboard.init(this);
                    });
                    $("#btnSaveAdmin").hide();
                    $("#btnSetupFinish").show().trigger("click");
                }
            },
            error: function(xhr, status, error) {
                $("#sPassword").val("");
                $("#sConfPassword").val("");
                e.stopImmediatePropagation();
                showCloseModal(
                    "관리자정보 입력",
                    "관리자정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요. <br><br><small>오류내용:</small> <small>통신오류</small>",
                    function () {
                        $("#sUserId").focus().select();
                    }
                )
            }
        });
    });

    initTextKeydownBind($("#sCompanyName"), true, $("#sCompanyAddr"), "focus");
    initTextKeydownBind($("#sCompanyAddr"), true, $("#sCompanyPhone"), "focus");
    initTextKeydownBind($("#sCompanyPhone"), true, $("#btnCompanyNext"), "click");

    initTextKeydownBind($("#sServiceName"), true, $("#sServiceAddr"), "focus");
    initTextKeydownBind($("#sServiceAddr"), true, $("#sAdminAllowedIp"), "focus");
    initTextKeydownBind($("#sAdminAllowedIp"), true, $("#sCopyright"), "focus");
    initTextKeydownBind($("#sCopyright"), true, $("#btnServiceNext"), "click");

    initTextKeydownBind($("#sMailServer"), true, $("#nMailPort"), "focus");
    initTextKeydownBind($("#nMailPort"), true, $("#sMailAccount"), "focus");
    initTextKeydownBind($("#sMailAccount"), true, $("#pMailPassword"), "focus");
    initTextKeydownBind($("#pMailPassword"), true, $("#pConfPassword"), "focus");
    initTextKeydownBind($("#pConfPassword"), true, $("#sMailSender"), "focus");
    initTextKeydownBind($("#sMailSender"), true, $("#btnMailNext"), "click");

    initTextKeydownBind($("#sUserId"), true, $("#sEmail"), "focus");
    initTextKeydownBind($("#sEmail"), true, $("#sUserName"), "focus");
    initTextKeydownBind($("#sUserName"), true, $("#sCellNo"), "focus");
    initTextKeydownBind($("#sCellNo"), true, $("#sPassword"), "focus");
    initTextKeydownBind($("#sPassword"), true, $("#sConfPassword"), "focus");
    initTextKeydownBind($("#sConfPassword"), true, $("#btnSaveAdmin"), "click");

    $('.js-step-form').each(function () {
        var stepForm = new HSStepForm($(this), {
            finish: function() {
                $("#stepFormProgress").hide();
                $("#stepFormContent").hide();
                $("#stepSuccessMessage").show();
            }
        }).init();
    });

    $('.js-file-attach').each(function () {
        var customFile = new HSFileAttach($(this)).init();
    });

    $("#sCompanyName").focus().select();

});

if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) document.write('<script src="' + PAGE_PARAM.context + '/resources/assets/vendor/babel-polyfill/polyfill.min.js"><\/script>');