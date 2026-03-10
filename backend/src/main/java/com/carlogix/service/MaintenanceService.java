package com.carlogix.service;

import com.carlogix.dto.MaintenanceRecordRequest;
import com.carlogix.dto.MaintenanceRecordResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.MaintenanceRecord;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.MaintenanceRecordRepository;
import com.carlogix.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRecordRepository maintenanceRepository,
                              VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponse> getUserMaintenanceRecords(Long userId) {
        return maintenanceRepository.findAllByUserId(userId)
                .stream().map(MaintenanceRecordResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponse> getVehicleMaintenanceRecords(Long vehicleId, Long userId) {
        vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        return maintenanceRepository.findByVehicleIdOrderByServiceDateDesc(vehicleId)
                .stream().map(MaintenanceRecordResponse::fromEntity).toList();
    }

    @Transactional
    public MaintenanceRecordResponse createMaintenanceRecord(MaintenanceRecordRequest request, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicle(vehicle);
        record.setServiceType(request.getServiceType());
        record.setDescription(request.getDescription());
        record.setMileage(request.getMileage());
        record.setServiceDate(LocalDate.parse(request.getDate()));
        record.setCost(request.getCost() != null ? request.getCost() : BigDecimal.ZERO);
        record.setLocation(request.getLocation());
        record.setNotes(request.getNotes());
        record.setReminderMileageInterval(request.getReminderMileageInterval());
        record.setReminderTimeInterval(request.getReminderTimeInterval());
        record.setReminderTimeUnit(request.getReminderTimeUnit());
        record = maintenanceRepository.save(record);
        return MaintenanceRecordResponse.fromEntity(record);
    }

    @Transactional
    public MaintenanceRecordResponse updateMaintenanceRecord(Long recordId, MaintenanceRecordRequest request, Long userId) {
        MaintenanceRecord record = maintenanceRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found"));

        record.setServiceType(request.getServiceType());
        record.setDescription(request.getDescription());
        record.setMileage(request.getMileage());
        record.setServiceDate(LocalDate.parse(request.getDate()));
        record.setCost(request.getCost() != null ? request.getCost() : BigDecimal.ZERO);
        record.setLocation(request.getLocation());
        record.setNotes(request.getNotes());
        record.setReminderMileageInterval(request.getReminderMileageInterval());
        record.setReminderTimeInterval(request.getReminderTimeInterval());
        record.setReminderTimeUnit(request.getReminderTimeUnit());
        record = maintenanceRepository.save(record);
        return MaintenanceRecordResponse.fromEntity(record);
    }

    @Transactional
    public void deleteMaintenanceRecord(Long recordId, Long userId) {
        MaintenanceRecord record = maintenanceRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found"));
        maintenanceRepository.delete(record);
    }
}
