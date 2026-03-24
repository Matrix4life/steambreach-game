// IMPROVED RigDisplay Component - Replace the old one with this
// This version has much better visuals for the gaming PC case

const RigDisplay = ({ inventory, heat, isProcessing, expanded, toggleExpand }) => {
  const hasCase = inventory.includes('ATXCase');
  const hasCPU = inventory.includes('CPU');
  const hasCooling = inventory.includes('Cooling');
  const hasGPU = inventory.includes('GPU');
  const hasRGB = inventory.includes('RGB');

  const isHot = heat > 75;
  const isWarm = heat > 40;
  const liquidColor = isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.primary);
  const fanDur = isHot ? '0.05s' : (isWarm ? '0.25s' : '1.2s');
  const cpuPulse = isProcessing ? 0.6 : 0.85;

  const height = expanded ? '260px' : '90px';

  return (
    <div style={{
      width: '240px', height, flexShrink: 0,
      border: `1px solid ${COLORS.border}`, background: COLORS.bgDark,
      position: 'relative', overflow: 'hidden', borderRadius: '4px',
      transition: 'height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: expanded ? 'default' : 'pointer',
      boxShadow: hasRGB 
        ? `0 0 20px ${COLORS.primary}30, inset 0 0 40px rgba(0,0,0,0.8)` 
        : `0 0 8px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.8)`
    }} onClick={!expanded ? toggleExpand : undefined}>
      
      <style>{`
        @keyframes fan-spin { 100% { transform: rotate(360deg); } }
        @keyframes pump { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes flow { 0% { stroke-dashoffset: 0; } to { stroke-dashoffset: -16; } }
        @keyframes rgb-glow {
          0% { filter: drop-shadow(0 0 6px ${COLORS.danger}) drop-shadow(0 0 12px ${COLORS.danger}60); }
          33% { filter: drop-shadow(0 0 6px ${COLORS.secondary}) drop-shadow(0 0 12px ${COLORS.secondary}60); }
          66% { filter: drop-shadow(0 0 6px ${COLORS.primary}) drop-shadow(0 0 12px ${COLORS.primary}60); }
          100% { filter: drop-shadow(0 0 6px ${COLORS.danger}) drop-shadow(0 0 12px ${COLORS.danger}60); }
        }
        .spin { transform-origin: center; animation: fan-spin ${fanDur} linear infinite; }
        .pump-anim { animation: pump 2s ease-in-out infinite; }
        .flow { stroke-dasharray: 8, 8; animation: flow 1.5s linear infinite; }
        .rgb-glow { animation: rgb-glow 4s ease-in-out infinite; }
      `}</style>

      {/* Background glow for RGB */}
      {hasRGB && expanded && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '180%', height: '180%', borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}15 0%, transparent 70%)`,
          pointerEvents: 'none', animation: 'pump 3s ease-in-out infinite'
        }} />
      )}

      {/* Heat glow effect */}
      {isHot && expanded && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at center, ${COLORS.danger}10 0%, transparent 70%)`,
          pointerEvents: 'none', animation: 'pump 1s ease-in-out infinite'
        }} />
      )}

      {/* SVG Case */}
      <svg width="100%" height="100%" viewBox="0 0 220 260" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.8))' }}>
        <defs>
          {/* Gradients for depth */}
          <linearGradient id="caseGradient" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" style={{ stopColor: hasCase ? '#1a1a22' : '#d4d0c4', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: hasCase ? '#0f0f15' : '#c5c1b5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: hasCase ? '#0a0a10' : '#b8b4a8', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="glassGradient" cx="40%" cy="40%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.3 }} />
          </radialGradient>
        </defs>

        {/* Case Outer Frame - More realistic shape */}
        <rect x="8" y="8" width="204" height="244" rx="8" fill="url(#caseGradient)" stroke={hasRGB && expanded ? COLORS.primary : COLORS.border} strokeWidth="2" className={hasRGB && expanded ? 'rgb-glow' : ''} />
        
        {/* Front panel beveled effect */}
        <rect x="12" y="12" width="196" height="236" rx="6" fill="none" stroke={hasCase ? '#2a2a32' : '#a8a49e'} strokeWidth="1" opacity="0.5" />

        {/* Tempered glass panel reflection */}
        <rect x="18" y="18" width="184" height="224" rx="4" fill="url(#glassGradient)" stroke={hasRGB && expanded ? COLORS.primary + '80' : COLORS.border + '40'} strokeWidth="1.5" />

        {/* Front IO ports & ventilation */}
        <rect x="18" y="18" width="184" height="24" fill={hasCase ? '#0f0f15' : '#9a9690'} rx="4" />
        <rect x="22" y="22" width="12" height="6" fill={hasCase ? '#1a1a22' : '#7a7670'} rx="1" />
        <rect x="38" y="22" width="12" height="6" fill={hasCase ? '#1a1a22' : '#7a7670'} rx="1" />
        <circle cx="180" cy="25" r="4" fill={hasCase ? '#1a1a22' : '#7a7670'} />

        {/* Main interior space */}
        <rect x="24" y="50" width="172" height="180" fill={hasCase ? '#0a0a10' : '#9a9690'} rx="2" />

        {/* Motherboard - centered */}
        <g transform="translate(35, 62)">
          <rect x="0" y="0" width="110" height="140" rx="2" fill="#1a1820" stroke="#333" strokeWidth="1" />
          
          {/* PCB pattern detail */}
          <circle cx="10" cy="10" r="2" fill="#333" opacity="0.6" />
          <circle cx="20" cy="15" r="2" fill="#333" opacity="0.6" />
          <circle cx="30" cy="10" r="2" fill="#333" opacity="0.6" />
          <circle cx="100" cy="130" r="2" fill="#333" opacity="0.6" />
          <circle cx="90" cy="125" r="2" fill="#333" opacity="0.6" />
          
          {/* VRM heatsink */}
          <rect x="5" y="5" width="28" height="18" fill="#141410" stroke="#222" strokeWidth="0.5" rx="1" />
          <line x1="10" y1="5" x2="10" y2="23" stroke="#222" strokeWidth="0.5" />
          <line x1="15" y1="5" x2="15" y2="23" stroke="#222" strokeWidth="0.5" />
          <line x1="20" y1="5" x2="20" y2="23" stroke="#222" strokeWidth="0.5" />
          <line x1="25" y1="5" x2="25" y2="23" stroke="#222" strokeWidth="0.5" />

          {/* RAM slots */}
          <rect x="95" y="35" width="10" height="55" fill="#0a0a10" stroke="#222" strokeWidth="1" rx="1" />
          <rect x="96" y="36" width="2.5" height="53" fill={hasCase ? COLORS.textDim : '#555'} opacity="0.7" />
          <rect x="99.5" y="36" width="2.5" height="53" fill={hasCase ? COLORS.textDim : '#555'} opacity="0.7" />
          <line x1="98" y1="45" x2="105" y2="45" stroke="#222" strokeWidth="0.5" opacity="0.3" />
          <line x1="98" y1="55" x2="105" y2="55" stroke="#222" strokeWidth="0.5" opacity="0.3" />
          <line x1="98" y1="65" x2="105" y2="65" stroke="#222" strokeWidth="0.5" opacity="0.3" />
          <line x1="98" y1="75" x2="105" y2="75" stroke="#222" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* CPU Socket & Cooling */}
        <g transform="translate(55, 75)">
          {/* CPU Base */}
          {hasCPU ? (
            <>
              <rect x="0" y="0" width="36" height="36" fill="#1a1410" stroke={COLORS.primary} strokeWidth="1.5" rx="2" />
              {/* CPU cores glow */}
              <rect x="4" y="4" width="28" height="28" fill={COLORS.primary} opacity={cpuPulse} className={isProcessing ? 'pump-anim' : ''} rx="1" />
              <rect x="6" y="6" width="10" height="10" fill="#000" opacity="0.4" />
              <rect x="20" y="6" width="10" height="10" fill="#000" opacity="0.4" />
              <rect x="6" y="20" width="10" height="10" fill="#000" opacity="0.4" />
              <rect x="20" y="20" width="10" height="10" fill="#000" opacity="0.4" />
            </>
          ) : (
            <rect x="2" y="2" width="32" height="32" fill="#0f0a08" stroke="#444" strokeWidth="1" rx="2" />
          )}

          {/* Cooling Solution */}
          {hasCooling ? (
            <>
              {/* Pump head */}
              <rect x="-8" y="0" width="14" height="14" fill="#0a0a10" stroke={liquidColor} strokeWidth="1.5" rx="1" className="pump-anim" />
              <circle cx="-1" cy="7" r="3" fill={liquidColor} opacity="0.8" className="pump-anim" />
            </>
          ) : (
            <>
              {/* Air cooler tower */}
              <rect x="-4" y="-4" width="44" height="44" fill="none" stroke="#555" strokeWidth="1.5" rx="2" />
              <circle cx="18" cy="18" r="13" fill="#0f0f15" stroke="#333" strokeWidth="1" />
              {/* Fan */}
              <g transform="translate(18, 18)">
                <circle cx="0" cy="0" r="11" fill="none" stroke="#444" strokeWidth="1" />
                <g className="spin">
                  <path d="M 0 -8 Q 4 0 0 8 Q -4 0 0 -8" fill={COLORS.primaryDim} opacity="0.8" />
                  <path d="M -8 0 Q 0 4 8 0 Q 0 -4 -8 0" fill={COLORS.primaryDim} opacity="0.8" />
                </g>
              </g>
            </>
          )}
        </g>

        {/* Liquid cooling radiator & tubing */}
        {hasCooling && (
          <g>
            {/* Left tube */}
            <path d="M 63 91 Q 40 85 28 100" fill="none" stroke={liquidColor} strokeWidth="3" opacity="0.3" />
            <path d="M 63 91 Q 40 85 28 100" fill="none" stroke={liquidColor} strokeWidth="1.5" className="flow" />
            
            {/* Right tube to radiator */}
            <path d="M 99 91 Q 165 85 185 110" fill="none" stroke={liquidColor} strokeWidth="3" opacity="0.3" />
            <path d="M 99 91 Q 165 85 185 110" fill="none" stroke={liquidColor} strokeWidth="1.5" className="flow" />
            
            {/* Return tube */}
            <path d="M 185 170 Q 165 175 63 160" fill="none" stroke={liquidColor} strokeWidth="3" opacity="0.2" />
            <path d="M 185 170 Q 165 175 63 160" fill="none" stroke={liquidColor} strokeWidth="1.5" className="flow" style={{opacity: 0.6}} />

            {/* Radiator right side */}
            <rect x="183" y="100" width="14" height="80" fill="#0f0f15" stroke="#222" strokeWidth="1" rx="2" />
            <line x1="187" y1="105" x2="187" y2="165" stroke="#333" strokeWidth="0.5" opacity="0.4" />
            <line x1="191" y1="105" x2="191" y2="165" stroke="#333" strokeWidth="0.5" opacity="0.4" />
            
            {/* Radiator fans - two 92mm */}
            <g transform="translate(190, 125)">
              <rect x="-9" y="-9" width="18" height="18" fill="#0a0a10" stroke="#222" strokeWidth="1" rx="1" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="#444" strokeWidth="1" />
              <g className="spin">
                <path d="M 0 -5.5 Q 3 0 0 5.5 Q -3 0 0 -5.5" fill={liquidColor} opacity="0.85" />
                <path d="M -5.5 0 Q 0 3 5.5 0 Q 0 -3 -5.5 0" fill={liquidColor} opacity="0.85" />
              </g>
              {/* Fan frame */}
              <circle cx="0" cy="0" r="8.5" fill="none" stroke={hasRGB ? COLORS.primary : '#333'} strokeWidth="0.5" opacity="0.5" />
            </g>
            
            <g transform="translate(190, 160)">
              <rect x="-9" y="-9" width="18" height="18" fill="#0a0a10" stroke="#222" strokeWidth="1" rx="1" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="#444" strokeWidth="1" />
              <g className="spin" style={{animationDuration: fanDur}}>
                <path d="M 0 -5.5 Q 3 0 0 5.5 Q -3 0 0 -5.5" fill={liquidColor} opacity="0.85" />
                <path d="M -5.5 0 Q 0 3 5.5 0 Q 0 -3 -5.5 0" fill={liquidColor} opacity="0.85" />
              </g>
              <circle cx="0" cy="0" r="8.5" fill="none" stroke={hasRGB ? COLORS.primary : '#333'} strokeWidth="0.5" opacity="0.5" />
            </g>
          </g>
        )}

        {/* GPU - lower right */}
        {hasGPU ? (
          <g transform="translate(24, 160)">
            <rect x="0" y="0" width="100" height="36" rx="3" fill="#0f0a08" stroke={COLORS.primary} strokeWidth="1.5" />
            {/* PCIe connector */}
            <rect x="8" y="2" width="14" height="4" fill={COLORS.warning} opacity="0.8" rx="1" />
            {/* Memory chips */}
            <rect x="12" y="12" width="6" height="8" fill="#1a1410" stroke="#222" strokeWidth="0.5" />
            <rect x="22" y="12" width="6" height="8" fill="#1a1410" stroke="#222" strokeWidth="0.5" />
            <rect x="32" y="12" width="6" height="8" fill="#1a1410" stroke="#222" strokeWidth="0.5" />
            <rect x="42" y="12" width="6" height="8" fill="#1a1410" stroke="#222" strokeWidth="0.5" />
            
            {/* GPU Fans */}
            <g transform="translate(28, 18)">
              <circle cx="0" cy="0" r="9" fill="#0a0a10" stroke="#333" strokeWidth="1" />
              <circle cx="0" cy="0" r="7.5" fill="none" stroke="#444" strokeWidth="0.5" />
              <g className="spin" style={{animationDuration: `calc(${fanDur} * 0.8)`}}>
                <path d="M 0 -4.5 Q 2.5 0 0 4.5 Q -2.5 0 0 -4.5" fill={COLORS.primary} opacity="0.9" />
                <path d="M -4.5 0 Q 0 2.5 4.5 0 Q 0 -2.5 -4.5 0" fill={COLORS.primary} opacity="0.9" />
              </g>
            </g>
            
            <g transform="translate(72, 18)">
              <circle cx="0" cy="0" r="9" fill="#0a0a10" stroke="#333" strokeWidth="1" />
              <circle cx="0" cy="0" r="7.5" fill="none" stroke="#444" strokeWidth="0.5" />
              <g className="spin" style={{animationDuration: `calc(${fanDur} * 0.8)`}}>
                <path d="M 0 -4.5 Q 2.5 0 0 4.5 Q -2.5 0 0 -4.5" fill={COLORS.primary} opacity="0.9" />
                <path d="M -4.5 0 Q 0 2.5 4.5 0 Q 0 -2.5 -4.5 0" fill={COLORS.primary} opacity="0.9" />
              </g>
            </g>
            
            {/* GPU border glow if RGB */}
            {hasRGB && <rect x="0" y="0" width="100" height="36" rx="3" fill="none" stroke={COLORS.danger} strokeWidth="1" className="rgb-glow" opacity="0.7" />}
          </g>
        ) : (
          /* Empty PCIe slots */
          <g transform="translate(24, 160)">
            <rect x="0" y="0" width="50" height="4" fill="#0f0a08" stroke="#222" strokeWidth="0.5" rx="1" />
            <rect x="0" y="10" width="50" height="4" fill="#0f0a08" stroke="#222" strokeWidth="0.5" rx="1" />
          </g>
        )}

        {/* PSU - bottom left */}
        <g transform="translate(24, 215)">
          <rect x="0" y="0" width="70" height="30" fill="#0a0a10" stroke="#222" strokeWidth="1" rx="2" />
          {/* PSU label area */}
          <rect x="4" y="4" width="20" height="22" fill="#141410" stroke="#333" strokeWidth="0.5" rx="1" />
          <text x="14" y="16" fontSize="6" fill="#444" textAnchor="middle" fontFamily="monospace" dominantBaseline="middle">PSU</text>
          {/* Fan */}
          <circle cx="50" cy="15" r="8" fill="#0f0f15" stroke="#333" strokeWidth="1" />
          <g transform="translate(50, 15)" className="spin">
            <path d="M 0 -5 Q 3 0 0 5 Q -3 0 0 -5" fill="#666" opacity="0.7" />
            <path d="M -5 0 Q 0 3 5 0 Q 0 -3 -5 0" fill="#666" opacity="0.7" />
          </g>
        </g>

        {/* Cable management - subtle */}
        <path d="M 94 160 Q 110 175 115 220" fill="none" stroke="#222" strokeWidth="2" opacity="0.4" />
        <path d="M 100 160 Q 120 180 125 220" fill="none" stroke="#222" strokeWidth="2" opacity="0.4" />
      </svg>

      {/* Info badge */}
      <div style={{
        position: 'absolute', top: '6px', left: '8px', fontSize: '9px', color: COLORS.textDim, 
        pointerEvents: 'none', background: 'rgba(0,0,0,0.7)', padding: '3px 6px', borderRadius: '2px',
        backdropFilter: 'blur(2px)', border: `1px solid ${COLORS.border}30`
      }}>
        <div style={{fontWeight: 'bold', letterSpacing: '1px', marginBottom: '2px'}}>GAMING RIG</div>
        <div style={{ fontSize: '8px' }}>
          TEMP: <span style={{ color: isHot ? COLORS.danger : (isWarm ? COLORS.warning : COLORS.secondary), fontWeight: 'bold' }}>{heat}%</span>
        </div>
      </div>
      
      {/* Expand/Collapse button */}
      <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} 
        style={{
          position: 'absolute', bottom: '6px', right: '8px', background: 'rgba(0,0,0,0.6)', 
          border: `1px solid ${COLORS.border}`, color: COLORS.textDim, fontSize: '9px', cursor: 'pointer',
          fontFamily: 'inherit', zIndex: 5, padding: '3px 5px', borderRadius: '2px',
          transition: 'all 0.2s'
        }}>
        {expanded ? '▲' : '▼'}
      </button>
    </div>
  );
};
