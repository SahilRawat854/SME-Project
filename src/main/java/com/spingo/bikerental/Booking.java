package com.spingo.bikerental;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bike_id", nullable = false)
    private Bike bike;
    
    @NotNull
    @Column(name = "pickup_date")
    private LocalDateTime pickupDate;
    
    @NotNull
    @Column(name = "dropoff_date")
    private LocalDateTime dropoffDate;
    
    @NotNull
    @Column(name = "pickup_time")
    private String pickupTime;
    
    @NotNull
    @Column(name = "drop_time")
    private String dropTime;
    
    @Column(name = "actual_pickup_date")
    private LocalDateTime actualPickupDate;
    
    @Column(name = "actual_dropoff_date")
    private LocalDateTime actualDropoffDate;
    
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;
    
    @Size(max = 500)
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Booking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = BookingStatus.PENDING;
    }
    
    public Booking(User user, Bike bike, LocalDateTime pickupDate, LocalDateTime dropoffDate, BigDecimal totalAmount) {
        this();
        this.user = user;
        this.bike = bike;
        this.pickupDate = pickupDate;
        this.dropoffDate = dropoffDate;
        this.totalPrice = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Bike getBike() {
        return bike;
    }
    
    public void setBike(Bike bike) {
        this.bike = bike;
    }
    
    public LocalDateTime getPickupDate() {
        return pickupDate;
    }
    
    public void setPickupDate(LocalDateTime pickupDate) {
        this.pickupDate = pickupDate;
    }
    
    public LocalDateTime getDropoffDate() {
        return dropoffDate;
    }
    
    public void setDropoffDate(LocalDateTime dropoffDate) {
        this.dropoffDate = dropoffDate;
    }
    
    public String getPickupTime() {
        return pickupTime;
    }
    
    public void setPickupTime(String pickupTime) {
        this.pickupTime = pickupTime;
    }
    
    public String getDropTime() {
        return dropTime;
    }
    
    public void setDropTime(String dropTime) {
        this.dropTime = dropTime;
    }
    
    public LocalDateTime getActualPickupDate() {
        return actualPickupDate;
    }
    
    public void setActualPickupDate(LocalDateTime actualPickupDate) {
        this.actualPickupDate = actualPickupDate;
    }
    
    public LocalDateTime getActualDropoffDate() {
        return actualDropoffDate;
    }
    
    public void setActualDropoffDate(LocalDateTime actualDropoffDate) {
        this.actualDropoffDate = actualDropoffDate;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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
