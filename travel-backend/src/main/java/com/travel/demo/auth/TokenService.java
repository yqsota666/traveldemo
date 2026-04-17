package com.travel.demo.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class TokenService {
    private static final String HMAC_SHA256 = "HmacSHA256";

    @Value("${travel.auth.token-secret}")
    private String tokenSecret;

    public String issueToken(Long userId, long expiresAtEpochMs) {
        String payload = userId + "." + expiresAtEpochMs;
        String sign = sign(payload);
        return Base64.getUrlEncoder().withoutPadding().encodeToString((payload + "." + sign).getBytes(StandardCharsets.UTF_8));
    }

    public Long parseUserId(String token) {
        String raw;
        try {
            raw = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalArgumentException("token格式非法");
        }

        String[] parts = raw.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("token格式非法");
        }

        String payload = parts[0] + "." + parts[1];
        String actualSign = parts[2];
        String expectedSign = sign(payload);
        if (!expectedSign.equals(actualSign)) {
            throw new IllegalArgumentException("token签名无效");
        }

        long expiresAt = Long.parseLong(parts[1]);
        if (System.currentTimeMillis() > expiresAt) {
            throw new IllegalArgumentException("token已过期");
        }

        return Long.parseLong(parts[0]);
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            byte[] signBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signBytes);
        } catch (Exception e) {
            throw new IllegalStateException("token签名失败", e);
        }
    }
}
