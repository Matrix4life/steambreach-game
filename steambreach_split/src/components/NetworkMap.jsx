import React, { useState, useRef, useEffect, useMemo } from 'react';
import { COLORS } from '../constants/gameConstants';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function NetworkMap({ 
  world = {}, botnet = [], proxies = [], looted = [], 
  targetIP, trace = 0, inventory = [], selectNodeFromMap, 
  expanded, toggleExpand, currentRegion = 'UNKNOWN' 
}) {
  const svgRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // --- CAMERA & INTERACTION STATE ---
  const [cam, setCam] = useState({ x: 0, y: 0, z: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    if (!expanded) setCam({ x: 0, y: 0, z: 1 });
  }, [expanded]);

  // Smoother Zoom Math
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const handleNativeWheel = (e) => {
      if (!expanded) return;
      e.preventDefault();
      
      const zoomFactor = Math.exp(-e.deltaY * 0.002);
      
      setCam(prev => {
        const newZ = clamp(prev.z * zoomFactor, 0.2, 5); 
        
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const scaleRatio = newZ / prev.z;
        
        return {
          x: mouseX - (mouseX - prev.x) * scaleRatio,
          y: mouseY - (mouseY - prev.y) * scaleRatio,
          z: newZ
        };
      });
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [expanded]);

  // --- MOUSE HANDLERS FOR PANNING ---
  const handleMouseDown = (e) => {
    if (!expanded) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX - cam.x, y: e.clientY - cam.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !expanded) return;
    setHasDragged(true);
    setCam(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = (e, ip) => {
    e.stopPropagation();
    if (hasDragged || !expanded) return;
    selectNodeFromMap(ip);
  };

  // --- PARALLAX ASSETS GENERATION ---
  const dustParticles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      cx: `${Math.random() * 200 - 50}%`,
      cy: `${Math.random() * 200 - 50}%`,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    }));
  }, []);

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -100; i <= 200; i += 10) {
      lines.push(<line key={`v${i}`} x1={`${i}%`} y1="-100%" x2={`${i}%`} y2="200%" stroke={COLORS.primary} strokeWidth="0.5" opacity="0.05" />);
      lines.push(<line key={`h${i}`} x1="-100%" y1={`${i}%`} x2="200%" y2={`${i}%`} stroke={COLORS.primary} strokeWidth="0.5" opacity="0.05" />);
    }
    return lines;
  }, []);

  // --- DATA PREP ---
  const proxyChain = proxies.filter(ip => world[ip] && !world[ip].isHidden);
  const mapHeight = expanded ? '350px' : '80px';
  const nodeCount = Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden).length;

  return (
    <div 
      style={{
        flex: 1, height: mapHeight,
        border: `1px solid ${trace > 75 ? COLORS.danger + '80' : COLORS.border}`,
        position: 'relative',
        background: COLORS.bgDark,
        overflow: 'hidden', borderRadius: '3px',
        transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: expanded ? (isDragging ? 'grabbing' : 'crosshair') : 'pointer',
        boxShadow: trace > 75 ? `0 0 12px ${COLORS.danger}20, inset 0 0 20px ${COLORS.danger}08` : `inset 0 0 30px rgba(0,0,0,0.5)`,
        userSelect: 'none'
      }}
      onClick={!expanded ? toggleExpand : undefined}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <style>{`
        @keyframes stream { to { stroke-dashoffset: -40; } }
        @keyframes streamFast { to { stroke-dashoffset: -40; } }
        @keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* New idle pulse that DOES NOT move the node physically */
        @keyframes nodeIdlePulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
        }
        
        /* High-speed data packets */
        .data-stream { stroke-dasharray: 4, 12; animation: stream 1s linear infinite; }
        .proxy-stream { stroke-dasharray: 6, 8; animation: streamFast 0.8s linear infinite; }
        
        /* Radar cone rotating in the background */
        .radar-cone {
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent 70%, ${COLORS.primary}15 95%, ${COLORS.primary}40 100%);
          animation: radarSweep 8s linear infinite;
          pointer-events: none; z-index: 1;
        }

        .map-vignette { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at center, transparent 30%, ${COLORS.bgDark} 100%); pointer-events: none; z-index: 10; }
      `}</style>

      {expanded && <div className="radar-cone" />}
      <div className="map-vignette" />

      <svg ref={svgRef} width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}>
        
        {/* PARALLAX LAYER 1: Deep Space Dust */}
        <g style={{ transform: `translate(${cam.x * 0.2}px, ${cam.y * 0.2}px) scale(${cam.z * 0.6})`, transformOrigin: '0 0' }}>
          {dustParticles.map(p => (
             <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill={COLORS.primary} opacity={p.opacity} />
          ))}
        </g>

        {/* PARALLAX LAYER 2: The Grid */}
        <g style={{ transform: `translate(${cam.x * 0.5}px, ${cam.y * 0.5}px) scale(${cam.z * 0.8})`, transformOrigin: '0 0' }}>
          {gridLines}
        </g>

        {/* PARALLAX LAYER 3: The Nodes & Data Streams (Foreground) */}
        <g style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 0.05s linear' }}>
          
          {expanded && Array.from({ length: 4 }).map((_, i) => (
            <line key={`base-${i}`} x1="50%" y1={expanded ? "90%" : "85%"} x2={`${20 + i*20}%`} y2="200%" stroke={COLORS.primary} strokeWidth="1" opacity="0.1" strokeDasharray="10 10" />
          ))}

          {/* Lines connecting nodes */}
          {Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden && !proxies.includes(k)).map(ip => {
            const node = world[ip];
            const startX = node.parentIP && world[node.parentIP] ? world[node.parentIP].x : "50%";
            const startY = node.parentIP && world[node.parentIP] ? world[node.parentIP].y : (expanded ? "90%" : "85%");
            const isActive = targetIP === ip;
            const isInfected = botnet.includes(ip);
            let lineColor = `${COLORS.border}60`;
            if (isActive) lineColor = COLORS.primary;
            else if (isInfected) lineColor = `${COLORS.infected}80`;
            
            return (
              <g key={`ln-${ip}`}>
                {/* Background solid line */}
                <line x1={startX} y1={startY} x2={node.x} y2={node.y} stroke={lineColor} strokeWidth="0.5" opacity="0.3" />
                {/* Foreground animated dashed line (Data Packets) */}
                {(isActive || isInfected) && (
                  <line x1={startX} y1={startY} x2={node.x} y2={node.y} stroke={lineColor} strokeWidth={isActive ? 1.5 : 1} className="data-stream" />
                )}
              </g>
            );
          })}

          {/* Proxy Tunnels */}
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
                <g key={`pc-${i}`}>
                   <line x1={chainPoints[i].x} y1={chainPoints[i].y} x2={chainPoints[i + 1].x} y2={chainPoints[i + 1].y} stroke={COLORS.proxy} strokeWidth="2" opacity="0.2" />
                   <line x1={chainPoints[i].x} y1={chainPoints[i].y} x2={chainPoints[i + 1].x} y2={chainPoints[i + 1].y} stroke={COLORS.proxy} strokeWidth="2" className="proxy-stream" style={{ filter: `drop-shadow(0 0 4px ${COLORS.proxy})` }} />
                </g>
              );
            }
            return segments;
          })()}

          <circle cx="50%" cy={expanded ? "90%" : "85%"} r={proxyChain.length > 0 ? 8 : 6} fill="#ffffff" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' }} />
          {expanded && (
             <g transform="translate(0, 18)">
                <text x="50%" y="90%" fill="#ffffff" fontSize="9px" textAnchor="middle" fontFamily="inherit" opacity="0.9" style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
                  KALI-GATEWAY
                </text>
                {proxyChain.length > 0 && (
                  <text x="50%" y="90%" dy="12" fill={COLORS.proxy} fontSize="7px" textAnchor="middle" fontFamily="inherit" opacity="0.9">
                    [{proxyChain.length} HOPS ACTIVE]
                  </text>
                )}
             </g>
          )}

          {Object.keys(world).filter(k => k !== 'local' && !world[k].isHidden).map(ip => {
            const node = world[ip];
            const isProxy = proxies.includes(ip);
            let nodeColor = node.sec === 'high' ? COLORS.danger : COLORS.mapNode;
            if (isProxy) nodeColor = COLORS.proxy;
            else if (botnet.includes(ip)) nodeColor = COLORS.infected;
            else if (looted.includes(ip)) nodeColor = COLORS.looted;
            
            const isActive = targetIP === ip;
            const isHovered = hoveredNode === ip;
            
            // Base radius
            let r = expanded ? (isProxy ? 6 : 5) : (isProxy ? 4 : 3);
            
            return (
              <g key={`nd-${ip}`} 
                style={{ cursor: 'crosshair', pointerEvents: 'all' }} 
                onClick={(e) => handleNodeClick(e, ip)} 
                onMouseEnter={() => expanded && setHoveredNode(ip)} 
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* SVG Coordinate Anchor wrapper so we can scale from the exact center */}
                <svg x={node.x} y={node.y} style={{ overflow: 'visible' }}>
                  
                  {/* The scale transform handles the Hover Magnetism. No translateY = no dodging the mouse! */}
                  <g 
                    style={{ 
                      color: nodeColor,
                      transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      transform: isHovered ? 'scale(1.8)' : 'scale(1)',
                      animation: !isHovered && !isActive ? 'nodeIdlePulse 4s infinite alternate' : 'none'
                    }}
                  >
                    
                    {/* Active Target Ring */}
                    {isActive && expanded && <circle cx="0" cy="0" r="12" fill="none" stroke={COLORS.primary} strokeWidth="1" className="data-stream" />}
                    
                    {/* Proxy Shield Ring */}
                    {isProxy && <circle cx="0" cy="0" r={r + 4} fill="none" stroke={COLORS.proxy} strokeWidth="1.5" opacity="0.4" className="proxy-stream" />}
                    
                    {/* The core node */}
                    <circle cx="0" cy="0" r={r} fill={nodeColor} />
                    
                    {/* Node center detail */}
                    {expanded && r >= 5 && <circle cx="0" cy="0" r={r/2} fill="#111" opacity="0.8" />}
                    
                    {/* Hover text label */}
                    {isHovered && expanded && (
                      <text x="0" y="-12" fill="#fff" fontSize="6px" textAnchor="middle" fontFamily="inherit" style={{ fontWeight: 'bold', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }}>
                         {node.sec?.toUpperCase()} NODE
                      </text>
                    )}
                  </g>
                </svg>
              </g>
            );
          })}
        </g>
      </svg>

      {!expanded && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', zIndex: 12, pointerEvents: 'none' }}>
          <span style={{ fontSize: '9px', color: COLORS.textDim, letterSpacing: '1px' }}>
            SUBNET: <span style={{ color: COLORS.primary }}>{currentRegion.toUpperCase()}</span> ▸ <span style={{ color: COLORS.primary }}>{nodeCount}</span> NODES
            {proxyChain.length > 0 && <> | <span style={{ color: COLORS.proxy }}>{proxyChain.length}</span> HOPS</>}
            {botnet.length > 0 && <> | <span style={{ color: COLORS.infected }}>{botnet.length}</span> C2</>}
          </span>
          <span style={{ fontSize: '8px', color: COLORS.textDim, opacity: 0.6 }}>CLICK TO EXPAND</span>
        </div>
      )}

      <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} style={{
        position: 'absolute', top: '6px', right: '8px', background: 'rgba(0,0,0,0.8)', border: `1px solid ${COLORS.borderActive}`,
        color: COLORS.textDim, fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', zIndex: 15, padding: '4px 8px', borderRadius: '3px', fontWeight: 'bold', letterSpacing: '1px'
      }}>
        {expanded ? 'X CLOSE MAP' : '▼ OPEN MAP'}
      </button>

      {expanded && hoveredNode && world[hoveredNode] && (
        <div style={{
          position: 'absolute', top: '16px', left: '16px',
          background: 'rgba(8,12,18,0.95)', border: `1px solid ${COLORS.primary}60`,
          padding: '12px 14px', fontSize: '10px', pointerEvents: 'none',
          color: COLORS.text, minWidth: '180px', borderRadius: '4px',
          zIndex: 14, backdropFilter: 'blur(6px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 15px ${COLORS.primary}20`,
        }}>
          <div style={{ color: COLORS.primary, fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', letterSpacing: '1px', borderBottom: `1px solid ${COLORS.borderActive}`, paddingBottom: '4px' }}>
            {world[hoveredNode].name || world[hoveredNode].org?.orgName || 'Unknown'}
          </div>
          <div style={{ margin: '3px 0' }}><span style={{ color: COLORS.textDim }}>IP:</span> <span style={{ color: COLORS.ip }}>{hoveredNode}</span></div>
          <div style={{ margin: '3px 0' }}><span style={{ color: COLORS.textDim }}>SEC:</span> {inventory.includes('Scanner') ? world[hoveredNode].sec?.toUpperCase() : '[ENCRYPTED]'}</div>
          {world[hoveredNode].org && <div style={{ margin: '3px 0' }}><span style={{ color: COLORS.textDim }}>TYPE:</span> {world[hoveredNode].org.type?.toUpperCase()}</div>}
          
          {botnet.includes(hoveredNode) && <div style={{ color: COLORS.bgDark, background: COLORS.infected, padding: '2px 4px', borderRadius: '2px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold' }}>SLIVER C2 ACTIVE</div>}
          {proxies.includes(hoveredNode) && <div style={{ color: COLORS.bgDark, background: COLORS.proxy, padding: '2px 4px', borderRadius: '2px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold' }}>PROXY TUNNEL ACTIVE</div>}
        </div>
      )}
      
      {expanded && (
         <div style={{ position: 'absolute', bottom: '12px', right: '12px', color: COLORS.textDim, fontSize: '9px', background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: '4px', letterSpacing: '1px', zIndex: 12 }}>
            SCROLL TO ZOOM • DRAG TO PAN
         </div>
      )}
    </div>
  );
}
