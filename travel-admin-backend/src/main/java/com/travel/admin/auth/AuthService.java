package com.travel.admin.auth;

import com.travel.admin.audit.AuditService;
import com.travel.admin.auth.dto.ChangePasswordRequest;
import com.travel.admin.auth.dto.LoginRequest;
import com.travel.admin.auth.dto.LoginResponse;
import com.travel.admin.auth.dto.MeResponse;
import com.travel.admin.common.BusinessException;
import com.travel.admin.rbac.AdminUserRepository;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.AdminUserDetailsService;
import com.travel.admin.security.JwtTokenProvider;
import com.travel.admin.security.SecurityUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AdminUserRepository adminUserRepository;
    private final AdminUserDetailsService adminUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       AdminUserRepository adminUserRepository,
                       AdminUserDetailsService adminUserDetailsService,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.adminUserRepository = adminUserRepository;
        this.adminUserDetailsService = adminUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String ip = resolveIp(httpRequest);
        String ua = httpRequest.getHeader("User-Agent");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            AdminPrincipal principal = (AdminPrincipal) authentication.getPrincipal();
            adminUserRepository.updateLastLogin(principal.getUserId());
            auditService.logLogin(principal.getUserId(), principal.getUsername(), true, ip, ua, "登录成功");

            String token = jwtTokenProvider.createToken(
                    principal.getUserId(),
                    principal.getUsername(),
                    principal.getRoles(),
                    principal.getPermissions()
            );
            LoginResponse response = new LoginResponse();
            response.setAccessToken(token);
            response.setExpireSeconds(jwtTokenProvider.getExpireSeconds());
            response.setUser(toMeResponse(principal));
            return response;
        } catch (Exception ex) {
            auditService.logLogin(null, request.getUsername(), false, ip, ua, "登录失败");
            throw ex;
        }
    }

    public MeResponse me() {
        return toMeResponse(SecurityUtils.currentUser());
    }

    public void changePassword(ChangePasswordRequest request) {
        AdminPrincipal principal = SecurityUtils.currentUser();
        if (!passwordEncoder.matches(request.getOldPassword(), principal.getPassword())) {
            throw new BusinessException(400, "原密码不正确");
        }
        String hash = passwordEncoder.encode(request.getNewPassword());
        adminUserRepository.updatePassword(principal.getUserId(), hash);
        auditService.logOperation(
                principal.getUserId(),
                principal.getUsername(),
                "auth",
                "change_password",
                "修改登录密码",
                null
        );
    }

    private MeResponse toMeResponse(AdminPrincipal principal) {
        MeResponse me = new MeResponse();
        me.setId(principal.getUserId());
        me.setUsername(principal.getUsername());
        me.setRealName(principal.getRealName());
        me.setRoles(principal.getRoles());
        me.setPermissions(principal.getPermissions());
        return me;
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
