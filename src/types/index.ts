export interface EnergyRecord {
  id?: string;
  day: number;
  classroom: string;
  fans: number;
  lights: number;
  minutes: number;
  sourceType?: 'simulated' | 'measured' | 'user-added';
}

export interface CalculatedRecord extends EnergyRecord {
  id: string;
  fanPowerW: number;
  lightPowerW: number;
  totalPowerW: number;
  energyKWh: number;
  fanEnergyKWh: number;
  lightEnergyKWh: number;
  co2Kg: number;
  costINR: number;
}

export interface AppSettings {
  institution: string;
  monitoringDays: number;
  fanPowerW: number;
  lightPowerW: number;
  emissionFactor: number; // kg CO2/kWh
  electricityTariff: number; // INR per kWh
  interventionReductionPercent: number; // default 60%
  fansPerClassroom: number;
  lightsPerClassroom: number;
}

export interface ClassroomSummary {
  classroom: string;
  totalEvents: number;
  totalMinutes: number;
  totalFansOn: number;
  totalLightsOn: number;
  totalEnergyKWh: number;
  fanEnergyKWh: number;
  lightEnergyKWh: number;
  totalCO2Kg: number;
  totalCostINR: number;
  percentageContribution: number;
}

export interface DailySummary {
  day: number;
  dayLabel: string;
  energyKWh: number;
  fanEnergyKWh: number;
  lightEnergyKWh: number;
  co2Kg: number;
  costINR: number;
  eventsCount: number;
}

export interface OverallSummary {
  totalEnergyKWh: number;
  totalCO2Kg: number;
  totalCostINR: number;
  totalFansKWh: number;
  totalLightsKWh: number;
  monitoredClassroomsCount: number;
  monitoringDaysCount: number;
  totalEventsCount: number;
  avgDailyEnergyKWh: number;
  avgClassroomDailyEnergyKWh: number;
  potentialEnergySavedKWh: number;
  potentialCO2AvoidedKg: number;
  potentialMoneySavedINR: number;
  remainingEnergyKWh: number;
  remainingCO2Kg: number;
  remainingCostINR: number;
}

export type ActiveTab = 
  | 'overview' 
  | 'classroom' 
  | 'analytics' 
  | 'carbon' 
  | 'simulator' 
  | 'data' 
  | 'about';
