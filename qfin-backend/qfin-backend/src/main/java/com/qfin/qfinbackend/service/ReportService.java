package com.qfin.qfinbackend.service;

import com.qfin.qfinbackend.dto.CategorySummaryDTO;
import com.qfin.qfinbackend.dto.ReportRequestDTO;
import com.qfin.qfinbackend.dto.ReportSummaryDTO;
import com.qfin.qfinbackend.model.Financing;
import com.qfin.qfinbackend.model.Transaction;
import com.qfin.qfinbackend.model.Transaction.TransactionType;
import com.qfin.qfinbackend.repository.FinancingRepository;
import com.qfin.qfinbackend.repository.TransactionRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.UnitValue;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private FinancingRepository financingRepository;
    
    @Autowired
    private com.qfin.qfinbackend.repository.GoalRepository goalRepository;

    public List<Transaction> getTransactionsByFilters(Long userId, ReportRequestDTO request) {
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now().minusMonths(1);
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : LocalDate.now();

        TransactionType type = null;
        if (request.getType() != null && !request.getType().equalsIgnoreCase("ALL")) {
            try {
                type = TransactionType.valueOf(request.getType().toUpperCase());
            } catch (IllegalArgumentException ex) {
                type = null;
            }
        }

        String category = request.getCategory();
        if (category != null && category.isBlank()) {
            category = null; // treat empty string as no category filter
        }

        return transactionRepository.findByFilters(userId, startDate, endDate, type, category);
    }

    public ReportSummaryDTO getReportSummary(Long userId, ReportRequestDTO request) {
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now().minusMonths(1);
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : LocalDate.now();

        Double totalIncome = transactionRepository.sumByUserIdAndTypeAndDateBetween(
            userId, TransactionType.INCOME, startDate, endDate);
        Double totalExpense = transactionRepository.sumByUserIdAndTypeAndDateBetween(
            userId, TransactionType.EXPENSE, startDate, endDate);

        totalIncome = totalIncome != null ? totalIncome : 0.0;
        totalExpense = totalExpense != null ? totalExpense : 0.0;

        List<Transaction> transactions = getTransactionsByFilters(userId, request);
        
        List<CategorySummaryDTO> categoryBreakdown = new ArrayList<>();
        
        // Income categories
        List<Object[]> incomeCategories = transactionRepository.sumByCategoryAndType(
            userId, TransactionType.INCOME, startDate, endDate);
        for (Object[] row : incomeCategories) {
            categoryBreakdown.add(new CategorySummaryDTO(
                (String) row[0],
                (Double) row[1],
                ((Number) row[2]).longValue(),
                "INCOME"
            ));
        }
        
        // Expense categories
        List<Object[]> expenseCategories = transactionRepository.sumByCategoryAndType(
            userId, TransactionType.EXPENSE, startDate, endDate);
        for (Object[] row : expenseCategories) {
            categoryBreakdown.add(new CategorySummaryDTO(
                (String) row[0],
                (Double) row[1],
                ((Number) row[2]).longValue(),
                "EXPENSE"
            ));
        }

        return new ReportSummaryDTO(
            totalIncome,
            totalExpense,
            totalIncome - totalExpense,
            (long) transactions.size(),
            categoryBreakdown
        );
    }

    public byte[] exportTransactionsToCSV(Long userId, ReportRequestDTO request) throws IOException {
        List<Transaction> transactions = getTransactionsByFilters(userId, request);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);
        
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader("Data", "Tipo", "Categoria", "Descrição", "Valor")
            .build();
        
        try (CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            
            for (Transaction transaction : transactions) {
                printer.printRecord(
                    transaction.getDate().format(formatter),
                    transaction.getType().toString(),
                    transaction.getCategory(),
                    transaction.getDescription(),
                    String.format("%.2f", transaction.getAmount())
                );
            }
            
            printer.flush();
        }
        
        return out.toByteArray();
    }

    public byte[] exportFinancingsToCSV(Long userId) throws IOException {
        List<Financing> financings = financingRepository.findAll().stream()
            .filter(f -> f.getUser().getId().equals(userId))
            .collect(Collectors.toList());
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);
        
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader("Nome", "Tipo", "Valor Total", "Valor Restante", "Parcela Mensal", "Data Final")
            .build();
        
        try (CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            
            for (Financing financing : financings) {
                printer.printRecord(
                    financing.getName(),
                    financing.getType().toString(),
                    String.format("%.2f", financing.getTotalAmount()),
                    String.format("%.2f", financing.getRemainingAmount()),
                    String.format("%.2f", financing.getMonthlyPayment()),
                    financing.getEndDate().format(formatter)
                );
            }
            
            printer.flush();
        }
        
        return out.toByteArray();
    }

    public byte[] exportGoalsToCSV(Long userId) throws IOException {
        List<com.qfin.qfinbackend.model.Goal> goals = goalRepository.findAll().stream()
            .filter(g -> g.getUser().getId().equals(userId))
            .collect(Collectors.toList());
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out);
        
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader("Nome", "Status", "Valor Alvo", "Valor Atual", "Categoria", "Data Limite", "Descrição")
            .build();
        
        try (CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            
            for (com.qfin.qfinbackend.model.Goal goal : goals) {
                printer.printRecord(
                    goal.getName(),
                    goal.getStatus() != null ? goal.getStatus().toString() : "",
                    String.format("%.2f", goal.getTargetAmount()),
                    String.format("%.2f", goal.getCurrentAmount()),
                    goal.getCategory(),
                    goal.getDeadline() != null ? goal.getDeadline().format(formatter) : "",
                    goal.getDescription()
                );
            }
            
            printer.flush();
        }
        
        return out.toByteArray();
    }

    public byte[] exportReportToPDF(Long userId, ReportRequestDTO request) throws IOException {
        ReportSummaryDTO summary = getReportSummary(userId, request);
        List<Transaction> transactions = getTransactionsByFilters(userId, request);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("RELATÓRIO FINANCEIRO").setBold());
        document.add(new Paragraph("Período: " + (request.getStartDate() != null ? request.getStartDate() : "-") + " a " + (request.getEndDate() != null ? request.getEndDate() : "-")));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("RESUMO").setBold());
        document.add(new Paragraph("Total de Receitas: R$ " + String.format("%.2f", summary.getTotalIncome())));
        document.add(new Paragraph("Total de Despesas: R$ " + String.format("%.2f", summary.getTotalExpense())));
        document.add(new Paragraph("Saldo: R$ " + String.format("%.2f", summary.getBalance())));
        document.add(new Paragraph("Total de Transações: " + summary.getTotalTransactions()));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("DETALHAMENTO POR CATEGORIA").setBold());

        // Category table: Category | Type | Total | Count
        Table catTable = new Table(UnitValue.createPercentArray(new float[]{4, 2, 3, 2}));
        catTable.setWidth(UnitValue.createPercentValue(100));
        catTable.addHeaderCell(new Cell().add(new Paragraph("Categoria")));
        catTable.addHeaderCell(new Cell().add(new Paragraph("Tipo")));
        catTable.addHeaderCell(new Cell().add(new Paragraph("Total (R$)")));
        catTable.addHeaderCell(new Cell().add(new Paragraph("Transações")));

        for (CategorySummaryDTO category : summary.getCategoryBreakdown()) {
            catTable.addCell(new Cell().add(new Paragraph(category.getCategory())));
            catTable.addCell(new Cell().add(new Paragraph(category.getType())));
            catTable.addCell(new Cell().add(new Paragraph(String.format("%.2f", category.getTotalAmount()))));
            catTable.addCell(new Cell().add(new Paragraph(String.valueOf(category.getTransactionCount()))));
        }

        document.add(catTable);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("TRANSAÇÕES DETALHADAS").setBold());

        // Transactions table: Date | Type | Category | Description | Amount
        Table txTable = new Table(UnitValue.createPercentArray(new float[]{2, 2, 3, 5, 2}));
        txTable.setWidth(UnitValue.createPercentValue(100));
        txTable.addHeaderCell(new Cell().add(new Paragraph("Data")));
        txTable.addHeaderCell(new Cell().add(new Paragraph("Tipo")));
        txTable.addHeaderCell(new Cell().add(new Paragraph("Categoria")));
        txTable.addHeaderCell(new Cell().add(new Paragraph("Descrição")));
        txTable.addHeaderCell(new Cell().add(new Paragraph("Valor (R$)")));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        for (Transaction transaction : transactions) {
            txTable.addCell(new Cell().add(new Paragraph(transaction.getDate().format(formatter))));
            txTable.addCell(new Cell().add(new Paragraph(transaction.getType().toString())));
            txTable.addCell(new Cell().add(new Paragraph(transaction.getCategory())));
            txTable.addCell(new Cell().add(new Paragraph(transaction.getDescription() != null ? transaction.getDescription() : "")));
            txTable.addCell(new Cell().add(new Paragraph(String.format("%.2f", transaction.getAmount()))));
        }

        document.add(txTable);

        document.close();

        return out.toByteArray();
    }
}
