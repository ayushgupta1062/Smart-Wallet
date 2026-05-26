package com.expense.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryShareResponse {
    private String name; // Category name
    private BigDecimal value; // Total expense amount in this category
    private BigDecimal percentage; // e.g. 15.5
    private String color; // Hex code, e.g. "#EF4444"
    private String icon; // Lucide icon identifier
}
