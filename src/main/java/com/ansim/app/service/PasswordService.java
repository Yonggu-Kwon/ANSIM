package com.ansim.app.service;

import com.ansim.app.domain.MemberVO;
import com.ansim.app.factory.SystemConfigFactory;

public interface PasswordService {
    public int validatePassword(String userId, String password, SystemConfigFactory passwordFactory);
    public int changePassword(MemberVO member, String curPass, String newPass);
    public boolean isNeedToChangePassword(MemberVO member, int nPeriod);
    public int resetPassword(MemberVO member);
}
