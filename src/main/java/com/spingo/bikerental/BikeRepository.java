package com.spingo.bikerental;

import com.spingo.bikerental.Bike;
import com.spingo.bikerental.BikeStatus;
import com.spingo.bikerental.BikeType;
import com.spingo.bikerental.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    
    List<Bike> findByIsActiveTrue();
    
    List<Bike> findByStatus(BikeStatus status);
    
    List<Bike> findByType(BikeType type);
    
    List<Bike> findByCity(String city);
    
    List<Bike> findByBrand(String brand);
    
    List<Bike> findByIsActiveTrueAndStatus(BikeStatus status);
    
    List<Bike> findByIsActiveTrueAndCity(String city);
    
    List<Bike> findByIsActiveTrueAndType(BikeType type);
    
    List<Bike> findByOwner(User owner);
    
    List<Bike> findByOwnerAndIsActiveTrue(User owner);
    
    @Query("SELECT b FROM Bike b WHERE b.isActive = true AND " +
           "(:city IS NULL OR b.city = :city) AND " +
           "(:type IS NULL OR b.type = :type) AND " +
           "(:brand IS NULL OR b.brand = :brand) AND " +
           "(:status IS NULL OR b.status = :status)")
    List<Bike> findBikesWithFilters(@Param("city") String city,
                                   @Param("type") BikeType type,
                                   @Param("brand") String brand,
                                   @Param("status") BikeStatus status);
    
    @Query("SELECT b FROM Bike b WHERE b.isActive = true AND " +
           "(:city IS NULL OR b.city = :city) AND " +
           "(:type IS NULL OR b.type = :type) AND " +
           "(:brand IS NULL OR b.brand = :brand) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:owner IS NULL OR b.owner = :owner)")
    List<Bike> findBikesWithFiltersAndOwner(@Param("city") String city,
                                           @Param("type") BikeType type,
                                           @Param("brand") String brand,
                                           @Param("status") BikeStatus status,
                                           @Param("owner") User owner);
}
