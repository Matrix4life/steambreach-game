// ═══════════════════════════════════════════════════════════════
// STEAMBREACH — RIG PARTS DATABASE & MARKET ENGINE
// ═══════════════════════════════════════════════════════════════

// ─── GENERATIONS (compatibility tags) ─────────────────────────
export const GENS = {
  GEN2: { id: 'GEN2', label: 'GEN-2', color: '#727072', tier: 2 },
  GEN3: { id: 'GEN3', label: 'GEN-3', color: '#78dce8', tier: 3 },
  GEN4: { id: 'GEN4', label: 'GEN-4', color: '#a9dc76', tier: 4 },
  GEN5: { id: 'GEN5', label: 'GEN-5', color: '#ffd866', tier: 5 },
  XGEN: { id: 'XGEN', label: 'X-GEN', color: '#ab9df2', tier: 0 }, // universal — always +1 synergy
};

// ─── MANUFACTURERS ────────────────────────────────────────────
export const MAKERS = {
  NEXUS:   { id: 'NEXUS',   name: 'Nexus Dynamics',  color: '#5a7a8a', desc: 'Budget reliable hardware' },
  CIPHER:  { id: 'CIPHER',  name: 'Cipher Systems',  color: '#78dce8', desc: 'Mid-range, great value' },
  PHANTOM: { id: 'PHANTOM', name: 'Phantom Tech',     color: '#a9dc76', desc: 'High-performance gear' },
  KRONOS:  { id: 'KRONOS',  name: 'Kronos Labs',      color: '#ffd866', desc: 'Elite bleeding edge' },
  FORGE:   { id: 'FORGE',   name: 'Quantum Forge',    color: '#ab9df2', desc: 'Exotic black-market mods' },
};

// ─── SLOT DEFINITIONS ─────────────────────────────────────────
export const SLOTS = ['cpu','gpu','ram','ssd','psu','cool','net','case'];
export const SLOT_LABELS = {
  cpu: 'CPU', gpu: 'GPU', ram: 'RAM', ssd: 'SSD',
  psu: 'PSU', cool: 'COOLING', net: 'NETWORK', case: 'CASE',
};

// ─── COMPATIBILITY PAIRS (checked for synergy) ────────────────
const COMPAT_PAIRS = [
  ['cpu','ram'],   // most critical — wrong gen = big bottleneck
  ['cpu','gpu'],   // important — processing pipeline
  ['gpu','psu'],   // GPU needs adequate power
  ['gpu','cool'],  // high-end GPUs need cooling
  ['ram','ssd'],   // memory/storage bandwidth
  ['cpu','cool'],  // high-end CPUs need cooling
];

// ═══════════════════════════════════════════════════════════════
// PARTS DATABASE — 10+ per slot
// Each part: id, name, slot, gen, maker, stats, basePrice,
//            volatility, rarity, power (watts drawn), desc
// ═══════════════════════════════════════════════════════════════

const p = (id, name, slot, gen, maker, stats, basePrice, volatility, rarity, power, desc) =>
  ({ id, name, slot, gen, maker, stats, basePrice, volatility, rarity, power, desc });

export const PARTS_DB = [

  // ─── CPU ──────────────────────────────────────────────────
  p('cpu_nx_2200',  'NX Dual-Thread 2200',    'cpu','GEN2','NEXUS',  {clock:1.0,threads:2},   3000, 0.3, 'common',    45,  'Entry-level dual-core. Runs nmap, barely.'),
  p('cpu_nx_3400',  'NX Quad-Core 3400',      'cpu','GEN2','NEXUS',  {clock:1.3,threads:4},   6000, 0.3, 'common',    55,  'Budget quad. Handles basic hashcat.'),
  p('cpu_ci_4600',  'Cipher i5 MK3',          'cpu','GEN3','CIPHER', {clock:1.6,threads:6},   18000,0.25,'common',    75,  'Solid mid-range. 6 threads for parallel ops.'),
  p('cpu_ci_5800',  'Cipher i7 Hexa',         'cpu','GEN3','CIPHER', {clock:1.9,threads:8},   32000,0.25,'uncommon',  95,  'The workhorse. Handles most cracking jobs.'),
  p('cpu_ci_6200',  'Cipher Xeon E3',         'cpu','GEN3','CIPHER', {clock:1.7,threads:8},   28000,0.2, 'uncommon',  85,  'Server-grade reliability. Lower clock, more stable.'),
  p('cpu_ph_7700',  'Phantom Hexa 7700',      'cpu','GEN4','PHANTOM',{clock:2.4,threads:12},  68000,0.3, 'uncommon',  125, 'High-freq 12-thread beast. Hashcat flies.'),
  p('cpu_ph_8900',  'Phantom Octa 8900X',     'cpu','GEN4','PHANTOM',{clock:2.8,threads:16},  95000,0.35,'rare',      145, 'Flagship. 16 threads shred password hashes.'),
  p('cpu_kr_9950',  'Kronos R9 9950X',        'cpu','GEN5','KRONOS', {clock:3.4,threads:24},  220000,0.4,'rare',      170, '24 threads. Eats cracking jobs for breakfast.'),
  p('cpu_kr_9990',  'Kronos Threadmaster 9990','cpu','GEN5','KRONOS',{clock:3.8,threads:32},  380000,0.45,'legendary', 210, '32-thread monster. Near-instant hashcat.'),
  p('cpu_fo_qtr',   'QForge Entangled Core',  'cpu','XGEN','FORGE',  {clock:4.0,threads:64},  750000,0.6,'legendary', 280, 'Quantum-tunneled processor. Compatibility: everything.'),
  p('cpu_nx_2800e', 'NX Eco-Thread 2800E',    'cpu','GEN2','NEXUS',  {clock:1.1,threads:4},   4500, 0.2, 'common',    35,  'Low power draw. Runs cool, cracks slow.'),
  p('cpu_ph_7200s', 'Phantom Stealth 7200S',  'cpu','GEN4','PHANTOM',{clock:2.1,threads:8},   55000,0.3, 'uncommon',  90,  'Undervolted. Silent running, good for heat mgmt.'),

  // ─── GPU ──────────────────────────────────────────────────
  p('gpu_nx_1030',  'NX GeForce 1030',        'gpu','GEN2','NEXUS',  {cores:1.0,vram:2},      4000, 0.35,'common',    30,  'Display adapter with aspirations.'),
  p('gpu_nx_1650',  'NX GeForce 1650',        'gpu','GEN2','NEXUS',  {cores:1.4,vram:4},      8000, 0.3, 'common',    75,  'Budget mining. Slow but profitable over time.'),
  p('gpu_ci_2060',  'Cipher RTX 2060',        'gpu','GEN3','CIPHER', {cores:1.8,vram:6},      22000,0.3, 'common',    120, 'Good VRAM. Hashcat support unlocked.'),
  p('gpu_ci_2080',  'Cipher RTX 2080 Ti',     'gpu','GEN3','CIPHER', {cores:2.2,vram:11},     45000,0.35,'uncommon',  180, 'Beefy. Mining income and cracking in one card.'),
  p('gpu_ph_3080',  'Phantom RTX 3080',       'gpu','GEN4','PHANTOM',{cores:2.8,vram:12},     78000,0.4, 'uncommon',  220, 'Mining king. Serious passive income.'),
  p('gpu_ph_3090',  'Phantom RTX 3090 Ti',    'gpu','GEN4','PHANTOM',{cores:3.2,vram:24},     125000,0.4,'rare',      290, '24GB VRAM. Cracking + mining powerhouse.'),
  p('gpu_kr_4090',  'Kronos RTX 4090',        'gpu','GEN5','KRONOS', {cores:3.8,vram:24},     250000,0.45,'rare',     350, 'Flagship. Everything runs at max speed.'),
  p('gpu_kr_4090d', 'Kronos RTX 4090D Duo',   'gpu','GEN5','KRONOS', {cores:4.2,vram:48},     420000,0.5,'legendary', 450, 'Dual-die. Mining income is obscene.'),
  p('gpu_fo_qgpu',  'QForge Neural Mesh',     'gpu','XGEN','FORGE',  {cores:5.0,vram:64},     900000,0.6,'legendary', 350, 'Quantum neural net. Instant everything.'),
  p('gpu_ci_2070s', 'Cipher RTX 2070 Super',  'gpu','GEN3','CIPHER', {cores:2.0,vram:8},      35000,0.3, 'common',    150, 'Sweet spot. Good VRAM, reasonable power.'),
  p('gpu_ph_3070',  'Phantom RTX 3070',       'gpu','GEN4','PHANTOM',{cores:2.5,vram:8},      58000,0.35,'uncommon',  185, 'Efficient. Great mining-to-power ratio.'),
  p('gpu_nx_1660',  'NX GTX 1660 Super',      'gpu','GEN2','NEXUS',  {cores:1.6,vram:6},      12000,0.25,'common',    100, 'Reliable budget miner. Low power, low noise.'),

  // ─── RAM ──────────────────────────────────────────────────
  p('ram_nx_4g',    'NX DDR4 4GB 2133',       'ram','GEN2','NEXUS',  {size:4,speed:1.0},      2000, 0.2, 'common',    5,   'Bare minimum. One proxy, no buffer.'),
  p('ram_nx_8g',    'NX DDR4 8GB 2400',       'ram','GEN2','NEXUS',  {size:8,speed:1.2},      4500, 0.2, 'common',    8,   'Functional. Handles basic operations.'),
  p('ram_ci_16g',   'Cipher DDR4 16GB 3200',  'ram','GEN3','CIPHER', {size:16,speed:1.6},     14000,0.25,'common',    12,  'Standard issue. 2 proxy slots.'),
  p('ram_ci_32g',   'Cipher DDR4 32GB 3600',  'ram','GEN3','CIPHER', {size:32,speed:1.9},     28000,0.25,'uncommon',  15,  'Comfortable. Trace ticks slower.'),
  p('ram_ph_32g',   'Phantom DDR5 32GB 5600', 'ram','GEN4','PHANTOM',{size:32,speed:2.4},     45000,0.3, 'uncommon',  18,  'DDR5 speed. Noticeably faster trace buffer.'),
  p('ram_ph_64g',   'Phantom DDR5 64GB 6000', 'ram','GEN4','PHANTOM',{size:64,speed:2.8},     82000,0.35,'rare',      22,  '64 gigs. 3 proxy slots, smooth ops.'),
  p('ram_kr_64g',   'Kronos DDR5 64GB 7200',  'ram','GEN5','KRONOS', {size:64,speed:3.2},     145000,0.4,'rare',      25,  'Overclocked DDR5. Everything feels instant.'),
  p('ram_kr_128g',  'Kronos DDR5 128GB 8000', 'ram','GEN5','KRONOS', {size:128,speed:3.6},    260000,0.45,'legendary', 30, '128 gigs. 5 proxy slots. Trace crawls.'),
  p('ram_fo_256g',  'QForge Photonic 256GB',  'ram','XGEN','FORGE',  {size:256,speed:4.0},    600000,0.55,'legendary', 20, 'Light-speed memory. Max proxies, min trace.'),
  p('ram_ci_16ge',  'Cipher DDR4 16GB ECC',   'ram','GEN3','CIPHER', {size:16,speed:1.5},     18000,0.2, 'common',    14,  'Error-correcting. Prevents rare command glitches.'),
  p('ram_ph_48g',   'Phantom DDR5 48GB 5200', 'ram','GEN4','PHANTOM',{size:48,speed:2.5},     62000,0.3, 'uncommon',  20,  'Odd size, great price-to-performance.'),

  // ─── SSD ──────────────────────────────────────────────────
  p('ssd_nx_256',   'NX SATA 256GB',          'ssd','GEN2','NEXUS',  {capacity:256,iops:1.0}, 1500, 0.2, 'common',    3,   'Spinning rust alternative. Barely.'),
  p('ssd_nx_512',   'NX SATA 512GB',          'ssd','GEN2','NEXUS',  {capacity:512,iops:1.2}, 3000, 0.2, 'common',    5,   'Enough to stash a few exfils.'),
  p('ssd_ci_1tb',   'Cipher NVMe 1TB Gen3',   'ssd','GEN3','CIPHER', {capacity:1000,iops:1.8},12000,0.25,'common',    8,   'NVMe speed. Exfil noticeably faster.'),
  p('ssd_ci_2tb',   'Cipher NVMe 2TB Gen3',   'ssd','GEN3','CIPHER', {capacity:2000,iops:2.0},22000,0.25,'uncommon',  10,  'Double capacity. Stash more data.'),
  p('ssd_ph_2tb',   'Phantom NVMe 2TB Gen4',  'ssd','GEN4','PHANTOM',{capacity:2000,iops:2.8},42000,0.3, 'uncommon',  12,  'Gen4 speed. Exfil flies.'),
  p('ssd_ph_4tb',   'Phantom NVMe 4TB Gen4',  'ssd','GEN4','PHANTOM',{capacity:4000,iops:3.2},68000,0.35,'rare',      15,  '4 terabytes. Stash everything.'),
  p('ssd_kr_4tb',   'Kronos NVMe 4TB Gen5',   'ssd','GEN5','KRONOS', {capacity:4000,iops:4.0},130000,0.4,'rare',     18,  'Gen5. Transfer speeds are insane.'),
  p('ssd_kr_8tb',   'Kronos NVMe 8TB Gen5',   'ssd','GEN5','KRONOS', {capacity:8000,iops:4.5},240000,0.45,'legendary',22,  '8TB Gen5. Hold an entire corp\'s data.'),
  p('ssd_fo_16tb',  'QForge Crystal 16TB',    'ssd','XGEN','FORGE',  {capacity:16000,iops:5.0},550000,0.55,'legendary',12, 'Crystal lattice storage. Unlimited stash.'),
  p('ssd_ci_1tbe',  'Cipher NVMe 1TB Endure', 'ssd','GEN3','CIPHER', {capacity:1000,iops:1.6},15000,0.2, 'common',    7,   'High endurance. Won\'t degrade under heavy exfil.'),

  // ─── PSU ──────────────────────────────────────────────────
  p('psu_nx_400',   'NX Bronze 400W',         'psu','GEN2','NEXUS',  {wattage:400,efficiency:0.72},  2500, 0.2,'common',   0,'400 watts. Budget builds only.'),
  p('psu_nx_550',   'NX Bronze 550W',         'psu','GEN2','NEXUS',  {wattage:550,efficiency:0.76},  5000, 0.2,'common',   0,'Handles a mid GPU. Barely.'),
  p('psu_ci_650',   'Cipher Gold 650W',       'psu','GEN3','CIPHER', {wattage:650,efficiency:0.82},  15000,0.2,'common',   0,'Gold rated. Good for GEN3 builds.'),
  p('psu_ci_750',   'Cipher Gold 750W',       'psu','GEN3','CIPHER', {wattage:750,efficiency:0.85},  22000,0.25,'uncommon', 0,'750W headroom. Quiet under load.'),
  p('psu_ph_850',   'Phantom Platinum 850W',  'psu','GEN4','PHANTOM',{wattage:850,efficiency:0.89},  40000,0.3,'uncommon', 0,'Platinum efficiency. Less heat from PSU.'),
  p('psu_ph_1000',  'Phantom Platinum 1000W', 'psu','GEN4','PHANTOM',{wattage:1000,efficiency:0.91}, 62000,0.3,'rare',     0,'1 kilowatt. Powers any single-GPU build.'),
  p('psu_kr_1200',  'Kronos Titanium 1200W',  'psu','GEN5','KRONOS', {wattage:1200,efficiency:0.94}, 120000,0.35,'rare',   0,'Titanium rated. Powers GEN5 rigs.'),
  p('psu_kr_1600',  'Kronos Titanium 1600W',  'psu','GEN5','KRONOS', {wattage:1600,efficiency:0.96}, 200000,0.4,'legendary',0,'1600W. Powers literally anything.'),
  p('psu_fo_2000',  'QForge Fusion Cell',     'psu','XGEN','FORGE',  {wattage:2000,efficiency:0.98}, 480000,0.5,'legendary',0,'Micro-fusion reactor. Near-lossless.'),
  p('psu_ci_700s',  'Cipher Gold 700W Silent','psu','GEN3','CIPHER', {wattage:700,efficiency:0.84},  19000,0.2,'common',   0,'Fanless under 50% load. Stealth rig.'),

  // ─── COOLING ──────────────────────────────────────────────
  p('cool_nx_air',  'NX Stock Cooler',        'cool','GEN2','NEXUS',  {tdp:65,type:'air'},     1500, 0.15,'common',   5,  'It spins. Barely.'),
  p('cool_nx_tower','NX Tower Cooler',        'cool','GEN2','NEXUS',  {tdp:95,type:'air'},     4000, 0.2, 'common',   8,  'Big heatsink. Handles budget CPUs.'),
  p('cool_ci_aio1', 'Cipher AIO 120mm',       'cool','GEN3','CIPHER', {tdp:150,type:'liquid'}, 15000,0.25,'common',   12, 'Entry liquid cooling. Quiet and effective.'),
  p('cool_ci_aio2', 'Cipher AIO 240mm',       'cool','GEN3','CIPHER', {tdp:200,type:'liquid'}, 25000,0.25,'uncommon', 15, 'Dual-rad. Handles most GEN4 CPUs.'),
  p('cool_ph_aio3', 'Phantom AIO 360mm',      'cool','GEN4','PHANTOM',{tdp:300,type:'liquid'}, 48000,0.3, 'uncommon', 20, 'Triple-rad. Keeps anything cool under load.'),
  p('cool_ph_loop', 'Phantom Custom Loop',    'cool','GEN4','PHANTOM',{tdp:400,type:'liquid'}, 80000,0.35,'rare',     25, 'Custom hardline. CPU+GPU in one loop.'),
  p('cool_kr_imm',  'Kronos Immersion Tank',  'cool','GEN5','KRONOS', {tdp:500,type:'cryo'},   180000,0.4,'legendary',35, 'Full submersion. Heat is a memory.'),
  p('cool_fo_cryo', 'QForge Cryo Cascade',    'cool','XGEN','FORGE',  {tdp:600,type:'cryo'},   400000,0.5,'legendary',20, 'Near-absolute-zero cooling. Overclocks everything.'),
  p('cool_ci_aio1s','Cipher AIO 140mm Silent','cool','GEN3','CIPHER', {tdp:165,type:'liquid'}, 18000,0.2, 'common',   10, 'Larger fan, slower RPM. Dead silent.'),
  p('cool_ph_air',  'Phantom NH-D15 Ultra',   'cool','GEN4','PHANTOM',{tdp:250,type:'air'},    35000,0.25,'uncommon', 14, 'Premium air. Rivals 240mm AIOs.'),

  // ─── NETWORK ──────────────────────────────────────────────
  p('net_nx_1g',    'NX 1GbE NIC',            'net','GEN2','NEXUS',  {bandwidth:1,latency:0.8},  2000,0.15,'common',  3,  'Gigabit. Standard issue.'),
  p('net_nx_2g',    'NX 2.5GbE NIC',          'net','GEN2','NEXUS',  {bandwidth:2,latency:0.7},  5000,0.2, 'common',  5,  '2.5 gig. Noticeably faster scans.'),
  p('net_ci_5g',    'Cipher 5GbE Fiber',      'net','GEN3','CIPHER', {bandwidth:3,latency:0.5},  18000,0.25,'common', 8,  'Fiber backbone. 3 nodes per nmap.'),
  p('net_ci_10g',   'Cipher 10GbE SFP+',      'net','GEN3','CIPHER', {bandwidth:4,latency:0.4},  35000,0.3,'uncommon', 12, 'SFP+ module. Fast exfil over network.'),
  p('net_ph_10g',   'Phantom 10GbE DAC',      'net','GEN4','PHANTOM',{bandwidth:5,latency:0.3},  55000,0.3,'uncommon', 15, 'Direct-attach copper. Ultra-low latency.'),
  p('net_ph_25g',   'Phantom 25GbE Fiber',    'net','GEN4','PHANTOM',{bandwidth:7,latency:0.2},  95000,0.35,'rare',    18, '25 gig. Scans feel instant.'),
  p('net_kr_40g',   'Kronos 40GbE QSFP',      'net','GEN5','KRONOS', {bandwidth:8,latency:0.15}, 180000,0.4,'rare',   22, '40 gig. Finds everything on the network.'),
  p('net_kr_100g',  'Kronos 100GbE InfiniBand','net','GEN5','KRONOS',{bandwidth:10,latency:0.1}, 350000,0.45,'legendary',30,'100 gig. Exfil an entire datacenter.'),
  p('net_fo_qnet',  'QForge Quantum Relay',   'net','XGEN','FORGE',  {bandwidth:10,latency:0.05},700000,0.55,'legendary',15,'Entangled photon link. Untraceable.'),
  p('net_ci_wifi',  'Cipher AX WiFi 6E',      'net','GEN3','CIPHER', {bandwidth:2,latency:0.6},  10000,0.2,'common',    6, 'Wireless. Flexible but slightly slower.'),

  // ─── CASE ─────────────────────────────────────────────────
  p('case_nx_basic', 'NX Steel Box',           'case','GEN2','NEXUS', {airflow:1.0,style:0},   1000,0.1,'common',    0,'Beige steel. Functional.'),
  p('case_nx_mesh',  'NX Mesh Front',          'case','GEN2','NEXUS', {airflow:1.3,style:1},   3000,0.15,'common',   0,'Mesh panel. Better thermals.'),
  p('case_ci_glass', 'Cipher Tempered Glass',  'case','GEN3','CIPHER',{airflow:1.5,style:3},   12000,0.2,'common',   0,'Glass side panel. Looks clean.'),
  p('case_ci_flow',  'Cipher Airflow Max',     'case','GEN3','CIPHER',{airflow:2.0,style:2},   18000,0.2,'uncommon', 0,'Triple mesh. Maximum airflow.'),
  p('case_ph_rgb',   'Phantom RGB Tower',      'case','GEN4','PHANTOM',{airflow:1.8,style:6},  35000,0.25,'uncommon',0,'RGB everywhere. +3 REP per mission.'),
  p('case_ph_itx',   'Phantom ITX Stealth',    'case','GEN4','PHANTOM',{airflow:1.4,style:5},  28000,0.25,'uncommon',0,'Tiny form factor. Hard to detect.'),
  p('case_kr_rack',  'Kronos 4U Rackmount',    'case','GEN5','KRONOS',{airflow:2.5,style:4},   60000,0.3,'rare',     0,'Server chassis. Max airflow, industrial look.'),
  p('case_kr_custom','Kronos Custom CNC',      'case','GEN5','KRONOS',{airflow:2.2,style:8},   120000,0.35,'legendary',0,'CNC-milled aluminum. Work of art.'),
  p('case_fo_mirror','QForge Mirror Cube',     'case','XGEN','FORGE', {airflow:3.0,style:10},  300000,0.5,'legendary',0,'One-way mirror panels. Invisible rig.'),
  p('case_ci_open',  'Cipher Open Bench',      'case','GEN3','CIPHER',{airflow:2.5,style:1},   8000,0.15,'common',   0,'No case. Maximum cooling, zero stealth.'),
];

// Index by ID for fast lookups
export const PARTS_BY_ID = {};
PARTS_DB.forEach(p => { PARTS_BY_ID[p.id] = p; });

// Group by slot
export const PARTS_BY_SLOT = {};
SLOTS.forEach(s => { PARTS_BY_SLOT[s] = PARTS_DB.filter(p => p.slot === s); });

// ═══════════════════════════════════════════════════════════════
// SYNERGY CALCULATION
// ═══════════════════════════════════════════════════════════════

function genDistance(g1, g2) {
  if (!g1 || !g2) return 0;
  if (g1 === 'XGEN' || g2 === 'XGEN') return -1; // universal = always good
  const t1 = GENS[g1]?.tier || 0;
  const t2 = GENS[g2]?.tier || 0;
  return Math.abs(t1 - t2);
}

// rig = { cpu: partId|null, gpu: partId|null, ... }
export function calculateSynergy(rig) {
  let score = 0;
  let pairs = 0;
  const details = [];

  for (const [slotA, slotB] of COMPAT_PAIRS) {
    const partA = rig[slotA] ? PARTS_BY_ID[rig[slotA]] : null;
    const partB = rig[slotB] ? PARTS_BY_ID[rig[slotB]] : null;
    if (!partA || !partB) continue;

    pairs++;
    const dist = genDistance(partA.gen, partB.gen);

    let pairScore, label;
    if (dist === -1) {
      // XGEN — always +1
      pairScore = 1;
      label = 'XGEN';
    } else if (dist === 0 && partA.maker === partB.maker) {
      pairScore = 3;
      label = 'PERFECT';
    } else if (dist === 0) {
      pairScore = 2;
      label = 'MATCHED';
    } else if (dist === 1) {
      pairScore = 0;
      label = 'NEUTRAL';
    } else if (dist === 2) {
      pairScore = -2;
      label = 'BOTTLENECK';
    } else {
      pairScore = -4;
      label = 'SEVERE';
    }

    score += pairScore;
    details.push({ slotA, slotB, pairScore, label, genA: partA.gen, genB: partB.gen });
  }

  // Case airflow bonus (flat addition)
  const casePart = rig.case ? PARTS_BY_ID[rig.case] : null;
  if (casePart) {
    const caseBonus = Math.floor(casePart.stats.airflow);
    score += caseBonus;
    details.push({ slotA: 'case', slotB: 'all', pairScore: caseBonus, label: 'AIRFLOW' });
  }

  // Rating
  let rating, multiplier, color;
  if (score >= 16) {
    rating = 'S'; multiplier = 1.30; color = '#ffd866';
  } else if (score >= 10) {
    rating = 'A'; multiplier = 1.15; color = '#a9dc76';
  } else if (score >= 4) {
    rating = 'B'; multiplier = 1.00; color = '#78dce8';
  } else if (score >= 0) {
    rating = 'C'; multiplier = 0.90; color = '#fc9867';
  } else {
    rating = 'D'; multiplier = 0.75; color = '#ff6188';
  }

  return { score, rating, multiplier, color, details, pairs };
}

// ═══════════════════════════════════════════════════════════════
// POWER BUDGET
// ═══════════════════════════════════════════════════════════════

export function calculatePowerBudget(rig) {
  let totalDraw = 0;
  let psuWattage = 0;
  let psuEfficiency = 0.70;

  SLOTS.forEach(slot => {
    const part = rig[slot] ? PARTS_BY_ID[rig[slot]] : null;
    if (!part) return;
    if (slot === 'psu') {
      psuWattage = part.stats.wattage;
      psuEfficiency = part.stats.efficiency;
    } else {
      totalDraw += part.power;
    }
  });

  const headroom = psuWattage - totalDraw;
  const stable = headroom >= 0;
  const utilizationPct = psuWattage > 0 ? Math.round((totalDraw / psuWattage) * 100) : 0;

  return { totalDraw, psuWattage, psuEfficiency, headroom, stable, utilizationPct };
}

// ═══════════════════════════════════════════════════════════════
// GAMEPLAY EFFECTS — what the rig actually does in-game
// ═══════════════════════════════════════════════════════════════

export function getRigEffects(rig) {
  const syn = calculateSynergy(rig);
  const pow = calculatePowerBudget(rig);
  const m = syn.multiplier;
  const unstable = !pow.stable;

  // Base effects from parts
  const cpu  = rig.cpu  ? PARTS_BY_ID[rig.cpu]  : null;
  const gpu  = rig.gpu  ? PARTS_BY_ID[rig.gpu]  : null;
  const ram  = rig.ram  ? PARTS_BY_ID[rig.ram]  : null;
  const ssd  = rig.ssd  ? PARTS_BY_ID[rig.ssd]  : null;
  const psu  = rig.psu  ? PARTS_BY_ID[rig.psu]  : null;
  const cool = rig.cool ? PARTS_BY_ID[rig.cool] : null;
  const net  = rig.net  ? PARTS_BY_ID[rig.net]  : null;
  const cas  = rig.case ? PARTS_BY_ID[rig.case] : null;

  // Instability penalty: if PSU can't handle load, everything at 60%
  const stabMult = unstable ? 0.6 : 1.0;

  return {
    synergy: syn,
    power: pow,

    // hashcat speed: CPU clock * GPU vram bonus * synergy * stability
    hashSpeed: Math.round(((cpu?.stats.clock || 0.5) + (gpu?.stats.vram || 0) * 0.05) * m * stabMult * 100) / 100,

    // xmrig income multiplier: GPU cores * synergy * stability
    mineMultiplier: Math.round((gpu?.stats.cores || 0) * m * stabMult * 100) / 100,

    // proxy cap: base 1 + RAM size/32 (floored)
    maxProxies: 1 + Math.floor((ram?.stats.size || 0) / 32),

    // trace tick rate multiplier: lower = slower trace (good)
    // Base 1.0, RAM speed reduces it, PSU efficiency helps
    traceMultiplier: Math.round(Math.max(0.2, 1.0 / ((ram?.stats.speed || 1.0) * (psu?.stats.efficiency || 0.7))) * m * stabMult * 100) / 100,

    // exfil bonus: SSD iops * synergy * stability
    exfilMultiplier: Math.round((ssd?.stats.iops || 1.0) * m * stabMult * 100) / 100,

    // nmap discovery count: NET bandwidth (capped)
    scanCount: Math.max(1, Math.min(10, Math.floor((net?.stats.bandwidth || 1) * stabMult))),

    // heat reduction: cooling TDP / total draw ratio * efficiency
    heatReduction: cool ? Math.round(Math.min(0.8, (cool.stats.tdp / Math.max(1, pow.totalDraw)) * (psu?.stats.efficiency || 0.7) * (cas?.stats.airflow || 1.0)) * 100) / 100 : 0,

    // rep bonus per mission from case style
    repBonus: Math.floor((cas?.stats.style || 0) * 0.5),

    // instability: random chance per command to fail
    failChance: unstable ? Math.min(0.3, (Math.abs(pow.headroom) / 200)) : 0,
  };
}

// ═══════════════════════════════════════════════════════════════
// DOPE WARS MARKET ENGINE
// ═══════════════════════════════════════════════════════════════

// Regional base price multipliers per slot
const REGION_MULTS = {
  'us-gov':      { cpu:1.0, gpu:1.1, ram:1.0, ssd:0.9, psu:0.9, cool:1.0, net:0.8, case:1.0 },
  'ru-darknet':  { cpu:0.7, gpu:0.6, ram:0.8, ssd:1.0, psu:1.2, cool:1.3, net:1.1, case:0.5 },
  'cn-financial': { cpu:0.6, gpu:0.7, ram:0.6, ssd:0.7, psu:0.8, cool:0.9, net:1.0, case:0.7 },
  'eu-central':  { cpu:1.2, gpu:1.3, ram:1.1, ssd:1.1, psu:1.0, cool:0.8, net:0.9, case:1.4 },
};

// Which makers are more available per region
const REGION_MAKER_BONUS = {
  'us-gov':      { PHANTOM: 0.85, KRONOS: 1.2 },
  'ru-darknet':  { FORGE: 0.5,   NEXUS: 0.7 },
  'cn-financial': { NEXUS: 0.5, CIPHER: 0.6 },
  'eu-central':  { KRONOS: 0.8, PHANTOM: 0.9 },
};

// Stock availability per region (fraction of total parts available)
const REGION_STOCK_RATE = {
  'us-gov': 0.55,
  'ru-darknet': 0.40,
  'cn-financial': 0.65,
  'eu-central': 0.50,
};

// Market events (Dope Wars style)
export const MARKET_EVENTS = [
  { text: 'Customs seized a KRONOS shipment — KRONOS prices +80%',   filter: p => p.maker === 'KRONOS',  mult: 1.8 },
  { text: 'NEXUS overproduced — NEXUS parts at 40% off',             filter: p => p.maker === 'NEXUS',   mult: 0.6 },
  { text: 'CIPHER factory fire — CIPHER stock limited, +60%',        filter: p => p.maker === 'CIPHER',  mult: 1.6 },
  { text: 'Quantum Forge lab raid — XGEN parts +100%',               filter: p => p.gen === 'XGEN',      mult: 2.0 },
  { text: 'Mining boom — GPU prices skyrocket +90%',                  filter: p => p.slot === 'gpu',      mult: 1.9 },
  { text: 'Mining crash — GPUs dumped at 35% value',                  filter: p => p.slot === 'gpu',      mult: 0.35 },
  { text: 'Data center liquidation — SSDs at 50% off',               filter: p => p.slot === 'ssd',      mult: 0.5 },
  { text: 'Heatwave — cooling parts in high demand +70%',            filter: p => p.slot === 'cool',     mult: 1.7 },
  { text: 'PSU shortage — power supplies +55%',                       filter: p => p.slot === 'psu',      mult: 1.55 },
  { text: 'Trade sanctions — GEN5 parts +65%',                        filter: p => p.gen === 'GEN5',      mult: 1.65 },
  { text: 'Black Friday — everything 25% off',                        filter: () => true,                 mult: 0.75 },
  { text: 'Supply chain crisis — all prices +40%',                    filter: () => true,                 mult: 1.4 },
  { text: 'RAM shortage — memory prices double',                      filter: p => p.slot === 'ram',      mult: 2.0 },
  { text: 'Network infrastructure deal — NICs at 45% off',            filter: p => p.slot === 'net',      mult: 0.55 },
  { text: 'GEN4 clearance — GEN4 parts -30%',                         filter: p => p.gen === 'GEN4',      mult: 0.7 },
  { text: 'PHANTOM Tech buyout rumor — PHANTOM +50%',                 filter: p => p.maker === 'PHANTOM', mult: 1.5 },
];

// Generate market stock for a region
export function generateMarketStock(region) {
  const stockRate = REGION_STOCK_RATE[region] || 0.5;
  const regionMult = REGION_MULTS[region] || {};
  const makerBonus = REGION_MAKER_BONUS[region] || {};

  // Pick 1-2 random events
  const eventCount = Math.random() < 0.3 ? 2 : 1;
  const shuffled = [...MARKET_EVENTS].sort(() => Math.random() - 0.5);
  const activeEvents = shuffled.slice(0, eventCount);

  // Filter available parts (not every part available everywhere)
  const available = PARTS_DB.filter(() => Math.random() < stockRate);

  // Generate prices
  const stock = available.map(part => {
    // Base price with random variance
    const variance = 1 + (Math.random() * 2 - 1) * part.volatility;
    let price = part.basePrice * variance;

    // Regional slot multiplier
    price *= (regionMult[part.slot] || 1.0);

    // Regional maker bonus
    if (makerBonus[part.maker]) price *= makerBonus[part.maker];

    // Apply market events
    for (const evt of activeEvents) {
      if (evt.filter(part)) price *= evt.mult;
    }

    // Stock quantity (1-5 for common, 1-3 for uncommon, 1 for rare/legendary)
    let qty;
    if (part.rarity === 'common') qty = Math.floor(Math.random() * 5) + 1;
    else if (part.rarity === 'uncommon') qty = Math.floor(Math.random() * 3) + 1;
    else if (part.rarity === 'rare') qty = Math.random() < 0.6 ? 1 : 0;
    else qty = Math.random() < 0.25 ? 1 : 0; // legendary — 25% chance

    const finalPrice = Math.max(100, Math.round(price));

    // Price vs base ratio for display
    const ratio = finalPrice / part.basePrice;
    const trend = ratio > 1.15 ? 'up' : ratio < 0.85 ? 'down' : 'flat';

    return {
      partId: part.id,
      price: finalPrice,
      qty,
      trend,
      ratio: Math.round(ratio * 100),
    };
  }).filter(s => s.qty > 0);

  return { stock, events: activeEvents.map(e => e.text), region };
}

// Sell price = 60-80% of current market value (you lose on resale)
export function getSellPrice(partId, marketStock) {
  const listing = marketStock.find(s => s.partId === partId);
  if (listing) return Math.round(listing.price * (0.6 + Math.random() * 0.2));
  // If not in current stock, use base price * 0.5
  const part = PARTS_BY_ID[partId];
  return part ? Math.round(part.basePrice * 0.5) : 0;
}

// ═══════════════════════════════════════════════════════════════
// RARITY COLORS
// ═══════════════════════════════════════════════════════════════

export const RARITY_COLORS = {
  common: '#727072',
  uncommon: '#78dce8',
  rare: '#a9dc76',
  legendary: '#ffd866',
};
