package com.travel.admin.rbac;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.PageResult;
import com.travel.admin.rbac.dto.AdminCreateRequest;
import com.travel.admin.rbac.dto.AdminUpdateRequest;
import com.travel.admin.rbac.dto.AdminUserVO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/v1")
public class AdminController {

    private final AdminManageService adminManageService;

    public AdminController(AdminManageService adminManageService) {
        this.adminManageService = adminManageService;
    }

    @GetMapping("/admins")
    public ApiResponse<PageResult<AdminUserVO>> listAdmins(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String roleCode) {
        return ApiResponse.ok(adminManageService.listAdmins(page, pageSize, keyword, roleCode));
    }

    @PostMapping("/admins")
    public ApiResponse<AdminUserVO> create(@Validated @RequestBody AdminCreateRequest request) {
        return ApiResponse.ok(adminManageService.createAdmin(request));
    }

    @PutMapping("/admins/{id}")
    public ApiResponse<AdminUserVO> update(@PathVariable Long id,
                                           @Validated @RequestBody AdminUpdateRequest request) {
        return ApiResponse.ok(adminManageService.updateAdmin(id, request));
    }

    @GetMapping("/roles")
    public ApiResponse<List<Map<String, Object>>> roles() {
        return ApiResponse.ok(adminManageService.listRoles());
    }

    @GetMapping("/permissions")
    public ApiResponse<List<Map<String, Object>>> permissions() {
        return ApiResponse.ok(adminManageService.listPermissions());
    }

    @GetMapping("/roles/permissions-matrix")
    public ApiResponse<List<Map<String, Object>>> matrix() {
        return ApiResponse.ok(adminManageService.rolePermissionMatrix());
    }
}
