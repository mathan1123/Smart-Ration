package com.ration.backend.repository;

import com.ration.backend.model.ShopStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopStatusRepository extends JpaRepository<ShopStatus, Long> {
}
