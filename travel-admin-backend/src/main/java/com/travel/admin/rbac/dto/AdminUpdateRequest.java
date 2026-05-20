package com.travel.admin.rbac.dto;

import javax.validation.constraints.NotBlank;

public class AdminUpdateRequest {
    @NotBlank(message = "姓名不能为空")
    private String realName;
    private String phone;
    @NotBlank(message = "状态不能为空")
    private String status;

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
