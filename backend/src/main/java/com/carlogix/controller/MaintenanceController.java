package com.carlogix.controller;

import com.carlogix.dto.MaintenanceRecordRequest;
import com.carlogix.dto.MaintenanceRecordResponse;
import com.carlogix.model.User;
import com.carlogix.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRecordResponse>> getMaintenanceRecords(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(maintenanceService.getUserMaintenanceRecords(user.getId()));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<MaintenanceRecordResponse>> getVehicleMaintenanceRecords(
            @PathVariable Long vehicleId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(maintenanceService.getVehicleMaintenanceRecords(vehicleId, user.getId()));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecordResponse> createMaintenanceRecord(
            @Valid @RequestBody MaintenanceRecordRequest request,
            @AuthenticationPrincipal User user) {
        MaintenanceRecordResponse response = maintenanceService.createMaintenanceRecord(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRecordResponse> updateMaintenanceRecord(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRecordRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(maintenanceService.updateMaintenanceRecord(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        maintenanceService.deleteMaintenanceRecord(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
