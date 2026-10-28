#!/usr/bin/env python3
"""
Case Study 05: Healthcare Patient Vitals & Emergency Triage System
Author: Student (PythonActivity Repository)
Purpose: Calculates standard NEWS2 clinical deterioration scores
         and manages emergency department priority queue triage.
"""

from typing import List, Dict, Tuple

class PatientVitals:
    def __init__(self, patient_id: str, name: str, age: int, 
                 resp_rate: int, spo2: int, on_oxygen: bool, 
                 systolic_bp: int, heart_rate: int, temp_c: float, is_alert: bool):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.resp_rate = resp_rate
        self.spo2 = spo2
        self.on_oxygen = on_oxygen
        self.systolic_bp = systolic_bp
        self.heart_rate = heart_rate
        self.temp_c = temp_c
        self.is_alert = is_alert

    def compute_news2(self) -> Tuple[int, bool, Dict[str, int]]:
        """Calculates NHS NEWS2 score and returns breakdown."""
        # 1. Respiration Rate
        if self.resp_rate <= 8: s_rr = 3
        elif self.resp_rate <= 11: s_rr = 1
        elif self.resp_rate <= 20: s_rr = 0
        elif self.resp_rate <= 24: s_rr = 2
        else: s_rr = 3

        # 2. SpO2 (Scale 1)
        if self.spo2 <= 91: s_spo2 = 3
        elif self.spo2 <= 93: s_spo2 = 2
        elif self.spo2 <= 95: s_spo2 = 1
        else: s_spo2 = 0

        # 3. Supplemental Oxygen
        s_o2 = 2 if self.on_oxygen else 0

        # 4. Systolic Blood Pressure
        if self.systolic_bp <= 90: s_bp = 3
        elif self.systolic_bp <= 100: s_bp = 2
        elif self.systolic_bp <= 110: s_bp = 1
        elif self.systolic_bp <= 219: s_bp = 0
        else: s_bp = 3

        # 5. Heart Rate
        if self.heart_rate <= 40: s_hr = 3
        elif self.heart_rate <= 50: s_hr = 1
        elif self.heart_rate <= 90: s_hr = 0
        elif self.heart_rate <= 110: s_hr = 1
        elif self.heart_rate <= 130: s_hr = 2
        else: s_hr = 3

        # 6. Temperature
        if self.temp_c <= 35.0: s_t = 3
        elif self.temp_c <= 36.0: s_t = 1
        elif self.temp_c <= 38.0: s_t = 0
        elif self.temp_c <= 39.0: s_t = 1
        else: s_t = 2

        # 7. Consciousness
        s_alert = 0 if self.is_alert else 3

        breakdown = {
            "respiration": s_rr,
            "spo2": s_spo2,
            "oxygen_device": s_o2,
            "blood_pressure": s_bp,
            "heart_rate": s_hr,
            "temperature": s_t,
            "consciousness": s_alert
        }

        total = sum(breakdown.values())
        has_critical_single = any(v == 3 for k, v in breakdown.items() if k != "oxygen_device")

        return total, has_critical_single, breakdown

    def get_triage_priority(self) -> Tuple[int, str, str]:
        """Returns (PriorityRank [1=High, 3=Low], RiskCategory, Protocol)."""
        score, has_single_3, _ = self.compute_news2()
        if score >= 7 or has_single_3:
            return (1, "HIGH_RISK", "Immediate Critical Care / Resus Response Required")
        elif score >= 5:
            return (2, "MEDIUM_RISK", "Urgent Clinical Review (Within 30 Minutes)")
        else:
            return (3, "LOW_RISK", "Ward-level routine monitoring (4-6 Hours)")

class EmergencyTriageQueue:
    def __init__(self):
        self.patients: List[PatientVitals] = []

    def admit_patient(self, p: PatientVitals):
        self.patients.append(p)

    def get_sorted_queue(self) -> List[Tuple[PatientVitals, int, str, str]]:
        """Sorts patients by clinical urgency: Priority 1 first, then highest NEWS2 score."""
        evaluated = []
        for p in self.patients:
            score, _, _ = p.compute_news2()
            pri, category, action = p.get_triage_priority()
            evaluated.append((p, score, category, action))
        
        # Sort key: priority rank ascending (1 is highest), score descending
        evaluated.sort(key=lambda x: (x[0].get_triage_priority()[0], -x[1]))
        return evaluated

def run_case_study():
    queue = EmergencyTriageQueue()
    queue.admit_patient(PatientVitals("PT-901", "James Wilson", 68, 16, 98, False, 125, 72, 36.8, True))
    queue.admit_patient(PatientVitals("PT-902", "Elena Rostova", 54, 26, 90, True, 85, 128, 39.4, False)) # Sepsis / Severe
    queue.admit_patient(PatientVitals("PT-903", "Kavita Reddy", 32, 22, 94, False, 105, 96, 38.2, True))  # Mild fever
    queue.admit_patient(PatientVitals("PT-904", "David O'Connor", 74, 10, 92, True, 95, 48, 35.8, True))   # Moderate COPD

    print("=" * 85)
    print(" EMERGENCY ROOM CLINICAL TRIAGE & NEWS2 RISK STRATIFICATION")
    print("=" * 85)
    print(f"{'Priority':<9} | {'Patient ID':<10} | {'Name':<16} | {'NEWS2':<6} | {'Risk Tier':<12} | {'Clinical Protocol'}")
    print("-" * 85)

    sorted_patients = queue.get_sorted_queue()
    for p, score, cat, action in sorted_patients:
        pri = p.get_triage_priority()[0]
        pri_label = f"P{pri} [EMERGENCY]" if pri == 1 else (f"P{pri} [URGENT]" if pri == 2 else f"P{pri} [STANDARD]")
        print(f"{pri_label:<9} | {p.patient_id:<10} | {p.name:<16} | {score:<6} | {cat:<12} | {action}")

    print("=" * 85)

if __name__ == "__main__":
    run_case_study()
