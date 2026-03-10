package com.carlogix.dto;

import com.carlogix.model.DiagnosticLog;

import java.time.Instant;

public class DiagnosticLogResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private String errorCode;
    private String definition;
    private String suggestedFix;
    private String status;
    private Integer mileage;
    private Instant createdAt;
    private Instant resolvedAt;

    public static DiagnosticLogResponse fromEntity(DiagnosticLog log) {
        DiagnosticLogResponse dto = new DiagnosticLogResponse();
        dto.setId(log.getId());
        dto.setVehicleId(log.getVehicle().getId());
        dto.setVehicleName(log.getVehicle().getYear() + " "
                + log.getVehicle().getMake() + " "
                + log.getVehicle().getModel());
        dto.setErrorCode(log.getErrorCode());
        dto.setDefinition(log.getDefinition());
        dto.setSuggestedFix(log.getSuggestedFix());
        dto.setStatus(log.getStatus().name());
        dto.setMileage(log.getMileage());
        dto.setCreatedAt(log.getCreatedAt());
        dto.setResolvedAt(log.getResolvedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }

    public String getSuggestedFix() { return suggestedFix; }
    public void setSuggestedFix(String suggestedFix) { this.suggestedFix = suggestedFix; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
}
