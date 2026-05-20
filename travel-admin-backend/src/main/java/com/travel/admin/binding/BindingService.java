package com.travel.admin.binding;

import com.travel.admin.audit.AuditService;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BindingService {

    private final JdbcTemplate jdbcTemplate;
    private final AuditService auditService;

    public BindingService(JdbcTemplate jdbcTemplate, AuditService auditService) {
        this.jdbcTemplate = jdbcTemplate;
        this.auditService = auditService;
    }

    public PageResult<Map<String, Object>> list(int page, int pageSize, Long salesUserId) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("binding:manage") && !user.hasRole("SALES")) {
            throw new BusinessException(403, "无查看客户归属权限");
        }
        Long filterSales = salesUserId;
        if (user.hasRole("SALES")) {
            filterSales = user.getUserId();
        }
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM sales_customer_binding b WHERE 1=1");
        StringBuilder listSql = new StringBuilder(
                "SELECT b.*, s.real_name AS sales_name, a.real_name AS assigned_by_name " +
                        "FROM sales_customer_binding b " +
                        "LEFT JOIN admin_user s ON s.id = b.sales_admin_user_id " +
                        "LEFT JOIN admin_user a ON a.id = b.assigned_by_admin_user_id WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();
        if (filterSales != null) {
            countSql.append(" AND b.sales_admin_user_id = ?");
            listSql.append(" AND b.sales_admin_user_id = ?");
            params.add(filterSales);
        }
        Long total = jdbcTemplate.queryForObject(countSql.toString(), Long.class, params.toArray());
        listSql.append(" ORDER BY b.id DESC LIMIT ? OFFSET ?");
        List<Object> listParams = new ArrayList<>(params);
        listParams.add(pageSize);
        listParams.add((page - 1) * pageSize);
        List<Map<String, Object>> records = jdbcTemplate.queryForList(listSql.toString(), listParams.toArray());
        return new PageResult<>(records, total == null ? 0 : total, page, pageSize);
    }

    public Long create(Long salesUserId, String customerName, String customerPhone) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("binding:manage")) {
            throw new BusinessException(403, "无管理客户归属权限");
        }
        jdbcTemplate.update(
                "INSERT INTO sales_customer_binding (sales_admin_user_id, customer_name, customer_phone, assigned_by_admin_user_id) VALUES (?,?,?,?)",
                salesUserId,
                customerName,
                customerPhone,
                user.getUserId()
        );
        Long id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        auditService.logOperation(user.getUserId(), user.getUsername(), "binding", "create",
                "分配客户 " + customerName + " 给销售ID=" + salesUserId, null);
        return id;
    }

    public void delete(Long id) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("binding:manage")) {
            throw new BusinessException(403, "无管理客户归属权限");
        }
        jdbcTemplate.update("DELETE FROM sales_customer_binding WHERE id = ?", id);
        auditService.logOperation(user.getUserId(), user.getUsername(), "binding", "delete",
                "解除客户归属 ID=" + id, null);
    }
}
