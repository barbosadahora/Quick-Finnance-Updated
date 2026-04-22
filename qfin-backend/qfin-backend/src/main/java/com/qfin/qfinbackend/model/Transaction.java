package com.qfin.qfinbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Type cannot be null")
    @Enumerated(EnumType.STRING)
    private TransactionType type; // INCOME or EXPENSE
    
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    @NotBlank(message = "Category cannot be empty")
    private String category;
    
    @NotBlank(message = "Description cannot be empty")
    private String description;
    
    @NotNull(message = "Date cannot be null")
    private LocalDate date;

    private boolean isRecurring = false;
    private String recurrenceInterval; // e.g., "DAILY", "WEEKLY", "MONTHLY", "YEARLY"
    private LocalDate dueDate; // For recurring transactions, the next due date
    @Column(length = 500)
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public String getRecurrenceInterval() {
        return recurrenceInterval;
    }

    public void setRecurrenceInterval(String recurrenceInterval) {
        this.recurrenceInterval = recurrenceInterval;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public enum TransactionType {
        INCOME,
        EXPENSE
    }
}
