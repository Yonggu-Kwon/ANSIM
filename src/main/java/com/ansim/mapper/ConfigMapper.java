package com.ansim.mapper;

import com.ansim.app.factory.SystemConfigVO;

import java.util.HashMap;
import java.util.List;

public interface ConfigMapper {
    public List<SystemConfigVO> listSystemConfig(HashMap<String, Object> param);
    public SystemConfigVO readSystemConfig(SystemConfigVO config);
    public int updateSystemConfig(SystemConfigVO config);
    public int insertSystemConfig(SystemConfigVO config);
}
