$(document).on('ready', function () {
    // initialization of tagify
    $('.js-tagify').each(function () {
        var tagify = $.HSCore.components.HSTagify.init($(this), {
            originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
        });

        $(this).data("tagify", tagify);
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
                        "회사정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
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
                    "회사정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
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
                        "서비스정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
                        function () {
                            $("#sServiceName").focus().select();
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
                    "서비스정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
                    function () {
                        $("#sServiceName").focus().select();
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

        let formData = new FormData();

        formData.append("category", "mail");
        formData.append("sMailServer", $("#sMailServer").val());
        formData.append("nMailPort", $("#nMailPort").val());
        formData.append("sMailAccount", $("#sMailAccount").val());
        formData.append("pMailPassword", $("#pMailPassword").val());
        formData.append("sMailSender", $("#sMailSender").val());
        formData.append("bMailSsl", "0");

        $.ajax({
            url         : `${PAGE_PARAM.context}/interface/setup/save`,
            type        : "POST",
            processData : false,
            contentType : false,
            async       : false,
            data        : formData,
            success: function (res) {
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    showCloseModal(
                        "메일설정 입력",
                        "메일설정 정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
                        function () {
                            $("#sMailServer").focus().select();
                        }
                    );
                    return;
                }
                else {
                    setTimeout(function() {
                        $("#sUserId").focus().select();
                    }, 500);
                }
            },
            error: function(xhr, status, error) {
                e.stopImmediatePropagation();
                showCloseModal(
                    "메일설정 입력",
                    "메일설정 정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
                    function () {
                        $("#sMailServer").focus().select();
                    }
                )
            }
        });
    });

    $("#btnAdminPrev").on("click", function (e) {
        setTimeout(function() {
            $("#sServiceName").focus().select();
        }, 500);
    });

    $("#btnSetupFinish").on("click", function (e) {
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

        $("#sPhone").val($("#sPhone").val().trim());

        regOk = REGEX_PHONENO.test($("#sPhone").val());
        REGEX_PHONENO.test($("#sPhone").val());
        if(!regOk) {
            e.stopImmediatePropagation();
            showCloseModal(
                "관리자정보 입력",
                "전화번호의 형식이 유효하지 않습니다.",
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

        let formData = new FormData();

        formData.append("category", "admin");
        formData.append("sUserId", $("#sUserId").val());
        formData.append("sEmail", $("#sEmail").val());
        formData.append("sUserName", $("#sUserName").val());
        formData.append("sPhone", $("#sPhone").val());
        formData.append("sCellNo", $("#sCellNo").val());
        formData.append("sPassword", window.btoa($("#sUserId").val() + "," + $("#sPassword").val()));
        formData.append("image", $("#picture").val() === "" ? "" : $("#picture")[0].files[0]);

        $.ajax({
            url         : `${PAGE_PARAM.context}/interface/setup/save`,
            type        : "POST",
            processData : false,
            contentType : false,
            async       : false,
            data        : formData,
            success: function (res) {
                if(!res || res.code !== 0) {
                    e.stopImmediatePropagation();
                    showCloseModal(
                        "관리자정보 입력",
                        "관리자정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
                        function () {
                            $("#sUserId").focus().select();
                        }
                    );
                    return;
                }
            },
            error: function(xhr, status, error) {
                e.stopImmediatePropagation();
                showCloseModal(
                    "관리자정보 입력",
                    "관리자정보를 저장하는 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.",
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

    initTextKeydownBind($("#sUserId"), true, $("#sEmail"), "focus");
    initTextKeydownBind($("#sEmail"), true, $("#sUserName"), "focus");
    initTextKeydownBind($("#sUserName"), true, $("#sPhone"), "focus");
    initTextKeydownBind($("#sCellNo"), true, $("#sPassword"), "focus");
    initTextKeydownBind($("#sPassword"), true, $("#sConfPassword"), "focus");
    initTextKeydownBind($("#sConfPassword"), true, $("#btnSetupFinish"), "click");

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