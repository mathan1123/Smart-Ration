package com.ration.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shop_status")
@Data
public class ShopStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isOpen;
    private boolean isOnLeave;
    private String todayMessage;
    private String workingDays;
    private String workingHours;

    public ShopStatus() {
    }

    public ShopStatus(boolean isOpen, String workingDays, String workingHours) {
        this.isOpen = isOpen;
        this.workingDays = workingDays;
        this.workingHours = workingHours;
        this.isOnLeave = false;
        this.todayMessage = "Welcome!";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public void setOpen(boolean open) {
        isOpen = open;
    }

    public boolean isOnLeave() {
        return isOnLeave;
    }

    public void setOnLeave(boolean leave) {
        isOnLeave = leave;
    }

    public String getTodayMessage() {
        return todayMessage;
    }

    public void setTodayMessage(String message) {
        todayMessage = message;
    }

    public String getWorkingDays() {
        return workingDays;
    }

    public void setWorkingDays(String workingDays) {
        this.workingDays = workingDays;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }
}
