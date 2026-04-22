package com.qfin.qfinbackend.repository;

import com.qfin.qfinbackend.model.Notification;
import com.qfin.qfinbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
    List<Notification> findByUserAndIsReadFalseOrderByTimestampDesc(User user);
}
