'use client';

import type { CSSProperties, MouseEventHandler } from 'react';

interface FeatureBoxProps {
  label: string;
  description?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function FeatureBox({
  label,
  description,
  style,
  onClick,
}: FeatureBoxProps): React.ReactElement {
  return (
    <div style={style} onClick={onClick}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
      {description && (
        <div
          style={{ fontWeight: 400, fontSize: 12, color: '#666', marginTop: 2 }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
