
const EMAIL_SUBJECTS = [
  'urgent_login_reset', 'fwd_invoice_q3', 'meeting_notes', 'lunch_order',
  'project_alpha_specs', 'onboarding_doc', 'server_logs_error', 'draft_v2',
  'hr_complaint', 'budget_approval', 'client_list_updated', 'q4_projections',
  'security_audit', 'vpn_access_keys', 'holiday_party', 'termination_notice'
];

export const generateOrgFileSystem = (org, tier, layout) => {
  let filesObj = { '/': [`${layout.dirs[0]}/`, 'mail/', 'tmp/'] };
  let contents = {};
  let buildPath = '';

  // Build the target directory path
  for (let i = 0; i < layout.dirs.length; i++) {
    const isLast = i === layout.dirs.length - 1;
    const dirName = layout.dirs[i];
    const nextContent = isLast ? [layout.file] : [`${layout.dirs[i + 1]}/`];
    buildPath += `/${dirName}`;
    filesObj[buildPath] = nextContent;
  }

  // 1. DYNAMIC EMAILS: Random subjects tied to employee names
  const mailFiles = [];
  const numEmails = Math.floor(Math.random() * 4) + 2; // 2 to 5 emails per server
  for(let i=0; i < numEmails; i++) {
    const sub = EMAIL_SUBJECTS[Math.floor(Math.random() * EMAIL_SUBJECTS.length)];
    const emp = org.employees[Math.floor(Math.random() * org.employees.length)];
    const filename = `${sub}_${emp.name.split(' ')[0].toLowerCase()}.eml`;
    
    if(!mailFiles.includes(filename)) {
      mailFiles.push(filename);
      contents[`/mail/${filename}`] = '[LORE_PENDING]';
    }
  }
  filesObj['/mail'] = mailFiles;

  filesObj['/tmp'] = ['.bash_history', 'notes.tmp'];
  contents['/tmp/.bash_history'] = '[LORE_PENDING]';
  contents['/tmp/notes.tmp'] = '[LORE_PENDING]';

  // Core target file
  const fullFilePath = `${buildPath}/${layout.file}`;
  let fileContent = (tier === 'high' || tier === 'elite') ? '[LOCKED] [PENDING_GENERATION]' : '[PENDING_GENERATION]';
  if (layout.file.endsWith('.bak') || layout.file.endsWith('.hashes')) {
    fileContent = (tier === 'high' || tier === 'elite') ? '[LOCKED] [HASH] SHA-512 System Hashes: df98a2b1c...' : '[HASH] NTLM User Hashes: 8f2b3c...';
  }
  contents[fullFilePath] = fileContent;

  // 2. POWER-UP SPAWNS: Guarantee at least 1 consumable per node!
  const dirs = Object.keys(filesObj).filter(d => d !== '/');
  const randomDir = () => dirs[Math.floor(Math.random() * dirs.length)] || '/';
  
  const possiblePowerups = ['decoy.bin', 'burner.ovpn'];
  if (tier === 'high' || tier === 'elite') possiblePowerups.push('0day_poc.sh');
  if (tier === 'low' || tier === 'mid') possiblePowerups.push('wallet.dat');

  // Guarantee one random power-up
  const guaranteed = possiblePowerups[Math.floor(Math.random() * possiblePowerups.length)];
  filesObj[randomDir()].push(guaranteed);

  // Chance for even more power-ups hidden around the system
  if (Math.random() < 0.20 && guaranteed !== 'decoy.bin') filesObj[randomDir()].push('decoy.bin');
  if (Math.random() < 0.15 && guaranteed !== 'burner.ovpn') filesObj[randomDir()].push('burner.ovpn');
  if ((tier === 'high' || tier === 'elite') && Math.random() < 0.15 && guaranteed !== '0day_poc.sh') filesObj[randomDir()].push('0day_poc.sh');
  if ((tier === 'low' || tier === 'mid') && Math.random() < 0.25 && guaranteed !== 'wallet.dat') filesObj[randomDir()].push('wallet.dat');

  return { files: filesObj, contents };
};

export const generateNewTarget = (forcedTier = null, parentIP = null, directorMods = null) => {
  const octet = () => Math.floor(Math.random() * 255);
  const ip = `${octet()}.${octet()}.${octet()}.${octet()}`;
  const tiers = ['low', 'mid', 'high'];
  const sec = forcedTier || (directorMods ? tiers[Math.floor(Math.random() * tiers.length)] : tiers[Math.floor(Math.random() * tiers.length)]);
  const activeSec = sec === 'elite' ? 'high' : sec;

  const layouts = {
    low: [{ dirs: ['home', 'user', 'desktop'], file: 'wallet.txt' }, { dirs: ['temp', 'downloads'], file: 'session.bin' }],
    mid: [{ dirs: ['var', 'backups', 'daily'], file: 'archive.zip' }, { dirs: ['opt', 'server', 'db'], file: 'db_dump.sql' }, { dirs: ['etc', 'shadow', 'hashes'], file: 'passwd.bak' }],
    high: [{ dirs: ['sys', 'core', 'vault'], file: 'assets.db' }, { dirs: ['etc', 'shadow', 'hashes'], file: 'sys.hashes' }, { dirs: ['mnt', 'secure'], file: 'incident_report.msg' }],
    elite: [{ dirs: ['shadow', 'mainframe', 'core'], file: 'blackbox.db' }, { dirs: ['etc', 'security', 'vault'], file: 'root.hashes' }]
  };

  const tierLayouts = layouts[sec] || layouts['high'];
  const layout = tierLayouts[Math.floor(Math.random() * tierLayouts.length)];

  let val = 0;
  if (sec === 'elite') val = Math.floor(Math.random() * 100000 + 150000);
  else if (sec === 'high') val = Math.floor(Math.random() * 50000 + 50000);
  else if (sec === 'mid') val = Math.floor(Math.random() * 20000 + 10000);
  else val = Math.floor(Math.random() * 4000 + 1000);

  const org = generateOrgNarrative(sec); // Assuming this is in the same file
  const { files, contents } = generateOrgFileSystem(org, sec, layout);

  const exploits = [ { port: 22, svc: 'ssh', exp: 'hydra' }, { port: 80, svc: 'http', exp: 'sqlmap' }, { port: 445, svc: 'smb', exp: 'msfconsole' }, { port: 8080, svc: 'http-alt', exp: 'curl' } ];
  const vuln = exploits[Math.floor(Math.random() * exploits.length)];

  return {
    ip, data: { 
      name: org.orgName, sec: activeSec, isHidden: sec === 'elite', port: vuln.port, svc: vuln.svc, exp: vuln.exp, 
      isHoneypot: Math.random() < (directorMods?.honeypotChance || 0.15), val, 
      x: `${Math.floor(Math.random() * 85 + 7)}%`, y: `${Math.floor(Math.random() * 55 + 10)}%`, 
      parentIP, files, contents, org, 
      blueTeam: { alertLevel: 0, patchedVulns: [], changedPasswords: [], activeHunting: false, lastIncident: null }, 
      commsGenerated: false, slackChannelGenerated: false,
      targetFile: layout.file // 3. We save the exact target file here so the AI can read it!
    }
  };
};
