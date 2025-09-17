package com.spingo.bikerental.controller;

import com.spingo.bikerental.User;
import com.spingo.bikerental.UserRepository;
import com.spingo.bikerental.UserRole;
import com.spingo.bikerental.dto.LoginRequest;
import com.spingo.bikerental.dto.LoginResponse;
import com.spingo.bikerental.dto.SignupRequest;
import com.spingo.bikerental.dto.SignupResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new SignupResponse(false, "Email is already registered. Please use a different email address."));
            }
            
            // Validate terms acceptance
            if (!signupRequest.isTermsAccepted()) {
                return ResponseEntity.badRequest()
                    .body(new SignupResponse(false, "You must accept the terms and conditions to create an account."));
            }
            
            // Create new user
            User user = new User();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPhone(signupRequest.getPhone());
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setRole(signupRequest.getUserRole());
            user.setAddress(signupRequest.getAddress());
            user.setIsActive(true);
            
            // Save user to database
            User savedUser = userRepository.save(user);
            
            // Create success response
            SignupResponse response = new SignupResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole(),
                savedUser.getAddress(),
                savedUser.getIsActive(),
                "Account created successfully! You can now login with your credentials.",
                true
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SignupResponse(false, "Failed to create account. Please try again later."));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid email or password."));
            }
            
            User user = userOptional.get();
            
            // Check if user is active
            if (!user.getIsActive()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Your account has been deactivated. Please contact support."));
            }
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid email or password."));
            }
            
            // Verify role matches
            if (!user.getRole().name().equals(loginRequest.getRole())) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid role selected. Please select the correct role for your account."));
            }
            
            // Generate a simple token (in production, use JWT)
            String token = "token_" + user.getId() + "_" + System.currentTimeMillis();
            
            // Create success response
            LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAddress(),
                user.getIsActive(),
                "Login successful!",
                true
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(false, "Login failed. Please try again later."));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
    }
    
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@PathVariable String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}