package com.qfin.qfinbackend.controller;

import com.qfin.qfinbackend.model.Budget;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.repository.UserRepository;
import com.qfin.qfinbackend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Budget> budgets = budgetService.getAllBudgetsByUser(user);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        return budgetService.getBudgetById(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody Budget budget, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Budget createdBudget = budgetService.createBudget(budget, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @Valid @RequestBody Budget budget, Authentication authentication) {
        User user = getCurrentUser(authentication);
        try {
            Budget updatedBudget = budgetService.updateBudget(id, budget, user);
            return ResponseEntity.ok(updatedBudget);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        try {
            budgetService.deleteBudget(id, user);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
