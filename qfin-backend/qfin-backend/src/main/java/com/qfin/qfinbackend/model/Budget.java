package com.qfin.qfinbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    @NotNull(message = "Budget amount cannot be null")
    @DecimalMin(value = "0.01", message = "Budget amount must be greater than 0")
    private Double amount;

    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional: current spent amount for the budget period
    private Double currentSpent = 0.0;

    // Optional: alert threshold (e.g., 80% of budget)
    private Double alertThreshold;

    // Optional: description for the budget
    private String description;

    public Budget(String category, Double amount, LocalDate startDate, LocalDate endDate, User user) {
        this.category = category;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
    }
}
