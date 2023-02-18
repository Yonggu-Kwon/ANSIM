package com.ansim.app.domain;

import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
public class DeptVO {
    private String deptId;
    private String deptCode;
    private String pid;
    private boolean parent;
    private String chiefId;
    private String name;
    private int lft;
    private int rgt;
    private boolean enabled;
    private String createDate;
    private String updateDate;

    private int depth;
    private String fullPath;

    private MemberVO chiefInfo;
    private HashMap<String, Object> parentDept;

    private List<MemberVO> memberList;
    private List<MemberVO> managerList;

    public int getWidth() {
        return rgt - lft;
    }

    public boolean isDeptMember(String userId) {
        if(chiefInfo != null && chiefInfo.getUserId().equals(userId)) {
            return true;
        }

        if(memberList == null) {
            return false;
        }

        MemberVO memberInfo = memberList.stream()
                .filter(member -> userId.equals(member.getUserId()))
                .findAny()
                .orElse(null);

        return memberInfo != null;
    }

}
