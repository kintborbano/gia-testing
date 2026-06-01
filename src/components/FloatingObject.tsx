'use client';

import type { CSSProperties, MouseEventHandler } from 'react';

interface FloatingObjectProps {
  label: string;
  description: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function FloatingObject({
  label,
  description,
  style,
  onClick,
}: FloatingObjectProps): React.ReactElement {
  return (
    <div style={{ willChange: 'transform', ...style }}>
      <div
        className="floating-object"
        onClick={onClick}
        style={{
          minWidth: 100,
          minHeight: 56,
          padding: '10px 14px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,.1)',
          cursor: 'pointer',
          transition: 'transform .2s ease,box-shadow .2s ease',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <div>{label}</div>
        <div
          style={{
            fontWeight: 400,
            fontSize: 11,
            color: '#666',
            marginTop: 2,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
