import { AppSettings } from '../types';

export const defaultSettings: AppSettings = {
  institution: "Siddaganga Institute of Technology, Tumakuru",
  monitoringDays: 7,
  fanPowerW: 60,
  lightPowerW: 20,
  emissionFactor: 0.710, // kg CO2/kWh - illustrative baseline based on CEA grid database
  electricityTariff: 8, // ₹ per kWh - BESCOM institutional tariff estimate
  interventionReductionPercent: 60,
  fansPerClassroom: 4,
  lightsPerClassroom: 6,
};
