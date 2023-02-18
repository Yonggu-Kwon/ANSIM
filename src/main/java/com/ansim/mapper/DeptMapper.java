package com.ansim.mapper;

import com.ansim.app.domain.DeptVO;

import java.util.HashMap;
import java.util.Map;

public interface DeptMapper {
    public DeptVO readDept(Map<String, Object> param);

    public int insertRoot(DeptVO dept);
    public int updateDept(Map<String, Object> param);
    public int countOwningDept(Map<String, Object> param);
    public int countManagingDept(Map<String, Object> param);
    public int deleteDeptManager(Map<String, Object> param);
    public int insertDeptManager(Map<String, Object> param);
    public int insertDeptMember(Map<String, Object> param);
}
