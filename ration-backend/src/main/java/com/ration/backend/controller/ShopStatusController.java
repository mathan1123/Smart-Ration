package com.ration.backend.controller;

import com.ration.backend.model.ShopStatus;
import com.ration.backend.repository.ShopStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop-status")
public class ShopStatusController {

    @Autowired
    private ShopStatusRepository repository;

    @GetMapping
    public ShopStatus getStatus() {
        return repository.findAll().stream().findFirst()
                .orElse(new ShopStatus(true, "Monday - Saturday", "9:00 AM - 6:00 PM"));
    }

    @PostMapping("/update")
    public ShopStatus updateStatus(@RequestBody ShopStatus newStatus) {
        ShopStatus status = repository.findAll().stream().findFirst()
                .orElse(new ShopStatus(true, "N/A", "N/A"));

        if (newStatus.getWorkingDays() != null)
            status.setWorkingDays(newStatus.getWorkingDays());
        if (newStatus.getWorkingHours() != null)
            status.setWorkingHours(newStatus.getWorkingHours());
        status.setOnLeave(newStatus.isOnLeave());
        if (newStatus.getTodayMessage() != null)
            status.setTodayMessage(newStatus.getTodayMessage());

        return repository.save(status);
    }

}
