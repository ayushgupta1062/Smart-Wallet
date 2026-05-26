package com.expense.tracker.controller;

import com.expense.tracker.dto.AnalyticsResponse;
import com.expense.tracker.dto.DashboardResponse;
import com.expense.tracker.security.UserDetailsImpl;
import com.expense.tracker.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary(getCurrentUserId()));
    }

    @GetMapping("/charts")
    public ResponseEntity<AnalyticsResponse> getAnalyticsCharts() {
        return ResponseEntity.ok(analyticsService.getAnalyticsCharts(getCurrentUserId()));
    }
}
