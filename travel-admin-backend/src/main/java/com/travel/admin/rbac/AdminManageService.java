package com.travel.admin.rbac;

import com.travel.admin.audit.AuditService;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import com.travel.admin.rbac.dto.AdminCreateRequest;
import com.travel.admin.rbac.dto.AdminUpdateRequest;
import com.travel.admin.rbac.dto.AdminUserVO;
import com.travel.admin.rbac.model.AdminUserRecord;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminManageService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final JdbcTemplate jdbcTemplate;

    public AdminManageService(AdminUserRepository adminUserRepository,
                              PasswordEncoder passwordEncoder,
                              AuditService auditService,
                              JdbcTemplate jdbcTemplate) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
        this.jdbcTemplate = jdbcTemplate;
    }

    public PageResult<AdminUserVO> listAdmins(int page, int pageSize, String keyword, String roleCode) {
        AdminPrincipal current = SecurityUtils.currentUser();
        if (!current.hasPermission("admin:user:view")) {
            throw new BusinessException(403, "无查看管理员权限");
        }
        String roleFilter = resolveRoleFilter(current, roleCode);
        int offset = (page - 1) * pageSize;
        long total = adminUserRepository.countAdmins(keyword, roleFilter);
        List<AdminUserVO> records = adminUserRepository.listAdmins(keyword, roleFilter, offset, pageSize)
                .stream()
                .map(this::toVo)
                .collect(Collectors.toList());
        return new PageResult<>(records, total, page, pageSize);
    }

    @Transactional
    public AdminUserVO createAdmin(AdminCreateRequest request) {
        AdminPrincipal current = SecurityUtils.currentUser();
        assertCanManageRole(current, request.getRoleCode());
        if (!current.hasPermission("admin:user:create")) {
            throw new BusinessException(403, "无创建管理员权限");
        }
        if (adminUserRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessException(400, "用户名已存在");
        }
        AdminUserRecord user = new AdminUserRecord();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getRealName());
        user.setPhone(request.getPhone());
        user.setStatus("ENABLED");
        Long userId = adminUserRepository.insert(user);
        Long roleId = adminUserRepository.findRoleIdByCode(request.getRoleCode())
                .orElseThrow(() -> new BusinessException(400, "角色不存在"));
        adminUserRepository.assignRole(userId, roleId);
        auditService.logOperation(current.getUserId(), current.getUsername(), "admin", "create",
                "创建管理员 " + request.getUsername() + " 角色=" + request.getRoleCode(), null);
        return toVo(adminUserRepository.findById(userId).orElseThrow());
    }

    @Transactional
    public AdminUserVO updateAdmin(Long id, AdminUpdateRequest request) {
        AdminPrincipal current = SecurityUtils.currentUser();
        if (!current.hasPermission("admin:user:update")) {
            throw new BusinessException(403, "无编辑管理员权限");
        }
        AdminUserRecord user = adminUserRepository.findById(id)
                .orElseThrow(() -> new BusinessException(404, "管理员不存在"));
        List<String> targetRoles = adminUserRepository.findRoleCodesByUserId(id);
        assertCanManageTarget(current, targetRoles);
        user.setRealName(request.getRealName());
        user.setPhone(request.getPhone());
        user.setStatus(request.getStatus());
        adminUserRepository.update(user);
        auditService.logOperation(current.getUserId(), current.getUsername(), "admin", "update",
                "更新管理员 " + user.getUsername(), null);
        return toVo(user);
    }

    public List<Map<String, Object>> listRoles() {
        return jdbcTemplate.queryForList("SELECT * FROM admin_role ORDER BY id");
    }

    public List<Map<String, Object>> listPermissions() {
        return jdbcTemplate.queryForList("SELECT * FROM admin_permission ORDER BY id");
    }

    public List<Map<String, Object>> rolePermissionMatrix() {
        return jdbcTemplate.queryForList(
                "SELECT r.role_code, r.role_name, p.permission_code, p.permission_name " +
                        "FROM admin_role r " +
                        "INNER JOIN admin_role_permission rp ON rp.admin_role_id = r.id " +
                        "INNER JOIN admin_permission p ON p.id = rp.admin_permission_id " +
                        "ORDER BY r.id, p.id"
        );
    }

    private String resolveRoleFilter(AdminPrincipal current, String requestedRole) {
        if (current.hasRole("SUPER_ADMIN")) {
            return requestedRole;
        }
        if (current.hasRole("SENIOR_ADMIN")) {
            return "SALES";
        }
        throw new BusinessException(403, "无权查看管理员列表");
    }

    private void assertCanManageRole(AdminPrincipal current, String roleCode) {
        if (current.hasRole("SUPER_ADMIN")) {
            return;
        }
        if (current.hasRole("SENIOR_ADMIN") && "SALES".equals(roleCode)) {
            return;
        }
        throw new BusinessException(403, "无权创建该角色账号");
    }

    private void assertCanManageTarget(AdminPrincipal current, List<String> targetRoles) {
        if (current.hasRole("SUPER_ADMIN")) {
            return;
        }
        if (current.hasRole("SENIOR_ADMIN") && targetRoles.size() == 1 && "SALES".equals(targetRoles.get(0))) {
            return;
        }
        throw new BusinessException(403, "无权操作该账号");
    }

    private AdminUserVO toVo(AdminUserRecord record) {
        AdminUserVO vo = new AdminUserVO();
        vo.setId(record.getId());
        vo.setUsername(record.getUsername());
        vo.setRealName(record.getRealName());
        vo.setPhone(record.getPhone());
        vo.setStatus(record.getStatus());
        vo.setRoles(adminUserRepository.findRoleCodesByUserId(record.getId()));
        vo.setLastLoginAt(record.getLastLoginAt());
        vo.setCreatedAt(record.getCreatedAt());
        return vo;
    }
}
