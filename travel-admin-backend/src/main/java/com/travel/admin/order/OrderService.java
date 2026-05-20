package com.travel.admin.order;

import com.travel.admin.audit.AuditService;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import com.travel.admin.order.dto.DeleteRequestCreate;
import com.travel.admin.order.dto.OrderCreateRequest;
import com.travel.admin.order.dto.OrderUpdateRequest;
import com.travel.admin.order.model.OrderDeleteRequestRecord;
import com.travel.admin.order.model.TravelOrderRecord;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderService {

    private static final AtomicInteger ORDER_SEQ = new AtomicInteger(100);

    private final OrderRepository orderRepository;
    private final AuditService auditService;

    public OrderService(OrderRepository orderRepository, AuditService auditService) {
        this.orderRepository = orderRepository;
        this.auditService = auditService;
    }

    public PageResult<TravelOrderRecord> listOrders(int page, int pageSize, String keyword, String status) {
        AdminPrincipal user = SecurityUtils.currentUser();
        Long salesFilter = resolveSalesFilter(user);
        int offset = (page - 1) * pageSize;
        long total = orderRepository.countOrders(salesFilter, keyword, status);
        List<TravelOrderRecord> records = orderRepository.listOrders(salesFilter, keyword, status, offset, pageSize);
        return new PageResult<>(records, total, page, pageSize);
    }

    public TravelOrderRecord getOrder(Long id) {
        TravelOrderRecord order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(404, "订单不存在"));
        assertCanView(order);
        return order;
    }

    @Transactional
    public TravelOrderRecord createOrder(OrderCreateRequest request) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("order:create")) {
            throw new BusinessException(403, "无创建订单权限");
        }
        TravelOrderRecord order = new TravelOrderRecord();
        order.setOrderNo(generateOrderNo());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setDestinationCity(request.getDestinationCity());
        order.setTravelDate(request.getTravelDate());
        order.setTravelerCount(request.getTravelerCount());
        order.setTotalAmount(request.getTotalAmount());
        order.setOrderStatus(request.getOrderStatus() == null ? "PENDING" : request.getOrderStatus());

        if (user.hasPermission("order:view_all") && request.getSalesAdminUserId() != null) {
            order.setSalesAdminUserId(request.getSalesAdminUserId());
        } else {
            order.setSalesAdminUserId(user.getUserId());
        }
        order.setCreatedByAdminUserId(user.getUserId());

        Long id = orderRepository.insert(order);
        order.setId(id);
        auditService.logOrderOperation(id, user.getUserId(), "CREATE", "创建旅游订单：" + order.getOrderNo());
        auditService.logOperation(user.getUserId(), user.getUsername(), "order", "create",
                "创建订单 " + order.getOrderNo(), null);
        return orderRepository.findById(id).orElse(order);
    }

    @Transactional
    public TravelOrderRecord updateOrder(Long id, OrderUpdateRequest request) {
        AdminPrincipal user = SecurityUtils.currentUser();
        TravelOrderRecord existing = getOrder(id);
        assertCanUpdate(existing, user);

        String before = existing.getOrderNo() + " 状态=" + existing.getOrderStatus();
        existing.setCustomerName(request.getCustomerName());
        existing.setCustomerPhone(request.getCustomerPhone());
        existing.setDestinationCity(request.getDestinationCity());
        existing.setTravelDate(request.getTravelDate());
        existing.setTravelerCount(request.getTravelerCount());
        existing.setTotalAmount(request.getTotalAmount());
        existing.setOrderStatus(request.getOrderStatus());
        orderRepository.update(existing);

        String after = existing.getOrderNo() + " 状态=" + existing.getOrderStatus();
        auditService.logOrderOperation(id, user.getUserId(), "UPDATE", "修改订单，变更前：" + before + "；变更后：" + after);
        auditService.logOperation(user.getUserId(), user.getUsername(), "order", "update",
                "修改订单 " + existing.getOrderNo(), null);
        return orderRepository.findById(id).orElse(existing);
    }

    @Transactional
    public Long requestDelete(Long orderId, DeleteRequestCreate request) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("order:delete_request")) {
            throw new BusinessException(403, "无发起删除申请权限");
        }
        TravelOrderRecord order = getOrder(orderId);
        if (!user.hasPermission("order:view_all") && !user.getUserId().equals(order.getSalesAdminUserId())) {
            throw new BusinessException(403, "只能申请删除自己负责的订单");
        }
        if (orderRepository.hasPendingDeleteRequest(orderId)) {
            throw new BusinessException(400, "该订单已有待审批的删除申请");
        }
        Long requestId = orderRepository.createDeleteRequest(orderId, user.getUserId(), request.getReason());
        auditService.logOrderOperation(orderId, user.getUserId(), "DELETE_REQUEST",
                "发起删除审批，原因：" + request.getReason());
        auditService.logOperation(user.getUserId(), user.getUsername(), "order", "delete_request",
                "订单 " + order.getOrderNo() + " 发起删除申请", null);
        return requestId;
    }

    @Transactional
    public void approveDelete(Long requestId, boolean approved) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("order:approve_delete")) {
            throw new BusinessException(403, "无审批删除权限");
        }
        OrderDeleteRequestRecord deleteRequest = orderRepository.findDeleteRequestById(requestId)
                .orElseThrow(() -> new BusinessException(404, "删除申请不存在"));
        if (!"PENDING".equals(deleteRequest.getRequestStatus())) {
            throw new BusinessException(400, "该申请已处理");
        }
        String status = approved ? "APPROVED" : "REJECTED";
        orderRepository.processDeleteRequest(requestId, user.getUserId(), status);
        if (approved) {
            orderRepository.softDelete(deleteRequest.getOrderId());
            auditService.logOrderOperation(deleteRequest.getOrderId(), user.getUserId(), "DELETE_APPROVED",
                    "审批通过删除订单，申请ID=" + requestId);
        } else {
            auditService.logOrderOperation(deleteRequest.getOrderId(), user.getUserId(), "DELETE_REJECTED",
                    "驳回删除申请，申请ID=" + requestId);
        }
        auditService.logOperation(user.getUserId(), user.getUsername(), "order", "approve_delete",
                "处理删除申请 #" + requestId + " 结果=" + status, null);
    }

    public PageResult<OrderDeleteRequestRecord> listDeleteRequests(int page, int pageSize, String status) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("order:approve_delete") && !user.hasPermission("order:delete_request")) {
            throw new BusinessException(403, "无查看删除申请权限");
        }
        int offset = (page - 1) * pageSize;
        long total = orderRepository.countDeleteRequests(status);
        List<OrderDeleteRequestRecord> records = orderRepository.listDeleteRequests(status, offset, pageSize);
        return new PageResult<>(records, total, page, pageSize);
    }

    public List<Map<String, Object>> listOrderLogs(Long orderId) {
        getOrder(orderId);
        return orderRepository.listOrderLogs(orderId);
    }

    private Long resolveSalesFilter(AdminPrincipal user) {
        if (user.hasPermission("order:view_all")) {
            return null;
        }
        if (user.hasPermission("order:view_assigned")) {
            return user.getUserId();
        }
        throw new BusinessException(403, "无查看订单权限");
    }

    private void assertCanView(TravelOrderRecord order) {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (user.hasPermission("order:view_all")) {
            return;
        }
        if (user.hasPermission("order:view_assigned") && user.getUserId().equals(order.getSalesAdminUserId())) {
            return;
        }
        throw new BusinessException(403, "无权查看该订单");
    }

    private void assertCanUpdate(TravelOrderRecord order, AdminPrincipal user) {
        if (user.hasPermission("order:view_all")) {
            return;
        }
        if (user.hasPermission("order:update_assigned") && user.getUserId().equals(order.getSalesAdminUserId())) {
            return;
        }
        throw new BusinessException(403, "无权修改该订单");
    }

    private String generateOrderNo() {
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "TRAVEL" + time + ORDER_SEQ.incrementAndGet() % 1000;
    }
}
