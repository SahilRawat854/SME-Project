package com.spingo.bikerental.controller;

import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.BikeType;
import com.spingo.bikerental.BikeRepository;
import com.spingo.bikerental.dto.BikeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "*")
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    // Get all bikes (public access)
    @GetMapping
    public ResponseEntity<List<BikeDto>> getAllBikes() {
        try {
            List<Bike> bikes = bikeRepository.findByIsActiveTrue();
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get available bikes (public access)
    @GetMapping("/available")
    public ResponseEntity<List<BikeDto>> getAvailableBikes() {
        try {
            List<Bike> bikes = bikeRepository.findByIsActiveTrueAndStatus(BikeStatus.AVAILABLE);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get bike by ID (public access)
    @GetMapping("/{id}")
    public ResponseEntity<?> getBikeById(@PathVariable Long id) {
        try {
            Optional<Bike> bike = bikeRepository.findById(id);
            if (bike.isPresent()) {
                BikeDto bikeDto = new BikeDto(bike.get());
                return ResponseEntity.ok(bikeDto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to get bike: " + e.getMessage()));
        }
    }

    // Create new bike (Admin, Individual Owner, Rental Business only)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS')")
    public ResponseEntity<?> createBike(@Valid @RequestBody Bike bike) {
        try {
            Bike savedBike = bikeRepository.save(bike);
            return ResponseEntity.ok(savedBike);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to create bike: " + e.getMessage()));
        }
    }

    // Update bike (Admin, Individual Owner, Rental Business only)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INDIVIDUAL_OWNER', 'RENTAL_BUSINESS')")
    public ResponseEntity<?> updateBike(@PathVariable Long id, @Valid @RequestBody Bike bikeDetails) {
        try {
            Optional<Bike> bikeOptional = bikeRepository.findById(id);
            if (bikeOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Bike bike = bikeOptional.get();
            bike.setBrand(bikeDetails.getBrand());
            bike.setModel(bikeDetails.getModel());
            bike.setYear(bikeDetails.getYear());
            bike.setType(bikeDetails.getType());
            bike.setCity(bikeDetails.getCity());
            bike.setPricePerHour(bikeDetails.getPricePerHour());
            bike.setPricePerDay(bikeDetails.getPricePerDay());
            bike.setPricePerMonth(bikeDetails.getPricePerMonth());
            bike.setDescription(bikeDetails.getDescription());
            bike.setImageUrl(bikeDetails.getImageUrl());
            bike.setStatus(bikeDetails.getStatus());

            Bike updatedBike = bikeRepository.save(bike);
            return ResponseEntity.ok(updatedBike);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to update bike: " + e.getMessage()));
        }
    }

    // Delete bike (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBike(@PathVariable Long id) {
        if (!bikeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bikeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Get bikes by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BikeDto>> getBikesByStatus(@PathVariable BikeStatus status) {
        try {
            List<Bike> bikes = bikeRepository.findByStatus(status);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get bikes by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<BikeDto>> getBikesByType(@PathVariable BikeType type) {
        try {
            List<Bike> bikes = bikeRepository.findByType(type);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get bikes by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<BikeDto>> getBikesByCity(@PathVariable String city) {
        try {
            List<Bike> bikes = bikeRepository.findByCity(city);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get bikes by brand
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<BikeDto>> getBikesByBrand(@PathVariable String brand) {
        try {
            List<Bike> bikes = bikeRepository.findByBrand(brand);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Filter bikes with multiple criteria
    @GetMapping("/filter")
    public ResponseEntity<List<BikeDto>> filterBikes(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BikeType type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BikeStatus status) {
        
        try {
            List<Bike> bikes = bikeRepository.findBikesWithFilters(city, type, brand, status);
            List<BikeDto> bikeDtos = bikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Get popular bikes (public access)
    @GetMapping("/popular")
    public ResponseEntity<List<BikeDto>> getPopularBikes() {
        try {
            // Get first 3 available bikes as popular bikes
            List<Bike> popularBikes = bikeRepository.findByIsActiveTrueAndStatus(BikeStatus.AVAILABLE)
                    .stream()
                    .limit(3)
                    .toList();
            List<BikeDto> bikeDtos = popularBikes.stream()
                .map(BikeDto::new)
                .toList();
            return ResponseEntity.ok(bikeDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(List.of());
        }
    }

    // Check bike availability for specific time slot
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> checkBikeAvailability(
            @PathVariable Long id,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        Optional<Bike> bikeOptional = bikeRepository.findById(id);
        if (bikeOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Bike bike = bikeOptional.get();
        Map<String, Object> response = new HashMap<>();
        
        // Check if bike is available
        if (bike.getStatus() != BikeStatus.AVAILABLE) {
            response.put("available", false);
            response.put("reason", "Bike is currently " + bike.getStatus().name().toLowerCase());
            return ResponseEntity.ok(response);
        }
        
        // TODO: Add time slot conflict checking with booking repository
        response.put("available", true);
        response.put("bike", bike);
        
        return ResponseEntity.ok(response);
    }
}