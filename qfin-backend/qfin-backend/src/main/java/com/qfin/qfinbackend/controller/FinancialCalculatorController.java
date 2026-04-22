package com.qfin.qfinbackend.controller;

import com.qfin.qfinbackend.service.FinancialCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculators")
@CrossOrigin(origins = "http://localhost:5173")
public class FinancialCalculatorController {

    @Autowired
    private FinancialCalculatorService calculatorService;

    @GetMapping("/loan-payment")
    public ResponseEntity<Double> calculateLoanPayment(
            @RequestParam double principal,
            @RequestParam double annualInterestRate,
            @RequestParam int loanTermInMonths) {
        try {
            double monthlyPayment = calculatorService.calculateLoanPayment(principal, annualInterestRate, loanTermInMonths);
            return ResponseEntity.ok(monthlyPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/future-value")
    public ResponseEntity<Double> calculateFutureValue(
            @RequestParam double principal,
            @RequestParam double annualInterestRate,
            @RequestParam int years,
            @RequestParam double monthlyContribution) {
        try {
            double futureValue = calculatorService.calculateFutureValue(principal, annualInterestRate, years, monthlyContribution);
            return ResponseEntity.ok(futureValue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/time-to-goal")
    public ResponseEntity<Integer> calculateTimeToReachGoal(
            @RequestParam double currentSavings,
            @RequestParam double monthlySavings,
            @RequestParam double annualInterestRate,
            @RequestParam double goalAmount) {
        try {
            int months = calculatorService.calculateTimeToReachGoal(currentSavings, monthlySavings, annualInterestRate, goalAmount);
            return ResponseEntity.ok(months);
        } catch (IllegalArgumentException | RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
