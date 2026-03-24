// ==========================================
// 1. THE BLUE TEAM (DEFENSIVE AI)
// ==========================================
export const invokeBlueTeamAI = async (apiKey, playerCommand, nodeName, currentTrace, currentHeat) => {
  const prompt = `You are an elite, highly aggressive Cybersecurity SOC Analyst defending the network "${nodeName}". 
  An attacker (the player) has infiltrated your network. Their current Heat is ${currentHeat}% and you have traced them to ${currentTrace}%.
  They just attempted to run this command on your network: "${playerCommand}"
  
  Evaluate their command. Write a brutal, intimidating 1-2 sentence terminal message directly to the hacker. Let them know you see them, and mock their tools or their strategy. Do NOT break character. Do not use markdown. Start the message with: [SYSTEM_ADMIN]: `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "You are a ruthless defensive AI in a cyberpunk hacking game. You represent the elite Blue Team. You are angry, cocky, and surgical. You want to terminate the player's connection." }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (e) {
    // Fallback if the API fails or rate limits
    return `[SYSTEM_ADMIN]: I see your little '${playerCommand}' script. You're sloppy. I'm dropping your connection.`;
  }
};

// ==========================================
// 2. THE FIXER (DARKNET CONTRACT AI)
// ==========================================
export const generateAIContract = async (targetIP, nodeData, currentRep, apiKey) => {
  const prompt = `You are a Darknet Fixer in a hacking simulator. Generate a contract for a player targeting ${nodeData.org.orgName} (Security: ${nodeData.sec.toUpperCase()}). Player Reputation: ${currentRep}.
  
  CRITICAL INSTRUCTION: The exact file the player needs to find and extract is named "${nodeData.targetFile}". Your contract description MUST explicitly mention that they need to steal or destroy "${nodeData.targetFile}".
  
  RULES:
  - LOW/MID SEC: Standard espionage. Generous time (180-300s), heat cap 60-80%.
  - HIGH SEC: Elite mercenary work. Tight time (120-180s), heat cap 40-50%.
  - ELITE SEC: "Ghost" tier. Brutal conditions (<90s), heat cap <30%, massive payout ($150k - $500k).
  
  Return ONLY raw JSON in this exact format. No markdown, no explanation:
  {
    "type": "exfil",
    "desc": "2 sentences of immersive darknet flavor text explaining the job. Must seamlessly include the filename ${nodeData.targetFile}.",
    "timeLimit": 200,
    "reward": 50000,
    "repReward": 20,
    "heatCap": 50,
    "forbidden_tools": [], 
    "isAmbush": false 
  }`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ role: 'user', parts: [{ text: prompt }] }] 
      })
    });
    
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    let aiText = data.candidates[0].content.parts[0].text;
    
    // Strip out markdown code blocks if the AI accidentally adds them
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(aiText);
    
  } catch (e) { 
    return null; 
  }
};

// ==========================================
// 3. PACKET SNIFFER (ETTERCAP INTERCEPT AI)
// ==========================================
export const generateInterceptedComms = async (apiKey, orgData) => {
  const empNames = orgData.employees ? orgData.employees.map(e => e.name).join(', ') : 'Unknown Users';
  const prompt = `Generate a 3-line realistic, intercepted internal chat or email thread for employees at ${orgData.orgName}. 
  The employees available to use are: ${empNames}. 
  Hide a subtle clue about a password, a server issue, or bad security practices. 
  Make it look like raw terminal packet capture text (e.g. including timestamps and IP fragments). No markdown.`;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
    });
    
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (e) {
    // Fallback if API fails
    const emp1 = orgData.employees?.[0]?.name || 'Admin';
    const emp2 = orgData.employees?.[1]?.name || 'DevOps';
    return `[14:02:11] SRC:10.0.1.44 <${emp1}>: Make sure to restart the auth server later.\n[14:03:05] SRC:10.0.1.12 <${emp2}>: On it. Using the same credentials as last time.`;
  }
};
