package com.spingo.bikerental.controller;

import com.spingo.bikerental.User;
import com.spingo.bikerental.UserRole;
import com.spingo.bikerental.UserRepository;
import com.spingo.bikerental.JwtUtil;
import com.spingo.bikerental.LoginRequest;
import com.spingo.bikerental.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validate role
            UserRole requestedRole;
            try {
                requestedRole = UserRole.valueOf(loginRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid role: " + loginRequest.getRole()));
            }
            
            // Find user by email
            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found with email: " + loginRequest.getEmail()));
            }
            
            // Check if role matches
            if (!user.getRole().equals(requestedRole)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Role mismatch. Expected: " + requestedRole + ", but user has: " + user.getRole()));
            }
            
            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = jwtUtil.generateToken(user);
            
            // Create response
            LoginResponse response = new LoginResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid credentials: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is already taken!"));
            }
            
            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save user
            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "SpinGo Bike Rental API");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
