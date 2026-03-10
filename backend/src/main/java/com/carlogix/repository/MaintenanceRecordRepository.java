package com.carlogix.repository;

import com.carlogix.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    @Query("SELECT m FROM MaintenanceRecord m JOIN m.vehicle v WHERE v.user.id = :userId ORDER BY m.serviceDate DESC")
    List<MaintenanceRecord> findAllByUserId(@Param("userId") Long userId);

    List<MaintenanceRecord> findByVehicleIdOrderByServiceDateDesc(Long vehicleId);

    @Query("SELECT m FROM MaintenanceRecord m JOIN m.vehicle v WHERE m.id = :id AND v.user.id = :userId")
    Optional<MaintenanceRecord> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
