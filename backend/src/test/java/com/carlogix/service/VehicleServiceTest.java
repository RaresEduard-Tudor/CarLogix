package com.carlogix.service;

import com.carlogix.dto.VehicleRequest;
import com.carlogix.dto.VehicleResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.User;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private User user;
    private VehicleRequest vehicleRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        vehicleRequest = new VehicleRequest();
        vehicleRequest.setMake("Toyota");
        vehicleRequest.setModel("Camry");
        vehicleRequest.setYear(2020);
        vehicleRequest.setVin("1HGBH41JXMN109186");
        vehicleRequest.setColor("Silver");
        vehicleRequest.setCurrentMileage(45000);
    }

    @Test
    void getUserVehicles_returnsList() {
        Vehicle vehicle = createVehicle(1L);
        when(vehicleRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(vehicle));

        List<VehicleResponse> result = vehicleService.getUserVehicles(1L);

        assertEquals(1, result.size());
        assertEquals("Toyota", result.get(0).getMake());
        assertEquals("Camry", result.get(0).getModel());
    }

    @Test
    void createVehicle_success() {
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> {
            Vehicle v = invocation.getArgument(0);
            v.setId(1L);
            return v;
        });

        VehicleResponse response = vehicleService.createVehicle(vehicleRequest, user);

        assertNotNull(response);
        assertEquals("Toyota", response.getMake());
        assertEquals("Camry", response.getModel());
        assertEquals(2020, response.getYear());
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_success() {
        Vehicle existing = createVehicle(1L);
        when(vehicleRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existing));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(existing);

        vehicleRequest.setMake("Honda");
        vehicleRequest.setModel("Accord");

        VehicleResponse response = vehicleService.updateVehicle(1L, vehicleRequest, 1L);

        assertNotNull(response);
        assertEquals("Honda", response.getMake());
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_notFound_throwsException() {
        when(vehicleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> vehicleService.updateVehicle(99L, vehicleRequest, 1L));
    }

    @Test
    void deleteVehicle_softDeletes() {
        Vehicle vehicle = createVehicle(1L);
        when(vehicleRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(vehicle));

        vehicleService.deleteVehicle(1L, 1L);

        assertFalse(vehicle.isActive());
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void deleteVehicle_notFound_throwsException() {
        when(vehicleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> vehicleService.deleteVehicle(99L, 1L));
    }

    private Vehicle createVehicle(Long id) {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(id);
        vehicle.setUser(user);
        vehicle.setMake("Toyota");
        vehicle.setModel("Camry");
        vehicle.setYear(2020);
        vehicle.setVin("1HGBH41JXMN109186");
        vehicle.setColor("Silver");
        vehicle.setCurrentMileage(45000);
        vehicle.setActive(true);
        return vehicle;
    }
}
