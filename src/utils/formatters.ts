/**
 * Formatting utilities for numbers, units, currency, and percentages.
 * Adheres strictly to consistent academic & industrial engineering display standards.
 */

export function formatEnergy(kWh: number, decimals: number = 3): string {
  if (isNaN(kWh) || kWh === null) return '0.000 kWh';
  return `${kWh.toFixed(decimals)} kWh`;
}

export function formatCO2(kg: number, decimals: number = 3): string {
  if (isNaN(kg) || kg === null) return '0.000 kg';
  return `${kg.toFixed(decimals)} kg`;
}

export function formatCurrency(inr: number, decimals: number = 2): string {
  if (isNaN(inr) || inr === null) return '₹0.00';
  return `₹${inr.toFixed(decimals)}`;
}

export function formatPercent(val: number, decimals: number = 1): string {
  if (isNaN(val) || val === null) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatPower(watts: number): string {
  if (isNaN(watts) || watts === null) return '0 W';
  return `${Math.round(watts)} W`;
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || val === null) return '0';
  return val.toFixed(decimals);
}
