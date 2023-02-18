package com.ansim.app.domain;

import lombok.Data;

@Data
public class AuthVO {
    private int authId;
    private String userId;
    private String auth;
    private String createDate;
}
