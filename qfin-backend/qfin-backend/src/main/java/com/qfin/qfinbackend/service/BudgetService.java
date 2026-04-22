package com.qfin.qfinbackend.service;

import com.qfin.qfinbackend.model.Budget;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.repository.BudgetRepository;
import com.qfin.qfinbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Budget> getAllBudgetsByUser(User user) {
        return budgetRepository.findByUser(user);
    }

    public Optional<Budget> getBudgetById(Long id, User user) {
        return budgetRepository.findByIdAndUser(id, user);
    }

    public Budget createBudget(Budget budget, User user) {
        budget.setUser(user);
        // Optionally, calculate currentSpent based on existing transactions for the period
        // This would require injecting TransactionService and querying transactions
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, Budget updatedBudget, User user) {
        return budgetRepository.findByIdAndUser(id, user).map(budget -> {
            budget.setCategory(updatedBudget.getCategory());
            budget.setAmount(updatedBudget.getAmount());
            budget.setStartDate(updatedBudget.getStartDate());
            budget.setEndDate(updatedBudget.getEndDate());
            budget.setDescription(updatedBudget.getDescription());
            budget.setAlertThreshold(updatedBudget.getAlertThreshold());
            // currentSpent should probably be updated by transactions, not directly
            return budgetRepository.save(budget);
        }).orElseThrow(() -> new RuntimeException("Budget not found or unauthorized"));
    }

    public void deleteBudget(Long id, User user) {
        if (!budgetRepository.findByIdAndUser(id, user).isPresent()) {
            throw new RuntimeException("Budget not found or unauthorized");
        }
        budgetRepository.deleteById(id);
    }

    // Method to update currentSpent based on new transactions
    public void updateBudgetSpent(User user, String category, Double amount, LocalDate transactionDate) {
        List<Budget> budgets = budgetRepository.findByUserAndCategory(user, category);
        for (Budget budget : budgets) {
            if (!transactionDate.isBefore(budget.getStartDate()) && !transactionDate.isAfter(budget.getEndDate())) {
                budget.setCurrentSpent(budget.getCurrentSpent() + amount);
                budgetRepository.save(budget);
                // TODO: Implement notification logic if alertThreshold is exceeded
            }
        }
    }
}
