package com.travel.admin.dashboard;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.order.OrderRepository;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/v1/dashboard")
public class DashboardController {

    private final OrderRepository orderRepository;
    private final JdbcTemplate jdbcTemplate;

    public DashboardController(OrderRepository orderRepository, JdbcTemplate jdbcTemplate) {
        this.orderRepository = orderRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> stats() {
        AdminPrincipal user = SecurityUtils.currentUser();
        Long salesFilter = user.hasPermission("order:view_all") ? null : user.getUserId();
        Map<String, Object> stats = new HashMap<>();
        stats.put("orderCount", orderRepository.countDashboardOrders(salesFilter));
        stats.put("pendingDeleteCount", user.hasPermission("order:approve_delete")
                ? orderRepository.countPendingDeleteRequests() : 0);
        Long adminCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM admin_user WHERE status = 'ENABLED'",
                Long.class
        );
        stats.put("adminCount", adminCount == null ? 0 : adminCount);
        Long bindingCount;
        if (salesFilter == null) {
            bindingCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM sales_customer_binding",
                    Long.class
            );
        } else {
            bindingCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM sales_customer_binding WHERE sales_admin_user_id = ?",
                    Long.class,
                    salesFilter
            );
        }
        stats.put("customerBindingCount", bindingCount == null ? 0 : bindingCount);
        stats.put("roleCodes", user.getRoles());
        stats.put("realName", user.getRealName());
        return ApiResponse.ok(stats);
    }
}
