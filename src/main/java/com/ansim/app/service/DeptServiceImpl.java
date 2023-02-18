package com.ansim.app.service;

import com.ansim.app.domain.DeptVO;
import com.ansim.app.domain.MemberVO;
import com.ansim.mapper.DeptMapper;
import com.ansim.mapper.MemberMapper;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Member;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Service
public class DeptServiceImpl implements DeptService {

    @Setter(onMethod_ = { @Autowired})
    private DeptMapper deptMapper;

    @Setter(onMethod_ = { @Autowired})
    private MemberMapper memberMapper;

    @Override
    public DeptVO readDeptById(String deptId) {
        Map<String, Object> param = new HashMap<>();
        param.put("deptId", deptId);
        return deptMapper.readDept(param);
    }

    @Override
    public int insertRoot(DeptVO dept) {
        return deptMapper.insertRoot(dept);
    }

    @Override
    public int updateDept(DeptVO dept, String chiefId, List<String> managers) {
        String oldChiefId = dept.getChiefId();

        Map<String, Object> param = new HashMap<>();
        param.put("deptId", dept.getDeptId());
        param.put("deptCode", dept.getDeptCode());
        param.put("chiefId", chiefId == null ? oldChiefId : chiefId);
        param.put("name", dept.getName());

        int count = deptMapper.updateDept(param);

        if(count > 0) {
            if(chiefId != null) {
                if(oldChiefId != null && !oldChiefId.equals(chiefId)) {
                    param.put("userId", oldChiefId);
                    int nDept = deptMapper.countOwningDept(param);
                    if(nDept == 0) {
                        param.put("auth", "ROLE_GROUP");
                        memberMapper.deleteMemberAuth(param);
                    }
                }

                if(oldChiefId == null || !oldChiefId.equals(chiefId)) {
                    param.put("userId", chiefId);
                    param.put("auth", "ROLE_GROUP");
                    memberMapper.insertMemberAuth(param);
                }
            }

            List<String> ids = new ArrayList<>();
            if(managers == null || managers.size() == 0) {
                if(dept.getManagerList() != null && dept.getManagerList().size() > 0) {
                    for(MemberVO manager : dept.getManagerList()) {
                        ids.add(manager.getUserId());
                    }

                    if(ids.size() > 0 ) {
                        deleteDeptManager(dept, ids);
                    }
                }
            }
            else {
                if(dept.getManagerList() != null && dept.getManagerList().size() > 0) {
                    for (MemberVO manager : dept.getManagerList()) {
                        boolean matched = false;
                        for(String userId : managers) {
                            if(manager.getUserId().equals(userId)) {
                                matched = true;
                                break;
                            }
                        }

                        if(!matched) {
                            ids.add(manager.getUserId());
                        }
                    }
                }

                if(ids.size() > 0) {
                    deleteDeptManager(dept, ids);
                }

                insertDeptManager(dept, managers);
            }
        }

        return count;
    }

    @Override
    public int deleteDeptManager(DeptVO dept, List<String> ids) {
        Map<String, Object> param = new HashMap<>();
        param.put("deptId", dept.getDeptId());
        param.put("ids", ids);
        int count = deptMapper.deleteDeptManager(param);

        if(count > 0) {
            for(String userId : ids) {
                param.put("userId", userId);
                int nDept = deptMapper.countManagingDept(param);

                if(nDept == 0) {
                    MemberVO member = memberMapper.readMember(param);
                    if(member.isGroupAdmin()) {
                        param.put("auth", "ROLE_GROUP");
                        memberMapper.deleteMemberAuth(param);
                    }
                }
            }
        }
        return count;
    }

    @Override
    public int insertDeptManager(DeptVO dept, List<String> managers) {
        Map<String, Object> param = new HashMap<>();
        param.put("deptId", dept.getDeptId());

        for(String userId : managers) {
            boolean found = false;
            if(dept.getManagerList() != null) {
                for (MemberVO manager : dept.getManagerList()) {
                    if(manager.getUserId().equals(userId)) {
                        found = true;
                        break;
                    }
                }
            }

            if(!found) {
                param.put("userId", userId);
                try {
                    deptMapper.insertDeptManager(param);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }

                try {
                    MemberVO existMember = memberMapper.readMember(param);
                    if (existMember != null) {
                        if (!existMember.isGroupAdmin()) {
                            param.put("auth", "ROLE_GROUP");
                            memberMapper.insertMemberAuth(param);
                        }
                    }
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        List<String> userIdToDelete = new ArrayList<>();

        for (MemberVO manager : dept.getManagerList()) {
            param.put("userId", manager.getUserId());
            if(deptMapper.countManagingDept(param) == 0) {
                userIdToDelete.add(manager.getUserId());

                if(manager.isGroupAdmin()) {
                    param.put("auth", "ROLE_GROUP");
                    memberMapper.deleteMemberAuth(param);
                }
            }
        }

        if(userIdToDelete.size() > 0) {
            param.put("ids", userIdToDelete);
            try {
                deptMapper.deleteDeptManager(param);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        return 1;
    }

    @Override
    public int insertDeptMember(String deptId, String userId) {
        Map<String, Object> param = new HashMap<>();
        param.put("deptId", deptId);
        param.put("userId", userId);
        return deptMapper.insertDeptMember(param);
    }
}
