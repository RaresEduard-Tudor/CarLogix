package com.carlogix.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 * Reads the OBD-II SQLite database (shared with the MCP server)
 * to auto-populate diagnostic code definitions and suggested fixes.
 */
@Service
public class Obd2LookupService {

    private static final Logger log = LoggerFactory.getLogger(Obd2LookupService.class);

    private final String dbPath;

    public Obd2LookupService(@Value("${carlogix.obd2.database-path}") String dbPath) {
        this.dbPath = dbPath;
    }

    /**
     * Looks up an OBD-II error code in the SQLite database.
     *
     * @param code The DTC code (e.g. "P0300")
     * @return Map with "definition" and "suggestedFix" keys, or defaults if not found
     */
    public Map<String, String> lookupCode(String code) {
        String url = "jdbc:sqlite:" + dbPath;
        String sql = "SELECT description, suggested_fix FROM dtc_codes WHERE code = ? LIMIT 1";

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, code.toUpperCase());
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return Map.of(
                        "definition", rs.getString("description"),
                        "suggestedFix", rs.getString("suggested_fix")
                );
            }
        } catch (SQLException e) {
            log.warn("OBD2 database lookup failed for code {}: {}", code, e.getMessage());
        }

        return Map.of(
                "definition", "Unknown code: " + code,
                "suggestedFix", "Consult a professional mechanic"
        );
    }
}
