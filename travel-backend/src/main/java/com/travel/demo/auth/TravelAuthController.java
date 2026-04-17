package com.travel.demo.auth;

import com.travel.demo.auth.dto.RefreshTokenReq;
import com.travel.demo.auth.dto.TravelBindPhoneReq;
import com.travel.demo.auth.dto.TravelWxLoginReq;
import com.travel.demo.common.ApiResponse;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/travel/auth")
public class TravelAuthController {
    private final TravelAuthService travelAuthService;

    public TravelAuthController(TravelAuthService travelAuthService) {
        this.travelAuthService = travelAuthService;
    }

    @PostMapping("/wx/login")
    public ApiResponse<?> wxLogin(@RequestBody @Valid TravelWxLoginReq req) {
        return ApiResponse.ok(travelAuthService.wxLogin(req));
    }

    @PostMapping("/wx/bind-phone")
    public ApiResponse<?> bindPhone(HttpServletRequest request, @RequestBody @Valid TravelBindPhoneReq req) {
        return ApiResponse.ok(travelAuthService.bindPhone(request, req));
    }

    @GetMapping("/me")
    public ApiResponse<?> me(HttpServletRequest request) {
        return ApiResponse.ok(travelAuthService.me(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<?> refresh(@RequestBody @Valid RefreshTokenReq req) {
        return ApiResponse.ok(travelAuthService.refresh(req));
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletRequest request) {
        travelAuthService.logout(request);
        return ApiResponse.ok(null);
    }
}
