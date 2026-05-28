package com.travel.admin.cms.internal;

import com.travel.admin.cms.CmsTable;
import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/internal/cms")
public class CmsInternalReadController {

    private final CmsInternalReadService readService;

    public CmsInternalReadController(CmsInternalReadService readService) {
        this.readService = readService;
    }

    @GetMapping("/cities")
    public ApiResponse<PageResult<Map<String, Object>>> cities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(readService.list(CmsTable.CITY, page, pageSize, null, keyword, null, null));
    }

    @GetMapping("/cities/by-name")
    public ApiResponse<Map<String, Object>> cityByName(@RequestParam String name) {
        return ApiResponse.ok(readService.findCityByName(name)
                .orElseThrow(() -> new BusinessException(404, "城市不存在")));
    }

    @GetMapping("/banners")
    public ApiResponse<PageResult<Map<String, Object>>> banners(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(readService.list(CmsTable.BANNER, page, pageSize, cityId, null, null, null));
    }

    @GetMapping("/scenics")
    public ApiResponse<PageResult<Map<String, Object>>> scenics(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean recommended) {
        return ApiResponse.ok(readService.list(CmsTable.SCENIC, page, pageSize, cityId, keyword, recommended, null));
    }

    @GetMapping("/scenics/{id}")
    public ApiResponse<Map<String, Object>> scenicDetail(@PathVariable Long id) {
        return ApiResponse.ok(readService.detail(CmsTable.SCENIC, id));
    }

    @GetMapping("/hotels")
    public ApiResponse<PageResult<Map<String, Object>>> hotels(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(readService.list(CmsTable.HOTEL, page, pageSize, cityId, keyword, null, null));
    }

    @GetMapping("/car-rentals")
    public ApiResponse<PageResult<Map<String, Object>>> carRentals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(readService.list(CmsTable.CAR_RENTAL, page, pageSize, cityId, keyword, null, null));
    }

    @GetMapping("/products")
    public ApiResponse<PageResult<Map<String, Object>>> products(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean recommended) {
        return ApiResponse.ok(readService.list(CmsTable.PRODUCT, page, pageSize, cityId, keyword, recommended, null));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<Map<String, Object>> productDetail(@PathVariable Long id) {
        return ApiResponse.ok(readService.detail(CmsTable.PRODUCT, id));
    }

    @GetMapping("/guides")
    public ApiResponse<PageResult<Map<String, Object>>> guides(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(readService.list(CmsTable.GUIDE, page, pageSize, cityId, null, null, null));
    }

    @GetMapping("/cases")
    public ApiResponse<PageResult<Map<String, Object>>> cases(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String caseType) {
        return ApiResponse.ok(readService.list(CmsTable.MEDIA_CASE, page, pageSize, cityId, null, null, caseType));
    }

    @GetMapping("/trip-reminders")
    public ApiResponse<PageResult<Map<String, Object>>> tripReminders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(readService.list(CmsTable.TRIP_REMINDER, page, pageSize, cityId, null, null, null));
    }

    @GetMapping("/about/company")
    public ApiResponse<Map<String, Object>> aboutCompany() {
        return ApiResponse.ok(readService.aboutCompany());
    }

    @GetMapping("/consultation")
    public ApiResponse<Map<String, Object>> consultation() {
        return ApiResponse.ok(readService.consultation());
    }
}
