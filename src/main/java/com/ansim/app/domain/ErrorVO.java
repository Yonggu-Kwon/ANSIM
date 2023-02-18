package com.ansim.app.domain;

import lombok.Data;

@Data
public class ErrorVO {
    public final static int ERROR_OK = 0;

    public final static int ERROR_PROCESS_FAILED = 99;
    public final static int ERROR_INVALID_PARAM = 100;

    public final static int ERROR_PASSWORD_SAME_TO_USERID = 201;
    public final static int ERROR_PASSWORD_LENGTH = 202;
    public final static int ERROR_PASSWORD_USED_BEFORE = 203;
    public final static int ERROR_PASSWORD_NEED_UPPER_CHAR = 204;
    public final static int ERROR_PASSWORD_NEED_LOWER_CHAR = 205;
    public final static int ERROR_PASSWORD_NEED_NUMERIC_CHAR = 206;
    public final static int ERROR_PASSWORD_NEED_SYMBOL_CHAR = 207;
    public final static int ERROR_PASSWORD_CONTINUE_CHAR = 208;
    public final static int ERROR_PASSWORD_SERIAL_CHAR = 209;
    public final static int ERROR_CONFIRM_NOT_MATCH = 210;
    public final static int ERROR_NEWPASS_IS_CURPASS = 211;

    public final static int ERROR_UNKNOWN = 300;

    public static String getMessage(int code) {
        String msg = "서버에서 알 수 없는 오류가 발생했습니다.";
        switch (code) {
            case ERROR_PROCESS_FAILED:      msg = "요청을 처리하는 과정에서 오류가 발생했습니다.";              break;
            case ERROR_INVALID_PARAM:       msg = "요청을 처리하기 위한 데이터가 올바르게 제공되지 않았습니다.";  break;
            case ERROR_NEWPASS_IS_CURPASS:  msg = "신규 비밀번호는 현재 비밀번호와 다르게 지정해야 합니다."; break;
        }
        return msg;
    }
}
