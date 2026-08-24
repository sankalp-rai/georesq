// Illustrative prototype resource data for the Assam flood case study only.
// It is not live operational information or a disaster-planning source.

export const hospitals = [
  { id: 'dhemaji-medical', name: 'Dhemaji Medical Coordination Point', type: 'District hospital', latitude: 27.48, longitude: 94.57, capacity: 400, availableCapacity: 72, emergencyReady: true, zoneId: 'dhemaji-riverine' },
  { id: 'lakhimpur-hospital', name: 'North Lakhimpur Medical Point', type: 'District hospital', latitude: 27.236, longitude: 94.103, capacity: 300, availableCapacity: 86, emergencyReady: true, zoneId: 'lakhimpur-belt' },
  { id: 'barpeta-hospital', name: 'Barpeta Relief Health Centre', type: 'Field health centre', latitude: 26.322, longitude: 91.007, capacity: 250, availableCapacity: 60, emergencyReady: true, zoneId: 'barpeta-lowlands' },
  { id: 'morigaon-hospital', name: 'Morigaon Emergency Health Point', type: 'Community hospital', latitude: 26.29, longitude: 92.29, capacity: 180, availableCapacity: 38, emergencyReady: false, zoneId: 'morigaon-char' },
  { id: 'nagaon-hospital', name: 'Nagaon District Medical Point', type: 'District hospital', latitude: 26.46, longitude: 92.75, capacity: 220, availableCapacity: 55, emergencyReady: true, zoneId: 'nagaon-corridor' },
]

export const reliefShelters = [
  { id: 'dhemaji-shelter', name: 'Dhemaji Sector 3 Relief Shelter', capacity: 850, occupied: 770, availableCapacity: 80, latitude: 27.48, longitude: 94.54, zoneId: 'dhemaji-riverine' },
  { id: 'lakhimpur-shelter', name: 'Lakhimpur Riverside Relief Shelter', capacity: 620, occupied: 530, availableCapacity: 90, latitude: 27.15, longitude: 94.18, zoneId: 'lakhimpur-belt' },
  { id: 'barpeta-shelter', name: 'Barpeta Community Relief Shelter', capacity: 400, occupied: 330, availableCapacity: 70, latitude: 26.45, longitude: 91.17, zoneId: 'barpeta-lowlands' },
  { id: 'morigaon-shelter', name: 'Morigaon Community Relief Shelter', capacity: 540, occupied: 480, availableCapacity: 60, latitude: 26.3, longitude: 92.28, zoneId: 'morigaon-char' },
  { id: 'nagaon-shelter', name: 'Nagaon Transit Relief Shelter', capacity: 430, occupied: 220, availableCapacity: 210, latitude: 26.46, longitude: 92.75, zoneId: 'nagaon-corridor' },
]

export const rescueTeams = [
  { id: 'dhemaji-ndrf', name: 'Dhemaji Water Rescue Team', teamType: 'Water rescue', personnel: 28, status: 'Deployed', baseZoneId: 'dhemaji-riverine' },
  { id: 'dhemaji-support', name: 'Dhemaji Boat Support Team', teamType: 'Boat operations', personnel: 16, status: 'Available', baseZoneId: 'dhemaji-riverine' },
  { id: 'lakhimpur-ndrf', name: 'Lakhimpur NDRF Unit', teamType: 'Search and rescue', personnel: 24, status: 'Available', baseZoneId: 'lakhimpur-belt' },
  { id: 'barpeta-response', name: 'Barpeta Response Team', teamType: 'Evacuation', personnel: 18, status: 'Standby', baseZoneId: 'barpeta-lowlands' },
  { id: 'morigaon-response', name: 'Morigaon River Team', teamType: 'Water rescue', personnel: 20, status: 'Deployed', baseZoneId: 'morigaon-char' },
  { id: 'nagaon-response', name: 'Nagaon Response Team', teamType: 'Evacuation', personnel: 17, status: 'Available', baseZoneId: 'nagaon-corridor' },
]

export const reliefUnits = [
  { id: 'dhemaji-supplies', name: 'Dhemaji Supply Unit', supplies: 'Food and water kits', quantity: 900, status: 'Deployed', baseZoneId: 'dhemaji-riverine' },
  { id: 'lakhimpur-supplies', name: 'Lakhimpur Supply Unit', supplies: 'Family shelter kits', quantity: 700, status: 'Available', baseZoneId: 'lakhimpur-belt' },
  { id: 'barpeta-supplies', name: 'Barpeta Supply Unit', supplies: 'Medical and hygiene kits', quantity: 500, status: 'Standby', baseZoneId: 'barpeta-lowlands' },
  { id: 'morigaon-supplies', name: 'Morigaon Supply Unit', supplies: 'Food and water kits', quantity: 600, status: 'Deployed', baseZoneId: 'morigaon-char' },
  { id: 'nagaon-supplies', name: 'Nagaon Supply Unit', supplies: 'Family shelter kits', quantity: 450, status: 'Available', baseZoneId: 'nagaon-corridor' },
]
