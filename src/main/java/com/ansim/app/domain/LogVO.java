package com.ansim.app.domain;

import lombok.Data;

@Data
public class LogVO {

    public final static String CATEGORY_WEB_CONSOLE = "WEB CONSOLE";
    public final static String CATEGORY_SYSTEM = "SYSTEM";

    public final static String ACTION_SETUP_SYSTEM = "SETUP SYSTEM";

    public final static String ACTION_ADD_MEMBER = "ADD MEMBER";

    private int logId;
    private String userId;
    private String userName;
    private String category;
    private String action;
    private String ip;
    private String agent;
    private boolean result;
    private String reason;
    private String createDate;
    private String deptId;

    private DeptVO dept;
    private MemberVO logger;
}
