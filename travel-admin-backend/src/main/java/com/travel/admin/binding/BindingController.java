package com.travel.admin.binding;

import com.travel.admin.binding.dto.BindingCreateRequest;
import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.PageResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/v1/sales-bindings")
public class BindingController {

    private final BindingService bindingService;

    public BindingController(BindingService bindingService) {
        this.bindingService = bindingService;
    }

    @GetMapping
    public ApiResponse<PageResult<Map<String, Object>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long salesUserId) {
        return ApiResponse.ok(bindingService.list(page, pageSize, salesUserId));
    }

    @PostMapping
    public ApiResponse<Long> create(@Validated @RequestBody BindingCreateRequest request) {
        return ApiResponse.ok(bindingService.create(
                request.getSalesAdminUserId(),
                request.getCustomerName(),
                request.getCustomerPhone()
        ));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        bindingService.delete(id);
        return ApiResponse.ok(null);
    }
}
