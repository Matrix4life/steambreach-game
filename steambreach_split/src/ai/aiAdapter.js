// src/ai/aiAdapter.js

export const DEFAULT_AI_CONFIG = {
  provider: 'gemini', // 'gemini', 'openai', 'anthropic', 'ollama'
  apiKey: '',
  model: 'gemini-1.5-flash', // default models
  baseUrl: 'http://localhost:11434/api/generate' // default for Ollama
};

export const loadAiConfig = () => {
  try {
    return JSON.parse(localStorage.getItem('steambreach_ai_config')) || DEFAULT_AI_CONFIG;
  } catch { return DEFAULT_AI_CONFIG; }
};

export async function generateDirectorText(prompt, systemInstruction = '', config = loadAiConfig()) {
  const { provider, apiKey, model, baseUrl } = config;

  try {
    if (provider === 'gemini') {
      return await fetchGemini(prompt, systemInstruction, apiKey, model);
    } else if (provider === 'openai') {
      return await fetchOpenAI(prompt, systemInstruction, apiKey, model);
    } else if (provider === 'anthropic') {
      return await fetchAnthropic(prompt, systemInstruction, apiKey, model);
    } else if (provider === 'ollama') {
      return await fetchOllama(prompt, systemInstruction, model, baseUrl);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error) {
    console.error(`[AI ADAPTER] ${provider} Error:`, error);
    return "ERROR: CONNECTION TO EXTERNAL DIRECTOR LOST. CHECK API CONFIGURATION.";
  }
}

// --- PROVIDER FETCH IMPLEMENTATIONS ---

async function fetchGemini(prompt, system, key, model) {
  // 1. Catch missing keys before we even try to fetch
  if (!key || key.trim() === '') {
    return "ERROR: NO API KEY PROVIDED. CHECK AI SETTINGS.";
  }

  // 2. Build the payload carefully
  const payload = {
    contents: [{ parts: [{ text: prompt || " " }] }]
  };

  // 3. Only attach system instructions if they actually exist! 
  // (Sending an empty system instruction causes the 400 error)
  if (system && system.trim() !== '') {
    payload.systemInstruction = { parts: [{ text: system }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${key}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    console.error(`Gemini API Error: ${res.status} ${res.statusText}`);
    return `ERROR: DIRECTOR OFFLINE (HTTP ${res.status})`;
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "NO RESPONSE";
}

async function fetchOpenAI(prompt, system, key, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "NO RESPONSE";
}

async function fetchAnthropic(prompt, system, key, model) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerously-allow-browser': 'true' // Required for web apps
    },
    body: JSON.stringify({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: system,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "NO RESPONSE";
}

async function fetchOllama(prompt, system, model, baseUrl) {
  // Local Ollama instance
  const res = await fetch(baseUrl || 'http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'llama3',
      system: system,
      prompt: prompt,
      stream: false
    })
  });
  const data = await res.json();
  return data.response || "NO RESPONSE";
}
