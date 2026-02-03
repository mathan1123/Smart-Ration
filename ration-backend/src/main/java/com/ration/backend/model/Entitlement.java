package com.ration.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entitlements")
@Data
public class Entitlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ration_card_id", nullable = false)
    private RationCard rationCard;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private Double totalQuantity;
    private Double usedQuantity;

    public Entitlement() {
    }

    public Entitlement(Long id, RationCard rationCard, Item item, Double totalQuantity, Double usedQuantity) {
        this.id = id;
        this.rationCard = rationCard;
        this.item = item;
        this.totalQuantity = totalQuantity;
        this.usedQuantity = usedQuantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RationCard getRationCard() {
        return rationCard;
    }

    public void setRationCard(RationCard rationCard) {
        this.rationCard = rationCard;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Double getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Double totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Double getUsedQuantity() {
        return usedQuantity;
    }

    public void setUsedQuantity(Double usedQuantity) {
        this.usedQuantity = usedQuantity;
    }
}
