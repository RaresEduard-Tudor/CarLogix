package com.carlogix.repository;

import com.carlogix.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByUserIdAndActiveTrueOrderByCreatedAtDesc(Long userId);

    Optional<Vehicle> findByIdAndUserId(Long id, Long userId);
}
