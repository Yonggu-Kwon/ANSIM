package com.ansim.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class MemberVO {
    private String userId;
    private String userName;
    @JsonIgnore
    private String password;
    private String email;
    private String cellNo;
    @JsonIgnore
    private String uuid;
    private String otpKey;
    private String positionId;
    private String status;
    @JsonIgnore
    private String salt;
    private String createDate;
    private String updateDate;
    private String deleteDate;

    private List<AuthVO> authList;
    private PositionVO position;

    public boolean isSystemAdmin() {
        if(authList == null || authList.size() == 0) {
            return false;
        }

        Optional<AuthVO> anyElement = authList.stream().filter(s -> s.getAuth().endsWith("ADMIN")).findAny();

        return anyElement.isPresent();
    }

    public boolean isGroupAdmin() {
        if(authList == null || authList.size() == 0) {
            return false;
        }

        Optional<AuthVO> anyElement = authList.stream().filter(s -> s.getAuth().endsWith("GROUP")).findAny();

        return anyElement.isPresent();
    }

    public String getPositionName() {
        if(position == null) {
            return "";
        }
        return position.getName();
    }
}
