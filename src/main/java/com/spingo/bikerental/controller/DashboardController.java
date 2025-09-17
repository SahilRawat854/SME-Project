package com.spingo.bikerental.controller;

import com.spingo.bikerental.Booking;
import com.spingo.bikerental.BookingRepository;
import com.spingo.bikerental.BookingStatus;
import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeRepository;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.User;
import com.spingo.bikerental.UserRepository;
import com.spingo.bikerental.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Customer Dashboard
    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getCustomerDashboard(@RequestParam Long userId) {
        try {
            Map<String, Object> dashboard = new HashMap<>();
            
            // Validate user exists
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found with ID: " + userId));
            }
            
            // Get user's bookings
            List<Booking> userBookings = bookingRepository.findByUserId(userId);
            dashboard.put("totalBookings", userBookings.size());
            dashboard.put("activeBookings", (long) userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.ACTIVE)
                .count());
            dashboard.put("recentBookings", userBookings.stream().limit(5).toList());
            
            // Calculate total spent
            BigDecimal totalSpent = userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            dashboard.put("totalSpent", totalSpent);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to get customer dashboard: " + e.getMessage()));
        }
    }

    // Admin Dashboard
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // User statistics
        List<User> allUsers = userRepository.findAll();
        dashboard.put("totalUsers", allUsers.size());
        dashboard.put("activeUsers", userRepository.findByIsActiveTrue().size());
        
        // User counts by role
        Map<UserRole, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            usersByRole.put(role, (long) userRepository.findByRole(role).size());
        }
        dashboard.put("usersByRole", usersByRole);
        
        // Bike statistics
        List<Bike> allBikes = bikeRepository.findAll();
        dashboard.put("totalBikes", allBikes.size());
        dashboard.put("availableBikes", bikeRepository.findByStatus(BikeStatus.AVAILABLE).size());
        dashboard.put("bookedBikes", bikeRepository.findByStatus(BikeStatus.BOOKED).size());
        
        // Booking statistics
        List<Booking> allBookings = bookingRepository.findAll();
        dashboard.put("totalBookings", allBookings.size());
        dashboard.put("pendingBookings", bookingRepository.findByStatus(BookingStatus.PENDING).size());
        dashboard.put("activeBookings", bookingRepository.findByStatus(BookingStatus.ACTIVE).size());
        dashboard.put("completedBookings", bookingRepository.findByStatus(BookingStatus.COMPLETED).size());
        
        // Revenue calculation
        BigDecimal totalRevenue = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .map(Booking::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(dashboard);
    }

    // Individual Owner Dashboard
    @GetMapping("/owner")
    @PreAuthorize("hasRole('INDIVIDUAL_OWNER')")
    public ResponseEntity<Map<String, Object>> getOwnerDashboard(@RequestParam Long userId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Get owner
        User owner = userRepository.findById(userId).orElse(null);
        if (owner == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Get owner's bikes
        List<Bike> ownerBikes = bikeRepository.findByOwnerAndIsActiveTrue(owner);
        dashboard.put("totalBikes", ownerBikes.size());
        dashboard.put("availableBikes", ownerBikes.stream()
            .filter(b -> b.getStatus() == BikeStatus.AVAILABLE)
            .count());
        dashboard.put("bookedBikes", ownerBikes.stream()
            .filter(b -> b.getStatus() == BikeStatus.BOOKED)
            .count());
        
        // Get bookings for owner's bikes
        List<Booking> ownerBookings = bookingRepository.findAll().stream()
            .filter(booking -> ownerBikes.contains(booking.getBike()))
            .toList();
        dashboard.put("totalBookings", ownerBookings.size());
        dashboard.put("activeBookings", ownerBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.ACTIVE)
            .count());
        
        // Calculate earnings
        BigDecimal totalEarnings = ownerBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .map(Booking::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalEarnings", totalEarnings);
        
        return ResponseEntity.ok(dashboard);
    }

    // Rental Business Dashboard
    @GetMapping("/business")
    @PreAuthorize("hasRole('RENTAL_BUSINESS')")
    public ResponseEntity<Map<String, Object>> getBusinessDashboard(@RequestParam Long userId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Get business owner
        User businessOwner = userRepository.findById(userId).orElse(null);
        if (businessOwner == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Get business bikes
        List<Bike> businessBikes = bikeRepository.findByOwnerAndIsActiveTrue(businessOwner);
        dashboard.put("totalBikes", businessBikes.size());
        dashboard.put("availableBikes", businessBikes.stream()
            .filter(b -> b.getStatus() == BikeStatus.AVAILABLE)
            .count());
        dashboard.put("bookedBikes", businessBikes.stream()
            .filter(b -> b.getStatus() == BikeStatus.BOOKED)
            .count());
        
        // Get bookings for business bikes
        List<Booking> businessBookings = bookingRepository.findAll().stream()
            .filter(booking -> businessBikes.contains(booking.getBike()))
            .toList();
        dashboard.put("totalBookings", businessBookings.size());
        dashboard.put("activeBookings", businessBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.ACTIVE)
            .count());
        
        BigDecimal totalRevenue = businessBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .map(Booking::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(dashboard);
    }

    // Delivery Partner Dashboard
    @GetMapping("/partner")
    @PreAuthorize("hasRole('DELIVERY_PARTNER')")
    public ResponseEntity<Map<String, Object>> getPartnerDashboard(@RequestParam Long userId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Delivery partner specific data
        List<Booking> deliveryBookings = bookingRepository.findAll(); // This needs to be filtered by delivery partner
        dashboard.put("totalDeliveries", deliveryBookings.size());
        dashboard.put("pendingDeliveries", deliveryBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.PENDING)
            .count());
        dashboard.put("completedDeliveries", deliveryBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .count());
        
        // Calculate earnings (assuming delivery partners get a percentage)
        BigDecimal totalEarnings = deliveryBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .map(Booking::getTotalPrice)
            .map(price -> price.multiply(BigDecimal.valueOf(0.1))) // 10% commission
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalEarnings", totalEarnings);
        
        return ResponseEntity.ok(dashboard);
    }
}
