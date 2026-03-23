import React from 'react';
import { COLORS } from '../constants/gameConstants';

const RigDisplay = ({ inventory, heat, isProcessing, expanded, toggleExpand }) => {
  const hasCase = inventory.includes('ATXCase');
  const hasCPU = inventory.includes('CPU');
  const hasCooling = inventory.includes('Cooling');
  const hasGPU = inventory.includes('GPU');
  const hasRGB = inventory.includes('RGB');

  const caseOuter = hasCase ? '#111118' : '#e0dcd3';
  const caseInner = hasCase ? '#0a0a0f' : '#b5b2a8';
  const moboColor = hasCase ? '#1e1e2e' : '#4a7550';
  const accent = hasCase ? COLORS.primaryDim : '#757269';
  const psuColor = hasCase ? '#2d2a2e' : '#8c887d';
  
  const isHot = heat > 75;
  const isWarm = heat > 40;
  const liquidColor = isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.primary);
  const fanDur = isHot ? '0.1s' : (isWarm ? '0.3s' : '1.5s');
  const cpuOpacity = isProcessing ? (Math.random() > 0.5 ? 1 : 0.4) : 0.8;

  const height = expanded ? '240px' : '80px';

  return (
    <div style={{
      width: '220px', height: height, flexShrink: 0,
      border: `1px solid ${COLORS.border}`, background: COLORS.bgDark,
      position: 'relative', overflow: 'hidden', borderRadius: '3px',
      transition: 'height 0.3s ease', cursor: expanded ? 'default' : 'pointer',
      boxShadow: hasRGB ? `0 0 15px ${COLORS.primary}20` : 'none'
    }} onClick={!expanded ? toggleExpand : undefined}>
      
      <style>{`
        @keyframes fan-spin { 100% { transform: rotate(360deg); } }
        @keyframes flow { to { stroke-dashoffset: -20; } }
        @keyframes rgb-cycle {
          0% { stroke: ${COLORS.danger}; box-shadow: inset 0 0 20px ${COLORS.danger}40; }
          33% { stroke: ${COLORS.secondary}; box-shadow: inset 0 0 20px ${COLORS.secondary}40; }
          66% { stroke: ${COLORS.primary}; box-shadow: inset 0 0 20px ${COLORS.primary}40; }
          100% { stroke: ${COLORS.danger}; box-shadow: inset 0 0 20px ${COLORS.danger}40; }
        }
        @keyframes heat-pulse { 0%, 100% { fill: ${COLORS.danger}10; } 50% { fill: ${COLORS.danger}30; } }
        .spin { transform-origin: center; animation: fan-spin ${fanDur} linear infinite; }
        .fast-spin { transform-origin: center; animation: fan-spin calc(${fanDur} * 0.7) linear infinite; }
        .flow { stroke-dasharray: 8, 4; animation: flow 0.5s linear infinite; }
        .rgb-anim { animation: rgb-cycle 4s linear infinite; }
      `}</style>

      {hasRGB && expanded && <div style={{ position: 'absolute', top:0, left:0, right:0, bottom:0, pointerEvents: 'none', animation: 'rgb-cycle 4s linear infinite' }} />}
      {isHot && expanded && <div style={{ position: 'absolute', top:0, left:0, right:0, bottom:0, background: `${COLORS.danger}20`, pointerEvents: 'none', animation: 'pulse 1s infinite' }} />}

      <svg width="100%" height="100%" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" style={{ padding: '10px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}>
        <path d="M 5 5 L 195 5 L 195 235 L 5 235 Z" fill={caseOuter} stroke={COLORS.border} strokeWidth="2" />
        <rect x="15" y="15" width="170" height="205" fill={caseInner} stroke={hasRGB ? 'transparent' : COLORS.borderActive} strokeWidth="2" className={hasRGB ? 'rgb-anim' : ''} />
        <rect x="25" y="25" width="110" height="135" rx="2" fill={moboColor} stroke="#000" strokeWidth="1" />
        
        <path d="M 30 30 L 45 30 M 30 35 L 40 35 M 120 145 L 120 155 M 125 145 L 125 155" stroke={accent} strokeWidth="1" opacity="0.5" />
        <rect x="25" y="25" width="30" height="15" fill="#111" /> 
        
        <rect x="110" y="35" width="20" height="60" fill="#111" />
        <rect x="112" y="37" width="4" height="56" fill={hasCase ? COLORS.textDim : '#222'} />
        <rect x="118" y="37" width="4" height="56" fill={hasCase ? COLORS.textDim : '#222'} />
        <rect x="124" y="37" width="4" height="56" fill={hasCase ? COLORS.textDim : '#222'} />

        <rect x="15" y="170" width="80" height="50" fill={psuColor} stroke="#111" strokeWidth="1.5" />
        <rect x="20" y="175" width="40" height="40" rx="20" fill="#111" /> 
        <circle cx="40" cy="195" r="16" fill="none" stroke="#333" strokeWidth="2" />
        <path d="M 40 179 L 40 211 M 24 195 L 56 195" stroke="#333" strokeWidth="2" />

        {hasCase && (
          <path d="M 95 185 Q 120 185 130 155" fill="none" stroke="#222" strokeWidth="6" />
        )}

        <g transform="translate(50, 45)">
          {hasCPU ? (
            <rect x="0" y="0" width="40" height="40" fill="#2d2a2e" stroke={COLORS.primary} strokeWidth="1" />
          ) : (
            <rect x="5" y="5" width="30" height="30" fill="#333" />
          )}
          {hasCPU && (
            <rect x="10" y="10" width="20" height="20" fill={COLORS.primary} opacity={cpuOpacity} style={{ transition: 'opacity 0.1s' }} />
          )}

          {hasCooling ? (
            <rect x="5" y="5" width="30" height="30" rx="15" fill="#111" stroke={liquidColor} strokeWidth="2" />
          ) : (
             <g>
               <rect x="0" y="0" width="40" height="40" fill="none" stroke="#555" strokeWidth="2" />
               <circle cx="20" cy="20" r="16" fill="#222" />
               <g transform="translate(20, 20)">
                 <path d="M 0 -12 Q 5 0 0 12 Q -5 0 0 -12" fill={accent} className="spin" />
                 <path d="M -12 0 Q 0 5 12 0 Q 0 -5 -12 0" fill={accent} className="spin" />
               </g>
             </g>
          )}
        </g>

        {hasCooling && (
          <g>
            <path d="M 80 60 Q 110 50 140 40 L 170 40" fill="none" stroke={liquidColor} strokeWidth="6" opacity="0.3" />
            <path d="M 80 60 Q 110 50 140 40 L 170 40" fill="none" stroke={liquidColor} strokeWidth="2" className="flow" />
            <path d="M 80 70 Q 110 80 140 90 L 170 90" fill="none" stroke={liquidColor} strokeWidth="6" opacity="0.3" />
            <path d="M 80 70 Q 110 80 140 90 L 170 90" fill="none" stroke={liquidColor} strokeWidth="2" className="flow" />
            <rect x="165" y="20" width="20" height="140" fill="#111" stroke="#222" strokeWidth="2" />
            
            <g transform="translate(175, 40)">
              <circle cx="0" cy="0" r="8" fill="#000" />
              <path d="M 0 -6 Q 3 0 0 6 Q -3 0 0 -6" fill={liquidColor} className="spin" />
              <path d="M -6 0 Q 0 3 6 0 Q 0 -3 -6 0" fill={liquidColor} className="spin" />
            </g>
            <g transform="translate(175, 90)">
              <circle cx="0" cy="0" r="8" fill="#000" />
              <path d="M 0 -6 Q 3 0 0 6 Q -3 0 0 -6" fill={liquidColor} className="spin" />
              <path d="M -6 0 Q 0 3 6 0 Q 0 -3 -6 0" fill={liquidColor} className="spin" />
            </g>
            <g transform="translate(175, 140)">
              <circle cx="0" cy="0" r="8" fill="#000" />
              <path d="M 0 -6 Q 3 0 0 6 Q -3 0 0 -6" fill={liquidColor} className="spin" />
              <path d="M -6 0 Q 0 3 6 0 Q 0 -3 -6 0" fill={liquidColor} className="spin" />
            </g>
          </g>
        )}

        {hasGPU ? (
          <g transform="translate(20, 110)">
            <rect x="0" y="0" width="105" height="35" rx="3" fill="#1a1a24" stroke={COLORS.primary} strokeWidth="1" />
            <rect x="10" y="5" width="20" height="2" fill={COLORS.warning} /> 
            
            <circle cx="30" cy="18" r="12" fill="#0a0a0f" />
            <g transform="translate(30, 18)">
              <path d="M 0 -10 Q 4 0 0 10 Q -4 0 0 -10" fill={COLORS.primary} className="fast-spin" />
              <path d="M -10 0 Q 0 4 10 0 Q 0 -4 -10 0" fill={COLORS.primary} className="fast-spin" />
            </g>

            <circle cx="75" cy="18" r="12" fill="#0a0a0f" />
            <g transform="translate(75, 18)">
              <path d="M 0 -10 Q 4 0 0 10 Q -4 0 0 -10" fill={COLORS.primary} className="fast-spin" />
              <path d="M -10 0 Q 0 4 10 0 Q 0 -4 -10 0" fill={COLORS.primary} className="fast-spin" />
            </g>
            {hasRGB && <rect x="0" y="0" width="105" height="35" rx="3" fill="none" stroke={COLORS.danger} strokeWidth="1.5" className="rgb-anim" />}
          </g>
        ) : (
          <g transform="translate(25, 110)">
             <rect x="0" y="0" width="60" height="4" fill="#111" />
             <rect x="0" y="15" width="60" height="4" fill="#111" />
          </g>
        )}

        {hasRGB && (
          <rect x="23" y="23" width="114" height="139" rx="3" fill="none" stroke={COLORS.primary} strokeWidth="2" className="rgb-anim" style={{ mixBlendMode: 'screen' }} />
        )}
      </svg>

      <div style={{ position: 'absolute', top: 4, left: 6, fontSize: '8px', color: COLORS.textDim, pointerEvents: 'none', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '2px' }}>
        RIG ▸ <span style={{ color: isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.secondary) }}>{heat}% TEMP</span>
      </div>
      
      {!expanded && (
         <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} style={{ position: 'absolute', top: '3px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: COLORS.textDim, fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', zIndex: 5, padding: '2px 4px', borderRadius: '2px' }}>▼</button>
      )}
      {expanded && (
         <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} style={{ position: 'absolute', top: '3px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: COLORS.textDim, fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', zIndex: 5, padding: '2px 4px', borderRadius: '2px' }}>▲ MIN</button>
      )}
    </div>
  );
};

export default RigDisplay;
