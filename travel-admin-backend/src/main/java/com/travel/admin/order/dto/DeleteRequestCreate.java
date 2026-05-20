package com.travel.admin.order.dto;

import javax.validation.constraints.NotBlank;

public class DeleteRequestCreate {
    @NotBlank(message = "删除原因不能为空")
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
