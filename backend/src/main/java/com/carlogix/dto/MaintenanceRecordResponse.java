package com.carlogix.dto;

import com.carlogix.model.MaintenanceRecord;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class MaintenanceRecordResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private String serviceType;
    private String description;
    private Integer mileage;
    private LocalDate date;
    private BigDecimal cost;
    private String location;
    private String notes;
    private Integer reminderMileageInterval;
    private Integer reminderTimeInterval;
    private String reminderTimeUnit;
    private Instant createdAt;
    private Instant updatedAt;

    public static MaintenanceRecordResponse fromEntity(MaintenanceRecord r) {
        MaintenanceRecordResponse dto = new MaintenanceRecordResponse();
        dto.setId(r.getId());
        dto.setVehicleId(r.getVehicle().getId());
        dto.setVehicleName(r.getVehicle().getYear() + " "
                + r.getVehicle().getMake() + " "
                + r.getVehicle().getModel());
        dto.setServiceType(r.getServiceType());
        dto.setDescription(r.getDescription());
        dto.setMileage(r.getMileage());
        dto.setDate(r.getServiceDate());
        dto.setCost(r.getCost());
        dto.setLocation(r.getLocation());
        dto.setNotes(r.getNotes());
        dto.setReminderMileageInterval(r.getReminderMileageInterval());
        dto.setReminderTimeInterval(r.getReminderTimeInterval());
        dto.setReminderTimeUnit(r.getReminderTimeUnit());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getReminderMileageInterval() { return reminderMileageInterval; }
    public void setReminderMileageInterval(Integer i) { this.reminderMileageInterval = i; }
    public Integer getReminderTimeInterval() { return reminderTimeInterval; }
    public void setReminderTimeInterval(Integer i) { this.reminderTimeInterval = i; }
    public String getReminderTimeUnit() { return reminderTimeUnit; }
    public void setReminderTimeUnit(String u) { this.reminderTimeUnit = u; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
