import { EnergyRecord, CalculatedRecord, AppSettings, ClassroomSummary, OverallSummary, DailySummary } from '../types';

/**
 * Calculates metrics for an individual record using the project's exact physics formulas.
 * All internal values are unrounded floats for maximum mathematical precision.
 */
export function calculateRecord(record: EnergyRecord, settings: AppSettings, index?: number): CalculatedRecord {
  const fanPowerW = record.fans * settings.fanPowerW;
  const lightPowerW = record.lights * settings.lightPowerW;
  const totalPowerW = fanPowerW + lightPowerW;

  const hours = record.minutes / 60;
  const fanEnergyKWh = (fanPowerW * hours) / 1000;
  const lightEnergyKWh = (lightPowerW * hours) / 1000;
  const energyKWh = (totalPowerW * hours) / 1000;

  const co2Kg = energyKWh * settings.emissionFactor;
  const costINR = energyKWh * settings.electricityTariff;

  const id = record.id || `rec-${record.day}-${record.classroom}-${index ?? Math.random().toString(36).substring(2, 9)}`;

  return {
    ...record,
    id,
    fanPowerW,
    lightPowerW,
    totalPowerW,
    fanEnergyKWh,
    lightEnergyKWh,
    energyKWh,
    co2Kg,
    costINR,
  };
}

/**
 * Calculates enriched records for an entire dataset.
 */
export function calculateAllRecords(dataset: EnergyRecord[], settings: AppSettings): CalculatedRecord[] {
  return dataset.map((rec, idx) => calculateRecord(rec, settings, idx));
}

/**
 * Aggregates classroom-wise metrics.
 */
export function calculateClassroomSummaries(
  records: CalculatedRecord[],
  _settings?: AppSettings
): ClassroomSummary[] {
  const map = new Map<string, {
    totalEvents: number;
    totalMinutes: number;
    totalFansOn: number;
    totalLightsOn: number;
    totalEnergyKWh: number;
    fanEnergyKWh: number;
    lightEnergyKWh: number;
    totalCO2Kg: number;
    totalCostINR: number;
  }>();

  let grandTotalEnergyKWh = 0;

  records.forEach(r => {
    grandTotalEnergyKWh += r.energyKWh;
    const current = map.get(r.classroom) || {
      totalEvents: 0,
      totalMinutes: 0,
      totalFansOn: 0,
      totalLightsOn: 0,
      totalEnergyKWh: 0,
      fanEnergyKWh: 0,
      lightEnergyKWh: 0,
      totalCO2Kg: 0,
      totalCostINR: 0,
    };

    current.totalEvents += 1;
    current.totalMinutes += r.minutes;
    current.totalFansOn += r.fans;
    current.totalLightsOn += r.lights;
    current.totalEnergyKWh += r.energyKWh;
    current.fanEnergyKWh += r.fanEnergyKWh;
    current.lightEnergyKWh += r.lightEnergyKWh;
    current.totalCO2Kg += r.co2Kg;
    current.totalCostINR += r.costINR;

    map.set(r.classroom, current);
  });

  const summaries: ClassroomSummary[] = [];
  const classrooms = Array.from(map.keys()).sort();

  for (const c of classrooms) {
    const data = map.get(c)!;
    const percentage = grandTotalEnergyKWh > 0 ? (data.totalEnergyKWh / grandTotalEnergyKWh) * 100 : 0;
    summaries.push({
      classroom: c,
      ...data,
      percentageContribution: percentage,
    });
  }

  return summaries;
}

/**
 * Aggregates overall campus summary and intervention simulation metrics.
 */
export function calculateOverallSummary(
  records: CalculatedRecord[],
  settings: AppSettings,
  interventionPercentOverride?: number
): OverallSummary {
  const interventionPercent = interventionPercentOverride ?? settings.interventionReductionPercent;

  let totalEnergyKWh = 0;
  let totalFansKWh = 0;
  let totalLightsKWh = 0;

  const classroomsSet = new Set<string>();
  const daysSet = new Set<number>();

  records.forEach(r => {
    totalEnergyKWh += r.energyKWh;
    totalFansKWh += r.fanEnergyKWh;
    totalLightsKWh += r.lightEnergyKWh;
    classroomsSet.add(r.classroom);
    daysSet.add(r.day);
  });

  const totalCO2Kg = totalEnergyKWh * settings.emissionFactor;
  const totalCostINR = totalEnergyKWh * settings.electricityTariff;

  const monitoredClassroomsCount = classroomsSet.size || 1;
  const monitoringDaysCount = daysSet.size || 1;
  const totalEventsCount = records.length;

  const avgDailyEnergyKWh = totalEnergyKWh / (monitoringDaysCount || 1);
  const avgClassroomDailyEnergyKWh = totalEnergyKWh / ((monitoredClassroomsCount * monitoringDaysCount) || 1);

  const potentialEnergySavedKWh = (totalEnergyKWh * interventionPercent) / 100;
  const remainingEnergyKWh = Math.max(0, totalEnergyKWh - potentialEnergySavedKWh);
  const potentialCO2AvoidedKg = potentialEnergySavedKWh * settings.emissionFactor;
  const remainingCO2Kg = remainingEnergyKWh * settings.emissionFactor;
  const potentialMoneySavedINR = potentialEnergySavedKWh * settings.electricityTariff;
  const remainingCostINR = remainingEnergyKWh * settings.electricityTariff;

  return {
    totalEnergyKWh,
    totalCO2Kg,
    totalCostINR,
    totalFansKWh,
    totalLightsKWh,
    monitoredClassroomsCount,
    monitoringDaysCount,
    totalEventsCount,
    avgDailyEnergyKWh,
    avgClassroomDailyEnergyKWh,
    potentialEnergySavedKWh,
    potentialCO2AvoidedKg,
    potentialMoneySavedINR,
    remainingEnergyKWh,
    remainingCO2Kg,
    remainingCostINR,
  };
}

/**
 * Aggregates day-wise metrics (Day 1 through Day 7).
 */
export function calculateDailySummaries(
  records: CalculatedRecord[],
  totalDays: number = 7
): DailySummary[] {
  const map = new Map<number, DailySummary>();

  for (let i = 1; i <= totalDays; i++) {
    map.set(i, {
      day: i,
      dayLabel: `Day ${i}`,
      energyKWh: 0,
      fanEnergyKWh: 0,
      lightEnergyKWh: 0,
      co2Kg: 0,
      costINR: 0,
      eventsCount: 0,
    });
  }

  records.forEach(r => {
    const entry = map.get(r.day) || {
      day: r.day,
      dayLabel: `Day ${r.day}`,
      energyKWh: 0,
      fanEnergyKWh: 0,
      lightEnergyKWh: 0,
      co2Kg: 0,
      costINR: 0,
      eventsCount: 0,
    };

    entry.energyKWh += r.energyKWh;
    entry.fanEnergyKWh += r.fanEnergyKWh;
    entry.lightEnergyKWh += r.lightEnergyKWh;
    entry.co2Kg += r.co2Kg;
    entry.costINR += r.costINR;
    entry.eventsCount += 1;

    map.set(r.day, entry);
  });

  return Array.from(map.values()).sort((a, b) => a.day - b.day);
}
