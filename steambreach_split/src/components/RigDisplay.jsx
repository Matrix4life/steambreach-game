import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const SLOT_LAYOUT = {
  CPU: { x: 145, y: 84, w: 120, h: 66 },
  RAM: { x: 42, y: 140, w: 120, h: 66 },
  GPU: { x: 196, y: 154, w: 120, h: 66 },
  SSD: { x: 58, y: 224, w: 120, h: 66 },
  PSU: { x: 208, y: 236, w: 120, h: 66 },
};

const TIERS = {
  CPU: ['CPU', 'CPU_MK2', 'CPU_MK3'],
  GPU: ['GPU', 'GPU_MK2', 'GPU_MK3'],
  RAM: ['RAM', 'RAM_MK2', 'RAM_MK3'],
  SSD: ['Storage', 'Storage_MK2', 'Storage_MK3'],
  PSU: ['PSU', 'PSU_MK2', 'PSU_MK3'],
};

function getTier(inventory, slot) {
  const ids = TIERS[slot] || [];
  let tier = 0;
  ids.forEach((id, i) => {
    if (inventory.includes(id)) tier = i + 1;
  });
  return tier;
}

function getInstalled(inventory, slot) {
  return getTier(inventory, slot) > 0;
}

function traceColor(isHot, selected) {
  if (selected) return '#ffd866';
  if (isHot) return '#ff8a5b';
  return '#71e7ff';
}

function slotAccent(slot) {
  if (slot === 'GPU') return '#ffd866';
  return '#71e7ff';
}

function GridBg() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(113,231,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(113,231,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(113,231,255,0.08), transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,216,102,0.06), transparent 28%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.03), transparent 14%, transparent 86%, rgba(255,255,255,0.02))',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

function Trace({ points, color = '#71e7ff', active = true }) {
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`)
    .join(' ');
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.16" strokeWidth="6" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeDasharray="6 6"
        className={active ? 'trace-flow' : ''}
      />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={color} opacity="0.9" />
      ))}
    </>
  );
}

function PanelFrame({ x, y, w, h, selected, accent, children, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <g onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ cursor: 'pointer' }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill="rgba(8,13,20,0.82)"
        stroke={selected ? accent : 'rgba(124,144,180,0.28)'}
        strokeWidth={selected ? '1.8' : '1.1'}
      />
      <rect
        x={x + 5}
        y={y + 5}
        width={w - 10}
        height={h - 10}
        rx="8"
        fill="rgba(15,22,33,0.9)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      <path
        d={`M ${x + 10} ${y + 6} L ${x + 36} ${y + 6} L ${x + 30} ${y + 12} L ${x + 10} ${y + 12}`}
        fill={selected ? `${accent}33` : 'rgba(113,231,255,0.12)'}
      />
      {children}
    </g>
  );
}

function MiniGpu({ x, y, glow }) {
  return (
    <g>
      <rect x={x} y={y + 8} width="58" height="26" rx="5" fill="#1a2230" stroke="#5b6a84" strokeWidth="1" />
      <rect x={x + 4} y={y + 11} width="10" height="20" rx="2" fill="#101722" />
      <rect x={x + 48} y={y + 11} width="6" height="20" rx="1" fill="#101722" />
      <circle cx={x + 22} cy={y + 21} r="7.5" fill="#0c1119" stroke={glow} strokeWidth="1.2" />
      <circle cx={x + 39} cy={y + 21} r="7.5" fill="#0c1119" stroke={glow} strokeWidth="1.2" />
      <circle cx={x + 22} cy={y + 21} r="2.2" fill={glow} />
      <circle cx={x + 39} cy={y + 21} r="2.2" fill={glow} />
      <path d={`M ${x + 22} ${y + 14} L ${x + 24} ${y + 21} L ${x + 20} ${y + 26} Z`} fill={glow} opacity="0.9" />
      <path d={`M ${x + 39} ${y + 14} L ${x + 41} ${y + 21} L ${x + 37} ${y + 26} Z`} fill={glow} opacity="0.9" />
      <rect x={x + 17} y={y + 6} width="24" height="2.5" rx="1" fill="#f0d071" opacity="0.9" />
    </g>
  );
}

function MiniCpu({ x, y, glow }) {
  return (
    <g>
      <rect x={x + 16} y={y + 8} width="28" height="22" rx="4" fill="#141d29" stroke="#7083a0" strokeWidth="1" />
      <rect x={x + 21} y={y + 12} width="18" height="14" rx="2" fill={glow} opacity="0.28" />
      <rect x={x + 24} y={y + 15} width="12" height="8" rx="1.5" fill={glow} opacity="0.8" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 14 + i * 8} y={y + 4} width="2" height="4" fill="#8fa2bf" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`b${i}`} x={x + 14 + i * 8} y={y + 30} width="2" height="4" fill="#8fa2bf" />
      ))}
    </g>
  );
}

function MiniRam({ x, y, glow }) {
  return (
    <g>
      <rect x={x + 8} y={y + 18} width="46" height="10" rx="3" fill="#1a2432" stroke="#6d7f98" strokeWidth="1" />
      <rect x={x + 12} y={y + 13} width="46" height="10" rx="3" fill="#202c3d" stroke="#7487a1" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 18 + i * 8} y={y + 15} width="4.5" height="5" rx="1" fill={glow} opacity="0.8" />
      ))}
    </g>
  );
}

function MiniSsd({ x, y, glow }) {
  return (
    <g>
      <rect x={x + 12} y={y + 12} width="44" height="24" rx="5" fill="#1d2431" stroke="#6c7b93" strokeWidth="1" />
      <rect x={x + 18} y={y + 17} width="12" height="8" rx="1.5" fill={glow} opacity="0.55" />
      <rect x={x + 34} y={y + 17} width="14" height="12" rx="2" fill="#ced7df" opacity="0.85" />
    </g>
  );
}

function MiniPsu({ x, y, glow }) {
  return (
    <g>
      <rect x={x + 10} y={y + 12} width="50" height="24" rx="5" fill="#1b212c" stroke="#68778f" strokeWidth="1" />
      <circle cx={x + 25} cy={y + 24} r="7" fill="#0f141c" stroke={glow} strokeWidth="1" />
      <circle cx={x + 25} cy={y + 24} r="2" fill={glow} />
      <rect x={x + 40} y={y + 18} width="12" height="8" rx="1.5" fill="#5d6d86" />
    </g>
  );
}

function SlotCard({ slot, x, y, selected, installed, tier, pct, onClick, onEnter, onLeave }) {
  const accent = slotAccent(slot);
  return (
    <PanelFrame
      x={x}
      y={y}
      w={120}
      h={66}
      selected={selected}
      accent={accent}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {slot === 'CPU' && <MiniCpu x={x + 18} y={y + 10} glow={accent} />}
      {slot === 'RAM' && <MiniRam x={x + 16} y={y + 10} glow={accent} />}
      {slot === 'GPU' && <MiniGpu x={x + 18} y={y + 10} glow={accent} />}
      {slot === 'SSD' && <MiniSsd x={x + 16} y={y + 10} glow={accent} />}
      {slot === 'PSU' && <MiniPsu x={x + 16} y={y + 10} glow={accent} />}

      <text x={x + 12} y={y + 58} fill={installed ? accent : 'rgba(255,255,255,0.45)'} fontSize="10" style={{ letterSpacing: '1px' }}>
        {slot}
      </text>
      <text x={x + 78} y={y + 58} fill={installed ? '#a5b7d0' : 'rgba(255,255,255,0.28)'} fontSize="10">
        {installed ? `T${tier}` : 'EMPTY'}
      </text>
      {installed && (
        <text x={x + 82} y={y + 20} fill={accent} fontSize="10" textAnchor="end">
          {pct}%
        </text>
      )}
    </PanelFrame>
  );
}

function StatBar({ y, label, value, color }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <text x="0" y="10" fill="#cfd7e2" fontSize="9" style={{ letterSpacing: '1px' }}>{label}</text>
      <rect x="48" y="2" width="88" height="10" rx="999" fill="#131b27" stroke="rgba(255,255,255,0.08)" />
      <rect x="49" y="3" width={Math.max(4, value * 0.86)} height="8" rx="999" fill={color} />
      <text x="150" y="10" fill="#ffffff" fontSize="9" textAnchor="end">{value}%</text>
    </g>
  );
}

function HoverBox({ slot, tier, installed, x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 150,
        background: 'rgba(8,13,20,0.96)',
        border: `1px solid ${slotAccent(slot)}55`,
        borderRadius: 8,
        padding: '8px 10px',
        fontSize: 10,
        color: '#d9e2ee',
        zIndex: 8,
        boxShadow: `0 0 16px ${slotAccent(slot)}22`,
        pointerEvents: 'none',
      }}
    >
      <div style={{ color: slotAccent(slot), letterSpacing: '1px', marginBottom: 5 }}>{slot} SLOT</div>
      <div style={{ marginBottom: 3 }}>{installed ? `Installed tier: T${tier}` : 'No module installed'}</div>
      <div style={{ color: 'rgba(255,255,255,0.6)' }}>
        {installed ? 'Active in blueprint matrix' : 'Click to target this slot'}
      </div>
    </div>
  );
}

const DETAIL_TEXT = {
  CPU: { title: 'Neural Thread Array', body: 'High-speed command execution and tactical compute routing.' },
  RAM: { title: 'HyperCache Bank', body: 'Memory burst handling for multitasking and runtime stability.' },
  GPU: { title: 'Black Ice Tensor Board', body: 'Extreme parallel performance and visual compute acceleration.' },
  SSD: { title: 'Phase Vault', body: 'Encrypted low-latency storage for fast secure retrieval.' },
  PSU: { title: 'Dark Grid Supply', body: 'Stable power delivery for high-load hardware chains.' },
};

export default function RigDisplay({
  inventory = [],
  heat = 0,
  isProcessing = false,
  expanded = true,
  toggleExpand,
}) {
  const [selected, setSelected] = useState('GPU');
  const [hovered, setHovered] = useState(null);

  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat >= 78;
  const isWarm = safeHeat >= 45;

  const installed = {
    CPU: getInstalled(inventory, 'CPU'),
    RAM: getInstalled(inventory, 'RAM'),
    GPU: getInstalled(inventory, 'GPU'),
    SSD: getInstalled(inventory, 'SSD'),
    PSU: getInstalled(inventory, 'PSU'),
  };

  const tiers = {
    CPU: getTier(inventory, 'CPU'),
    RAM: getTier(inventory, 'RAM'),
    GPU: getTier(inventory, 'GPU'),
    SSD: getTier(inventory, 'SSD'),
    PSU: getTier(inventory, 'PSU'),
  };

  const cpuPct = installed.CPU ? clamp(Math.round(safeHeat * 0.78 + (isProcessing ? 8 : 0)), 10, 100) : 0;
  const gpuPct = installed.GPU ? clamp(Math.round(safeHeat * 0.92 + (isProcessing ? 12 : 0)), 12, 100) : 0;
  const ramPct = installed.RAM ? clamp(Math.round((cpuPct + 10) * 0.8), 10, 100) : 0;
  const ssdPct = installed.SSD ? clamp(Math.round((cpuPct + gpuPct) / 3), 8, 100) : 0;
  const psuPct = installed.PSU ? clamp(Math.round((cpuPct + gpuPct) / 2), 10, 100) : 0;

  const pctMap = { CPU: cpuPct, RAM: ramPct, GPU: gpuPct, SSD: ssdPct, PSU: psuPct };

  const detail = DETAIL_TEXT[selected];
  const detailInstalled = installed[selected];
  const detailTitle = detailInstalled ? detail.title : `EMPTY ${selected}`;
  const detailBody = detailInstalled ? detail.body : 'No module installed';

  return (
    <div
      style={{
        width: expanded ? 980 : 360,
        height: expanded ? 620 : 108,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        background: 'linear-gradient(180deg, #081019 0%, #0b1320 100%)',
        border: `1px solid ${isHot ? 'rgba(255,138,91,0.55)' : 'rgba(113,231,255,0.24)'}`,
        boxShadow: isHot ? '0 0 30px rgba(255,138,91,0.18)' : '0 0 26px rgba(113,231,255,0.08)',
        cursor: expanded ? 'default' : 'pointer',
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes traceFlow {
          to { stroke-dashoffset: -24; }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .trace-flow {
          animation: traceFlow 0.8s linear infinite;
        }
        .pulse-glow {
          animation: pulseGlow 1.15s ease-in-out infinite;
        }
      `}</style>

      <GridBg />

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 18,
          zIndex: 6,
          display: 'flex',
          gap: 18,
          color: '#d7dfeb',
          fontSize: 14,
          letterSpacing: '1px',
        }}
      >
        <span style={{ color: '#9fb4c9' }}>RIG</span>
        <span style={{ color: isHot ? '#ff8a5b' : '#b7df73' }}>{safeHeat}% TEMP</span>
        <span style={{ color: '#ffd866' }}>{gpuPct}% GPU</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand?.();
        }}
        style={{
          position: 'absolute',
          top: 14,
          right: 16,
          zIndex: 6,
          border: 'none',
          background: 'rgba(0,0,0,0.35)',
          color: '#8d9aad',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 12,
          letterSpacing: '1px',
          cursor: 'pointer',
        }}
      >
        {expanded ? '▲ MIN' : '▼'}
      </button>

      {hovered && expanded && (
        <HoverBox
          slot={hovered}
          tier={tiers[hovered]}
          installed={installed[hovered]}
          x={76}
          y={330}
        />
      )}

      {expanded ? (
        <svg width="980" height="620" viewBox="0 0 980 620">
          <g transform="translate(18 38)">
            <rect
              x="0"
              y="0"
              width="610"
              height="520"
              rx="22"
              fill="rgba(8,13,20,0.42)"
              stroke="rgba(113,231,255,0.18)"
              strokeWidth="1.2"
            />

            <Trace
              color={traceColor(isHot, selected === 'CPU')}
              active={isProcessing}
              points={[
                [205, 117],
                [205, 95],
                [255, 95],
                [255, 117],
              ]}
            />
            <Trace
              color={traceColor(isHot, selected === 'RAM')}
              active={isProcessing}
              points={[
                [145, 173],
                [145, 160],
                [205, 160],
                [205, 117],
              ]}
            />
            <Trace
              color={traceColor(isHot, selected === 'GPU')}
              active={isProcessing}
              points={[
                [255, 117],
                [302, 117],
                [302, 187],
                [256, 187],
              ]}
            />
            <Trace
              color={traceColor(isHot, selected === 'SSD')}
              active={isProcessing}
              points={[
                [145, 257],
                [145, 230],
                [205, 230],
                [205, 117],
              ]}
            />
            <Trace
              color={traceColor(isHot, selected === 'PSU')}
              active={isProcessing}
              points={[
                [268, 269],
                [268, 235],
                [256, 235],
                [256, 187],
              ]}
            />

            {Object.entries(SLOT_LAYOUT).map(([slot, pos]) => (
              <SlotCard
                key={slot}
                slot={slot}
                x={pos.x}
                y={pos.y}
                selected={selected === slot}
                installed={installed[slot]}
                tier={tiers[slot]}
                pct={pctMap[slot]}
                onClick={() => setSelected(slot)}
                onEnter={() => setHovered(slot)}
                onLeave={() => setHovered(null)}
              />
            ))}
          </g>

          <g transform="translate(650 62)">
            <rect
              x="0"
              y="0"
              width="290"
              height="500"
              rx="22"
              fill="rgba(8,13,20,0.88)"
              stroke={selected === 'GPU' ? 'rgba(255,216,102,0.45)' : 'rgba(113,231,255,0.24)'}
              strokeWidth="1.4"
            />

            <text x="28" y="42" fill="#ffd866" fontSize="20" style={{ letterSpacing: '1px' }}>
              {selected} SLOT
            </text>
            <text x="28" y="78" fill="#ffffff" fontSize="18">
              {detailTitle}
            </text>

            <g transform="translate(28 100)">
              <rect x="0" y="0" width="234" height="142" rx="14" fill="#121a26" stroke="rgba(255,255,255,0.08)" />
              {selected === 'GPU' && <MiniGpu x={48} y={34} glow="#71e7ff" />}
              {selected === 'CPU' && <MiniCpu x={72} y={36} glow="#71e7ff" />}
              {selected === 'RAM' && <MiniRam x={58} y={42} glow="#71e7ff" />}
              {selected === 'SSD' && <MiniSsd x={62} y={40} glow="#71e7ff" />}
              {selected === 'PSU' && <MiniPsu x={56} y={38} glow="#71e7ff" />}
            </g>

            <text x="28" y="268" fill="rgba(255,255,255,0.72)" fontSize="16">
              {detailBody}
            </text>

            <g transform="translate(28 302)">
              <StatBar y={0} label="TEMP" value={safeHeat} color={isHot ? '#ff8a5b' : '#b7df73'} />
              <StatBar y={42} label="CPU" value={cpuPct} color="#71e7ff" />
              <StatBar y={84} label="GPU" value={gpuPct} color="#b7df73" />
              <StatBar y={126} label="PWR" value={psuPct} color="#ffb14f" />
            </g>

            <g transform="translate(28 448)">
              <text
                x="0"
                y="0"
                fill={isHot ? '#ff8a5b' : '#ff8a5b'}
                fontSize="20"
                className={isHot ? 'pulse-glow' : ''}
              >
                {isHot ? '⟳ OVERHEAT' : '⟳ SYSTEM READY'}
              </text>
            </g>
          </g>
        </svg>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: 16,
            color: '#d9e2ee',
            fontSize: 13,
            letterSpacing: '1px',
          }}
        >
          <span>RIG</span>
          <span style={{ color: isHot ? '#ff8a5b' : '#b7df73' }}>{safeHeat}% TEMP</span>
          <span style={{ color: '#ffd866' }}>{gpuPct}% GPU</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{isHot ? 'OVERHEAT' : 'SYSTEM STABLE'}</span>
        </div>
      )}
    </div>
  );
}
