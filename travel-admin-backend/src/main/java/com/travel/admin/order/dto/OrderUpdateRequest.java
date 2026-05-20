package com.travel.admin.order.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class OrderUpdateRequest {
    @NotBlank(message = "客户姓名不能为空")
    private String customerName;
    private String customerPhone;
    @NotBlank(message = "目的地不能为空")
    private String destinationCity;
    @NotNull(message = "出行日期不能为空")
    private LocalDate travelDate;
    @Min(value = 1, message = "出行人数至少为1")
    private Integer travelerCount;
    @NotNull(message = "订单金额不能为空")
    @DecimalMin(value = "0.0", message = "金额不能为负")
    private BigDecimal totalAmount;
    @NotBlank(message = "订单状态不能为空")
    private String orderStatus;

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

    public String getDestinationCity() {
        return destinationCity;
    }

    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public Integer getTravelerCount() {
        return travelerCount;
    }

    public void setTravelerCount(Integer travelerCount) {
        this.travelerCount = travelerCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}
