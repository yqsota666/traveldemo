package com.travel.admin.security;

import com.travel.admin.rbac.AdminUserRepository;
import com.travel.admin.rbac.model.AdminUserRecord;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUserRecord user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));
        List<String> roles = adminUserRepository.findRoleCodesByUserId(user.getId());
        List<String> permissions = adminUserRepository.findPermissionCodesByUserId(user.getId());
        return new AdminPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getRealName(),
                user.getStatus(),
                roles,
                permissions
        );
    }

    public AdminPrincipal loadByUserId(Long userId) {
        AdminUserRecord user = adminUserRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));
        List<String> roles = adminUserRepository.findRoleCodesByUserId(user.getId());
        List<String> permissions = adminUserRepository.findPermissionCodesByUserId(user.getId());
        return new AdminPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getRealName(),
                user.getStatus(),
                roles,
                permissions
        );
    }
}
