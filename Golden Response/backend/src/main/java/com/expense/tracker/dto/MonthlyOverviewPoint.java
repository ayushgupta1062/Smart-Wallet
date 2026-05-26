package com.expense.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyOverviewPoint {
    private String month; // e.g. "Jan", "Feb", "May"
    private BigDecimal income;
    private BigDecimal expense;
}
