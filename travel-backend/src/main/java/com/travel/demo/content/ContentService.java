package com.travel.demo.content;

import com.travel.demo.content.dto.PageResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ContentService {

    private final AdminCmsClient adminCmsClient;

    public ContentService(AdminCmsClient adminCmsClient) {
        this.adminCmsClient = adminCmsClient;
    }

    public PageResult<Map<String, Object>> cities(int page, int pageSize, String keyword) {
        return adminCmsClient.list("cities", query(page, pageSize, keyword, null, null, null, null));
    }

    public Map<String, Object> cityByName(String name) {
        return adminCmsClient.cityByName(name);
    }

    public PageResult<Map<String, Object>> banners(int page, int pageSize, Long cityId) {
        return adminCmsClient.list("banners", query(page, pageSize, null, cityId, null, null, null));
    }

    public PageResult<Map<String, Object>> scenics(int page, int pageSize, Long cityId, String keyword, Boolean recommended) {
        return adminCmsClient.list("scenics", query(page, pageSize, keyword, cityId, recommended, null, null));
    }

    public Map<String, Object> scenicDetail(Long id) {
        return adminCmsClient.detail("scenics", id);
    }

    public PageResult<Map<String, Object>> hotels(int page, int pageSize, Long cityId, String keyword) {
        return adminCmsClient.list("hotels", query(page, pageSize, keyword, cityId, null, null, null));
    }

    public PageResult<Map<String, Object>> carRentals(int page, int pageSize, Long cityId, String keyword) {
        return adminCmsClient.list("car-rentals", query(page, pageSize, keyword, cityId, null, null, null));
    }

    public PageResult<Map<String, Object>> products(int page, int pageSize, Long cityId, String keyword, Boolean recommended) {
        return adminCmsClient.list("products", query(page, pageSize, keyword, cityId, recommended, null, null));
    }

    public Map<String, Object> productDetail(Long id) {
        return adminCmsClient.detail("products", id);
    }

    public PageResult<Map<String, Object>> guides(int page, int pageSize, Long cityId) {
        return adminCmsClient.list("guides", query(page, pageSize, null, cityId, null, null, null));
    }

    public PageResult<Map<String, Object>> cases(int page, int pageSize, Long cityId, String caseType) {
        return adminCmsClient.list("cases", query(page, pageSize, null, cityId, null, caseType, null));
    }

    public PageResult<Map<String, Object>> tripReminders(int page, int pageSize, Long cityId) {
        return adminCmsClient.list("trip-reminders", query(page, pageSize, null, cityId, null, null, null));
    }

    public Map<String, Object> aboutCompany() {
        return adminCmsClient.singleton("about/company");
    }

    public Map<String, Object> consultation() {
        return adminCmsClient.singleton("consultation");
    }

    private Map<String, Object> query(int page, int pageSize, String keyword, Long cityId,
                                      Boolean recommended, String caseType, Object unused) {
        Map<String, Object> q = new HashMap<>();
        q.put("page", page);
        q.put("pageSize", pageSize);
        if (keyword != null && !keyword.isBlank()) {
            q.put("keyword", keyword);
        }
        if (cityId != null) {
            q.put("cityId", cityId);
        }
        if (recommended != null) {
            q.put("recommended", recommended);
        }
        if (caseType != null && !caseType.isBlank()) {
            q.put("caseType", caseType);
        }
        return q;
    }
}
