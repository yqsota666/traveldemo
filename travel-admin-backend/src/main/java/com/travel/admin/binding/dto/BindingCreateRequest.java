package com.travel.admin.binding.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class BindingCreateRequest {
    @NotNull(message = "销售ID不能为空")
    private Long salesAdminUserId;
    @NotBlank(message = "客户姓名不能为空")
    private String customerName;
    private String customerPhone;

    public Long getSalesAdminUserId() {
        return salesAdminUserId;
    }

    public void setSalesAdminUserId(Long salesAdminUserId) {
        this.salesAdminUserId = salesAdminUserId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}
