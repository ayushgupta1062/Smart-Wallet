package com.expense.tracker.repository;

import com.expense.tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    
    List<Income> findByUserIdOrderByDateDesc(Long userId);
    
    Optional<Income> findByIdAndUserId(Long id, Long userId);
    
    List<Income> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND LOWER(i.source) LIKE LOWER(CONCAT('%', :source, '%')) ORDER BY i.date DESC")
    List<Income> searchBySource(@Param("userId") Long userId, @Param("source") String source);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumTotalIncomeByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate")
    BigDecimal sumIncomeByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
