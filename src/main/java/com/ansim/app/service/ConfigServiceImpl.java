package com.ansim.app.service;

import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.app.factory.SystemConfigVO;
import com.ansim.mapper.ConfigMapper;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Service
@Log4j2
public class ConfigServiceImpl implements ConfigService {

    @Setter(onMethod_ =  { @Autowired })
    private ConfigMapper configMapper;

    @Override
    public SystemConfigFactory loadSystemConfig(String category) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("category", category);

        SystemConfigFactory factory = new SystemConfigFactory();

        factory.setCategory(category);
        factory.setConfigVOList(configMapper.listSystemConfig(param));

        if(category.equals("service")) {
            SystemConfigVO addConfig = new SystemConfigVO();
            addConfig.setCategory(category);
            addConfig.setName("sProductName");
            addConfig.setValue("ANSIM USB v3.0");

            factory.getConfigVOList().add(addConfig);

            addConfig = new SystemConfigVO();
            addConfig.setCategory(category);
            addConfig.setName("sProductVersion");
            addConfig.setValue("3.0.0.1");

            factory.getConfigVOList().add(addConfig);

            addConfig = new SystemConfigVO();
            addConfig.setCategory(category);
            addConfig.setName("sProductBuild");
            addConfig.setValue("20230315.1");

            factory.getConfigVOList().add(addConfig);
        }


        return factory;
    }

    @Override
    @Transactional
    public int saveSystemConfig(SystemConfigFactory factory) {
        int count = 0;
        for(SystemConfigVO config : factory.getConfigVOList()) {
            SystemConfigVO existConfig = configMapper.readSystemConfig(config);
            if(existConfig != null) {
                count = configMapper.updateSystemConfig(config);
            }
            else {
                count = configMapper.insertSystemConfig(config);
            }
        }
        return count;
    }
}
