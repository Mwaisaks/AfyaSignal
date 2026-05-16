package com.mwaisaka.AfyaSignal.controller;

import com.mwaisaka.AfyaSignal.dto.NotificationResponse;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(currentUser.getId()));
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(currentUser.getId()));
    }

    @GetMapping("/unread/count")
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(notificationService.getUnreadCount(currentUser.getId()));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasAnyRole('CHV', 'ADMIN', 'HEALTH_FACILITY')")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
