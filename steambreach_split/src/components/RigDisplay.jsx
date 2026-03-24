import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Expanded layout to fit the extra items from your shop in the clean data-flow aesthetic
const SLOT_LAYOUT = {
  CPU: { x: 88, y: 58, w: 72, h: 34 },
  GPU: { x: 132, y: 102, w: 72, h: 34 },
  RAM: { x: 34, y: 92, w: 72, h: 34 },
  SSD: { x: 42, y: 142, w: 72, h: 34 },
  PSU: { x: 136, y: 150, w: 72, h: 34 },
  COOL: { x: 220, y: 58, w: 72, h: 34 }, // New slot for Liquid Cooling
  NET: { x: 220, y: 102, w: 72, h: 34 }, // New slot for Fiber Optic NetCard
  CASE: { x: 220, y: 150, w: 72, h: 34 }, // New slot for Case/RGB
};

// Mapped exactly to the IDs in your DarknetShop to ensure upgrades trigger instantly
const TIERS = {
  CPU: ['CPU', 'CPU_MK2', 'CPU_MK3'],
  GPU: ['GPU', 'GPU_MK2', 'GPU_MK3'],
  RAM: ['RAM', 'RAM_MK2', 'RAM_MK3'],
  SSD: ['Storage', 'Storage_MK2', 'Storage_MK3'],
  PSU: ['PSU', 'PSU_MK2', 'PSU_MK3'],
  COOL: ['Cooling', 'Cooling_MK2'],
  NET: ['NetCard', 'NetCard_MK2'],
  CASE: ['ATXCase', 'RGB'], // ATX Case is Tier 1, adding RGB makes it Tier 2
};

function getTier(inventory, slot) {
  const ids = TIERS[slot] || [];
  let tier = 0;
  ids.forEach((id, i) => {
    if (inventory.includes(id)) tier = i + 1;
  });
  return tier;
}

function isInstalled(inventory, slot) {
  return getTier(inventory, slot) > 0;
}

function SmallSlot({ x, y, w, h, label, tier, installed, selected, onClick, onEnter, onLeave, accent }) {
  return (
    <g onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        fill="rgba(8,12,18,0.72)"
        stroke={selected ? accent : 'rgba(120,220,232,0.18)'}
        strokeWidth={selected ? '1.2' : '0.8'}
        style={{ transition: 'stroke 0.2s ease' }}
      />
      <path
        d={`M ${x + 4} ${y + 4} L ${x + 18} ${y + 4} L ${x + 13} ${y + 9} L ${x + 4} ${y + 9}`}
        fill={selected ? `${accent}33` : 'rgba(120,220,232,0.10)'}
        style={{ transition: 'fill 0.2s ease' }}
      />
      <text x={x + 8} y={y + 17} fill="#7ea0b5" fontSize="7" style={{ letterSpacing: '1px' }}>
        {label}
      </text>
      <text x={x + w - 8} y={y + 17} textAnchor="end" fill={installed ? accent : 'rgba(255,255,255,0.25)'} fontSize="7">
        {installed ? `T${tier}` : 'EMPTY'}
      </text>
      <rect x={x + 20} y={y + 12} width="18" height="10" rx="2" fill="#1c2634" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <rect x={x + 24} y={y + 15} width="10" height="4" rx="1" fill={installed ? accent : 'rgba(255,255,255,0.16)'} opacity={installed ? 0.9 : 0.5} />
    </g>
  );
}

function Trace({ points, color, active }) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="4" style={{ transition: 'stroke 0.3s ease' }} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
        className={active ? 'trace-flow' : ''}
        style={{ transition: 'stroke 0.3s ease' }}
      />
    </>
  );
}

function MiniBar({ x, y, w, value, color }) {
  return (
    <>
      <rect x={x} y={y} width={w} height="5" rx="999" fill="rgba(255,255,255,0.06)" />
      <rect x={x} y={y} width={Math.max(3, (w * value) / 100)} height="5" rx="999" fill={color} style={{ transition: 'width 0.3s ease, fill 0.3s ease' }} />
    </>
  );
}

export default function RigDisplay({
  inventory = [],
  heat = 0,
  isProcessing = false,
  expanded = false,
  toggleExpand,
}) {
  const [selected, setSelected] = useState('GPU');
  const [hovered, setHovered] = useState(null);

  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat >= 78;
  const isWarm = safeHeat >= 45;

  const width = expanded ? 500 : 235;
  const height = expanded ? 250 : 84;

  // Dynamically checks all slots in SLOT_LAYOUT so it scales infinitely
  const installed = useMemo(() => {
    const obj = {};
    Object.keys(SLOT_LAYOUT).forEach(slot => obj[slot] = isInstalled(inventory, slot));
    return obj;
  }, [inventory]);

  const tiers = useMemo(() => {
    const obj = {};
    Object.keys(SLOT_LAYOUT).forEach(slot => obj[slot] = getTier(inventory, slot));
    return obj;
  }, [inventory]);

  const cpuPct = installed.CPU ? clamp(Math.round(safeHeat * 0.72 + (isProcessing ? 10 : 0)), 8, 100) : 0;
  const gpuPct = installed.GPU ? clamp(Math.round(safeHeat * 0.9 + (isProcessing ? 12 : 0)), 10, 100) : 0;

  const accent = selected === 'GPU' ? COLORS.proxy : COLORS.primary;
  const statusText = isHot ? 'OVERHEAT' : isWarm ? 'ELEVATED' : 'STABLE';
  const statusColor = isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.secondary;

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
        transition: 'width 0.22s ease, height 0.22s ease',
        cursor: expanded ? 'default' : 'pointer',
        boxShadow: isHot ? `0 0 12px ${COLORS.danger}16, inset 0 0 18px ${COLORS.danger}08` : `inset 0 0 18px rgba(0,0,0,0.35)`,
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes traceFlow { to { stroke-dashoffset: -18; } }
        @keyframes blinkWarn { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .trace-flow { animation: traceFlow 0.8s linear infinite; }
        .blink-warn { animation: blinkWarn 0.85s linear infinite; }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(120,220,232,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,220,232,0.05) 1px, transparent 1px)
          `,
          backgroundSize: expanded ? '20px 20px' : '16px 16px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 8,
          zIndex: 4,
          fontSize: '8px',
          color: COLORS.textDim,
          letterSpacing: '1px',
          display: 'flex',
          gap: 8,
        }}
      >
        <span>RIG</span>
        <span style={{ color: statusColor, transition: 'color 0.3s ease' }}>{safeHeat}% TEMP</span>
        <span style={{ color: COLORS.proxy }}>{gpuPct}% GPU</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand?.();
        }}
        style={{
          position: 'absolute',
          top: 3,
          right: 6,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: COLORS.textDim,
          fontSize: '10px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          zIndex: 5,
          padding: '2px 4px',
          borderRadius: '2px',
        }}
      >
        {expanded ? '▲ MIN' : '▼'}
      </button>

      {expanded ? (
        <svg width="500" height="250" viewBox="0 0 500 250">
          <g transform="translate(10 20)">
            <rect x="8" y="18" width="300" height="192" rx="16" fill="rgba(8,12,18,0.28)" stroke="rgba(120,220,232,0.16)" strokeWidth="0.8" />

            {/* Base Traces */}
            <Trace color={selected === 'CPU' ? accent : COLORS.primary} active={isProcessing} points={[[124, 75], [124, 62], [160, 62], [160, 75]]} />
            <Trace color={selected === 'RAM' ? accent : COLORS.primary} active={isProcessing} points={[[106, 109], [124, 109], [124, 92]]} />
            <Trace color={selected === 'GPU' ? COLORS.proxy : COLORS.primary} active={isProcessing} points={[[160, 92], [160, 120], [168, 120]]} />
            <Trace color={selected === 'SSD' ? accent : COLORS.primary} active={isProcessing} points={[[78, 159], [124, 159], [124, 92]]} />
            <Trace color={selected === 'PSU' ? accent : COLORS.primary} active={isProcessing} points={[[172, 167], [172, 136], [168, 136]]} />

            {/* Extended Traces for the new slots */}
            <Trace color={selected === 'COOL' ? accent : COLORS.primary} active={isProcessing} points={[[160, 75], [220, 75]]} />
            <Trace color={selected === 'NET' ? accent : COLORS.primary} active={isProcessing} points={[[204, 119], [220, 119]]} />
            <Trace color={selected === 'CASE' ? accent : COLORS.primary} active={isProcessing} points={[[208, 167], [220, 167]]} />

            {Object.entries(SLOT_LAYOUT).map(([slot, pos]) => (
              <SmallSlot
                key={slot}
                x={pos.x}
                y={pos.y}
                w={pos.w}
                h={pos.h}
                label={slot}
                tier={tiers[slot]}
                installed={installed[slot]}
                selected={selected === slot}
                accent={slot === 'GPU' ? COLORS.proxy : COLORS.primary}
                onClick={() => setSelected(slot)}
                onEnter={() => setHovered(slot)}
                onLeave={() => setHovered(null)}
              />
            ))}

            {hovered && (
              <g transform="translate(18 178)">
                <rect x="0" y="0" width="130" height="26" rx="5" fill="rgba(7,11,16,0.92)" stroke="rgba(120,220,232,0.22)" strokeWidth="0.8" />
                <text x="8" y="11" fill={hovered === 'GPU' ? COLORS.proxy : COLORS.primary} fontSize="7" style={{ letterSpacing: '1px' }}>
                  {hovered} SLOT
                </text>
                <text x="8" y="21" fill="rgba(255,255,255,0.65)" fontSize="7">
                  {installed[hovered] ? `Installed T${tiers[hovered]}` : 'No module installed'}
                </text>
              </g>
            )}
          </g>

          <g transform="translate(332 32)">
            <rect x="0" y="0" width="150" height="186" rx="14" fill="rgba(8,12,18,0.76)" stroke="rgba(120,220,232,0.20)" strokeWidth="0.9" />

            <text x="18" y="22" fill={selected === 'GPU' ? COLORS.proxy : COLORS.warning} fontSize="11" style={{ letterSpacing: '1px' }}>
              {selected} SLOT
            </text>
            <text x="18" y="46" fill={COLORS.text} fontSize="10">
              {installed[selected] ? `${selected} MODULE` : `EMPTY ${selected}`}
            </text>

            <rect x="18" y="60" width="114" height="54" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
            <rect x="60" y="80" width="30" height="16" rx="3" fill="#1c2634" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />
            <rect x="67" y="84" width="16" height="8" rx="1.5" fill={installed[selected] ? (selected === 'GPU' ? COLORS.proxy : COLORS.primary) : 'rgba(255,255,255,0.18)'} style={{ transition: 'fill 0.3s ease' }} />

            <text x="18" y="136" fill="rgba(255,255,255,0.55)" fontSize="8">
              {installed[selected] ? 'Module online' : 'No module installed'}
            </text>

            <g transform="translate(18 150)">
              <text x="0" y="7" fill={COLORS.textDim} fontSize="7">TEMP</text>
              <MiniBar x={36} y={2} w={64} value={safeHeat} color={statusColor} />
              <text x="118" y="7" fill={COLORS.text} fontSize="7" textAnchor="end">{safeHeat}%</text>

              <text x="0" y="28" fill={COLORS.textDim} fontSize="7">CPU</text>
              <MiniBar x={36} y={23} w={64} value={cpuPct} color={COLORS.primary} />
              <text x="118" y="28" fill={COLORS.text} fontSize="7" textAnchor="end">{cpuPct}%</text>

              <text x="0" y="49" fill={COLORS.textDim} fontSize="7">GPU</text>
              <MiniBar x={36} y={44} w={64} value={gpuPct} color={COLORS.proxy} />
              <text x="118" y="49" fill={COLORS.text} fontSize="7" textAnchor="end">{gpuPct}%</text>
            </g>

            <text
              x="18"
              y="176"
              fill={statusColor}
              fontSize="8"
              className={isHot ? 'blink-warn' : ''}
              style={{ letterSpacing: '1px', transition: 'fill 0.3s ease' }}
            >
              {statusText}
            </text>

            <text x="132" y="176" fill="rgba(255,255,255,0.45)" fontSize="7" textAnchor="end">
              {installed[selected] ? `T${tiers[selected]}` : 'EMPTY'}
            </text>
          </g>
        </svg>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 10px 8px',
            fontSize: '8px',
            color: COLORS.textDim,
            letterSpacing: '1px',
          }}
        >
          <span style={{ color: statusColor, transition: 'color 0.3s ease' }}>{statusText}</span>
          <span>{selected}</span>
        </div>
      )}
    </div>
  );
}
