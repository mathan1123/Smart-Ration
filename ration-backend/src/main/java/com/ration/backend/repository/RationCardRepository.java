package com.ration.backend.repository;

import com.ration.backend.model.RationCard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RationCardRepository extends JpaRepository<RationCard, Long> {
    Optional<RationCard> findByCardNumber(String cardNumber);
}
