package com.carlogix.service;

import com.carlogix.dto.DiagnosticLogRequest;
import com.carlogix.dto.DiagnosticLogResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.DiagnosticLog;
import com.carlogix.model.User;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.DiagnosticLogRepository;
import com.carlogix.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiagnosticServiceTest {

    @Mock
    private DiagnosticLogRepository diagnosticLogRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private Obd2LookupService obd2LookupService;

    @InjectMocks
    private DiagnosticService diagnosticService;

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

    // --- getUserDiagnostics ---

    @Test
    void getUserDiagnostics_returnsList() {
        DiagnosticLog log = createLog(1L, "P0300", DiagnosticLog.Status.ACTIVE);
        when(diagnosticLogRepository.findAllByUserId(1L)).thenReturn(List.of(log));

        List<DiagnosticLogResponse> result = diagnosticService.getUserDiagnostics(1L);

        assertEquals(1, result.size());
        assertEquals("P0300", result.get(0).getErrorCode());
    }

    @Test
    void getUserDiagnostics_emptyList() {
        when(diagnosticLogRepository.findAllByUserId(1L)).thenReturn(List.of());

        List<DiagnosticLogResponse> result = diagnosticService.getUserDiagnostics(1L);

        assertTrue(result.isEmpty());
    }

    // --- getVehicleDiagnostics ---

    @Test
    void getVehicleDiagnostics_returnsList() {
        when(vehicleRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(vehicle));
        DiagnosticLog log = createLog(1L, "P0171", DiagnosticLog.Status.ACTIVE);
        when(diagnosticLogRepository.findByVehicleIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(log));

        List<DiagnosticLogResponse> result = diagnosticService.getVehicleDiagnostics(10L, 1L);

        assertEquals(1, result.size());
        assertEquals("P0171", result.get(0).getErrorCode());
    }

    @Test
    void getVehicleDiagnostics_vehicleNotFound_throws() {
        when(vehicleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> diagnosticService.getVehicleDiagnostics(99L, 1L));
    }

    // --- createDiagnostic ---

    @Test
    void createDiagnostic_success_withObd2Lookup() {
        DiagnosticLogRequest request = new DiagnosticLogRequest();
        request.setVehicleId(10L);
        request.setErrorCode("P0300");
        request.setMileage(55000);

        when(vehicleRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(vehicle));
        when(obd2LookupService.lookupCode("P0300")).thenReturn(Map.of(
                "definition", "Random/Multiple Cylinder Misfire Detected",
                "suggestedFix", "Check spark plugs and ignition coils"
        ));
        when(diagnosticLogRepository.save(any(DiagnosticLog.class))).thenAnswer(invocation -> {
            DiagnosticLog saved = invocation.getArgument(0);
            saved.setId(1L);
            saved.setCreatedAt(Instant.now());
            return saved;
        });

        DiagnosticLogResponse response = diagnosticService.createDiagnostic(request, 1L);

        assertNotNull(response);
        assertEquals("P0300", response.getErrorCode());
        assertEquals("Random/Multiple Cylinder Misfire Detected", response.getDefinition());
        assertEquals("Check spark plugs and ignition coils", response.getSuggestedFix());
        assertEquals("ACTIVE", response.getStatus());
        assertEquals(55000, response.getMileage());
        verify(obd2LookupService).lookupCode("P0300");
    }

    @Test
    void createDiagnostic_vehicleNotFound_throws() {
        DiagnosticLogRequest request = new DiagnosticLogRequest();
        request.setVehicleId(99L);
        request.setErrorCode("P0300");

        when(vehicleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> diagnosticService.createDiagnostic(request, 1L));
        verify(diagnosticLogRepository, never()).save(any());
    }

    // --- resolveDiagnostic ---

    @Test
    void resolveDiagnostic_success() {
        DiagnosticLog log = createLog(5L, "P0420", DiagnosticLog.Status.ACTIVE);
        when(diagnosticLogRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(log));
        when(diagnosticLogRepository.save(any(DiagnosticLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DiagnosticLogResponse response = diagnosticService.resolveDiagnostic(5L, 1L);

        assertEquals("RESOLVED", response.getStatus());
        assertNotNull(response.getResolvedAt());
    }

    @Test
    void resolveDiagnostic_notFound_throws() {
        when(diagnosticLogRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> diagnosticService.resolveDiagnostic(99L, 1L));
        verify(diagnosticLogRepository, never()).save(any());
    }

    // --- helper ---

    private DiagnosticLog createLog(Long id, String code, DiagnosticLog.Status status) {
        DiagnosticLog log = new DiagnosticLog();
        log.setId(id);
        log.setVehicle(vehicle);
        log.setErrorCode(code);
        log.setDefinition("Test definition for " + code);
        log.setSuggestedFix("Test fix for " + code);
        log.setStatus(status);
        log.setMileage(50000);
        log.setCreatedAt(Instant.now());
        if (status == DiagnosticLog.Status.RESOLVED) {
            log.setResolvedAt(Instant.now());
        }
        return log;
    }
}
