'use client';

import { forwardRef } from 'react';
import type { Wrapped } from '@/types/wrapped';

const serif = 'var(--font-young-serif), serif';
const sans = 'var(--font-instrument-sans), sans-serif';

/* The single, descriptive, Instagram-story-ready card that Save/Share exports.
   Fixed 360x640 (9:16) — captured at pixelRatio 3 → 1080x1920. Self-contained
   inline styling so the PNG export is faithful regardless of theme cascade. */
const ShareCard = forwardRef<HTMLDivElement, { data: Wrapped }>(
  function ShareCard({ data }, ref) {
    const identity = data.copy?.finale?.identity_tag || 'a force on the FYP';
    return (
      <div
        ref={ref}
        style={{
          width: 360,
          height: 640,
          background: 'linear-gradient(165deg, #221708 0%, #140d05 100%)',
          color: '#fef7dd',
          display: 'flex',
          flexDirection: 'column',
          padding: '34px 30px 30px',
          fontFamily: sans,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 26,
              color: '#e7b62e',
              letterSpacing: '-.03em',
            }}
          >
            gia
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'rgba(254,247,221,.55)',
            }}
          >
            wrapped
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#e7b62e',
            }}
          >
            my creator type
          </span>
          <div
            style={{
              fontFamily: serif,
              fontSize: 33,
              lineHeight: 1.04,
              marginTop: 10,
            }}
          >
            {identity}
          </div>

          <div style={{ marginTop: 30 }}>
            <div style={{ fontFamily: serif, fontSize: 52, lineHeight: 1 }}>
              {data.totalViews}
            </div>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: 'rgba(254,247,221,.55)',
                marginTop: 5,
              }}
            >
              views GIA read
            </div>
          </div>

          <p
            style={{
              fontFamily: serif,
              fontSize: 18,
              lineHeight: 1.32,
              margin: '30px 0 0',
            }}
          >
            GIA named my #1 move.
            <br />
            <span style={{ color: '#e7b62e' }}>what’s yours?</span>
          </p>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(254,247,221,.16)',
            paddingTop: 16,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: 'rgba(254,247,221,.85)' }}>
            get your GIA Wrapped
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#e7b62e' }}>
            gia.sofi.ai
          </span>
        </div>
      </div>
    );
  }
);

export default ShareCard;
