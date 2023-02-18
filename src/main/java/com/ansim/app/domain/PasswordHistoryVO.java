package com.ansim.app.domain;

import lombok.Data;

@Data
public class PasswordHistoryVO {
    private int id;
    private String userId;
    private String userPw;
    private String createDate;
}
