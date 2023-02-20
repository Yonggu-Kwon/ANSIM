package com.ansim.mapper;

import com.ansim.app.domain.AgentVO;

import java.util.Map;

public interface AgentMapper {
    public int issueAgent(AgentVO agent);
    public AgentVO readSetupAgent(Map<String, Object> param);
}
