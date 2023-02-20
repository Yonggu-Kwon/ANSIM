package com.ansim.app.controller;

import com.ansim.app.domain.*;
import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.app.service.*;
import com.ansim.security.SHA512PasswordEncoder;
import com.ansim.util.GoogleOTP;
import com.ansim.util.WebUtil;
import com.beust.ah.A;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Log4j2
@RestController
@RequestMapping("/inf")
public class CommonApiController {

    @Setter(onMethod_ = { @Autowired })
    private ServletContext context;

    @Setter(onMethod_ = { @Autowired })
    private ConfigService configService;

    @Setter(onMethod_ = { @Autowired })
    private DeptService deptService;

    @Setter(onMethod_ = { @Autowired })
    private MemberService memberService;

    @Setter(onMethod_ = { @Autowired })
    private PasswordService passwordService;

    @Setter(onMethod_ = { @Autowired })
    private AgentService agentService;

    @Setter(onMethod_ = { @Autowired })
    private MailService mailService;

    @PostMapping(value = "/setup/mailtest", produces = { MediaType.APPLICATION_JSON_UTF8_VALUE })
    public ResponseEntity<Map<String, Object>> mailTest(@RequestParam HashMap<String, String> paramMap, HttpServletRequest request, HttpSession session) {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        log.debug("[API CALLED] : /inf/setup/mailtest");

        String server = WebUtil.getStringVal("server", paramMap, 128);
        int port = WebUtil.getIntVal("port", paramMap);
        String account = WebUtil.getStringVal("account", paramMap, 32);
        String password = WebUtil.getStringVal("password", paramMap, 32);
        String sender = WebUtil.getStringVal("sender", paramMap, 256);
        String receiver = WebUtil.getStringVal("receiver", paramMap, 256);

        if(server.equals("") || port == 0 || account.equals("") || password.equals("") || sender.equals("") || receiver.equals("")) {
            log.debug("[API RESULT] : Invalid Parameter");
            resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
            resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }

        SystemConfigFactory mailFactory = configService.loadSystemConfig("mail");
        SystemConfigFactory serviceFactory = configService.loadSystemConfig("service");

        mailFactory.setNewValue("sMailServer", server);
        mailFactory.setNewValue("nMailPort", "" + port);
        mailFactory.setNewValue("sMailAccount", account);
        mailFactory.setNewValue("sMailSender", sender);
        mailFactory.setNewValue("pMailPassword", password);

        EmailVO emailTemplate = new EmailVO();
        String subject = "[" + serviceFactory.getStringValue("sServiceName") + "] 메일설정 테스트";

        emailTemplate.setFrom(mailFactory.getValue("sMailSender"));
        emailTemplate.setReceiver(receiver);
        emailTemplate.setHtmlYn("html");
        emailTemplate.setSubject(subject);

        Map<String, Object> map = new HashMap<>();
        Map<String, Object> inline = new HashMap<>();

        map.put("app", serviceFactory.getStringValue("sServiceName"));

        inline.put("mail_logo", context.getContextPath() + "/resources/assets/svg/logos/logo-ansim.png");

        emailTemplate.setVelocityTemplate("template/mail_test.vm");
        emailTemplate.setInlineAttach(inline);

        String url = serviceFactory.getStringValue("sServiceAddr");
        if(url == null || url.equals("")) {
            url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + context.getContextPath();
        }
        map.put("url", url);
        emailTemplate.setEmailMap(map);

        boolean success = false;
        String errorMsg = "";
        try {
            mailService.sendEmail(mailFactory, emailTemplate);
            success = true;
        }
        catch (Exception e) {
            errorMsg = e.getMessage();
            e.printStackTrace();
            success = false;
        }

        if(!success) {
            log.debug("[API RESULT] : Failed to send a test email");
            resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
            resultMap.put("msg", errorMsg);
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }

        resultMap.put("code", ErrorVO.ERROR_OK);
        resultMap.put("msg", "메일설정을 이용하여 테스트용 메일이 정상적으로 발송되었습니다.");
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @PostMapping(value = "/setup/save", produces = { MediaType.APPLICATION_JSON_UTF8_VALUE })
    public ResponseEntity<Map<String, Object>> saveSetup(@RequestParam HashMap<String, String> paramMap, HttpServletRequest request, HttpSession session) {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        log.debug("[API CALLED] : /inf/setup/save");

        SystemConfigFactory factory = WebUtil.extractSystemConfig(paramMap);

        if(factory.getCategory().equals("company")) {
            if(factory.getStringValue("sCompanyName").equals("") ||
                    factory.getStringValue("sCompanyAddr").equals("") ||
                    factory.getStringValue("sCompanyPhone").equals("")) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            DeptVO dept = deptService.readDeptById("1");
            if(dept == null) {
                dept = new DeptVO();

                dept.setDeptId("1");
                dept.setDeptCode("1");
                dept.setParent(true);
                dept.setName(factory.getStringValue("sCompanyName"));
                dept.setLft(1);
                dept.setRgt(2);
                dept.setEnabled(true);

                int count = deptService.insertRoot(dept);

                if(count == 0) {
                    log.debug("[API RESULT] : Failed to save dept root");
                    resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
                    resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_PROCESS_FAILED));
                    return new ResponseEntity<>(resultMap, HttpStatus.OK);
                }
            }
            else {
                dept.setName(factory.getStringValue("sCompanyName"));
                deptService.updateDept(dept, null, null);
            }

            SystemConfigFactory passwordFactory = new SystemConfigFactory();
            passwordFactory.setCategory("password");
            passwordFactory.setNewValue("bCheckLength", "1");
            passwordFactory.setNewValue("nMinLength", "9");
            passwordFactory.setNewValue("nMaxLength", "16");
            passwordFactory.setNewValue("bCheckPrevious", "1");
            passwordFactory.setNewValue("nPrevMonth", "3");
            passwordFactory.setNewValue("bCheckComplex", "1");
            passwordFactory.setNewValue("bUpper", "1");
            passwordFactory.setNewValue("bLower", "1");
            passwordFactory.setNewValue("bNumeric", "1");
            passwordFactory.setNewValue("bSymbol", "1");
            passwordFactory.setNewValue("bCheckSerial", "1");
            passwordFactory.setNewValue("bCheckSame", "1");
            passwordFactory.setNewValue("nSameLimit", "2");

            configService.saveSystemConfig(passwordFactory);

        }
        else if(factory.getCategory().equals("service")) {
            if(factory.getStringValue("sServiceName").equals("") ||
                    factory.getStringValue("sServiceAddr").equals("") ||
                    factory.getStringValue("sAdminAllowedIp").equals("") ||
                    factory.getStringValue("sCopyright").equals("")) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

        }
        else if(factory.getCategory().equals("mail")) {
            if(factory.getStringValue("sMailServer").equals("") ||
                    factory.getStringValue("nMailPort").equals("") ||
                    factory.getStringValue("sMailAccount").equals("") ||
                    factory.getValue("pMailPassword").equals("") ||
                    factory.getValue("pConfPassword").equals("") ||
                    !factory.getValue("pMailPassword").equals(factory.getValue("pConfPassword")) ||
                    factory.getStringValue("sMailSender").equals("")) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            String encParam = factory.getStringValue("pMailPassword");
            byte[] byteStr = Base64.decodeBase64(encParam.getBytes(StandardCharsets.UTF_8));
            String[] encParams = new String(byteStr, StandardCharsets.UTF_8).split(",");

            if(encParams.length != 2 || !encParams[0].equals(factory.getStringValue("sMailAccount"))) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            String pMailPassword = encParams[1];

            SystemConfigFactory passwordFactory = configService.loadSystemConfig("password");

            int count = passwordService.validatePassword(factory.getStringValue("sMailAccount"), pMailPassword, passwordFactory);

            if(count != ErrorVO.ERROR_OK) {
                log.debug("[API RESULT] : Failed to validate password");
                resultMap.put("code", count);

                if(count == ErrorVO.ERROR_PASSWORD_NEED_UPPER_CHAR) {
                    resultMap.put("msg", "영문 대문자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_LOWER_CHAR) {
                    resultMap.put("msg", "영문 소문자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_NUMERIC_CHAR) {
                    resultMap.put("msg", "숫자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_SYMBOL_CHAR) {
                    resultMap.put("msg", "기호를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_CONTINUE_CHAR) {
                    resultMap.put("msg", "동일한 문자를 " + passwordFactory.getIntValue("nSameLimit") + "회 이상 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_LENGTH) {
                    resultMap.put("msg", "비밀번호는 최소 " + passwordFactory.getIntValue("nMinLength") + "문자 이상, 최대 " + passwordFactory.getIntValue("nMaxLength") + "문자 이하이어야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_USED_BEFORE) {
                    resultMap.put("msg", passwordFactory.getIntValue("nPrevMonth") + "개월 이내에 사용했던 비밀번호는 다시 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_SAME_TO_USERID) {
                    resultMap.put("msg", "비밀번호는 아이디와 다르게 지정해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_SERIAL_CHAR) {
                    resultMap.put("msg", "키보드의 인접한 문자는 비밀번호로 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            factory.setNewValue("pMailPassword", pMailPassword);
            factory.deleteConfig("pConfPassword");
        }
        else if(factory.getCategory().equals("admin")) {
            if(factory.getStringValue("sUserId").equals("") ||
                    factory.getStringValue("sEmail").equals("") ||
                    factory.getStringValue("sUserName").equals("") ||
                    factory.getStringValue("sCellNo").equals("") ||
                    factory.getStringValue("sPassword").equals("") ||
                    factory.getStringValue("sConfPassword").equals("") ||
                    !factory.getStringValue("sPassword").equals(factory.getStringValue("sConfPassword"))) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            String encParam = factory.getStringValue("sPassword");
            byte[] byteStr = Base64.decodeBase64(encParam.getBytes(StandardCharsets.UTF_8));
            String[] encParams = new String(byteStr, StandardCharsets.UTF_8).split(",");

            if(encParams.length != 2 || !encParams[0].equals(factory.getStringValue("sUserId"))) {
                log.debug("[API RESULT] : Invalid Parameter");
                resultMap.put("code", ErrorVO.ERROR_INVALID_PARAM);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_INVALID_PARAM));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            MemberVO existAdmin = memberService.readSetupMember();
            if(existAdmin != null && !existAdmin.getUserId().equals(encParams[0])) {
                log.debug("[API RESULT] : Setup admin is not matched");
                resultMap.put("code", ErrorVO.ERROR_SETUP_ADMIN_ISNOT_MATCH);
                resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_SETUP_ADMIN_ISNOT_MATCH));
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            String sPassword = encParams[1];

            SystemConfigFactory passwordFactory = configService.loadSystemConfig("password");

            int count = passwordService.validatePassword(factory.getStringValue("sUserId"), sPassword, passwordFactory);

            if(count != ErrorVO.ERROR_OK) {
                log.debug("[API RESULT] : Failed to validate password");
                resultMap.put("code", count);

                if(count == ErrorVO.ERROR_PASSWORD_NEED_UPPER_CHAR) {
                    resultMap.put("msg", "영문 대문자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_LOWER_CHAR) {
                    resultMap.put("msg", "영문 소문자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_NUMERIC_CHAR) {
                    resultMap.put("msg", "숫자를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_NEED_SYMBOL_CHAR) {
                    resultMap.put("msg", "기호를 1문자 이상 포함해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_CONTINUE_CHAR) {
                    resultMap.put("msg", "동일한 문자를 " + passwordFactory.getIntValue("nSameLimit") + "회 이상 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_LENGTH) {
                    resultMap.put("msg", "비밀번호는 최소 " + passwordFactory.getIntValue("nMinLength") + "문자 이상, 최대 " + passwordFactory.getIntValue("nMaxLength") + "문자 이하이어야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_USED_BEFORE) {
                    resultMap.put("msg", passwordFactory.getIntValue("nPrevMonth") + "개월 이내에 사용했던 비밀번호는 다시 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_SAME_TO_USERID) {
                    resultMap.put("msg", "비밀번호는 아이디와 다르게 지정해야 합니다.");
                    resultMap.put("target", "new");
                }
                else if(count == ErrorVO.ERROR_PASSWORD_SERIAL_CHAR) {
                    resultMap.put("msg", "키보드의 인접한 문자는 비밀번호로 사용할 수 없습니다.");
                    resultMap.put("target", "new");
                }
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }

            AgentVO agent = null;

            if(existAdmin == null) {
                UUID uuid = UUID.randomUUID();
                MemberVO member = new MemberVO();
                member.setUserId(factory.getStringValue("sUserId"));
                member.setUserName(factory.getStringValue("sUserName"));
                member.setSalt(UUID.randomUUID().toString());

                SHA512PasswordEncoder passwordEncoder = new SHA512PasswordEncoder();
                passwordEncoder.setSalt(member.getSalt());

                member.setPassword(passwordEncoder.encode(sPassword));
                member.setEmail(factory.getStringValue("sEmail"));
                member.setCellNo(factory.getStringValue("sCellNo"));
                member.setUuid(uuid.toString());
                member.setStatus("N");

                List<AuthVO> authList = new ArrayList<>();

                AuthVO authAdmin = new AuthVO();
                authAdmin.setUserId(member.getUserId());
                authAdmin.setAuth("ROLE_ADMIN");
                authList.add(authAdmin);

                AuthVO authGroup = new AuthVO();
                authGroup.setUserId(member.getUserId());
                authGroup.setAuth("ROLE_GROUP");
                authList.add(authGroup);

                AuthVO authMember = new AuthVO();
                authMember.setUserId(member.getUserId());
                authMember.setAuth("ROLE_MEMBER");
                authList.add(authMember);

                member.setAuthList(authList);


                GoogleOTP googleOTP = new GoogleOTP();
                SystemConfigFactory serviceFactory = configService.loadSystemConfig("service");
                HashMap<String, String> otp = googleOTP.generate(member.getUserName(), serviceFactory.getStringValue("sServiceName"));

                member.setOtpKey(otp.get("encodedKey").toString());

                count = memberService.insertMember(member, request);

                if (count == 0) {
                    log.debug("[API RESULT] : Failed to save admin");
                    resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
                    resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_PROCESS_FAILED));
                    return new ResponseEntity<>(resultMap, HttpStatus.OK);
                }

                deptService.insertDeptMember("1", member.getUserId());

                agent = new AgentVO();
                agent.setAgentId(UUID.randomUUID().toString());
                agent.setCode(UUID.randomUUID().toString());
                agent.setUserId(member.getUserId());
                agent.setIp(WebUtil.getClientIP(request));

                count = agentService.issueAgent(agent);

                if (count == 0) {
                    log.debug("[API RESULT] : Failed to save admin");
                    resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
                    resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_PROCESS_FAILED));
                    return new ResponseEntity<>(resultMap, HttpStatus.OK);
                }

                SystemConfigFactory mailFactory = configService.loadSystemConfig("mail");

                if (mailFactory.getValue("sMailServer") != null && !mailFactory.getValue("sMailServer").equals("")) {
                    EmailVO emailTemplate = new EmailVO();
                    String subject = "[" + serviceFactory.getValue("sServiceName") + "] 사용자 등록 알림";

                    emailTemplate.setFrom(mailFactory.getValue("sMailSender"));
                    emailTemplate.setReceiver(member.getEmail());
                    emailTemplate.setHtmlYn("html");
                    emailTemplate.setSubject(subject);

                    String format2 = "otpauth://totp/%s@%s?secret=%s";
                    String content = String.format(format2, member.getUserName(), serviceFactory.getStringValue("sServiceName"), otp.get("encodedKey").toString());

                    try {
                        QRCodeWriter qrCodeWriter = new QRCodeWriter();
                        Hashtable hints = new Hashtable();
                        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
                        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200, hints);
                        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
                        File temp = new File(context.getRealPath("/resources/upload/member/" + otp.get("encodedKey").toString() + ".png"));
                        ImageIO.write(bufferedImage, "png", temp);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    Map<String, Object> map = new HashMap<>();
                    Map<String, Object> inline = new HashMap<>();

                    map.put("app", serviceFactory.getValue("sServiceName"));
                    map.put("userId", member.getUserId());
                    map.put("userName", member.getUserName());
                    map.put("otpKey", otp.get("encodedKey").toString());

                    inline.put("mail_logo", context.getContextPath() + "/resources/assets/svg/logos/logo-ansim.png");
                    inline.put("otp_png", context.getContextPath() + "/resources/upload/member/" + otp.get("encodedKey").toString() + ".png");

                    emailTemplate.setVelocityTemplate("template/account_created.vm");
                    emailTemplate.setInlineAttach(inline);

                    String url = serviceFactory.getStringValue("sServiceAddr");
                    if (url == null || url.equals("")) {
                        url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + context.getContextPath();
                    }
                    map.put("url", url);
                    map.put("download", url + "/agent");
                    map.put("code", agent.getCode());

                    emailTemplate.setEmailMap(map);

                    mailService.sendEmailTemplate(mailFactory, emailTemplate);
                }
            }
            else {
                agent = agentService.readSetupAgent(existAdmin.getUserId());

                existAdmin.setSalt(UUID.randomUUID().toString());

                SHA512PasswordEncoder passwordEncoder = new SHA512PasswordEncoder();
                passwordEncoder.setSalt(existAdmin.getSalt());

                existAdmin.setPassword(passwordEncoder.encode(sPassword));
                existAdmin.setEmail(factory.getStringValue("sEmail"));
                existAdmin.setCellNo(factory.getStringValue("sCellNo"));

                count = memberService.updateSetupAdmin(existAdmin);

                if(count == 0) {
                    log.debug("[API RESULT] : Failed to save admin");
                    resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
                    resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_PROCESS_FAILED));
                    return new ResponseEntity<>(resultMap, HttpStatus.OK);
                }
            }

            log.debug("[API RESULT] : Completed to save admin");
            resultMap.put("code", ErrorVO.ERROR_OK);
            resultMap.put("installCode", agent.getCode());
            resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_OK));
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }

        int count = configService.saveSystemConfig(factory);

        if(count == 0) {
            log.debug("[API RESULT] : Failed to save setup");
            resultMap.put("code", ErrorVO.ERROR_PROCESS_FAILED);
            resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_PROCESS_FAILED));
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }

        log.debug("[API RESULT] : Completed to save setup");
        resultMap.put("code", ErrorVO.ERROR_OK);
        resultMap.put("msg", ErrorVO.getMessage(ErrorVO.ERROR_OK));
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
