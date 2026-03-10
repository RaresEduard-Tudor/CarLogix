package com.carlogix.controller;

import com.carlogix.dto.DiagnosticLogRequest;
import com.carlogix.dto.DiagnosticLogResponse;
import com.carlogix.model.User;
import com.carlogix.service.DiagnosticService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagnostics")
public class DiagnosticController {

    private final DiagnosticService diagnosticService;

    public DiagnosticController(DiagnosticService diagnosticService) {
        this.diagnosticService = diagnosticService;
    }

    @GetMapping
    public ResponseEntity<List<DiagnosticLogResponse>> getDiagnostics(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diagnosticService.getUserDiagnostics(user.getId()));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<DiagnosticLogResponse>> getVehicleDiagnostics(
            @PathVariable Long vehicleId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diagnosticService.getVehicleDiagnostics(vehicleId, user.getId()));
    }

    @PostMapping
    public ResponseEntity<DiagnosticLogResponse> createDiagnostic(
            @Valid @RequestBody DiagnosticLogRequest request,
            @AuthenticationPrincipal User user) {
        DiagnosticLogResponse response = diagnosticService.createDiagnostic(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<DiagnosticLogResponse> resolveDiagnostic(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diagnosticService.resolveDiagnostic(id, user.getId()));
    }
}
