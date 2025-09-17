package com.spingo.bikerental.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.spingo.bikerental.UserRole;

public class SignupRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    
    @NotBlank(message = "User type is required")
    private String userType;
    
    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;
    
    private boolean termsAccepted;
    
    // Constructors
    public SignupRequest() {}
    
    public SignupRequest(String name, String email, String phone, String password, String userType, String address, boolean termsAccepted) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.userType = userType;
        this.address = address;
        this.termsAccepted = termsAccepted;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getUserType() {
        return userType;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public boolean isTermsAccepted() {
        return termsAccepted;
    }
    
    public void setTermsAccepted(boolean termsAccepted) {
        this.termsAccepted = termsAccepted;
    }
    
    // Helper method to convert userType string to UserRole enum
    public UserRole getUserRole() {
        if (userType == null) {
            return UserRole.CUSTOMER; // Default role
        }
        
        switch (userType.toLowerCase()) {
            case "customer":
                return UserRole.CUSTOMER;
            case "individual_owner":
                return UserRole.INDIVIDUAL_OWNER;
            case "rental_business":
                return UserRole.RENTAL_BUSINESS;
            case "delivery_partner":
                return UserRole.DELIVERY_PARTNER;
            case "admin":
                return UserRole.ADMIN;
            default:
                return UserRole.CUSTOMER; // Default to customer
        }
    }
}
