package com.carlogix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class MaintenanceRecordRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    private String description;
    private Integer mileage;

    @NotBlank(message = "Date is required")
    private String date;

    private BigDecimal cost;
    private String location;
    private String notes;
    private Integer reminderMileageInterval;
    private Integer reminderTimeInterval;
    private String reminderTimeUnit;

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getReminderMileageInterval() { return reminderMileageInterval; }
    public void setReminderMileageInterval(Integer reminderMileageInterval) { this.reminderMileageInterval = reminderMileageInterval; }
    public Integer getReminderTimeInterval() { return reminderTimeInterval; }
    public void setReminderTimeInterval(Integer reminderTimeInterval) { this.reminderTimeInterval = reminderTimeInterval; }
    public String getReminderTimeUnit() { return reminderTimeUnit; }
    public void setReminderTimeUnit(String reminderTimeUnit) { this.reminderTimeUnit = reminderTimeUnit; }
}
