#!/usr/bin/env python3
"""
Case Study 02: Smart Warehouse Inventory & Automated Stock Reorder Engine
Author: Student (PythonActivity Repository)
Purpose: Calculates dynamic Reorder Points (ROP), Economic Order Quantity (EOQ),
         and raises automated purchase requisitions.
"""

import math
from typing import Dict, List, Optional

class InventoryItem:
    def __init__(self, sku: str, name: str, on_hand: int, daily_demand: int, 
                 lead_time_days: int, safety_stock: int, unit_cost: float):
        if on_hand < 0:
            raise ValueError(f"Inventory cannot be negative: {on_hand}")
        self.sku = sku
        self.name = name
        self.on_hand = on_hand
        self.daily_demand = daily_demand
        self.lead_time_days = lead_time_days
        self.safety_stock = safety_stock
        self.unit_cost = unit_cost

    @property
    def reorder_point(self) -> int:
        """ROP = (Daily Demand * Lead Time) + Safety Stock"""
        return (self.daily_demand * self.lead_time_days) + self.safety_stock

    def calculate_eoq(self, fixed_order_cost: float = 50.0, holding_rate: float = 0.20) -> int:
        """EOQ = sqrt((2 * Annual Demand * S) / H)"""
        annual_demand = self.daily_demand * 365
        unit_holding_cost = self.unit_cost * holding_rate
        if unit_holding_cost <= 0:
            return self.daily_demand * 30
        raw_eoq = math.sqrt((2 * annual_demand * fixed_order_cost) / unit_holding_cost)
        return max(1, math.ceil(raw_eoq))

    def dispatch(self, quantity: int) -> int:
        """Deducts stock after verifying solvency."""
        if quantity <= 0:
            raise ValueError("Dispatch quantity must be greater than zero")
        if quantity > self.on_hand:
            raise ValueError(f"Insufficient stock for {self.sku}. Requested: {quantity}, Available: {self.on_hand}")
        self.on_hand -= quantity
        return self.on_hand

    def receive_stock(self, quantity: int) -> int:
        """Receives new shipments into warehouse."""
        if quantity <= 0:
            raise ValueError("Inbound shipment quantity must be positive")
        self.on_hand += quantity
        return self.on_hand

class WarehouseManager:
    def __init__(self):
        self.items: Dict[str, InventoryItem] = {}

    def register_item(self, item: InventoryItem):
        self.items[item.sku] = item

    def audit_inventory(self) -> List[Dict]:
        report = []
        for sku, item in self.items.items():
            rop = item.reorder_point
            eoq = item.calculate_eoq()
            
            if item.on_hand <= item.safety_stock:
                status = "CRITICAL_LOW"
                action = f"EMERGENCY ORDER {eoq} UNITS"
            elif item.on_hand <= rop:
                status = "REORDER_TRIGGERED"
                action = f"Place standard order for {eoq} units"
            else:
                status = "OPTIMAL"
                action = "None"

            report.append({
                "sku": sku,
                "name": item.name,
                "on_hand": item.on_hand,
                "rop": rop,
                "eoq": eoq,
                "status": status,
                "action": action
            })
        return report

def run_case_study():
    wh = WarehouseManager()
    wh.register_item(InventoryItem("SKU-101", "Lithium Battery 5000mAh", 45, 10, 5, 15, 24.50))
    wh.register_item(InventoryItem("SKU-102", "OLED Display 1.3-inch", 120, 8, 7, 20, 14.00))
    wh.register_item(InventoryItem("SKU-103", "ARM Cortex M4 MCU", 12, 5, 10, 10, 8.50))
    wh.register_item(InventoryItem("SKU-104", "Precision Resistor Kit", 500, 20, 3, 50, 4.20))

    print("=" * 80)
    print(" INDUSTRIAL WAREHOUSE INVENTORY AUDIT & REORDER REPORT")
    print("=" * 80)
    print(f"{'SKU':<10} | {'Item Name':<24} | {'Stock':<6} | {'ROP':<6} | {'EOQ':<6} | {'Status'}")
    print("-" * 80)
    
    for row in wh.audit_inventory():
        print(f"{row['sku']:<10} | {row['name']:<24} | {row['on_hand']:<6} | {row['rop']:<6} | {row['eoq']:<6} | {row['status']}")

    print("-" * 80)
    print("Executing sample customer dispatch on SKU-101 (Quantity: 35)...")
    wh.items["SKU-101"].dispatch(35)
    print(f"Updated SKU-101 Stock: {wh.items['SKU-101'].on_hand} (Safety Threshold: {wh.items['SKU-101'].safety_stock})")
    
    post_audit = wh.audit_inventory()
    sku_101_audit = next(x for x in post_audit if x["sku"] == "SKU-101")
    print(f"New Alert Status for SKU-101: {sku_101_audit['status']} -> {sku_101_audit['action']}")
    print("=" * 80)

if __name__ == "__main__":
    run_case_study()
