# EcoClass – Smart Classroom Energy & Carbon Footprint Monitor
### An Activity-Based Learning (ABL) Curriculum Project
**Institution:** Siddaganga Institute of Technology (SIT), Tumakuru, Karnataka, India  
**Location on Disk:** `D:\evs`

---

## 1. Project Overview

**EcoClass** is a modern, responsive web application and digital sustainability dashboard built for an Activity-Based Learning (ABL) case study at **Siddaganga Institute of Technology (SIT), Tumakuru**.

The project addresses the real-world operational problem of **electricity wastage caused by ceiling fans and lighting fixtures left energized in empty academic classrooms** following lecture dismissal.

### Core Goals:
1. **Estimate Unnecessary Energy Wastage:** Convert observation duration (minutes) and appliance wattages into kilowatt-hours (kWh).
2. **Compute Scope 2 Carbon Emissions:** Quantify indirect greenhouse gas emissions using regional grid baseline factors (kg CO₂/kWh).
3. **Calculate Electricity Financial Cost:** Translate electrical loss into Indian Rupee (₹ INR) utility expenditures using BESCOM institutional tariffs.
4. **Identify Outlier Facilities:** Benchmark classroom-wise consumption across four representative halls (C101, C102, C103, C104).
5. **Interactive Intervention Simulation:** Model behavioral nudges (student energy stewards, doorway reminder signs) using an interactive 0%–100% reduction slider.
6. **Academic Reporting:** Generate a comprehensive 17-section formal ABL technical report exportable to CSV and print-ready PDF.

> **Data Classification Notice:**  
> All classroom observation logs in the default configuration represent a **SIMULATED DATASET FOR ABL DEMONSTRATION** and are not certified institutional physical measurements.

---

## 2. Technology Stack

* **Framework:** React 18 with Vite
* **Language:** TypeScript 5.6 (strict mode enabled, zero compiler errors)
* **Styling:** Tailwind CSS 3.4 (custom Forest Green & Teal theme)
* **Visualizations:** Recharts 2.13 (interactive line, bar, area, and donut charts)
* **Icons:** Lucide React
* **State & Persistence:** Local React state with browser `localStorage` synchronization for custom records and model settings
* **Exports:** Dynamic client-side CSV generation & browser print styles for academic reports

---

## 3. Mathematical Model & Engineering Equations

All computations are implemented centrally in `src/utils/calculations.ts` using full-precision unrounded floating point operations:

### 1. Total Event Power (Watts)
$$\text{Power (W)} = (\text{Fans} \times 60\text{ W}) + (\text{Lights} \times 20\text{ W})$$

### 2. Electrical Energy Wasted (kWh)
$$\text{Energy (kWh)} = \frac{\text{Power (W)} \times \left(\frac{\text{Duration (min)}}{60}\right)}{1000}$$

### 3. Scope 2 Grid Carbon Emissions (kg CO₂)
$$\text{CO}_2\text{ (kg)} = \text{Energy (kWh)} \times \text{Emission Factor (kg CO}_2\text{/kWh)}$$
*Default factor:* `0.710 kg CO₂/kWh` (derived from Central Electricity Authority CO₂ Baseline Database for the Indian Power Sector).

### 4. Electricity Expenditure (INR)
$$\text{Cost (₹)} = \text{Energy (kWh)} \times \text{Tariff (₹/kWh)}$$
*Default institutional tariff:* `₹8.00 per unit (kWh)` (based on Karnataka utility institutional slabs).

### 5. Intervention Savings Model
$$\text{Energy Saved (kWh)} = \text{Baseline Energy} \times \left(\frac{\text{Reduction \%}}{100}\right)$$
$$\text{Remaining Energy} = \text{Baseline Energy} - \text{Energy Saved}$$
$$\text{CO}_2\text{ Mitigated (kg)} = \text{Energy Saved} \times \text{Emission Factor}$$
$$\text{Money Saved (₹)} = \text{Energy Saved} \times \text{Tariff}$$

---

## 4. Recalculated Baseline Results (28 Event Records)

Recalculated dynamically from the exact 28 classroom observation records across Day 1 to Day 7:

| Metric | Recalculated Value | Notes |
| :--- | :--- | :--- |
| **Total Energy Wasted** | **3.387 kWh** | Total unmonitored runtime: 675 min |
| **Ceiling Fan Contribution** | **2.265 kWh (66.9%)** | Fans represent the primary target |
| **Lighting Contribution** | **1.122 kWh (33.1%)** | Luminaires share |
| **Estimated CO₂ Footprint** | **2.405 kg CO₂** | At 0.710 kg/kWh grid factor |
| **Estimated Electricity Cost** | **₹27.09** | At ₹8.00 / kWh tariff |
| **Savings at 60% Target** | **2.032 kWh (₹16.26 saved)** | Mitigates **1.443 kg CO₂** weekly |

### Classroom Breakdown:
* **Classroom C101:** 0.992 kWh (29.28% share) — *Highest consumption hall*
* **Classroom C104:** 0.833 kWh (24.61% share)
* **Classroom C102:** 0.800 kWh (23.62% share)
* **Classroom C103:** 0.762 kWh (22.49% share)

---

## 5. Application Architecture

```
D:\evs/
├── dist/                          # Production build output
├── node_modules/                  # Installed dependencies
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── about/
│   │   │   └── AboutProjectTab.tsx        # Problem, solution, benefits, IoT roadmap
│   │   ├── analytics/
│   │   │   └── EnergyAnalyticsTab.tsx     # 5 Recharts data visualizations
│   │   ├── carbon/
│   │   │   └── CarbonFootprintTab.tsx     # Emission equations & editable CEA factor
│   │   ├── classroom/
│   │   │   ├── ClassroomCard.tsx          # Room KPI cards
│   │   │   ├── ClassroomDetailModal.tsx   # Detailed room audit & daily chart
│   │   │   └── ClassroomMonitoringTab.tsx # Filterable classroom grid
│   │   ├── common/
│   │   │   ├── Badge.tsx                  # Status and indicator pills
│   │   │   ├── KpiCard.tsx                # Metric KPI display cards
│   │   │   └── SimulationBanner.tsx       # Mandatory ABL pedagogical disclaimer
│   │   ├── data-management/
│   │   │   ├── DataManagementTab.tsx      # Table with filter, search, CRUD
│   │   │   └── RecordModal.tsx            # Form modal with live calculation preview
│   │   ├── layout/
│   │   │   ├── Header.tsx                 # Brand, institution, status & report CTA
│   │   │   └── Sidebar.tsx                # 7-tab navigation & parameter card
│   │   ├── overview/
│   │   │   └── OverviewTab.tsx            # Executive KPI dashboard & insights
│   │   ├── report/
│   │   │   └── AblReportModal.tsx         # Full 17-section academic printable report
│   │   └── simulator/
│   │       └── SolutionSimulatorTab.tsx   # Interactive 0-100% intervention slider
│   ├── data/
│   │   ├── defaultSettings.ts             # Default power, factor, tariff constants
│   │   └── initialDataset.ts              # 28 simulated observation records
│   ├── types/
│   │   └── index.ts                       # TypeScript interfaces
│   ├── utils/
│   │   ├── calculations.ts                # Calculation & aggregation engine
│   │   ├── exportUtils.ts                 # CSV file generator & CSV parser
│   │   └── formatters.ts                  # Standardized engineering formatters
│   ├── App.tsx                            # Main application root & state machine
│   ├── index.css                          # Tailwind CSS base & print styles
│   └── main.tsx                           # Application entry point
├── index.html                             # HTML entry with Inter font
├── package.json                           # Dependencies & run scripts
├── postcss.config.js                      # PostCSS plugins
├── tailwind.config.js                     # Tailwind theme configurations
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite build configuration
```

---

## 6. How to Run the Application

### Prerequisites:
* Node.js v18 or later (Node v20.18.0 configured at `C:\Users\GAGANA\node`)
* npm v10 or later

### Steps:
1. Open PowerShell or Terminal and navigate to the project directory:
   ```powershell
   cd D:\evs
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

4. To build for production:
   ```powershell
   npm run build
   ```

5. To preview the production bundle:
   ```powershell
   npm run preview
   ```

---

## 7. Key Features Implemented

1. **Top Header & Navigation:**
   * SIT Tumakuru branding, simulated dataset badge, reporting period, and 1-click ABL Report modal button.
   * Responsive collapsible sidebar with mobile drawer.

2. **Dashboard Overview:**
   * 6 dynamically calculated KPI cards (Energy, CO₂, Cost, Rooms, Days, Potential Savings).
   * Visual progress split of fan vs. light wastage.
   * Highlight alert cards for high-wastage classroom (C101) and peak day (Day 5 & 4).

3. **Classroom Monitoring:**
   * Dedicated cards for C101, C102, C103, and C104 with percentage contributions.
   * Real-time classroom and Day 1–Day 7 filtering.
   * Modal drilldown displaying daily event records and a chronological stacked bar chart for each room.
   * Distinct clarification that event counts reflect logged occurrences, not unique physical hardware fixtures.

4. **Energy Analytics (Recharts):**
   * **Chart A:** Daily Energy Wastage (Line chart, Day 1–7, kWh).
   * **Chart B:** Classroom Comparison (Bar chart, C101–C104, kWh).
   * **Chart C:** Fan vs. Light Consumption Share (Donut chart).
   * **Chart D:** Daily Carbon Emissions (Area chart, kg CO₂).
   * **Chart E:** Daily Electricity Cost (Bar chart, INR).
   * Dynamic responsiveness to room and day filters.

5. **Carbon Footprint Page:**
   * Clear display of the Scope 2 emission formula.
   * Editable grid emission factor with reset-to-default button.
   * Citation of the Central Electricity Authority (CEA) CO₂ Baseline Database for the Indian Power Sector.
   * Clear distinction that fans/lights cause indirect grid emissions rather than direct exhaust gases.

6. **Solution Simulator (“What If We Reduce Wastage?”):**
   * Real-time slider from 0% to 100% (defaulting to 60%).
   * Live recalculation of energy saved, remaining energy, avoided CO₂, and money saved.
   * Before & After grouped bar chart comparing baseline against post-intervention levels.
   * Clear explanation that 60% is an illustrative modeled target rather than an automatically proven result.
   * Three behavioral intervention pillars detailed: Student Stewards, Doorway Reminder Signs, and Custodial Inspection Sweep.

7. **Data Management:**
   * Complete interactive data table with search by classroom and filter by day.
   * Full CRUD operations: Add Record, Edit Record, Delete Record.
   * Input validation preventing negative numbers or invalid values.
   * "Restore Original Simulated Dataset" button.
   * "Export CSV" and "Import CSV" features with data origin tracking (`simulated`, `measured`, `user-added`).

8. **Exportable ABL Technical Report:**
   * Complete 17-section formal academic report with title page, abstract, problem statement, objectives, scope, methodology, assumptions, step-by-step worked sample calculation, tables, intervention analysis, results, future scope, and references.
   * Browser print function (`window.print()`) with print CSS optimizing layout and hiding UI buttons.
   * CSV download button.

9. **About Project Page:**
   * Clear description of the problem, proposed solution, and expected institutional benefits.
   * Future hardware roadmap (PIR sensors, smart CT meters, automated relays, LoRaWAN campus dashboard) explicitly demarcated as future scope beyond the current software prototype.
