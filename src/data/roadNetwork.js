// Illustrative prototype road graph for the Assam flood case study. It is not
// a navigational dataset and must not be used for live emergency routing.

export const roadNodes = [
  { id: 'barpeta-hospital-node', name: 'Barpeta Relief Health Centre', coordinates: [26.322, 91.007], hospitalId: 'barpeta-hospital' },
  { id: 'barpeta-zone-node', name: 'Barpeta Lowlands', coordinates: [26.45, 91.17], zoneId: 'barpeta-lowlands' },
  { id: 'morigaon-hospital-node', name: 'Morigaon Emergency Health Point', coordinates: [26.29, 92.29], hospitalId: 'morigaon-hospital' },
  { id: 'morigaon-zone-node', name: 'Morigaon Char Areas', coordinates: [26.3, 92.28], zoneId: 'morigaon-char' },
  { id: 'nagaon-hospital-node', name: 'Nagaon District Medical Point', coordinates: [26.46, 92.75], hospitalId: 'nagaon-hospital' },
  { id: 'nagaon-zone-node', name: 'Nagaon Flood Corridor', coordinates: [26.46, 92.7], zoneId: 'nagaon-corridor' },
  { id: 'lakhimpur-hospital-node', name: 'North Lakhimpur Medical Point', coordinates: [27.236, 94.103], hospitalId: 'lakhimpur-hospital' },
  { id: 'lakhimpur-zone-node', name: 'Lakhimpur Floodplain Belt', coordinates: [27.15, 94.18], zoneId: 'lakhimpur-belt' },
  { id: 'dhemaji-hospital-node', name: 'Dhemaji Medical Coordination Point', coordinates: [27.48, 94.57], hospitalId: 'dhemaji-medical' },
  { id: 'dhemaji-zone-node', name: 'Dhemaji Riverine Sector', coordinates: [27.43, 94.54], zoneId: 'dhemaji-riverine' },
]

export const roadNetwork = [
  { id: 'r1', name: 'Barpeta Health Link', from: 'barpeta-hospital-node', to: 'barpeta-zone-node', distanceKm: 24, status: 'Open', riskLevel: 'Low', coordinates: [[26.322, 91.007], [26.4, 91.08], [26.45, 91.17]], zoneIds: ['barpeta-lowlands'] },
  { id: 'r2', name: 'Barpeta–Morigaon Corridor', from: 'barpeta-zone-node', to: 'morigaon-hospital-node', distanceKm: 118, status: 'Restricted', riskLevel: 'High', coordinates: [[26.45, 91.17], [26.35, 91.72], [26.29, 92.29]], zoneIds: ['barpeta-lowlands', 'morigaon-char'] },
  { id: 'r3', name: 'Morigaon Local Access', from: 'morigaon-hospital-node', to: 'morigaon-zone-node', distanceKm: 4, status: 'Open', riskLevel: 'Low', coordinates: [[26.29, 92.29], [26.3, 92.28]], zoneIds: ['morigaon-char'] },
  { id: 'r4', name: 'Morigaon–Nagaon Relief Road', from: 'morigaon-zone-node', to: 'nagaon-hospital-node', distanceKm: 68, status: 'Open', riskLevel: 'Medium', coordinates: [[26.3, 92.28], [26.39, 92.5], [26.46, 92.75]], zoneIds: ['morigaon-char', 'nagaon-corridor'] },
  { id: 'r5', name: 'Nagaon District Access', from: 'nagaon-hospital-node', to: 'nagaon-zone-node', distanceKm: 4, status: 'Open', riskLevel: 'Low', coordinates: [[26.46, 92.75], [26.46, 92.7]], zoneIds: ['nagaon-corridor'] },
  { id: 'r6', name: 'Nagaon–Lakhimpur Corridor', from: 'nagaon-zone-node', to: 'lakhimpur-hospital-node', distanceKm: 152, status: 'Open', riskLevel: 'Medium', coordinates: [[26.46, 92.7], [26.85, 93.35], [27.236, 94.103]], zoneIds: ['nagaon-corridor', 'lakhimpur-belt'] },
  { id: 'r7', name: 'Lakhimpur Hospital Access', from: 'lakhimpur-hospital-node', to: 'lakhimpur-zone-node', distanceKm: 12, status: 'Open', riskLevel: 'Low', coordinates: [[27.236, 94.103], [27.15, 94.18]], zoneIds: ['lakhimpur-belt'] },
  { id: 'r8', name: 'Lakhimpur–Dhemaji Relief Road', from: 'lakhimpur-zone-node', to: 'dhemaji-hospital-node', distanceKm: 45, status: 'Open', riskLevel: 'Medium', coordinates: [[27.15, 94.18], [27.32, 94.38], [27.48, 94.57]], zoneIds: ['lakhimpur-belt', 'dhemaji-riverine'] },
  { id: 'r9', name: 'Dhemaji Local Access', from: 'dhemaji-hospital-node', to: 'dhemaji-zone-node', distanceKm: 3, status: 'Open', riskLevel: 'Low', coordinates: [[27.48, 94.57], [27.43, 94.54]], zoneIds: ['dhemaji-riverine'] },
  { id: 'r10', name: 'Barpeta–Nagaon Highway', from: 'barpeta-zone-node', to: 'nagaon-zone-node', distanceKm: 172, status: 'Blocked', riskLevel: 'High', coordinates: [[26.45, 91.17], [26.5, 91.95], [26.46, 92.7]], zoneIds: ['barpeta-lowlands', 'nagaon-corridor'] },
  { id: 'r11', name: 'Morigaon–Lakhimpur Alternative', from: 'morigaon-zone-node', to: 'lakhimpur-zone-node', distanceKm: 168, status: 'Open', riskLevel: 'Low', coordinates: [[26.3, 92.28], [26.72, 93.2], [27.15, 94.18]], zoneIds: ['morigaon-char', 'lakhimpur-belt'] },
  { id: 'r12', name: 'Nagaon–Lakhimpur Service Road', from: 'nagaon-hospital-node', to: 'lakhimpur-zone-node', distanceKm: 139, status: 'Restricted', riskLevel: 'High', coordinates: [[26.46, 92.75], [26.86, 93.47], [27.15, 94.18]], zoneIds: ['nagaon-corridor', 'lakhimpur-belt'] },
  { id: 'r13', name: 'Dhemaji Emergency Bypass', from: 'lakhimpur-hospital-node', to: 'dhemaji-hospital-node', distanceKm: 58, status: 'Restricted', riskLevel: 'Medium', coordinates: [[27.236, 94.103], [27.37, 94.32], [27.48, 94.57]], zoneIds: ['lakhimpur-belt', 'dhemaji-riverine'] },
  { id: 'r14', name: 'Barpeta Safe Relief Bypass', from: 'barpeta-hospital-node', to: 'morigaon-hospital-node', distanceKm: 145, status: 'Open', riskLevel: 'Low', coordinates: [[26.322, 91.007], [26.31, 91.63], [26.29, 92.29]], zoneIds: ['barpeta-lowlands', 'morigaon-char'] },
]
