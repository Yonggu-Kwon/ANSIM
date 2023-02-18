package com.ansim.app.service;

import com.ansim.app.domain.LogVO;
import com.ansim.mapper.LogMapper;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class LogServiceImpl implements LogService {

    @Setter(onMethod_ =  { @Autowired})
    private LogMapper logMapper;

    @Override
    public int insertLog(LogVO log) {
        return logMapper.insertLog(log);
    }
}
