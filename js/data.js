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
