import { CalculatedRecord, EnergyRecord } from '../types';

/**
 * Converts calculated records to a CSV string and downloads it as a file.
 */
export function exportRecordsToCSV(records: CalculatedRecord[], filename = 'ecoclass_classroom_energy_data.csv'): void {
  const headers = [
    'Day',
    'Classroom',
    'Fans_Left_ON',
    'Lights_Left_ON',
    'Duration_Minutes',
    'Calculated_Power_Watts',
    'Calculated_Energy_kWh',
    'Fan_Energy_kWh',
    'Light_Energy_kWh',
    'Estimated_CO2_kg',
    'Estimated_Cost_INR',
    'Data_Source'
  ];

  const rows = records.map(r => [
    r.day,
    `"${r.classroom}"`,
    r.fans,
    r.lights,
    r.minutes,
    r.totalPowerW.toFixed(1),
    r.energyKWh.toFixed(4),
    r.fanEnergyKWh.toFixed(4),
    r.lightEnergyKWh.toFixed(4),
    r.co2Kg.toFixed(4),
    r.costINR.toFixed(2),
    `"${r.sourceType || 'simulated'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses user-uploaded CSV text into EnergyRecord array with validation.
 */
export function parseCSVToRecords(csvText: string, defaultSourceType: 'measured' | 'user-added' = 'user-added'): { records: EnergyRecord[], errors: string[] } {
  const lines = csvText.trim().split(/\r\n|\n/);
  const records: EnergyRecord[] = [];
  const errors: string[] = [];

  if (lines.length <= 1) {
    return { records: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  // Detect header indices
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

  const dayIdx = headers.findIndex(h => h.includes('day'));
  const classIdx = headers.findIndex(h => h.includes('class') || h.includes('room'));
  const fansIdx = headers.findIndex(h => h.includes('fan'));
  const lightsIdx = headers.findIndex(h => h.includes('light'));
  const minIdx = headers.findIndex(h => h.includes('min') || h.includes('time') || h.includes('duration'));
  const sourceIdx = headers.findIndex(h => h.includes('source') || h.includes('type'));

  if (dayIdx === -1 || classIdx === -1 || fansIdx === -1 || lightsIdx === -1 || minIdx === -1) {
    return {
      records: [],
      errors: ['Invalid CSV headers. Required headers: day, classroom, fans, lights, minutes.'],
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const parts = rawLine.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length < 5) {
      errors.push(`Row ${i + 1}: Insufficient columns.`);
      continue;
    }

    const day = parseInt(parts[dayIdx], 10);
    const classroom = parts[classIdx].toUpperCase();
    const fans = parseInt(parts[fansIdx], 10);
    const lights = parseInt(parts[lightsIdx], 10);
    const minutes = parseInt(parts[minIdx], 10);
    const sourceType = (sourceIdx !== -1 && parts[sourceIdx]) ? (parts[sourceIdx] as any) : defaultSourceType;

    if (isNaN(day) || day < 1 || day > 365) {
      errors.push(`Row ${i + 1}: Day must be a positive integer.`);
      continue;
    }
    if (!classroom) {
      errors.push(`Row ${i + 1}: Classroom cannot be empty.`);
      continue;
    }
    if (isNaN(fans) || fans < 0) {
      errors.push(`Row ${i + 1}: Fan count cannot be negative.`);
      continue;
    }
    if (isNaN(lights) || lights < 0) {
      errors.push(`Row ${i + 1}: Light count cannot be negative.`);
      continue;
    }
    if (isNaN(minutes) || minutes <= 0) {
      errors.push(`Row ${i + 1}: Minutes must be greater than 0.`);
      continue;
    }

    records.push({
      id: `imported-${Date.now()}-${i}`,
      day,
      classroom,
      fans,
      lights,
      minutes,
      sourceType: sourceType === 'simulated' ? 'simulated' : (sourceType === 'measured' ? 'measured' : 'user-added')
    });
  }

  return { records, errors };
}
