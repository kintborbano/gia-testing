'use client';

import { useState } from 'react';
import type { CSSProperties, MouseEventHandler } from 'react';

type SpeechBubblePosition = 'top' | 'right' | 'left';

const BUBBLE_CLIP_PATH_POLYGON =
  'polygon(calc(calc(0px + 13px) - 13.00px) calc(calc(0px + 13px) + 0.00px),calc(calc(0px + 13px) - 12.89px) calc(calc(0px + 13px) - 1.70px),calc(calc(0px + 13px) - 12.56px) calc(calc(0px + 13px) - 3.36px),calc(calc(0px + 13px) - 12.01px) calc(calc(0px + 13px) - 4.97px),calc(calc(0px + 13px) - 11.26px) calc(calc(0px + 13px) - 6.50px),calc(calc(0px + 13px) - 10.31px) calc(calc(0px + 13px) - 7.91px),calc(calc(0px + 13px) - 9.19px) calc(calc(0px + 13px) - 9.19px),calc(calc(0px + 13px) - 7.91px) calc(calc(0px + 13px) - 10.31px),calc(calc(0px + 13px) - 6.50px) calc(calc(0px + 13px) - 11.26px),calc(calc(0px + 13px) - 4.97px) calc(calc(0px + 13px) - 12.01px),calc(calc(0px + 13px) - 3.36px) calc(calc(0px + 13px) - 12.56px),calc(calc(0px + 13px) - 1.70px) calc(calc(0px + 13px) - 12.89px),calc(calc(0px + 13px) - 0.00px) calc(calc(0px + 13px) - 13.00px),calc(calc(100% - 13px) - 0.00px) calc(calc(0px + 13px) - 13.00px),calc(calc(100% - 13px) + 1.70px) calc(calc(0px + 13px) - 12.89px),calc(calc(100% - 13px) + 3.36px) calc(calc(0px + 13px) - 12.56px),calc(calc(100% - 13px) + 4.97px) calc(calc(0px + 13px) - 12.01px),calc(calc(100% - 13px) + 6.50px) calc(calc(0px + 13px) - 11.26px),calc(calc(100% - 13px) + 7.91px) calc(calc(0px + 13px) - 10.31px),calc(calc(100% - 13px) + 9.19px) calc(calc(0px + 13px) - 9.19px),calc(calc(100% - 13px) + 10.31px) calc(calc(0px + 13px) - 7.91px),calc(calc(100% - 13px) + 11.26px) calc(calc(0px + 13px) - 6.50px),calc(calc(100% - 13px) + 12.01px) calc(calc(0px + 13px) - 4.97px),calc(calc(100% - 13px) + 12.56px) calc(calc(0px + 13px) - 3.36px),calc(calc(100% - 13px) + 12.89px) calc(calc(0px + 13px) - 1.70px),calc(calc(100% - 13px) + 13.00px) calc(calc(0px + 13px) - 0.00px),calc(calc(100% - 13px) + 13.00px) calc(calc(calc(100% - 18px) - 13px) + 0.00px),calc(calc(100% - 13px) + 12.89px) calc(calc(calc(100% - 18px) - 13px) + 1.70px),calc(calc(100% - 13px) + 12.56px) calc(calc(calc(100% - 18px) - 13px) + 3.36px),calc(calc(100% - 13px) + 12.01px) calc(calc(calc(100% - 18px) - 13px) + 4.97px),calc(calc(100% - 13px) + 11.26px) calc(calc(calc(100% - 18px) - 13px) + 6.50px),calc(calc(100% - 13px) + 10.31px) calc(calc(calc(100% - 18px) - 13px) + 7.91px),calc(calc(100% - 13px) + 9.19px) calc(calc(calc(100% - 18px) - 13px) + 9.19px),calc(calc(100% - 13px) + 7.91px) calc(calc(calc(100% - 18px) - 13px) + 10.31px),calc(calc(100% - 13px) + 6.50px) calc(calc(calc(100% - 18px) - 13px) + 11.26px),calc(calc(100% - 13px) + 4.97px) calc(calc(calc(100% - 18px) - 13px) + 12.01px),calc(calc(100% - 13px) + 3.36px) calc(calc(calc(100% - 18px) - 13px) + 12.56px),calc(calc(100% - 13px) + 1.70px) calc(calc(calc(100% - 18px) - 13px) + 12.89px),calc(calc(100% - 13px) + 0.00px) calc(calc(calc(100% - 18px) - 13px) + 13.00px),calc(83% + 14.4px) calc(100% - 18px),83% 100%,calc(83% - 14.4px) calc(100% - 18px),calc(calc(0px + 13px) + 0.00px) calc(calc(calc(100% - 18px) - 13px) + 13.00px),calc(calc(0px + 13px) - 1.70px) calc(calc(calc(100% - 18px) - 13px) + 12.89px),calc(calc(0px + 13px) - 3.36px) calc(calc(calc(100% - 18px) - 13px) + 12.56px),calc(calc(0px + 13px) - 4.97px) calc(calc(calc(100% - 18px) - 13px) + 12.01px),calc(calc(0px + 13px) - 6.50px) calc(calc(calc(100% - 18px) - 13px) + 11.26px),calc(calc(0px + 13px) - 7.91px) calc(calc(calc(100% - 18px) - 13px) + 10.31px),calc(calc(0px + 13px) - 9.19px) calc(calc(calc(100% - 18px) - 13px) + 9.19px),calc(calc(0px + 13px) - 10.31px) calc(calc(calc(100% - 18px) - 13px) + 7.91px),calc(calc(0px + 13px) - 11.26px) calc(calc(calc(100% - 18px) - 13px) + 6.50px),calc(calc(0px + 13px) - 12.01px) calc(calc(calc(100% - 18px) - 13px) + 4.97px),calc(calc(0px + 13px) - 12.56px) calc(calc(calc(100% - 18px) - 13px) + 3.36px),calc(calc(0px + 13px) - 12.89px) calc(calc(calc(100% - 18px) - 13px) + 1.70px),calc(calc(0px + 13px) - 13.00px) calc(calc(calc(100% - 18px) - 13px) + 0.00px))';

interface SpeechBubbleProps {
  text: string;
  position?: SpeechBubblePosition;
  floatDelay?: number;
  opacity?: number;
  verticalOffset?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  bgColor?: string;
  textColor?: string;
  useClipPath?: boolean;
}

export default function SpeechBubble({
  text,
  position = 'top',
  floatDelay = 0,
  opacity = 1,
  verticalOffset = 0,
  onClick,
  bgColor = '#3b82f6',
  textColor = '#ffffff',
  useClipPath = true,
}: SpeechBubbleProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  const outerStyle: CSSProperties =
    position === 'top'
      ? {
          position: 'absolute',
          bottom: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
        }
      : position === 'right'
        ? {
            position: 'absolute',
            left: '110%',
            top: `calc(30% + ${verticalOffset}px)`,
          }
        : {
            position: 'absolute',
            right: '110%',
            top: `calc(30% + ${verticalOffset}px)`,
          };

  const bubbleStyle: CSSProperties = useClipPath
    ? {
        position: 'relative',
        background: bgColor,
        color: textColor,
        padding: '24px 24px calc(24px + 18px) 24px',
        fontSize: 16,
        fontWeight: 600,
        clipPath: BUBBLE_CLIP_PATH_POLYGON,
        boxShadow: isHovered
          ? '0 4px 16px rgba(0,0,0,0.25)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.2s ease-out',
        cursor: onClick ? 'pointer' : 'default',
      }
    : {
        position: 'relative',
        background: bgColor,
        color: textColor,
        borderRadius: 16,
        padding: '12px 20px',
        fontSize: 18,
        fontWeight: 600,
        boxShadow: isHovered
          ? '0 4px 16px rgba(0,0,0,0.25)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.2s ease-out',
        cursor: onClick ? 'pointer' : 'default',
      };

  return (
    <div
      style={{
        ...outerStyle,
        opacity,
        transition: 'opacity 0.1s linear',
        whiteSpace: 'nowrap',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      <div
        style={{
          animationName: 'bubble-float',
          animationDuration: '2s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
          animationDelay: `${floatDelay}s`,
          willChange: 'transform',
          overflow: 'visible',
        }}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClick}
          style={bubbleStyle}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
