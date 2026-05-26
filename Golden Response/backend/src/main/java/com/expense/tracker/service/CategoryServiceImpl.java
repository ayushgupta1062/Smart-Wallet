package com.expense.tracker.service;

import com.expense.tracker.dto.CategoryRequest;
import com.expense.tracker.dto.CategoryResponse;
import com.expense.tracker.entity.Category;
import com.expense.tracker.entity.User;
import com.expense.tracker.exception.BadRequestException;
import com.expense.tracker.exception.ResourceNotFoundException;
import com.expense.tracker.repository.CategoryRepository;
import com.expense.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<CategoryResponse> getCategoriesByUserId(Long userId) {
        List<Category> categories = categoryRepository.findByUserIdOrUserIsNull(userId);
        return categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserIdOrUserIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return convertToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest categoryRequest, Long userId) {
        if (categoryRepository.existsByNameAndUserIdOrUserIsNull(categoryRequest.getName(), userId)) {
            throw new BadRequestException("Category with name '" + categoryRequest.getName() + "' already exists!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = Category.builder()
                .name(categoryRequest.getName())
                .color(categoryRequest.getColor())
                .icon(categoryRequest.getIcon())
                .user(user)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom category not found with ID: " + id + " or you do not have permission to edit it"));

        if (!category.getName().equalsIgnoreCase(categoryRequest.getName()) &&
                categoryRepository.existsByNameAndUserIdOrUserIsNull(categoryRequest.getName(), userId)) {
            throw new BadRequestException("Category with name '" + categoryRequest.getName() + "' already exists!");
        }

        category.setName(categoryRequest.getName());
        category.setColor(categoryRequest.getColor());
        category.setIcon(categoryRequest.getIcon());

        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom category not found with ID: " + id + " or you do not have permission to delete it"));

        categoryRepository.delete(category);
    }

    @Override
    public Category getRawCategoryById(Long id, Long userId) {
        return categoryRepository.findByIdAndUserIdOrUserIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .icon(category.getIcon())
                .isCustom(category.getUser() != null)
                .build();
    }
}
