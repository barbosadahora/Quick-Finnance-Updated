package com.qfin.qfinbackend.service;

import org.springframework.stereotype.Service;

@Service
public class FinancialCalculatorService {

    // Calculator for Loan/Financing
    public double calculateLoanPayment(double principal, double annualInterestRate, int loanTermInMonths) {
        if (principal <= 0 || annualInterestRate < 0 || loanTermInMonths <= 0) {
            throw new IllegalArgumentException("Invalid input for loan calculation.");
        }
        double monthlyInterestRate = annualInterestRate / 12 / 100;
        if (monthlyInterestRate == 0) {
            return principal / loanTermInMonths;
        }
        return principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermInMonths)) /
               (Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1);
    }

    // Calculator for Investments (Future Value)
    public double calculateFutureValue(double principal, double annualInterestRate, int years, double monthlyContribution) {
        if (principal < 0 || annualInterestRate < 0 || years < 0 || monthlyContribution < 0) {
            throw new IllegalArgumentException("Invalid input for investment calculation.");
        }
        double monthlyInterestRate = annualInterestRate / 12 / 100;
        int totalMonths = years * 12;

        double futureValuePrincipal = principal * Math.pow(1 + monthlyInterestRate, totalMonths);
        double futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyInterestRate, totalMonths) - 1) / monthlyInterestRate);

        return futureValuePrincipal + futureValueContributions;
    }

    // Calculator for Savings (Time to Reach Goal)
    public int calculateTimeToReachGoal(double currentSavings, double monthlySavings, double annualInterestRate, double goalAmount) {
        if (currentSavings < 0 || monthlySavings <= 0 || annualInterestRate < 0 || goalAmount <= currentSavings) {
            throw new IllegalArgumentException("Invalid input for savings goal calculation.");
        }

        double monthlyInterestRate = annualInterestRate / 12 / 100;
        int months = 0;
        double balance = currentSavings;

        if (monthlyInterestRate == 0) {
            return (int) Math.ceil((goalAmount - currentSavings) / monthlySavings);
        }

        while (balance < goalAmount) {
            balance = (balance * (1 + monthlyInterestRate)) + monthlySavings;
            months++;
            if (months > 1200) { // Prevent infinite loops for unrealistic scenarios (100 years)
                throw new RuntimeException("Goal not reachable within a reasonable timeframe with given parameters.");
            }
        }
        return months;
    }
}
