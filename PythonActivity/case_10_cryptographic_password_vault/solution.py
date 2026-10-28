#!/usr/bin/env python3
"""
Case Study 10: Cryptographic Password Strength Evaluator & Vault Hash Auditor
Author: Student (PythonActivity Repository)
Purpose: Calculates Claude Shannon information entropy (bits), detects dictionary leaks,
         estimates cluster brute-force crack time, and generates salted SHA-256 hashes.
"""

import math
import hashlib
import os
import string
from typing import Dict, Tuple

class PasswordSecurityAuditor:
    COMMON_LEAK_DICTIONARY = {
        "password", "123456", "12345678", "qwerty", "admin", 
        "welcome", "login", "password123", "iloveyou", "abc123"
    }

    @classmethod
    def calculate_entropy(cls, password: str) -> Tuple[float, int]:
        """Entropy = Length * log2(Pool Size)"""
        if not password:
            return 0.0, 0

        pool_size = 0
        has_lower = any(c in string.ascii_lowercase for c in password)
        has_upper = any(c in string.ascii_uppercase for c in password)
        has_digits = any(c in string.digits for c in password)
        has_symbols = any(c in string.punctuation for c in password)

        if has_lower: pool_size += 26
        if has_upper: pool_size += 26
        if has_digits: pool_size += 10
        if has_symbols: pool_size += len(string.punctuation)

        if pool_size == 0:
            pool_size = 1

        entropy = len(password) * math.log2(pool_size)
        return round(entropy, 2), pool_size

    @classmethod
    def estimate_crack_time(cls, pool_size: int, length: int) -> str:
        """Estimates crack time assuming an adversary running 10^10 hashes/sec."""
        if pool_size <= 1 or length <= 0:
            return "Instant"
        
        combinations = pool_size ** length
        hash_rate = 10_000_000_000 # 10 Billion hashes/sec
        seconds = combinations / hash_rate

        if seconds < 1:
            return "Instantaneous (< 1 second)"
        elif seconds < 60:
            return f"{seconds:.1f} seconds"
        elif seconds < 3600:
            return f"{seconds / 60:.1f} minutes"
        elif seconds < 86400:
            return f"{seconds / 3600:.1f} hours"
        elif seconds < 31_536_000:
            return f"{seconds / 86400:.1f} days"
        elif seconds < 3_153_600_000:
            return f"{seconds / 31_536_000:.1f} years"
        else:
            centuries = seconds / (31_536_000 * 100)
            return f"{centuries:.1e} centuries (Mathematically Infeasible)"

    @classmethod
    def audit_password(cls, password: str) -> Dict:
        entropy, pool_size = cls.calculate_entropy(password)
        lower_pass = password.lower()
        is_leaked = lower_pass in cls.COMMON_LEAK_DICTIONARY

        if is_leaked:
            entropy = min(entropy, 14.0)
            rating = "CRITICAL: COMPROMISED (Dictionary Leak)"
        elif entropy < 35.0:
            rating = "VERY WEAK"
        elif entropy < 55.0:
            rating = "MODERATE"
        elif entropy < 75.0:
            rating = "STRONG"
        else:
            rating = "VERY STRONG (Vault Grade)"

        crack_time = "Instantaneous (Known dictionary leak)" if is_leaked else cls.estimate_crack_time(pool_size, len(password))

        # Cryptographically secure 16-byte random salt
        salt = os.urandom(16)
        hasher = hashlib.sha256()
        hasher.update(salt + password.encode('utf-8'))
        sha256_hex = hasher.hexdigest()

        return {
            "password_masked": "*" * len(password),
            "length": len(password),
            "pool_size": pool_size,
            "entropy_bits": entropy,
            "rating": rating,
            "estimated_crack_time": crack_time,
            "salt_hex": salt.hex(),
            "sha256_salted_hash": sha256_hex
        }

def run_case_study():
    test_candidates = [
        "password123",
        "Summer2026!",
        "Kx9#mQ$7vL@2pZ!w",
        "correct-horse-battery-staple-2026"
    ]

    print("=" * 85)
    print(" CRYPTOGRAPHIC PASSWORD ENTROPY & VAULT HASH AUDITOR")
    print("=" * 85)
    print(f"{'Password Sample':<28} | {'Length':<6} | {'Entropy':<8} | {'Rating':<20} | {'Crack Time'}")
    print("-" * 85)

    for pwd in test_candidates:
        audit = PasswordSecurityAuditor.audit_password(pwd)
        display_label = pwd if len(pwd) <= 26 else pwd[:23] + "..."
        print(f"{display_label:<28} | {audit['length']:<6} | {audit['entropy_bits']:<5.1f} b | {audit['rating']:<20} | {audit['estimated_crack_time']}")

    print("-" * 85)
    print("Cryptographic Storage Sample (Last Candidate):")
    audit_last = PasswordSecurityAuditor.audit_password(test_candidates[-1])
    print(f"  • Random Salt (CSPRNG 16-bytes) : {audit_last['salt_hex']}")
    print(f"  • Salted SHA-256 Digest         : {audit_last['sha256_salted_hash']}")
    print("=" * 85)

if __name__ == "__main__":
    run_case_study()
