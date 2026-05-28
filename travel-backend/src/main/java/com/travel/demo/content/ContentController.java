package com.travel.demo.content;

import com.travel.demo.common.ApiResponse;
import com.travel.demo.content.dto.PageResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping({"/api/travel/content", "/v1/api/travel/content"})
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/cities")
    public ApiResponse<PageResult<Map<String, Object>>> cities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(contentService.cities(page, pageSize, keyword));
    }

    @GetMapping("/cities/by-name")
    public ApiResponse<Map<String, Object>> cityByName(@RequestParam String name) {
        return ApiResponse.ok(contentService.cityByName(name));
    }

    @GetMapping("/banners")
    public ApiResponse<PageResult<Map<String, Object>>> banners(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(contentService.banners(page, pageSize, cityId));
    }

    @GetMapping("/scenics")
    public ApiResponse<PageResult<Map<String, Object>>> scenics(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean recommended) {
        return ApiResponse.ok(contentService.scenics(page, pageSize, cityId, keyword, recommended));
    }

    @GetMapping("/scenics/{id}")
    public ApiResponse<Map<String, Object>> scenicDetail(@PathVariable Long id) {
        return ApiResponse.ok(contentService.scenicDetail(id));
    }

    @GetMapping("/hotels")
    public ApiResponse<PageResult<Map<String, Object>>> hotels(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(contentService.hotels(page, pageSize, cityId, keyword));
    }

    @GetMapping("/car-rentals")
    public ApiResponse<PageResult<Map<String, Object>>> carRentals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(contentService.carRentals(page, pageSize, cityId, keyword));
    }

    @GetMapping("/products")
    public ApiResponse<PageResult<Map<String, Object>>> products(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean recommended) {
        return ApiResponse.ok(contentService.products(page, pageSize, cityId, keyword, recommended));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<Map<String, Object>> productDetail(@PathVariable Long id) {
        return ApiResponse.ok(contentService.productDetail(id));
    }

    @GetMapping("/guides")
    public ApiResponse<PageResult<Map<String, Object>>> guides(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(contentService.guides(page, pageSize, cityId));
    }

    @GetMapping("/cases")
    public ApiResponse<PageResult<Map<String, Object>>> cases(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String caseType) {
        return ApiResponse.ok(contentService.cases(page, pageSize, cityId, caseType));
    }

    @GetMapping("/trip-reminders")
    public ApiResponse<PageResult<Map<String, Object>>> tripReminders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long cityId) {
        return ApiResponse.ok(contentService.tripReminders(page, pageSize, cityId));
    }

    @GetMapping("/about/company")
    public ApiResponse<Map<String, Object>> aboutCompany() {
        return ApiResponse.ok(contentService.aboutCompany());
    }

    @GetMapping("/consultation")
    public ApiResponse<Map<String, Object>> consultation() {
        return ApiResponse.ok(contentService.consultation());
    }
}
