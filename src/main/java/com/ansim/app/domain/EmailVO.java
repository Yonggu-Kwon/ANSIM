package com.ansim.app.domain;

import lombok.Data;

import java.util.Map;

@Data
public class EmailVO {
    private String subject;
    private String content;
    private String receiver;
    private String htmlYn;
    private String from;
    private String userId;
    private String velocityTemplate;
    private Map<String, Object> emailMap;
    private Map<String, Object> inlineAttach;
}
