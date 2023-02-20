<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required Meta Tags Always Come First -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>ANSIM USB v3.0</title>

    <!-- Favicon -->
    <link rel="shortcut icon" href="${pageContext.request.contextPath}/resources/assets/svg/logos/logo-ansim-short.png">

    <!-- CSS Implementing Plugins -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/assets/vendor/icon-set/style.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/assets/vendor/@yaireo/tagify/dist/tagify.css">

    <!-- CSS Front Template -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/assets/css/theme.css">
</head>

<body data-param='{
        "context"       : "${pageContext.request.contextPath}",
        "serviceName"   : "${service.sServiceName}",
        "csrf"          : {
            "header"    : "${_csrf.headerName}",
            "name"      : "${_csrf.parameterName}",
            "token"     : "${_csrf.token}"
        }
    }'
>
<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main" class="main">
    <div class="position-fixed top-0 right-0 left-0 bg-img-hero" style="height: 32rem; background-image: url(${pageContext.request.contextPath}/resources/assets/svg/components/abstract-bg-2.svg);">
        <!-- SVG Bottom Shape -->
        <figure class="position-absolute right-0 bottom-0 left-0">
            <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1921 273">
                <polygon fill="#fff" points="0,273 1921,273 1921,0 "/>
            </svg>
        </figure>
        <!-- End SVG Bottom Shape -->
    </div>

    <!-- Content -->
    <div class="container py-2">
        <a class="d-flex justify-content-center align-items-center mb-3" href="javascript:;">
            <img class="z-index-2" src="${pageContext.request.contextPath}/resources/assets/svg/logos/logo-ansim.png" alt="ANSIM USB v3.0" style="width: 8rem;">
        </a>

        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-7">
                <!-- Card -->
                <div class="card card-lg mb-5">
                    <div class="card-body">
                        <!-- Step Form -->
                        <form id="formSetup"
                              class="js-step-form"
                              data-hs-step-form-options='{
                                "progressSelector": "#stepFormProgress",
                                "stepsSelector"   : "#stepFormContent",
                                "endSelector"     : "#btnSetupFinish"
                              }'
                        >
                            <!-- Step -->
                            <ul id="stepFormProgress" class="js-step-progress step step-sm step-icon-sm step-inline step-item-between mb-7">
                                <li class="step-item">
                                    <a class="step-content-wrapper" href="javascript:;">
                                        <span class="step-icon step-icon-soft-dark">1</span>
                                        <div class="step-content">
                                            <span class="step-title">회사정보</span>
                                        </div>
                                    </a>
                                </li>

                                <li class="step-item">
                                    <a class="step-content-wrapper" href="javascript:;">
                                        <span class="step-icon step-icon-soft-dark">2</span>
                                        <div class="step-content">
                                            <span class="step-title">서비스설정</span>
                                        </div>
                                    </a>
                                </li>

                                <li class="step-item">
                                    <a class="step-content-wrapper" href="javascript:;">
                                        <span class="step-icon step-icon-soft-dark">2</span>
                                        <div class="step-content">
                                            <span class="step-title">메일설정</span>
                                        </div>
                                    </a>
                                </li>

                                <li class="step-item">
                                    <a class="step-content-wrapper" href="javascript:;">
                                        <span class="step-icon step-icon-soft-dark">3</span>
                                        <div class="step-content">
                                            <span class="step-title">관리자등록</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <!-- End Step -->

                            <!-- Content Step Form -->
                            <div id="stepFormContent">
                                <div id="stepCompany" class="active">
                                    <h4 class="border-bottom pb-3 mb-4">회사정보</h4>

                                    <!-- Form -->
                                    <form>

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sCompanyName" class="col-sm-3 col-form-label col-form-label-sm input-label">회사명</label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sCompanyName" id="sCompanyName" value="${company.sCompanyName}" placeholder="회사명 입력" aria-label="sCompanyName">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sCompanyAddr" class="col-sm-3 col-form-label col-form-label-sm input-label">회사주소</label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sCompanyAddr" id="sCompanyAddr" value="${company.sCompanyAddr}" placeholder="회사주소 입력" aria-label="sCompanyAddr">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sCompanyPhone" class="col-sm-3 col-form-label col-form-label-sm input-label">전화번호</label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sCompanyPhone" id="sCompanyPhone" value="${company.sCompanyPhone}" placeholder="전화번호 입력" aria-label="sCompanyPhone">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                    </form>
                                    <!-- End Form -->

                                    <!-- Footer -->
                                    <div class="d-flex align-items-center">
                                        <div class="ml-auto">
                                            <button type="button"
                                                    id="btnCompanyNext"
                                                    class="btn btn-primary btn-sm"
                                                    data-hs-step-form-next-options='{
                                                        "targetSelector": "#stepService"
                                                      }'
                                            >
                                                다음
                                                <i class="tio-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- End Footer -->
                                </div>

                                <div id="stepService" style="display: none;">
                                    <h4 class="border-bottom pb-3 mb-4">서비스설정</h4>

                                    <!-- Form -->
                                    <form>

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sServiceName" class="col-sm-3 col-form-label col-form-label-sm input-label">서비스명</label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sServiceName" id="sServiceName" value="${service.sServiceName}" placeholder="서비스명 입력" aria-label="sServiceName">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sServiceAddr" class="col-sm-3 col-form-label col-form-label-sm input-label">
                                                서비스주소
                                                <i class="tio-help-outlined text-body ml-1" data-toggle="tooltip" data-placement="top" title="이메일 발송시 링크 주소생성에 사용되는 주소입니다."></i>
                                            </label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sServiceAddr" id="sServiceAddr" value="${service.sServiceAddr}" placeholder="서비스주소 입력" aria-label="sServiceAddr">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label class="col-sm-3 col-form-label col-form-label-sm input-label">
                                                관리자IP주소
                                                <i class="tio-help-outlined text-body ml-1" data-toggle="tooltip" data-placement="top" title="관리자가 접속할 수 있는 IP주소 입니다. 최대 50개 까지 등록할 수 있습니다."></i>
                                            </label>

                                            <div class="col-sm-9">
                                                <div class="d-flex align-items-center w-100">
                                                    <input type="text"
                                                           id="sAdminAllowedIp"
                                                           class="js-tagify tagify-form-control form-control form-control-sm"
                                                           placeholder="허가 할 IP 입력"
                                                           pattern="^(1|2)?\d?\d([.](1|2)?\d?\d){3}$"
                                                           value="${service.sAdminAllowedIp}"
                                                           data-hs-tagify-options='{
                                                            "maxTags" : 50
                                                           }'
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sCopyright" class="col-sm-3 col-form-label col-form-label-sm input-label">서비스 저작권</label>

                                            <div class="col-sm-9">
                                                <input type="text" class="form-control form-control-sm" name="sCopyright" id="sCopyright" value="${service.sCopyright}" placeholder="서비스 저작권 입력" aria-label="sCopyright">
                                            </div>
                                        </div>
                                        <!-- End Form Group -->
                                    </form>
                                    <!-- End Form -->

                                    <!-- Footer -->
                                    <div class="d-flex align-items-center">
                                        <button type="button"
                                                id="btnServicePrev"
                                                class="btn btn-sm btn-outline-secondary mr-2"
                                                data-hs-step-form-prev-options='{
                                                     "targetSelector": "#stepCompany"
                                                   }'
                                        >
                                            <i class="tio-chevron-left"></i> 이전
                                        </button>

                                        <div class="ml-auto">
                                            <button type="button"
                                                    id="btnServiceNext"
                                                    class="btn btn-primary btn-sm"
                                                    data-hs-step-form-next-options='{
                                                        "targetSelector": "#stepMail"
                                                      }'
                                            >
                                                다음
                                                <i class="tio-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- End Footer -->
                                </div>

                                <div id="stepMail" style="display: none;">
                                    <h4 class="border-bottom pb-3 mb-4">메일설정</h4>

                                    <!-- Form -->
                                    <form>
                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sMailServer" class="col-sm-3 col-form-label col-form-label-sm input-label">서버주소</label>

                                            <div class="col-sm-9">
                                                <input type="text"
                                                       class="form-control form-control-sm"
                                                       name="sMailServer"
                                                       id="sMailServer"
                                                       value="${mail.sMailServer}"
                                                       placeholder="서버주소"
                                                       aria-label="sMailServer"
                                                       maxlength="128"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="nMailPort" class="col-sm-3 col-form-label col-form-label-sm input-label">포트번호</label>

                                            <div class="col-sm-9">
                                                <input type="number"
                                                       class="form-control form-control-sm"
                                                       name="nMailPort"
                                                       id="nMailPort"
                                                       value="${mail.nMailPort}"
                                                       placeholder="포트번호"
                                                       aria-label="nMailPort"
                                                       maxlength="5"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sMailAccount" class="col-sm-3 col-form-label col-form-label-sm input-label">아이디</label>

                                            <div class="col-sm-9">
                                                <input type="text"
                                                       class="form-control form-control-sm"
                                                       name="sMailAccount"
                                                       id="sMailAccount"
                                                       value="${mail.sMailAccount}"
                                                       placeholder="아이디"
                                                       aria-label="sMailAccount"
                                                       maxlength="32"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="pMailPassword" class="col-sm-3 col-form-label col-form-label-sm input-label">비밀번호</label>

                                            <div class="col-sm-9">
                                                <input type="password"
                                                       class="form-control form-control-sm"
                                                       name="pMailPassword"
                                                       id="pMailPassword"
                                                       placeholder="비밀번호"
                                                       aria-label="비밀번호"
                                                       maxlength="32"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="pConfPassword" class="col-sm-3 col-form-label col-form-label-sm input-label">비밀번호 확인</label>

                                            <div class="col-sm-9">
                                                <input type="password"
                                                       class="form-control form-control-sm"
                                                       name="pConfPassword"
                                                       id="pConfPassword"
                                                       placeholder="비밀번호 확인"
                                                       aria-label="비밀번호 확인"
                                                       maxlength="32"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sMailSender" class="col-sm-3 col-form-label col-form-label-sm input-label">
                                                발신주소
                                                <i class="tio-help-outlined text-body ml-1" data-toggle="tooltip" data-placement="top" title="이메일 발송시 사용되는 주소입니다."></i>
                                            </label>

                                            <div class="col-sm-9">
                                                <input type="email"
                                                       class="form-control form-control-sm"
                                                       name="sMailSender"
                                                       id="sMailSender"
                                                       value="${mail.sMailSender}"
                                                       placeholder="발신주소"
                                                       aria-label="sMailSender"
                                                       maxlength="256"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                    </form>
                                    <!-- End Form -->

                                    <!-- Footer -->
                                    <div class="d-flex align-items-center">
                                        <button type="button"
                                                id="btnMailPrev"
                                                class="btn btn-sm btn-outline-secondary mr-2"
                                                data-hs-step-form-prev-options='{
                                                     "targetSelector": "#stepService"
                                                   }'
                                        >
                                            <i class="tio-chevron-left"></i> 이전
                                        </button>

                                        <div class="ml-auto">
                                            <button type="button"
                                                    class="btn btn-sm btn-success"
                                                    id="btnMailTest"
                                            >
                                                <i class="tio-send"></i> 테스트
                                            </button>

                                            <button type="button"
                                                    class="btn btn-sm btn-primary"
                                                    id="btnMailNext"
                                                    data-hs-step-form-next-options='{
                                                        "targetSelector": "#stepAdmin"
                                                      }'
                                            >
                                                다음 <i class="tio-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- End Footer -->
                                </div>

                                <div id="stepAdmin" style="display: none;">
                                    <h4 class="border-bottom pb-3 mb-4">관리자등록</h4>

                                    <!-- Form -->
                                    <form>

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sUserId" class="col-sm-3 col-form-label col-form-label-sm input-label">아이디</label>

                                            <div class="col-sm-9">
                                                <input type="text"
                                                       class="form-control form-control-sm"
                                                       name="sUserId"
                                                       id="sUserId"
                                                <c:if test="${admin != null}">
                                                        value = "${admin.userId}"
                                                       readonly
                                                </c:if>
                                                       maxlength="32"
                                                       placeholder="5 ~ 32문자의 길이로 숫자 및 영문자"
                                                       aria-label="sUserId"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sEmail" class="col-sm-3 col-form-label col-form-label-sm input-label">이메일</label>

                                            <div class="col-sm-9">
                                                <input type="email"
                                                       class="form-control form-control-sm"
                                                       name="sEmail"
                                                       id="sEmail"
                                                <c:if test="${admin != null}">
                                                       value = "${admin.email}"
                                                </c:if>
                                                       maxlength="256"
                                                       placeholder="이메일"
                                                       aria-label="sEmail"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sUserName" class="col-sm-3 col-form-label col-form-label-sm input-label">이름</label>

                                            <div class="col-sm-9">
                                                <input type="text"
                                                       class="form-control form-control-sm"
                                                       name="sUserName"
                                                       id="sUserName"
                                                <c:if test="${admin != null}">
                                                       value = "${admin.userName}"
                                                </c:if>
                                                       maxlength="100"
                                                       placeholder="이름"
                                                       aria-label="sUserName"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sCellNo" class="col-sm-3 col-form-label col-form-label-sm input-label">휴대전화</label>

                                            <div class="col-sm-9">
                                                <input type="text"
                                                       class="form-control form-control-sm"
                                                       name="sCellNo"
                                                       id="sCellNo"
                                                <c:if test="${admin != null}">
                                                       value = "${admin.cellNo}"
                                                </c:if>
                                                       maxlength="50"
                                                       placeholder="휴대전화"
                                                       aria-label="sCellNo"
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sPassword" class="col-sm-3 col-form-label col-form-label-sm input-label">비밀번호</label>

                                            <div class="col-sm-9">
                                                <input type="password"
                                                       class="form-control form-control-sm"
                                                       name="sPassword"
                                                       id="sPassword"
                                                       placeholder="비밀번호"
                                                       aria-label="비밀번호"
                                                       required
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                        <!-- Form Group -->
                                        <div class="row form-group mb-3">
                                            <label for="sConfPassword" class="col-sm-3 col-form-label col-form-label-sm input-label">비밀번호 확인</label>

                                            <div class="col-sm-9">
                                                <input type="password"
                                                       class="form-control form-control-sm"
                                                       name="sConfPassword"
                                                       id="sConfPassword"
                                                       placeholder="비밀번호 확인"
                                                       aria-label="비밀번호 확인"
                                                       required
                                                >
                                            </div>
                                        </div>
                                        <!-- End Form Group -->

                                    </form>
                                    <!-- End Form -->

                                    <!-- Footer -->
                                    <div class="d-sm-flex align-items-center">
                                        <button type="button"
                                                id="btnAdminPrev"
                                                class="btn btn-sm btn-outline-secondary mb-3 mb-sm-0 mr-2"
                                                data-hs-step-form-prev-options='{
                                                     "targetSelector": "#stepMail"
                                                   }'
                                        >
                                            <i class="tio-chevron-left"></i> 이전
                                        </button>

                                        <div class="d-flex justify-content-end ml-auto">
                                            <button id="btnSaveAdmin" type="button" class="btn btn-sm btn-primary mr-1">저장</button>
                                            <button id="btnSetupFinish"
                                                    type="button"
                                                    class="btn btn-sm btn-dark"
                                                    <c:if test="${admin == null}">
                                                    style="display: none"
                                                    </c:if>
                                            >
                                                완료
                                            </button>
                                        </div>
                                    </div>
                                    <!-- End Footer -->
                                </div>
                            </div>
                            <!-- End Content Step Form -->

                            <!-- Message Body -->
                            <div id="stepSuccessMessage" style="display:none;">
                                <div class="text-center">
                                    <img class="img-fluid mb-3" src="${pageContext.request.contextPath}/resources/assets/svg/illustrations/undraw_work_together_h63l.svg" alt="설정완료" style="max-width: 15rem;">

                                    <div class="mb-4 justify-content-center">
                                        <h2>시스템 설정 완료</h2>
                                        <p><c:out value="${service.sServiceName}"/>의 시스템 설정이 완료되었습니다.<br>다음의 설치코드를 이용하여 PC에이전트를 설치한 후 접속할 수 있습니다.</p>
                                    </div>

                                    <div class="row mb-3">
                                        <div class="col-3"></div>
                                        <div class="col-6">
                                            <!-- Input Group -->
                                            <div class="input-group input-group-merge text-center">
                                                <input type="text"
                                                       id="code"
                                                       class="form-control"
                                                       readonly
                                                <c:if test="${agent != null}">
                                                       value="${agent.code}"
                                                </c:if>
                                                >

                                                <a class="js-clipboard input-group-append" href="javascript:;"
                                                   data-hs-clipboard-options='{
                                                           "contentTarget": "#code",
                                                           "classChangeTarget": "#iconExampleLinkIcon",
                                                           "defaultClass": "tio-copy",
                                                           "successClass": "tio-done"
                                                         }'>
                                                    <span class="input-group-text">
                                                      <span id="iconExampleLinkIcon" class="tio-copy"></span>
                                                    </span>
                                                </a>
                                            </div>
                                            <!-- End Input Group -->
                                        </div>
                                        <div class="col-3"></div>
                                    </div>

                                    <div class="d-flex justify-content-center">
                                        <a class="btn btn-sm btn-primary" href="${pageContext.request.contextPath}/agent">
                                            <i class="tio-download mr-1"></i> PC에이전트 다운로드
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- End Message Body -->
                        </form>
                        <!-- End Step Form -->
                    </div>
                </div>
                <!-- End Card -->

                <!-- Footer -->
                <div class="text-center">
                    <c:if test="${service.sCopyright == null or service.sCopyright == ''}">
                        <small class="text-cap mb-4" id="copyright">&copy; COPYRIGHT 2022, Bizet Inc. All rights reserved.</small>
                    </c:if>
                    <c:if test="${service.sCopyright != null and service.sCopyright != ''}">
                        <small class="text-cap mb-4" id="copyright"><c:out value="${service.sCopyright}"/></small>
                    </c:if>
                </div>
                <!-- End Footer -->
            </div>
        </div>
    </div>
    <!-- End Content -->
</main>
<!-- ========== END MAIN CONTENT ========== -->

<!-- Modal -->
<div id="modalMailTest" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalMailTest" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">메일테스트</h5>
                <button type="button" class="btn btn-xs btn-icon btn-ghost-secondary" data-dismiss="modal" aria-label="Close">
                    <i class="tio-clear tio-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <form class="js-validate"
                      id="formMailTest"
                >
                    <div class="mb-3 font-size-sm">
                        <blockquote class="blockquote">
                            <small>
                                메일서버 설정내용을 적용하여 실제 메일이 정상적으로 발송되는지 확인할 수 있습니다. 아래 메일을 수신할 이메일 주소를 입력한 후 <b>테스트</b> 버튼을 클릭하세요.
                            </small>
                        </blockquote>
                    </div>
                    <!-- Form Group -->
                    <div class="js-form-message form-group mb-2">
                        <label class="input-label" for="testEmail">이메일</label>

                        <input type="email"
                               class="form-control form-control-sm"
                               name="testEmail"
                               id="testEmail"
                               tabindex="1"
                               placeholder="이메일주소"
                               aria-label="testEmail"
                               required
                               data-msg="유효한 이메일주소를 입력하세요."
                               maxlength="256"
                        >
                    </div>
                    <!-- End Form Group -->
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-xs btn-modal-test">테스트</button>
                <button type="button" class="btn btn-white btn-xs" data-dismiss="modal">취소</button>
            </div>
        </div>
    </div>
</div>
<!-- End Modal -->

<%@include file="/include/common_modal.jsp"%>

<!-- JS Global Compulsory  -->
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery/dist/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery-migrate/dist/jquery-migrate.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<!-- JS Implementing Plugins -->
<script src="${pageContext.request.contextPath}/resources/assets/vendor/hs-step-form/dist/hs-step-form.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/@yaireo/tagify/dist/jQuery.tagify.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/clipboard/dist/clipboard.js"></script>

<!-- JS Front -->
<script src="${pageContext.request.contextPath}/resources/assets/js/theme.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/js/common.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/js/setup.js"></script>

</body>
</html>