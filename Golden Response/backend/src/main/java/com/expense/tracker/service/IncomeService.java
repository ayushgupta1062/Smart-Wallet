package com.expense.tracker.service;

import com.expense.tracker.dto.IncomeRequest;
import com.expense.tracker.dto.IncomeResponse;

import java.time.LocalDate;
import java.util.List;

public interface IncomeService {
    List<IncomeResponse> getAllIncomes(Long userId, String search, LocalDate startDate, LocalDate endDate);
    IncomeResponse getIncomeById(Long id, Long userId);
    IncomeResponse createIncome(IncomeRequest incomeRequest, Long userId);
    IncomeResponse updateIncome(Long id, IncomeRequest incomeRequest, Long userId);
    void deleteIncome(Long id, Long userId);
}
