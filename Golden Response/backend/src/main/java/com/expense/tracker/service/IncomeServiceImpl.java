package com.expense.tracker.service;

import com.expense.tracker.dto.IncomeRequest;
import com.expense.tracker.dto.IncomeResponse;
import com.expense.tracker.entity.Income;
import com.expense.tracker.entity.User;
import com.expense.tracker.exception.ResourceNotFoundException;
import com.expense.tracker.repository.IncomeRepository;
import com.expense.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeServiceImpl implements IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<IncomeResponse> getAllIncomes(Long userId, String search, LocalDate startDate, LocalDate endDate) {
        List<Income> incomes = incomeRepository.findByUserIdOrderByDateDesc(userId);

        return incomes.stream()
                .filter(i -> search == null || search.trim().isEmpty() || i.getSource().toLowerCase().contains(search.toLowerCase()))
                .filter(i -> startDate == null || !i.getDate().isBefore(startDate))
                .filter(i -> endDate == null || !i.getDate().isAfter(endDate))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncomeResponse getIncomeById(Long id, Long userId) {
        Income income = incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));
        return convertToResponse(income);
    }

    @Override
    @Transactional
    public IncomeResponse createIncome(IncomeRequest incomeRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Income income = Income.builder()
                .amount(incomeRequest.getAmount())
                .source(incomeRequest.getSource())
                .description(incomeRequest.getDescription())
                .date(incomeRequest.getDate())
                .user(user)
                .build();

        Income savedIncome = incomeRepository.save(income);
        return convertToResponse(savedIncome);
    }

    @Override
    @Transactional
    public IncomeResponse updateIncome(Long id, IncomeRequest incomeRequest, Long userId) {
        Income income = incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));

        income.setAmount(incomeRequest.getAmount());
        income.setSource(incomeRequest.getSource());
        income.setDescription(incomeRequest.getDescription());
        income.setDate(incomeRequest.getDate());

        Income updatedIncome = incomeRepository.save(income);
        return convertToResponse(updatedIncome);
    }

    @Override
    @Transactional
    public void deleteIncome(Long id, Long userId) {
        Income income = incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));

        incomeRepository.delete(income);
    }

    private IncomeResponse convertToResponse(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .amount(income.getAmount())
                .source(income.getSource())
                .description(income.getDescription())
                .date(income.getDate())
                .build();
    }
}
