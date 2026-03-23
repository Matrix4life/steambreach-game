// Split from UpdatedPeople.jsx
const HOURLY_RATE = 500;

export const COLORS = {
  bg: '#0a0a0f',
  bgPanel: '#111118',
  bgDark: '#08080c',
  text: '#fcfcfa',
  textDim: '#727072',
  primary: '#78dce8',
  primaryDim: '#4a8b96',
  secondary: '#a9dc76',
  danger: '#ff6188',
  warning: '#ffd866',
  ip: '#78dce8',
  file: '#fc9867',
  chat: '#ab9df2',
  mapNode: '#78dce8',
  infected: '#ab9df2',
  looted: '#ffd866',
  proxy: '#fc9867',
  elite: '#ff6188',
  border: '#2d2a2e',
  borderActive: '#403e41',
};

// ==========================================
// 2. MASTER COMMAND REGISTRY
// ==========================================
const COMMAND_REGISTRY = [
  { cmd: 'nmap [ip]', desc: 'Scan network or specific target' },
  { cmd: 'hydra <ip>', desc: 'Brute-force SSH credentials' },
  { cmd: 'sqlmap <ip>', desc: 'SQL injection attack' },
  { cmd: 'msfconsole <ip>', desc: 'Exploit unpatched SMB' },
  { cmd: 'curl <ip>', desc: 'Exploit HTTP/LFI vulnerability' },
  { cmd: 'spearphish <e>', desc: 'Social engineer an employee' },
  { cmd: 'pwnkit', desc: 'Privilege escalation to root' },
  { cmd: 'ettercap', desc: 'ARP poison + sniff network comms' },
  { cmd: 'sliver', desc: 'Deploy C2 botnet beacon (root)' },
  { cmd: 'chisel', desc: 'Create SOCKS5 proxy tunnel (root)' },
  { cmd: 'disconnect <ip>', desc: 'Remove proxy or botnet node' },
  { cmd: 'hping3 <ip>', desc: 'Botnet SYN flood DDoS attack' },
  { cmd: 'mimikatz <ip>', desc: 'Dump LSASS creds from botnet node' },
  { cmd: 'stash <file>', desc: 'Stage exfil through botnet' },
  { cmd: 'msfvenom <arg>', desc: 'Deploy viral payloads (root)' },
  { cmd: 'eternalblue <arg>', desc: 'Mass SMBv1 propagation (root)' },
  { cmd: 'reptile <arg>', desc: 'Install stealth kernel rootkit (root)' },
  { cmd: 'xmrig <arg>', desc: 'Deploy cryptominer for passive XMR (root)' },
  { cmd: 'shred <arg>', desc: 'Destroy target file system (root)' },
  { cmd: 'openssl <arg>', desc: 'Deploy ransomware payload (root)' },
  { cmd: 'crontab <arg>', desc: 'Schedule logic bombs (root)' },
  { cmd: 'wipe', desc: 'Scrub system logs (root)' },
  { cmd: 'exfil <file>', desc: 'Extract financial assets' },
  { cmd: 'use <item>', desc: 'Consume a hidden item (decoy, burner, 0day)' },
  { cmd: 'download <file>', desc: 'Save remote file locally' },
  { cmd: 'hashcat <file>', desc: 'Crack hashes (-d for botnet pool)' },
  { cmd: 'contracts', desc: 'View AI fixer contracts board' },
  { cmd: 'travel <region>', desc: 'Route gateway to new global subnet' },
  { cmd: 'market', desc: 'Open Black Market Trading UI' },
  { cmd: 'shop', desc: 'Access darknet software & hardware market' },
  { cmd: 'status', desc: 'View operator threat assessment & inventory' },
  { cmd: 'ls / cd / pwd', desc: 'Navigate file systems' },
  { cmd: 'cat <file>', desc: 'Read file contents' },
  { cmd: 'clear', desc: 'Clear terminal output' },
  { cmd: 'save', desc: 'Save current progress' },
  { cmd: 'menu', desc: 'Return to main menu' }
];

const DEV_COMMANDS = [
  { cmd: 'sudo devmode', desc: 'Toggle Developer Godmode' },
  { cmd: 'dev.money <amt>', desc: 'Inject XMR' },
  { cmd: 'dev.item <id>', desc: 'Add shop item to inventory' },
  { cmd: 'dev.score <num>', desc: 'Override AI Director skill score' },
  { cmd: 'dev.reveal', desc: 'Remove fog of war from network map' }
];

const REGIONS = ['us-gov', 'ru-darknet', 'cn-financial', 'eu-central'];
const COMMODITIES = {
  cc_dumps: { name: 'CC Dumps', base: 20, vol: 15 },
  botnets: { name: 'Botnet Access', base: 300, vol: 200 },
  exploits: { name: 'Exploit Kits', base: 1500, vol: 800 },
  zerodays: { name: 'Weaponized 0-Days', base: 25000, vol: 15000 },
};

const generateMarketPrices = () => {
  const prices = {};
  Object.keys(COMMODITIES).forEach(key => {
    const item = COMMODITIES[key];
    const variance = (Math.random() * item.vol * 2) - item.vol;
    prices[key] = Math.max(1, Math.floor(item.base + variance));
  });
  if (Math.random() < 0.2) {
    const keys = Object.keys(COMMODITIES);
    const crashedKey = keys[Math.floor(Math.random() * keys.length)];
    prices[crashedKey] = Math.floor(prices[crashedKey] * 0.2);
  } else if (Math.random() < 0.2) {
    const keys = Object.keys(COMMODITIES);
    const boomKey = keys[Math.floor(Math.random() * keys.length)];
    prices[boomKey] = Math.floor(prices[boomKey] * 2.5); 
  }
  return prices;
};

// ==========================================
// 3. AI AGENTS (FIXER, EMPLOYEES, BLUE TEAM)

export {
  HOURLY_RATE,
  COLORS,
  COMMAND_REGISTRY,
  DEV_COMMANDS,
  REGIONS,
  COMMODITIES,
  generateMarketPrices,
};
