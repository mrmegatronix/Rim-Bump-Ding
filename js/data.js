/**
 * Rim-Bump-Ding: South Island Road Data & Seed Reports
 * Covers Te Wai Pounamu (South Island, New Zealand)
 */

const SOUTH_ISLAND_BOUNDS = {
  north: -40.50,
  south: -46.75,
  west: 166.40,
  east: 174.50,
  center: [-43.5321, 172.6362], // Christchurch center reference
  defaultZoom: 7
};

const HIGHWAYS = [
  { id: 'ALL', name: 'All Routes' },
  { id: 'SH1', name: 'SH1 (Picton - Bluff)' },
  { id: 'SH6', name: 'SH6 (Nelson - West Coast - Queenstown)' },
  { id: 'SH73', name: "SH73 (Arthur's Pass)" },
  { id: 'SH7', name: 'SH7 (Lewis Pass)' },
  { id: 'SH8', name: 'SH8 (Lindis Pass - Tekapo)' },
  { id: 'SH94', name: 'SH94 (Milford Road)' },
  { id: 'CR', name: 'Crown Range Rd' }
];

const SOUTH_ISLAND_JOURNEYS = [
  {
    id: 'chch_to_qt_arthurs',
    name: "Christchurch → Queenstown (via Arthur's Pass & West Coast)",
    shortName: "Chch → Queenstown (Arthur's)",
    highways: ['SH73', 'SH6', 'CR'],
    distanceKm: 590,
    estDriveTime: '7h 30m',
    keyPasses: ["Arthur's Pass", "Otira Gorge", "Haast Pass", "Crown Range"],
    waypoints: [
      [-43.5321, 172.6362], // Christchurch
      [-43.4889, 172.1092], // Darfield
      [-43.3375, 171.9297], // Springfield
      [-43.2322, 171.7167], // Castle Hill
      [-42.9431, 171.5647], // Arthur's Pass
      [-42.8272, 171.5583], // Otira Viaduct
      [-42.6108, 171.1892], // Kumara Jct
      [-42.7167, 170.9667], // Hokitika
      [-43.3889, 170.1833], // Franz Josef
      [-43.6000, 169.7833], // Fox Glacier
      [-44.1083, 169.3517], // Haast Pass
      [-44.4000, 169.1667], // Makaroa
      [-44.7000, 169.1500], // Wanaka
      [-44.9872, 168.9383], // Crown Range
      [-45.0312, 168.6626]  // Queenstown
    ]
  },
  {
    id: 'picton_to_chch',
    name: "Picton Ferry → Christchurch (SH1 Coastal)",
    shortName: "Picton → Christchurch (SH1)",
    highways: ['SH1'],
    distanceKm: 340,
    estDriveTime: '4h 15m',
    keyPasses: ["Wairau Valley", "Hundalee Hills"],
    waypoints: [
      [-41.2931, 174.0049], // Picton
      [-41.5134, 173.9612], // Blenheim
      [-41.8315, 174.1352], // Ward
      [-42.4000, 173.6811], // Kaikoura
      [-42.4418, 173.6429], // Peketa
      [-42.8139, 173.2725], // Cheviot
      [-43.1558, 172.7303], // Amberley
      [-43.5321, 172.6362]  // Christchurch
    ]
  },
  {
    id: 'chch_to_qt_lindis',
    name: "Christchurch → Queenstown (via Lindis Pass & Mackenzie)",
    shortName: "Chch → Queenstown (Lindis)",
    highways: ['SH1', 'SH8', 'CR'],
    distanceKm: 485,
    estDriveTime: '5h 45m',
    keyPasses: ["Burkes Pass", "Lindis Pass"],
    waypoints: [
      [-43.5321, 172.6362], // Christchurch
      [-43.7558, 171.9867], // Rakaia
      [-43.9084, 171.7483], // Ashburton
      [-44.0917, 171.2417], // Geraldine
      [-44.0047, 170.4772], // Lake Tekapo
      [-44.2583, 170.0983], // Twizel / Pukaki
      [-44.4925, 169.9658], // Omarama
      [-44.5878, 169.6425], // Lindis Pass
      [-44.8267, 169.4183], // Tarras
      [-45.0392, 169.1983], // Cromwell
      [-45.0312, 168.6626]  // Queenstown
    ]
  },
  {
    id: 'nelson_to_greymouth',
    name: "Nelson → Greymouth (via Buller Gorge & Coast)",
    shortName: "Nelson → Greymouth (SH6)",
    highways: ['SH6'],
    distanceKm: 285,
    estDriveTime: '3h 50m',
    keyPasses: ["Buller Gorge", "Punakaiki Coast"],
    waypoints: [
      [-41.2706, 173.2840], // Nelson
      [-41.4000, 173.0000], // Wakefield
      [-41.8000, 172.3333], // Murchison
      [-41.8667, 171.9833], // Inangahua
      [-41.8741, 171.8152], // Buller Gorge
      [-41.7500, 171.6000], // Westport
      [-42.1167, 171.3333], // Punakaiki
      [-42.4500, 171.2000]  // Greymouth
    ]
  },
  {
    id: 'qt_to_milford',
    name: "Queenstown → Milford Sound (Fiordland Alpine)",
    shortName: "Queenstown → Milford Sound",
    highways: ['SH6', 'SH94'],
    distanceKm: 290,
    estDriveTime: '4h 00m',
    keyPasses: ["Devil's Staircase", "Eglinton Valley", "Homer Tunnel"],
    waypoints: [
      [-45.0312, 168.6626], // Queenstown
      [-45.3333, 168.7167], // Kingston
      [-45.7333, 168.4333], // Lumsden
      [-45.6667, 168.1833], // Mossburn
      [-45.4167, 167.7167], // Te Anau
      [-45.0210, 168.0125], // Knobs Flat
      [-44.7644, 167.9819], // Homer Tunnel
      [-44.6714, 167.9261]  // Milford Sound
    ]
  },
  {
    id: 'chch_to_dunedin',
    name: "Christchurch → Dunedin (SH1 Coastal & Kilmog)",
    shortName: "Chch → Dunedin (SH1)",
    highways: ['SH1'],
    distanceKm: 360,
    estDriveTime: '4h 30m',
    keyPasses: ["Canterbury Plains", "Kilmog Hill"],
    waypoints: [
      [-43.5321, 172.6362], // Christchurch
      [-43.9084, 171.7483], // Ashburton
      [-44.3967, 171.2550], // Timaru
      [-45.0975, 170.9700], // Oamaru
      [-45.4833, 170.7167], // Palmerston
      [-45.7198, 170.6289], // Kilmog Hill
      [-45.8788, 170.5028]  // Dunedin
    ]
  },
  {
    id: 'dunedin_to_invercargill',
    name: "Dunedin → Invercargill (Southern Scenic)",
    shortName: "Dunedin → Invercargill",
    highways: ['SH1'],
    distanceKm: 215,
    estDriveTime: '2h 45m',
    keyPasses: ["Clutha Valley", "Southland Plains"],
    waypoints: [
      [-45.8788, 170.5028], // Dunedin
      [-46.1167, 169.9667], // Milton
      [-46.2333, 169.7500], // Balclutha
      [-46.1000, 168.9400], // Gore
      [-46.3167, 168.7833], // Edendale
      [-46.4131, 168.3475]  // Invercargill
    ]
  }
];

const SEVERITIES = {
  rim: {
    id: 'rim',
    label: 'Rim Bender',
    color: '#ef4444',
    badgeClass: 'border-rim',
    icon: '💥',
    desc: 'Severe / Rim damage risk / Deep crater'
  },
  bump: {
    id: 'bump',
    label: 'Bump',
    color: '#f97316',
    badgeClass: 'border-bump',
    icon: '⚠️',
    desc: 'Moderate / Heavy suspension shock'
  },
  ding: {
    id: 'ding',
    label: 'Ding',
    color: '#eab308',
    badgeClass: 'border-ding',
    icon: '⚡',
    desc: 'Minor / Surface chipping / Shallow'
  },
  repaired: {
    id: 'repaired',
    label: 'Repaired',
    color: '#10b981',
    badgeClass: 'border-repaired',
    icon: '✅',
    desc: 'Repaired by road crew'
  }
};

const SEED_REPORTS = [
  {
    id: 'rbd-101',
    highway: 'SH73',
    title: 'Huge crater past Otira Viaduct',
    description: 'Deep rim bender right on westbound apex after the rock shelter. Water filled, tyre sidewall hazard.',
    severity: 'rim',
    lat: -42.8272,
    lng: 171.5583,
    lane: 'Westbound',
    nearestTown: "Arthur's Pass",
    region: 'West Coast / Canterbury',
    confirms: 19,
    status: 'Verified',
    reportedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'rbd-102',
    highway: 'SH1',
    title: 'Cluster of tyre-eaters south of Kaikoura',
    description: 'Chain of 3 sharp holes directly in south lane wheel path near Peketa Beach.',
    severity: 'rim',
    lat: -42.4418,
    lng: 173.6429,
    lane: 'Southbound',
    nearestTown: 'Kaikoura',
    region: 'Canterbury',
    confirms: 34,
    status: 'Dispatched',
    reportedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'rbd-103',
    highway: 'SH6',
    title: 'Rough corrugated drops through Buller Gorge',
    description: 'Sunken seal edge and breaking pavement approaching Berlin\'s cafe curve.',
    severity: 'bump',
    lat: -41.8741,
    lng: 171.8152,
    lane: 'Both Lanes',
    nearestTown: 'Westport',
    region: 'Buller',
    confirms: 8,
    status: 'Reported',
    reportedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    hasPhoto: false
  },
  {
    id: 'rbd-104',
    highway: 'CR',
    title: 'Sharp hole on Crown Range summit switchback',
    description: 'Inside blind corner descent towards Cardrona. Loose aggregate scattered across tarmac.',
    severity: 'rim',
    lat: -44.9872,
    lng: 168.9383,
    lane: 'Northbound',
    nearestTown: 'Cardrona / Wanaka',
    region: 'Otago',
    confirms: 27,
    status: 'Verified',
    reportedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'rbd-105',
    highway: 'SH8',
    title: 'Frost heave break on Lindis Pass crest',
    description: 'Frost expansion crack opened into 80mm drop. Marked with temporary cone but cone knocked into ditch.',
    severity: 'bump',
    lat: -44.5878,
    lng: 169.6425,
    lane: 'Eastbound',
    nearestTown: 'Omarama / Tarras',
    region: 'Canterbury / Otago',
    confirms: 14,
    status: 'Dispatched',
    reportedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    hasPhoto: false
  },
  {
    id: 'rbd-106',
    highway: 'SH1',
    title: 'Ashburton river bridge approach chatter',
    description: 'Surface chipping and minor depression approaching northern expansion joint.',
    severity: 'ding',
    lat: -43.9084,
    lng: 171.7483,
    lane: 'Southbound',
    nearestTown: 'Ashburton',
    region: 'Canterbury',
    confirms: 5,
    status: 'Reported',
    reportedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    hasPhoto: false
  },
  {
    id: 'rbd-107',
    highway: 'SH94',
    title: 'Eglinton Valley frost split patched',
    description: 'Fulton Hogan asphalt team cold-mix patched the deep hole near Knob\'s Flat.',
    severity: 'repaired',
    lat: -45.0210,
    lng: 168.0125,
    lane: 'Both Lanes',
    nearestTown: 'Te Anau',
    region: 'Southland',
    confirms: 41,
    status: 'Repaired',
    reportedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    hasPhoto: false
  },
  {
    id: 'rbd-108',
    highway: 'SH1',
    title: 'Kilmog hill northbound crawl lane hole',
    description: 'Deep divot on inside heavy vehicle track climbing Kilmog towards Dunedin.',
    severity: 'rim',
    lat: -45.7198,
    lng: 170.6289,
    lane: 'Northbound',
    nearestTown: 'Dunedin / Waikouaiti',
    region: 'Otago',
    confirms: 23,
    status: 'Dispatched',
    reportedAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=60'
  }
];

const DISPATCH_CONTACTS = {
  wakaKotahi: {
    agency: 'Waka Kotahi NZTA State Highways',
    phone: '0800 4 HIGHWAYS (0800 44 44 49)',
    hotline: '0800444449',
    website: 'https://www.journeys.nzta.govt.nz'
  },
  christchurch: {
    agency: 'Christchurch City Council Roading',
    phone: '03 941 8999',
    hotline: '039418999'
  },
  dunedin: {
    agency: 'Dunedin City Council Transport',
    phone: '03 477 4000',
    hotline: '034774000'
  },
  queenstown: {
    agency: 'Queenstown Lakes District Council',
    phone: '03 441 0499',
    hotline: '034410499'
  },
  westCoast: {
    agency: 'West Coast Regional Transport Ops',
    phone: '03 768 0466',
    hotline: '037680466'
  }
};
