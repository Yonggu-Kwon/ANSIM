package com.ansim.app.service;

import com.ansim.app.domain.EmailVO;
import com.ansim.app.factory.SystemConfigFactory;
import org.springframework.mail.MailException;

public interface MailService {
    public void sendEmail(SystemConfigFactory mailFactory, EmailVO email) throws MailException;
    public void sendEmailTemplate(SystemConfigFactory mailFactory, EmailVO emailTemplate);
}
