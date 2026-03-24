import React, { useState, useEffect, useRef } from 'react';

// --- MODULAR IMPORTS ---
import Header from './components/Header';
import RigDisplay from './components/RigDisplay';
import NetworkMap from './components/NetworkMap';
import DarknetShop from './components/DarknetShop';
import ContractBoard from './components/ContractBoard';
import MarketBoard from './components/MarketBoard';
import { COLORS } from './constants/gameConstants';
import { generateNewTarget } from './world/generation';
import { invokeBlueTeamAI, generateAIContract, generateInterceptedComms } from './ai/agents';

export default function STEAMBREACH() {
  // --- CORE SYSTEM STATE ---
  const [money, setMoney] = useState(2500);
  const [reputation, setReputation] = useState(0);
  const [heat, setHeat] = useState(0);
  const [trace, setTrace] = useState(0);
  const [inventory, setInventory] = useState(['CPU', 'RAM', 'Storage', 'PSU', 'Scanner']);
  const [consumables, setConsumables] = useState({ decoy: 0, burner: 0, zeroday: 0 });
  const [localHashes, setLocalHashes] = useState([]);
  const [gameMode, setGameMode] = useState('field'); // 'arcade', 'field', 'operator'
  const [currentRegion, setCurrentRegion] = useState('US-EAST');
  
  // --- NETWORK & HACKING STATE ---
  const [world, setWorld] = useState({
    local: { name: 'KALI-GATEWAY', ip: '127.0.0.1', isHidden: false, files: {}, contents: {} }
  });
  const [botnet, setBotnet] = useState([]);
  const [proxies, setProxies] = useState([]);
  const [looted, setLooted] = useState([]);
  const [isInside, setIsInside] = useState(false);
  const [targetIP, setTargetIP] = useState(null);
  const [currentDir, setCurrentDir] = useState('~');
  const [privilege, setPrivilege] = useState('local');

  // --- UI & TERMINAL STATE ---
  const [terminal, setTerminal] = useState([
    { type: 'sys', text: 'STEAMBREACH OS v4.2.1 INITIALIZED.', isNew: false },
    { type: 'sys', text: 'KALI GATEWAY SECURE. LOCAL CONNECTION ESTABLISHED.', isNew: false },
    { type: 'sys', text: 'Type "help" to view available payload modules.', isNew: false }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState('terminal'); // terminal, shop, contracts, market
  const [mapExpanded, setMapExpanded] = useState(false);
  const [rigExpanded, setRigExpanded] = useState(false);
  
  // --- CONTRACT STATE ---
  const [activeContract, setActiveContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminal]);

  // Initial World Generation
  useEffect(() => {
    const initialWorld = { local: { name: 'KALI-GATEWAY', ip: '127.0.0.1', isHidden: false, files: {}, contents: {} } };
    for(let i=0; i<4; i++) {
      const node = generateNewTarget();
      initialWorld[node.ip] = node.data;
    }
    setWorld(initialWorld);
  }, []);

  // --- HELPER FUNCTIONS ---
  const getRewardMult = (mode) => {
    if (mode === 'operator') return 2.5;
    if (mode === 'field') return 1.0;
    return 0.5; // arcade
  };

  const escalateBlueTeam = async (ip, amount) => {
    setTrace(t => Math.min(t + amount, 100));
    // Could invoke BlueTeamAI here if trace gets high enough
  };

  const selectNodeFromMap = (ip) => {
    if (isProcessing) return;
    setInput(`hydra ${ip}`); // Quick-fill command for map clicks
  };

  // --- COMMAND PARSER ---
  const handleCommand = async (e) => {
    if (e.key !== 'Enter' || !input.trim() || isProcessing) return;

    const cmdString = input.trim();
    const [cmd, ...args] = cmdString.split(' ');
    const arg1 = args[0];
    
    setInput('');
    setTerminal(prev => [...prev, { type: 'in', text: `${privilege}@${targetIP || 'local'}:${currentDir}$ ${cmdString}`, isNew: false }]);

    // Centralized Breach Logic
    const handleBreach = async (toolName, reqOp, reqField) => {
      if (isInside) return `[-] ${toolName}: Already connected to a host. Type 'exit' first.`;
      
      const targetIpStr = args.find(a => a.match(/\d+\.\d+\.\d+\.\d+/));
      if (!targetIpStr) return `[-] ${toolName}: Missing target IP.`;
      
      if (gameMode === 'operator') {
         const hasAllOp = reqOp.every(flag => args.includes(flag));
         if (!hasAllOp) return `[-] ${toolName}: Operator mode syntax error.\n[*] Required flags: ${reqOp.join(' ')}`;
      }
      if (gameMode === 'field') {
         const hasAllField = reqField.every(flag => args.includes(flag));
         if (!hasAllField) return `[-] ${toolName}: Field mode syntax error.\n[*] Required flags: ${reqField.join(' ')}`;
      }

      if (!world[targetIpStr]) return `[-] ${toolName}: Connection refused. Host down or unreachable.`;
      const node = world[targetIpStr];
      
      if (node.exp !== toolName) {
          setHeat(h => Math.min(h + 10, 100));
          return `[-] ${toolName}: Exploit failed against target architecture. Intrusion detected! Heat +10%`;
      }

      setIsProcessing(true);
      setTerminal(prev => [...prev, { type: 'out', text: `[*] Launching ${toolName} against ${targetIpStr}...`, isNew: false }]);
      await new Promise(r => setTimeout(r, gameMode === 'operator' ? 3000 : 1500));
      
      setIsInside(true);
      setTargetIP(targetIpStr);
      setCurrentDir('/');
      setPrivilege('root');
      setIsProcessing(false);
      
      return `[+] BREACH SUCCESSFUL. Root shell established on ${targetIpStr}.`;
    };

    const COMMANDS = {
      // ==========================================
      // SYSTEM UTILITIES
      // ==========================================
      help: async () => {
        return `
[STEAMBREACH OS - ACTIVE COMMANDS]

-- RECON & BREACH --
nmap        : Scan subnet for vulnerable targets.
hydra       : Brute-force SSH protocols.
sqlmap      : Inject and breach HTTP databases.
msfconsole  : Exploit SMB/RPC vulnerabilities.

-- POST-EXPLOITATION --
ls          : List directory contents on remote host.
download    : Exfiltrate files to local storage or inventory.
ettercap    : Intercept local network traffic (Lore/Clues).

-- DESTRUCTIVE & MERCENARY --
shred       : Destroy target filesystem (Destruction Contracts).
openssl     : Deploy encryption payload (Ransomware Contracts).

-- LOCAL UTILITIES --
john        : Crack downloaded .hashes locally for XMR.
clear       : Clear terminal output.
exit        : Terminate remote connection.

[!] Syntax requirements scale with your selected Game Mode (Arcade/Field/Operator).
        `;
      },

      clear: async () => {
        setTerminal([]);
        return "";
      },

      exit: async () => {
        if (!isInside) return "[-] exit: You are not connected to a remote host.";
        setIsInside(false);
        setTargetIP(null);
        setCurrentDir('~');
        setPrivilege('local');
        return "[*] Connection terminated. Returned to local machine.";
      },

      ls: async () => {
        if (!isInside) return "[-] ls: Must be connected to a remote host.";
        const files = world[targetIP]?.files?.[currentDir];
        if (!files || files.length === 0) return "Directory is empty.";
        return files.join('  ');
      },

      // ==========================================
      // RECONNAISSANCE
      // ==========================================
      nmap: async () => {
        if (isInside) return "[-] nmap: Cannot scan from inside a breached node. Type 'exit' first.";
        
        if (gameMode === 'operator' && (!args.includes('-sS') || !args.includes('-p-'))) {
          return "[-] nmap: Operator mode requires stealth SYN scan across all ports.\n[*] Usage: nmap -sS -p- <subnet>";
        }
        if (gameMode === 'field' && !args.includes('-sn')) {
          return "[-] nmap: Field mode requires ping sweep flag.\n[*] Usage: nmap -sn <subnet>";
        }

        setIsProcessing(true);
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Initiating deep subnet scan...`, isNew: false }]);
        await new Promise(r => setTimeout(r, gameMode === 'operator' ? 3000 : 1500));
        
        const newTarget = generateNewTarget(null, targetIP); 
        setWorld(prev => ({ ...prev, [newTarget.ip]: newTarget.data }));
        
        setIsProcessing(false);
        return `[+] SCAN COMPLETE.\n[+] Found active host: ${newTarget.ip}\n[*] Run vulnerability scans to determine exploit vector.`;
      },

      // ==========================================
      // EXPLOIT PAYLOADS
      // ==========================================
      hydra: async () => handleBreach('hydra', ['-l', 'root', '-P', 'pass.txt'], ['-l', 'root']),
      sqlmap: async () => handleBreach('sqlmap', ['--dump', '--random-agent'], ['--dump']),
      msfconsole: async () => handleBreach('msfconsole', ['-q', '-x'], ['-q']),

      // ==========================================
      // SNIFFING & LORE
      // ==========================================
      ettercap: async () => {
        if (!isInside) return "[-] ettercap: Must be executed on a compromised remote host.";
        
        if (gameMode === 'operator' && (!args.includes('-Tq') || !args.includes('-M') || !args.includes('arp'))) {
            return "[-] ettercap: Operator requires quiet text mode and ARP poisoning.\n[*] Usage: ettercap -Tq -M arp";
        }
        if (gameMode === 'field' && !args.includes('-Tq')) {
            return "[-] ettercap: Field requires quiet text mode.\n[*] Usage: ettercap -Tq";
        }

        setIsProcessing(true);
        setHeat(h => Math.min(h + 5, 100)); 
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Poisoning ARP cache...`, isNew: false }]);
        await new Promise(r => setTimeout(r, 1000));
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Intercepting local traffic on ${targetIP}...`, isNew: false }]);
        await new Promise(r => setTimeout(r, 1500));
        
        const orgData = world[targetIP]?.org || { orgName: 'Unknown Corp' };
        const emp1 = orgData.employees?.[0]?.name || 'Admin';
        const emp2 = orgData.employees?.[1]?.name || 'DevOps';
        const lore = `[14:02:11] SRC:${targetIP} <${emp1}>: Ensure the backup server is patched today.\n[14:03:05] SRC:10.0.1.12 <${emp2}>: On it. Using the same default credentials as last time.`;
        
        setIsProcessing(false);
        return `[+] PACKET CAPTURE COMPLETE.\n\n${lore}\n\n[!] Trace increased by +5%.`;
      },

      // ==========================================
      // PASSWORD CRACKING
      // ==========================================
      john: async () => {
        if (isInside) return "[-] john: Must be run on your local rig. Type 'exit' to disconnect first.";
        if (!arg1) {
          const files = localHashes.length > 0 ? localHashes.join('\n    ') : '(No hash files downloaded)';
          return `[-] john: missing target file.\n[*] Usage: john <filename>\n[*] Local hash files available:\n    ${files}`;
        }
        
        if (gameMode === 'operator' && !args.includes('--wordlist=rockyou.txt')) {
           return "[-] john: Operator mode requires specifying dictionary.\n[*] Usage: john --wordlist=rockyou.txt <filename>";
        }
        if (gameMode === 'field' && !args.includes('--format=raw')) {
           return "[-] john: Field mode requires format flag.\n[*] Usage: john --format=raw <filename>";
        }

        if (!localHashes.includes(arg1)) return `[-] john: File '${arg1}' not found on local drive. Did you download it?`;

        let cpuTier = inventory.includes('CPU_MK3') ? 3 : inventory.includes('CPU_MK2') ? 2 : inventory.includes('CPU') ? 1 : 0;
        const crackTime = cpuTier === 3 ? 2000 : cpuTier === 2 ? 4000 : cpuTier === 1 ? 6000 : 8000;
        const heatSpike = cpuTier === 3 ? 10 : cpuTier === 2 ? 15 : cpuTier === 1 ? 25 : 40;

        setIsProcessing(true);
        setHeat(h => Math.min(h + heatSpike, 100));

        setTerminal(prev => [...prev, { type: 'out', text: `[*] Loading ${arg1}... 14,021 password hashes loaded.`, isNew: false }]);
        await new Promise(r => setTimeout(r, 800));
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Initiating brute-force and dictionary attacks...`, isNew: false }]);
        setTerminal(prev => [...prev, { type: 'out', text: `[!] WARNING: CPU load at maximum. Thermals rising (+${heatSpike}%).`, isNew: false }]);
        
        await new Promise(r => setTimeout(r, crackTime));

        const payout = Math.floor(Math.random() * 25000 + 5000);
        setMoney(m => m + payout);
        setLocalHashes(prev => prev.filter(f => f !== arg1));
        setIsProcessing(false);
        
        return `[+] CRACKING COMPLETE.\n[+] Found 3 sysadmin passwords.\n[+] Extracted hidden offshore wallet keys: $${payout.toLocaleString()} XMR acquired.\n[*] ${arg1} has been processed and cleared from local drive.`;
      },

      // ==========================================
      // EXFILTRATION
      // ==========================================
      download: async () => {
        if (!isInside) return "[-] download: Connection required. Connect to a remote host first.";
        
        const mult = getRewardMult(gameMode);
        const currentFiles = world[targetIP]?.files?.[currentDir] || [];
        
        const removeFileFromServer = (targetFile) => {
          setWorld(prev => {
            const nw = { ...prev };
            if (nw[targetIP] && nw[targetIP].files[currentDir]) {
               nw[targetIP].files[currentDir] = nw[targetIP].files[currentDir].filter(f => f !== targetFile);
            }
            return nw;
          });
        };

        const processLoot = (targetFile) => {
          if (targetFile === 'decoy.bin') {
            setConsumables(prev => ({ ...prev, decoy: prev.decoy + 1 }));
            removeFileFromServer(targetFile);
            return `[+] TRANSFER COMPLETE: ${targetFile}\n[+] 1x TRACE DECOY added to inventory.`;
          }
          if (targetFile === 'burner.ovpn') {
            setConsumables(prev => ({ ...prev, burner: prev.burner + 1 }));
            removeFileFromServer(targetFile);
            return `[+] TRANSFER COMPLETE: ${targetFile}\n[+] 1x BURNER VPN added to inventory.`;
          }
          if (targetFile === '0day_poc.sh') {
            setConsumables(prev => ({ ...prev, zeroday: prev.zeroday + 1 }));
            removeFileFromServer(targetFile);
            return `[+] TRANSFER COMPLETE: ${targetFile}\n[+] 1x WEAPONIZED ZERO-DAY added to inventory.`;
          }
          if (targetFile === 'wallet.dat') {
            const loot = Math.floor((Math.random() * 4000 + 1000) * mult);
            setMoney(m => m + loot);
            removeFileFromServer(targetFile);
            return `[+] TRANSFER COMPLETE: ${targetFile}\n[+] Decrypted wallet. $${loot.toLocaleString()} XMR extracted to local funds.`;
          }

          if (activeContract?.type === 'exfil' && activeContract.targetIP === targetIP && activeContract.targetFile === targetFile) {
            const timeTaken = (Date.now() - activeContract.startTime) / 1000;
            if (timeTaken <= activeContract.timeLimit && heat <= activeContract.heatCap) {
              setMoney(m => m + activeContract.reward);
              setReputation(r => r + activeContract.repReward);
              setContracts(prev => prev.map(c => c.id === activeContract.id ? { ...c, completed: true, active: false } : c));
              setActiveContract(null); 
              removeFileFromServer(targetFile);
              return `[+] TRANSFER COMPLETE: ${targetFile}\n\n[FIXER] CONTRACT ${activeContract.id} FULFILLED.\n[+] BONUS: $${activeContract.reward.toLocaleString()} + ${activeContract.repReward} REP`;
            } else {
               removeFileFromServer(targetFile);
               return `[+] TRANSFER COMPLETE: ${targetFile}\n[-] CONTRACT FAILED: Parameters not met (Time or Heat exceeded).`;
            }
          }

          if (targetFile.endsWith('.hashes') || targetFile.endsWith('.bak')) {
            setLocalHashes(prev => [...prev, targetFile]);
            removeFileFromServer(targetFile);
            return `[+] TRANSFER COMPLETE: ${targetFile}\n[*] Encrypted hashes secured locally. Run 'john ${targetFile}' to crack.`;
          }
          
          return `[+] TRANSFER COMPLETE: ${targetFile}\n[*] File safely stored to local drive.`;
        };

        if (gameMode === 'operator') {
          if (!arg1) return "[-] download: missing file operand\n[*] Usage: download --scp <filename>\n[*] Operator mode requires secure copy protocol.";
          const hasScp = args.includes('--scp');
          const targetFile = hasScp ? args.find(a => a !== '--scp' && a !== 'download') : arg1;

          if (!hasScp) return "[-] download: Insecure connection blocked by target IDS.\n[*] Use '--scp' flag to tunnel the download.";
          if (!targetFile) return "[-] download: missing target file.";
          if (!currentFiles.includes(targetFile)) return `download: ${targetFile}: No such file or directory`;

          setIsProcessing(true);
          setHeat(h => Math.min(h + 8, 100)); 
          setTerminal(prev => [...prev, { type: 'out', text: `[*] Establishing secure SCP tunnel to ${targetIP}...`, isNew: false }]);
          await new Promise(r => setTimeout(r, 1500));
          setIsProcessing(false);
          return processLoot(targetFile) + "\n[!] SCP transfer generated +8% Heat.";
        }

        if (gameMode === 'field') {
          if (!arg1) return "[-] download: missing file operand\n[*] Usage: download <filename>";
          if (!currentFiles.includes(arg1)) return `download: ${arg1}: No such file or directory`;

          setIsProcessing(true);
          setHeat(h => Math.min(h + 3, 100)); 
          setTerminal(prev => [...prev, { type: 'out', text: `[*] Initiating packet stream for ${arg1}...`, isNew: false }]);
          await new Promise(r => setTimeout(r, 1500));
          setIsProcessing(false);
          return processLoot(arg1) + "\n[!] File transfer generated +3% Heat.";
        }

        if (!arg1) return "[-] download: missing file operand\n[*] Usage: download <filename>";
        if (!currentFiles.includes(arg1)) return `download: ${arg1}: No such file or directory`;

        setIsProcessing(true);
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Downloading ${arg1}...`, isNew: false }]);
        await new Promise(r => setTimeout(r, 500)); 
        setIsProcessing(false);
        return processLoot(arg1);
      },

      // ==========================================
      // DESTRUCTION & RANSOMWARE
      // ==========================================
      shred: async () => {
        const mult = getRewardMult(gameMode);
        
        const checkContract = () => {
          if (activeContract?.type === 'destroy' && activeContract.targetIP === targetIP) {
            const timeTaken = (Date.now() - activeContract.startTime) / 1000;
            if (timeTaken <= activeContract.timeLimit && heat <= activeContract.heatCap) {
              setMoney(m => m + activeContract.reward);
              setReputation(r => r + activeContract.repReward);
              setContracts(prev => prev.map(c => c.id === activeContract.id ? { ...c, completed: true, active: false } : c));
              setActiveContract(null); 
              return `\n\n[FIXER] CONTRACT ${activeContract.id} FULFILLED.\n[+] BONUS: $${activeContract.reward.toLocaleString()} + ${activeContract.repReward} REP`;
            }
          }
          return "";
        };
        
        if (gameMode === 'operator') {
          const hasFlags = args.includes('-vfz') || (args.includes('-v') && args.includes('-f') && args.includes('-z'));
          const hasTarget = args.some(a => a.startsWith('/dev/'));
          if (!isInside) return "[-] shred: Must be executed on a remote host with root access.";
          if (!hasFlags || !hasTarget) return `[-] shred: Invalid syntax.\n[*] Usage: shred -vfz -n 3 /dev/sda`;
          const passes = args.find(a => a === '-n') ? parseInt(args[args.indexOf('-n') + 1]) || 3 : 3;
          
          setIsProcessing(true);
          for (let i = 1; i <= passes; i++) {
            setTerminal(prev => [...prev, { type: 'out', text: `shred: /dev/sda: pass ${i}/${passes} (random)...`, isNew: false }]);
            await new Promise(r => setTimeout(r, 1500));
          }
          
          const bounty = Math.floor((world[targetIP]?.val || 20000) * 1.5 * mult);
          setMoney(m => m + bounty);
          setHeat(h => Math.min(h + 25, 100));
          setIsInside(false); setTargetIP(null); setCurrentDir('~');
          setIsProcessing(false);
          return `[+] shred: /dev/sda — ${passes + 1} passes complete. Disk destroyed.\n[+] Destruction bounty: $${bounty.toLocaleString()}\n[!] Heat +25%.` + checkContract();
        }
        
        if (gameMode === 'field') {
          if (!isInside) return "[-] shred: Must be executed on a remote host.";
          if (!arg1) return `[-] shred: Select destruction depth:\n    shred mbr\n    shred fs\n    shred full`;
          
          setIsProcessing(true);
          setTerminal(prev => [...prev, { type: 'out', text: `shred: /dev/sda — ${arg1.toUpperCase()} destruction in progress...`, isNew: false }]);
          await new Promise(r => setTimeout(r, 2000));
          
          const bounty = Math.floor((world[targetIP]?.val || 20000) * mult);
          setMoney(m => m + bounty);
          setHeat(h => Math.min(h + 18, 100));
          setIsInside(false); setTargetIP(null); setCurrentDir('~');
          setIsProcessing(false);
          return `[+] File system destroyed. Destruction bounty: $${bounty.toLocaleString()}\n[!] Heat +18%.` + checkContract();
        }
        
        if (!isInside) return "[-] shred: Must be executed on a remote host.";
        setIsProcessing(true);
        setTerminal(prev => [...prev, { type: 'out', text: `shred: /dev/sda — overwriting disk...`, isNew: false }]);
        await new Promise(r => setTimeout(r, 1500));
        
        const bounty = Math.floor((world[targetIP]?.val || 20000) * 1.5 * mult);
        setMoney(m => m + bounty);
        setHeat(h => Math.min(h + 10, 100));
        setIsInside(false); setTargetIP(null); setCurrentDir('~');
        setIsProcessing(false);
        return `[+] DISK DESTROYED.\n[+] Destruction bounty: $${bounty.toLocaleString()}\n[!] Heat +10%.` + checkContract();
      },

      openssl: async () => {
        const mult = getRewardMult(gameMode);
        
        const checkContract = () => {
          if (activeContract?.type === 'ransom' && activeContract.targetIP === targetIP) {
            const timeTaken = (Date.now() - activeContract.startTime) / 1000;
            if (timeTaken <= activeContract.timeLimit && heat <= activeContract.heatCap) {
              setMoney(m => m + activeContract.reward);
              setReputation(r => r + activeContract.repReward);
              setContracts(prev => prev.map(c => c.id === activeContract.id ? { ...c, completed: true, active: false } : c));
              setActiveContract(null); 
              return `\n\n[FIXER] CONTRACT ${activeContract.id} FULFILLED.\n[+] BONUS: $${activeContract.reward.toLocaleString()} + ${activeContract.repReward} REP`;
            }
          }
          return "";
        };
        
        if (gameMode === 'operator') {
          if (!isInside) return "[-] openssl: Must be on remote host.";
          const hasEnc = args.includes('enc');
          const hasCipher = args.some(a => a.startsWith('-aes'));
          if (!hasEnc || !hasCipher) return `[-] openssl: Invalid syntax for ransomware deployment.\n[*] Usage: openssl enc -aes-256-cbc -salt -in /target -out /target.locked -k <key>`;
          
          setIsProcessing(true);
          setTerminal(prev => [...prev, { type: 'out', text: `[*] Encrypting file system with AES-256-CBC...`, isNew: false }]);
          await new Promise(r => setTimeout(r, 3000));
          
          const ransomAsk = Math.floor(150000 * mult);
          const paid = Math.random() < 0.7;
          
          setHeat(h => Math.min(h + 30, 100));
          if (paid) { setMoney(m => m + ransomAsk); }
          setIsProcessing(false);
          
          return paid 
            ? `[+] Encryption complete. \n[+] VICTIM PAID: $${ransomAsk.toLocaleString()}.\n[!] Heat +30%.` + checkContract()
            : `[+] Encryption complete. \n[-] VICTIM REFUSED TO PAY.\n[!] Heat +30%.` + checkContract();
        }
        
        if (gameMode === 'field') {
          if (!isInside) return "[-] openssl: Must be on remote host.";
          if (!arg1) return `[-] openssl: Configure ransomware deployment:\n    openssl strong\n    openssl fast`;
          
          setIsProcessing(true);
          setTerminal(prev => [...prev, { type: 'out', text: `[*] Deploying ransomware payload...`, isNew: false }]);
          await new Promise(r => setTimeout(r, 2000));
          
          const ransomAsk = Math.floor(80000 * mult);
          const paid = Math.random() < 0.6;
          
          setHeat(h => Math.min(h + 20, 100));
          if (paid) { setMoney(m => m + ransomAsk); }
          setIsProcessing(false);
          
          return paid 
            ? `[+] Ransomware deployed. \n[+] VICTIM PAID: $${ransomAsk.toLocaleString()}.\n[!] Heat +20%.` + checkContract()
            : `[+] Ransomware deployed. \n[-] Victim refused to pay.\n[!] Heat +20%.` + checkContract();
        }
        
        if (!isInside) return "[-] openssl: Must be on remote host.";
        setIsProcessing(true);
        setTerminal(prev => [...prev, { type: 'out', text: `[*] Encrypting target file system...`, isNew: false }]);
        await new Promise(r => setTimeout(r, 1500));
        
        const ransomAsk = Math.floor(120000 * mult);
        setMoney(m => m + ransomAsk);
        setHeat(h => Math.min(h + 10, 100));
        setIsProcessing(false);
        return `[+] RANSOMWARE DEPLOYED.\n[+] VICTIM PAID: $${ransomAsk.toLocaleString()}\n[!] Heat +10%.` + checkContract();
      }
    };

    if (COMMANDS[cmd]) {
      try {
        const output = await COMMANDS[cmd]();
        if (output) {
          setTerminal(prev => [...prev, { type: 'out', text: output, isNew: true }]);
        }
      } catch (err) {
        setTerminal(prev => [...prev, { type: 'err', text: `Error executing ${cmd}: ${err.message}`, isNew: true }]);
      }
    } else {
      setTerminal(prev => [...prev, { type: 'err', text: `bash: ${cmd}: command not found`, isNew: true }]);
    }
  };

  // --- UI RENDER ---
  return (
    <div style={{ background: '#0a0a0f', color: '#e0e0e0', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <Header 
        money={money} reputation={reputation} heat={heat} trace={trace} 
        gameMode={gameMode} setGameMode={setGameMode}
        activeView={activeView} setActiveView={setActiveView} 
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '12px', gap: '12px' }}>
        {/* LEFT COLUMN: Terminal & Hardware/Map */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <NetworkMap 
              world={world} botnet={botnet} proxies={proxies} looted={looted} 
              targetIP={targetIP} trace={trace} inventory={inventory} 
              selectNodeFromMap={selectNodeFromMap} expanded={mapExpanded} 
              toggleExpand={() => setMapExpanded(e => !e)} 
              currentRegion={currentRegion}
              consumables={consumables}
              money={money}
            />
            <RigDisplay 
              inventory={inventory} heat={heat} isProcessing={isProcessing} 
              expanded={rigExpanded} toggleExpand={() => setRigExpanded(e => !e)} 
            />
          </div>

          <div style={{ flex: 1, background: '#050508', border: `1px solid ${COLORS.border}`, borderRadius: '4px', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {terminal.map((msg, idx) => (
                <div key={idx} style={{ 
                  color: msg.type === 'err' ? COLORS.danger : msg.type === 'sys' ? COLORS.proxy : msg.type === 'in' ? COLORS.text : COLORS.textDim,
                  marginBottom: '8px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {msg.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', borderTop: `1px solid ${COLORS.borderActive}`, paddingTop: '12px' }}>
              <span style={{ color: COLORS.primary, marginRight: '8px', fontWeight: 'bold' }}>
                {privilege}@{targetIP || 'local'}:{currentDir}$
              </span>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleCommand}
                disabled={isProcessing}
                autoFocus
                spellCheck={false}
                style={{ 
                  flex: 1, background: 'transparent', border: 'none', color: COLORS.text, 
                  fontFamily: 'monospace', fontSize: '14px', outline: 'none' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Panel (Shop, Contracts, Market) */}
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {activeView === 'contracts' && (
            <ContractBoard 
              contracts={contracts} setContracts={setContracts}
              activeContract={activeContract} setActiveContract={setActiveContract}
              world={world} reputation={reputation}
            />
          )}
          {activeView === 'shop' && (
            <DarknetShop 
              money={money} setMoney={setMoney} 
              inventory={inventory} setInventory={setInventory} 
            />
          )}
          {activeView === 'market' && (
            <MarketBoard />
          )}
          {activeView === 'terminal' && (
             <div style={{ flex: 1, border: `1px solid ${COLORS.border}`, padding: '16px', background: 'rgba(8,12,18,0.6)', borderRadius: '4px', color: COLORS.textDim }}>
                <h3 style={{ color: COLORS.primary, borderBottom: `1px solid ${COLORS.borderActive}`, paddingBottom: '8px', margin: '0 0 12px 0' }}>SYSTEM STATUS</h3>
                <p><strong>OPSEC:</strong> {gameMode.toUpperCase()}</p>
                <p><strong>LOCAL IP:</strong> 127.0.0.1</p>
                <p><strong>C2 NODES:</strong> {botnet.length}</p>
                <p><strong>PROXY HOPS:</strong> {proxies.length}</p>
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ color: COLORS.secondary, margin: '0 0 8px 0' }}>LOCAL STORAGE</h4>
                  {localHashes.length === 0 ? <span style={{ opacity: 0.5 }}>Empty</span> : localHashes.map(h => <div key={h}>- {h}</div>)}
                </div>
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ color: COLORS.proxy, margin: '0 0 8px 0' }}>CONSUMABLES</h4>
                  <div>DECOYS: {consumables.decoy}</div>
                  <div>VPNS: {consumables.burner}</div>
                  <div>ZERO-DAYS: {consumables.zeroday}</div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
