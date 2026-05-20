package com.travel.admin.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class PasswordInitRunner implements ApplicationRunner {

    private static final String DEFAULT_PASSWORD = "admin123";
    private static final List<String> SEED_USERNAMES = Arrays.asList(
            "superadmin", "director01", "sales01"
    );

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public PasswordInitRunner(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String bcryptHash = passwordEncoder.encode(DEFAULT_PASSWORD);
        for (String username : SEED_USERNAMES) {
            jdbcTemplate.update(
                    "UPDATE admin_user SET password_hash = ? WHERE username = ? AND password_hash NOT LIKE '$2a$%'",
                    bcryptHash,
                    username
            );
        }
    }
}
