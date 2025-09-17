package com.spingo.bikerental;

import com.spingo.bikerental.Booking;
import com.spingo.bikerental.BookingStatus;
import com.spingo.bikerental.User;
import com.spingo.bikerental.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByBikeId(Long bikeId);
    
    @Query("SELECT b FROM Booking b WHERE b.pickupDate BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.bike.id = :bikeId AND " +
           "((b.pickupDate <= :endDate AND b.dropoffDate >= :startDate) OR " +
           "(b.actualPickupDate <= :endDate AND b.actualDropoffDate >= :startDate)) AND " +
           "b.status IN ('CONFIRMED', 'ACTIVE')")
    List<Booking> findConflictingBookings(@Param("bikeId") Long bikeId,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
}
