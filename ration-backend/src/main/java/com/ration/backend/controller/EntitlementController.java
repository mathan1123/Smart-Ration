package com.ration.backend.controller;

import com.ration.backend.model.Entitlement;
import com.ration.backend.repository.EntitlementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/entitlements")
public class EntitlementController {

    @Autowired
    private EntitlementRepository entitlementRepository;

    @GetMapping("/{cardNumber}")
    public List<EntitlementDTO> getEntitlements(@PathVariable String cardNumber) {
        List<Entitlement> entitlements = entitlementRepository.findByRationCardCardNumber(cardNumber);
        return entitlements.stream().map(e -> new EntitlementDTO(
                e.getItem().getName(),
                e.getTotalQuantity(),
                e.getUsedQuantity(),
                e.getItem().getUnit(),
                e.getItem().getPricePerUnit())).collect(Collectors.toList());
    }

    public static class EntitlementDTO {
        public String nameEn;
        public Double total;
        public Double used;
        public String unitEn;
        public Double price;

        public EntitlementDTO(String nameEn, Double total, Double used, String unitEn, Double price) {
            this.nameEn = nameEn;
            this.total = total;
            this.used = used;
            this.unitEn = unitEn;
            this.price = price;
        }
    }
}
