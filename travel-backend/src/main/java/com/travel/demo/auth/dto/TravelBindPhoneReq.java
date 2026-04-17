package com.travel.demo.auth.dto;

import javax.validation.constraints.NotBlank;

public class TravelBindPhoneReq {
    @NotBlank(message = "手机号不能为空")
    private String phoneNumber;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
