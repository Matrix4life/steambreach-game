import React, { useMemo } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const RigDisplay = ({ inventory = [], heat = 0, isProcessing = false, expanded = false, toggleExpand }) => {
  const hasCase = inventory.includes('ATXCase');
  const hasCPU = inventory.includes('CPU');
  const hasCooling = inventory.includes('Cooling');
  const hasGPU = inventory.includes('GPU');
  const hasRGB = inventory.includes('RGB');

  const safeHeat = clamp(heat, 0, 100);
  const gpuLoad = hasGPU ? clamp(Math.round(safeHeat * 0.85 + (isProcessing ? 12 : 0)), 8, 100) : 0;
  const cpuLoad = hasCPU ? clamp(Math.round(safeHeat * 0.7 + (isProcessing ? 18 : 0)), 6, 100) : 0;

  const caseOuter = hasCase ? '#111118' : '#d7d2c8';
  const caseInner = hasCase ? '#090a0f' : '#b6b0a6';
  const chassisAccent = hasCase ? '#1a1d27' : '#948d82';
  const moboColor = hasCase ? '#161b24' : '#55735d';
  const psuColor = hasCase ? '#23242b' : '#8d877b';
  const metal = hasCase ? '#2f3440' : '#777266';

  const isHot = safeHeat >= 78;
  const isWarm = safeHeat >= 45;
  const liquidColor = isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.primary;
  const fanDur = isHot ? '0.16s' : isWarm ? '0.42s' : '1.2s';
  const panelHeight = expanded ? 280 : 88;

  const tempLabelColor = isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.secondary;

  const bars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const threshold = (i + 1) * 10;
        return {
          active: gpuLoad >= threshold,
          index: i,
        };
      }),
    [gpuLoad]
  );

  return (
    <div
      style={{
        width: 250,
        height: panelHeight,
        flexShrink: 0,
        border: `1px solid ${isHot ? `${COLORS.danger}88` : COLORS.border}`,
        background: COLORS.bgDark,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 6,
        transition: 'height 0.28s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: expanded ? 'default' : 'pointer',
        boxShadow: isHot
          ? `0 0 18px ${COLORS.danger}35, inset 0 0 25px ${COLORS.danger}18`
          : hasRGB
            ? `0 0 18px ${COLORS.primary}18, inset 0 0 16px rgba(255,255,255,0.02)`
            : 'inset 0 0 16px rgba(255,255,255,0.02)',
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes rig-fan-spin { 100% { transform: rotate(360deg); } }
        @keyframes rig-flow { to { stroke-dashoffset: -24; } }
        @keyframes rig-rgb-cycle {
          0%   { box-shadow: inset 0 0 24px rgba(255, 97, 136, 0.12), 0 0 18px rgba(255, 97, 136, 0.14); border-color: rgba(255,97,136,0.5); }
          33%  { box-shadow: inset 0 0 24px rgba(169, 220, 118, 0.14), 0 0 18px rgba(169, 220, 118, 0.16); border-color: rgba(169,220,118,0.5); }
          66%  { box-shadow: inset 0 0 24px rgba(120, 220, 232, 0.14), 0 0 18px rgba(120, 220, 232, 0.18); border-color: rgba(120,220,232,0.55); }
          100% { box-shadow: inset 0 0 24px rgba(255, 97, 136, 0.12), 0 0 18px rgba(255, 97, 136, 0.14); border-color: rgba(255,97,136,0.5); }
        }
        @keyframes rig-heat-pulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.42; transform: scale(1.02); }
        }
        @keyframes rig-warning-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }
        @keyframes rig-bar-flicker {
          0%, 100% { opacity: 0.92; }
          50% { opacity: 0.58; }
        }
        .rig-spin { transform-origin: center; animation: rig-fan-spin ${fanDur} linear infinite; }
        .rig-flow { stroke-dasharray: 8 5; animation: rig-flow 0.45s linear infinite; }
        .rig-rgb-frame { animation: rig-rgb-cycle 4s linear infinite; }
        .rig-overheat { animation: rig-heat-pulse 1s ease-in-out infinite; }
        .rig-warning { animation: rig-warning-blink 0.85s linear infinite; }
        .rig-gpu-active { animation: rig-bar-flicker 0.9s ease-in-out infinite; }
      `}</style>

      {hasRGB && expanded && (
        <div
          className="rig-rgb-frame"
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(120,220,232,0.35)',
            pointerEvents: 'none',
            borderRadius: 6,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {isHot && expanded && (
        <div
          className="rig-overheat"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, ${COLORS.danger}22, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 8,
          zIndex: 4,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          fontSize: 9,
          letterSpacing: '0.8px',
          color: COLORS.textDim,
          background: 'rgba(0,0,0,0.55)',
          padding: '3px 6px',
          borderRadius: 4,
        }}
      >
        <span>RIG</span>
        <span style={{ color: tempLabelColor }}>{safeHeat}% TEMP</span>
        {hasGPU && expanded && <span style={{ color: COLORS.primary }}>{gpuLoad}% GPU</span>}
      </div>

      {isHot && expanded && (
        <div
          className="rig-warning"
          style={{
            position: 'absolute',
            top: 6,
            right: 42,
            zIndex: 4,
            fontSize: 9,
            letterSpacing: '1px',
            color: COLORS.danger,
            background: 'rgba(0,0,0,0.72)',
            padding: '3px 6px',
            borderRadius: 4,
            border: `1px solid ${COLORS.danger}66`,
          }}
        >
          OVERHEAT
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand();
        }}
        style={{
          position: 'absolute',
          top: 4,
          right: 8,
          background: 'rgba(0,0,0,0.62)',
          border: 'none',
          color: COLORS.textDim,
          fontSize: 10,
          cursor: 'pointer',
          fontFamily: 'inherit',
          zIndex: 5,
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        {expanded ? '▲ MIN' : '▼'}
      </button>

      {!expanded && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            right: 10,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 8,
              background: '#141822',
              borderRadius: 999,
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                width: `${safeHeat}%`,
                height: '100%',
                background: isHot
                  ? `linear-gradient(90deg, ${COLORS.warning}, ${COLORS.danger})`
                  : isWarm
                    ? `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.warning})`
                    : `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.primary})`,
                boxShadow: `0 0 12px ${liquidColor}55`,
                transition: 'width 0.25s ease',
              }}
            />
          </div>
          <span style={{ fontSize: 8, color: COLORS.textDim, letterSpacing: '1px' }}>STATUS</span>
        </div>
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 220 280"
        preserveAspectRatio="xMidYMid meet"
        style={{ padding: expanded ? 10 : 8, filter: 'drop-shadow(2px 4px 7px rgba(0,0,0,0.45))' }}
      >
        <defs>
          <linearGradient id="gpuBar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.primary} />
            <stop offset="100%" stopColor={COLORS.warning} />
          </linearGradient>
          <linearGradient id="heatStrip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.secondary} />
            <stop offset="60%" stopColor={COLORS.warning} />
            <stop offset="100%" stopColor={COLORS.danger} />
          </linearGradient>
        </defs>

        <rect x="8" y="12" width="204" height="250" rx="8" fill={caseOuter} stroke={chassisAccent} strokeWidth="2" />
        <rect x="18" y="22" width="184" height="228" rx="5" fill={caseInner} stroke={hasRGB ? 'rgba(255,255,255,0.08)' : COLORS.borderActive} strokeWidth="1.5" />

        <rect x="28" y="35" width="104" height="142" rx="4" fill={moboColor} stroke="#0a0a0a" strokeWidth="1.2" />
        <rect x="35" y="45" width="22" height="10" fill="#10131a" />
        <rect x="101" y="48" width="22" height="72" rx="2" fill="#11151d" />
        <rect x="106" y="53" width="4" height="62" fill={metal} />
        <rect x="113" y="53" width="4" height="62" fill={metal} />

        <rect x="18" y="192" width="82" height="48" rx="3" fill={psuColor} stroke="#111" strokeWidth="1.2" />
        <circle cx="44" cy="216" r="16" fill="#0c0c10" stroke="#333842" strokeWidth="2" />
        <g transform="translate(44 216)">
          <path d="M 0 -11 Q 5 0 0 11 Q -5 0 0 -11" fill={COLORS.textDim} className="rig-spin" />
          <path d="M -11 0 Q 0 5 11 0 Q 0 -5 -11 0" fill={COLORS.textDim} className="rig-spin" />
        </g>

        <g transform="translate(53 55)">
          {hasCPU ? (
            <>
              <rect x="0" y="0" width="40" height="40" rx="3" fill="#242833" stroke={COLORS.primary} strokeWidth="1.2" />
              <rect
                x="9"
                y="9"
                width="22"
                height="22"
                rx="2"
                fill={COLORS.primary}
                opacity={isProcessing ? 0.95 : 0.72}
                style={{ transition: 'opacity 0.15s ease' }}
              />
            </>
          ) : (
            <rect x="5" y="5" width="30" height="30" rx="2" fill="#343843" />
          )}

          {hasCooling ? (
            <>
              <rect x="5" y="5" width="30" height="30" rx="15" fill="#0b0d12" stroke={liquidColor} strokeWidth="2" />
              <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.02)" stroke={liquidColor} strokeWidth="1" opacity="0.75" />
            </>
          ) : (
            <>
              <circle cx="20" cy="20" r="16" fill="#191d25" stroke={metal} strokeWidth="1.4" />
              <g transform="translate(20 20)">
                <path d="M 0 -12 Q 5 0 0 12 Q -5 0 0 -12" fill={COLORS.primaryDim} className="rig-spin" />
                <path d="M -12 0 Q 0 5 12 0 Q 0 -5 -12 0" fill={COLORS.primaryDim} className="rig-spin" />
              </g>
            </>
          )}
        </g>

        {hasCooling && (
          <>
            <path d="M 93 73 Q 118 55 162 52" fill="none" stroke={liquidColor} strokeWidth="7" opacity="0.22" />
            <path d="M 93 73 Q 118 55 162 52" fill="none" stroke={liquidColor} strokeWidth="2" className="rig-flow" />
            <path d="M 93 84 Q 122 99 162 102" fill="none" stroke={liquidColor} strokeWidth="7" opacity="0.22" />
            <path d="M 93 84 Q 122 99 162 102" fill="none" stroke={liquidColor} strokeWidth="2" className="rig-flow" />
            <rect x="164" y="38" width="24" height="120" rx="3" fill="#10131a" stroke="#232a35" strokeWidth="1.5" />

            {[58, 98, 138].map((y) => (
              <g key={y} transform={`translate(176 ${y})`}>
                <circle cx="0" cy="0" r="10" fill="#05070c" stroke="#2c3340" strokeWidth="1.4" />
                <path d="M 0 -7 Q 3 0 0 7 Q -3 0 0 -7" fill={liquidColor} className="rig-spin" />
                <path d="M -7 0 Q 0 3 7 0 Q 0 -3 -7 0" fill={liquidColor} className="rig-spin" />
              </g>
            ))}
          </>
        )}

        {hasGPU ? (
          <g transform="translate(25 126)">
            <rect x="0" y="0" width="114" height="38" rx="4" fill="#171b24" stroke={COLORS.primary} strokeWidth="1.1" />
            <rect x="8" y="6" width="18" height="3" fill={COLORS.warning} />
            <rect x="0" y="0" width="114" height="38" rx="4" fill="transparent" stroke={hasRGB ? 'rgba(255,255,255,0.08)' : 'transparent'} />

            {[29, 78].map((x) => (
              <g key={x} transform={`translate(${x} 19)`}>
                <circle cx="0" cy="0" r="12" fill="#0b0d11" stroke="#2a313d" strokeWidth="1" />
                <path d="M 0 -10 Q 4 0 0 10 Q -4 0 0 -10" fill={COLORS.primary} className="rig-spin" />
                <path d="M -10 0 Q 0 4 10 0 Q 0 -4 -10 0" fill={COLORS.primary} className="rig-spin" />
              </g>
            ))}

            {hasRGB && (
              <rect
                x="0"
                y="0"
                width="114"
                height="38"
                rx="4"
                fill="none"
                stroke={COLORS.danger}
                strokeWidth="1.4"
                style={{ mixBlendMode: 'screen' }}
                className="rig-rgb-frame"
              />
            )}
          </g>
        ) : (
          <g transform="translate(28 132)">
            <rect x="0" y="0" width="66" height="4" rx="1" fill="#11151c" />
            <rect x="0" y="14" width="66" height="4" rx="1" fill="#11151c" />
          </g>
        )}

        {expanded && (
          <>
            <g transform="translate(150 172)">
              <text x="0" y="0" fill={COLORS.textDim} fontSize="8" letterSpacing="1">GPU LOAD</text>
              <rect x="0" y="8" width="46" height="70" rx="4" fill="#0f1218" stroke="#262c36" strokeWidth="1" />
              {bars.map((bar) => {
                const y = 70 - bar.index * 6;
                const fill = bar.active
                  ? bar.index >= 8
                    ? COLORS.danger
                    : bar.index >= 5
                      ? COLORS.warning
                      : COLORS.primary
                  : '#20252e';

                return (
                  <rect
                    key={bar.index}
                    x="8"
                    y={y}
                    width="30"
                    height="4"
                    rx="1"
                    fill={fill}
                    className={bar.active ? 'rig-gpu-active' : ''}
                    opacity={bar.active ? 1 : 0.45}
                  />
                );
              })}
              <text x="23" y="92" textAnchor="middle" fill={COLORS.primary} fontSize="9">{gpuLoad}%</text>
            </g>

            <g transform="translate(28 252)">
              <text x="0" y="0" fill={COLORS.textDim} fontSize="8" letterSpacing="1">THERMAL</text>
              <rect x="0" y="8" width="108" height="8" rx="999" fill="#10141b" stroke="#262c36" strokeWidth="1" />
              <rect
                x="1"
                y="9"
                width={Math.max(4, safeHeat * 1.06)}
                height="6"
                rx="999"
                fill="url(#heatStrip)"
                opacity="0.95"
              />
            </g>

            <g transform="translate(142 248)">
              <text x="0" y="0" fill={COLORS.textDim} fontSize="8" letterSpacing="1">CPU</text>
              <text x="0" y="14" fill={COLORS.secondary} fontSize="11">{cpuLoad}%</text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

export default RigDisplay;
