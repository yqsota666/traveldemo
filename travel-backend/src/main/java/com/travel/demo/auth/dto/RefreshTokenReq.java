package com.travel.demo.auth.dto;

import javax.validation.constraints.NotBlank;

public class RefreshTokenReq {
    @NotBlank(message = "refreshToken不能为空")
    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
