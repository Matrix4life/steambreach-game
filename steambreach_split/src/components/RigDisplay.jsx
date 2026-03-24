import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Expanded Tiers to include the new custom parts so the UI recognizes them
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
// 3D SVG ASSETS
// ----------------------------------------------------
const IsometricFan = ({ cx, cy, r, isRGB, heat }) => {
  const fanDur = heat > 75 ? '0.15s' : (heat > 40 ? '0.4s' : '1.5s');
  const rgbClass = isRGB ? 'rgb-anim-stroke' : '';
  const fanColor = isRGB ? 'currentColor' : (COLORS.primaryDim || '#4a8b96');
  
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle cx="0" cy="0" r={r} fill="#0a0a0f" stroke={fanColor} strokeWidth="2" className={rgbClass} />
      <g style={{ transformOrigin: 'center', animation: `fan-spin ${fanDur} linear infinite` }}>
        <path d={`M 0 -${r-4} Q ${r/2} 0 0 ${r-4} Q -${r/2} 0 0 -${r-4}`} fill={fanColor} className={isRGB ? 'rgb-anim-fill' : ''} opacity="0.8" />
        <path d={`M -${r-4} 0 Q 0 ${r/2} ${r-4} 0 Q 0 -${r/2} -${r-4} 0`} fill={fanColor} className={isRGB ? 'rgb-anim-fill' : ''} opacity="0.8" />
        <circle cx="0" cy="0" r={r/4} fill="#111" />
      </g>
    </g>
  );
};

// ----------------------------------------------------
// THE 3D RIG MODEL ENGINE
// ----------------------------------------------------
const RigModel = ({ rotX, rotY, scale, inventory, heat, isProcessing }) => {
  const hasCase = getTier(inventory, 'Case') > 0;
  const hasCPU = getTier(inventory, 'CPU') > 0;
  const hasGPU = getTier(inventory, 'GPU') > 0;
  const hasRAM = getTier(inventory, 'RAM') > 0;
  const hasCooling = getTier(inventory, 'Cooling') > 0;
  const hasRGB = getTier(inventory, 'RGB') > 0;

  const isHot = heat >= 75;
  const isWarm = heat >= 40;
  
  const liquidColor = isHot ? (COLORS.danger || '#ff6188') : (isWarm ? (COLORS.warning || '#ffd866') : (COLORS.primary || '#78dce8'));
  const caseOuter = hasCase ? '#111118' : '#d1cbbd';
  const glassColor = hasCase ? 'rgba(20, 20, 30, 0.4)' : 'transparent';
  const moboColor = hasCase ? '#1e1e2e' : '#4a7550';
  const psuColor = hasCase ? '#2d2a2e' : '#8c887d';
  const cpuOpacity = isProcessing ? (Math.random() > 0.5 ? 1 : 0.4) : 0.8;

  const panelStyle = { position: 'absolute', transformStyle: 'preserve-3d' };

  return (
    <div style={{
      position: 'absolute', width: '160px', height: '340px',
      transformStyle: 'preserve-3d', left: '50%', top: '50%',
      transform: `translate(-50%, -50%) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`
    }}>
      
      {/* 1. TOP ROOF */}
      <div style={{ ...panelStyle, width: '160px', height: '320px', background: caseOuter, transform: 'translateY(-170px) rotateX(90deg)' }}>
        {hasCase && <div style={{ margin: '10px', height: '300px', border: `2px solid ${COLORS.borderActive}`, background: '#0a0a0f', opacity: 0.5 }} />}
      </div>
      
      {/* 2. BOTTOM FLOOR */}
      <div style={{ ...panelStyle, width: '160px', height: '320px', background: caseOuter, transform: 'translateY(170px) rotateX(-90deg)' }} />
      
      {/* 3. BACK I/O PANEL */}
      <div style={{ ...panelStyle, width: '160px', height: '340px', background: caseOuter, transform: 'translateZ(-160px) rotateY(180deg)' }}>
         <div style={{ width: '50px', height: '120px', background: '#111', margin: '20px', border: '2px solid #333' }} />
      </div>
      
      {/* 4. FRONT PANEL (Intake Fans) */}
      <div style={{ ...panelStyle, width: '160px', height: '340px', background: hasCase ? 'rgba(15,15,20,0.9)' : caseOuter, border: `2px solid ${COLORS.border}`, transform: 'translateZ(160px)' }}>
        {hasCase ? (
          <svg width="160" height="340">
            <IsometricFan cx={80} cy={80} r={55} isRGB={hasRGB} heat={heat} />
            <IsometricFan cx={80} cy={200} r={55} isRGB={hasRGB} heat={heat} />
          </svg>
        ) : (
          hasRGB && <div className="rgb-anim-bg" style={{ width: '100%', height: '100%', opacity: 0.3 }} />
        )}
      </div>
      
      {/* 5. RIGHT WALL (Solid Panel behind motherboard) */}
      <div style={{ ...panelStyle, width: '320px', height: '340px', background: caseOuter, transform: 'translateX(80px) rotateY(90deg)' }} />
      
      {/* 6. LEFT WALL (Glass Panel / Vent) */}
      <div style={{ ...panelStyle, width: '320px', height: '340px', background: glassColor, border: hasCase ? '4px solid #111' : 'none', backdropFilter: hasCase ? 'blur(2px)' : 'none', transform: 'translateX(-80px) rotateY(-90deg)' }}>
        {hasRGB && hasCase && <div className="rgb-anim-border" style={{ width: '100%', height: '100%', border: '4px solid currentColor', opacity: 0.8, boxSizing: 'border-box' }} />}
        {!hasCase && (
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: '150px', height: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({length: 12}).map((_, i) => <div key={i} className={hasRGB ? "rgb-anim-bg" : ""} style={{ height: '8px', background: hasRGB ? 'currentColor' : '#a3a097', opacity: 0.8 }} />)}
             </div>
           </div>
        )}
      </div>

      {/* --- INTERNAL PARALLAX LAYERS --- */}
      
      {/* LAYER A: MOTHERBOARD */}
      <div style={{ ...panelStyle, width: '320px', height: '340px', transform: 'translateX(60px) rotateY(-90deg)' }}>
         <svg width="320" height="340">
           <rect x="20" y="20" width="280" height="300" rx="4" fill={moboColor} stroke="#111" strokeWidth="2" />
           <rect x="70" y="60" width="80" height="80" fill="#2d2a2e" stroke="#111" strokeWidth="2" />
           {hasCPU && <rect x="85" y="75" width="50" height="50" fill={COLORS.primary} opacity={cpuOpacity} stroke="#fff" style={{ transition: 'opacity 0.1s' }} />}
           
           <rect x="180" y="50" width="8" height="110" fill="#111" />
           <rect x="200" y="50" width="8" height="110" fill="#111" />
           {hasRAM && <rect x="182" y="52" width="4" height="106" fill={COLORS.textDim} />}
           {hasRAM && <rect x="202" y="52" width="4" height="106" fill={COLORS.textDim} />}

           <rect x="50" y="190" width="200" height="12" fill="#111" />
           <rect x="50" y="230" width="200" height="12" fill="#111" />

           <rect x="20" y="260" width="280" height="60" fill={psuColor} stroke="#111" strokeWidth="2" />
           <text x="240" y="295" fill="#555" fontSize="16" fontWeight="bold" fontFamily="monospace">850W</text>

           {hasRGB && <rect x="22" y="22" width="276" height="296" fill="none" strokeWidth="3" className="rgb-anim-stroke" opacity="0.8" />}
         </svg>
      </div>

      {/* LAYER B: GPU */}
      {hasGPU && (
        <div style={{ ...panelStyle, width: '320px', height: '340px', transform: 'translateX(20px) rotateY(-90deg)' }}>
          <svg width="320" height="340">
            <g transform="translate(40, 190)">
              <rect x="0" y="0" width="220" height="80" rx="6" fill="#1a1a24" stroke={COLORS.borderActive} strokeWidth="2" />
              <rect x="10" y="10" width="200" height="60" rx="4" fill="#111" />
              <IsometricFan cx={40} cy={40} r={26} isRGB={hasRGB} heat={heat} />
              <IsometricFan cx={110} cy={40} r={26} isRGB={hasRGB} heat={heat} />
              <IsometricFan cx={180} cy={40} r={26} isRGB={hasRGB} heat={heat} />
              {hasRGB && <rect x="0" y="0" width="220" height="80" rx="6" fill="none" strokeWidth="3" className="rgb-anim-stroke" />}
            </g>
          </svg>
        </div>
      )}

      {/* LAYER C: COOLING PIPES */}
      <div style={{ ...panelStyle, width: '320px', height: '340px', transform: 'translateX(40px) rotateY(-90deg)' }}>
         <svg width="320" height="340">
           {hasCooling ? (
             <g>
                <rect x="90" y="80" width="40" height="40" rx="20" fill="#111" stroke={liquidColor} strokeWidth="4" />
                <rect x="70" y="20" width="160" height="30" fill="#111" stroke="#222" strokeWidth="2" />
                <path d="M 110 80 Q 130 50 170 50" fill="none" stroke={liquidColor} strokeWidth="8" opacity="0.4" />
                <path d="M 110 80 Q 130 50 170 50" fill="none" stroke={liquidColor} strokeWidth="3" className="flow" />
                <path d="M 100 80 Q 80 50 100 50" fill="none" stroke={liquidColor} strokeWidth="8" opacity="0.4" />
                <path d="M 100 80 Q 80 50 100 50" fill="none" stroke={liquidColor} strokeWidth="3" className="flow" />
             </g>
           ) : (
             <g transform="translate(110, 100)">
                <circle cx="0" cy="0" r="30" fill="#222" stroke="#555" strokeWidth="2" />
                <g style={{ transformOrigin: 'center', animation: `fan-spin ${heat > 40 ? '0.4s' : '1.5s'} linear infinite` }}>
                  <path d="M 0 -20 Q 10 0 0 20 Q -10 0 0 -20" fill={COLORS.textDim} className={hasRGB ? "rgb-anim-fill" : ""} />
                  <path d="M -20 0 Q 0 10 20 0 Q 0 -10 -20 0" fill={COLORS.textDim} className={hasRGB ? "rgb-anim-fill" : ""} />
                </g>
             </g>
           )}
         </svg>
      </div>
      
    </div>
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
  const [rot, setRot] = useState({ x: -10, y: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Safety clamps for values
  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat >= 75;
  const isWarm = safeHeat >= 40;

  // Dimensions
  const width = expanded ? 500 : 235;
  const height = expanded ? 250 : 84;

  // The comprehensive list of all parts to track
  const HARDWARE_SLOTS = ['Case', 'CPU', 'GPU', 'RAM', 'Cooling', 'Storage', 'PSU', 'RGB'];

  // Check which are installed
  const installed = useMemo(() => {
    let obj = {};
    HARDWARE_SLOTS.forEach(slot => obj[slot] = getTier(inventory, slot) > 0);
    return obj;
  }, [inventory]);

  const cpuPct = installed.CPU ? clamp(Math.round(safeHeat * 0.72 + (isProcessing ? 10 : 0)), 8, 100) : 0;
  const gpuPct = installed.GPU ? clamp(Math.round(safeHeat * 0.9 + (isProcessing ? 12 : 0)), 10, 100) : 0;

  const statusText = isHot ? 'OVERHEAT' : isWarm ? 'ELEVATED' : 'STABLE';
  const statusColor = isHot ? (COLORS.danger || '#ff6188') : isWarm ? (COLORS.warning || '#ffd866') : (COLORS.secondary || '#a9dc76');

  const handleMouseDown = (e) => { setIsDragging(true); setStartPos({ x: e.clientX, y: e.clientY }); };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setRot(r => ({ x: clamp(r.x - deltaY * 0.5, -80, 80), y: r.y + deltaX * 0.5 }));
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      style={{
        width,
        height,
        flexShrink: 0,
        border: `1px solid ${isHot ? `${COLORS.danger}66` : COLORS.border}`,
        position: 'relative',
        background: COLORS.bgDark,
        overflow: 'hidden',
        borderRadius: '3px',
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
        
        /* Fool-proof animation that affects colors, strokes, backgrounds, and borders! */
        @keyframes rgb-cycle {
          0%   { color: ${COLORS.danger}; stroke: ${COLORS.danger}; background-color: ${COLORS.danger}; border-color: ${COLORS.danger}; fill: ${COLORS.danger}; }
          33%  { color: ${COLORS.secondary}; stroke: ${COLORS.secondary}; background-color: ${COLORS.secondary}; border-color: ${COLORS.secondary}; fill: ${COLORS.secondary}; }
          66%  { color: ${COLORS.primary}; stroke: ${COLORS.primary}; background-color: ${COLORS.primary}; border-color: ${COLORS.primary}; fill: ${COLORS.primary}; }
          100% { color: ${COLORS.danger}; stroke: ${COLORS.danger}; background-color: ${COLORS.danger}; border-color: ${COLORS.danger}; fill: ${COLORS.danger}; }
        }
        @keyframes heat-pulse { 0%, 100% { background: ${COLORS.danger}10; } 50% { background: ${COLORS.danger}30; } }
        
        .rgb-anim-stroke { animation: rgb-cycle 4s linear infinite; stroke: currentColor; }
        .rgb-anim-fill { animation: rgb-cycle 4s linear infinite; fill: currentColor; }
        .rgb-anim-bg { animation: rgb-cycle 4s linear infinite; background-color: currentColor; }
        .rgb-anim-border { animation: rgb-cycle 4s linear infinite; border-color: currentColor; }
        .flow { stroke-dasharray: 10, 5; animation: flow 0.5s linear infinite; }
      `}</style>

      {/* Expand/Collapse Button */}
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

      {/* --- COLLAPSED VIEW (Mini 3D Thumbnail) --- */}
      {!expanded ? (
        <div style={{ position: 'absolute', inset: 0, padding: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', perspective: '400px', position: 'relative' }}>
             <RigModel rotX={-15} rotY={-35} scale={0.16} inventory={inventory} heat={heat} isProcessing={isProcessing} />
          </div>
          <div>
             <div style={{ color: COLORS.primary, fontSize: '11px', letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM RIG</div>
             <div style={{ color: statusColor, fontSize: '10px', marginTop: '6px', letterSpacing: '1px' }}>
               {statusText} • {safeHeat}% TEMP
             </div>
          </div>
        </div>
      ) : (
        /* --- EXPANDED VIEW (Interactive 3D + HTML Stats) --- */
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          
          {/* LEFT COLUMN: 3D INTERACTIVE WORKBENCH */}
          <div 
            style={{ flex: 1, perspective: '1200px', position: 'relative', background: 'radial-gradient(circle at center, #1a1a24 0%, #0a0a0f 100%)' }}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          >
            {isHot && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', animation: 'heat-pulse 1s infinite' }} />}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: isDragging ? 'grabbing' : 'grab' }} />
            
            <RigModel rotX={rot.x} rotY={rot.y} scale={0.55} inventory={inventory} heat={heat} isProcessing={isProcessing} />
            
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: COLORS.textDim, fontSize: '9px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '1px' }}>
               DRAG TO ROTATE
            </div>
          </div>

          {/* RIGHT COLUMN: HTML DIAGNOSTICS PANEL */}
          <div style={{ width: '220px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', background: 'rgba(8,12,18,0.6)', borderLeft: `1px solid ${COLORS.border}` }}>
             <div style={{ color: COLORS.primary, fontSize: '11px', letterSpacing: '2px' }}>HARDWARE DIAGNOSTICS</div>
             
             {/* Component Slot Selectors - NOW INCLUDES ALL 8 PARTS */}
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

             {/* Live Performance Stats */}
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
