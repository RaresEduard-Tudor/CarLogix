-- CarLogix Database Schema
-- V1: Initial schema — Users, Vehicles, Diagnostic Logs

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255),
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);

CREATE TABLE vehicles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vin             VARCHAR(17),
    make            VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INTEGER      NOT NULL,
    color           VARCHAR(50),
    current_mileage INTEGER,
    license_plate   VARCHAR(20),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE diagnostic_logs (
    id              BIGSERIAL PRIMARY KEY,
    vehicle_id      BIGINT       NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    error_code      VARCHAR(10)  NOT NULL,
    definition      TEXT,
    suggested_fix   TEXT,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    mileage         INTEGER,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_active ON vehicles(user_id, is_active);
CREATE INDEX idx_diagnostic_logs_vehicle_id ON diagnostic_logs(vehicle_id);
CREATE INDEX idx_diagnostic_logs_status ON diagnostic_logs(status);
CREATE INDEX idx_diagnostic_logs_error_code ON diagnostic_logs(error_code);
