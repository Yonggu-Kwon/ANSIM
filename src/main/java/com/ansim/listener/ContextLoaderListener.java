package com.ansim.listener;

import lombok.extern.log4j.Log4j2;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
@Log4j2
public class ContextLoaderListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("===== START CONTEXT INITIALIZE =====");
        log.info("===== END   CONTEXT INITIALIZE =====");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("===== START CONTEXT DESTROY    =====");
        log.info("===== END   CONTEXT DESTROY    =====");
    }
}
