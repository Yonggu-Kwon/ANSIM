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

    <title>안심 보안USB 시스템</title>

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
    <div class="position-fixed top-0 right-0 left-0 bg-img-hero" style="height: 32rem;">
        <!-- SVG Bottom Shape -->
        <figure class="position-absolute right-0 bottom-0 left-0">
            <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1921 273">
                <polygon fill="#fff" points="0,273 1921,273 1921,0 "/>
            </svg>
        </figure>
        <!-- End SVG Bottom Shape -->
    </div>

    <!-- Content -->
    <div class="container py-5 py-sm-7">

        <div class="row justify-content-center">
            <div class="col-md-7 col-lg-5">
                <!-- Card -->
                <div class="card card-lg mb-5">
                    <div class="card-body">
                        <!-- Form -->
                        <form class="js-validate"
                              method="get"
                              id="frmLogin"
                              action="${pageContext.request.contextPath}/signin"
                        >
                            <div class="text-center">
                                <img class="z-index-2 mb-4" src="${pageContext.request.contextPath}/resources/assets/svg/logos/logo-ansim.png" alt="안심보안USB서버" style="max-height: 3rem;">
                                <span class="divider text-muted mb-4"><h3>오류번호 : 500</h3></span>
                            </div>

                            <!-- Form Group -->
                            <div class="js-form-message form-group mb-4">
                                <p>요청하신 처리하는 과정에서 서버에서 오류가 발생했습니다.</p>
                                <p>입력하신 URL을 다시 확인하신 후 이 오류가 계속 발생하면 관리자에게 문의하시기 바랍니다.</p>
                            </div>
                            <!-- End Form Group -->

                            <button type="submit" class="btn btn-sm btn-block btn-primary">로그인 화면으로 이동</button>
                        </form>
                        <!-- End Form -->
                    </div>
                </div>
                <!-- End Card -->

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

<!-- JS Implementing Plugins -->
<script src="${pageContext.request.contextPath}/resources/assets/vendor/hs-toggle-password/dist/js/hs-toggle-password.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/vendor/jquery-validation/dist/jquery.validate.min.js"></script>

<!-- JS Front -->
<script src="${pageContext.request.contextPath}/resources/assets/js/theme.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/assets/js/common.js"></script>

</body>
</html>