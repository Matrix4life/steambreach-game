import React, { useMemo } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const IsoPanel = ({ x, y, w, h, d = 8, top, left, front, stroke = 'rgba(0,0,0,0.35)', children, opacity = 1 }) => (
  <g opacity={opacity}>
    <polygon
      points={`${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}`}
      fill={top}
      stroke={stroke}
      strokeWidth="1"
    />
    <polygon
      points={`${x},${y} ${x + d},${y - d} ${x + d},${y + h - d} ${x},${y + h}`}
      fill={left}
      stroke={stroke}
      strokeWidth="1"
    />
    <polygon
      points={`${x},${y + h} ${x + w},${y + h} ${x + w + d},${y + h - d} ${x + d},${y + h - d}`}
      fill={front}
      stroke={stroke}
      strokeWidth="1"
    />
    {children}
  </g>
);

const Fan = ({ cx, cy, r = 12, ring = '#7d88a5', blade = '#a9b7ff', spinning = true, glow = null, duration = '1.2s' }) => (
  <g>
    {glow && <circle cx={cx} cy={cy} r={r + 3} fill={glow} opacity="0.18" />}
    <circle cx={cx} cy={cy} r={r} fill="#171c29" stroke={ring} strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r={r - 4} fill="#0d1018" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <g className={spinning ? 'iso-rig-spin' : ''} style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: duration }}>
      <path d={`M ${cx} ${cy - (r - 4)} Q ${cx + 5} ${cy - 2} ${cx} ${cy + 2} Q ${cx - 4} ${cy - 3} ${cx} ${cy - (r - 4)}`} fill={blade} opacity="0.85" />
      <path d={`M ${cx + (r - 4)} ${cy} Q ${cx + 2} ${cy + 5} ${cx - 2} ${cy} Q ${cx + 3} ${cy - 4} ${cx + (r - 4)} ${cy}`} fill={blade} opacity="0.75" />
      <path d={`M ${cx} ${cy + (r - 4)} Q ${cx - 5} ${cy + 2} ${cx} ${cy - 2} Q ${cx + 4} ${cy + 3} ${cx} ${cy + (r - 4)}`} fill={blade} opacity="0.7" />
      <path d={`M ${cx - (r - 4)} ${cy} Q ${cx - 2} ${cy - 5} ${cx + 2} ${cy} Q ${cx - 3} ${cy + 4} ${cx - (r - 4)} ${cy}`} fill={blade} opacity="0.6" />
    </g>
    <circle cx={cx} cy={cy} r="2.5" fill="#c9d1ff" opacity="0.8" />
  </g>
);

const RamStick = ({ x, y, color = '#4fd1c5' }) => (
  <g>
    <polygon points={`${x},${y} ${x + 34},${y} ${x + 40},${y - 6} ${x + 6},${y - 6}`} fill="#244659" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
    <polygon points={`${x},${y} ${x + 34},${y} ${x + 34},${y + 5} ${x},${y + 5}`} fill="#1a3341" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={x + 6 + i * 7} y={y - 4.7} width="4" height="2.5" fill={color} opacity="0.85" />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={`pin-${i}`} x={x + 3 + i * 6} y={y + 5} width="2" height="2" fill="#e7c66c" />
    ))}
  </g>
);

const GpuBars = ({ x, y, value, hot }) => {
  const bars = Array.from({ length: 8 }, (_, i) => (value >= (i + 1) * 12.5 ? 1 : 0));
  return (
    <g>
      {bars.map((on, i) => (
        <rect
          key={i}
          x={x}
          y={y - i * 5}
          width={on ? 20 : 8}
          height="3"
          rx="1"
          fill={on ? (hot ? COLORS.danger : i > 4 ? COLORS.warning : COLORS.primary) : '#2d3444'}
          opacity={on ? 0.95 : 0.45}
        />
      ))}
    </g>
  );
};

const RigDisplay = ({ inventory = [], heat = 0, isProcessing = false, expanded = false, toggleExpand }) => {
  const hasCase = inventory.includes('ATXCase');
  const hasCPU = inventory.includes('CPU');
  const hasCooling = inventory.includes('Cooling');
  const hasGPU = inventory.includes('GPU');
  const hasRGB = inventory.includes('RGB');

  const safeHeat = clamp(heat, 0, 100);
  const cpuLoad = hasCPU ? clamp(Math.round(safeHeat * 0.72 + (isProcessing ? 16 : 0)), 5, 100) : 0;
  const gpuLoad = hasGPU ? clamp(Math.round(safeHeat * 0.9 + (isProcessing ? 10 : 0)), 8, 100) : 0;

  const isHot = safeHeat >= 78;
  const isWarm = safeHeat >= 45;
  const panelHeight = expanded ? 300 : 96;

  const rgbGlow = hasRGB ? (isHot ? COLORS.danger : COLORS.primary) : null;
  const fanSpeed = isHot ? '0.18s' : isWarm ? '0.45s' : '1.1s';

  const caseTop = hasCase ? '#5d6574' : '#bfc4ca';
  const caseLeft = hasCase ? '#3a404c' : '#9da4ab';
  const caseFront = hasCase ? '#2a2f38' : '#8f969e';

  const trayTop = '#748096';
  const trayLeft = '#4b5568';
  const trayFront = '#364052';

  const moboTop = '#566d58';
  const moboLeft = '#405443';
  const moboFront = '#334435';

  const gpuTop = '#6f75b3';
  const gpuLeft = '#545a94';
  const gpuFront = '#454b7d';

  const psuTop = '#a7adb5';
  const psuLeft = '#8a9098';
  const psuFront = '#767d86';

  const ssdTop = '#d1d6dc';
  const ssdLeft = '#afb7c0';
  const ssdFront = '#99a3ad';

  const showTempColor = isHot ? COLORS.danger : isWarm ? COLORS.warning : COLORS.secondary;

  const statsLabel = useMemo(() => {
    if (isHot) return 'THERMAL ALERT';
    if (isWarm) return 'ELEVATED LOAD';
    return 'SYSTEM STABLE';
  }, [isHot, isWarm]);

  return (
    <div
      style={{
        width: 270,
        height: panelHeight,
        flexShrink: 0,
        border: `1px solid ${isHot ? `${COLORS.danger}80` : COLORS.border}`,
        background: 'linear-gradient(180deg, #10131a 0%, #0b0d12 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
        transition: 'height 0.28s ease, box-shadow 0.25s ease',
        cursor: expanded ? 'default' : 'pointer',
        boxShadow: isHot
          ? `0 0 18px ${COLORS.danger}25`
          : hasRGB
            ? `0 0 18px ${COLORS.primary}15`
            : '0 8px 24px rgba(0,0,0,0.28)',
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes iso-rig-spin { 100% { transform: rotate(360deg); } }
        @keyframes iso-rgb {
          0% { filter: drop-shadow(0 0 3px ${COLORS.danger}); }
          33% { filter: drop-shadow(0 0 3px ${COLORS.secondary}); }
          66% { filter: drop-shadow(0 0 3px ${COLORS.primary}); }
          100% { filter: drop-shadow(0 0 3px ${COLORS.danger}); }
        }
        @keyframes iso-heat {
          0%, 100% { opacity: 0.10; }
          50% { opacity: 0.28; }
        }
        @keyframes iso-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.35; }
        }
        .iso-rgb { animation: iso-rgb 4s linear infinite; }
        .iso-heat { animation: iso-heat 1s ease-in-out infinite; }
        .iso-blink { animation: iso-blink 0.8s linear infinite; }
      `}</style>

      {hasRGB && expanded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            pointerEvents: 'none',
            boxShadow: `inset 0 0 22px ${COLORS.primary}14`,
          }}
        />
      )}

      {isHot && expanded && (
        <div
          className="iso-heat"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 50% 55%, ${COLORS.danger}26, transparent 70%)`,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 4,
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
        <span style={{ color: showTempColor }}>{safeHeat}% TEMP</span>
        {hasGPU && expanded && <span style={{ color: COLORS.primary }}>{gpuLoad}% GPU</span>}
      </div>

      {isHot && expanded && (
        <div
          className="iso-blink"
          style={{
            position: 'absolute',
            top: 8,
            right: 42,
            zIndex: 4,
            fontSize: 9,
            letterSpacing: '1px',
            color: COLORS.danger,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 7px',
            borderRadius: 5,
            border: `1px solid ${COLORS.danger}55`,
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
          top: 6,
          right: 8,
          background: 'rgba(0,0,0,0.58)',
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
              background: '#151923',
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
                boxShadow: `0 0 10px ${isHot ? COLORS.danger : COLORS.primary}66`,
              }}
            />
          </div>
          <span style={{ fontSize: 8, color: COLORS.textDim, letterSpacing: '1px' }}>STATUS</span>
        </div>
      )}

      <svg width="100%" height="100%" viewBox="0 0 270 300" style={{ padding: expanded ? 8 : 10 }}>
        <IsoPanel x={44} y={82} w={150} h={128} d={16} top={caseTop} left={caseLeft} front={caseFront} />

        <polygon
          points="62,93 178,93 192,79 76,79"
          fill="rgba(255,255,255,0.08)"
          opacity={hasCase ? 0.8 : 0.35}
        />

        <IsoPanel x={66} y={100} w={106} h={92} d={12} top={trayTop} left={trayLeft} front={trayFront} />

        <IsoPanel x={76} y={108} w={68} h={60} d={10} top={moboTop} left={moboLeft} front={moboFront} />
        <rect x="87" y="122" width="14" height="20" rx="1.5" fill="#3a475e" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
        <rect x="91" y="126" width="6" height="12" fill="#89c4ff" opacity={hasCPU ? 0.9 : 0.35} />
        <rect x="80" y="150" width="24" height="5" fill="#2c3748" />
        <rect x="107" y="150" width="24" height="5" fill="#2c3748" />

        <RamStick x={113} y={120} color={hasRGB ? '#ab9df2' : '#66d0c3'} />
        <RamStick x={113} y={128} color={hasRGB ? '#ff77b7' : '#66d0c3'} />

        <IsoPanel x={74} y={176} w={30} h={18} d={7} top={ssdTop} left={ssdLeft} front={ssdFront} />
        <text x="80" y="186" fontSize="6" fill="#4c5865" style={{ letterSpacing: '1px' }}>SSD</text>

        <IsoPanel x={120} y={173} w={48} h={24} d={9} top={psuTop} left={psuLeft} front={psuFront} />
        <circle cx="140" cy="185" r="9" fill="#59616c" />
        <Fan cx={140} cy={185} r={9} ring="#7b8490" blade="#d7dce2" spinning duration={fanSpeed} />

        {hasCPU ? (
          <g>
            <IsoPanel x={87} y={121} w={16} h={16} d={5} top="#8aa4c8" left="#6881a4" front="#516985" />
            {hasCooling ? (
              <>
                <path d="M 96 129 C 118 112, 144 109, 170 116" fill="none" stroke={isHot ? COLORS.danger : COLORS.primary} strokeWidth="3" opacity="0.7" />
                <path d="M 94 135 C 122 149, 150 146, 176 130" fill="none" stroke={isHot ? COLORS.danger : COLORS.primary} strokeWidth="3" opacity="0.6" />

                <IsoPanel x={166} y={108} w={20} h={44} d={8} top="#d6dbe4" left="#b4bcc8" front="#9ea7b5" />
                <g className={hasRGB ? 'iso-rgb' : ''}>
                  <Fan cx={176} cy={120} r={9} ring={hasRGB ? rgbGlow : '#7c89a8'} blade={hasRGB ? '#dfe7ff' : '#95a6d6'} spinning duration={fanSpeed} glow={hasRGB ? rgbGlow : null} />
                  <Fan cx={176} cy={141} r={9} ring={hasRGB ? rgbGlow : '#7c89a8'} blade={hasRGB ? '#dfe7ff' : '#95a6d6'} spinning duration={fanSpeed} glow={hasRGB ? rgbGlow : null} />
                </g>
              </>
            ) : (
              <Fan
                cx={95}
                cy={130}
                r={12}
                ring={hasRGB ? rgbGlow : '#8190b5'}
                blade={hasRGB ? '#dce4ff' : '#a4b4db'}
                spinning
                duration={fanSpeed}
                glow={hasRGB ? rgbGlow : null}
              />
            )}
          </g>
        ) : (
          <rect x="88" y="122" width="14" height="14" fill="#4a5463" opacity="0.45" />
        )}

        {hasGPU ? (
          <g>
            <IsoPanel x={113} y={142} w={58} h={18} d={10} top={gpuTop} left={gpuLeft} front={gpuFront} />
            <rect x="120" y="147" width="10" height="3" fill="#f0d071" />
            <g className={hasRGB ? 'iso-rgb' : ''}>
              <Fan cx={135} cy={153} r={8.5} ring={hasRGB ? rgbGlow : '#7e86d8'} blade="#d8ddff" spinning duration={fanSpeed} glow={hasRGB ? rgbGlow : null} />
              <Fan cx={157} cy={153} r={8.5} ring={hasRGB ? rgbGlow : '#7e86d8'} blade="#d8ddff" spinning duration={fanSpeed} glow={hasRGB ? rgbGlow : null} />
            </g>
          </g>
        ) : (
          <polygon points="113,142 160,142 170,132 123,132" fill="#4a5060" opacity="0.35" />
        )}

        <polygon
          points="190,80 204,94 204,210 190,224"
          fill={hasCase ? '#20252d' : '#7f8791'}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1"
        />
        <Fan
          cx={196}
          cy={150}
          r={12}
          ring={hasRGB ? rgbGlow : '#8a94a8'}
          blade={hasRGB ? '#ebf0ff' : '#b8c2d8'}
          spinning
          duration={fanSpeed}
          glow={hasRGB ? rgbGlow : null}
        />

        <g opacity={expanded ? 1 : 0}>
          <text x="34" y="256" fill={COLORS.textDim} fontSize="9" style={{ letterSpacing: '1px' }}>
            {statsLabel}
          </text>

          <text x="35" y="272" fill={COLORS.textDim} fontSize="8" style={{ letterSpacing: '1px' }}>
            CPU
          </text>
          <rect x="62" y="265" width="74" height="8" rx="999" fill="#1b212d" stroke="#2a3342" strokeWidth="1" />
          <rect
            x="63"
            y="266"
            width={Math.max(4, cpuLoad * 0.72)}
            height="6"
            rx="999"
            fill={isHot ? COLORS.danger : COLORS.secondary}
          />

          <text x="146" y="272" fill={COLORS.textDim} fontSize="8" style={{ letterSpacing: '1px' }}>
            GPU
          </text>
          <GpuBars x={174} y={272} value={gpuLoad} hot={isHot} />

          <text x="208" y="272" fill={COLORS.textDim} fontSize="8" textAnchor="end">
            {gpuLoad}%
          </text>
        </g>
      </svg>
    </div>
  );
};

export default RigDisplay;
