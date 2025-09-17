package com.spingo.bikerental;

import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.BikeType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BikeResponse {
    
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private BikeType type;
    private String city;
    private BigDecimal pricePerHour;
    private String description;
    private BikeStatus status;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public BikeResponse() {}
    
    public BikeResponse(Bike bike) {
        this.id = bike.getId();
        this.brand = bike.getBrand();
        this.model = bike.getModel();
        this.year = bike.getYear();
        this.type = bike.getType();
        this.city = bike.getCity();
        this.pricePerHour = bike.getPricePerHour();
        this.description = bike.getDescription();
        this.status = bike.getStatus();
        this.imageUrl = bike.getImageUrl();
        this.isActive = bike.getIsActive();
        this.createdAt = bike.getCreatedAt();
        this.updatedAt = bike.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public BikeType getType() {
        return type;
    }
    
    public void setType(BikeType type) {
        this.type = type;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public BigDecimal getPricePerHour() {
        return pricePerHour;
    }
    
    public void setPricePerHour(BigDecimal pricePerHour) {
        this.pricePerHour = pricePerHour;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BikeStatus getStatus() {
        return status;
    }
    
    public void setStatus(BikeStatus status) {
        this.status = status;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
