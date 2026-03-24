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

// ==========================================
// VECTOR ART ASSETS (HIGH DETAIL)
// ==========================================

const VectorFan = ({ x, y, size, heat, isRGB, color }) => {
  const fanDur = heat > 75 ? '0.15s' : (heat > 40 ? '0.3s' : '1.2s');
  const rgbClass = isRGB ? 'rgb-anim-stroke' : '';
  const fanColor = isRGB ? 'currentColor' : (color || '#4a8b96');
  const r = size / 2;
  const center = r;

  return (
    <svg x={x} y={y} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Housing */}
      <rect x="0" y="0" width={size} height={size} rx="3" fill="#15151c" stroke="#222" strokeWidth="1.5" />
      <rect x="2" y="2" width={size-4} height={size-4} rx="2" fill="none" stroke="#2d2a2e" strokeWidth="1" />
      
      {/* Rubber Mounts */}
      <rect x="1" y="1" width="4" height="4" fill="#333" />
      <rect x={size-5} y="1" width="4" height="4" fill="#333" />
      <rect x="1" y={size-5} width="4" height="4" fill="#333" />
      <rect x={size-5} y={size-5} width="4" height="4" fill="#333" />

      {/* RGB Ring */}
      <circle cx={center} cy={center} r={r - 3} fill="#0a0a0f" stroke={fanColor} strokeWidth="2" className={rgbClass} style={{ filter: isRGB ? 'drop-shadow(0 0 2px currentColor)' : 'none' }} />
      
      {/* Blades */}
      <g style={{ transformOrigin: 'center', animation: `fan-spin ${fanDur} linear infinite` }}>
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map(deg => (
          <path key={deg} 
            d={`M ${center} ${center} Q ${center+12} ${center-15} ${center} ${center-r+4} Q ${center-8} ${center-10} ${center} ${center}`} 
            fill={fanColor} 
            className={isRGB ? "rgb-anim-fill" : ""}
            opacity="0.9"
            transform={`rotate(${deg} ${center} ${center})`} 
          />
        ))}
        {/* Hub */}
        <circle cx={center} cy={center} r="6" fill="#1a1a24" stroke="#444" strokeWidth="1" />
        <circle cx={center} cy={center} r="2" fill={fanColor} className={isRGB ? "rgb-anim-fill" : ""} opacity="0.5" />
      </g>
    </svg>
  );
};

// ==========================================
// RIG ENGINE
// ==========================================
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
  
  const cpuOpacity = isProcessing ? (Math.random() > 0.5 ? 1 : 0.4) : 0.8;

  // ----------------------------------------------------
  // TIER 0: CRAIGSLIST BEIGE BOX
  // ----------------------------------------------------
  if (!hasCase) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
        {/* Box Base */}
        <rect x="40" y="40" width="320" height="340" fill="#d4d0c5" stroke="#9e9b93" strokeWidth="4" />
        <rect x="50" y="50" width="300" height="320" fill="#bbb7ad" />
        
        {/* Ugly Green Motherboard */}
        <rect x="70" y="60" width="220" height="240" fill="#3b5e3d" stroke="#223623" strokeWidth="2" />
        {/* Traces */}
        <path d="M 80 80 L 120 80 M 80 90 L 110 90 M 80 100 L 130 100" stroke="#5c8a5f" strokeWidth="2" />
        {/* CMOS Battery */}
        <circle cx="100" cy="270" r="10" fill="#c0c0c0" stroke="#777" strokeWidth="2" />

        {/* CPU */}
        <rect x="140" y="100" width="60" height="60" fill="#e0e0e0" stroke="#888" strokeWidth="2" />
        <rect x="145" y="105" width="50" height="50" fill="none" stroke="#555" strokeWidth="2" strokeDasharray="4 2" />
        {hasCPU && <rect x="160" y="120" width="20" height="20" fill="#555" opacity={cpuOpacity} />}
        
        {/* Stock Fan */}
        <VectorFan x="290" y="140" size="45" heat={heat} isRGB={false} color="#555" />
        
        {/* HDD & Wires */}
        <rect x="250" y="60" width="90" height="40" fill="#888" stroke="#444" strokeWidth="2" />
        <rect x="260" y="65" width="40" height="20" fill="#ddd" />
        <path d="M 295 100 Q 280 150 180 160" fill="none" stroke="#d63c3c" strokeWidth="4" />
        <path d="M 305 100 Q 290 160 180 170" fill="none" stroke="#3cd668" strokeWidth="4" />
        
        {/* Cheap PSU */}
        <rect x="50" y="310" width="300" height="60" fill="#9c9990" stroke="#7a7870" strokeWidth="2" />
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={60 + i*22} y="325" width="8" height="30" fill="#333" rx="2" />
        ))}
      </svg>
    );
  }

  // ----------------------------------------------------
  // TIER 1+: MATTE BLACK CYBERPUNK RIG
  // ----------------------------------------------------
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.9))' }}>
      <defs>
        {/* Circuit Traces */}
        <pattern id="circuits" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 15 10 L 20 15 L 40 15 M 0 30 L 10 30 L 15 25 L 30 25 M 20 0 L 20 10 M 30 40 L 30 25" fill="none" stroke="#2a2a35" strokeWidth="1.5" />
          <circle cx="15" cy="10" r="1.5" fill="#555" />
          <circle cx="20" cy="15" r="1.5" fill="#555" />
          <circle cx="10" cy="30" r="1.5" fill="#555" />
        </pattern>
        
        {/* Realistic Glass Glare */}
        <linearGradient id="glare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>

        <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#222" />
        </linearGradient>

        {/* 3D Tube Shading */}
        <linearGradient id="tubeShade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
        </linearGradient>
      </defs>

      {/* --- EXTERIOR CHASSIS --- */}
      <rect x="10" y="10" width="380" height="380" rx="10" fill="#0d0d12" stroke="#252530" strokeWidth="3" />
      <rect x="20" y="20" width="360" height="360" rx="6" fill="#050508" />

      {/* --- MOTHERBOARD --- */}
      <rect x="70" y="30" width="240" height="260" fill="#121218" stroke="#2a2a35" strokeWidth="2" />
      <rect x="70" y="30" width="240" height="260" fill="url(#circuits)" />
      
      {/* Greebles (Capacitors, VRMs, CMOS) */}
      <rect x="75" y="40" width="25" height="90" fill="url(#metal)" rx="2" stroke="#111" strokeWidth="1" />
      <rect x="105" y="35" width="90" height="25" fill="url(#metal)" rx="2" stroke="#111" strokeWidth="1" />
      {Array.from({length: 8}).map((_, i) => <circle key={`cap1-${i}`} cx="100" cy={50 + i*10} r="3" fill="#silver" stroke="#222" strokeWidth="1" />)}
      {Array.from({length: 8}).map((_, i) => <circle key={`cap2-${i}`} cx={115 + i*10} cy="65" r="3" fill="#silver" stroke="#222" strokeWidth="1" />)}
      <circle cx="95" cy="270" r="12" fill="#c0c0c0" stroke="#555" strokeWidth="2" />
      <circle cx="95" cy="270" r="8" fill="none" stroke="#999" strokeWidth="1" />

      {/* IO Shield */}
      <rect x="25" y="35" width="45" height="150" fill="#15151c" stroke="#333" strokeWidth="2" />
      <circle cx="47" cy="60" r="8" fill="#050508" stroke={hasRGB ? "currentColor" : "#555"} strokeWidth="2" className={hasRGB ? "rgb-anim-stroke" : ""} />
      <rect x="35" y="80" width="25" height="10" fill="#050508" />
      <rect x="35" y="100" width="25" height="10" fill="#050508" />
      <rect x="35" y="120" width="25" height="20" fill="#050508" />

      {/* --- RAM SLOTS & STICKS --- */}
      <g transform="translate(220, 45)">
        {[0, 18, 36, 54].map(x => (
          <rect key={x} x={x} y="0" width="10" height="120" fill="#0a0a0f" stroke="#222" strokeWidth="1" rx="2" />
        ))}
        
        {hasRAM && [0, 18, 36, 54].map(x => (
          <g key={`stick-${x}`}>
            {/* Gold Pins */}
            <rect x={x+2} y="115" width="6" height="5" fill="#ffd866" />
            {/* Stick Body */}
            <rect x={x+1} y="2" width="8" height="114" fill="#2d2a2e" rx="1" />
            <rect x={x+3} y="15" width="4" height="90" fill="#1a1a24" />
            {/* RGB Lightbar */}
            {hasRGB ? (
              <rect x={x+1} y="2" width="8" height="10" fill="currentColor" className="rgb-anim-fill" style={{ filter: 'drop-shadow(0 0 4px currentColor)'}} rx="1" />
            ) : (
              <rect x={x+1} y="2" width="8" height="10" fill="#555" rx="1" />
            )}
          </g>
        ))}
      </g>

      {/* --- CPU & COOLING --- */}
      <g transform="translate(115, 75)">
        {/* CPU Socket Base */}
        <rect x="0" y="0" width="80" height="80" fill="#1a1a24" stroke="#333" strokeWidth="2" rx="4" />
        <rect x="5" y="5" width="70" height="70" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* The CPU Chip */}
        {hasCPU && <rect x="20" y="20" width="40" height="40" fill="#d4d4d4" stroke="#888" strokeWidth="1.5" rx="2" />}
        {hasCPU && <rect x="28" y="28" width="24" height="24" fill={COLORS.primary} opacity={cpuOpacity} style={{ transition: 'opacity 0.1s' }} />}
        
        {/* Cooling System */}
        {hasCooling ? (
          <g>
            {/* Liquid Pump Block */}
            <rect x="10" y="10" width="60" height="60" rx="30" fill="#15151c" stroke="#000" strokeWidth="3" />
            <circle cx="40" cy="40" r="24" fill="none" stroke={activeColor} strokeWidth="3" className={hasRGB ? "rgb-anim-stroke" : ""} style={{ filter: hasRGB ? 'drop-shadow(0 0 3px currentColor)' : 'none' }} />
            <path d="M 30 45 L 40 30 L 50 45 Z" fill="none" stroke={activeColor} strokeWidth="2" className={hasRGB ? "rgb-anim-stroke" : ""} />
            
            {/* Braided Tubes routing up to Radiator */}
            <path d="M 65 25 Q 90 -40 130 -40" fill="none" stroke="#111" strokeWidth="14" />
            <path d="M 65 25 Q 90 -40 130 -40" fill="none" stroke="#333" strokeWidth="10" />
            <path d="M 65 25 Q 90 -40 130 -40" fill="none" stroke={liquidColor} strokeWidth="4" className="flow" />
            
            <path d="M 65 55 Q 120 -20 130 -20" fill="none" stroke="#111" strokeWidth="14" />
            <path d="M 65 55 Q 120 -20 130 -20" fill="none" stroke="#333" strokeWidth="10" />
            <path d="M 65 55 Q 120 -20 130 -20" fill="none" stroke={liquidColor} strokeWidth="4" className="flow" />
          </g>
        ) : (
           hasCPU && (
             <g transform="translate(-10, -10)">
               {/* Stock Air Cooler */}
               <rect x="0" y="0" width="100" height="100" fill="url(#metal)" rx="50" />
               <VectorFan x="10" y="10" size="80" heat={heat} isRGB={hasRGB} />
             </g>
           )
        )}
      </g>

      {/* Top Radiator (If Liquid Cooled) */}
      {hasCooling && (
        <g transform="translate(140, 25)">
          <rect x="0" y="0" width="240" height="30" fill="#15151c" stroke="#222" strokeWidth="2" rx="4" />
          {/* Dense Radiator Fins */}
          {Array.from({length: 58}).map((_, i) => <rect key={i} x={4 + i*4} y="2" width="2" height="26" fill="#0a0a0f" />)}
          <rect x="0" y="30" width="240" height="6" fill="#111" />
        </g>
      )}

      {/* --- DISCRETE GPU (Massive Card) --- */}
      {hasGPU ? (
        <g transform="translate(70, 210)">
          {/* PCIe Slot Connection */}
          <rect x="20" y="-10" width="160" height="10" fill="#111" />
          <rect x="25" y="-5" width="150" height="5" fill="#ffd866" /> 
          
          {/* GPU Backplate & Shroud */}
          <rect x="0" y="0" width="300" height="75" rx="6" fill="#1a1a24" stroke="#333" strokeWidth="2" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.6))' }} />
          
          {/* Heatsink Fins (Greebles) */}
          <rect x="10" y="6" width="280" height="16" fill="url(#metal)" rx="2" />
          {Array.from({length: 46}).map((_, i) => <rect key={i} x={12 + i*6} y="6" width="2" height="16" fill="#111" />)}

          {/* Copper Heatpipes */}
          <path d="M 290 30 Q 305 30 305 50 L 305 65" fill="none" stroke="#b87333" strokeWidth="6" />
          <path d="M 290 40 Q 300 40 300 55 L 300 65" fill="none" stroke="#b87333" strokeWidth="6" />

          {/* PCIe Power Cables */}
          <path d="M 250 0 Q 250 -40 290 -30" fill="none" stroke="#222" strokeWidth="10" />
          <path d="M 265 0 Q 265 -30 290 -20" fill="none" stroke="#222" strokeWidth="10" />
          {hasRGB && <path d="M 250 0 Q 250 -40 290 -30" fill="none" stroke="currentColor" strokeWidth="2" className="rgb-anim-stroke flow" />}
          {hasRGB && <path d="M 265 0 Q 265 -30 290 -20" fill="none" stroke="currentColor" strokeWidth="2" className="rgb-anim-stroke flow" />}

          {/* GPU Fans */}
          <VectorFan x="20" y="25" size="45" heat={heat} isRGB={hasRGB} />
          <VectorFan x="127" y="25" size="45" heat={heat} isRGB={hasRGB} />
          <VectorFan x="235" y="25" size="45" heat={heat} isRGB={hasRGB} />
          
          {/* RGB Trim */}
          {hasRGB && <rect x="0" y="0" width="300" height="75" rx="6" fill="none" stroke="currentColor" strokeWidth="3" className="rgb-anim-stroke" />}
          {hasRGB && <path d="M 20 6 L 100 6 L 110 20 L 190 20 L 200 6 L 280 6" fill="none" stroke="currentColor" strokeWidth="2" className="rgb-anim-stroke" />}
        </g>
      ) : (
        /* Empty PCIe Slots */
        <g transform="translate(100, 210)">
          <rect x="0" y="0" width="200" height="12" fill="#111" rx="2" />
          <rect x="0" y="30" width="200" height="12" fill="#111" rx="2" />
        </g>
      )}

      {/* --- PSU SHROUD (Bottom floor) --- */}
      <g transform="translate(20, 310)">
        <rect x="0" y="0" width="360" height="70" fill="#15151c" stroke="#222" strokeWidth="2" />
        
        {/* Cutout showing PSU */}
        <rect x="30" y="10" width="140" height="50" fill="#1a1a24" stroke="#000" strokeWidth="2" rx="4" />
        <text x="100" y="42" fill={COLORS.textDim} fontSize="28" fontWeight="900" fontStyle="italic" fontFamily="monospace" textAnchor="middle" style={{ letterSpacing: '2px' }}>850W</text>
        
        {/* Shroud Vents */}
        {Array.from({length: 12}).map((_, i) => <rect key={i} x={190 + i*12} y="15" width="6" height="40" fill="#0a0a0f" rx="3" />)}
        
        {/* Underglow Strip */}
        {hasRGB && <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="4" className="rgb-anim-stroke" style={{ filter: 'drop-shadow(0 -4px 8px currentColor)'}} />}
      </g>

      {/* --- CASE FANS (Front Intake & Rear Exhaust) --- */}
      {hasCase && (
        <g>
          {/* Front Intake (Right side) */}
          <VectorFan x="305" y="30" size="70" heat={heat} isRGB={hasRGB} />
          <VectorFan x="305" y="110" size="70" heat={heat} isRGB={hasRGB} />
          <VectorFan x="305" y="190" size="70" heat={heat} isRGB={hasRGB} />
          
          {/* Rear Exhaust (Left side) */}
          <VectorFan x="25" y="40" size="45" heat={heat} isRGB={hasRGB} />
        </g>
      )}

      {/* --- GLASS PANEL GLARE OVERLAY --- */}
      {hasCase && (
        <g>
          <rect x="20" y="20" width="360" height="360" rx="6" fill="url(#glare)" pointerEvents="none" />
          
          {/* Sharp Diagonal Reflection Polygon */}
          <polygon points="20,20 180,20 20,180" fill="rgba(255,255,255,0.03)" pointerEvents="none" />
          <polygon points="200,20 240,20 20,240 20,200" fill="rgba(255,255,255,0.02)" pointerEvents="none" />
          
          {/* Glass edge highlights */}
          <path d="M 22 22 L 378 22 L 378 378" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" pointerEvents="none" />
          <path d="M 22 22 L 22 378 L 378 378" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" pointerEvents="none" />
          
          {/* Thumb Screws */}
          <circle cx="35" cy="35" r="4" fill="#333" stroke="#111" strokeWidth="1" pointerEvents="none" />
          <circle cx="365" cy="35" r="4" fill="#333" stroke="#111" strokeWidth="1" pointerEvents="none" />
          <circle cx="35" cy="365" r="4" fill="#333" stroke="#111" strokeWidth="1" pointerEvents="none" />
          <circle cx="365" cy="365" r="4" fill="#333" stroke="#111" strokeWidth="1" pointerEvents="none" />
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

  const width = expanded ? 600 : 235;
  const height = expanded ? 400 : 84;

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
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
        
        /* Custom scrollbar for diagnostic panel */
        .diag-scroll::-webkit-scrollbar { width: 4px; }
        .diag-scroll::-webkit-scrollbar-track { background: transparent; }
        .diag-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <button
        onClick={(e) => { e.stopPropagation(); toggleExpand?.(); }}
        style={{
          position: 'absolute', top: 6, right: 8, zIndex: 100,
          background: 'rgba(0,0,0,0.8)', border: `1px solid ${COLORS.borderActive}`,
          color: COLORS.textDim, fontSize: '10px', cursor: 'pointer',
          fontFamily: 'inherit', padding: '4px 8px', borderRadius: '3px',
          fontWeight: 'bold', letterSpacing: '1px', transition: 'background 0.2s, color 0.2s'
        }}
        onMouseEnter={(e) => { e.target.style.background = '#222'; e.target.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.8)'; e.target.style.color = COLORS.textDim; }}
      >
        {expanded ? 'X CLOSE LAB' : '▼ OPEN RIG'}
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
            
            {/* The actual Rig Model SVG is scaled to fit nicely here */}
            <div style={{ width: '380px', height: '380px', marginTop: '20px' }}>
              <RigModel inventory={inventory} heat={heat} isProcessing={isProcessing} />
            </div>
            
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: COLORS.textDim, fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: '4px', letterSpacing: '2px', fontWeight: 'bold' }}>
               <span style={{ color: isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.secondary) }}>THERMALS: {heat}%</span>
            </div>
          </div>

          {/* RIGHT COLUMN: HTML DIAGNOSTICS PANEL */}
          <div className="diag-scroll" style={{ width: '220px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', background: 'rgba(10,12,18,0.85)', borderLeft: `1px solid ${COLORS.border}`, overflowY: 'auto' }}>
             <div style={{ color: COLORS.primary, fontSize: '12px', letterSpacing: '2px', fontWeight: 'bold', borderBottom: `1px solid ${COLORS.borderActive}`, paddingBottom: '12px', marginBottom: '8px' }}>
               HARDWARE LAB
             </div>
             
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {HARDWARE_SLOTS.map(slot => {
                   const isInst = installed[slot];
                   const isSel = selected === slot;
                   return (
                     <div key={slot} onClick={() => setSelected(slot)} style={{
                       flex: '1 1 45%', padding: '8px', cursor: 'pointer', borderRadius: '4px',
                       background: isSel ? `${COLORS.primary}20` : 'rgba(0,0,0,0.5)',
                       border: `1px solid ${isSel ? COLORS.primary : COLORS.border}`,
                       transition: 'background 0.2s, border-color 0.2s'
                     }}>
                       <div style={{ fontSize: '10px', color: isSel ? COLORS.text : COLORS.textDim, letterSpacing: '1px', fontWeight: 'bold' }}>{slot}</div>
                       <div style={{ fontSize: '9px', color: isInst ? COLORS.primary : COLORS.danger, marginTop: '6px' }}>
                         {isInst ? `TIER ${getTier(inventory, slot)}` : 'EMPTY SLOT'}
                       </div>
                     </div>
                   );
                })}
             </div>

             <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '6px', border: `1px solid ${COLORS.borderActive}`, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                <div style={{ color: COLORS.text, fontSize: '10px', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>LIVE TELEMETRY</div>
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
