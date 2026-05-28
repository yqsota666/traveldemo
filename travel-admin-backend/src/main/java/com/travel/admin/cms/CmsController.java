package com.travel.admin.cms;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.PageResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/v1/cms")
public class CmsController {

    private final CmsService cmsService;

    public CmsController(CmsService cmsService) {
        this.cmsService = cmsService;
    }

    @GetMapping("/cities/options")
    public ApiResponse<List<Map<String, Object>>> cityOptions() {
        return ApiResponse.ok(cmsService.cities());
    }

    @GetMapping("/cities")
    public ApiResponse<PageResult<Map<String, Object>>> listCities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String publishStatus,
            @RequestParam(required = false) Long operatorId) {
        return ApiResponse.ok(cmsService.list(CmsTable.CITY, page, pageSize, null, keyword, publishStatus, operatorId));
    }

    @PostMapping("/cities")
    public ApiResponse<Map<String, Object>> createCity(@RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.create(CmsTable.CITY, body));
    }

    @PutMapping("/cities/{id}")
    public ApiResponse<Map<String, Object>> updateCity(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.update(CmsTable.CITY, id, body));
    }

    @DeleteMapping("/cities/{id}")
    public ApiResponse<Void> deleteCity(@PathVariable Long id) {
        cmsService.delete(CmsTable.CITY, id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{resource}")
    public ApiResponse<PageResult<Map<String, Object>>> list(
            @PathVariable String resource,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String publishStatus,
            @RequestParam(required = false) Long operatorId) {
        CmsTable table = resolveTable(resource);
        return ApiResponse.ok(cmsService.list(table, page, pageSize, cityId, keyword, publishStatus, operatorId));
    }

    @GetMapping("/{resource}/{id}")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String resource, @PathVariable Long id) {
        return ApiResponse.ok(cmsService.get(resolveTable(resource), id));
    }

    @PostMapping("/{resource}")
    public ApiResponse<Map<String, Object>> create(@PathVariable String resource, @RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.create(resolveTable(resource), body));
    }

    @PutMapping("/{resource}/{id}")
    public ApiResponse<Map<String, Object>> update(@PathVariable String resource, @PathVariable Long id,
                                                   @RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.update(resolveTable(resource), id, body));
    }

    @DeleteMapping("/{resource}/{id}")
    public ApiResponse<Void> delete(@PathVariable String resource, @PathVariable Long id) {
        cmsService.delete(resolveTable(resource), id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/{id}/submit")
    public ApiResponse<Void> submit(@PathVariable String resource, @PathVariable Long id) {
        cmsService.submit(resolveTable(resource), id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/{id}/approve")
    public ApiResponse<Void> approve(@PathVariable String resource, @PathVariable Long id,
                                     @RequestBody(required = false) Map<String, String> body) {
        String comment = body == null ? null : body.get("comment");
        cmsService.approve(resolveTable(resource), id, comment);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/{id}/offline")
    public ApiResponse<Void> offline(@PathVariable String resource, @PathVariable Long id) {
        cmsService.offline(resolveTable(resource), id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{resource}/{id}/approval-logs")
    public ApiResponse<List<Map<String, Object>>> approvalLogs(@PathVariable String resource, @PathVariable Long id) {
        return ApiResponse.ok(cmsService.approvalLogs(resolveTable(resource), id));
    }

    @PutMapping("/{resource}/sort")
    public ApiResponse<Void> sort(@PathVariable String resource, @RequestBody List<Map<String, Object>> items) {
        cmsService.updateSort(resolveTable(resource), items);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/batch-delete")
    public ApiResponse<Void> batchDelete(@PathVariable String resource, @RequestBody Map<String, List<Long>> body) {
        cmsService.batchDelete(resolveTable(resource), body.get("ids"));
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/batch-submit")
    public ApiResponse<Void> batchSubmit(@PathVariable String resource, @RequestBody Map<String, List<Long>> body) {
        cmsService.batchSubmit(resolveTable(resource), body.get("ids"));
        return ApiResponse.ok(null);
    }

    @PostMapping("/{resource}/batch-offline")
    public ApiResponse<Void> batchOffline(@PathVariable String resource, @RequestBody Map<String, List<Long>> body) {
        cmsService.batchPublishToggle(resolveTable(resource), body.get("ids"), false);
        return ApiResponse.ok(null);
    }

    @GetMapping("/about/company")
    public ApiResponse<Map<String, Object>> aboutCompany() {
        return ApiResponse.ok(cmsService.getSingleton(CmsTable.ABOUT_COMPANY));
    }

    @PutMapping("/about/company")
    public ApiResponse<Map<String, Object>> saveAboutCompany(@RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.saveSingleton(CmsTable.ABOUT_COMPANY, body));
    }

    @PostMapping("/about/company/submit")
    public ApiResponse<Void> submitAbout() {
        cmsService.submitSingleton(CmsTable.ABOUT_COMPANY);
        return ApiResponse.ok(null);
    }

    @PostMapping("/about/company/approve")
    public ApiResponse<Void> approveAbout(@RequestBody(required = false) Map<String, String> body) {
        cmsService.approveSingleton(CmsTable.ABOUT_COMPANY, body == null ? null : body.get("comment"));
        return ApiResponse.ok(null);
    }

    @GetMapping("/consultation")
    public ApiResponse<Map<String, Object>> consultation() {
        return ApiResponse.ok(cmsService.getSingleton(CmsTable.CONSULTATION));
    }

    @PutMapping("/consultation")
    public ApiResponse<Map<String, Object>> saveConsultation(@RequestBody Map<String, Object> body) {
        return ApiResponse.ok(cmsService.saveSingleton(CmsTable.CONSULTATION, body));
    }

    @PostMapping("/consultation/submit")
    public ApiResponse<Void> submitConsultation() {
        cmsService.submitSingleton(CmsTable.CONSULTATION);
        return ApiResponse.ok(null);
    }

    @PostMapping("/consultation/approve")
    public ApiResponse<Void> approveConsultation(@RequestBody(required = false) Map<String, String> body) {
        cmsService.approveSingleton(CmsTable.CONSULTATION, body == null ? null : body.get("comment"));
        return ApiResponse.ok(null);
    }

    private CmsTable resolveTable(String resource) {
        switch (resource) {
            case "banners": return CmsTable.BANNER;
            case "scenics": return CmsTable.SCENIC;
            case "hotels": return CmsTable.HOTEL;
            case "car-rentals": return CmsTable.CAR_RENTAL;
            case "products": return CmsTable.PRODUCT;
            case "guides": return CmsTable.GUIDE;
            case "cases": return CmsTable.MEDIA_CASE;
            case "trip-reminders": return CmsTable.TRIP_REMINDER;
            default:
                throw new com.travel.admin.common.BusinessException(404, "未知资源: " + resource);
        }
    }
}
