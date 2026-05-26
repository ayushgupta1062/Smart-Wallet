package com.expense.tracker.repository;

import com.expense.tracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Fetch default categories (user is null) AND custom categories of the logged-in user
    List<Category> findByUserIdOrUserIsNull(Long userId);
    
    // Confirm a category is either a system-default or owned by the logged-in user
    @Query("SELECT c FROM Category c WHERE c.id = :id AND (c.user.id = :userId OR c.user IS NULL)")
    Optional<Category> findByIdAndUserIdOrUserIsNull(@Param("id") Long id, @Param("userId") Long userId);
    
    // Fetch a custom category owned by the logged-in user (for updates/deletes)
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    
    // Check if category name exists (case-insensitive) either in defaults or in the user's custom categories
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(c.name) = LOWER(:name) AND (c.user.id = :userId OR c.user IS NULL)")
    Boolean existsByNameAndUserIdOrUserIsNull(@Param("name") String name, @Param("userId") Long userId);
}
