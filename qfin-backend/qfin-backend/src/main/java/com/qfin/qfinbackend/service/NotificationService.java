package com.qfin.qfinbackend.service;

import com.qfin.qfinbackend.model.Notification;
import com.qfin.qfinbackend.model.User;
import com.qfin.qfinbackend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, String message, String type) {
        Notification notification = new Notification(user, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    public List<Notification> getUnreadNotificationsByUser(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByTimestampDesc(user);
    }

    public Optional<Notification> markNotificationAsRead(Long notificationId, User user) {
        return notificationRepository.findById(notificationId)
                .map(notification -> {
                    if (notification.getUser().getId().equals(user.getId())) {
                        notification.setRead(true);
                        return notificationRepository.save(notification);
                    }
                    return null;
                });
    }

    public void deleteNotification(Long notificationId, User user) {
        notificationRepository.findById(notificationId)
                .ifPresent(notification -> {
                    if (notification.getUser().getId().equals(user.getId())) {
                        notificationRepository.delete(notification);
                    }
                });
    }
}
