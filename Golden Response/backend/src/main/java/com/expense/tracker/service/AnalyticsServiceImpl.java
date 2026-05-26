package com.expense.tracker.service;

import com.expense.tracker.dto.*;
import com.expense.tracker.entity.Category;
import com.expense.tracker.entity.Expense;
import com.expense.tracker.entity.Income;
import com.expense.tracker.repository.ExpenseRepository;
import com.expense.tracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Override
    public DashboardResponse getDashboardSummary(Long userId) {
        BigDecimal totalIncome = incomeRepository.sumTotalIncomeByUserId(userId);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpense = expenseRepository.sumTotalExpensesByUserId(userId);
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = balance.multiply(new BigDecimal(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
        }

        // Unified transaction list
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        List<Income> incomes = incomeRepository.findByUserIdOrderByDateDesc(userId);

        List<TransactionDTO> allTransactions = new ArrayList<>();
        
        for (Expense e : expenses) {
            allTransactions.add(TransactionDTO.builder()
                    .id(e.getId())
                    .type("EXPENSE")
                    .title(e.getTitle())
                    .amount(e.getAmount())
                    .category(e.getCategory().getName())
                    .color(e.getCategory().getColor())
                    .icon(e.getCategory().getIcon())
                    .date(e.getDate())
                    .build());
        }

        for (Income i : incomes) {
            allTransactions.add(TransactionDTO.builder()
                    .id(i.getId())
                    .type("INCOME")
                    .title(i.getSource())
                    .amount(i.getAmount())
                    .category("Income")
                    .color("#10B981") // Emerald hex code
                    .icon("TrendingUp")
                    .date(i.getDate())
                    .build());
        }

        // Sort descending by date and limit to 5
        List<TransactionDTO> recentTransactions = allTransactions.stream()
                .sorted(Comparator.comparing(TransactionDTO::getDate).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // Generate activity logs
        List<String> recentActivities = new ArrayList<>();
        for (TransactionDTO t : recentTransactions) {
            String activity;
            if ("INCOME".equals(t.getType())) {
                activity = "Earned $" + t.getAmount() + " from " + t.getTitle() + " on " + t.getDate();
            } else {
                activity = "Spent $" + t.getAmount() + " on " + t.getTitle() + " (" + t.getCategory() + ") on " + t.getDate();
            }
            recentActivities.add(activity);
        }

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .savingsRate(savingsRate)
                .recentTransactions(recentTransactions)
                .recentActivities(recentActivities)
                .build();
    }

    @Override
    public AnalyticsResponse getAnalyticsCharts(Long userId) {
        // Last 6 months history (incomes vs expenses)
        List<MonthlyOverviewPoint> monthlyOverview = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate targetMonth = today.minusMonths(i);
            LocalDate startDate = targetMonth.withDayOfMonth(1);
            LocalDate endDate = targetMonth.withDayOfMonth(targetMonth.lengthOfMonth());
            
            // Format e.g. "May 2026"
            String monthLabel = targetMonth.getMonth().name().substring(0, 3) + " " + targetMonth.getYear();

            BigDecimal incSum = incomeRepository.sumIncomeByUserIdAndDateBetween(userId, startDate, endDate);
            if (incSum == null) incSum = BigDecimal.ZERO;

            BigDecimal expSum = expenseRepository.sumExpensesByUserIdAndDateBetween(userId, startDate, endDate);
            if (expSum == null) expSum = BigDecimal.ZERO;

            monthlyOverview.add(new MonthlyOverviewPoint(monthLabel, incSum, expSum));
        }

        // Category Share Breakdown
        List<Expense> allExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        BigDecimal totalExpenseSum = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Category, BigDecimal> categorySums = allExpenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        List<CategoryShareResponse> categoryBreakdown = new ArrayList<>();
        for (Map.Entry<Category, BigDecimal> entry : categorySums.entrySet()) {
            Category category = entry.getKey();
            BigDecimal catSum = entry.getValue();
            BigDecimal percentage = BigDecimal.ZERO;
            
            if (totalExpenseSum.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catSum.multiply(new BigDecimal(100))
                        .divide(totalExpenseSum, 2, RoundingMode.HALF_UP);
            }

            categoryBreakdown.add(CategoryShareResponse.builder()
                    .name(category.getName())
                    .value(catSum)
                    .percentage(percentage)
                    .color(category.getColor())
                    .icon(category.getIcon())
                    .build());
        }

        // Sort breakdown by share size
        categoryBreakdown.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        return AnalyticsResponse.builder()
                .monthlyOverview(monthlyOverview)
                .categoryBreakdown(categoryBreakdown)
                .build();
    }
}
