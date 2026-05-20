package com.travel.admin.auth.dto;

public class LoginResponse {
    private String accessToken;
    private long expireSeconds;
    private MeResponse user;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public long getExpireSeconds() {
        return expireSeconds;
    }

    public void setExpireSeconds(long expireSeconds) {
        this.expireSeconds = expireSeconds;
    }

    public MeResponse getUser() {
        return user;
    }

    public void setUser(MeResponse user) {
        this.user = user;
    }
}
