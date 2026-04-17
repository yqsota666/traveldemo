package com.travel.demo.auth.dto;

import javax.validation.constraints.NotBlank;

public class TravelWxLoginReq {
    @NotBlank(message = "wx.login code不能为空")
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
