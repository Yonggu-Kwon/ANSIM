package com.ansim.util;

import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.app.factory.SystemConfigVO;
import org.imgscalr.Scalr;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.imageio.ImageIO;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Component
public class WebUtil {
    public static String getClientIP() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();

        String ip = request.getHeader("X-FORWARDED-FOR");

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        if("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }

        return ip;
    }

    public static String getClientIP(HttpServletRequest request) {

        String ip = request.getHeader("X-FORWARDED-FOR");

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        if("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }

        return ip;
    }

    public static String encodeURIComponent(String s) {
        String result = null;
        try {
            result = URLEncoder.encode(s, "UTF-8")
                    .replaceAll("\\+", "%20")
                    .replaceAll("\\%21", "!")
                    .replaceAll("\\%27", "'")
                    .replaceAll("\\%28", "(")
                    .replaceAll("\\%29", ")")
                    .replaceAll("\\%7E", "~");

        } catch (UnsupportedEncodingException e){
            result = s;
        }

        return result;

    }

    public static String getTempFolderName() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String str = sdf.format(date);
        return str.replace("-", "/");
    }

    public static Cookie getCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        Cookie res = null;
        if(cookies != null) {
            for(Cookie c : cookies) {
                if(cookieName.equals(c.getName())) {
                    res = c;
                    break;
                }
            }
        }
        return res;
    }

    public static boolean isRegexUserId(String value) {
        String regExp = "^[a-zA-Z0-9]{5,32}$";
        return value.matches(regExp);
    }

    public static boolean isRegexEmail(String value) {
        String regExp = "^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$";
        return value.matches(regExp);
    }

    public static boolean convertToThumbnail(String parentPath, String fileName, String extension, boolean smallImage, boolean replaceSrc) throws Exception {
        File srcFile = new File(parentPath, fileName + "." + extension);

        if(!srcFile.exists()) {
            return false;
        }

        BufferedImage srcImg = ImageIO.read(srcFile);

        if(srcImg == null) {
            return false;
        }

        int dw = 0;
        int dh = 0;

        int ow = srcImg.getWidth();
        int oh = srcImg.getHeight();

        int nw = 0;
        int nh = 0;

        if(smallImage) {
            dw = 80;
            dh = 80;
        }
        else {
            dw = 250;
            dh = 350;

            if(ow <= dw && oh <= dh) {
                dw = ow;
                dh = oh;
            }
            else {
                if(ow < dw) {
                    dw = (ow * dh) / oh;
                }
                else if(oh < dh) {
                    dh = (oh * dw) / ow;
                }
            }
        }

        nw = ow;
        nh = (ow * dh) / dw;

        if(nh > oh) {
            nw = (oh * dw) / dh;
            nh = oh;
        }

        BufferedImage cropImg = Scalr.crop(srcImg, (ow-nw)/2, (oh-nh)/2, nw, nh);
        BufferedImage destImg = Scalr.resize(cropImg, dw, dh);
        String thumbName = "";

        if(replaceSrc) {
            srcFile.delete();
            thumbName = fileName + "." + extension;
        }
        else {
            thumbName = fileName + "_THUMB." + extension;
        }

        File thumbFile = new File(parentPath, thumbName);
        ImageIO.write(destImg, extension.toUpperCase(), thumbFile);

        return true;
    }

    public static String getAgentType(HttpServletRequest request) {
        String browser = "";
        String userAgent = request.getHeader("User-Agent");
        if(userAgent.indexOf("Trident") > -1) {
            // IE
            browser = "Internet Explorer";
        } else if(userAgent.indexOf("Edge") > -1) {
            // Edge
            browser = "Edge";
        } else if(userAgent.indexOf("Whale") > -1) {
            // Naver Whale
            browser = "Whale";
        } else if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            // Opera
            browser = "Opera";
        } else if(userAgent.indexOf("Firefox") > -1) {
            // Firefox
            browser = "Firefox";
        } else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1 ) {
            // Safari
            browser = "Safari";
        } else if(userAgent.indexOf("Chrome") > -1) {
            // Chrome
            browser = "Chrome";
        } else {
            browser = "Unknown";
        }
        return browser;
    }

    public static String getStringVal(String paramName, HashMap<String, String> paramMap, int length) {
        String value = paramMap.get(paramName);
        boolean b = paramName.equals("from") || paramName.equals("to") || paramName.endsWith("Date");
        if(value == null) {
            if(b) {
                return null;
            }
            return "";
        }

        value = value.trim();

        if(b) {
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd");

            boolean parsed = true;
            Date testDate = null;
            try { testDate = sdf1.parse(value); } catch (Exception e) { parsed = false; }
            if(!parsed) {
                parsed = true;
                try { testDate = sdf2.parse(value); } catch (Exception e) { parsed = false; }
                if(!parsed) {
                    parsed = true;
                    try { testDate = sdf3.parse(value); } catch (Exception e) { parsed = false; }
                }
            }

            if(!parsed) {
                return null;
            }
        }

        if(length != 0 && value.length() > length) {
            value = value.substring(0, length);
        }
        return value;
    }

    public static int getIntVal(String paramName, HashMap<String, String> paramMap) {
        String value = paramMap.get(paramName);
        int retVal = 0;

        if(value == null) {
            return retVal;
        }

        try {
            retVal = Integer.parseInt(value.trim());
        }
        catch(Exception ignored) {

        }

        return retVal;
    }

    public static SystemConfigFactory extractSystemConfig(HashMap<String, String> paramMap) {
        SystemConfigFactory factory = new SystemConfigFactory();

        String category = getStringVal("category", paramMap, 100);

        if(category.equals("")) {
            return null;
        }

        paramMap.remove("category");

        String regExp = "^[a-zA-Z0-9]*$";
        List<SystemConfigVO> list = new ArrayList<>();

        paramMap.forEach((key, value) -> {
            key = key.trim();
            value = value.trim();

            if(key.matches(regExp)) {
                SystemConfigVO config = new SystemConfigVO();
                config.setCategory(category);
                config.setName(key);
                if(key.startsWith("b")) {
                    if(value.equals("on") || value.equals("true") || value.equals("1")) {
                        config.setValue("1");
                    }
                    else {
                        config.setValue("0");
                    }
                }
                else {
                    config.setValue(value);
                }
                list.add(config);
            }
        });

        factory.setConfigVOList(list);
        factory.setCategory(category);

        return factory;
    }
}
