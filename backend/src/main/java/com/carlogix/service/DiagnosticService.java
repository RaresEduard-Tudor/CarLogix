package com.carlogix.service;

import com.carlogix.dto.DiagnosticLogRequest;
import com.carlogix.dto.DiagnosticLogResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.DiagnosticLog;
import com.carlogix.model.Vehicle;
import com.carlogix.repository.DiagnosticLogRepository;
import com.carlogix.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class DiagnosticService {

    private final DiagnosticLogRepository diagnosticLogRepository;
    private final VehicleRepository vehicleRepository;
    private final Obd2LookupService obd2LookupService;

    public DiagnosticService(DiagnosticLogRepository diagnosticLogRepository,
                             VehicleRepository vehicleRepository,
                             Obd2LookupService obd2LookupService) {
        this.diagnosticLogRepository = diagnosticLogRepository;
        this.vehicleRepository = vehicleRepository;
        this.obd2LookupService = obd2LookupService;
    }

    public List<DiagnosticLogResponse> getUserDiagnostics(Long userId) {
        return diagnosticLogRepository.findAllByUserId(userId)
                .stream()
                .map(DiagnosticLogResponse::fromEntity)
                .toList();
    }

    public List<DiagnosticLogResponse> getVehicleDiagnostics(Long vehicleId, Long userId) {
        // Verify the vehicle belongs to the user
        vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        return diagnosticLogRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId)
                .stream()
                .map(DiagnosticLogResponse::fromEntity)
                .toList();
    }

    /**
     * Creates a diagnostic log and auto-populates definition + suggested fix
     * from the OBD-II SQLite database (shared with the MCP server).
     */
    @Transactional
    public DiagnosticLogResponse createDiagnostic(DiagnosticLogRequest request, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        // The Pro Move: auto-populate from OBD2 database
        Map<String, String> codeInfo = obd2LookupService.lookupCode(request.getErrorCode());

        DiagnosticLog log = new DiagnosticLog();
        log.setVehicle(vehicle);
        log.setErrorCode(request.getErrorCode().toUpperCase());
        log.setDefinition(codeInfo.get("definition"));
        log.setSuggestedFix(codeInfo.get("suggestedFix"));
        log.setMileage(request.getMileage());
        log.setStatus(DiagnosticLog.Status.ACTIVE);

        log = diagnosticLogRepository.save(log);
        return DiagnosticLogResponse.fromEntity(log);
    }

    @Transactional
    public DiagnosticLogResponse resolveDiagnostic(Long logId, Long userId) {
        DiagnosticLog log = diagnosticLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic log not found"));

        log.setStatus(DiagnosticLog.Status.RESOLVED);
        log.setResolvedAt(Instant.now());
        log = diagnosticLogRepository.save(log);
        return DiagnosticLogResponse.fromEntity(log);
    }
}
