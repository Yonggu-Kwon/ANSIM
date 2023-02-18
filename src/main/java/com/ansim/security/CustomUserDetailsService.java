package com.ansim.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomUserDetailsService implements UserDetailsService {

    private String salt = "";

    @Bean
    public PasswordEncoder passwordEncoder() {
        SHA512PasswordEncoder pwEncoder = new SHA512PasswordEncoder();
        pwEncoder.setSalt(salt);
        return pwEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
