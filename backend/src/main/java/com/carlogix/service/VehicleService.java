package com.carlogix.service;

import com.carlogix.dto.VehicleRequest;
import com.carlogix.dto.VehicleResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.User;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<VehicleResponse> getUserVehicles(Long userId) {
        return vehicleRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .map(VehicleResponse::fromEntity)
                .toList();
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request, User user) {
        Vehicle vehicle = new Vehicle();
        vehicle.setUser(user);
        vehicle.setVin(request.getVin());
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setColor(request.getColor());
        vehicle.setCurrentMileage(request.getCurrentMileage());
        vehicle.setLicensePlate(request.getLicensePlate());

        vehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(vehicle);
    }

    @Transactional
    public VehicleResponse updateVehicle(Long vehicleId, VehicleRequest request, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        vehicle.setVin(request.getVin());
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setColor(request.getColor());
        vehicle.setCurrentMileage(request.getCurrentMileage());
        vehicle.setLicensePlate(request.getLicensePlate());

        vehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        vehicle.setActive(false);
        vehicleRepository.save(vehicle);
    }
}
