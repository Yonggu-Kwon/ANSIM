package com.ansim.app.service;

import com.ansim.app.domain.AgentVO;
import com.ansim.mapper.AgentMapper;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@Service
public class AgentServiceImpl implements AgentService {

    @Setter(onMethod_ =  { @Autowired})
    private AgentMapper agentMapper;

    @Override
    public int issueAgent(AgentVO agent) {
        return agentMapper.issueAgent(agent);
    }

    @Override
    public AgentVO readSetupAgent(String userId) {
        Map<String, Object> param = new HashMap<>();
        param.put("userId", userId);
        return agentMapper.readSetupAgent(param);
    }
}
