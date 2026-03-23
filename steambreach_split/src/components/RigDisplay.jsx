import React, { useMemo } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Node = ({ x, y, label, active, danger, children }) => {
  return (
    <g>
      <rect
        x={x - 32}
        y={y - 20}
        width="64"
        height="40"
        rx="6"
        fill="#0d1117"
        stroke={danger ? COLORS.danger : active ? COLORS.primary : COLORS.border}
        strokeWidth="1.2"
        className={active ? 'node-active' : ''}
      />
      <text
        x={x}
        y={y + 3}
        textAnchor="middle"
        fontSize="9"
        fill={COLORS.textDim}
        style={{ letterSpacing: '1px' }}
      >
        {label}
      </text>
      {children}
    </g>
  );
};

const Line = ({ x1, y1, x2, y2, active, danger }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={danger ? COLORS.danger : active ? COLORS.primary : COLORS.border}
      strokeWidth="1.2"
      strokeDasharray="4 4"
      className={active ? 'line-flow' : ''}
    />
  );
};

const RigDisplay = ({ inventory = [], heat = 0, isProcessing = false }) => {
  const hasCPU = inventory.includes('CPU');
  const hasGPU = inventory.includes('GPU');
  const hasCooling = inventory.includes('Cooling');
  const hasRAM = inventory.includes('RAM');
  const hasPSU = inventory.includes('PSU');
  const hasStorage = inventory.includes('Storage');

  const safeHeat = clamp(heat, 0, 100);
  const isHot = safeHeat > 75;

  const active = isProcessing;

  const gpuLoad = hasGPU ? clamp(Math.round(safeHeat * 0.9), 5, 100) : 0;
  const cpuLoad = hasCPU ? clamp(Math.round(safeHeat * 0.7), 5, 100) : 0;

  return (
    <div
      style={{
        width: 300,
        height: 280,
        background: '#0a0f18',
        border: `1px solid ${isHot ? COLORS.danger : COLORS.border}`,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHot
          ? `0 0 20px ${COLORS.danger}33`
          : `0 0 20px ${COLORS.primary}11`,
      }}
    >
      <style>{`
        @keyframes flow {
          to { stroke-dashoffset: -20; }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.7 }
          50% { opacity: 1 }
        }
        .line-flow {
          animation: flow 0.6s linear infinite;
        }
        .node-active {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* GRID BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <svg width="100%" height="100%" viewBox="0 0 300 280">

        {/* CONNECTIONS */}
        <Line x1={150} y1={140} x2={150} y2={70} active={active} danger={isHot} />
        <Line x1={150} y1={140} x2={80} y2={140} active={active} danger={isHot} />
        <Line x1={150} y1={140} x2={220} y2={140} active={active} danger={isHot} />
        <Line x1={150} y1={140} x2={150} y2={210} active={active} danger={isHot} />
        <Line x1={150} y1={140} x2={80} y2={210} active={active} danger={isHot} />

        {/* CPU CENTER */}
        <Node x={150} y={140} label="CPU" active={hasCPU && active} danger={isHot}>
          <text x={150} y={160} textAnchor="middle" fontSize="8" fill={COLORS.secondary}>
            {cpuLoad}%
          </text>
        </Node>

        {/* GPU */}
        <Node x={220} y={140} label="GPU" active={hasGPU && active} danger={isHot}>
          <text x={220} y={160} textAnchor="middle" fontSize="8" fill={COLORS.primary}>
            {gpuLoad}%
          </text>
        </Node>

        {/* RAM */}
        <Node x={80} y={140} label="RAM" active={hasRAM && active} />

        {/* COOLING */}
        <Node x={150} y={70} label="COOL" active={hasCooling && active} />

        {/* PSU */}
        <Node x={150} y={210} label="PSU" active={hasPSU && active} />

        {/* STORAGE */}
        <Node x={80} y={210} label="SSD" active={hasStorage && active} />

      </svg>

      {/* STATUS PANEL */}
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
        <span style={{ color: isHot ? COLORS.danger : COLORS.secondary }}>
          TEMP {safeHeat}%
        </span>
        <span>{isHot ? 'OVERHEAT' : 'STABLE'}</span>
      </div>
    </div>
  );
};

export default RigDisplay;
