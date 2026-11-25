package com.authsphere_backend.common.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@authsphere.local}")
    private String fromEmail;

    @Value("${app.cors.front-end-url:http://localhost:5173}")
    private String frontendUrl;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public void sendVerificationEmail(String toEmail, String name, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your AuthSphere email";
        String html = """
                <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff;">
                  <h2>Welcome to AuthSphere, %s!</h2>
                  <p>Please verify your email address by clicking the button below:</p>
                  <p><a href="%s" style="display:inline-block;padding:12px 24px;background:#06b6d4;color:#000;text-decoration:none;border-radius:8px;font-weight:600;">Verify Email</a></p>
                  <p style="color:#888;font-size:12px;">Or copy this link: %s</p>
                </div>
                """.formatted(name != null ? name : "there", link, link);

        sendEmail(toEmail, subject, html, link);
    }

    public void sendPasswordResetEmail(String toEmail, String name, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset your AuthSphere password";
        String html = """
                <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff;">
                  <h2>Password Reset Request</h2>
                  <p>Hi %s, click the button below to reset your password (valid for 15 minutes):</p>
                  <p><a href="%s" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Reset Password</a></p>
                  <p style="color:#888;font-size:12px;">Or copy this link: %s</p>
                </div>
                """.formatted(name != null ? name : "there", link, link);

        sendEmail(toEmail, subject, html, link);
    }

    private void sendEmail(String to, String subject, String htmlContent, String fallbackLink) {
        if (mailSender == null || fromEmail.endsWith(".local")) {
            logger.info("[DEV EMAIL] To: {} | Subject: {} | Link: {}", to, subject, fallbackLink);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Sent email '{}' to {}", subject, to);
        } catch (Exception e) {
            logger.warn("SMTP send failed for {} (falling back to log): {} | Link: {}", to, e.getMessage(), fallbackLink);
        }
    }
}
