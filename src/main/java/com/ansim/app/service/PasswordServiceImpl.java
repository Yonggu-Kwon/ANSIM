package com.ansim.app.service;

import com.ansim.app.domain.ErrorVO;
import com.ansim.app.domain.MemberVO;
import com.ansim.app.domain.PasswordHistoryVO;
import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.mapper.PasswordMapper;
import com.ansim.security.SHA512PasswordEncoder;
import com.ansim.util.PasswordUtil;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Log4j2
@Service
public class PasswordServiceImpl implements PasswordService {

    @Setter(onMethod_ = { @Autowired })
    private PasswordMapper passwordMapper;

    @Setter(onMethod_ = { @Autowired })
    PasswordUtil passwordUtil;

    @Setter(onMethod_ = { @Autowired })
    ConfigService configService;

    @Override
    public int validatePassword(String userId, String password, SystemConfigFactory passwordFactory) {
        if(userId.equalsIgnoreCase(password)) {
            return ErrorVO.ERROR_PASSWORD_SAME_TO_USERID;
        }

        if(passwordFactory.getBooleanValue("bCheckLength")) {
            if(password.length() < passwordFactory.getIntValue("nMinLength") || password.length() > passwordFactory.getIntValue("nMaxLength")) {
                return ErrorVO.ERROR_PASSWORD_LENGTH;
            }
        }

        if(passwordFactory.getBooleanValue("bCheckPrevious")) {
            Map<String, Object> param = new HashMap<>();
            param.put("userId", userId);
            param.put("nPrevMonth", passwordFactory.getIntValue("nPrevMonth"));
            List<PasswordHistoryVO> historyList = passwordMapper.listLastPassword(param);

            boolean prevExist = false;

            if(historyList != null) {
                SHA512PasswordEncoder passwordEncoder = new SHA512PasswordEncoder();
                for(PasswordHistoryVO history : historyList) {
                    if(passwordEncoder.matches(password, history.getUserPw())) {
                        prevExist = true;
                        break;
                    }
                }
            }

            if(prevExist) {
                return ErrorVO.ERROR_PASSWORD_USED_BEFORE;
            }
        }

        int checkResult = passwordUtil.verify(
                password,
                passwordFactory.getBooleanValue("bCheckComplex"),
                passwordFactory.getBooleanValue("bUpper"),
                passwordFactory.getBooleanValue("bLower"),
                passwordFactory.getBooleanValue("bNumeric"),
                passwordFactory.getBooleanValue("bSymbol"),
                passwordFactory.getBooleanValue("bCheckSerial"),
                passwordFactory.getBooleanValue("bCheckSame"),
                passwordFactory.getIntValue("nSameLimit"));

        if(checkResult != ErrorVO.ERROR_OK) {
            return checkResult;
        }

        return ErrorVO.ERROR_OK;
    }

    @Override
    @Transactional
    public int changePassword(MemberVO member, String curPass, String newPass) {
        SHA512PasswordEncoder passwordEncoder = new SHA512PasswordEncoder();
        Map<String, Object> param = new HashMap<>();
        param.put("userId", member.getUserId());
        param.put("userPw", passwordEncoder.encode(curPass));

        String prevPass = member.getPassword();

        int count = passwordMapper.insertPasswordHistory(param);

        member.setSalt(UUID.randomUUID().toString());
        passwordEncoder.setSalt(member.getSalt());

        String encodePw = passwordEncoder.encode(newPass);
        if(count > 0) {
            param.put("salt", member.getSalt());
            param.put("password", encodePw);
            count = passwordMapper.updatePassword(param);
        }

        member.setPassword(encodePw);

        return count;
    }

    @Override
    public boolean isNeedToChangePassword(MemberVO member, int nPeriod) {
        Map<String, Object> param = new HashMap<>();
        param.put("userId", member.getUserId());
        param.put("nPeriod", nPeriod);

        SHA512PasswordEncoder passwordEncoder = new SHA512PasswordEncoder();
        passwordEncoder.setSalt(member.getSalt());

        if(passwordEncoder.matches(member.getUserId(), member.getPassword())) {
            return true;
        }

        PasswordHistoryVO history = passwordMapper.readLastChangeHistory(param);

        if(history != null) {
            return false;
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date createDate = null;
        Date today = new Date();

        try {
            createDate = sdf.parse(member.getCreateDate());
        }
        catch (Exception e) {
            e.printStackTrace();
            return true;
        }

        Calendar calLimit = Calendar.getInstance();
        calLimit.setTime(today);
        calLimit.add(Calendar.DATE, nPeriod * -1);

        Calendar calCreate = Calendar.getInstance();
        calCreate.setTime(createDate);

        return calCreate.before(calLimit);
    }

    @Override
    public int resetPassword(MemberVO member) {
        Map<String, Object> param = new HashMap<>();
        param.put("userId", member.getUserId());
        param.put("password", member.getPassword());
        return passwordMapper.updatePassword(param);
    }
}
