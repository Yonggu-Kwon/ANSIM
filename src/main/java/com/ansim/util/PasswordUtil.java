package com.ansim.util;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PasswordUtil {
    public static final String regPrefix = "^";
    public static final String regLower = "(?=.*[a-z])";
    public static final String regUpper = "(?=.*[A-Z])";
    public static final String regNumeric = "(?=.*\\d)";
    public static final String regSpecial = "(?=.*[$@!#`:;<>_=/,~'\"%*?&\\\\(\\\\)\\\\{\\\\}\\\\^[.][+][*][|]])";
    public static final String regAll = "[A-Za-z\\d$@!#`:;<>_=/,~'\"%*?&\\\\(\\\\)\\\\{\\\\}\\\\^[.][+][*][|]]";
    public static final String regRest = "-[]";
    public static final String regSerial = "1234567890qwertyuiopasdfghjklzxcvbnm";

    public static final int success = 0;
    public static final int noUpper = 204;
    public static final int noLower = 205;
    public static final int noNumeric = 206;
    public static final int noSpecial = 207;
    public static final int continuous = 208;
    public static final int serialError = 209;
    public static final int unknown = 300;

    public int verify(String password, boolean complex, boolean upper, boolean lower, boolean numeric, boolean special, boolean serial, boolean same, int sameLimit) {

        if(serial) {
            StringBuffer sb = new StringBuffer(regSerial);
            String reversedRegSerial = sb.reverse().toString();

            for(int i=0; i<password.length(); i++) {
                String token = "";

                if((i + 4) <= password.length()) {
                    token = password.substring(i, i + 4);
                }
                else {
                    token = "";
                }

                if(!token.equals("")) {
                    if (regSerial.indexOf(token) != -1) {
                        return serialError;
                    }

                    if(reversedRegSerial.indexOf(token) != -1) {
                        return serialError;
                    }
                }
            }
        }

        if(complex) {
            String regexStr = regPrefix;
            String regexUpper = regexStr + regUpper + regAll;
            String regexLower = regexStr + regLower + regAll;
            String regexNumeric = regexStr + regNumeric + regAll;

            if(upper) regexStr += regUpper;
            if(lower) regexStr += regLower;
            if(numeric) regexStr += regNumeric;
            if(special) regexStr += regSpecial;

            regexStr += regAll;

            Pattern pattern_all = Pattern.compile(regexStr);
            Pattern pattern_upper = Pattern.compile(regexUpper);
            Pattern pattern_lower = Pattern.compile(regexLower);
            Pattern pattern_numeric = Pattern.compile(regexNumeric);

            Matcher matcher_all = pattern_all.matcher(password);

            if (!matcher_all.find()) {
                if (upper) {
                    Matcher matcher_upper = pattern_upper.matcher(password);
                    if (!matcher_upper.find()) {
                        return noUpper;
                    }
                }

                if (lower) {
                    Matcher matcher_lower = pattern_lower.matcher(password);
                    if (!matcher_lower.find()) {
                        return noLower;
                    }
                }

                if (numeric) {
                    Matcher matcher_numeric = pattern_numeric.matcher(password);
                    if (!matcher_numeric.find()) {
                        return noNumeric;
                    }
                }

                if (special) {
                    for (int i = 0; i < password.length(); i++) {
                        if (regRest.indexOf(password.charAt(i)) != -1) {
                            return success;
                        }
                    }

                    return noSpecial;
                }

                return unknown;
            }
        }

        if(same) {
            if(sameLimit > 0) {
                int sameCount = 1;
                char prevVal = 0;

                for(int i=0; i<password.length(); i++) {
                    char tempVal = password.charAt(i);
                    if(tempVal == prevVal) {
                        sameCount++;

                        if(sameCount >= sameLimit) {
                            return continuous;
                        }
                    } else {
                        prevVal = tempVal;
                        sameCount = 1;
                    }
                }
            }
        }

        return success;
    }
}
