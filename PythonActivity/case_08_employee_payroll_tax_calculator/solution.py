#!/usr/bin/env python3
"""
Case Study 08: Corporate Payroll & Progressive Income Tax Bracket Engine
Author: Student (PythonActivity Repository)
Purpose: Calculates employee gross pay, overtime premiums, progressive
         marginal federal income tax, FICA deductions, and net payslips.
"""

from typing import Dict, List, Tuple

class PayrollCalculator:
    # 2026 Representative Federal Tax Brackets (Single Filer Annualized)
    TAX_BRACKETS: List[Tuple[float, float]] = [
        (11600.0, 0.10),
        (47150.0, 0.12),
        (100525.0, 0.22),
        (191950.0, 0.24),
        (243725.0, 0.32),
        (609350.0, 0.35),
        (float('inf'), 0.37)
    ]

    SOC_SEC_RATE = 0.062
    MEDICARE_RATE = 0.0145

    @classmethod
    def calculate_progressive_income_tax(cls, annual_taxable_income: float) -> float:
        """Applies marginal bracket rates strictly to chunks within limits."""
        tax = 0.0
        prev_cap = 0.0

        for cap, rate in cls.TAX_BRACKETS:
            if annual_taxable_income > prev_cap:
                taxable_chunk = min(annual_taxable_income, cap) - prev_cap
                tax += taxable_chunk * rate
                prev_cap = cap
            else:
                break
        return round(tax, 2)

    @classmethod
    def generate_weekly_payslip(cls, employee_id: str, name: str, hourly_rate: float, 
                                 hours_worked: float, health_insurance: float = 45.0, 
                                 retirement_pct: float = 5.0) -> Dict:
        if hourly_rate <= 0 or hours_worked < 0:
            raise ValueError("Hourly rate and hours worked must be non-negative.")

        # Regular vs Overtime Pay
        if hours_worked <= 40.0:
            regular_pay = hours_worked * hourly_rate
            overtime_hours = 0.0
            overtime_pay = 0.0
        else:
            regular_pay = 40.0 * hourly_rate
            overtime_hours = hours_worked - 40.0
            overtime_pay = overtime_hours * (hourly_rate * 1.5)

        gross_pay = round(regular_pay + overtime_pay, 2)

        # Pre-tax deductions
        k401_amount = round(gross_pay * (retirement_pct / 100.0), 2)
        pretax_deductions = health_insurance + k401_amount
        taxable_gross_weekly = max(0.0, gross_pay - pretax_deductions)

        # Federal Progressive Tax (Weekly equivalent of annualized brackets)
        annualized_taxable = taxable_gross_weekly * 52.0
        annual_federal_tax = cls.calculate_progressive_income_tax(annualized_taxable)
        weekly_federal_tax = round(annual_federal_tax / 52.0, 2)

        # FICA Withholdings
        soc_sec_tax = round(gross_pay * cls.SOC_SEC_RATE, 2)
        medicare_tax = round(gross_pay * cls.MEDICARE_RATE, 2)

        total_taxes = round(weekly_federal_tax + soc_sec_tax + medicare_tax, 2)
        total_withheld = round(total_taxes + pretax_deductions, 2)
        net_take_home = round(gross_pay - total_withheld, 2)
        effective_tax_pct = round((total_taxes / gross_pay) * 100.0, 2) if gross_pay > 0 else 0.0

        return {
            "employee_id": employee_id,
            "name": name,
            "hours_worked": hours_worked,
            "overtime_hours": overtime_hours,
            "gross_pay": gross_pay,
            "overtime_pay": overtime_pay,
            "pretax_deductions": {
                "health_insurance": health_insurance,
                "401k_retirement": k401_amount
            },
            "taxes": {
                "federal_income_tax": weekly_federal_tax,
                "social_security": soc_sec_tax,
                "medicare": medicare_tax
            },
            "net_pay": net_take_home,
            "effective_tax_rate": effective_tax_pct
        }

def run_case_study():
    stub = PayrollCalculator.generate_weekly_payslip(
        employee_id="EMP-4402",
        name="Sarah Jenkins",
        hourly_rate=42.50,
        hours_worked=48.0, # 8 hours overtime
        health_insurance=50.00,
        retirement_pct=6.0
    )

    print("=" * 75)
    print(" CORPORATE EMPLOYEE ITEMIZED PAY VOUCHER")
    print("=" * 75)
    print(f"Employee Name : {stub['name']} (ID: {stub['employee_id']})")
    print(f"Hours Logged  : {stub['hours_worked']:.1f} hrs (Regular: 40.0, Overtime: {stub['overtime_hours']:.1f} hrs)")
    print("-" * 75)
    print(f"Gross Earnings         : ${stub['gross_pay']:>9.2f} (Includes ${stub['overtime_pay']:.2f} OT)")
    print("Pre-Tax Deductions:")
    print(f"  • Health Benefit     : -${stub['pretax_deductions']['health_insurance']:>8.2f}")
    print(f"  • 401(k) Plan (6%)   : -${stub['pretax_deductions']['401k_retirement']:>8.2f}")
    print("Statutory Tax Deductions:")
    print(f"  • Federal Income Tax : -${stub['taxes']['federal_income_tax']:>8.2f}")
    print(f"  • Social Security    : -${stub['taxes']['social_security']:>8.2f}")
    print(f"  • Medicare Tax       : -${stub['taxes']['medicare']:>8.2f}")
    print("-" * 75)
    print(f"NET TAKE-HOME PAY      : ${stub['net_pay']:>9.2f}")
    print(f"Effective Tax Rate     : {stub['effective_tax_rate']:.2f}% of gross income")
    print("=" * 75)

if __name__ == "__main__":
    run_case_study()
