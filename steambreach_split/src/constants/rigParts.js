// ═══════════════════════════════════════════════════════════════
// STEAMBREACH — RIG PARTS, SOFTWARE, COMMODITIES & BTC MARKET
// Unified economy: everything priced in satoshis (sats)
// 100,000,000 sats = 1 BTC
// ═══════════════════════════════════════════════════════════════

// ─── BTC FORMATTING ───────────────────────────────────────────
export function formatBTC(sats) {
  if (sats === 0) return '0 sats';
  const abs = Math.abs(sats);
  const sign = sats < 0 ? '-' : '';
  if (abs < 100000)   return `${sign}${abs.toLocaleString()} sats`;
  if (abs < 10000000)  return `${sign}${(abs/1000000).toFixed(2)}M sats`;
  return `${sign}₿${(abs/100000000).toFixed(abs>=100000000?2:4)}`;
}

// ─── BTC PRICE ENGINE ─────────────────────────────────────────
export function generateBTCPrice(prev) {
  const p = prev || 1.0;
  const drift = (1.0 - p) * 0.08;
  const shock = (Math.random() - 0.5) * 0.25;
  return Math.round(Math.max(0.4, Math.min(2.2, p + drift + shock)) * 100) / 100;
}

export function btcTrend(idx) {
  if (idx >= 1.8) return { text: 'BTC PARABOLIC — ATH territory',  color: '#ffd866', icon: '▲▲' };
  if (idx >= 1.4) return { text: 'BTC PUMPING — bulls in control',  color: '#a9dc76', icon: '▲▲' };
  if (idx >= 1.1) return { text: 'BTC trending up',                 color: '#a9dc76', icon: '▲' };
  if (idx >= 0.9) return { text: 'BTC stable',                      color: '#727072', icon: '─' };
  if (idx >= 0.7) return { text: 'BTC dipping — bear pressure',     color: '#fc9867', icon: '▼' };
  if (idx >= 0.5) return { text: 'BTC CRASHING — capitulation',     color: '#ff6188', icon: '▼▼' };
  return              { text: 'BTC COLLAPSED — extreme fear',       color: '#ff6188', icon: '☠' };
}

// ─── GENERATIONS ──────────────────────────────────────────────
export const GENS = {
  GEN2: { id:'GEN2', label:'GEN-2', color:'#727072', tier:2 },
  GEN3: { id:'GEN3', label:'GEN-3', color:'#78dce8', tier:3 },
  GEN4: { id:'GEN4', label:'GEN-4', color:'#a9dc76', tier:4 },
  GEN5: { id:'GEN5', label:'GEN-5', color:'#ffd866', tier:5 },
  XGEN: { id:'XGEN', label:'X-GEN', color:'#ab9df2', tier:0 },
};

export const MAKERS = {
  NEXUS:  { id:'NEXUS',  name:'Nexus Dynamics', color:'#5a7a8a' },
  CIPHER: { id:'CIPHER', name:'Cipher Systems',  color:'#78dce8' },
  PHANTOM:{ id:'PHANTOM',name:'Phantom Tech',    color:'#a9dc76' },
  KRONOS: { id:'KRONOS', name:'Kronos Labs',     color:'#ffd866' },
  FORGE:  { id:'FORGE',  name:'Quantum Forge',   color:'#ab9df2' },
};

export const HW_SLOTS = ['cpu','gpu','ram','ssd','psu','cool','net','case'];
export const SLOTS = HW_SLOTS; // backward compat alias
export const ALL_TABS = ['cpu','gpu','ram','ssd','psu','cool','net','case','software','commodities'];
export const TAB_LABELS = {
  cpu:'CPU', gpu:'GPU', ram:'RAM', ssd:'SSD', psu:'PSU',
  cool:'COOL', net:'NET', case:'CASE', software:'SOFTWARE', commodities:'TRADE',
};
export const SLOT_LABELS = TAB_LABELS; // backward compat alias

const COMPAT_PAIRS = [
  ['cpu','ram'],['cpu','gpu'],['gpu','psu'],
  ['gpu','cool'],['ram','ssd'],['cpu','cool'],
];

// ═══════════════════════════════════════════════════════════════
// PARTS DATABASE — basePrice in sats
// ═══════════════════════════════════════════════════════════════
const p = (id,name,slot,gen,maker,stats,basePrice,vol,rarity,power,desc) =>
  ({id,name,slot,gen,maker,stats,basePrice,volatility:vol,rarity,power,desc,type:'hardware'});

export const PARTS_DB = [
  // CPU
  p('cpu_nx_2200','NX Dual-Thread 2200','cpu','GEN2','NEXUS',{clock:1.0,threads:2},300000,0.3,'common',45,'Entry dual-core.'),
  p('cpu_nx_3400','NX Quad-Core 3400','cpu','GEN2','NEXUS',{clock:1.3,threads:4},600000,0.3,'common',55,'Budget quad.'),
  p('cpu_nx_2800e','NX Eco-Thread 2800E','cpu','GEN2','NEXUS',{clock:1.1,threads:4},450000,0.2,'common',35,'Low power draw.'),
  p('cpu_ci_4600','Cipher i5 MK3','cpu','GEN3','CIPHER',{clock:1.6,threads:6},1800000,0.25,'common',75,'Solid mid-range.'),
  p('cpu_ci_5800','Cipher i7 Hexa','cpu','GEN3','CIPHER',{clock:1.9,threads:8},3200000,0.25,'uncommon',95,'The workhorse.'),
  p('cpu_ci_6200','Cipher Xeon E3','cpu','GEN3','CIPHER',{clock:1.7,threads:8},2800000,0.2,'uncommon',85,'Server-grade.'),
  p('cpu_ph_7700','Phantom Hexa 7700','cpu','GEN4','PHANTOM',{clock:2.4,threads:12},6800000,0.3,'uncommon',125,'12-thread beast.'),
  p('cpu_ph_8900','Phantom Octa 8900X','cpu','GEN4','PHANTOM',{clock:2.8,threads:16},9500000,0.35,'rare',145,'Flagship 16-thread.'),
  p('cpu_ph_7200s','Phantom Stealth 7200S','cpu','GEN4','PHANTOM',{clock:2.1,threads:8},5500000,0.3,'uncommon',90,'Undervolted. Silent.'),
  p('cpu_kr_9950','Kronos R9 9950X','cpu','GEN5','KRONOS',{clock:3.4,threads:24},22000000,0.4,'rare',170,'24 threads.'),
  p('cpu_kr_9990','Kronos Threadmaster 9990','cpu','GEN5','KRONOS',{clock:3.8,threads:32},38000000,0.45,'legendary',210,'32-thread monster.'),
  p('cpu_fo_qtr','QForge Entangled Core','cpu','XGEN','FORGE',{clock:4.0,threads:64},75000000,0.6,'legendary',280,'Quantum-tunneled.'),
  // GPU
  p('gpu_nx_1030','NX GeForce 1030','gpu','GEN2','NEXUS',{cores:1.0,vram:2},400000,0.35,'common',30,'Display adapter.'),
  p('gpu_nx_1650','NX GeForce 1650','gpu','GEN2','NEXUS',{cores:1.4,vram:4},800000,0.3,'common',75,'Budget miner.'),
  p('gpu_nx_1660','NX GTX 1660 Super','gpu','GEN2','NEXUS',{cores:1.6,vram:6},1200000,0.25,'common',100,'Reliable budget.'),
  p('gpu_ci_2060','Cipher RTX 2060','gpu','GEN3','CIPHER',{cores:1.8,vram:6},2200000,0.3,'common',120,'Good VRAM.'),
  p('gpu_ci_2070s','Cipher RTX 2070 Super','gpu','GEN3','CIPHER',{cores:2.0,vram:8},3500000,0.3,'common',150,'Sweet spot.'),
  p('gpu_ci_2080','Cipher RTX 2080 Ti','gpu','GEN3','CIPHER',{cores:2.2,vram:11},4500000,0.35,'uncommon',180,'Mining + cracking.'),
  p('gpu_ph_3070','Phantom RTX 3070','gpu','GEN4','PHANTOM',{cores:2.5,vram:8},5800000,0.35,'uncommon',185,'Efficient mining.'),
  p('gpu_ph_3080','Phantom RTX 3080','gpu','GEN4','PHANTOM',{cores:2.8,vram:12},7800000,0.4,'uncommon',220,'Mining king.'),
  p('gpu_ph_3090','Phantom RTX 3090 Ti','gpu','GEN4','PHANTOM',{cores:3.2,vram:24},12500000,0.4,'rare',290,'24GB VRAM.'),
  p('gpu_kr_4090','Kronos RTX 4090','gpu','GEN5','KRONOS',{cores:3.8,vram:24},25000000,0.45,'rare',350,'Flagship.'),
  p('gpu_kr_4090d','Kronos RTX 4090D Duo','gpu','GEN5','KRONOS',{cores:4.2,vram:48},42000000,0.5,'legendary',450,'Dual-die.'),
  p('gpu_fo_qgpu','QForge Neural Mesh','gpu','XGEN','FORGE',{cores:5.0,vram:64},90000000,0.6,'legendary',350,'Quantum neural net.'),
  // RAM
  p('ram_nx_4g','NX DDR4 4GB 2133','ram','GEN2','NEXUS',{size:4,speed:1.0},200000,0.2,'common',5,'Bare minimum.'),
  p('ram_nx_8g','NX DDR4 8GB 2400','ram','GEN2','NEXUS',{size:8,speed:1.2},450000,0.2,'common',8,'Functional.'),
  p('ram_ci_16g','Cipher DDR4 16GB 3200','ram','GEN3','CIPHER',{size:16,speed:1.6},1400000,0.25,'common',12,'Standard. 2 proxies.'),
  p('ram_ci_16ge','Cipher DDR4 16GB ECC','ram','GEN3','CIPHER',{size:16,speed:1.5},1800000,0.2,'common',14,'Error-correcting.'),
  p('ram_ci_32g','Cipher DDR4 32GB 3600','ram','GEN3','CIPHER',{size:32,speed:1.9},2800000,0.25,'uncommon',15,'Comfortable.'),
  p('ram_ph_32g','Phantom DDR5 32GB 5600','ram','GEN4','PHANTOM',{size:32,speed:2.4},4500000,0.3,'uncommon',18,'DDR5 speed.'),
  p('ram_ph_48g','Phantom DDR5 48GB 5200','ram','GEN4','PHANTOM',{size:48,speed:2.5},6200000,0.3,'uncommon',20,'Odd size, great value.'),
  p('ram_ph_64g','Phantom DDR5 64GB 6000','ram','GEN4','PHANTOM',{size:64,speed:2.8},8200000,0.35,'rare',22,'3 proxy slots.'),
  p('ram_kr_64g','Kronos DDR5 64GB 7200','ram','GEN5','KRONOS',{size:64,speed:3.2},14500000,0.4,'rare',25,'Overclocked DDR5.'),
  p('ram_kr_128g','Kronos DDR5 128GB 8000','ram','GEN5','KRONOS',{size:128,speed:3.6},26000000,0.45,'legendary',30,'5 proxy slots.'),
  p('ram_fo_256g','QForge Photonic 256GB','ram','XGEN','FORGE',{size:256,speed:4.0},60000000,0.55,'legendary',20,'Light-speed memory.'),
  // SSD
  p('ssd_nx_256','NX SATA 256GB','ssd','GEN2','NEXUS',{capacity:256,iops:1.0},150000,0.2,'common',3,'Barely an SSD.'),
  p('ssd_nx_512','NX SATA 512GB','ssd','GEN2','NEXUS',{capacity:512,iops:1.2},300000,0.2,'common',5,'A few exfils.'),
  p('ssd_ci_1tb','Cipher NVMe 1TB Gen3','ssd','GEN3','CIPHER',{capacity:1000,iops:1.8},1200000,0.25,'common',8,'NVMe speed.'),
  p('ssd_ci_1tbe','Cipher NVMe 1TB Endure','ssd','GEN3','CIPHER',{capacity:1000,iops:1.6},1500000,0.2,'common',7,'High endurance.'),
  p('ssd_ci_2tb','Cipher NVMe 2TB Gen3','ssd','GEN3','CIPHER',{capacity:2000,iops:2.0},2200000,0.25,'uncommon',10,'Double capacity.'),
  p('ssd_ph_2tb','Phantom NVMe 2TB Gen4','ssd','GEN4','PHANTOM',{capacity:2000,iops:2.8},4200000,0.3,'uncommon',12,'Gen4 speed.'),
  p('ssd_ph_4tb','Phantom NVMe 4TB Gen4','ssd','GEN4','PHANTOM',{capacity:4000,iops:3.2},6800000,0.35,'rare',15,'4TB. Stash all.'),
  p('ssd_kr_4tb','Kronos NVMe 4TB Gen5','ssd','GEN5','KRONOS',{capacity:4000,iops:4.0},13000000,0.4,'rare',18,'Gen5 speed.'),
  p('ssd_kr_8tb','Kronos NVMe 8TB Gen5','ssd','GEN5','KRONOS',{capacity:8000,iops:4.5},24000000,0.45,'legendary',22,'Hold a whole corp.'),
  p('ssd_fo_16tb','QForge Crystal 16TB','ssd','XGEN','FORGE',{capacity:16000,iops:5.0},55000000,0.55,'legendary',12,'Crystal lattice.'),
  // PSU
  p('psu_nx_400','NX Bronze 400W','psu','GEN2','NEXUS',{wattage:400,eff:0.72},250000,0.2,'common',0,'400W budget.'),
  p('psu_nx_550','NX Bronze 550W','psu','GEN2','NEXUS',{wattage:550,eff:0.76},500000,0.2,'common',0,'Handles mid GPU.'),
  p('psu_ci_650','Cipher Gold 650W','psu','GEN3','CIPHER',{wattage:650,eff:0.82},1500000,0.2,'common',0,'Gold rated.'),
  p('psu_ci_700s','Cipher Gold 700W Silent','psu','GEN3','CIPHER',{wattage:700,eff:0.84},1900000,0.2,'common',0,'Fanless stealth.'),
  p('psu_ci_750','Cipher Gold 750W','psu','GEN3','CIPHER',{wattage:750,eff:0.85},2200000,0.25,'uncommon',0,'750W headroom.'),
  p('psu_ph_850','Phantom Platinum 850W','psu','GEN4','PHANTOM',{wattage:850,eff:0.89},4000000,0.3,'uncommon',0,'Platinum rated.'),
  p('psu_ph_1000','Phantom Platinum 1000W','psu','GEN4','PHANTOM',{wattage:1000,eff:0.91},6200000,0.3,'rare',0,'1kW.'),
  p('psu_kr_1200','Kronos Titanium 1200W','psu','GEN5','KRONOS',{wattage:1200,eff:0.94},12000000,0.35,'rare',0,'Titanium.'),
  p('psu_kr_1600','Kronos Titanium 1600W','psu','GEN5','KRONOS',{wattage:1600,eff:0.96},20000000,0.4,'legendary',0,'1600W.'),
  p('psu_fo_2000','QForge Fusion Cell','psu','XGEN','FORGE',{wattage:2000,eff:0.98},48000000,0.5,'legendary',0,'Micro-fusion.'),
  // COOLING
  p('cool_nx_air','NX Stock Cooler','cool','GEN2','NEXUS',{tdp:65,type:'air'},150000,0.15,'common',5,'It spins.'),
  p('cool_nx_tower','NX Tower Cooler','cool','GEN2','NEXUS',{tdp:95,type:'air'},400000,0.2,'common',8,'Big heatsink.'),
  p('cool_ci_aio1','Cipher AIO 120mm','cool','GEN3','CIPHER',{tdp:150,type:'liquid'},1500000,0.25,'common',12,'Entry liquid.'),
  p('cool_ci_aio1s','Cipher AIO 140mm Silent','cool','GEN3','CIPHER',{tdp:165,type:'liquid'},1800000,0.2,'common',10,'Dead silent.'),
  p('cool_ci_aio2','Cipher AIO 240mm','cool','GEN3','CIPHER',{tdp:200,type:'liquid'},2500000,0.25,'uncommon',15,'Dual-rad.'),
  p('cool_ph_air','Phantom NH-D15 Ultra','cool','GEN4','PHANTOM',{tdp:250,type:'air'},3500000,0.25,'uncommon',14,'Premium air.'),
  p('cool_ph_aio3','Phantom AIO 360mm','cool','GEN4','PHANTOM',{tdp:300,type:'liquid'},4800000,0.3,'uncommon',20,'Triple-rad.'),
  p('cool_ph_loop','Phantom Custom Loop','cool','GEN4','PHANTOM',{tdp:400,type:'liquid'},8000000,0.35,'rare',25,'Custom hardline.'),
  p('cool_kr_imm','Kronos Immersion Tank','cool','GEN5','KRONOS',{tdp:500,type:'cryo'},18000000,0.4,'legendary',35,'Full submersion.'),
  p('cool_fo_cryo','QForge Cryo Cascade','cool','XGEN','FORGE',{tdp:600,type:'cryo'},40000000,0.5,'legendary',20,'Near-absolute-zero.'),
  // NETWORK
  p('net_nx_1g','NX 1GbE NIC','net','GEN2','NEXUS',{bandwidth:1,latency:0.8},200000,0.15,'common',3,'Gigabit.'),
  p('net_nx_2g','NX 2.5GbE NIC','net','GEN2','NEXUS',{bandwidth:2,latency:0.7},500000,0.2,'common',5,'2.5G.'),
  p('net_ci_wifi','Cipher AX WiFi 6E','net','GEN3','CIPHER',{bandwidth:2,latency:0.6},1000000,0.2,'common',6,'Wireless.'),
  p('net_ci_5g','Cipher 5GbE Fiber','net','GEN3','CIPHER',{bandwidth:3,latency:0.5},1800000,0.25,'common',8,'Fiber backbone.'),
  p('net_ci_10g','Cipher 10GbE SFP+','net','GEN3','CIPHER',{bandwidth:4,latency:0.4},3500000,0.3,'uncommon',12,'SFP+ module.'),
  p('net_ph_10g','Phantom 10GbE DAC','net','GEN4','PHANTOM',{bandwidth:5,latency:0.3},5500000,0.3,'uncommon',15,'Direct-attach.'),
  p('net_ph_25g','Phantom 25GbE Fiber','net','GEN4','PHANTOM',{bandwidth:7,latency:0.2},9500000,0.35,'rare',18,'25G.'),
  p('net_kr_40g','Kronos 40GbE QSFP','net','GEN5','KRONOS',{bandwidth:8,latency:0.15},18000000,0.4,'rare',22,'40G.'),
  p('net_kr_100g','Kronos 100GbE InfiniBand','net','GEN5','KRONOS',{bandwidth:10,latency:0.1},35000000,0.45,'legendary',30,'100G.'),
  p('net_fo_qnet','QForge Quantum Relay','net','XGEN','FORGE',{bandwidth:10,latency:0.05},70000000,0.55,'legendary',15,'Entangled photon.'),
  // CASE
  p('case_nx_basic','NX Steel Box','case','GEN2','NEXUS',{airflow:1.0,style:0},100000,0.1,'common',0,'Beige steel.'),
  p('case_nx_mesh','NX Mesh Front','case','GEN2','NEXUS',{airflow:1.3,style:1},300000,0.15,'common',0,'Mesh panel.'),
  p('case_ci_open','Cipher Open Bench','case','GEN3','CIPHER',{airflow:2.5,style:1},800000,0.15,'common',0,'No case. Max cooling.'),
  p('case_ci_glass','Cipher Tempered Glass','case','GEN3','CIPHER',{airflow:1.5,style:3},1200000,0.2,'common',0,'Glass panel.'),
  p('case_ci_flow','Cipher Airflow Max','case','GEN3','CIPHER',{airflow:2.0,style:2},1800000,0.2,'uncommon',0,'Triple mesh.'),
  p('case_ph_itx','Phantom ITX Stealth','case','GEN4','PHANTOM',{airflow:1.4,style:5},2800000,0.25,'uncommon',0,'Tiny. Hard to detect.'),
  p('case_ph_rgb','Phantom RGB Tower','case','GEN4','PHANTOM',{airflow:1.8,style:6},3500000,0.25,'uncommon',0,'RGB. +REP per job.'),
  p('case_kr_rack','Kronos 4U Rackmount','case','GEN5','KRONOS',{airflow:2.5,style:4},6000000,0.3,'rare',0,'Server chassis.'),
  p('case_kr_custom','Kronos Custom CNC','case','GEN5','KRONOS',{airflow:2.2,style:8},12000000,0.35,'legendary',0,'CNC aluminum.'),
  p('case_fo_mirror','QForge Mirror Cube','case','XGEN','FORGE',{airflow:3.0,style:10},30000000,0.5,'legendary',0,'Invisible rig.'),
];

// ═══════════════════════════════════════════════════════════════
// SOFTWARE
// ═══════════════════════════════════════════════════════════════
const sw = (id,name,stats,basePrice,rarity,repReq,desc,repeatable) =>
  ({id,name,slot:'software',gen:null,maker:null,stats,basePrice,volatility:0.15,rarity,power:0,desc,type:'software',repReq:repReq||0,repeatable:repeatable||false});

export const SOFTWARE_DB = [
  sw('sw_crypter','FUD Crypter',{effect:'av_bypass'},1000000,'common',0,'Evades low-sec AV.',false),
  sw('sw_nse','NSE Scripts',{effect:'sec_levels'},2500000,'common',0,'SEC levels on map hover.',false),
  sw('sw_dpi','Deep Packet Inspector',{effect:'ettercap'},3500000,'uncommon',25,'Unlocks ettercap.',false),
  sw('sw_proxy','Proxychains',{effect:'proxy_cap_3'},5000000,'uncommon',50,'Proxy chain 2→3.',false),
  sw('sw_tor','TOR Relay Network',{effect:'proxy_cap_4'},12000000,'rare',150,'Proxy chain 3→4.',false),
  sw('sw_bribe','Bribe SOC Insider',{effect:'heat_minus_50'},500000,'common',0,'Instant -50% HEAT.',true),
  sw('sw_decoy','Decoy Packet Flooder',{effect:'trace_slow'},2000000,'common',10,'Slow trace +20% for 60s.',true),
  sw('sw_zeroday','0-Day Exploit Pack',{effect:'bypass_sec'},8000000,'rare',75,'Bypass any SEC once.',true),
  sw('sw_vpn','Stealth VPN Chain',{effect:'heat_resist'},4000000,'uncommon',30,'Heat gains -25%.',false),
  sw('sw_rootkit','Polymorphic Rootkit',{effect:'persist_bonus'},6000000,'rare',60,'Beacons 50% stealthier.',false),
  sw('sw_ai','AI Cracking Assistant',{effect:'hash_speed'},15000000,'legendary',100,'ML-accelerated hashcat.',false),
];

// ═══════════════════════════════════════════════════════════════
// COMMODITIES
// ═══════════════════════════════════════════════════════════════
export const COMMODITIES = {
  cc_dumps:   { name:'CC Dumps',          base:2000,    vol:1500,   desc:'Stolen credit card data' },
  botnets:    { name:'Botnet Access',     base:30000,   vol:20000,  desc:'Zombie net rentals' },
  exploits:   { name:'Exploit Kits',      base:150000,  vol:80000,  desc:'Pre-packaged vuln tools' },
  zerodays:   { name:'Weaponized 0-Days', base:2500000, vol:1500000,desc:'Unpatched vuln exploits' },
  ransomkeys: { name:'Ransom Decryptors', base:500000,  vol:400000, desc:'Keys from paid ransoms' },
  identities: { name:'Synthetic IDs',     base:75000,   vol:50000,  desc:'Deepfake identity packages' },
};

// ═══════════════════════════════════════════════════════════════
// INDEXES
// ═══════════════════════════════════════════════════════════════
export const PARTS_BY_ID = {};
PARTS_DB.forEach(x => { PARTS_BY_ID[x.id] = x; });
SOFTWARE_DB.forEach(x => { PARTS_BY_ID[x.id] = x; });

export const PARTS_BY_SLOT = {};
HW_SLOTS.forEach(s => { PARTS_BY_SLOT[s] = PARTS_DB.filter(x => x.slot === s); });
PARTS_BY_SLOT.software = SOFTWARE_DB;

// ═══════════════════════════════════════════════════════════════
// SYNERGY
// ═══════════════════════════════════════════════════════════════
function genDist(g1,g2) {
  if (!g1||!g2) return 0;
  if (g1==='XGEN'||g2==='XGEN') return -1;
  return Math.abs((GENS[g1]?.tier||0)-(GENS[g2]?.tier||0));
}

export function calculateSynergy(rig) {
  let score=0; const details=[];
  for (const [a,b] of COMPAT_PAIRS) {
    const pA=rig[a]?PARTS_BY_ID[rig[a]]:null, pB=rig[b]?PARTS_BY_ID[rig[b]]:null;
    if (!pA||!pB) continue;
    const d=genDist(pA.gen,pB.gen);
    let ps,lb;
    if (d===-1)                          {ps=1; lb='XGEN';}
    else if (d===0&&pA.maker===pB.maker) {ps=3; lb='PERFECT';}
    else if (d===0)                      {ps=2; lb='MATCHED';}
    else if (d===1)                      {ps=0; lb='NEUTRAL';}
    else if (d===2)                      {ps=-2;lb='BOTTLENECK';}
    else                                 {ps=-4;lb='SEVERE';}
    score+=ps; details.push({slotA:a,slotB:b,pairScore:ps,label:lb});
  }
  const cas=rig.case?PARTS_BY_ID[rig.case]:null;
  if (cas) score+=Math.floor(cas.stats.airflow);
  let rating,mult,color;
  if      (score>=16){rating='S';mult=1.30;color='#ffd866';}
  else if (score>=10){rating='A';mult=1.15;color='#a9dc76';}
  else if (score>=4) {rating='B';mult=1.00;color='#78dce8';}
  else if (score>=0) {rating='C';mult=0.90;color='#fc9867';}
  else               {rating='D';mult=0.75;color='#ff6188';}
  return {score,rating,multiplier:mult,color,details};
}

// ═══════════════════════════════════════════════════════════════
// POWER BUDGET
// ═══════════════════════════════════════════════════════════════
export function calculatePowerBudget(rig) {
  let draw=0,pW=0,pE=0.70;
  HW_SLOTS.forEach(s=>{
    const x=rig[s]?PARTS_BY_ID[rig[s]]:null; if(!x)return;
    if(s==='psu'){pW=x.stats.wattage;pE=x.stats.eff;}else draw+=x.power;
  });
  return {totalDraw:draw,psuWattage:pW,psuEff:pE,headroom:pW-draw,stable:pW>=draw,utilPct:pW>0?Math.round(draw/pW*100):0};
}

// ═══════════════════════════════════════════════════════════════
// GAMEPLAY EFFECTS
// ═══════════════════════════════════════════════════════════════
export function getRigEffects(rig) {
  const syn=calculateSynergy(rig), pow=calculatePowerBudget(rig);
  const m=syn.multiplier, st=pow.stable?1:0.6;
  const cpu=rig.cpu?PARTS_BY_ID[rig.cpu]:null, gpu=rig.gpu?PARTS_BY_ID[rig.gpu]:null;
  const ram=rig.ram?PARTS_BY_ID[rig.ram]:null, ssd=rig.ssd?PARTS_BY_ID[rig.ssd]:null;
  const psu=rig.psu?PARTS_BY_ID[rig.psu]:null, cool=rig.cool?PARTS_BY_ID[rig.cool]:null;
  const net=rig.net?PARTS_BY_ID[rig.net]:null, cas=rig.case?PARTS_BY_ID[rig.case]:null;
  return {
    synergy:syn, power:pow,
    hashSpeed:      Math.round(((cpu?.stats.clock||0.5)+(gpu?.stats.vram||0)*0.05)*m*st*100)/100,
    mineMultiplier: Math.round((gpu?.stats.cores||0)*m*st*100)/100,
    maxProxies:     1+Math.floor((ram?.stats.size||0)/32),
    traceMultiplier:Math.round(Math.max(0.2,1/((ram?.stats.speed||1)*(psu?.stats.eff||0.7)))*m*st*100)/100,
    exfilMultiplier:Math.round((ssd?.stats.iops||1)*m*st*100)/100,
    scanCount:      Math.max(1,Math.min(10,Math.floor((net?.stats.bandwidth||1)*st))),
    heatReduction:  cool?Math.round(Math.min(0.8,(cool.stats.tdp/Math.max(1,pow.totalDraw))*(psu?.stats.eff||0.7)*(cas?.stats.airflow||1))*100)/100:0,
    repBonus:       Math.floor((cas?.stats.style||0)*0.5),
    failChance:     !pow.stable?Math.min(0.3,Math.abs(pow.headroom)/200):0,
  };
}

// ═══════════════════════════════════════════════════════════════
// UNIFIED MARKET ENGINE
// ═══════════════════════════════════════════════════════════════
const RMULT={
  'us-gov':{cpu:1,gpu:1.1,ram:1,ssd:.9,psu:.9,cool:1,net:.8,case:1,software:1},
  'ru-darknet':{cpu:.7,gpu:.6,ram:.8,ssd:1,psu:1.2,cool:1.3,net:1.1,case:.5,software:.6},
  'cn-financial':{cpu:.6,gpu:.7,ram:.6,ssd:.7,psu:.8,cool:.9,net:1,case:.7,software:.8},
  'eu-central':{cpu:1.2,gpu:1.3,ram:1.1,ssd:1.1,psu:1,cool:.8,net:.9,case:1.4,software:1.2},
};
const RMAKER={
  'us-gov':{PHANTOM:.85,KRONOS:1.2},
  'ru-darknet':{FORGE:.5,NEXUS:.7},
  'cn-financial':{NEXUS:.5,CIPHER:.6},
  'eu-central':{KRONOS:.8,PHANTOM:.9},
};
const RSTOCK={'us-gov':.55,'ru-darknet':.40,'cn-financial':.65,'eu-central':.50};

export const MARKET_EVENTS = [
  {text:'KRONOS shipment seized — KRONOS +80%',filter:x=>x.maker==='KRONOS',mult:1.8},
  {text:'NEXUS overproduction — NEXUS -40%',filter:x=>x.maker==='NEXUS',mult:.6},
  {text:'CIPHER factory fire — CIPHER +60%',filter:x=>x.maker==='CIPHER',mult:1.6},
  {text:'QForge lab raided — X-GEN +100%',filter:x=>x.gen==='XGEN',mult:2},
  {text:'Mining boom — GPUs +90%',filter:x=>x.slot==='gpu',mult:1.9},
  {text:'Mining crash — GPUs dumped at 35%',filter:x=>x.slot==='gpu',mult:.35},
  {text:'Data center liquidation — SSDs -50%',filter:x=>x.slot==='ssd',mult:.5},
  {text:'Heatwave — cooling +70%',filter:x=>x.slot==='cool',mult:1.7},
  {text:'PSU shortage — PSUs +55%',filter:x=>x.slot==='psu',mult:1.55},
  {text:'Trade sanctions — GEN5 +65%',filter:x=>x.gen==='GEN5',mult:1.65},
  {text:'Black Friday — everything -25%',filter:()=>true,mult:.75},
  {text:'Supply crisis — all +40%',filter:()=>true,mult:1.4},
  {text:'RAM shortage — memory ×2',filter:x=>x.slot==='ram',mult:2},
  {text:'Infra deal — NICs -45%',filter:x=>x.slot==='net',mult:.55},
  {text:'GEN4 clearance — GEN4 -30%',filter:x=>x.gen==='GEN4',mult:.7},
  {text:'PHANTOM buyout — PHANTOM +50%',filter:x=>x.maker==='PHANTOM',mult:1.5},
  {text:'Software crackdown — tools +45%',filter:x=>x.type==='software',mult:1.45},
  {text:'Exploit leak — software -35%',filter:x=>x.type==='software',mult:.65},
];

export function generateUnifiedMarket(region, btcIndex, reputation) {
  const rate=RSTOCK[region]||.5, rm=RMULT[region]||{}, mb=RMAKER[region]||{};
  const ec=Math.random()<.3?2:1;
  const evts=[...MARKET_EVENTS].sort(()=>Math.random()-.5).slice(0,ec);
  const all=[...PARTS_DB,...SOFTWARE_DB.filter(s=>(s.repReq||0)<=reputation)];
  const avail=all.filter(()=>Math.random()<rate);
  const stock=avail.map(part=>{
    let price=part.basePrice*(1+(Math.random()*2-1)*part.volatility);
    price*=(rm[part.slot]||1);
    if(part.maker&&mb[part.maker])price*=mb[part.maker];
    for(const e of evts){if(e.filter(part))price*=e.mult;}
    price*=btcIndex;
    let qty;
    if(part.rarity==='common')qty=Math.floor(Math.random()*5)+1;
    else if(part.rarity==='uncommon')qty=Math.floor(Math.random()*3)+1;
    else if(part.rarity==='rare')qty=Math.random()<.6?1:0;
    else qty=Math.random()<.25?1:0;
    if(part.repeatable)qty=99;
    const f=Math.max(100,Math.round(price));
    const ratio=Math.round(f/part.basePrice*100);
    return {partId:part.id,price:f,qty,trend:ratio>115?'up':ratio<85?'down':'flat',ratio};
  }).filter(s=>s.qty>0);

  const commodityPrices={};
  Object.keys(COMMODITIES).forEach(k=>{
    const c=COMMODITIES[k]; let pr=Math.max(10,Math.round((c.base+(Math.random()*c.vol*2)-c.vol)*btcIndex));
    if(Math.random()<.12)pr=Math.round(pr*.25);
    else if(Math.random()<.12)pr=Math.round(pr*3.5);
    commodityPrices[k]=pr;
  });
  return {stock,events:evts.map(e=>e.text),region,btcIndex,commodityPrices};
}

export function getSellPrice(partId,marketStock){
  const l=(marketStock||[]).find(s=>s.partId===partId);
  if(l)return Math.round(l.price*(.6+Math.random()*.2));
  const x=PARTS_BY_ID[partId]; return x?Math.round(x.basePrice*.5):0;
}

export const RARITY_COLORS = {
  common:'#727072',uncommon:'#78dce8',rare:'#a9dc76',legendary:'#ffd866',
};
