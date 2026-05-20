package com.travel.admin.security;

import com.travel.admin.common.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static AdminPrincipal currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AdminPrincipal)) {
            throw new BusinessException(401, "未登录");
        }
        return (AdminPrincipal) auth.getPrincipal();
    }

    public static Long currentUserId() {
        return currentUser().getUserId();
    }
}
