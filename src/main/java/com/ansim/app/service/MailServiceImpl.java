package com.ansim.app.service;

import com.ansim.app.domain.EmailVO;
import com.ansim.app.factory.SystemConfigFactory;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.log.NullLogChute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;
import java.io.File;
import java.io.StringWriter;
import java.util.Properties;

@Log4j2
@Service
public class MailServiceImpl implements MailService {

    @Setter(onMethod_ =  { @Autowired})
    private ServletContext servletContext;

    private static JavaMailSenderImpl getSender(SystemConfigFactory mailFactory) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        sender.setHost(mailFactory.getStringValue("sMailServer"));
        sender.setUsername(mailFactory.getStringValue("sMailAccount"));
        sender.setPassword(mailFactory.getStringValue("pMailPassword"));
        sender.setPort(mailFactory.getIntValue("nMailPort"));
        sender.setProtocol("smtps");
        sender.setDefaultEncoding("UTF-8");


        Properties props = new Properties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", mailFactory.getValue("sMailServer"));
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.ssl.enable", "false");

        sender.setJavaMailProperties(props);

        return sender;
    }

    @Override
    public void sendEmail(SystemConfigFactory mailFactory, EmailVO email) throws MailException {
        Properties props = new Properties();
        props.setProperty("resource.loader", "class");
        props.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");

        JavaMailSender mailSender = getSender(mailFactory);
        VelocityEngine ve = new VelocityEngine(props);
        ve.setProperty(RuntimeConstants.RUNTIME_LOG_LOGSYSTEM_CLASS, new NullLogChute());
        StringWriter writer = new StringWriter();

        ve.init();

        VelocityContext context = new VelocityContext();
        email.getEmailMap().forEach((key, value)
                -> context.put(key, value));

        Template t = ve.getTemplate(email.getVelocityTemplate(), "UTF-8");
        t.merge(context, writer);

        email.setContent(writer.toString());

        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                final MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom(email.getFrom());
                helper.setTo(email.getReceiver());
                helper.setSubject(email.getSubject());
                if(email.getHtmlYn().equals("html")) {
                    helper.setText(email.getContent(), true);
                }
                else {
                    helper.setText(email.getContent());
                }

                if(email.getInlineAttach() != null) {
                    email.getInlineAttach().forEach((key, value)
                            -> {
                        try {
                            helper.addInline(key, new FileSystemResource(new File(servletContext.getRealPath(value.toString()))));
                        } catch (MessagingException e) {
                            e.printStackTrace();
                        }
                    });
                }
            }
        };

        mailSender.send(preparator);
    }

    @Override
    public void sendEmailTemplate(SystemConfigFactory mailFactory, EmailVO emailTemplate) {
        try {
            sendEmail(mailFactory, emailTemplate);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
