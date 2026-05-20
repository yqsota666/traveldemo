package com.travel.admin.auth;

import com.travel.admin.auth.dto.LoginRequest;
import com.travel.admin.auth.dto.LoginResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void loginWithSeedSuperAdmin() {
        LoginRequest request = new LoginRequest();
        request.setUsername("superadmin");
        request.setPassword("admin123");
        LoginResponse response = authService.login(request, new MockHttpServletRequest());
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getUser());
    }
}
