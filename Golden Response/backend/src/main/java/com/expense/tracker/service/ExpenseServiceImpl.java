package com.expense.tracker.service;

import com.expense.tracker.dto.CategoryResponse;
import com.expense.tracker.dto.ExpenseRequest;
import com.expense.tracker.dto.ExpenseResponse;
import com.expense.tracker.entity.Category;
import com.expense.tracker.entity.Expense;
import com.expense.tracker.entity.User;
import com.expense.tracker.exception.ResourceNotFoundException;
import com.expense.tracker.repository.ExpenseRepository;
import com.expense.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryService categoryService;

    @Override
    public List<ExpenseResponse> getAllExpenses(Long userId, String search, Long categoryId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);

        return expenses.stream()
                .filter(e -> search == null || search.trim().isEmpty() || e.getTitle().toLowerCase().contains(search.toLowerCase()))
                .filter(e -> categoryId == null || e.getCategory().getId().equals(categoryId))
                .filter(e -> startDate == null || !e.getDate().isBefore(startDate))
                .filter(e -> endDate == null || !e.getDate().isAfter(endDate))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseResponse getExpenseById(Long id, Long userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense transaction not found with ID: " + id));
        return convertToResponse(expense);
    }

    @Override
    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest expenseRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryService.getRawCategoryById(expenseRequest.getCategoryId(), userId);

        Expense expense = Expense.builder()
                .amount(expenseRequest.getAmount())
                .title(expenseRequest.getTitle())
                .description(expenseRequest.getDescription())
                .date(expenseRequest.getDate())
                .category(category)
                .user(user)
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return convertToResponse(savedExpense);
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest expenseRequest, Long userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense transaction not found with ID: " + id));

        Category category = categoryService.getRawCategoryById(expenseRequest.getCategoryId(), userId);

        expense.setAmount(expenseRequest.getAmount());
        expense.setTitle(expenseRequest.getTitle());
        expense.setDescription(expenseRequest.getDescription());
        expense.setDate(expenseRequest.getDate());
        expense.setCategory(category);

        Expense updatedExpense = expenseRepository.save(expense);
        return convertToResponse(updatedExpense);
    }

    @Override
    @Transactional
    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense transaction not found with ID: " + id));

        expenseRepository.delete(expense);
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        Category category = expense.getCategory();
        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .icon(category.getIcon())
                .isCustom(category.getUser() != null)
                .build();

        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .title(expense.getTitle())
                .description(expense.getDescription())
                .date(expense.getDate())
                .category(categoryResponse)
                .build();
    }
}
