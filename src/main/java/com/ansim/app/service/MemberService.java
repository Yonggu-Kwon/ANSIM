package com.ansim.app.service;

import com.ansim.app.domain.MemberVO;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface MemberService {
    public boolean isInstalled();

    public MemberVO readMemberById(String userId, boolean includeDeleted);
    public MemberVO readMemberByEmail(String email, boolean includeDeleted);
    public int insertMember(MemberVO member, HttpServletRequest request);
}
