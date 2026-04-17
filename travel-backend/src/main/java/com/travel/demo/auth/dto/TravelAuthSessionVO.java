package com.travel.demo.auth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class TravelAuthSessionVO {
    private String token;
    @JsonFormat(timezone = "GMT+8")
    private Date expires;
    private String refreshToken;
    private UserInfoVO userInfo;
    private Boolean isPhoneBound;
    private Boolean isFirstLogin;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpires() {
        return expires;
    }

    public void setExpires(Date expires) {
        this.expires = expires;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public UserInfoVO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoVO userInfo) {
        this.userInfo = userInfo;
    }

    public Boolean getIsPhoneBound() {
        return isPhoneBound;
    }

    public void setIsPhoneBound(Boolean phoneBound) {
        isPhoneBound = phoneBound;
    }

    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }

    public void setIsFirstLogin(Boolean firstLogin) {
        isFirstLogin = firstLogin;
    }
}
