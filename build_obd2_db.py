"""
Build the OBD-II DTC (Diagnostic Trouble Code) SQLite database.
Run once: python build_obd2_db.py
Produces: obd2_codes.db
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "obd2_codes.db")

# Comprehensive DTC codes with descriptions and suggested fixes
DTC_CODES = [
    # Powertrain — Fuel & Air Metering
    ("P0100", "Mass or Volume Air Flow Circuit Malfunction",
     "Check MAF sensor connector and wiring. Clean MAF sensor with MAF cleaner spray. Replace MAF sensor if cleaning doesn't help."),
    ("P0101", "Mass or Volume Air Flow Circuit Range/Performance",
     "Inspect air filter for blockage. Check for vacuum leaks. Clean or replace MAF sensor."),
    ("P0102", "Mass or Volume Air Flow Circuit Low Input",
     "Check MAF sensor wiring for open/short. Inspect connector pins. Replace MAF sensor if wiring is OK."),
    ("P0103", "Mass or Volume Air Flow Circuit High Input",
     "Check MAF sensor wiring for short to voltage. Inspect connector. Replace MAF sensor."),
    ("P0110", "Intake Air Temperature Circuit Malfunction",
     "Check IAT sensor connector and wiring. Test sensor resistance. Replace IAT sensor if out of spec."),
    ("P0115", "Engine Coolant Temperature Circuit Malfunction",
     "Check ECT sensor connector. Verify coolant level. Test sensor resistance vs temperature. Replace if faulty."),
    ("P0120", "Throttle Position Sensor/Switch A Circuit Malfunction",
     "Inspect TPS connector and wiring. Check for corrosion. Adjust or replace TPS."),
    ("P0121", "Throttle Position Sensor/Switch A Circuit Range/Performance",
     "Check TPS for smooth voltage transition. Inspect wiring. Replace TPS if erratic readings."),
    ("P0125", "Insufficient Coolant Temperature for Closed Loop Fuel Control",
     "Check thermostat operation (may be stuck open). Verify ECT sensor. Check cooling system for leaks."),
    ("P0128", "Coolant Thermostat Below Operating Temperature",
     "Replace thermostat (likely stuck open). Check ECT sensor reading. Verify cooling fan isn't running constantly."),
    ("P0130", "O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)",
     "Check O2 sensor wiring and connector. Inspect for exhaust leaks near sensor. Replace O2 sensor."),
    ("P0131", "O2 Sensor Circuit Low Voltage (Bank 1 Sensor 1)",
     "Check for vacuum leaks. Inspect O2 sensor wiring. Check fuel pressure. Replace O2 sensor if wiring OK."),
    ("P0133", "O2 Sensor Circuit Slow Response (Bank 1 Sensor 1)",
     "Replace O2 sensor. Check for exhaust leaks. Inspect fuel injectors for proper operation."),
    ("P0135", "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 1)",
     "Check O2 sensor heater fuse. Inspect wiring to heater circuit. Replace O2 sensor."),
    ("P0136", "O2 Sensor Circuit Malfunction (Bank 1 Sensor 2)",
     "Inspect downstream O2 sensor wiring. Check for exhaust leaks after catalytic converter. Replace sensor."),
    ("P0141", "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 2)",
     "Check heater fuse and relay. Inspect wiring. Replace downstream O2 sensor."),
    ("P0150", "O2 Sensor Circuit Malfunction (Bank 2 Sensor 1)",
     "Check Bank 2 upstream O2 sensor wiring. Inspect for exhaust leaks. Replace O2 sensor."),
    ("P0155", "O2 Sensor Heater Circuit Malfunction (Bank 2 Sensor 1)",
     "Check heater circuit fuse. Inspect wiring for Bank 2 sensor 1. Replace O2 sensor."),
    ("P0171", "System Too Lean (Bank 1)",
     "Check for vacuum leaks (intake manifold gaskets, hoses). Inspect MAF sensor. Check fuel pressure. Clean fuel injectors. Inspect PCV valve."),
    ("P0172", "System Too Rich (Bank 1)",
     "Check for leaking fuel injectors. Inspect MAF sensor (dirty reads too low). Check fuel pressure regulator. Inspect EVAP purge valve."),
    ("P0174", "System Too Lean (Bank 2)",
     "Check for vacuum leaks on Bank 2 side. Inspect intake manifold gaskets. Check MAF sensor and fuel pressure."),
    ("P0175", "System Too Rich (Bank 2)",
     "Check Bank 2 fuel injectors for leaks. Inspect MAF sensor. Check fuel pressure regulator."),

    # Powertrain — Ignition System
    ("P0300", "Random/Multiple Cylinder Misfire Detected",
     "Check spark plugs and ignition coils. Inspect fuel injectors. Check compression. Look for vacuum leaks. May indicate head gasket issue if coolant is low."),
    ("P0301", "Cylinder 1 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 1. Swap coil with another cylinder to confirm. Check injector and compression."),
    ("P0302", "Cylinder 2 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 2. Swap coil to confirm. Check injector and compression."),
    ("P0303", "Cylinder 3 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 3. Swap coil to confirm. Check injector and compression."),
    ("P0304", "Cylinder 4 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 4. Swap coil to confirm. Check injector and compression."),
    ("P0305", "Cylinder 5 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 5. Swap coil to confirm. Check injector and compression."),
    ("P0306", "Cylinder 6 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 6. Swap coil to confirm. Check injector and compression."),
    ("P0307", "Cylinder 7 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 7. Swap coil to confirm. Check injector and compression."),
    ("P0308", "Cylinder 8 Misfire Detected",
     "Replace spark plug and ignition coil for cylinder 8. Swap coil to confirm. Check injector and compression."),
    ("P0325", "Knock Sensor 1 Circuit Malfunction",
     "Check knock sensor wiring and connector. Inspect for engine mechanical noise. Replace knock sensor."),
    ("P0335", "Crankshaft Position Sensor A Circuit Malfunction",
     "Inspect CKP sensor connector and wiring. Check sensor air gap. Check reluctor wheel for damage. Replace CKP sensor."),
    ("P0340", "Camshaft Position Sensor A Circuit Malfunction",
     "Check CMP sensor connector and wiring. Inspect timing chain/belt for wear. Replace CMP sensor."),
    ("P0341", "Camshaft Position Sensor A Circuit Range/Performance",
     "Check timing chain/belt tension and alignment. Inspect CMP sensor. Check valve timing."),

    # Powertrain — Emission Controls
    ("P0400", "Exhaust Gas Recirculation Flow Malfunction",
     "Clean EGR valve and passages. Check EGR vacuum lines. Test EGR valve diaphragm. Replace EGR valve if stuck."),
    ("P0401", "Exhaust Gas Recirculation Flow Insufficient",
     "Clean carbon buildup from EGR valve and intake passages. Check EGR vacuum supply. Replace EGR valve."),
    ("P0402", "Exhaust Gas Recirculation Flow Excessive",
     "Check EGR valve for stuck-open condition. Inspect vacuum lines for leaks. Replace EGR valve."),
    ("P0411", "Secondary Air Injection System Incorrect Flow",
     "Check AIR pump operation. Inspect check valves and hoses. Check AIR pump relay and fuse."),
    ("P0420", "Catalyst System Efficiency Below Threshold (Bank 1)",
     "May need catalytic converter replacement. First check for exhaust leaks. Verify O2 sensors are functioning. Check for engine misfire or rich condition causing cat damage."),
    ("P0421", "Warm Up Catalyst Efficiency Below Threshold (Bank 1)",
     "Check for exhaust leaks before and after catalytic converter. Inspect O2 sensors. Consider catalytic converter replacement."),
    ("P0430", "Catalyst System Efficiency Below Threshold (Bank 2)",
     "May need Bank 2 catalytic converter replacement. Check O2 sensors. Inspect for exhaust leaks. Fix any underlying misfire/rich condition."),
    ("P0440", "Evaporative Emission Control System Malfunction",
     "Check gas cap seal. Inspect EVAP canister and hoses. Check purge and vent solenoids. Smoke test EVAP system."),
    ("P0441", "Evaporative Emission Control System Incorrect Purge Flow",
     "Check EVAP purge solenoid operation. Inspect vacuum hoses. Check EVAP canister."),
    ("P0442", "Evaporative Emission Control System Leak Detected (Small Leak)",
     "Tighten or replace gas cap. Smoke test EVAP system for small leaks. Inspect EVAP hoses and connections."),
    ("P0443", "Evaporative Emission Control System Purge Control Valve Circuit",
     "Check purge valve connector and wiring. Test purge solenoid. Replace purge valve."),
    ("P0446", "Evaporative Emission Control System Vent Control Circuit",
     "Check vent valve connector and wiring. Test vent solenoid. Inspect EVAP canister."),
    ("P0449", "Evaporative Emission Control System Vent Valve/Solenoid Circuit",
     "Check vent valve wiring. Test solenoid operation. Replace vent solenoid."),
    ("P0455", "Evaporative Emission Control System Leak Detected (Gross Leak)",
     "Check gas cap (replace if worn). Inspect EVAP hoses for cracks or disconnections. Smoke test system. Check purge and vent valves."),
    ("P0456", "Evaporative Emission Control System Leak Detected (Very Small Leak)",
     "Replace gas cap first. Smoke test EVAP system. Inspect all EVAP connections and hoses for micro-cracks."),

    # Powertrain — Vehicle Speed & Idle Control
    ("P0500", "Vehicle Speed Sensor Malfunction",
     "Check VSS connector and wiring. Inspect sensor for damage. Check speedometer operation. Replace VSS."),
    ("P0505", "Idle Control System Malfunction",
     "Clean throttle body and idle air control valve. Check for vacuum leaks. Reset idle adaptation. Replace IACV if needed."),
    ("P0506", "Idle Control System RPM Lower Than Expected",
     "Clean throttle body. Check for vacuum leaks. Inspect IAC valve. Check for carbon buildup on throttle plate."),
    ("P0507", "Idle Control System RPM Higher Than Expected",
     "Check for vacuum leaks. Clean IAC valve and throttle body. Inspect PCV system. Check for unmetered air."),

    # Powertrain — Transmission
    ("P0700", "Transmission Control System Malfunction",
     "Scan for additional transmission codes. Check transmission fluid level and condition. Inspect wiring. May need transmission service."),
    ("P0710", "Transmission Fluid Temperature Sensor Circuit Malfunction",
     "Check TFT sensor connector. Inspect wiring. Check transmission fluid level. Replace TFT sensor."),
    ("P0715", "Input/Turbine Speed Sensor Circuit Malfunction",
     "Check speed sensor connector and wiring. Inspect sensor for contamination. Replace input speed sensor."),
    ("P0720", "Output Speed Sensor Circuit Malfunction",
     "Check OSS connector and wiring. Inspect sensor. Replace output speed sensor."),
    ("P0730", "Incorrect Gear Ratio",
     "Check transmission fluid level and condition. Inspect shift solenoids. May indicate internal transmission wear. Service or rebuild transmission."),
    ("P0740", "Torque Converter Clutch Circuit Malfunction",
     "Check TCC solenoid wiring. Inspect transmission fluid. Replace TCC solenoid. May need torque converter replacement."),
    ("P0741", "Torque Converter Clutch Circuit Performance/Stuck Off",
     "Check TCC solenoid. Inspect wiring. Change transmission fluid and filter. May need torque converter replacement."),
    ("P0750", "Shift Solenoid A Malfunction",
     "Check shift solenoid A wiring. Change transmission fluid. Replace shift solenoid A. Internal transmission repair may be needed."),
    ("P0755", "Shift Solenoid B Malfunction",
     "Check shift solenoid B wiring. Change transmission fluid. Replace shift solenoid B."),

    # Body Codes
    ("B0001", "Driver Frontal Stage 1 Deployment Control",
     "Airbag system malfunction. DO NOT attempt DIY repair. Have system inspected by qualified technician immediately."),
    ("B0100", "Electronic Frontal Sensor 1 Malfunction",
     "Check frontal crash sensor wiring. Inspect sensor mounting. Have airbag system diagnosed by a professional."),
    ("B1000", "ECU Malfunction (Body Control Module)",
     "Check BCM power and ground connections. Inspect wiring harness. May need BCM reprogramming or replacement."),
    ("B1200", "Climate Control Malfunction",
     "Check climate control panel connections. Inspect blend door actuator. Check A/C compressor operation."),
    ("B1318", "Battery Voltage Low",
     "Test battery and charging system. Check alternator output. Inspect battery terminals for corrosion. Replace battery if needed."),
    ("B1325", "Battery Voltage Out of Range",
     "Test alternator voltage output (should be 13.5-14.5V). Check battery condition. Inspect charging system wiring."),

    # Chassis Codes
    ("C0035", "Left Front Wheel Speed Sensor Circuit Malfunction",
     "Check wheel speed sensor wiring and connector. Inspect sensor air gap. Clean sensor tip. Replace wheel speed sensor."),
    ("C0040", "Right Front Wheel Speed Sensor Circuit Malfunction",
     "Check RF wheel speed sensor wiring. Inspect sensor and tone ring. Replace sensor if faulty."),
    ("C0045", "Left Rear Wheel Speed Sensor Circuit Malfunction",
     "Check LR wheel speed sensor wiring. Inspect sensor and tone ring. Replace sensor if faulty."),
    ("C0050", "Right Rear Wheel Speed Sensor Circuit Malfunction",
     "Check RR wheel speed sensor wiring. Inspect sensor and tone ring. Replace sensor if faulty."),
    ("C0060", "Left Front ABS Solenoid 1 Circuit Malfunction",
     "Check ABS hydraulic unit connector. Inspect wiring. ABS module may need replacement. Professional diagnosis recommended."),
    ("C0242", "PCM Indicated Traction Control Malfunction",
     "Scan for engine codes (traction control relies on engine management). Check wheel speed sensors. Inspect traction control switch."),
    ("C0300", "Rear Speed Sensor Malfunction",
     "Inspect rear wheel speed sensor wiring. Check sensor gap. Clean sensor. Replace if damaged."),

    # Network / Communication Codes
    ("U0001", "High Speed CAN Communication Bus",
     "Check CAN bus wiring for shorts or opens. Inspect CAN bus termination resistors. Check for water intrusion in connectors."),
    ("U0073", "Control Module Communication Bus Off",
     "Check CAN bus wiring. Inspect battery voltage. Look for faulty control module pulling bus down. Check grounds."),
    ("U0100", "Lost Communication with ECM/PCM",
     "Check ECM power supply and grounds. Inspect CAN bus wiring to ECM. Check for blown fuses. ECM may need replacement."),
    ("U0101", "Lost Communication with TCM",
     "Check TCM power and ground connections. Inspect CAN bus wiring to transmission module. Check transmission fuses."),
    ("U0121", "Lost Communication with Anti-Lock Brake System Module",
     "Check ABS module power and ground. Inspect CAN bus connection to ABS module. Check ABS fuse."),
    ("U0140", "Lost Communication with Body Control Module",
     "Check BCM power supply and grounds. Inspect CAN bus wiring. Check for water damage to BCM."),
    ("U0155", "Lost Communication with Instrument Panel Cluster",
     "Check instrument cluster connections. Inspect CAN bus wiring behind dash. Check cluster power and ground."),

    # Additional common Powertrain codes
    ("P0010", "Intake Camshaft Position Actuator Circuit (Bank 1)",
     "Check VVT solenoid connector and wiring. Change engine oil (dirty oil causes VVT issues). Replace VVT solenoid."),
    ("P0011", "Intake Camshaft Position Timing Over-Advanced (Bank 1)",
     "Change engine oil and filter. Check oil level. Inspect VVT solenoid. Check timing chain stretch."),
    ("P0012", "Intake Camshaft Position Timing Over-Retarded (Bank 1)",
     "Change engine oil. Check VVT solenoid for sticking. Inspect timing chain and tensioner."),
    ("P0013", "Exhaust Camshaft Position Actuator Circuit (Bank 1)",
     "Check exhaust VVT solenoid connector. Change engine oil. Replace exhaust VVT solenoid."),
    ("P0014", "Exhaust Camshaft Position Timing Over-Advanced (Bank 1)",
     "Change engine oil. Check exhaust VVT solenoid. Inspect timing chain components."),
    ("P0016", "Crankshaft Position - Camshaft Position Correlation (Bank 1 Sensor A)",
     "Check timing chain/belt alignment and tension. Inspect VVT system. Check CKP and CMP sensor signals."),
    ("P0017", "Crankshaft Position - Camshaft Position Correlation (Bank 1 Sensor B)",
     "Check timing chain/belt alignment. Inspect exhaust VVT actuator. Verify CKP and CMP sensors."),
    ("P0030", "HO2S Heater Control Circuit (Bank 1 Sensor 1)",
     "Check O2 sensor heater fuse and relay. Inspect heater circuit wiring. Replace O2 sensor."),
    ("P0036", "HO2S Heater Control Circuit (Bank 1 Sensor 2)",
     "Check downstream O2 sensor heater circuit. Inspect fuse and wiring. Replace O2 sensor."),
    ("P0191", "Fuel Rail Pressure Sensor Circuit Range/Performance",
     "Check fuel rail pressure sensor connector. Inspect fuel pressure. Check for fuel system restrictions. Replace sensor."),
    ("P0192", "Fuel Rail Pressure Sensor Circuit Low Input",
     "Check fuel rail pressure sensor wiring for open. Inspect connector. Check fuel pump pressure. Replace sensor."),
    ("P0193", "Fuel Rail Pressure Sensor Circuit High Input",
     "Check sensor wiring for short to voltage. Inspect fuel pressure. Replace fuel rail pressure sensor."),
    ("P0200", "Injector Circuit Malfunction",
     "Check all fuel injector connectors and wiring. Test injector resistance. Inspect PCM injector driver circuits."),
    ("P0201", "Injector Circuit Malfunction - Cylinder 1",
     "Check cylinder 1 injector connector and wiring. Test injector resistance (should be 11-18 ohms typically). Replace injector."),
    ("P0217", "Engine Overtemperature Condition",
     "Check coolant level immediately. Inspect thermostat, water pump, radiator. Check cooling fans. Do NOT continue driving."),
    ("P0218", "Transmission Over Temperature Condition",
     "Check transmission fluid level and condition. Inspect transmission cooler and lines. Service transmission."),
    ("P0230", "Fuel Pump Primary Circuit Malfunction",
     "Check fuel pump fuse and relay. Inspect fuel pump wiring. Test fuel pump operation. Replace fuel pump relay or pump."),
    ("P0299", "Turbo/Supercharger Underboost Condition",
     "Check boost pressure hoses for leaks. Inspect wastegate operation. Check intercooler for leaks. Inspect turbo for shaft play."),
    ("P0351", "Ignition Coil A Primary/Secondary Circuit Malfunction",
     "Check ignition coil A connector and wiring. Swap coil to another cylinder to confirm. Replace ignition coil."),
    ("P0352", "Ignition Coil B Primary/Secondary Circuit Malfunction",
     "Check ignition coil B connector and wiring. Swap coil to confirm. Replace ignition coil."),
    ("P0353", "Ignition Coil C Primary/Secondary Circuit Malfunction",
     "Check ignition coil C connector and wiring. Swap coil to confirm. Replace ignition coil."),
    ("P0354", "Ignition Coil D Primary/Secondary Circuit Malfunction",
     "Check ignition coil D connector and wiring. Swap coil to confirm. Replace ignition coil."),
    ("P0412", "Secondary Air Injection System Switching Valve A Circuit",
     "Check secondary air injection switching valve wiring. Test valve operation. Replace valve if faulty."),
    ("P0460", "Fuel Level Sensor Circuit Malfunction",
     "Check fuel level sender connector in fuel tank. Inspect wiring. Replace fuel level sender unit."),
    ("P0461", "Fuel Level Sensor Circuit Range/Performance",
     "Check fuel level sender for sticking float. Inspect wiring. Replace fuel level sender."),
    ("P0480", "Cooling Fan 1 Control Circuit Malfunction",
     "Check cooling fan fuse and relay. Inspect fan motor connector. Test fan motor. Replace fan relay or motor."),
    ("P0481", "Cooling Fan 2 Control Circuit Malfunction",
     "Check secondary cooling fan fuse and relay. Inspect wiring. Test fan motor. Replace as needed."),
    ("P0562", "System Voltage Low",
     "Test battery and alternator. Check battery terminals. Inspect charging system wiring. Replace battery or alternator as needed."),
    ("P0563", "System Voltage High",
     "Test alternator voltage regulator. Check for loose connections. Replace alternator if overcharging. Check battery condition."),
    ("P0600", "Serial Communication Link Malfunction",
     "Check ECU power and ground connections. Inspect internal ECU wiring. May need ECU reprogramming or replacement."),
    ("P0601", "Internal Control Module Memory Check Sum Error",
     "Try clearing code and retesting. Check ECU power supply. ECU may need reprogramming or replacement."),
    ("P1000", "OBD Systems Readiness Test Not Complete",
     "Not a fault — drive cycle not completed. Complete drive cycle per manufacturer specifications. All monitors will eventually run."),
    ("P1101", "Intake Airflow System Performance",
     "Check air filter. Inspect MAF sensor. Look for vacuum leaks. Clean throttle body."),
    ("P1131", "Lack of Upstream Heated Oxygen Sensor Switch - Lean (Bank 1)",
     "Check for vacuum leaks. Inspect fuel pressure. Check O2 sensor operation. Replace O2 sensor if needed."),
    ("P1151", "Lack of Upstream Heated Oxygen Sensor Switch - Lean (Bank 2)",
     "Check for vacuum leaks on Bank 2. Inspect fuel pressure and injectors. Replace O2 sensor if needed."),
    ("P2096", "Post Catalyst Fuel Trim System Too Lean (Bank 1)",
     "Check for exhaust leaks before downstream O2 sensor. Inspect catalytic converter. Check upstream fuel trims."),
    ("P2097", "Post Catalyst Fuel Trim System Too Rich (Bank 1)",
     "Check for exhaust leaks. Inspect catalytic converter. Verify upstream O2 sensor readings. Check fuel injectors."),
    ("P2101", "Throttle Actuator Control Motor Circuit Range/Performance",
     "Clean throttle body. Check electronic throttle body connector. Reset throttle adaptation. Replace throttle body if needed."),
    ("P2106", "Throttle Actuator Control System - Forced Limited Power",
     "Check throttle body connector and wiring. Inspect accelerator pedal position sensor. Clear code and test drive."),
    ("P2135", "Throttle/Pedal Position Sensor/Switch A/B Voltage Correlation",
     "Check throttle body and accelerator pedal sensor connectors. Inspect wiring. Replace throttle body assembly."),
    ("P2138", "Throttle/Pedal Position Sensor/Switch D/E Voltage Correlation",
     "Inspect accelerator pedal position sensor connector. Check wiring for damage. Replace pedal position sensor assembly."),
    ("P2195", "O2 Sensor Signal Stuck Lean (Bank 1 Sensor 1)",
     "Check for vacuum leaks. Inspect fuel delivery system. Check for exhaust leaks before O2 sensor. Replace O2 sensor."),
    ("P2197", "O2 Sensor Signal Stuck Lean (Bank 2 Sensor 1)",
     "Check for vacuum leaks on Bank 2. Inspect fuel system. Check for exhaust leaks. Replace O2 sensor."),
    ("P2270", "O2 Sensor Signal Stuck Lean (Bank 1 Sensor 2)",
     "Check catalytic converter efficiency. Inspect downstream O2 sensor. Check for exhaust leaks after catalyst."),
    ("P2279", "Intake Air System Leak",
     "Check all intake ducting from air filter to throttle body. Inspect vacuum hoses. Check intake manifold gaskets."),
]


def build_database():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE dtc_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            suggested_fix TEXT NOT NULL,
            category TEXT,
            severity TEXT
        )
    """)

    cursor.execute("CREATE INDEX idx_dtc_code ON dtc_codes(code)")

    for code, description, fix in DTC_CODES:
        # Derive category from code prefix
        prefix = code[0]
        categories = {"P": "Powertrain", "B": "Body", "C": "Chassis", "U": "Network"}
        category = categories.get(prefix, "Unknown")

        # Derive severity from description keywords
        severity = "Medium"
        high_keywords = ["overtemperature", "over temperature", "deployment", "malfunction indicator",
                         "misfire", "do not", "immediately"]
        low_keywords = ["readiness", "not complete", "small leak", "very small"]
        desc_lower = description.lower() + " " + fix.lower()
        if any(kw in desc_lower for kw in high_keywords):
            severity = "High"
        elif any(kw in desc_lower for kw in low_keywords):
            severity = "Low"

        cursor.execute(
            "INSERT INTO dtc_codes (code, description, suggested_fix, category, severity) VALUES (?, ?, ?, ?, ?)",
            (code, description, fix, category, severity),
        )

    conn.commit()
    count = cursor.execute("SELECT COUNT(*) FROM dtc_codes").fetchone()[0]
    conn.close()
    print(f"Built OBD-II database: {DB_PATH} ({count} codes)")


if __name__ == "__main__":
    build_database()
