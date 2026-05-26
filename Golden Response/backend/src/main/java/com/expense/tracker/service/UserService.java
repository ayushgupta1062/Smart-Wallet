package com.expense.tracker.service;

import com.expense.tracker.dto.RegisterRequest;
import com.expense.tracker.entity.User;

public interface UserService {
    User registerUser(RegisterRequest registerRequest);
    User getUserByEmail(String email);
    User getUserById(Long id);
}
