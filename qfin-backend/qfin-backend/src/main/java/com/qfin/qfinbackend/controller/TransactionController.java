package com.qfin.qfinbackend.controller;

import com.qfin.qfinbackend.model.Transaction;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.repository.UserRepository;
import com.qfin.qfinbackend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        User user = getCurrentUser();
        return transactionService.getTransactionsByUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        User user = getCurrentUser();
        return transactionService.getTransactionByIdAndUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        User user = getCurrentUser();
        transaction.setUser(user);
        transaction.setRecurring(transaction.isRecurring());
        transaction.setRecurrenceInterval(transaction.getRecurrenceInterval());
        transaction.setDueDate(transaction.getDueDate());
        transaction.setNotes(transaction.getNotes());
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @Valid @RequestBody Transaction transactionDetails) {
        User user = getCurrentUser();
        transactionDetails.setRecurring(transactionDetails.isRecurring());
        transactionDetails.setRecurrenceInterval(transactionDetails.getRecurrenceInterval());
        transactionDetails.setDueDate(transactionDetails.getDueDate());
        transactionDetails.setNotes(transactionDetails.getNotes());
        Transaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails, user);
        if (updatedTransaction != null) {
            return ResponseEntity.ok(updatedTransaction);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        User user = getCurrentUser();
        transactionService.deleteTransaction(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> searchTransactions(@RequestParam String searchTerm) {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionService.searchTransactions(user, searchTerm);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filter/date")
    public ResponseEntity<List<Transaction>> filterTransactionsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionService.filterTransactionsByDateRange(user, LocalDate.parse(startDate), LocalDate.parse(endDate));
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filter/category")
    public ResponseEntity<List<Transaction>> filterTransactionsByCategory(@RequestParam String category) {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionService.filterTransactionsByCategory(user, category);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filter/type")
    public ResponseEntity<List<Transaction>> filterTransactionsByType(@RequestParam Transaction.TransactionType type) {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionService.filterTransactionsByType(user, type);
        return ResponseEntity.ok(transactions);
    }
}
