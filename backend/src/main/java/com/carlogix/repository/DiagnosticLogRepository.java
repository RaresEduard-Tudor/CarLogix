package com.carlogix.repository;

import com.carlogix.model.DiagnosticLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DiagnosticLogRepository extends JpaRepository<DiagnosticLog, Long> {

    @Query("SELECT d FROM DiagnosticLog d JOIN d.vehicle v WHERE v.user.id = :userId ORDER BY d.createdAt DESC")
    List<DiagnosticLog> findAllByUserId(@Param("userId") Long userId);

    List<DiagnosticLog> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId);

    @Query("SELECT d FROM DiagnosticLog d JOIN d.vehicle v WHERE d.id = :id AND v.user.id = :userId")
    Optional<DiagnosticLog> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
