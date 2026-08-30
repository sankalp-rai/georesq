# GeoResQ

GeoResQ is a geospatial disaster intelligence and response platform.

It helps identify high-risk areas, understand population exposure, check available resources and find suitable response routes.

Currently the project is demonstrated using the Assam Flood 2026 scenario with prototype data.

## What it does

- Interactive disaster map
- Flood risk analysis
- Population & vulnerability analysis
- Hospitals and shelters
- Resource gap analysis
- Road accessibility
- Rescue route optimization
- Scenario selection
- AI Response Copilot

## Tech Stack

React, Vite, Tailwind CSS  
Leaflet + React-Leaflet  
OpenStreetMap  
JavaScript  
Dijkstra's Algorithm  
Git + GitHub

## Basic Workflow

```text
Disaster Data
   ↓
Risk Analysis
   ↓
Population / Vulnerability
   ↓
Resources
   ↓
Roads
   ↓
Route
   ↓
Response Plan
```

## Run

```bash
npm install
npm run dev
```

For production build:

```bash
npm run build
```

## Current Status

Working prototype.

Most of the current disaster, population, resource and road data is illustrative and used for demonstration.

## Future

- FastAPI backend
- PostgreSQL + PostGIS
- Real disaster datasets
- Real-time data
- More disaster scenarios

> Built as a disaster management prototype for SIH.