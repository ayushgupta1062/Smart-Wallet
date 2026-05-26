package com.expense.tracker.service;

import com.expense.tracker.dto.ExpenseRequest;
import com.expense.tracker.dto.ExpenseResponse;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {
    List<ExpenseResponse> getAllExpenses(Long userId, String search, Long categoryId, LocalDate startDate, LocalDate endDate);
    ExpenseResponse getExpenseById(Long id, Long userId);
    ExpenseResponse createExpense(ExpenseRequest expenseRequest, Long userId);
    ExpenseResponse updateExpense(Long id, ExpenseRequest expenseRequest, Long userId);
    void deleteExpense(Long id, Long userId);
}
