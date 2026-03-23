import React from 'react';
import { COLORS } from '../constants/gameConstants';

const Header = ({ operator, privilege, money, heat, reputation, isInside, targetIP, trace, isChatting, activeContract, world, gameMode, onSave, onMenu, onHelp }) => {
  const traceColor = trace > 75 ? COLORS.danger : trace > 40 ? COLORS.warning : COLORS.primary;
  const heatColor = heat > 70 ? COLORS.danger : heat > 40 ? COLORS.warning : COLORS.textDim;
  const orgName = isInside && targetIP && world[targetIP]?.org?.orgName;
  const modeColor = gameMode === 'operator' ? COLORS.danger : gameMode === 'field' ? COLORS.warning : COLORS.secondary;
  const modeLabel = (gameMode || 'arcade').toUpperCase();

  const btnStyle = {
    background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textDim,
    padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '9px',
    borderRadius: '2px', letterSpacing: '1px', transition: 'border-color 0.15s, color 0.15s',
  };

  return (
    <div style={{
      flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: `1px solid ${trace > 75 ? COLORS.danger + '60' : COLORS.border}`,
      paddingBottom: '8px', fontSize: '12px', gap: '12px', flexWrap: 'wrap'
    }}>
      <span>
        <span style={{ color: COLORS.textDim }}>
          {isChatting ? 'SPEARPHISH' : (isInside ? privilege.toUpperCase() : 'OP')}
        </span>
        <span style={{ color: COLORS.textDim }}>@</span>
        {isInside ? <span style={{ color: COLORS.ip }}>{targetIP}</span> : <span style={{ color: COLORS.textDim }}>kali</span>}
        {orgName && <span style={{ color: COLORS.textDim }}> [{orgName}]</span>}
      </span>

      <span style={{ color: COLORS.warning }}>XMR ${money.toLocaleString()}</span>

      {activeContract && (
        <span style={{ color: COLORS.chat }}>
          CONTRACT: {activeContract.id}
        </span>
      )}

      <span>
        <span style={{ color: heatColor }}>HEAT {heat}%</span>
        <span style={{ color: COLORS.textDim }}> │ </span>
        <span style={{ color: COLORS.textDim }}>REP {reputation}</span>
      </span>

      <span style={{ color: traceColor, fontWeight: trace > 75 ? 'bold' : 'normal' }}>
        TRACE {trace}%
        {trace > 75 && ' ◉'}
      </span>

      <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ color: modeColor, fontSize: '9px', border: `1px solid ${modeColor}40`, padding: '1px 6px', borderRadius: '2px', letterSpacing: '1px' }}>{modeLabel}</span>
        <button onClick={onHelp} style={btnStyle}>[TAB] HELP</button>
        <button onClick={onSave} style={btnStyle}>SAVE</button>
        <button onClick={onMenu} disabled={isInside} style={{ ...btnStyle, opacity: isInside ? 0.3 : 1, cursor: isInside ? 'default' : 'pointer' }}>MENU</button>
      </span>
    </div>
  );
};

export default Header;
