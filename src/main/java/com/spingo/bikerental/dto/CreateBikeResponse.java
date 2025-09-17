package com.spingo.bikerental.dto;

import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.BikeType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateBikeResponse {
    
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private BikeType type;
    private String city;
    private BigDecimal pricePerHour;
    private BigDecimal pricePerDay;
    private BigDecimal pricePerMonth;
    private String description;
    private String imageUrl;
    private BikeStatus status;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String message;
    private boolean success;
    
    public CreateBikeResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public CreateBikeResponse(Bike bike, String message, boolean success) {
        this.id = bike.getId();
        this.brand = bike.getBrand();
        this.model = bike.getModel();
        this.year = bike.getYear();
        this.type = bike.getType();
        this.city = bike.getCity();
        this.pricePerHour = bike.getPricePerHour();
        this.pricePerDay = bike.getPricePerDay();
        this.pricePerMonth = bike.getPricePerMonth();
        this.description = bike.getDescription();
        this.imageUrl = bike.getImageUrl();
        this.status = bike.getStatus();
        this.isActive = bike.getIsActive();
        this.createdAt = bike.getCreatedAt();
        this.message = message;
        this.success = success;
    }
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public BikeType getType() {
        return type;
    }
    
    public String getCity() {
        return city;
    }
    
    public BigDecimal getPricePerHour() {
        return pricePerHour;
    }
    
    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }
    
    public BigDecimal getPricePerMonth() {
        return pricePerMonth;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public BikeStatus getStatus() {
        return status;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public String getMessage() {
        return message;
    }
    
    public boolean isSuccess() {
        return success;
    }
}
