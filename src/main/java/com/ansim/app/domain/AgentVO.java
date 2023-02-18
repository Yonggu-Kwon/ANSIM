package com.ansim.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class AgentVO {
    private String agentId;
    private String userId;
    private String version;
    private String type;
    private String path;
    private String status;
    @JsonIgnore
    private String code;
    private boolean deletable;
    private String createDate;
    private String approveDate;
    private String stopDate;
    private String deleteDate;
}
