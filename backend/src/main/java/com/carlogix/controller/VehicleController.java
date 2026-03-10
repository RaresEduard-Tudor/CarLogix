package com.carlogix.controller;

import com.carlogix.dto.VehicleRequest;
import com.carlogix.dto.VehicleResponse;
import com.carlogix.model.User;
import com.carlogix.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getVehicles(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(vehicleService.getUserVehicles(user.getId()));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal User user) {
        VehicleResponse response = vehicleService.createVehicle(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        vehicleService.deleteVehicle(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
