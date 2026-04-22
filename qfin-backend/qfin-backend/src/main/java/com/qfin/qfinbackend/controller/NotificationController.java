package com.qfin.qfinbackend.controller;

import com.qfin.qfinbackend.model.Notification;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.repository.UserRepository;
import com.qfin.qfinbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        User user = getCurrentUser();
        List<Notification> notifications = notificationService.getNotificationsByUser(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        User user = getCurrentUser();
        List<Notification> notifications = notificationService.getUnreadNotificationsByUser(user);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser();
        return notificationService.markNotificationAsRead(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser();
        notificationService.deleteNotification(id, user);
        return ResponseEntity.noContent().build();
    }
}
