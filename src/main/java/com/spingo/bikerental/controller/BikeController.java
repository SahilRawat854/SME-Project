package com.spingo.bikerental.controller;

import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeRepository;
import com.spingo.bikerental.User;
import com.spingo.bikerental.UserRepository;
import com.spingo.bikerental.dto.CreateBikeRequest;
import com.spingo.bikerental.dto.CreateBikeResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "*")
public class BikeController {
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> createBike(@Valid @RequestBody CreateBikeRequest createBikeRequest) {
        try {
            // Create new bike entity
            Bike bike = new Bike();
            bike.setBrand(createBikeRequest.getBrand());
            bike.setModel(createBikeRequest.getModel());
            bike.setYear(createBikeRequest.getYear());
            bike.setType(createBikeRequest.getType());
            bike.setCity(createBikeRequest.getCity());
            bike.setPricePerHour(createBikeRequest.getPricePerHour());
            bike.setPricePerDay(createBikeRequest.getPricePerDay());
            bike.setPricePerMonth(createBikeRequest.getPricePerMonth());
            bike.setDescription(createBikeRequest.getDescription());
            bike.setImageUrl(createBikeRequest.getImageUrl());
            
            // Set default values
            bike.setIsActive(true);
            
            // Save bike to database
            Bike savedBike = bikeRepository.save(bike);
            
            // Create success response
            CreateBikeResponse response = new CreateBikeResponse(
                savedBike, 
                "Bike created successfully!", 
                true
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CreateBikeResponse(false, "Failed to create bike. Please try again later."));
        }
    }
    
    @PostMapping("/owner")
    public ResponseEntity<?> createBikeForOwner(@Valid @RequestBody CreateBikeRequest createBikeRequest,
                                               @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from token (simplified - in production use JWT)
            Long ownerId = extractUserIdFromToken(authHeader);
            if (ownerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CreateBikeResponse(false, "Invalid authentication token."));
            }
            
            // Find owner user
            Optional<User> ownerOptional = userRepository.findById(ownerId);
            if (ownerOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CreateBikeResponse(false, "Owner not found."));
            }
            
            User owner = ownerOptional.get();
            
            // Create new bike entity
            Bike bike = new Bike();
            bike.setBrand(createBikeRequest.getBrand());
            bike.setModel(createBikeRequest.getModel());
            bike.setYear(createBikeRequest.getYear());
            bike.setType(createBikeRequest.getType());
            bike.setCity(createBikeRequest.getCity());
            bike.setPricePerHour(createBikeRequest.getPricePerHour());
            bike.setPricePerDay(createBikeRequest.getPricePerDay());
            bike.setPricePerMonth(createBikeRequest.getPricePerMonth());
            bike.setDescription(createBikeRequest.getDescription());
            bike.setImageUrl(createBikeRequest.getImageUrl());
            bike.setOwner(owner);
            
            // Set default values
            bike.setIsActive(true);
            
            // Save bike to database
            Bike savedBike = bikeRepository.save(bike);
            
            // Create success response
            CreateBikeResponse response = new CreateBikeResponse(
                savedBike, 
                "Bike added successfully!", 
                true
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CreateBikeResponse(false, "Failed to add bike. Please try again later."));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllBikes() {
        try {
            List<Bike> bikes = bikeRepository.findByIsActiveTrue();
            return ResponseEntity.ok(bikes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch bikes"));
        }
    }
    
    @GetMapping("/owner")
    public ResponseEntity<?> getOwnerBikes(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from token
            Long ownerId = extractUserIdFromToken(authHeader);
            if (ownerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid authentication token"));
            }
            
            // Find owner user
            Optional<User> ownerOptional = userRepository.findById(ownerId);
            if (ownerOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Owner not found"));
            }
            
            User owner = ownerOptional.get();
            List<Bike> bikes = bikeRepository.findByOwnerAndIsActiveTrue(owner);
            
            return ResponseEntity.ok(bikes);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch owner bikes"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBikeById(@PathVariable Long id) {
        try {
            Optional<Bike> bikeOptional = bikeRepository.findById(id);
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Bike not found"));
            }
            
            Bike bike = bikeOptional.get();
            return ResponseEntity.ok(bike);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch bike"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBike(@PathVariable Long id, 
                                       @Valid @RequestBody CreateBikeRequest updateRequest,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from token
            Long ownerId = extractUserIdFromToken(authHeader);
            if (ownerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CreateBikeResponse(false, "Invalid authentication token."));
            }
            
            // Find bike
            Optional<Bike> bikeOptional = bikeRepository.findById(id);
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CreateBikeResponse(false, "Bike not found."));
            }
            
            Bike bike = bikeOptional.get();
            
            // Check if user owns this bike
            if (bike.getOwner() == null || !bike.getOwner().getId().equals(ownerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new CreateBikeResponse(false, "You don't have permission to update this bike."));
            }
            
            // Update bike fields
            bike.setBrand(updateRequest.getBrand());
            bike.setModel(updateRequest.getModel());
            bike.setYear(updateRequest.getYear());
            bike.setType(updateRequest.getType());
            bike.setCity(updateRequest.getCity());
            bike.setPricePerHour(updateRequest.getPricePerHour());
            bike.setPricePerDay(updateRequest.getPricePerDay());
            bike.setPricePerMonth(updateRequest.getPricePerMonth());
            bike.setDescription(updateRequest.getDescription());
            bike.setImageUrl(updateRequest.getImageUrl());
            
            // Save updated bike
            Bike updatedBike = bikeRepository.save(bike);
            
            // Create success response
            CreateBikeResponse response = new CreateBikeResponse(
                updatedBike, 
                "Bike updated successfully!", 
                true
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CreateBikeResponse(false, "Failed to update bike. Please try again later."));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBikeStatus(@PathVariable Long id,
                                             @RequestBody Map<String, String> statusRequest,
                                             @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from token
            Long ownerId = extractUserIdFromToken(authHeader);
            if (ownerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid authentication token"));
            }
            
            // Find bike
            Optional<Bike> bikeOptional = bikeRepository.findById(id);
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Bike not found"));
            }
            
            Bike bike = bikeOptional.get();
            
            // Check if user owns this bike
            if (bike.getOwner() == null || !bike.getOwner().getId().equals(ownerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to update this bike"));
            }
            
            // Update status
            String newStatus = statusRequest.get("status");
            if (newStatus != null) {
                try {
                    bike.setStatus(com.spingo.bikerental.BikeStatus.valueOf(newStatus));
                    bikeRepository.save(bike);
                    return ResponseEntity.ok(Map.of("message", "Bike status updated successfully"));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid status value"));
                }
            }
            
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Status is required"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update bike status"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(@PathVariable Long id,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from token
            Long ownerId = extractUserIdFromToken(authHeader);
            if (ownerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid authentication token"));
            }
            
            // Find bike
            Optional<Bike> bikeOptional = bikeRepository.findById(id);
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Bike not found"));
            }
            
            Bike bike = bikeOptional.get();
            
            // Check if user owns this bike
            if (bike.getOwner() == null || !bike.getOwner().getId().equals(ownerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to delete this bike"));
            }
            
            // Soft delete by setting isActive to false
            bike.setIsActive(false);
            bikeRepository.save(bike);
            
            return ResponseEntity.ok(Map.of("message", "Bike deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete bike"));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "bike-service"));
    }
    
    // Helper method to extract user ID from token (simplified implementation)
    private Long extractUserIdFromToken(String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Simple token parsing - in production, use proper JWT parsing
                if (token.startsWith("token_")) {
                    String[] parts = token.split("_");
                    if (parts.length >= 2) {
                        return Long.parseLong(parts[1]);
                    }
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}