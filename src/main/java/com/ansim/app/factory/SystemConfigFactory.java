package com.ansim.app.factory;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Data
public class SystemConfigFactory {
    private String category;
    private List<SystemConfigVO> configVOList;

    private SystemConfigVO findConfig(String name) {
        SystemConfigVO config = null;

        if(configVOList == null || configVOList.size()==0) {
            return null;
        }

        try {
            config = configVOList.stream().filter(x -> x.getName().equals(name)).findAny().get();
        }
        catch (Exception ignored) {
        }
        return config;
    }

    public void deleteConfig(String name) {
        if(configVOList == null || configVOList.size()==0) {
            return;
        }

        configVOList.removeIf(x -> x.getName().equals(name));
    }

    public String getStringValue(String name) {
        try {
            SystemConfigVO config = findConfig(name);
            if (config == null) {
                return "";
            }

            if(config.getValue() == null) {
                return "";
            }
            return config.getValue();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public String getValue(String name) {
        try {
            SystemConfigVO config = findConfig(name);
            if (config == null) {
                return "";
            }

            return config.getValue();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public int getIntValue(String name) {
        try {
            SystemConfigVO config = findConfig(name);
            if (config == null) {
                return 0;
            }

            return config.getValue().equals("") ? 0 : Integer.parseInt(config.getValue());
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public boolean getBooleanValue(String name) {
        try {
            SystemConfigVO config = findConfig(name);
            if (config == null) {
                return false;
            }

            return config.getValue().equals("1") || config.getValue().equalsIgnoreCase("true") || config.getValue().equalsIgnoreCase("on");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isExist(String name) {
        boolean exist = false;
        try {
            SystemConfigVO config = findConfig(name);
            if(config != null) {
                return true;
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public void setNewValue(String name, String value) {
        if(configVOList == null) {
            configVOList = new ArrayList<>();
        }

        SystemConfigVO config = null;
        try {
            config = findConfig(name);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        if (config == null) {
            config = new SystemConfigVO();
            config.setCategory(category);
            config.setName(name);
            config.setValue(value);
            configVOList.add(config);
        } else {
            config.setValue(value);
        }
    }

    public HashMap<String, Object> getAsHashMap() {
        HashMap<String, Object> map = new HashMap<>();
        for(int i=0; i<getConfigVOList().size(); i++) {
            String name = getConfigVOList().get(i).getName();
            if(name.startsWith("n")) {
                map.put(name, getIntValue(name));
            }
            else if(name.startsWith("b")) {
                map.put(name, getBooleanValue(name));
            }
            else {
                map.put(name, getStringValue(name));
            }
        }
        return map;
    }
}
