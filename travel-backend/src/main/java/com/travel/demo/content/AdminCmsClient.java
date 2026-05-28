package com.travel.demo.content;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.demo.common.ApiResponse;
import com.travel.demo.common.BusinessException;
import com.travel.demo.content.dto.PageResult;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

@Component
public class AdminCmsClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ContentProperties properties;

    public AdminCmsClient(RestTemplateBuilder builder, ObjectMapper objectMapper, ContentProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(properties.getConnectTimeoutMs()))
                .setReadTimeout(Duration.ofMillis(properties.getReadTimeoutMs()))
                .build();
    }

    public PageResult<Map<String, Object>> list(String resource, Map<String, ?> query) {
        return getPage(buildUri("/api/internal/cms/" + resource, query));
    }

    public Map<String, Object> detail(String resource, Long id) {
        return getMap(buildUri("/api/internal/cms/" + resource + "/" + id, null));
    }

    public Map<String, Object> singleton(String path) {
        return getMap(buildUri("/api/internal/cms/" + path, null));
    }

    public Map<String, Object> cityByName(String name) {
        String encodedName = UriUtils.encodeQueryParam(name, StandardCharsets.UTF_8);
        URI uri = URI.create(properties.getAdminBaseUrl() + "/api/internal/cms/cities/by-name?name=" + encodedName);
        return getMap(uri);
    }

    private URI buildUri(String path, Map<String, ?> query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(properties.getAdminBaseUrl() + path);
        if (query != null) {
            query.forEach((k, v) -> {
                if (v != null) {
                    builder.queryParam(k, v);
                }
            });
        }
        // RestTemplate + 中文 query 需先百分号编码，避免 Tomcat 收到非法 request target
        return URI.create(builder.build().encode(StandardCharsets.UTF_8).toUriString());
    }

    private PageResult<Map<String, Object>> getPage(URI uri) {
        ApiResponse<PageResult<Map<String, Object>>> body = exchange(uri,
                new TypeReference<ApiResponse<PageResult<Map<String, Object>>>>() {});
        assertOk(body);
        return body.getResult() == null ? emptyPage() : body.getResult();
    }

    private Map<String, Object> getMap(URI uri) {
        ApiResponse<Map<String, Object>> body = exchange(uri,
                new TypeReference<ApiResponse<Map<String, Object>>>() {});
        assertOk(body);
        return body.getResult() == null ? new java.util.HashMap<>() : body.getResult();
    }

    private <T> T exchange(URI uri, TypeReference<T> type) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers());
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
            return objectMapper.readValue(response.getBody(), type);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(502, "内容服务暂不可用: " + e.getMessage());
        }
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Token", properties.getInternalToken());
        return headers;
    }

    private void assertOk(ApiResponse<?> body) {
        if (body == null || body.getStatus() != 200) {
            String msg = body == null ? "empty response" : body.getMessage();
            throw new BusinessException(502, "内容服务返回异常: " + msg);
        }
    }

    private PageResult<Map<String, Object>> emptyPage() {
        PageResult<Map<String, Object>> page = new PageResult<>();
        page.setRecords(new java.util.ArrayList<>());
        page.setTotal(0);
        page.setPage(1);
        page.setPageSize(20);
        return page;
    }
}
