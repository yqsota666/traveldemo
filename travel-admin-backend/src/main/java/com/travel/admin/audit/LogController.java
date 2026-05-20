package com.travel.admin.audit;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/v1/logs")
public class LogController {

    private final JdbcTemplate jdbcTemplate;

    public LogController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/login")
    public ApiResponse<PageResult<Map<String, Object>>> loginLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        assertLogPermission();
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM admin_login_log", Long.class);
        List<Map<String, Object>> records = jdbcTemplate.queryForList(
                "SELECT * FROM admin_login_log ORDER BY id DESC LIMIT ? OFFSET ?",
                pageSize,
                (page - 1) * pageSize
        );
        return ApiResponse.ok(new PageResult<>(records, total == null ? 0 : total, page, pageSize));
    }

    @GetMapping("/operation")
    public ApiResponse<PageResult<Map<String, Object>>> operationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        assertLogPermission();
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM admin_operation_log", Long.class);
        List<Map<String, Object>> records = jdbcTemplate.queryForList(
                "SELECT * FROM admin_operation_log ORDER BY id DESC LIMIT ? OFFSET ?",
                pageSize,
                (page - 1) * pageSize
        );
        return ApiResponse.ok(new PageResult<>(records, total == null ? 0 : total, page, pageSize));
    }

    private void assertLogPermission() {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("log:view")) {
            throw new BusinessException(403, "无查看日志权限");
        }
    }
}
