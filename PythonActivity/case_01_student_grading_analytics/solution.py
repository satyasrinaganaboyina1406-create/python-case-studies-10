#!/usr/bin/env python3
"""
Case Study 01: Student Academic Performance & Grade Analytics System
Author: Student (PythonActivity Repository)
Purpose: Calculates course-weighted GPAs, statistical distributions,
         and identifies at-risk students for academic counseling.
"""

import math
from typing import List, Dict, Tuple, Any

class Course:
    def __init__(self, code: str, title: str, credits: int, marks: float):
        if not (0.0 <= marks <= 100.0):
            raise ValueError(f"Marks must be between 0.0 and 100.0, received: {marks}")
        if credits <= 0:
            raise ValueError(f"Credits must be positive integer, received: {credits}")
        self.code = code
        self.title = title
        self.credits = credits
        self.marks = marks

    def get_grade_and_points(self) -> Tuple[str, float]:
        """Returns tuple of (Letter Grade, Grade Point 4.0 Scale)."""
        if self.marks >= 90.0:
            return ("A+", 4.0)
        elif self.marks >= 80.0:
            return ("A", 3.5)
        elif self.marks >= 70.0:
            return ("B", 3.0)
        elif self.marks >= 60.0:
            return ("C", 2.5)
        elif self.marks >= 50.0:
            return ("D", 2.0)
        else:
            return ("F", 0.0)

class Student:
    def __init__(self, student_id: str, name: str, courses: List[Course]):
        self.student_id = student_id
        self.name = name
        self.courses = courses

    def calculate_gpa(self) -> float:
        total_points = sum(c.credits * c.get_grade_and_points()[1] for c in self.courses)
        total_credits = sum(c.credits for c in self.courses)
        if total_credits == 0:
            return 0.0
        return round(total_points / total_credits, 2)

    def is_at_risk(self) -> Tuple[bool, str]:
        gpa = self.calculate_gpa()
        failed = [c.code for c in self.courses if c.get_grade_and_points()[0] == "F"]
        if gpa < 2.0:
            return (True, f"Low GPA ({gpa:.2f})")
        if failed:
            return (True, f"Failed Course(s): {', '.join(failed)}")
        return (False, "Satisfactory Academic Progress")

class AcademicAnalyticsEngine:
    def __init__(self, students: List[Student]):
        self.students = students

    def compute_cohort_statistics(self) -> Dict[str, Any]:
        if not self.students:
            return {}
        gpas = [s.calculate_gpa() for s in self.students]
        n = len(gpas)
        mean_gpa = sum(gpas) / n
        sorted_gpas = sorted(gpas)
        
        if n % 2 == 1:
            median_gpa = sorted_gpas[n // 2]
        else:
            median_gpa = (sorted_gpas[(n // 2) - 1] + sorted_gpas[n // 2]) / 2.0
            
        variance = sum((x - mean_gpa) ** 2 for x in gpas) / n
        std_dev = math.sqrt(variance)

        at_risk_list = []
        for s in self.students:
            flagged, reason = s.is_at_risk()
            if flagged:
                at_risk_list.append({"id": s.student_id, "name": s.name, "gpa": s.calculate_gpa(), "reason": reason})

        return {
            "total_students": n,
            "mean_gpa": round(mean_gpa, 2),
            "median_gpa": round(median_gpa, 2),
            "std_deviation": round(std_dev, 2),
            "highest_gpa": max(gpas),
            "lowest_gpa": min(gpas),
            "at_risk_count": len(at_risk_list),
            "at_risk_roster": at_risk_list
        }

def run_case_study():
    # Sample Test Cohort
    sample_students = [
        Student("STU101", "Aarav Sharma", [
            Course("CS101", "Data Structures", 4, 94.0),
            Course("MA102", "Discrete Math", 3, 88.5),
            Course("PH101", "Applied Physics", 3, 91.0)
        ]),
        Student("STU102", "Priya Nair", [
            Course("CS101", "Data Structures", 4, 82.0),
            Course("MA102", "Discrete Math", 3, 74.0),
            Course("PH101", "Applied Physics", 3, 79.5)
        ]),
        Student("STU103", "Rohan Mehta", [
            Course("CS101", "Data Structures", 4, 45.0), # Failed
            Course("MA102", "Discrete Math", 3, 62.0),
            Course("PH101", "Applied Physics", 3, 58.0)
        ]),
        Student("STU104", "Ananya Sen", [
            Course("CS101", "Data Structures", 4, 98.0),
            Course("MA102", "Discrete Math", 3, 95.0),
            Course("PH101", "Applied Physics", 3, 97.0)
        ]),
        Student("STU105", "Vikram Das", [
            Course("CS101", "Data Structures", 4, 40.0),
            Course("MA102", "Discrete Math", 3, 38.0),
            Course("PH101", "Applied Physics", 3, 49.0)
        ])
    ]

    engine = AcademicAnalyticsEngine(sample_students)
    stats = engine.compute_cohort_statistics()

    print("=" * 70)
    print(" ACADEMIC PERFORMANCE & GRADE ANALYTICS REPORT")
    print("=" * 70)
    print(f"{'Student ID':<10} | {'Student Name':<16} | {'GPA (4.0)':<10} | {'Status'}")
    print("-" * 70)
    for s in sample_students:
        flagged, reason = s.is_at_risk()
        status_txt = "PROBATION" if flagged else "SATISFACTORY"
        print(f"{s.student_id:<10} | {s.name:<16} | {s.calculate_gpa():<10.2f} | {status_txt} ({reason})")
    
    print("-" * 70)
    print(" COHORT STATISTICAL METRICS:")
    print(f"  • Total Students Evaluated : {stats['total_students']}")
    print(f"  • Mean Cohort GPA          : {stats['mean_gpa']}")
    print(f"  • Median Cohort GPA        : {stats['median_gpa']}")
    print(f"  • Standard Deviation (σ)   : {stats['std_deviation']}")
    print(f"  • At-Risk Student Count    : {stats['at_risk_count']}")
    print("=" * 70)

if __name__ == "__main__":
    run_case_study()
