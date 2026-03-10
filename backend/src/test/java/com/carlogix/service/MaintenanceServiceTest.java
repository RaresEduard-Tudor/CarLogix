package com.carlogix.service;

import com.carlogix.dto.MaintenanceRecordRequest;
import com.carlogix.dto.MaintenanceRecordResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.MaintenanceRecord;
import com.carlogix.model.User;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.MaintenanceRecordRepository;
import com.carlogix.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaintenanceServiceTest {

    @Mock
    private MaintenanceRecordRepository maintenanceRecordRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private MaintenanceService maintenanceService;

    private User user;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        vehicle = new Vehicle();
        vehicle.setId(10L);
        vehicle.setUser(user);
        vehicle.setMake("Toyota");
        vehicle.setModel("Camry");
        vehicle.setYear(2020);
    }

    @Test
    void getUserMaintenanceRecords_returnsList() {
        MaintenanceRecord record = buildRecord(1L);
        when(maintenanceRecordRepository.findAllByUserId(1L)).thenReturn(List.of(record));

        List<MaintenanceRecordResponse> result = maintenanceService.getUserMaintenanceRecords(1L);

        assertEquals(1, result.size());
        assertEquals("Oil Change", result.get(0).getServiceType());
    }

    @Test
    void createMaintenanceRecord_success() {
        MaintenanceRecordRequest request = new MaintenanceRecordRequest();
        request.setVehicleId(10L);
        request.setServiceType("Oil Change");
        request.setDate("2024-10-01");
        request.setCost(new BigDecimal("89.99"));

        when(vehicleRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(vehicle));
        when(maintenanceRecordRepository.save(any(MaintenanceRecord.class))).thenAnswer(invocation -> {
            MaintenanceRecord r = invocation.getArgument(0);
            r.setId(1L);
            return r;
        });

        MaintenanceRecordResponse response = maintenanceService.createMaintenanceRecord(request, user);

        assertNotNull(response);
        assertEquals("Oil Change", response.getServiceType());
        verify(maintenanceRecordRepository).save(any(MaintenanceRecord.class));
    }

    @Test
    void createMaintenanceRecord_vehicleNotFound_throws() {
        MaintenanceRecordRequest request = new MaintenanceRecordRequest();
        request.setVehicleId(99L);
        request.setServiceType("Oil Change");
        request.setDate("2024-10-01");

        when(vehicleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> maintenanceService.createMaintenanceRecord(request, user));
    }

    @Test
    void deleteMaintenanceRecord_success() {
        MaintenanceRecord record = buildRecord(1L);
        when(maintenanceRecordRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(record));

        maintenanceService.deleteMaintenanceRecord(1L, 1L);

        verify(maintenanceRecordRepository).delete(record);
    }

    @Test
    void deleteMaintenanceRecord_notFound_throws() {
        when(maintenanceRecordRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> maintenanceService.deleteMaintenanceRecord(99L, 1L));
    }

    private MaintenanceRecord buildRecord(Long id) {
        MaintenanceRecord record = new MaintenanceRecord();
        record.setId(id);
        record.setVehicle(vehicle);
        record.setServiceType("Oil Change");
        record.setDescription("Regular oil change");
        record.setMileage(45000);
        record.setServiceDate(LocalDate.of(2024, 10, 1));
        record.setCost(new BigDecimal("89.99"));
        return record;
    }
}
