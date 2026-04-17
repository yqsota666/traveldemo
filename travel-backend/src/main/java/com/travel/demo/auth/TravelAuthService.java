package com.travel.demo.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.demo.auth.dto.RefreshTokenReq;
import com.travel.demo.auth.dto.TravelAuthSessionVO;
import com.travel.demo.auth.dto.TravelBindPhoneReq;
import com.travel.demo.auth.dto.TravelWxLoginReq;
import com.travel.demo.auth.dto.UserInfoVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class TravelAuthService {
    private final JdbcTemplate jdbcTemplate;
    private final TokenService tokenService;
    private final ObjectMapper objectMapper;

    @Value("${travel.auth.access-token-expire-seconds:7200}")
    private long accessTokenExpireSeconds;

    @Value("${travel.auth.refresh-token-expire-seconds:2592000}")
    private long refreshTokenExpireSeconds;

    @Value("${travel.auth.wx-appid:}")
    private String wxAppId;

    @Value("${travel.auth.wx-secret:}")
    private String wxSecret;

    @Value("${travel.auth.mock-wx-enabled:true}")
    private boolean mockWxEnabled;

    public TravelAuthService(JdbcTemplate jdbcTemplate, TokenService tokenService, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.tokenService = tokenService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public TravelAuthSessionVO wxLogin(TravelWxLoginReq req) {
        WxSession wxSession = exchangeWechatCode(req.getCode());
        Long userId = findUserIdByOpenid(wxSession.openid);
        boolean firstLogin = false;
        if (userId == null) {
            firstLogin = true;
            jdbcTemplate.update("INSERT INTO travel_user(name, created_at, updated_at) VALUES (?, NOW(), NOW())",
                    "travel_user_" + right(wxSession.openid, 8));
            userId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
            jdbcTemplate.update("INSERT INTO travel_user_wx(user_id, openid, union_id, session_key_hash, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, NOW(), NOW(), 0)",
                    userId, wxSession.openid, wxSession.unionId, hashSessionKey(wxSession.sessionKey, wxSession.openid));
        } else {
            jdbcTemplate.update("UPDATE travel_user_wx SET union_id=?, session_key_hash=?, updated_at=NOW() WHERE user_id=? AND deleted=0",
                    wxSession.unionId, hashSessionKey(wxSession.sessionKey, wxSession.openid), userId);
        }
        return issueSession(userId, firstLogin);
    }

    @Transactional
    public TravelAuthSessionVO bindPhone(HttpServletRequest request, TravelBindPhoneReq req) {
        Long userId = extractUserId(request);
        Long occupiedUserId = findUserIdByPhone(req.getPhoneNumber());
        if (occupiedUserId != null && !occupiedUserId.equals(userId)) {
            throw new IllegalArgumentException("手机号已被其他账号使用");
        }
        jdbcTemplate.update("UPDATE travel_user SET phone_number=?, updated_at=NOW() WHERE id=?", req.getPhoneNumber(), userId);
        jdbcTemplate.update("UPDATE travel_user_wx SET phone=?, bind_phone_at=IFNULL(bind_phone_at, NOW()), updated_at=NOW() WHERE user_id=? AND deleted=0",
                req.getPhoneNumber(), userId);
        return issueSession(userId, false);
    }

    public TravelAuthSessionVO me(HttpServletRequest request) {
        Long userId = extractUserId(request);
        return issueSession(userId, false);
    }

    @Transactional
    public TravelAuthSessionVO refresh(RefreshTokenReq req) {
        RefreshTokenRecord record = loadRefreshToken(req.getRefreshToken());
        if (record == null || record.revoked || record.expiresAt.before(new Date())) {
            throw new IllegalArgumentException("refreshToken无效或已过期");
        }
        jdbcTemplate.update("UPDATE travel_refresh_token SET revoked=1, updated_at=NOW() WHERE id=?", record.id);
        return issueSession(record.userId, false);
    }

    @Transactional
    public void logout(HttpServletRequest request) {
        Long userId = extractUserId(request);
        jdbcTemplate.update("UPDATE travel_refresh_token SET revoked=1, updated_at=NOW() WHERE user_id=? AND revoked=0", userId);
    }

    private TravelAuthSessionVO issueSession(Long userId, boolean isFirstLogin) {
        UserInfoVO userInfo = jdbcTemplate.queryForObject(
                "SELECT id, name, phone_number FROM travel_user WHERE id=?",
                (rs, rowNum) -> {
                    UserInfoVO vo = new UserInfoVO();
                    vo.setId(rs.getLong("id"));
                    vo.setName(rs.getString("name"));
                    vo.setPhoneNumber(rs.getString("phone_number"));
                    return vo;
                },
                userId
        );

        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM travel_user_wx WHERE user_id=? AND deleted=0 AND phone IS NOT NULL AND phone<>''",
                Long.class,
                userId
        );
        boolean isPhoneBound = (userInfo.getPhoneNumber() != null && !userInfo.getPhoneNumber().isEmpty()) || (count != null && count > 0);

        long now = System.currentTimeMillis();
        long accessExpireAt = now + accessTokenExpireSeconds * 1000L;
        String token = tokenService.issueToken(userId, accessExpireAt);
        String refreshToken = UUID.randomUUID().toString().replace("-", "");
        Date refreshExpireAt = Date.from(Instant.ofEpochMilli(now + refreshTokenExpireSeconds * 1000L));

        jdbcTemplate.update("INSERT INTO travel_refresh_token(user_id, refresh_token, expires_at, revoked, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())",
                userId, refreshToken, new Timestamp(refreshExpireAt.getTime()));

        TravelAuthSessionVO session = new TravelAuthSessionVO();
        session.setToken(token);
        session.setExpires(new Date(accessExpireAt));
        session.setRefreshToken(refreshToken);
        session.setUserInfo(userInfo);
        session.setIsPhoneBound(isPhoneBound);
        session.setIsFirstLogin(isFirstLogin);
        return session;
    }

    private Long extractUserId(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException("缺少Authorization头");
        }
        String token = header.substring("Bearer ".length()).trim();
        return tokenService.parseUserId(token);
    }

    private Long findUserIdByOpenid(String openid) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT user_id FROM travel_user_wx WHERE openid=? AND deleted=0 LIMIT 1",
                    Long.class,
                    openid
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private Long findUserIdByPhone(String phone) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM travel_user WHERE phone_number=? LIMIT 1",
                    Long.class,
                    phone
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private RefreshTokenRecord loadRefreshToken(String refreshToken) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id, user_id, expires_at, revoked FROM travel_refresh_token WHERE refresh_token=? LIMIT 1",
                    (rs, rowNum) -> {
                        RefreshTokenRecord record = new RefreshTokenRecord();
                        record.id = rs.getLong("id");
                        record.userId = rs.getLong("user_id");
                        record.expiresAt = rs.getTimestamp("expires_at");
                        record.revoked = rs.getBoolean("revoked");
                        return record;
                    },
                    refreshToken
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private WxSession exchangeWechatCode(String code) {
        if (mockWxEnabled || wxAppId == null || wxAppId.isEmpty() || wxSecret == null || wxSecret.isEmpty()) {
            return new WxSession("mock_" + code, null, "mock_session_key");
        }
        HttpURLConnection connection = null;
        try {
            String url = "https://api.weixin.qq.com/sns/jscode2session"
                    + "?appid=" + URLEncoder.encode(wxAppId, "UTF-8")
                    + "&secret=" + URLEncoder.encode(wxSecret, "UTF-8")
                    + "&js_code=" + URLEncoder.encode(code, "UTF-8")
                    + "&grant_type=authorization_code";
            connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int status = connection.getResponseCode();
            InputStream inputStream = status >= 200 && status < 300 ? connection.getInputStream() : connection.getErrorStream();
            String body = readBody(inputStream);
            JsonNode json = objectMapper.readTree(body);
            if (status != 200) {
                throw new IllegalArgumentException("微信登录调用失败");
            }
            if (json.has("errcode") && json.get("errcode").asInt() != 0) {
                throw new IllegalArgumentException("微信code无效");
            }
            String openid = json.path("openid").asText("");
            if (openid.isEmpty()) {
                throw new IllegalArgumentException("微信openid为空");
            }
            return new WxSession(openid, json.path("unionid").asText(null), json.path("session_key").asText(""));
        } catch (Exception e) {
            throw new IllegalArgumentException("微信登录失败: " + e.getMessage(), e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private String readBody(InputStream inputStream) throws Exception {
        if (inputStream == null) {
            return "";
        }
        try (InputStream in = inputStream; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
            return out.toString(StandardCharsets.UTF_8.name());
        }
    }

    private String hashSessionKey(String sessionKey, String openid) {
        if (sessionKey == null || sessionKey.isEmpty()) {
            return null;
        }
        return Integer.toHexString((sessionKey + ":" + openid).hashCode());
    }

    private String right(String value, int length) {
        if (value == null || value.isEmpty()) {
            return "user";
        }
        if (value.length() <= length) {
            return value;
        }
        return value.substring(value.length() - length);
    }

    private static class WxSession {
        private final String openid;
        private final String unionId;
        private final String sessionKey;

        private WxSession(String openid, String unionId, String sessionKey) {
            this.openid = openid;
            this.unionId = unionId;
            this.sessionKey = sessionKey;
        }
    }

    private static class RefreshTokenRecord {
        private Long id;
        private Long userId;
        private Date expiresAt;
        private boolean revoked;
    }
}
