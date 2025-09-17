package com.spingo.bikerental.controller;

import com.spingo.bikerental.Booking;
import com.spingo.bikerental.BookingRepository;
import com.spingo.bikerental.BookingStatus;
import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeRepository;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.User;
import com.spingo.bikerental.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all bookings (logged-in users only)
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return ResponseEntity.ok(bookings);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Create new booking
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        try {
            // Validate user exists
            Optional<User> userOptional = userRepository.findById(bookingRequest.getUserId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found with ID: " + bookingRequest.getUserId()));
            }

            // Validate bike exists and is available
            Optional<Bike> bikeOptional = bikeRepository.findById(bookingRequest.getBikeId());
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Bike not found with ID: " + bookingRequest.getBikeId()));
            }

            Bike bike = bikeOptional.get();
            if (bike.getStatus() != BikeStatus.AVAILABLE) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Bike is not available. Current status: " + bike.getStatus()));
            }

            // Validate dates
            if (bookingRequest.getPickupDate() == null || bookingRequest.getDropoffDate() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Pickup and dropoff dates are required"));
            }

            if (bookingRequest.getPickupDate().isAfter(bookingRequest.getDropoffDate())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Pickup date cannot be after dropoff date"));
            }

            // Calculate total price based on time difference
            BigDecimal totalPrice = calculateTotalPrice(
                bookingRequest.getPickupDate(),
                bookingRequest.getDropoffDate(),
                bike.getPricePerHour()
            );

            // Create booking
            Booking booking = new Booking();
            booking.setUser(userOptional.get());
            booking.setBike(bike);
            booking.setPickupDate(bookingRequest.getPickupDate());
            booking.setDropoffDate(bookingRequest.getDropoffDate());
            booking.setPickupTime(bookingRequest.getPickupTime());
            booking.setDropTime(bookingRequest.getDropTime());
            booking.setTotalPrice(totalPrice);
            booking.setStatus(BookingStatus.PENDING);

            // Update bike status to BOOKED
            bike.setStatus(BikeStatus.BOOKED);
            bikeRepository.save(bike);

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to create booking: " + e.getMessage()));
        }
    }

    // Update booking
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest bookingRequest) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = bookingOptional.get();
        
        // Update fields
        booking.setPickupDate(bookingRequest.getPickupDate());
        booking.setDropoffDate(bookingRequest.getDropoffDate());
        booking.setPickupTime(bookingRequest.getPickupTime());
        booking.setDropTime(bookingRequest.getDropTime());
        
        // Recalculate total price
        BigDecimal totalPrice = calculateTotalPrice(
            bookingRequest.getPickupDate(),
            bookingRequest.getDropoffDate(),
            booking.getBike().getPricePerHour()
        );
        booking.setTotalPrice(totalPrice);

        Booking updatedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(updatedBooking);
    }

    // Cancel booking
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = bookingOptional.get();
        booking.setStatus(BookingStatus.CANCELLED);

        // Update bike status back to AVAILABLE
        Bike bike = booking.getBike();
        bike.setStatus(BikeStatus.AVAILABLE);
        bikeRepository.save(bike);

        Booking updatedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(updatedBooking);
    }

    // Get bookings by user ID
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by bike ID
    @GetMapping("/bike/{bikeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<List<Booking>> getBookingsByBikeId(@PathVariable Long bikeId) {
        List<Booking> bookings = bookingRepository.findByBikeId(bikeId);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS', 'DELIVERY_PARTNER')")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingRepository.findByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    // Helper method to calculate total price
    private BigDecimal calculateTotalPrice(LocalDateTime pickupDate, LocalDateTime dropoffDate, BigDecimal pricePerHour) {
        long hours = ChronoUnit.HOURS.between(pickupDate, dropoffDate);
        if (hours <= 0) {
            hours = 1; // Minimum 1 hour
        }
        return pricePerHour.multiply(BigDecimal.valueOf(hours));
    }

    // DTO for booking requests
    public static class BookingRequest {
        private Long userId;
        private Long bikeId;
        private LocalDateTime pickupDate;
        private LocalDateTime dropoffDate;
        private String pickupTime;
        private String dropTime;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getBikeId() { return bikeId; }
        public void setBikeId(Long bikeId) { this.bikeId = bikeId; }
        
        public LocalDateTime getPickupDate() { return pickupDate; }
        public void setPickupDate(LocalDateTime pickupDate) { this.pickupDate = pickupDate; }
        
        public LocalDateTime getDropoffDate() { return dropoffDate; }
        public void setDropoffDate(LocalDateTime dropoffDate) { this.dropoffDate = dropoffDate; }
        
        public String getPickupTime() { return pickupTime; }
        public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }
        
        public String getDropTime() { return dropTime; }
        public void setDropTime(String dropTime) { this.dropTime = dropTime; }
    }
}
