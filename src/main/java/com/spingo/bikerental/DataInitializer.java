package com.spingo.bikerental;

import com.spingo.bikerental.*;
import com.spingo.bikerental.BikeRepository;
import com.spingo.bikerental.UserRepository;
import com.spingo.bikerental.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BikeRepository bikeRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeBikes();
        initializeBookings();
    }
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            // Admin User
            User admin = new User("Admin User", "admin@spingo.com", "9876543210", 
                passwordEncoder.encode("admin123"), UserRole.ADMIN, "Admin Office, Mumbai");
            userRepository.save(admin);
            
            // Customer Users
            User customer1 = new User("John Doe", "john@example.com", "9876543211", 
                passwordEncoder.encode("password123"), UserRole.CUSTOMER, "123 Main St, Delhi");
            userRepository.save(customer1);
            
            User customer2 = new User("Jane Smith", "jane@example.com", "9876543212", 
                passwordEncoder.encode("password123"), UserRole.CUSTOMER, "456 Park Ave, Bangalore");
            userRepository.save(customer2);
            
            User customer3 = new User("Alice Johnson", "alice@example.com", "9876543216", 
                passwordEncoder.encode("password123"), UserRole.CUSTOMER, "789 Pine St, Chennai");
            userRepository.save(customer3);
            
            // Individual Owner
            User owner = new User("Mike Johnson", "mike@example.com", "9876543213", 
                passwordEncoder.encode("password123"), UserRole.INDIVIDUAL_OWNER, "321 Elm St, Kolkata");
            userRepository.save(owner);
            
            // Rental Business
            User business = new User("Sarah Wilson", "sarah@example.com", "9876543214", 
                passwordEncoder.encode("password123"), UserRole.RENTAL_BUSINESS, "654 Maple Ave, Hyderabad");
            userRepository.save(business);
            
            // Delivery Partner
            User delivery = new User("Tom Brown", "tom@example.com", "9876543215", 
                passwordEncoder.encode("password123"), UserRole.DELIVERY_PARTNER, "987 Cedar St, Pune");
            userRepository.save(delivery);
            
            System.out.println("Users initialized successfully!");
        }
    }
    
    private void initializeBikes() {
        if (bikeRepository.count() == 0) {
            // Get owners for bike assignment
            User owner1 = userRepository.findByEmail("mike@example.com").orElse(null);
            User business1 = userRepository.findByEmail("sarah@example.com").orElse(null);
            
            // Honda Bikes
            Bike honda1 = new Bike("Honda", "CBR600RR", 2023, BikeType.SPORT, "Mumbai",
                new BigDecimal("500.00"), new BigDecimal("3000.00"), new BigDecimal("60000.00"),
                "High-performance sports bike perfect for city rides",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                owner1);
            bikeRepository.save(honda1);
            
            Bike honda2 = new Bike("Honda", "Shadow", 2023, BikeType.CRUISER, "Chennai",
                new BigDecimal("400.00"), new BigDecimal("2400.00"), new BigDecimal("48000.00"),
                "Classic cruiser for comfortable long rides",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                business1);
            bikeRepository.save(honda2);
            
            // Yamaha Bikes
            Bike yamaha1 = new Bike("Yamaha", "R1", 2023, BikeType.SPORT, "Delhi",
                new BigDecimal("600.00"), new BigDecimal("3600.00"), new BigDecimal("72000.00"),
                "Racing-inspired sport bike with advanced technology",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                owner1);
            bikeRepository.save(yamaha1);
            
            Bike yamaha2 = new Bike("Yamaha", "FZ", 2023, BikeType.SPORT, "Bangalore",
                new BigDecimal("350.00"), new BigDecimal("2100.00"), new BigDecimal("42000.00"),
                "Stylish and efficient city bike",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                business1);
            bikeRepository.save(yamaha2);
            
            // Kawasaki Bikes
            Bike kawasaki1 = new Bike("Kawasaki", "Ninja", 2023, BikeType.SPORT, "Mumbai",
                new BigDecimal("550.00"), new BigDecimal("3300.00"), new BigDecimal("66000.00"),
                "Legendary Ninja series for adrenaline seekers",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                owner1);
            bikeRepository.save(kawasaki1);
            
            Bike kawasaki2 = new Bike("Kawasaki", "Vulcan", 2023, BikeType.CRUISER, "Chennai",
                new BigDecimal("450.00"), new BigDecimal("2700.00"), new BigDecimal("54000.00"),
                "Powerful cruiser for long-distance touring",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                business1);
            bikeRepository.save(kawasaki2);
            
            // Ducati Bikes
            Bike ducati1 = new Bike("Ducati", "Panigale", 2023, BikeType.SPORT, "Delhi",
                new BigDecimal("800.00"), new BigDecimal("4800.00"), new BigDecimal("96000.00"),
                "Italian masterpiece with unmatched performance",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                owner1);
            bikeRepository.save(ducati1);
            
            Bike ducati2 = new Bike("Ducati", "Monster", 2023, BikeType.SPORT, "Bangalore",
                new BigDecimal("700.00"), new BigDecimal("4200.00"), new BigDecimal("84000.00"),
                "Iconic naked bike with raw power",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                business1);
            bikeRepository.save(ducati2);
            
            // BMW Bikes
            Bike bmw1 = new Bike("BMW", "S1000RR", 2023, BikeType.SPORT, "Mumbai",
                new BigDecimal("900.00"), new BigDecimal("5400.00"), new BigDecimal("108000.00"),
                "German engineering meets racing performance",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                owner1);
            bikeRepository.save(bmw1);
            
            Bike bmw2 = new Bike("BMW", "R1200GS", 2023, BikeType.TOURING, "Chennai",
                new BigDecimal("750.00"), new BigDecimal("4500.00"), new BigDecimal("90000.00"),
                "Adventure touring bike for any terrain",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&crop=center",
                business1);
            bikeRepository.save(bmw2);
            
            System.out.println("Bikes initialized successfully!");
        }
    }
    
    private void initializeBookings() {
        if (bookingRepository.count() == 0) {
            // Get users and bikes for creating bookings
            User customer1 = userRepository.findByEmail("john@example.com").orElse(null);
            User customer2 = userRepository.findByEmail("jane@example.com").orElse(null);
            
            Bike bike1 = bikeRepository.findAll().get(0);
            Bike bike2 = bikeRepository.findAll().get(1);
            
            if (customer1 != null && bike1 != null) {
                // Create sample booking 1
                Booking booking1 = new Booking();
                booking1.setUser(customer1);
                booking1.setBike(bike1);
                booking1.setPickupDate(LocalDateTime.now().plusDays(1));
                booking1.setDropoffDate(LocalDateTime.now().plusDays(2));
                booking1.setPickupTime("09:00");
                booking1.setDropTime("18:00");
                booking1.setTotalPrice(new BigDecimal("4500.00")); // 9 hours * 500
                booking1.setStatus(BookingStatus.PENDING);
                bookingRepository.save(booking1);
            }
            
            if (customer2 != null && bike2 != null) {
                // Create sample booking 2
                Booking booking2 = new Booking();
                booking2.setUser(customer2);
                booking2.setBike(bike2);
                booking2.setPickupDate(LocalDateTime.now().plusDays(3));
                booking2.setDropoffDate(LocalDateTime.now().plusDays(4));
                booking2.setPickupTime("10:00");
                booking2.setDropTime("16:00");
                booking2.setTotalPrice(new BigDecimal("2400.00")); // 6 hours * 400
                booking2.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking2);
            }
            
            System.out.println("Bookings initialized successfully!");
        }
    }
}