#!/usr/bin/env python3
"""
Case Study 03: Automated Banking Transaction Ledger & Anomaly Sentry
Author: Student (PythonActivity Repository)
Purpose: Executes atomic double-entry banking transactions with overdraft rules
         and sliding-window fraud detection sentry.
"""

import time
from typing import List, Dict, Optional

class BankingException(Exception):
    pass

class InsufficientFundsError(BankingException):
    pass

class FraudDetectionAlert(BankingException):
    pass

class BankAccount:
    def __init__(self, account_number: str, holder_name: str, initial_balance: float = 0.0, overdraft_limit: float = 500.0):
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = float(initial_balance)
        self.overdraft_limit = float(overdraft_limit)
        self.is_locked = False
        self.ledger: List[Dict] = []
        self._record_entry("ACCOUNT_OPENING", initial_balance, "Initial funding")

    def _record_entry(self, tx_type: str, amount: float, notes: str):
        self.ledger.append({
            "timestamp": time.time(),
            "type": tx_type,
            "amount": amount,
            "balance_after": round(self.balance, 2),
            "notes": notes
        })

    def deposit(self, amount: float):
        if self.is_locked:
            raise FraudDetectionAlert(f"Account {self.account_number} is locked. Contact fraud department.")
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self.balance += amount
        self._record_entry("DEPOSIT", amount, "Regular deposit")

    def withdraw(self, amount: float, current_time: Optional[float] = None):
        if current_time is None:
            current_time = time.time()
        
        if self.is_locked:
            raise FraudDetectionAlert(f"Account {self.account_number} is locked.")
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        # Heuristic 1: Velocity Sentinel (Max 3 withdrawals within 60-second window)
        recent_debits = [
            tx for tx in self.ledger 
            if tx["type"] in ("WITHDRAWAL", "TRANSFER_OUT") 
            and (current_time - tx["timestamp"]) <= 60.0
        ]
        if len(recent_debits) >= 3:
            self.is_locked = True
            raise FraudDetectionAlert(f"CRITICAL: Velocity surge detected on {self.account_number}! Account locked.")

        # Heuristic 2: Outlier spike (> $3,000 and 5x past average)
        withdrawals = [tx["amount"] for tx in self.ledger if tx["type"] == "WITHDRAWAL"]
        avg_spend = (sum(withdrawals) / len(withdrawals)) if withdrawals else 100.0
        if amount > 3000.0 and amount > (avg_spend * 5.0):
            self.is_locked = True
            raise FraudDetectionAlert(f"CRITICAL: High-value anomaly detected ($ {amount:.2f}). Account locked.")

        # Solvency Check with Overdraft
        available_funds = self.balance + self.overdraft_limit
        if amount > available_funds:
            raise InsufficientFundsError(f"Insufficient funds! Available: ${available_funds:.2f}, Requested: ${amount:.2f}")

        self.balance -= amount
        self._record_entry("WITHDRAWAL", amount, "Cash withdrawal")

        # Overdraft Fee Assessment
        if self.balance < 0.0:
            fee = 35.0
            self.balance -= fee
            self._record_entry("OVERDRAFT_FEE", fee, "Overdraft protection service fee assessed")

    def transfer_to(self, target_account: 'BankAccount', amount: float):
        if self.account_number == target_account.account_number:
            raise ValueError("Cannot transfer to the same account.")
        # Atomic transfer
        self.withdraw(amount)
        target_account.deposit(amount)
        self.ledger[-1]["notes"] = f"Transfer to {target_account.account_number}"

def run_case_study():
    acc_alice = BankAccount("ACT-8810", "Alice Chen", 1500.00)
    acc_bob = BankAccount("ACT-8820", "Bob Martin", 250.00)

    print("=" * 75)
    print(" AUTOMATED BANKING TRANSACTION LEDGER & FRAUD AUDITOR")
    print("=" * 75)
    print(f"Alice Initial Balance : ${acc_alice.balance:.2f} (Overdraft Limit: ${acc_alice.overdraft_limit:.2f})")
    print(f"Bob Initial Balance   : ${acc_bob.balance:.2f}")
    print("-" * 75)

    print("1. Transferring $600.00 from Alice to Bob...")
    acc_alice.transfer_to(acc_bob, 600.00)
    print(f"   -> Alice Balance: ${acc_alice.balance:.2f} | Bob Balance: ${acc_bob.balance:.2f}")

    print("2. Alice executing overdraft withdrawal ($1,200.00)...")
    acc_alice.withdraw(1200.00)
    print(f"   -> Alice Balance: ${acc_alice.balance:.2f} (Overdraft fee applied)")

    print("3. Testing Fraud Sentinel: Simulating rapid automated draining attacks...")
    sim_time = time.time()
    try:
        acc_bob.withdraw(50.0, current_time=sim_time)
        acc_bob.withdraw(50.0, current_time=sim_time + 1)
        acc_bob.withdraw(50.0, current_time=sim_time + 2)
        print("   -> Attempting 4th rapid transaction within 5 seconds...")
        acc_bob.withdraw(50.0, current_time=sim_time + 3)
    except FraudDetectionAlert as e:
        print(f"   -> [FRAUD SENTRY TRIPPED]: {e}")
        print(f"   -> Bob Account Lock Status: {acc_bob.is_locked}")

    print("=" * 75)

if __name__ == "__main__":
    run_case_study()
