package com.ration.backend.repository;

import com.ration.backend.model.Entitlement;
import com.ration.backend.model.RationCard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EntitlementRepository extends JpaRepository<Entitlement, Long> {
    List<Entitlement> findByRationCard(RationCard rationCard);
    List<Entitlement> findByRationCardCardNumber(String cardNumber);
}
