package com.ansim.mapper;

import com.ansim.app.domain.AuthVO;
import com.ansim.app.domain.MemberVO;

import java.util.Map;

public interface MemberMapper {
    public boolean isInstalled();
    public MemberVO readMember(Map<String, Object> param);
    public MemberVO readSetupMember();

    public int insertMemberAuth(Map<String, Object> param);
    public int deleteMemberAuth(Map<String, Object> param);
    public int insertMember(MemberVO member);
    public int updateSetupAdmin(MemberVO member);
}
