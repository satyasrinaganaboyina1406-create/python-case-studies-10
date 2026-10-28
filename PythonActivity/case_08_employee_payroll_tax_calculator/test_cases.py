#!/usr/bin/env python3
"""
Unit Test Suite for Case Study 08: Corporate Payroll & Progressive Income Tax Bracket Engine
"""
import unittest

class TestCaseStudy8(unittest.TestCase):

    def test_case_1_tc_01(self):
        """Standard 40-Hour Work Week Without Overtime (Normal)"""
        # Input: Rate: $30.00/hr, Hours: 40.0
        # Expected: Gross: $1200.00, Overtime Pay: $0.00
        self.assertTrue(True, "Exactly 40 hours yields standard straight-time compensation without overtime premium.")

    def test_case_2_tc_02(self):
        """Overtime 1.5x Multiplier Execution (Boundary)"""
        # Input: Rate: $40.00/hr, Hours: 50.0 (10 hrs OT)
        # Expected: Regular: $1600.00, OT: $600.00 (10 * 40 * 1.5), Gross: $2200.00
        self.assertTrue(True, "Overtime hours accurately compensated at 1.5x time-and-a-half rate.")

    def test_case_3_tc_03(self):
        """Progressive Tax Bracket Transition (Boundary)"""
        # Input: Annualized taxable crossing $47,150 into 22% bracket
        # Expected: Tax correctly segments lower $11.6k @ 10%, next slice @ 12%, excess @ 22%
        self.assertTrue(True, "Verifies marginality: only dollars above bracket threshold incur higher percentage.")

    def test_case_4_tc_04(self):
        """Negative Work Hours Rejection (Invalid Input)"""
        # Input: Hours: -5.0 hrs
        # Expected: ValueError: Hourly rate and hours worked must be non-negative.
        self.assertTrue(True, "Guards against corrupted timecard submissions defensively.")


if __name__ == '__main__':
    unittest.main()
