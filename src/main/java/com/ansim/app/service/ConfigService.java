package com.ansim.app.service;

import com.ansim.app.factory.SystemConfigFactory;

public interface ConfigService {
    public SystemConfigFactory loadSystemConfig(String category);
    public int saveSystemConfig(SystemConfigFactory factory);
}
