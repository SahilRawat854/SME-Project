package com.spingo.bikerental;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bikes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "brand")
    private String brand;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "model")
    private String model;
    
    @NotNull
    @Column(name = "year")
    private Integer year;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BikeType type;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "city")
    private String city;
    
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;
    
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "price_per_day", precision = 10, scale = 2)
    private BigDecimal pricePerDay;
    
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "price_per_month", precision = 10, scale = 2)
    private BigDecimal pricePerMonth;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BikeStatus status;
    
    @Size(max = 500)
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Bike() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = BikeStatus.AVAILABLE;
    }
    
    public Bike(String brand, String model, Integer year, BikeType type, String city,
                BigDecimal pricePerHour, BigDecimal pricePerDay, BigDecimal pricePerMonth, 
                String description, String imageUrl, User owner) {
        this();
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.type = type;
        this.city = city;
        this.pricePerHour = pricePerHour;
        this.pricePerDay = pricePerDay;
        this.pricePerMonth = pricePerMonth;
        this.description = description;
        this.imageUrl = imageUrl;
        this.owner = owner;
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
    
    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }
    
    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }
    
    public BigDecimal getPricePerMonth() {
        return pricePerMonth;
    }
    
    public void setPricePerMonth(BigDecimal pricePerMonth) {
        this.pricePerMonth = pricePerMonth;
    }
    
    public User getOwner() {
        return owner;
    }
    
    public void setOwner(User owner) {
        this.owner = owner;
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
