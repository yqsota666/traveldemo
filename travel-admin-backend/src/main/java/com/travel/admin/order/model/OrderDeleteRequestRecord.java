package com.travel.admin.order.model;

import java.time.LocalDateTime;

public class OrderDeleteRequestRecord {
    private Long id;
    private Long orderId;
    private String orderNo;
    private String customerName;
    private Long requestedByAdminUserId;
    private String requestedByName;
    private Long approverAdminUserId;
    private String approverName;
    private String reason;
    private String requestStatus;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getRequestedByAdminUserId() {
        return requestedByAdminUserId;
    }

    public void setRequestedByAdminUserId(Long requestedByAdminUserId) {
        this.requestedByAdminUserId = requestedByAdminUserId;
    }

    public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }

    public Long getApproverAdminUserId() {
        return approverAdminUserId;
    }

    public void setApproverAdminUserId(Long approverAdminUserId) {
        this.approverAdminUserId = approverAdminUserId;
    }

    public String getApproverName() {
        return approverName;
    }

    public void setApproverName(String approverName) {
        this.approverName = approverName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}
