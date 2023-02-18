package com.ansim.app.service;

import com.ansim.app.domain.DeptVO;
import com.ansim.app.domain.SearchConditionVO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface DeptService {
    public DeptVO readDeptById(String deptId);

    public int insertRoot(DeptVO dept);
    public int updateDept(DeptVO dept, String chiefId, List<String> managers);
    public int deleteDeptManager(DeptVO dept, List<String> ids);
    public int insertDeptManager(DeptVO dept, List<String> managers);
    public int insertDeptMember(String deptId, String userId);
}
