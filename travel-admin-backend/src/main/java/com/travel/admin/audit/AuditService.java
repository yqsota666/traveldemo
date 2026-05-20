package com.travel.admin.audit;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final JdbcTemplate jdbcTemplate;

    public AuditService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void logLogin(Long userId, String username, boolean success, String ip, String userAgent, String message) {
        jdbcTemplate.update(
                "INSERT INTO admin_login_log (admin_user_id, username, login_status, login_ip) VALUES (?,?,?,?)",
                userId == null ? 0L : userId,
                username,
                success ? "SUCCESS" : "FAILED",
                ip
        );
    }

    public void logOperation(Long userId, String username, String module, String action, String detail, String ip) {
        jdbcTemplate.update(
                "INSERT INTO admin_operation_log (admin_user_id, operation_type, target_type, target_id, operation_detail) VALUES (?,?,?,?,?)",
                userId,
                action,
                module,
                null,
                "[" + username + "] " + detail + (ip != null ? " IP=" + ip : "")
        );
    }

    public void logOrderOperation(Long orderId, Long operatorId, String type, String detail) {
        jdbcTemplate.update(
                "INSERT INTO order_operation_log (order_id, operator_admin_user_id, operation_type, operation_detail) VALUES (?,?,?,?)",
                orderId,
                operatorId,
                type,
                detail
        );
    }
}
