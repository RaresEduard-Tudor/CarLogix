package com.carlogix.dto;

import com.carlogix.model.Vehicle;

import java.time.Instant;

public class VehicleResponse {

    private Long id;
    private String vin;
    private String make;
    private String model;
    private Integer year;
    private String color;
    private Integer currentMileage;
    private String licensePlate;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;

    public static VehicleResponse fromEntity(Vehicle v) {
        VehicleResponse dto = new VehicleResponse();
        dto.setId(v.getId());
        dto.setVin(v.getVin());
        dto.setMake(v.getMake());
        dto.setModel(v.getModel());
        dto.setYear(v.getYear());
        dto.setColor(v.getColor());
        dto.setCurrentMileage(v.getCurrentMileage());
        dto.setLicensePlate(v.getLicensePlate());
        dto.setActive(v.isActive());
        dto.setCreatedAt(v.getCreatedAt());
        dto.setUpdatedAt(v.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Integer getCurrentMileage() { return currentMileage; }
    public void setCurrentMileage(Integer currentMileage) { this.currentMileage = currentMileage; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
