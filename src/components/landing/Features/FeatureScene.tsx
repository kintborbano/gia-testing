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
};

const FLOATING_OBJECTS: FloatingObjectData[] = [
  {
    outerWidth: 116,
    outerHeight: 105,
    marginLeft: 0,
    marginTop: 116,
    alt: 'Hook Scoring',
  },
  {
    outerWidth: 117,
    outerHeight: 98,
    marginLeft: 80,
    marginTop: 7,
    alt: 'GIA Score',
  },
  {
    outerWidth: 125,
    outerHeight: 99,
    marginLeft: 182,
    marginTop: 70,
    alt: 'Performance Patterns',
  },
  {
    outerWidth: 118,
    outerHeight: 107,
    marginLeft: 596,
    marginTop: 41,
    alt: 'Shareable Story Card',
  },
  {
    outerWidth: 108,
    outerHeight: 107,
    marginLeft: 706,
    marginTop: 114,
    alt: 'Content Roadmap',
  },
  {
    outerWidth: 140,
    outerHeight: 105,
    marginLeft: 744,
    marginTop: 0,
    alt: 'Comment Intelligence',
  },
];

function FloatingObject({
  outerWidth,
  outerHeight,
  marginLeft,
  marginTop,
  alt,
  animStyle,
}: FloatingObjectData & { animStyle?: CSSProperties }) {
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
        src={`/features/${encodeURIComponent(alt)}.png`}
      />
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
        <ChibiLaptopScene />

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
