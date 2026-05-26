package com.expense.tracker.service;

import com.expense.tracker.dto.AnalyticsResponse;
import com.expense.tracker.dto.DashboardResponse;

public interface AnalyticsService {
    DashboardResponse getDashboardSummary(Long userId);
    AnalyticsResponse getAnalyticsCharts(Long userId);
}
