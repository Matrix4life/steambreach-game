import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const TIERS = {
  Case: ['ATXCase'],
  CPU: ['CPU', 'CPU_MK2', 'CPU_MK3'],
  GPU: ['GPU', 'GPU_MK2', 'GPU_MK3', 'Neural Net Accelerator'], 
  RAM: ['RAM', 'RAM_MK2', 'RAM_MK3'],
  Storage: ['Storage', 'Storage_MK2', 'Storage_MK3'],
  PSU: ['PSU', 'PSU_MK2', 'PSU_MK3'],
  Cooling: ['Cooling'],
  RGB: ['RGB']
};

function getTier(inventory, slot) {
  const ids = TIERS[slot] || [];
  let tier = 0;
  ids.forEach((id, i) => {
    if (inventory.includes(id)) tier = i + 1;
  });
  return tier;
}

// ----------------------------------------------------
// HIGH-DETAIL 16-BIT / VECTOR ASSETS
// ----------------------------------------------------

// Detailed PC Fan
const VectorFan = ({ x, y, size, heat, isRGB }) => {
  const fanDur = heat > 75 ? '0.15s' : (heat > 40 ? '0.4s' : '1.5s');
  const ringColor = isRGB ? 'currentColor' : '#4a8b96';
  const bladeColor = isRGB ? 'currentColor' : '#2d2a2e';
  const r = size / 2;
  const center = r;

  return (
    <svg x={x} y={y} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Fan Housing */}
      <rect x="0" y="0" width={size} height={size} rx="4" fill="#0f0f14" stroke="#222" strokeWidth="2" />
      <rect x="2" y="2" width={size-4} height={size-4} rx="3" fill="none" stroke="#333" strokeWidth="1" />
      
      {/* Anti-vibration pads */}
      <circle cx="4" cy="4" r="1.5" fill="#444" />
      <circle cx={size-4} cy="4" r="1.5" fill="#444" />
      <circle cx="4" cy={size-4} r="1.5" fill="#444" />
      <circle cx={size-4} cy={size-4} r="1.5" fill="#444" />

      {/* Outer RGB Ring */}
      <circle cx={center} cy={center} r={r - 4} fill="#050508" stroke={ringColor} strokeWidth="3" className={isRGB ? "rgb-anim-stroke" : ""} />
      
      {/* Spinning Blades */}
      <g style={{ transformOrigin: 'center', animation: `fan-spin ${fanDur} linear infinite` }}>
        {/* 7-Blade design */}
        {[0, 51, 102, 154, 205, 257, 308].map(deg => (
          <path key={deg} 
            d={`M ${center} ${center} Q ${center+10} ${center-20} ${center} ${center-r+5} Q ${center-10} ${center-15} ${center} ${center}`} 
            fill={bladeColor} 
            className={isRGB ? "rgb-anim-fill" : ""}
            opacity="0.85"
            transform={`rotate(${deg} ${center} ${center})`} 
          />
        ))}
        {/* Motor Hub */}
        <circle cx={center} cy={center} r="8" fill="#1a1a24" stroke="#333" strokeWidth="1" />
        <circle cx={center} cy={center} r="4" fill="#111" />
      </g>
    </svg>
  );
};

// ----------------------------------------------------
// THE 2D DETAILED SIDE-PROFILE ENGINE
// ----------------------------------------------------
const RigModel = ({ inventory, heat, isProcessing }) => {
  const hasCase = getTier(inventory, 'Case') > 0;
  const hasCPU = getTier(inventory, 'CPU') > 0;
  const hasGPU = getTier(inventory, 'GPU') > 0;
  const hasRAM = getTier(inventory, 'RAM') > 0;
  const hasCooling = getTier(inventory, 'Cooling') > 0;
  const hasRGB = getTier(inventory, 'RGB') > 0;

  const isHot = heat >= 75;
  const isWarm = heat >= 40;
  
  const liquidColor = isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.primary);
  const activeColor = hasRGB ? "currentColor" : COLORS.primary;
  
  const cpuOpacity = isProcessing ? (Math.random() > 0.5 ? 1 : 0.5) : 0.8;

  // Render a beige toaster if no case
  if (!hasCase) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
        {/* Crappy Beige Case */}
        <rect x="50" y="50" width="300" height="320" fill="#d1cbbd" stroke="#a39f93" strokeWidth="4" />
        <rect x="60" y="60" width="280" height="300" fill="#a39f93" />
        
        {/* Ugly Green Motherboard */}
        <rect x="70" y="70" width="220" height="240" fill="#4a7550" stroke="#2c4d31" strokeWidth="2" />
        
        {/* CPU */}
        <rect x="150" y="100" width="60" height="60" fill="#b5b2a8" />
        <rect x="155" y="105" width="50" height="50" fill="none" stroke="#757269" strokeWidth="4" strokeDasharray="4 2" />
        {hasCPU && <rect x="170" y="120" width="20" height="20" fill="#757269" opacity={cpuOpacity} />}
        
        {/* Basic Fan */}
        <VectorFan x="290" y="160" size="40" heat={heat} isRGB={false} />
        
        {/* Vents */}
        <rect x="60" y="320" width="280" height="40" fill="#8c887d" />
        {Array.from({length: 10}).map((_, i) => (
          <rect key={i} x={70 + i*26} y="330" width="10" height="20" fill="#333" />
        ))}
        {hasRGB && <rect x="50" y="50" width="300" height="320" fill="none" stroke="currentColor" strokeWidth="4" className="rgb-anim-stroke" opacity="0.5" />}
      </svg>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.9))' }}>
      <defs>
        {/* Motherboard Grid Pattern */}
        <pattern id="circuits" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#333" />
          <path d="M 2 2 L 10 2 L 15 10" fill="none" stroke="#222" strokeWidth="1" />
          <circle cx="15" cy="10" r="1.5" fill="#444" />
        </pattern>
        
        {/* Glass Glare Gradient */}
        <linearGradient id="glare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>

        <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
      </defs>

      {/* --- EXTERIOR CHASSIS --- */}
      <rect x="20" y="10" width="360" height="380" rx="8" fill="#0d0d12" stroke="#2d2a2e" strokeWidth="4" />
      <rect x="30" y="20" width="340" height="360" rx="4" fill="#050508" />

      {/* --- MOTHERBOARD --- */}
      <rect x="80" y="40" width="220" height="240" fill="#14141c" stroke="#222" strokeWidth="2" />
      <rect x="80" y="40" width="220" height="240" fill="url(#circuits)" />
      
      {/* VRM Heatsinks (Greebles) */}
      <rect x="85" y="45" width="20" height="80" fill="url(#metal)" rx="2" />
      <rect x="110" y="45" width="80" height="20" fill="url(#metal)" rx="2" />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x="85" y={48 + i*12} width="15" height="4" fill="#111" />)}

      {/* IO Shield */}
      <rect x="30" y="40" width="50" height="140" fill="#1a1a24" stroke="#333" strokeWidth="2" />
      <circle cx="55" cy="60" r="6" fill="#050508" stroke={hasRGB ? "currentColor" : "#555"} strokeWidth="2" className={hasRGB ? "rgb-anim-stroke" : ""} />

      {/* --- RAM SLOTS & STICKS --- */}
      <g transform="translate(210, 50)">
        {/* 4 Slots */}
        {[0, 15, 30, 45].map(xOffset => (
          <rect key={xOffset} x={xOffset} y="0" width="8" height="110" fill="#0a0a0f" stroke="#222" strokeWidth="1" />
        ))}
        {/* Installed Sticks */}
        {hasRAM && [0, 15, 30, 45].map(xOffset => (
          <g key={`stick-${xOffset}`}>
            <rect x={xOffset+1} y="2" width="6" height="106" fill="#2d2a2e" />
            <rect x={xOffset+2} y="5" width="4" height="100" fill="#444" />
            {/* RGB Lightbar on RAM */}
            {hasRGB && <rect x={xOffset+2} y="2" width="4" height="8" fill="currentColor" className="rgb-anim-fill" style={{ filter: 'drop-shadow(0 0 2px currentColor)'}} />}
          </g>
        ))}
      </g>

      {/* --- CPU & COOLING --- */}
      <g transform="translate(120, 80)">
        {/* CPU Socket Base */}
        <rect x="0" y="0" width="70" height="70" fill="#111" stroke="#333" strokeWidth="2" />
        {/* The CPU Chip */}
        {hasCPU && <rect x="15" y="15" width="40" height="40" fill="#silver" stroke="#555" strokeWidth="1" />}
        {hasCPU && <rect x="25" y="25" width="20" height="20" fill={COLORS.primary} opacity={cpuOpacity} style={{ transition: 'opacity 0.1s' }} />}
        
        {/* Cooling System */}
        {hasCooling ? (
          <g>
            {/* Liquid Pump Block */}
            <circle cx="35" cy="35" r="28" fill="#1a1a24" stroke="#000" strokeWidth="3" />
            <circle cx="35" cy="35" r="24" fill="none" stroke={activeColor} strokeWidth="3" className={hasRGB ? "rgb-anim-stroke" : ""} />
            <text x="35" y="40" fill={activeColor} fontSize="12" fontWeight="bold" textAnchor="middle" className={hasRGB ? "rgb-anim-fill" : ""}>AI</text>
            
            {/* Braided Tubes routing up to Radiator */}
            <path d="M 45 10 Q 55 -30 90 -40 L 140 -40" fill="none" stroke="#222" strokeWidth="12" />
            <path d="M 45 10 Q 55 -30 90 -40 L 140 -40" fill="none" stroke={liquidColor} strokeWidth="4" className="flow" />
            <path d="M 25 10 Q 30 -40 90 -55 L 140 -55" fill="none" stroke="#222" strokeWidth="12" />
            <path d="M 25 10 Q 30 -40 90 -55 L 140 -55" fill="none" stroke={liquidColor} strokeWidth="4" className="flow" />
          </g>
        ) : (
           hasCPU && (
             <g transform="translate(-5, -5)">
               {/* Stock Air Cooler */}
               <rect x="0" y="0" width="80" height="80" fill="url(#metal)" rx="40" />
               <VectorFan x="5" y="5" size="70" heat={heat} isRGB={hasRGB} />
             </g>
           )
        )}
      </g>

      {/* Top Radiator (If Liquid Cooled) */}
      {hasCooling && (
        <g transform="translate(140, 20)">
          <rect x="0" y="0" width="220" height="25" fill="#111" stroke="#222" strokeWidth="2" />
          <rect x="5" y="2" width="210" height="21" fill="none" stroke={liquidColor} strokeWidth="1" opacity="0.5" />
        </g>
      )}

      {/* --- DISCRETE GPU (Massive Card) --- */}
      {hasGPU ? (
        <g transform="translate(80, 200)">
          {/* PCIe Slot Connection */}
          <rect x="10" y="-10" width="120" height="10" fill="#111" />
          
          {/* GPU Backplate & Shroud */}
          <rect x="0" y="0" width="280" height="65" rx="4" fill="#1a1a24" stroke="#333" strokeWidth="2" style={{ filter: 'drop-shadow(0px 8px 10px rgba(0,0,0,0.8))' }} />
          
          {/* Heatsink Fins (Greebles) */}
          <rect x="5" y="5" width="270" height="15" fill="url(#metal)" />
          {Array.from({length: 30}).map((_, i) => <rect key={i} x={5 + i*9} y="5" width="2" height="15" fill="#111" />)}

          {/* GPU Branding */}
          {hasRGB && <text x="140" y="30" fill="currentColor" fontSize="14" fontWeight="900" fontStyle="italic" textAnchor="middle" className="rgb-anim-fill" style={{ letterSpacing: '4px', filter: 'drop-shadow(0 0 4px currentColor)' }}>NEURAL NET ACCELERATOR</text>}

          {/* GPU Heatpipes */}
          <path d="M 275 25 Q 290 25 290 40 L 290 60" fill="none" stroke="#silver" strokeWidth="6" />
          <path d="M 275 35 Q 285 35 285 45 L 285 60" fill="none" stroke="#silver" strokeWidth="6" />

          {/* PCIe Power Cables */}
          <path d="M 240 0 Q 240 -40 280 -20" fill="none" stroke="#222" strokeWidth="8" />
          <path d="M 250 0 Q 250 -30 280 -10" fill="none" stroke="#222" strokeWidth="8" />
          {hasRGB && <path d="M 240 0 Q 240 -40 280 -20" fill="none" stroke="currentColor" strokeWidth="2" className="rgb-anim-stroke flow" />}

          {/* GPU Fans (Mounted on the side/bottom of the shroud) */}
          <VectorFan x="20" y="25" size="35" heat={heat} isRGB={hasRGB} />
          <VectorFan x="120" y="25" size="35" heat={heat} isRGB={hasRGB} />
          <VectorFan x="220" y="25" size="35" heat={heat} isRGB={hasRGB} />
          
          {/* RGB Trim */}
          {hasRGB && <rect x="0" y="0" width="280" height="65" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="rgb-anim-stroke" />}
        </g>
      ) : (
        /* Empty PCIe Slots */
        <g transform="translate(90, 200)">
          <rect x="0" y="0" width="180" height="10" fill="#111" />
          <rect x="0" y="25" width="180" height="10" fill="#111" />
        </g>
      )}

      {/* --- PSU SHROUD (Bottom floor) --- */}
      <g transform="translate(30, 290)">
        <rect x="0" y="0" width="340" height="90" fill="#111" stroke="#222" strokeWidth="2" />
        {/* Cutout showing PSU */}
        <rect x="20" y="15" width="120" height="60" fill="#1a1a24" stroke="#000" strokeWidth="2" />
        <text x="80" y="55" fill={COLORS.textDim} fontSize="24" fontWeight="bold" fontFamily="monospace" textAnchor="middle">850W</text>
        {/* Shroud Vents */}
        {Array.from({length: 15}).map((_, i) => <rect key={i} x={180 + i*10} y="15" width="4" height="30" fill="#0a0a0f" />)}
        {/* Underglow */}
        {hasRGB && <line x1="0" y1="0" x2="340" y2="0" stroke="currentColor" strokeWidth="4" className="rgb-anim-stroke" style={{ filter: 'drop-shadow(0 0 6px currentColor)'}} />}
      </g>

      {/* --- CASE FANS (Front Intake & Rear Exhaust) --- */}
      {hasCase && (
        <g>
          {/* Front Intake (Right side) */}
          <VectorFan x="300" y="40" size="65" heat={heat} isRGB={hasRGB} />
          <VectorFan x="300" y="115" size="65" heat={heat} isRGB={hasRGB} />
          <VectorFan x="300" y="190" size="65" heat={heat} isRGB={hasRGB} />
          
          {/* Rear Exhaust (Left side) */}
          <VectorFan x="35" y="45" size="45" heat={heat} isRGB={hasRGB} />
        </g>
      )}

      {/* --- GLASS PANEL GLARE OVERLAY --- */}
      {hasCase && (
        <g>
          <rect x="30" y="20" width="340" height="360" rx="4" fill="url(#glare)" pointerEvents="none" />
          {/* Glass edge highlights */}
          <path d="M 32 22 L 368 22 L 368 378" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" pointerEvents="none" />
          <path d="M 32 22 L 32 378 L 368 378" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" pointerEvents="none" />
        </g>
      )}
    </svg>
  );
};

// ----------------------------------------------------
// UI STATUS BARS
// ----------------------------------------------------
const StatBar = ({ label, value, color }) => (
  <div style={{ marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: COLORS.textDim, marginBottom: '4px', letterSpacing: '1px' }}>
      <span>{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, transition: 'width 0.3s ease-out' }} />
    </div>
  </div>
);

// ----------------------------------------------------
// MAIN EXPORT COMPONENT
// ----------------------------------------------------
export default function RigDisplay({
  inventory = [],
  heat = 0,
  isProcessing = false,
  expanded = false,
  toggleExpand,
}) {
  const [selected, setSelected] = useState('GPU');

  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat >= 75;
  const isWarm = safeHeat >= 40;

  const width = expanded ? 500 : 235;
  const height = expanded ? 250 : 84;

  const HARDWARE_SLOTS = ['Case', 'CPU', 'GPU', 'RAM', 'Cooling', 'Storage', 'PSU', 'RGB'];

  const installed = useMemo(() => {
    let obj = {};
    HARDWARE_SLOTS.forEach(slot => obj[slot] = getTier(inventory, slot) > 0);
    return obj;
  }, [inventory]);

  const cpuPct = installed.CPU ? clamp(Math.round(safeHeat * 0.72 + (isProcessing ? 10 : 0)), 8, 100) : 0;
  const gpuPct = installed.GPU ? clamp(Math.round(safeHeat * 0.9 + (isProcessing ? 12 : 0)), 10, 100) : 0;

  const statusText = isHot ? 'OVERHEAT' : isWarm ? 'ELEVATED' : 'STABLE';
  const statusColor = isHot ? (COLORS.danger || '#ff6188') : isWarm ? (COLORS.warning || '#ffd866') : (COLORS.secondary || '#a9dc76');

  return (
    <div
      style={{
        width, height, flexShrink: 0,
        border: `1px solid ${isHot ? `${COLORS.danger}66` : COLORS.border}`,
        position: 'relative', background: COLORS.bgDark,
        overflow: 'hidden', borderRadius: '3px',
        transition: 'width 0.25s ease, height 0.25s ease',
        cursor: expanded ? 'default' : 'pointer',
        boxShadow: isHot ? `0 0 12px ${COLORS.danger}20, inset 0 0 18px ${COLORS.danger}08` : `inset 0 0 18px rgba(0,0,0,0.35)`,
        userSelect: 'none'
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes fan-spin { 100% { transform: rotate(360deg); } }
        @keyframes flow { to { stroke-dashoffset: -20; } }
        
        @keyframes rgb-cycle {
          0%   { color: ${COLORS.danger}; stroke: ${COLORS.danger}; fill: ${COLORS.danger}; }
          33%  { color: ${COLORS.secondary}; stroke: ${COLORS.secondary}; fill: ${COLORS.secondary}; }
          66%  { color: ${COLORS.primary}; stroke: ${COLORS.primary}; fill: ${COLORS.primary}; }
          100% { color: ${COLORS.danger}; stroke: ${COLORS.danger}; fill: ${COLORS.danger}; }
        }
        @keyframes heat-pulse { 0%, 100% { background: ${COLORS.danger}10; } 50% { background: ${COLORS.danger}30; } }
        
        .rgb-anim-stroke { animation: rgb-cycle 4s linear infinite; stroke: currentColor; }
        .rgb-anim-fill { animation: rgb-cycle 4s linear infinite; fill: currentColor; }
        .rgb-anim-bg { animation: rgb-cycle 4s linear infinite; background-color: currentColor; }
        .flow { stroke-dasharray: 10, 5; animation: flow 0.5s linear infinite; }
      `}</style>

      <button
        onClick={(e) => { e.stopPropagation(); toggleExpand?.(); }}
        style={{
          position: 'absolute', top: 3, right: 6, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', border: `1px solid ${COLORS.border}`,
          color: COLORS.textDim, fontSize: '10px', cursor: 'pointer',
          fontFamily: 'inherit', padding: '2px 6px', borderRadius: '2px',
        }}
      >
        {expanded ? '▲ MINIMIZE' : '▼ VIEW'}
      </button>

      {!expanded ? (
        <div style={{ position: 'absolute', inset: 0, padding: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px' }}>
             <RigModel inventory={inventory} heat={heat} isProcessing={isProcessing} />
          </div>
          <div>
             <div style={{ color: COLORS.primary, fontSize: '11px', letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM RIG</div>
             <div style={{ color: statusColor, fontSize: '10px', marginTop: '6px', letterSpacing: '1px' }}>
               {statusText} • {safeHeat}% TEMP
             </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          
          {/* LEFT COLUMN: 2D HIGH-DETAIL RIG */}
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #1a1a24 0%, #0a0a0f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isHot && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', animation: 'heat-pulse 1s infinite' }} />}
            
            <div style={{ width: '220px', height: '220px' }}>
              <RigModel inventory={inventory} heat={heat} isProcessing={isProcessing} />
            </div>
            
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: COLORS.textDim, fontSize: '9px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '1px' }}>
               <span style={{ color: isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.secondary) }}>THERMALS: {heat}%</span>
            </div>
          </div>

          {/* RIGHT COLUMN: HTML DIAGNOSTICS PANEL */}
          <div style={{ width: '220px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', background: 'rgba(8,12,18,0.6)', borderLeft: `1px solid ${COLORS.border}` }}>
             <div style={{ color: COLORS.primary, fontSize: '11px', letterSpacing: '2px' }}>HARDWARE DIAGNOSTICS</div>
             
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', overflowY: 'auto', paddingRight: '4px' }}>
                {HARDWARE_SLOTS.map(slot => {
                   const isInst = installed[slot];
                   const isSel = selected === slot;
                   return (
                     <div key={slot} onClick={() => setSelected(slot)} style={{
                       flex: '1 1 45%', padding: '6px', cursor: 'pointer', borderRadius: '3px',
                       background: isSel ? `${COLORS.primary}20` : 'rgba(0,0,0,0.4)',
                       border: `1px solid ${isSel ? COLORS.primary : COLORS.border}`,
                       transition: 'background 0.2s, border-color 0.2s'
                     }}>
                       <div style={{ fontSize: '9px', color: isSel ? COLORS.text : COLORS.textDim, letterSpacing: '1px' }}>{slot}</div>
                       <div style={{ fontSize: '8px', color: isInst ? COLORS.primary : COLORS.danger, marginTop: '4px', fontWeight: 'bold' }}>
                         {isInst ? `TIER ${getTier(inventory, slot)}` : 'EMPTY'}
                       </div>
                     </div>
                   );
                })}
             </div>

             <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px', border: `1px solid ${COLORS.borderActive}` }}>
                <StatBar label="CPU LOAD" value={cpuPct} color={COLORS.primary} />
                <StatBar label="GPU LOAD" value={gpuPct} color={COLORS.proxy || '#fc9867'} />
                <StatBar label="SYSTEM TEMP" value={safeHeat} color={statusColor} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
