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

    <!-- CSS Front Template -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/assets/css/theme.css">
</head>

<body>
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
                        <div class="row justify-content-center">
                            <div class="col-2"></div>
                            <!-- Message Body -->
                            <div class="col-8">
                                <div class="text-center">
                                    <img class="img-fluid mb-3" src="${pageContext.request.contextPath}/resources/assets/svg/illustrations/undraw_bug_fixing_oc7a.svg" alt="접근오류" style="max-width: 15rem;">

                                    <div class="mb-4 justify-content-center">
                                        <h2 class="text-danger">시스템 접근 오류</h2>
                                        <p><c:out value="${service.sServiceName}"/>의 접근이 허가되지 않았습니다.<br>세션이 만료되었거나 PC에이전트를 이용한 접근이 아닌 경우 <b>시스템 접근 오류</b>가 발생합니다. </p>
                                        <p>PC에이전트를 아직 설치하지 않은 경우에는 아래의 <b class="text-primary">PC에이전트 다운로</b> 버튼을 클릭하여 PC에이전트를 다운로드 및 설치한 후 PC에이전트를 이용하여 다시 시도하세요. (설치코드는 관리자에게 문의하세요.)</p>
                                    </div>

                                    <div class="d-flex justify-content-center">
                                        <a class="btn btn-sm btn-primary" href="${pageContext.request.contextPath}/agent">
                                            <i class="tio-download mr-1"></i> PC에이전트 다운로드
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- End Message Body -->
                            <div class="col-2"></div>
                        </div>
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

<%@include file="/include/common_modal.jsp"%>

<!-- JS Global Compulsory  -->
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery/dist/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery-migrate/dist/jquery-migrate.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<!-- JS Front -->
<script src="${pageContext.request.contextPath}/resources/assets/js/theme.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/js/common.js"></script>

</body>
</html>