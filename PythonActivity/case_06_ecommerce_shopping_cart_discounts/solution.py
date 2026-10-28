#!/usr/bin/env python3
"""
Case Study 06: Dynamic E-Commerce Cart, Tiered Discounts & Tax Calculator
Author: Student (PythonActivity Repository)
Purpose: Calculates shopping cart sub-totals with volume price breaks,
         VIP tier savings, promotional coupons, regional taxes, and shipping.
"""

from typing import List, Dict, Optional

class CartItem:
    def __init__(self, sku: str, title: str, unit_price: float, quantity: int):
        if unit_price <= 0 or quantity <= 0:
            raise ValueError("Price and quantity must be positive")
        self.sku = sku
        self.title = title
        self.unit_price = float(unit_price)
        self.quantity = int(quantity)

    @property
    def gross_total(self) -> float:
        return self.unit_price * self.quantity

    @property
    def volume_discount(self) -> float:
        """15% bulk discount when ordering 10 or more of the same unit."""
        if self.quantity >= 10:
            return round(self.gross_total * 0.15, 2)
        return 0.0

    @property
    def net_total(self) -> float:
        return self.gross_total - self.volume_discount

class ShoppingCartCheckout:
    LOYALTY_RATES = {
        "STANDARD": 0.00,
        "SILVER": 0.05,
        "GOLD": 0.10,
        "PLATINUM": 0.15
    }

    def __init__(self, items: List[CartItem], loyalty_tier: str = "STANDARD", 
                 coupon_code: Optional[str] = None, tax_rate: float = 0.0825):
        self.items = items
        self.loyalty_tier = loyalty_tier.upper()
        self.coupon_code = coupon_code.strip().upper() if coupon_code else None
        self.tax_rate = tax_rate

    def generate_invoice(self) -> Dict:
        gross_subtotal = sum(i.gross_total for i in self.items)
        volume_savings = sum(i.volume_discount for i in self.items)
        subtotal_after_volume = gross_subtotal - volume_savings

        # VIP Member Discount
        vip_rate = self.LOYALTY_RATES.get(self.loyalty_tier, 0.00)
        vip_savings = round(subtotal_after_volume * vip_rate, 2)
        subtotal_after_vip = subtotal_after_volume - vip_savings

        # Coupon Code Evaluation
        coupon_savings = 0.0
        free_shipping_override = False

        if self.coupon_code == "SAVE20":
            if subtotal_after_vip >= 50.0:
                coupon_savings = 20.00
        elif self.coupon_code == "SUMMER25":
            coupon_savings = round(subtotal_after_vip * 0.25, 2)
        elif self.coupon_code == "FREESHIP":
            free_shipping_override = True

        net_taxable_subtotal = max(0.0, round(subtotal_after_vip - coupon_savings, 2))

        # Shipping logic (Free if >= $75 or coupon override)
        if net_taxable_subtotal >= 75.00 or free_shipping_override:
            shipping_fee = 0.00
        else:
            shipping_fee = 12.00

        sales_tax = round(net_taxable_subtotal * self.tax_rate, 2)
        grand_total = round(net_taxable_subtotal + shipping_fee + sales_tax, 2)

        return {
            "gross_subtotal": gross_subtotal,
            "volume_savings": volume_savings,
            "vip_tier": self.loyalty_tier,
            "vip_savings": vip_savings,
            "coupon_applied": self.coupon_code,
            "coupon_savings": coupon_savings,
            "net_subtotal": net_taxable_subtotal,
            "shipping_fee": shipping_fee,
            "sales_tax": sales_tax,
            "grand_total": grand_total
        }

def run_case_study():
    cart = [
        CartItem("ITEM-01", "Ergonomic Mechanical Keyboard", 85.00, 1),
        CartItem("ITEM-02", "Braided USB-C Cable 2M", 8.00, 12), # Volume discount qualifies
        CartItem("ITEM-03", "Microfiber Desk Mat", 25.00, 2)
    ]

    checkout = ShoppingCartCheckout(items=cart, loyalty_tier="GOLD", coupon_code="SAVE20", tax_rate=0.0825)
    inv = checkout.generate_invoice()

    print("=" * 75)
    print(" E-COMMERCE CHECKOUT SUMMARY & TAX INVOICE")
    print("=" * 75)
    print(f"Gross Merchandise Subtotal  : ${inv['gross_subtotal']:>8.2f}")
    print(f"Bulk Volume Savings (15%)   : -${inv['volume_savings']:>7.2f}")
    print(f"VIP Member Tier ({inv['vip_tier']}) : -${inv['vip_savings']:>7.2f}")
    print(f"Promotional Coupon ({inv['coupon_applied']})  : -${inv['coupon_savings']:>7.2f}")
    print("-" * 75)
    print(f"Net Taxable Subtotal        : ${inv['net_subtotal']:>8.2f}")
    print(f"Shipping & Handling         : ${inv['shipping_fee']:>8.2f} ({'FREE >= $75' if inv['shipping_fee']==0 else 'Standard Ground'})")
    print(f"Estimated Sales Tax (8.25%) : ${inv['sales_tax']:>8.2f}")
    print("=" * 75)
    print(f"TOTAL AMOUNT PAYABLE        : ${inv['grand_total']:>8.2f}")
    print("=" * 75)

if __name__ == "__main__":
    run_case_study()
