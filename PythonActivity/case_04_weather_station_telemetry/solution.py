#!/usr/bin/env python3
"""
Case Study 04: Meteorological Station Telemetry & Extreme Weather Analyzer
Author: Student (PythonActivity Repository)
Purpose: Cleans weather sensor data, computes rolling moving averages,
         calculates Steadman Heat Index, and generates severe weather alerts.
"""

from collections import deque
from typing import List, Dict, Optional, Tuple

class WeatherObservation:
    def __init__(self, time_label: str, temp_c: float, humidity_pct: float, pressure_hpa: float, wind_kmh: float):
        self.time_label = time_label
        self.temp_c = temp_c
        self.humidity_pct = humidity_pct
        self.pressure_hpa = pressure_hpa
        self.wind_kmh = wind_kmh

    def is_physically_valid(self) -> bool:
        return (-60.0 <= self.temp_c <= 65.0) and (0.0 <= self.humidity_pct <= 100.0) and (self.wind_kmh >= 0)

    def calculate_heat_index(self) -> float:
        """Computes Rothfusz regression equation for apparent temperature."""
        if self.temp_c < 27.0 or self.humidity_pct < 40.0:
            return round(self.temp_c, 1)
        
        # Convert to Fahrenheit for NOAA formula
        t = (self.temp_c * 9.0 / 5.0) + 32.0
        r = self.humidity_pct
        
        hi = (-42.379 + 2.04901523 * t + 10.14333127 * r - 0.22475541 * t * r 
              - 0.00683783 * (t ** 2) - 0.05481717 * (r ** 2) 
              + 0.00122874 * (t ** 2) * r + 0.00085282 * t * (r ** 2) 
              - 0.00000199 * (t ** 2) * (r ** 2))
        
        # Convert back to Celsius
        hi_c = (hi - 32.0) * 5.0 / 9.0
        return round(hi_c, 1)

class WeatherStationMonitor:
    def __init__(self, window_size: int = 3):
        self.window_size = window_size
        self.history = deque(maxlen=window_size)
        self.all_observations: List[WeatherObservation] = []

    def process_reading(self, obs: WeatherObservation) -> Dict:
        if not obs.is_physically_valid():
            return {"status": "REJECTED", "reason": "Sensor bounds violation", "time": obs.time_label}

        self.history.append(obs)
        self.all_observations.append(obs)

        # 3-point rolling moving average for temperature
        smoothed_temp = sum(x.temp_c for x in self.history) / len(self.history)
        heat_idx = obs.calculate_heat_index()

        alerts = []
        if obs.wind_kmh >= 62.0:
            alerts.append(f"GALE WARNING ({obs.wind_kmh} km/h)")
        if heat_idx >= 41.0:
            alerts.append(f"EXTREME HEAT DANGER ({heat_idx}°C)")
        elif heat_idx >= 35.0:
            alerts.append(f"HEAT ADVISORY ({heat_idx}°C)")
        if obs.temp_c <= 0.0:
            alerts.append("FREEZE WARNING (Ice Hazard)")

        return {
            "time": obs.time_label,
            "raw_temp": obs.temp_c,
            "smoothed_temp": round(smoothed_temp, 2),
            "humidity": obs.humidity_pct,
            "pressure": obs.pressure_hpa,
            "heat_index": heat_idx,
            "alerts": alerts
        }

def run_case_study():
    monitor = WeatherStationMonitor(window_size=3)
    sample_feed = [
        WeatherObservation("08:00", 26.5, 65.0, 1013.2, 14.0),
        WeatherObservation("09:00", 29.0, 68.0, 1012.0, 18.5),
        WeatherObservation("10:00", 32.5, 75.0, 1010.5, 22.0),
        WeatherObservation("11:00", 36.0, 78.0, 1008.2, 35.0), # Extreme Heat Index
        WeatherObservation("12:00", 125.0, 80.0, 1005.0, 10.0), # Glitch sensor packet
        WeatherObservation("13:00", 34.0, 70.0, 998.0, 68.0), # Gale wind & pressure drop
    ]

    print("=" * 80)
    print(" METEOROLOGICAL TELEMETRY & EXTREME WEATHER MONITOR")
    print("=" * 80)
    print(f"{'Time':<7} | {'Temp(°C)':<9} | {'Smooth(°C)':<11} | {'Humidity':<9} | {'Heat Index':<11} | {'Alerts'}")
    print("-" * 80)

    for item in sample_feed:
        res = monitor.process_reading(item)
        if res.get("status") == "REJECTED":
            print(f"{res['time']:<7} | [PACKET DROPPED - INVALID SENSOR TELEMETRY: {res['reason']}]")
        else:
            alert_str = " | ".join(res["alerts"]) if res["alerts"] else "Normal Conditions"
            print(f"{res['time']:<7} | {res['raw_temp']:<9.1f} | {res['smoothed_temp']:<11.2f} | {res['humidity']:<8.1f}% | {res['heat_index']:<10.1f}°C | {alert_str}")
    
    print("=" * 80)

if __name__ == "__main__":
    run_case_study()
