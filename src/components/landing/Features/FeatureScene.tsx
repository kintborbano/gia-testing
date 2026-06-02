import type { CSSProperties } from 'react';
import { getFloatingObjectStyle } from '@/animations/laptopAnimations';
import ChibiLaptopScene, { GIA_SLOT } from './ChibiLaptopScene';

// Center of the gia-on-laptop image within the grid — where icons start hidden.
const ORIGIN_X = GIA_SLOT.marginLeft + GIA_SLOT.width / 2;
const ORIGIN_Y = GIA_SLOT.marginTop + GIA_SLOT.height / 2;

type FloatingObjectData = {
  outerWidth: number;
  outerHeight: number;
  marginLeft: number;
  marginTop: number;
  alt: string;
  // Horizontal nudge (px) for the label when the artwork isn't visually centered.
  labelOffsetX?: number;
};

const FLOATING_OBJECTS: FloatingObjectData[] = [
  {
    outerWidth: 116,
    outerHeight: 105,
    marginLeft: 0,
    marginTop: 116,
    alt: 'Hook Scoring',
    // Pencil pokes out on the right, so bias the label left onto the notepad.
    labelOffsetX: -10,
  },
  {
    outerWidth: 117,
    outerHeight: 98,
    marginLeft: 1058,
    marginTop: 166,
    alt: 'GIA Score',
  },
  {
    outerWidth: 125,
    outerHeight: 99,
    marginLeft: 276,
    marginTop: 70,
    alt: 'Performance Patterns',
  },
  {
    outerWidth: 118,
    outerHeight: 107,
    marginLeft: 121,
    marginTop: -30,
    alt: 'Shareable Story Card',
  },
  {
    outerWidth: 108,
    outerHeight: 107,
    marginLeft: 1123,
    marginTop: 0,
    alt: 'Content Roadmap',
  },
  {
    outerWidth: 140,
    outerHeight: 105,
    marginLeft: 895,
    marginTop: 41,
    alt: 'Comment Intelligence',
  },
];

function FloatingObject({
  outerWidth,
  outerHeight,
  marginLeft,
  marginTop,
  alt,
  labelOffsetX = 0,
  animStyle,
}: FloatingObjectData & { animStyle?: CSSProperties }) {
  const [first, ...rest] = alt.split(' ');
  return (
    <div
      className="relative"
      style={{
        gridColumn: 1,
        gridRow: 1,
        width: outerWidth,
        height: outerHeight,
        marginLeft,
        marginTop,
        ...animStyle,
      }}
    >
      <img
        alt={alt}
        className="pointer-events-none h-full w-full object-contain"
        src={`/images/${encodeURIComponent(alt)}.png`}
      />
      <div
        className="font-pixelify pointer-events-none absolute top-full left-0 mt-3 w-full text-center leading-tight"
        style={{ transform: `translateX(${labelOffsetX}px)` }}
      >
        <div>{first}</div>
        <div>{rest.join(' ')}</div>
      </div>
    </div>
  );
}

interface FeatureSceneProps {
  animationProgress: number;
}

export default function FeatureScene({
  animationProgress,
}: FeatureSceneProps): React.ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative inline-grid leading-[0]"
        style={{
          gridTemplateColumns: 'max-content',
          gridTemplateRows: 'max-content',
          placeItems: 'start',
        }}
      >
        <ChibiLaptopScene animationProgress={animationProgress} />

        {FLOATING_OBJECTS.map((obj, index) => {
          const origin = {
            x: ORIGIN_X - (obj.marginLeft + obj.outerWidth / 2),
            y: ORIGIN_Y - (obj.marginTop + obj.outerHeight / 2),
          };
          return (
            <FloatingObject
              key={obj.alt}
              {...obj}
              animStyle={getFloatingObjectStyle(
                animationProgress,
                index,
                origin
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
