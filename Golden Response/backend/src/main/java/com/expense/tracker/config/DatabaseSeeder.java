package com.expense.tracker.config;

import com.expense.tracker.entity.Category;
import com.expense.tracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        seedDefaultCategories();
    }

    private void seedDefaultCategories() {
        // Query for system-level categories where user is null
        long count = categoryRepository.findAll().stream()
                .filter(c -> c.getUser() == null)
                .count();

        if (count == 0) {
            List<Category> defaultCategories = Arrays.asList(
                    Category.builder().name("Food").color("#F59E0B").icon("Utensils").user(null).build(),
                    Category.builder().name("Travel").color("#3B82F6").icon("Plane").user(null).build(),
                    Category.builder().name("Shopping").color("#EC4899").icon("ShoppingBag").user(null).build(),
                    Category.builder().name("Bills").color("#EF4444").icon("CreditCard").user(null).build(),
                    Category.builder().name("Entertainment").color("#8B5CF6").icon("Film").user(null).build(),
                    Category.builder().name("Health").color("#10B981").icon("Activity").user(null).build()
            );

            categoryRepository.saveAll(defaultCategories);
            System.out.println("Default expense categories successfully seeded!");
        }
    }
}
