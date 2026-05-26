package com.expense.tracker.service;

import com.expense.tracker.dto.CategoryRequest;
import com.expense.tracker.dto.CategoryResponse;
import com.expense.tracker.entity.Category;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getCategoriesByUserId(Long userId);
    CategoryResponse getCategoryById(Long id, Long userId);
    CategoryResponse createCategory(CategoryRequest categoryRequest, Long userId);
    CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest, Long userId);
    void deleteCategory(Long id, Long userId);
    Category getRawCategoryById(Long id, Long userId);
}
