package com.spingo.bikerental;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - allow all static files and HTML pages
                .requestMatchers("/", "/login", "/signup", "/error", "/health").permitAll()
                .requestMatchers("/*.html", "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
                .requestMatchers("/bikes.html", "/booking.html", "/dashboard.html", "/admin-dashboard.html", 
                                "/individual-owner-dashboard.html", "/rental-business-dashboard.html", 
                                "/delivery-dashboard.html", "/booking-confirmation.html", "/cart.html", 
                                "/payment.html", "/reviews.html", "/documents.html", "/about.html", 
                                "/contact.html", "/pricing.html", "/check.html").permitAll()

                // API endpoints - authentication and public access (MUST BE FIRST)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                
                // Public bike browsing endpoints (MUST BE BEFORE CRUD)
                .requestMatchers("/api/bikes/popular").permitAll()
                .requestMatchers("/api/bikes/available").permitAll()
                .requestMatchers("/api/bikes/filter").permitAll()
                .requestMatchers("/api/bikes/*/availability").permitAll()
                .requestMatchers("/api/bikes/status/**").permitAll()
                .requestMatchers("/api/bikes/type/**").permitAll()
                .requestMatchers("/api/bikes/city/**").permitAll()
                .requestMatchers("/api/bikes/brand/**").permitAll()
                .requestMatchers("/api/bikes/*").permitAll() // GET bike by ID
                .requestMatchers("/api/bikes").permitAll() // GET all bikes
                
                // Protected bike CRUD operations (POST, PUT, DELETE)
                .requestMatchers("POST", "/api/bikes").hasAnyRole("ADMIN", "INDIVIDUAL_OWNER", "RENTAL_BUSINESS")
                .requestMatchers("PUT", "/api/bikes/**").hasAnyRole("ADMIN", "INDIVIDUAL_OWNER", "RENTAL_BUSINESS")
                .requestMatchers("DELETE", "/api/bikes/**").hasAnyRole("ADMIN", "INDIVIDUAL_OWNER", "RENTAL_BUSINESS")
                
                // API endpoints - role-based access
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/bookings/**").hasAnyRole("CUSTOMER", "ADMIN", "INDIVIDUAL_OWNER", "RENTAL_BUSINESS", "DELIVERY_PARTNER")
                .requestMatchers("/api/dashboard/customer").hasRole("CUSTOMER")
                .requestMatchers("/api/dashboard/admin").hasRole("ADMIN")
                .requestMatchers("/api/dashboard/owner").hasRole("INDIVIDUAL_OWNER")
                .requestMatchers("/api/dashboard/business").hasRole("RENTAL_BUSINESS")
                .requestMatchers("/api/dashboard/partner").hasRole("DELIVERY_PARTNER")
                .requestMatchers("/api/users/**").authenticated()

                // Any other request must be authenticated
                .anyRequest().authenticated()
            );

        // Add JWT filter before default authentication
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
