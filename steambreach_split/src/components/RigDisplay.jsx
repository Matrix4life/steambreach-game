import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const SLOT_KEYS = ['CPU', 'GPU', 'Cooling', 'RAM', 'PSU', 'Storage'];

const UPGRADE_TIERS = {
  CPU: [
    { id: 'CPU', name: 'Quantum Core', stat: 'Boosts processing throughput', level: 1 },
    { id: 'CPU_MK2', name: 'Quantum Core MK-II', stat: 'Faster command execution', level: 2 },
    { id: 'CPU_MK3', name: 'Neural Thread Array', stat: 'Max compute output', level: 3 },
  ],
  GPU: [
    { id: 'GPU', name: 'Dual Fan Accelerator', stat: 'Increases GPU load ceiling', level: 1 },
    { id: 'GPU_MK2', name: 'Tri-Core Visual Array', stat: 'Higher render and crack speed', level: 2 },
    { id: 'GPU_MK3', name: 'Black Ice Tensor Board', stat: 'Extreme parallel performance', level: 3 },
  ],
  Cooling: [
    { id: 'Cooling', name: 'Liquid Loop', stat: 'Reduces thermal spikes', level: 1 },
    { id: 'Cooling_MK2', name: 'Dual Loop Radiator', stat: 'Improved sustained cooling', level: 2 },
    { id: 'Cooling_MK3', name: 'Cryo Grid', stat: 'Elite thermal suppression', level: 3 },
  ],
  RAM: [
    { id: 'RAM', name: 'Memory Stack', stat: 'Improves multitasking stability', level: 1 },
    { id: 'RAM_MK2', name: 'ECC Burst Kit', stat: 'Faster data access', level: 2 },
    { id: 'RAM_MK3', name: 'HyperCache Bank', stat: 'Maximum memory bandwidth', level: 3 },
  ],
  PSU: [
    { id: 'PSU', name: 'Power Core', stat: 'Stabilizes system draw', level: 1 },
    { id: 'PSU_MK2', name: 'High Rail Unit', stat: 'Supports heavier modules', level: 2 },
    { id: 'PSU_MK3', name: 'Dark Grid Supply', stat: 'Peak power delivery', level: 3 },
  ],
  Storage: [
    { id: 'Storage', name: 'Solid State Vault', stat: 'Speeds local storage operations', level: 1 },
    { id: 'Storage_MK2', name: 'Encrypted NV Array', stat: 'Faster read/write throughput', level: 2 },
    { id: 'Storage_MK3', name: 'Phase Vault', stat: 'High-speed secure storage', level: 3 },
  ],
};

const getOwnedTier = (inventory, slot) => {
  const tiers = UPGRADE_TIERS[slot];
  const found = tiers.findLast((tier) => inventory.includes(tier.id));
  return found || null;
};

const getNodeState = (inventory, slot) => {
  const tier = getOwnedTier(inventory, slot);
  return {
    installed: !!tier,
    tier: tier?.level || 0,
    label: tier?.name || `EMPTY ${slot.toUpperCase()}`,
    detail: tier?.stat || 'No module installed',
  };
};

const getUpgradePreview = (inventory, slot) => {
  const currentTier = getOwnedTier(inventory, slot)?.level || 0;
  const next = UPGRADE_TIERS[slot].find((item) => item.level === currentTier + 1);
  return next || null;
};

const HoverPanel = ({ x, y, title, lines = [], accent }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 180,
      background: 'rgba(6,10,16,0.95)',
      border: `1px solid ${accent || COLORS.primary}66`,
      borderRadius: 8,
      padding: '10px 12px',
      color: COLORS.text,
      fontSize: 11,
      lineHeight: 1.4,
      backdropFilter: 'blur(6px)',
      boxShadow: `0 0 18px ${accent || COLORS.primary}22`,
      pointerEvents: 'none',
      zIndex: 8,
    }}
  >
    <div style={{ color: accent || COLORS.primary, fontSize: 11, letterSpacing: '1px', marginBottom: 6 }}>
      {title}
    </div>
    {lines.map((line, i) => (
      <div key={i} style={{ color: i === 0 ? COLORS.text : COLORS.textDim, marginBottom: i === lines.length - 1 ? 0 : 4 }}>
        {line}
      </div>
    ))}
  </div>
);

const Node = ({
  x,
  y,
  label,
  active,
  danger,
  installed,
  tier,
  selected,
  hovered,
  onClick,
  onEnter,
  onLeave,
}) => {
  const stroke = danger
    ? COLORS.danger
    : selected
      ? COLORS.warning
      : hovered
        ? COLORS.secondary
        : active
          ? COLORS.primary
          : installed
            ? COLORS.borderActive
            : COLORS.border;

  const fill = selected
    ? 'rgba(255,216,102,0.10)'
    : hovered
      ? 'rgba(169,220,118,0.08)'
      : installed
        ? '#0f141d'
        : '#0b0f15';

  return (
    <g onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect
        x={x - 38}
        y={y - 24}
        width="76"
        height="48"
        rx="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.4"
        className={active ? 'node-active' : ''}
      />
      <rect
        x={x - 28}
        y={y - 16}
        width="56"
        height="10"
        rx="3"
        fill={installed ? 'rgba(120,220,232,0.08)' : 'rgba(255,255,255,0.03)'}
      />
      <text
        x={x}
        y={y - 8}
        textAnchor="middle"
        fontSize="8"
        fill={installed ? COLORS.text : COLORS.textDim}
        style={{ letterSpacing: '1px' }}
      >
        {label}
      </text>
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize="9"
        fill={tier > 0 ? COLORS.secondary : COLORS.textDim}
        style={{ letterSpacing: '1px' }}
      >
        {tier > 0 ? `TIER ${tier}` : 'EMPTY'}
      </text>
      {selected && (
        <circle cx={x + 28} cy={y - 14} r="4" fill={COLORS.warning} />
      )}
    </g>
  );
};

const Line = ({ x1, y1, x2, y2, active, danger, selected }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={danger ? COLORS.danger : selected ? COLORS.warning : active ? COLORS.primary : COLORS.border}
    strokeWidth="1.3"
    strokeDasharray="5 4"
    className={active ? 'line-flow' : ''}
  />
);

const StatBar = ({ label, value, color }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 34px', alignItems: 'center', gap: 6 }}>
    <span style={{ color: COLORS.textDim, fontSize: 10 }}>{label}</span>
    <div
      style={{
        height: 7,
        background: '#131926',
        borderRadius: 999,
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          boxShadow: `0 0 10px ${color}55`,
        }}
      />
    </div>
    <span style={{ color: COLORS.text, fontSize: 10, textAlign: 'right' }}>{value}%</span>
  </div>
);

const RigDisplay = ({
  inventory = [],
  heat = 0,
  isProcessing = false,
  expanded = false,
  toggleExpand,
  onUpgradeSelect,
}) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('CPU');

  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat > 75;
  const isWarm = safeHeat > 45;
  const active = isProcessing;

  const nodeStates = useMemo(() => {
    return {
      CPU: getNodeState(inventory, 'CPU'),
      GPU: getNodeState(inventory, 'GPU'),
      Cooling: getNodeState(inventory, 'Cooling'),
      RAM: getNodeState(inventory, 'RAM'),
      PSU: getNodeState(inventory, 'PSU'),
      Storage: getNodeState(inventory, 'Storage'),
    };
  }, [inventory]);

  const selectedState = nodeStates[selectedSlot];
  const nextUpgrade = getUpgradePreview(inventory, selectedSlot);

  const cpuLoad = nodeStates.CPU.installed ? clamp(Math.round(safeHeat * 0.72 + (active ? 12 : 0)), 6, 100) : 0;
  const gpuLoad = nodeStates.GPU.installed ? clamp(Math.round(safeHeat * 0.88 + (active ? 10 : 0)), 8, 100) : 0;
  const powerLoad = nodeStates.PSU.installed ? clamp(Math.round((cpuLoad + gpuLoad) / 2), 5, 100) : 0;

  const statusText = isHot ? 'OVERHEAT RISK' : isWarm ? 'ELEVATED LOAD' : 'SYSTEM STABLE';
  const statusColor = isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.secondary;

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    onUpgradeSelect?.(slot);
  };

  const panelHeight = expanded ? 360 : 110;

  const hoverInfo = hoveredSlot
    ? {
        title: hoveredSlot,
        lines: [
          nodeStates[hoveredSlot].label,
          nodeStates[hoveredSlot].detail,
          nodeStates[hoveredSlot].installed ? `Installed tier: ${nodeStates[hoveredSlot].tier}` : 'Click to target this slot',
        ],
      }
    : null;

  return (
    <div
      style={{
        width: expanded ? 420 : 320,
        height: panelHeight,
        background: '#0a0f18',
        border: `1px solid ${isHot ? COLORS.danger : COLORS.border}`,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHot ? `0 0 20px ${COLORS.danger}33` : `0 0 20px ${COLORS.primary}11`,
        transition: 'width 0.22s ease, height 0.22s ease',
        cursor: expanded ? 'default' : 'pointer',
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes flow { to { stroke-dashoffset: -22; } }
        @keyframes pulse { 0%,100% { opacity: 0.65 } 50% { opacity: 1 } }
        @keyframes glowWarn { 0%,100% { opacity: 0.25 } 50% { opacity: 0.9 } }
        .line-flow { animation: flow 0.65s linear infinite; }
        .node-active { animation: pulse 1s ease-in-out infinite; }
        .warn-blink { animation: glowWarn 0.8s linear infinite; }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />

      {isHot && (
        <div
          className="warn-blink"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${COLORS.danger}12, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 5,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          fontSize: 9,
          letterSpacing: '0.8px',
          color: COLORS.textDim,
          background: 'rgba(0,0,0,0.52)',
          padding: '4px 7px',
          borderRadius: 5,
        }}
      >
        <span>RIG</span>
        <span style={{ color: statusColor }}>{safeHeat}% TEMP</span>
        <span style={{ color: COLORS.primary }}>{gpuLoad}% GPU</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand?.();
        }}
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          background: 'rgba(0,0,0,0.58)',
          border: 'none',
          color: COLORS.textDim,
          fontSize: 10,
          cursor: 'pointer',
          fontFamily: 'inherit',
          zIndex: 6,
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        {expanded ? '▲ MIN' : '▼'}
      </button>

      {hoverInfo && expanded && (
        <HoverPanel
          x={232}
          y={52}
          title={hoverInfo.title}
          lines={hoverInfo.lines}
          accent={hoveredSlot === selectedSlot ? COLORS.warning : COLORS.primary}
        />
      )}

      <svg width={expanded ? 420 : 320} height={expanded ? 360 : 110} viewBox={expanded ? '0 0 420 360' : '0 0 320 110'}>
        <g transform={expanded ? 'translate(0 0)' : 'translate(-12 -44) scale(0.82)'}>
          <Line x1={150} y1={140} x2={150} y2={70} active={active} danger={isHot} selected={selectedSlot === 'Cooling'} />
          <Line x1={150} y1={140} x2={80} y2={140} active={active} danger={isHot} selected={selectedSlot === 'RAM'} />
          <Line x1={150} y1={140} x2={220} y2={140} active={active} danger={isHot} selected={selectedSlot === 'GPU'} />
          <Line x1={150} y1={140} x2={150} y2={210} active={active} danger={isHot} selected={selectedSlot === 'PSU'} />
          <Line x1={150} y1={140} x2={80} y2={210} active={active} danger={isHot} selected={selectedSlot === 'Storage'} />

          <Node
            x={150}
            y={140}
            label="CPU"
            active={nodeStates.CPU.installed && active}
            danger={isHot}
            installed={nodeStates.CPU.installed}
            tier={nodeStates.CPU.tier}
            selected={selectedSlot === 'CPU'}
            hovered={hoveredSlot === 'CPU'}
            onClick={() => handleSelect('CPU')}
            onEnter={() => setHoveredSlot('CPU')}
            onLeave={() => setHoveredSlot(null)}
          />

          <Node
            x={220}
            y={140}
            label="GPU"
            active={nodeStates.GPU.installed && active}
            danger={isHot}
            installed={nodeStates.GPU.installed}
            tier={nodeStates.GPU.tier}
            selected={selectedSlot === 'GPU'}
            hovered={hoveredSlot === 'GPU'}
            onClick={() => handleSelect('GPU')}
            onEnter={() => setHoveredSlot('GPU')}
            onLeave={() => setHoveredSlot(null)}
          />

          <Node
            x={80}
            y={140}
            label="RAM"
            active={nodeStates.RAM.installed && active}
            danger={false}
            installed={nodeStates.RAM.installed}
            tier={nodeStates.RAM.tier}
            selected={selectedSlot === 'RAM'}
            hovered={hoveredSlot === 'RAM'}
            onClick={() => handleSelect('RAM')}
            onEnter={() => setHoveredSlot('RAM')}
            onLeave={() => setHoveredSlot(null)}
          />

          <Node
            x={150}
            y={70}
            label="COOL"
            active={nodeStates.Cooling.installed && active}
            danger={false}
            installed={nodeStates.Cooling.installed}
            tier={nodeStates.Cooling.tier}
            selected={selectedSlot === 'Cooling'}
            hovered={hoveredSlot === 'Cooling'}
            onClick={() => handleSelect('Cooling')}
            onEnter={() => setHoveredSlot('Cooling')}
            onLeave={() => setHoveredSlot(null)}
          />

          <Node
            x={150}
            y={210}
            label="PSU"
            active={nodeStates.PSU.installed && active}
            danger={false}
            installed={nodeStates.PSU.installed}
            tier={nodeStates.PSU.tier}
            selected={selectedSlot === 'PSU'}
            hovered={hoveredSlot === 'PSU'}
            onClick={() => handleSelect('PSU')}
            onEnter={() => setHoveredSlot('PSU')}
            onLeave={() => setHoveredSlot(null)}
          />

          <Node
            x={80}
            y={210}
            label="SSD"
            active={nodeStates.Storage.installed && active}
            danger={false}
            installed={nodeStates.Storage.installed}
            tier={nodeStates.Storage.tier}
            selected={selectedSlot === 'Storage'}
            hovered={hoveredSlot === 'Storage'}
            onClick={() => handleSelect('Storage')}
            onEnter={() => setHoveredSlot('Storage')}
            onLeave={() => setHoveredSlot(null)}
          />
        </g>
      </svg>

      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 10,
            width: 165,
            bottom: 10,
            background: 'rgba(6,10,16,0.78)',
            border: `1px solid ${selectedState.installed ? COLORS.primary : COLORS.borderActive}`,
            borderRadius: 8,
            padding: '10px 10px 12px',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div>
            <div style={{ color: COLORS.warning, fontSize: 11, letterSpacing: '1px', marginBottom: 6 }}>
              {selectedSlot} SLOT
            </div>
            <div style={{ color: COLORS.text, fontSize: 12, marginBottom: 4 }}>{selectedState.label}</div>
            <div style={{ color: COLORS.textDim, fontSize: 10, lineHeight: 1.4 }}>{selectedState.detail}</div>
          </div>

          <StatBar label="TEMP" value={safeHeat} color={isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.secondary} />
          <StatBar label="CPU" value={cpuLoad} color={COLORS.secondary} />
          <StatBar label="GPU" value={gpuLoad} color={COLORS.primary} />
          <StatBar label="PWR" value={powerLoad} color={COLORS.chat || COLORS.warning} />

          <div
            style={{
              marginTop: 2,
              padding: '8px',
              borderRadius: 6,
              border: `1px solid ${nextUpgrade ? COLORS.secondary : COLORS.border}`,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ color: COLORS.textDim, fontSize: 10, letterSpacing: '1px', marginBottom: 5 }}>
              NEXT UPGRADE
            </div>
            {nextUpgrade ? (
              <>
                <div style={{ color: COLORS.secondary, fontSize: 11, marginBottom: 3 }}>{nextUpgrade.name}</div>
                <div style={{ color: COLORS.textDim, fontSize: 10, lineHeight: 1.35 }}>{nextUpgrade.stat}</div>
              </>
            ) : (
              <div style={{ color: COLORS.textDim, fontSize: 10 }}>Max tier installed</div>
            )}
          </div>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 10,
              color: COLORS.textDim,
              background: 'rgba(0,0,0,0.35)',
              borderRadius: 6,
              padding: '7px 8px',
            }}
          >
            <span style={{ color: statusColor }}>{statusText}</span>
            <span>{selectedState.installed ? `T${selectedState.tier}` : 'EMPTY'}</span>
          </div>
        </div>
      )}

      {!expanded && (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: 6,
            right: 6,
            fontSize: 10,
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.textDim,
            background: 'rgba(0,0,0,0.5)',
            padding: '6px 8px',
            borderRadius: 6,
          }}
        >
          <span style={{ color: statusColor }}>TEMP {safeHeat}%</span>
          <span>{statusText}</span>
        </div>
      )}
    </div>
  );
};

export default RigDisplay;
