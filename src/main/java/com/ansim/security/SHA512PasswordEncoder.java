package com.ansim.security;

import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.MessageDigest;

@Log4j2
@Data
public class SHA512PasswordEncoder implements PasswordEncoder {

    private String salt;

    @Override
    public String encode(CharSequence rawPassword) {
        if (rawPassword == null) {
            throw new IllegalArgumentException("rawPassword cannot be null");
        }
        rawPassword += salt;
        return this.getSHA512Pw(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (rawPassword == null) {
            throw new IllegalArgumentException("rawPassword cannot be null");
        }
        if (encodedPassword == null || encodedPassword.length() == 0) {
            log.info("Empty encoded password");
            return false;
        }

        String encodedRawPw = this.getSHA512Pw(rawPassword);
        if (encodedPassword.length() != encodedRawPw.length()) {
            return false;
        }
        for (int i = 0; i < encodedPassword.length(); i++) {
            if (encodedPassword.charAt(i) != encodedRawPw.charAt(i))
                return false;
        }
        return true;
    }

    private String getSHA512Pw(CharSequence rawPassword) {
        String token = rawPassword.toString();
        if(salt != null) {
            token += salt;
        }
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-512");
            md.update(token.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }

        byte[] msgb = md.digest();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < msgb.length; i++) {
            String tmp = Integer.toHexString(msgb[i] & 0xFF);
            while (tmp.length() < 2)
                tmp = "0" + tmp;
            sb.append(tmp.substring(tmp.length() - 2));
        }
        return sb.toString();
    }
}
