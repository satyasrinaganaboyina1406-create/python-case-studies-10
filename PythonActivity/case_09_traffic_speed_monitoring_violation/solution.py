#!/usr/bin/env python3
"""
Case Study 09: Intelligent Highway Speed Radar & Traffic Violation Dispatcher
Author: Student (PythonActivity Repository)
Purpose: Analyzes radar velocity, applies statutory sensor calibration buffers,
         determines progressive fines, allocates demerit points, and dispatches notices.
"""

from typing import Dict, Optional, List

class SpeedViolationEnforcer:
    SENSOR_TOLERANCE_BUFFER_KMH = 3.0

    @classmethod
    def evaluate_radar_ping(cls, plate: str, raw_speed: float, posted_limit: float, 
                            zone: str = "HIGHWAY", is_school_hours: bool = False) -> Dict:
        if raw_speed <= 0 or posted_limit <= 0:
            raise ValueError("Speeds must be strictly positive values.")

        calibrated_speed = round(raw_speed - cls.SENSOR_TOLERANCE_BUFFER_KMH, 1)

        # Compliance Check
        if calibrated_speed <= posted_limit:
            return {
                "plate": plate,
                "status": "COMPLIANT",
                "raw_speed": raw_speed,
                "calibrated_speed": calibrated_speed,
                "posted_limit": posted_limit,
                "fine_amount": 0.0,
                "demerit_points": 0,
                "severity": "NONE"
            }

        delta = round(calibrated_speed - posted_limit, 1)
        court_required = False

        # Graduated speed violation matrix
        if delta <= 10.0:
            base_fine = 75.00
            demerit_pts = 0
            severity = "MINOR_INFRACTION"
        elif delta <= 20.0:
            base_fine = 150.00
            demerit_pts = 2
            severity = "MODERATE_SPEEDING"
        elif delta <= 35.0:
            base_fine = 300.00
            demerit_pts = 4
            severity = "HIGH_RISK_SPEEDING"
        else:
            base_fine = 600.00
            demerit_pts = 6
            severity = "RECKLESS_ENDANGERMENT"
            court_required = True

        # School Zone Multiplier
        is_school_zone = (zone.upper() == "SCHOOL_ZONE" and is_school_hours)
        total_fine = (base_fine * 2.0) if is_school_zone else base_fine

        return {
            "plate": plate,
            "status": "VIOLATION",
            "zone": zone,
            "raw_speed": raw_speed,
            "calibrated_speed": calibrated_speed,
            "posted_limit": posted_limit,
            "excess_speed_kmh": delta,
            "fine_amount": total_fine,
            "demerit_points": demerit_pts,
            "severity": severity,
            "court_appearance_mandatory": court_required
        }

def run_case_study():
    readings = [
        ("KA-01-AB-1234", 102.5, 100.0, "HIGHWAY", False),      # Compliant after 3km/h tolerance
        ("DL-04-XY-9081", 116.0, 100.0, "HIGHWAY", False),      # 13 km/h over -> Moderate
        ("MH-12-CD-5521", 52.0, 30.0, "SCHOOL_ZONE", True),     # School zone active -> Doubled fine
        ("AP-09-ZZ-9999", 152.0, 100.0, "HIGHWAY", False)       # >35 km/h over -> Reckless court summons
    ]

    print("=" * 85)
    print(" AUTOMATED HIGHWAY SPEED RADAR & TRAFFIC VIOLATION AUDIT")
    print("=" * 85)
    print(f"{'Plate Number':<14} | {'Raw':<5} | {'Calib':<5} | {'Limit':<5} | {'Over':<5} | {'Fine ($)':<8} | {'Points':<6} | {'Disposition'}")
    print("-" * 85)

    for plate, raw, limit, zone, school in readings:
        res = SpeedViolationEnforcer.evaluate_radar_ping(plate, raw, limit, zone, school)
        if res["status"] == "COMPLIANT":
            print(f"{plate:<14} | {raw:<5.1f} | {res['calibrated_speed']:<5.1f} | {limit:<5.0f} | {'0.0':<5} | {'$0.00':<8} | {'0':<6} | COMPLIANT (WITHIN TOLERANCE)")
        else:
            court_str = " [COURT SUMMONS]" if res["court_appearance_mandatory"] else ""
            print(f"{plate:<14} | {raw:<5.1f} | {res['calibrated_speed']:<5.1f} | {limit:<5.0f} | {res['excess_speed_kmh']:<5.1f} | ${res['fine_amount']:<7.2f} | {res['demerit_points']:<6} | {res['severity']}{court_str}")

    print("=" * 85)

if __name__ == "__main__":
    run_case_study()
