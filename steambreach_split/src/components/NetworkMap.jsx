import React, { useState } from 'react';
import { COLORS } from '../constants/gameConstants';

const NetworkMap = ({ world, botnet, proxies, looted, targetIP, trace, inventory, selectNodeFromMap, expanded, toggleExpand, currentRegion }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const proxyChain = proxies.filter(ip => world[ip] && !world[ip].isHidden);
  const mapHeight = expanded ? '240px' : '80px';
  const nodeCount = Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden).length;

  return (
    <div 
      style={{
        flex: 1, height: mapHeight,
        border: `1px solid ${trace > 75 ? COLORS.danger + '80' : COLORS.border}`,
        position: 'relative',
        background: COLORS.bgDark,
        overflow: 'hidden', borderRadius: '3px',
        transition: 'height 0.3s ease',
        cursor: expanded ? 'default' : 'pointer',
        boxShadow: trace > 75 ? `0 0 12px ${COLORS.danger}20, inset 0 0 20px ${COLORS.danger}08` : `inset 0 0 30px rgba(0,0,0,0.5)`,
      }}
      onClick={!expanded ? toggleExpand : undefined}
    >
      <style>{`
        @keyframes stream { to { stroke-dashoffset: -20; } }
        @keyframes streamFast { to { stroke-dashoffset: -30; } }
        @keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes mapPulse { 0% { opacity: 0.03; } 50% { opacity: 0.06; } 100% { opacity: 0.03; } }
        .data-stream { stroke-dasharray: 5, 5; animation: stream 2s linear infinite; }
        .proxy-stream { stroke-dasharray: 8, 4; animation: streamFast 1.8s linear infinite; }
        .pulse-node { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { r: 5; opacity: 1; } 50% { r: 8; opacity: 0.7; } }
        .glow-proxy { filter: drop-shadow(0 0 4px ${COLORS.proxy}); }
        .map-scanline { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, ${COLORS.primary}15, transparent); animation: scanline 4s linear infinite; pointer-events: none; z-index: 2; }
        .map-vignette { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at center, transparent 50%, ${COLORS.bgDark} 100%); pointer-events: none; z-index: 1; }
        .map-grid-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 50% 90%, ${COLORS.primary}08 0%, transparent 60%); pointer-events: none; animation: mapPulse 3s ease infinite; }
      `}</style>

      <div className="map-scanline" />
      <div className="map-vignette" />
      <div className="map-grid-glow" />

      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        {expanded && Array.from({ length: 20 }).map((_, i) => (
          <line key={`gv-${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke={COLORS.primary} strokeWidth="0.3" opacity="0.08" />
        ))}
        {expanded && Array.from({ length: 10 }).map((_, i) => (
          <line key={`gh-${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke={COLORS.primary} strokeWidth="0.3" opacity="0.08" />
        ))}

        {Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden && !proxies.includes(k)).map(ip => {
          const node = world[ip];
          const startX = node.parentIP && world[node.parentIP] ? world[node.parentIP].x : "50%";
          const startY = node.parentIP && world[node.parentIP] ? world[node.parentIP].y : expanded ? "90%" : "85%";
          const isActive = targetIP === ip;
          const isInfected = botnet.includes(ip);
          let lineColor = `${COLORS.border}60`;
          if (isActive) lineColor = COLORS.primary;
          else if (isInfected) lineColor = `${COLORS.infected}80`;
          return (
            <line key={`ln-${ip}`} x1={startX} y1={startY} x2={node.x} y2={node.y}
              stroke={lineColor} strokeWidth={isActive ? 1.5 : 0.5}
              className={isActive ? "data-stream" : ""} />
          );
        })}

        {proxyChain.length > 0 && (() => {
          const gy = expanded ? "90%" : "85%";
          const chainPoints = [
            { x: "50%", y: gy },
            ...proxyChain.map(ip => ({ x: world[ip].x, y: world[ip].y })),
            { x: "50%", y: gy }
          ];
          const segments = [];
          for (let i = 0; i < chainPoints.length - 1; i++) {
            segments.push(
              <line key={`pc-${i}`} x1={chainPoints[i].x} y1={chainPoints[i].y} x2={chainPoints[i + 1].x} y2={chainPoints[i + 1].y} stroke={COLORS.proxy} strokeWidth="2" className="proxy-stream glow-proxy" opacity="0.85" />
            );
          }
          const labels = expanded ? proxyChain.map((ip, i) => (
            <text key={`pl-${i}`} x={world[ip].x} y={world[ip].y} dy="-12" fill={COLORS.proxy} fontSize="7px" textAnchor="middle" fontFamily="inherit" style={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>HOP {i + 1}</text>
          )) : [];
          return [...segments, ...labels];
        })()}

        <circle cx="50%" cy={expanded ? "90%" : "85%"} r={proxyChain.length > 0 ? 6 : 5} fill="#ffffff" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }} />
        {expanded && <text x="50%" y="83%" fill="#ffffff" fontSize="8px" textAnchor="middle" fontFamily="inherit" opacity="0.8">KALI-GATEWAY {proxyChain.length > 0 ? `[${proxyChain.length} HOPS]` : ''}</text>}

        {Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden).map(ip => {
          const node = world[ip];
          const isProxy = proxies.includes(ip);
          let nodeColor = node.sec === 'high' ? COLORS.danger : COLORS.mapNode;
          if (isProxy) nodeColor = COLORS.proxy;
          else if (botnet.includes(ip)) nodeColor = COLORS.infected;
          else if (looted.includes(ip)) nodeColor = COLORS.looted;
          const isActive = targetIP === ip;
          const r = expanded ? (isProxy ? 5 : 4) : (isProxy ? 4 : 3);
          return (
            <g key={`nd-${ip}`} style={{ cursor: 'crosshair' }} onClick={(e) => { e.stopPropagation(); if (expanded) selectNodeFromMap(ip); }} onMouseEnter={() => expanded && setHoveredNode(ip)} onMouseLeave={() => setHoveredNode(null)}>
              {isActive && expanded && <circle cx={node.x} cy={node.y} r="11" fill="none" stroke={COLORS.primary} strokeWidth="0.8" className="data-stream" />}
              {isProxy && <circle cx={node.x} cy={node.y} r={r + 3} fill="none" stroke={COLORS.proxy} strokeWidth="0.8" opacity="0.35" className="proxy-stream" />}
              <circle cx={node.x} cy={node.y} r={r} fill={nodeColor} className={isActive ? "pulse-node" : (isProxy ? "glow-proxy" : "")} style={{ filter: `drop-shadow(0 0 3px ${nodeColor}60)` }} />
            </g>
          );
        })}
      </svg>

      {!expanded && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', zIndex: 3, pointerEvents: 'none' }}>
          <span style={{ fontSize: '9px', color: COLORS.textDim, letterSpacing: '1px' }}>
            SUBNET: <span style={{ color: COLORS.primary }}>{currentRegion.toUpperCase()}</span> ▸ <span style={{ color: COLORS.primary }}>{nodeCount}</span> NODES
            {proxyChain.length > 0 && <> | <span style={{ color: COLORS.proxy }}>{proxyChain.length}</span> HOPS</>}
            {botnet.length > 0 && <> | <span style={{ color: COLORS.infected }}>{botnet.length}</span> C2</>}
          </span>
          <span style={{ fontSize: '8px', color: COLORS.textDim, opacity: 0.6 }}>CLICK TO EXPAND</span>
        </div>
      )}

      {expanded && proxyChain.length > 0 && (
        <div style={{ position: 'absolute', bottom: '4px', left: '8px', background: 'rgba(10,10,15,0.9)', border: `1px solid ${COLORS.proxy}30`, padding: '3px 8px', fontSize: '8px', color: COLORS.proxy, borderRadius: '2px', letterSpacing: '0.5px', zIndex: 3 }}>
          CIRCUIT: GW → {proxyChain.map((ip, i) => <span key={ip}><span style={{ color: COLORS.ip }}>{world[ip]?.org?.orgName || ip}</span>{i < proxyChain.length - 1 ? ' → ' : ''}</span>)} → GW
        </div>
      )}

      {expanded && hoveredNode && world[hoveredNode] && (
        <div style={{ position: 'absolute', top: '6px', left: '8px', background: 'rgba(8,8,12,0.95)', border: `1px solid ${COLORS.primary}60`, padding: '8px 10px', fontSize: '10px', pointerEvents: 'none', color: COLORS.text, minWidth: '180px', borderRadius: '3px', zIndex: 4, backdropFilter: 'blur(4px)', boxShadow: `0 0 10px ${COLORS.primary}15` }}>
          <div style={{ color: COLORS.primary, fontWeight: 'bold', marginBottom: '3px', fontSize: '11px' }}>{world[hoveredNode].name || world[hoveredNode].org?.orgName || 'Unknown'}</div>
          <div><span style={{ color: COLORS.textDim }}>IP:</span> <span style={{ color: COLORS.ip }}>{hoveredNode}</span></div>
          <div><span style={{ color: COLORS.textDim }}>SEC:</span> {inventory.includes('Scanner') ? world[hoveredNode].sec?.toUpperCase() : '[ENCRYPTED]'}</div>
          {world[hoveredNode].org && <div><span style={{ color: COLORS.textDim }}>TYPE:</span> {world[hoveredNode].org.type?.toUpperCase()}</div>}
        </div>
      )}

      <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} style={{ position: 'absolute', top: '3px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: COLORS.textDim, fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', zIndex: 5, padding: '2px 4px', borderRadius: '2px' }}>
        {expanded ? '▲ MINIMIZE' : '▼'}
      </button>
    </div>
  );
};

export default NetworkMap;
