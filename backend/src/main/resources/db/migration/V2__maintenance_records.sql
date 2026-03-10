-- V2: Maintenance Records table

CREATE TABLE maintenance_records (
    id                          BIGSERIAL PRIMARY KEY,
    vehicle_id                  BIGINT       NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type                VARCHAR(100) NOT NULL,
    description                 TEXT,
    mileage                     INTEGER,
    service_date                DATE         NOT NULL,
    cost                        DECIMAL(10,2) DEFAULT 0,
    location                    VARCHAR(255),
    notes                       TEXT,
    reminder_mileage_interval   INTEGER,
    reminder_time_interval      INTEGER,
    reminder_time_unit          VARCHAR(20),
    created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_records_vehicle_id ON maintenance_records(vehicle_id);
