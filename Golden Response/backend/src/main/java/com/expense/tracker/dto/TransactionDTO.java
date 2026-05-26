package com.expense.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private String type; // "INCOME" or "EXPENSE"
    private String title;
    private BigDecimal amount;
    private String category;
    private String color;
    private String icon;
    private LocalDate date;
}
