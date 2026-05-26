package com.expense.tracker.repository;

import com.expense.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByUserIdOrderByDateDesc(Long userId);
    
    Optional<Expense> findByIdAndUserId(Long id, Long userId);
    
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByUserIdAndCategoryIdOrderByDateDesc(Long userId, Long categoryId);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%')) ORDER BY e.date DESC")
    List<Expense> searchByTitle(@Param("userId") Long userId, @Param("title") String title);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumTotalExpensesByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpensesByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
