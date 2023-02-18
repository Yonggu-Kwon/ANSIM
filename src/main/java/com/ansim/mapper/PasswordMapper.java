package com.ansim.mapper;

import com.ansim.app.domain.PasswordHistoryVO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PasswordMapper {
    public List<PasswordHistoryVO> listLastPassword(Map<String, Object> param);
    public int insertPasswordHistory(Map<String, Object> param);
    public int updatePassword(Map<String, Object> param);
    public PasswordHistoryVO readLastChangeHistory(Map<String, Object> param);
}
