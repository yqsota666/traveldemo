package com.travel.admin.order;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.PageResult;
import com.travel.admin.order.dto.DeleteRequestCreate;
import com.travel.admin.order.dto.OrderCreateRequest;
import com.travel.admin.order.dto.OrderUpdateRequest;
import com.travel.admin.order.model.OrderDeleteRequestRecord;
import com.travel.admin.order.model.TravelOrderRecord;
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
@RequestMapping("/api/admin/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ApiResponse<PageResult<TravelOrderRecord>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(orderService.listOrders(page, pageSize, keyword, status));
    }

    @GetMapping("/{id}")
    public ApiResponse<TravelOrderRecord> detail(@PathVariable Long id) {
        return ApiResponse.ok(orderService.getOrder(id));
    }

    @PostMapping
    public ApiResponse<TravelOrderRecord> create(@Validated @RequestBody OrderCreateRequest request) {
        return ApiResponse.ok(orderService.createOrder(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TravelOrderRecord> update(@PathVariable Long id,
                                                 @Validated @RequestBody OrderUpdateRequest request) {
        return ApiResponse.ok(orderService.updateOrder(id, request));
    }

    @PostMapping("/{id}/delete-request")
    public ApiResponse<Long> requestDelete(@PathVariable Long id,
                                           @Validated @RequestBody DeleteRequestCreate request) {
        return ApiResponse.ok(orderService.requestDelete(id, request));
    }

    @GetMapping("/{id}/logs")
    public ApiResponse<List<Map<String, Object>>> logs(@PathVariable Long id) {
        return ApiResponse.ok(orderService.listOrderLogs(id));
    }

    @GetMapping("/delete-requests")
    public ApiResponse<PageResult<OrderDeleteRequestRecord>> deleteRequests(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(orderService.listDeleteRequests(page, pageSize, status));
    }

    @PostMapping("/delete-requests/{requestId}/approve")
    public ApiResponse<Void> approve(@PathVariable Long requestId) {
        orderService.approveDelete(requestId, true);
        return ApiResponse.ok(null);
    }

    @PostMapping("/delete-requests/{requestId}/reject")
    public ApiResponse<Void> reject(@PathVariable Long requestId) {
        orderService.approveDelete(requestId, false);
        return ApiResponse.ok(null);
    }
}
