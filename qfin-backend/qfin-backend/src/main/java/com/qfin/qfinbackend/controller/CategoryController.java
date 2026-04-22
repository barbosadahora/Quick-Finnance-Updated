package com.qfin.qfinbackend.controller;

import com.qfin.qfinbackend.model.Category;
import com.qfin.qfinbackend.model.Category.CategoryType;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.service.CategoryService;
import com.qfin.qfinbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get all categories for the authenticated user
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.getAllCategoriesByUser(user.getId());
        return ResponseEntity.ok(categories);
    }

    // Get categories by type (INCOME or EXPENSE)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Category>> getCategoriesByType(
            @PathVariable String type,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        CategoryType categoryType = CategoryType.valueOf(type.toUpperCase());
        List<Category> categories = categoryService.getCategoriesByUserAndType(user.getId(), categoryType);
        return ResponseEntity.ok(categories);
    }

    // Get main categories (no parent)
    @GetMapping("/main")
    public ResponseEntity<List<Category>> getMainCategories(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.getMainCategories(user.getId());
        return ResponseEntity.ok(categories);
    }

    // Get subcategories of a parent category
    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<List<Category>> getSubcategories(
            @PathVariable Long parentId,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> subcategories = categoryService.getSubcategories(user.getId(), parentId);
        return ResponseEntity.ok(subcategories);
    }

    // Get a specific category
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        Category category = categoryService.getCategoryById(user.getId(), id);
        return ResponseEntity.ok(category);
    }

    // Create a new category
    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestBody Map<String, Object> categoryData,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            String name = (String) categoryData.get("name");
            String typeStr = (String) categoryData.get("type");
            CategoryType type = CategoryType.valueOf(typeStr.toUpperCase());
            Long parentId = categoryData.get("parentId") != null ? 
                    Long.valueOf(categoryData.get("parentId").toString()) : null;
            String color = (String) categoryData.get("color");
            String icon = (String) categoryData.get("icon");
            String notes = (String) categoryData.get("notes");

            Category category = categoryService.createCategory(user.getId(), name, type, parentId, color, icon, notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Update a category
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody Map<String, Object> categoryData,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            String name = (String) categoryData.get("name");
            Long parentId = categoryData.get("parentId") != null ? 
                    Long.valueOf(categoryData.get("parentId").toString()) : null;
            String color = (String) categoryData.get("color");
            String icon = (String) categoryData.get("icon");
            String notes = (String) categoryData.get("notes");

            Category category = categoryService.updateCategory(user.getId(), id, name, parentId, color, icon, notes);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Delete a category
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            categoryService.deleteCategory(user.getId(), id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Initialize default categories for a user
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeDefaultCategories(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            categoryService.initializeDefaultCategories(user.getId());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Default categories initialized successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Category>> searchCategories(@RequestParam String searchTerm, Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.searchCategories(user.getId(), searchTerm);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/filter/type")
    public ResponseEntity<List<Category>> filterCategoriesByType(@RequestParam CategoryType type, Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.filterCategoriesByType(user.getId(), type);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/filter/notes")
    public ResponseEntity<List<Category>> filterCategoriesByNotesPresence(@RequestParam boolean hasNotes, Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.filterCategoriesByNotesPresence(user.getId(), hasNotes);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/filter/default")
    public ResponseEntity<List<Category>> filterCategoriesByDefault(@RequestParam boolean isDefault, Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Category> categories = categoryService.filterCategoriesByDefault(user.getId(), isDefault);
        return ResponseEntity.ok(categories);
    }
}
