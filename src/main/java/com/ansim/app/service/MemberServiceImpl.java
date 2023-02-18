package com.ansim.app.service;

import com.ansim.app.domain.ErrorVO;
import com.ansim.app.domain.LogVO;
import com.ansim.app.domain.MemberVO;
import com.ansim.mapper.MemberMapper;
import com.ansim.util.WebUtil;
import com.google.gson.Gson;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service
@Log4j2
public class MemberServiceImpl implements MemberService {
    @Setter(onMethod_ =  { @Autowired})
    private MemberMapper memberMapper;

    @Setter(onMethod_ =  { @Autowired})
    private LogService logService;

    @Override
    public boolean isInstalled() {
        return memberMapper.isInstalled();
    }

    @Override
    public MemberVO readMemberById(String userId, boolean includeDeleted) {
        Map param = new HashMap();
        param.put("userId", userId);
        param.put("includeDeleted", includeDeleted);
        return memberMapper.readMember(param);
    }

    @Override
    public MemberVO readMemberByEmail(String email, boolean includeDeleted) {
        Map param = new HashMap();
        param.put("email", email);
        param.put("includeDeleted", includeDeleted);
        return memberMapper.readMember(param);
    }

    @Override
    public int insertMember(MemberVO member, HttpServletRequest request) {
        memberMapper.insertMember(member);

        Gson gson = new Gson();

        if(member.isSystemAdmin()) {
            LogVO log = new LogVO();

            log.setUserId(member.getUserId());
            log.setUserName(member.getUserName());
            log.setCategory(LogVO.CATEGORY_WEB_CONSOLE);
            log.setIp(WebUtil.getClientIP(request));
            log.setAgent(WebUtil.getAgentType(request));
            log.setResult(true);
            log.setAction(LogVO.ACTION_SETUP_SYSTEM);
            logService.insertLog(log);

            log.setAction(LogVO.ACTION_ADD_MEMBER);

            member.setPassword(null);
            member.setUuid(null);

            log.setReason(gson.toJson(member));

            logService.insertLog(log);
        }

        return 1;
    }
}
