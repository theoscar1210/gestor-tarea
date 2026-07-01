package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByEndpoint(String endpoint);
    void deleteByEndpoint(String endpoint);
}
