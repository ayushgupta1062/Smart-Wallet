package com.expense.tracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    @NotBlank(message = "Color descriptor is required")
    private String color;

    @NotBlank(message = "Icon descriptor is required")
    private String icon;
}
