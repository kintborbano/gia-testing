'use client';

import { useEffect, useState } from 'react';
import type { Wrapped } from '@/types/wrapped';

function prefersReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/* Count-up for a formatted view count like "29.2M" / "8.3M". */
function CountUp({
  value,
  delay = 0.4,
  dur = 1300,
}: {
  value: string;
  delay?: number;
  dur?: number;
}) {
  const m = String(value).match(/^([^\d-]*)([\d,]*\.?\d+)(.*)$/);
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : NaN;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [n, setN] = useState(() => (prefersReduced() || !m ? target : 0));

  useEffect(() => {
    if (!m || prefersReduced()) return;
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (now < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (now - t0) / dur);
      setN(target * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!m) return <>{value}</>;
  const shown = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <>
      {m[1]}
      {shown}
      {m[3]}
    </>
  );
}

function Sparkle({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="spk"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 0C12.7 6.6 17.4 11.3 24 12C17.4 12.7 12.7 17.4 12 24C11.3 17.4 6.6 12.7 0 12C6.6 11.3 11.3 6.6 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Corners() {
  return (
    <>
      <span className="frame-corner tl" />
      <span className="frame-corner tr" />
      <span className="frame-corner bl" />
      <span className="frame-corner br" />
    </>
  );
}

function GiaVoice({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="giavoice anim" style={d(delay)}>
      <span className="gia-ava" />
      <div>
        <span className="gia-name">GIA</span>
        <p className="gia-line">{children}</p>
      </div>
    </div>
  );
}

const d = (n: number): React.CSSProperties => ({ ['--d' as string]: `${n}s` });

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow anim" style={d(0)}>
      <Sparkle size={13} /> {children}
    </span>
  );
}

/* ===================== BEATS ===================== */

function CoverCard({ w }: { w: Wrapped }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Corners />
      <Eyebrow>gia wrapped</Eyebrow>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 64 }}>
        {w.copy.cover.tagline}
      </h1>
      <div className="spacer" />
      <div className="anim" style={d(0.4)}>
        <span className="serif" style={{ fontSize: 34 }}>
          {w.handle}
        </span>
      </div>
      <div className="anim fade" style={{ ...d(0.7), marginTop: 18 }}>
        <span className="kicker">Tap to begin</span>
      </div>
    </div>
  );
}

function EnergyCard({ w }: { w: Wrapped }) {
  const c = w.copy.energy;
  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 50 }}>
        {c.headline}
      </h1>
      <p className="body anim" style={{ ...d(0.34), marginTop: 22 }}>
        {c.body}
      </p>
      <div className="spacer" />
    </>
  );
}

function NumberCard({ w }: { w: Wrapped }) {
  return (
    <>
      <Eyebrow>{w.copy.number.eyebrow}</Eyebrow>
      <div className="spacer" />
      <p className="kicker anim" style={d(0.08)}>
        your hooks pulled in
      </p>
      <div
        className="bignum anim blur"
        style={{ ...d(0.16), fontSize: 104, marginTop: 6 }}
      >
        <CountUp value={w.totalViews} delay={0.5} />
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.36), fontSize: 26, marginTop: 18 }}
      >
        {w.copy.number.caption}
      </p>
      <div className="spacer" />
    </>
  );
}

function SignatureCard({ w }: { w: Wrapped }) {
  const a = w.archetypes[0];
  const c = w.copy.signature;
  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <div className="spacer" />
      {a?.emoji && (
        <div
          className="anim pop"
          style={{ ...d(0.1), fontSize: 64, lineHeight: 1 }}
        >
          {a.emoji}
        </div>
      )}
      <h1
        className="serif anim"
        style={{ ...d(0.2), fontSize: 44, marginTop: 16 }}
      >
        {c.headline}
      </h1>
      {a?.note && (
        <p className="kicker anim" style={{ ...d(0.34), marginTop: 12 }}>
          {a.note}
        </p>
      )}
      <p className="body anim" style={{ ...d(0.46), marginTop: 18 }}>
        {c.body}
      </p>
      <div className="spacer" />
    </>
  );
}

function BreakoutCard({ w }: { w: Wrapped }) {
  const c = w.copy.breakout;
  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 40 }}>
        {c.headline}
      </h1>
      <p className="kicker anim" style={{ ...d(0.28), marginTop: 16 }}>
        “{w.topVideo.title}”
      </p>
      <div
        className="anim mask"
        style={{
          ...d(0.4),
          marginTop: 22,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span className="bignum" style={{ fontSize: 76 }}>
          <CountUp value={w.topVideo.views} delay={0.7} />
        </span>
        <span className="kicker" style={{ fontSize: 15 }}>
          views
        </span>
      </div>
      <p
        className="body anim"
        style={{ ...d(0.56), marginTop: 20, color: 'var(--muted)' }}
      >
        {c.body}
      </p>
      <div className="spacer" />
    </>
  );
}

function AudienceCard({ w }: { w: Wrapped }) {
  const c = w.copy.audience;
  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 46 }}>
        {c.headline}
      </h1>
      <p className="body anim" style={{ ...d(0.34), marginTop: 22 }}>
        {c.body}
      </p>
      <div className="spacer" />
    </>
  );
}

function CommentCard({ w }: { w: Wrapped }) {
  return (
    <>
      <Eyebrow>{w.copy.comment.eyebrow}</Eyebrow>
      <div className="spacer" />
      <h1
        className="serif anim"
        style={{ ...d(0.12), fontSize: 34, lineHeight: 1.16 }}
      >
        “{w.commentQuote}”
      </h1>
      <div className="spacer" />
      <div className="rule anim fade" style={{ ...d(0.4), marginBottom: 16 }} />
      <GiaVoice delay={0.48}>{w.copy.comment.reaction}</GiaVoice>
    </>
  );
}

function SuperpowerCard({ w }: { w: Wrapped }) {
  const c = w.copy.superpower;
  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 48 }}>
        {c.headline}
      </h1>
      <p className="body anim" style={{ ...d(0.34), marginTop: 22 }}>
        {c.body}
      </p>
      <div className="spacer" />
    </>
  );
}

function FinaleCard({ w }: { w: Wrapped }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Eyebrow>your year, wrapped</Eyebrow>
      <div className="grow" />
      <h1
        className="serif anim"
        style={{ ...d(0.08), fontSize: 40, lineHeight: 1.04 }}
      >
        {w.handle}
      </h1>
      <p className="kicker anim" style={{ ...d(0.16), marginTop: 10 }}>
        {w.copy.finale.identity_tag}
      </p>
      <div className="anim pop" style={{ ...d(0.26), marginTop: 28 }}>
        <div className="bignum" style={{ fontSize: 58 }}>
          {w.totalViews}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginTop: 8,
          }}
        >
          total views
        </div>
      </div>
      <div
        className="anim fade"
        style={{
          ...d(0.4),
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 26,
        }}
      >
        {w.archetypes.map((a) => (
          <span
            key={a.name}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '6px 16px',
              borderRadius: 100,
              background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
              color: 'var(--accent)',
            }}
          >
            {a.name}
          </span>
        ))}
      </div>
      <div className="grow" />
      <div
        className="anim"
        style={{ ...d(0.5), display: 'flex', gap: 12, alignItems: 'center' }}
      >
        <span className="gia-ava" style={{ width: 34, height: 34 }} />
        <p
          className="gia-line"
          style={{ fontSize: 15, margin: 0, textAlign: 'left' }}
        >
          {w.copy.finale.signoff}
        </p>
      </div>
      <p
        className="anim"
        style={{
          ...d(0.58),
          marginTop: 16,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '.04em',
          color: 'var(--accent)',
        }}
      >
        follow your analyst — @gia.sofi.ai
      </p>
    </div>
  );
}

export interface Beat {
  key: string;
  theme: 'ink' | 'wine' | 'gold' | 'cream';
  render: (props: { w: Wrapped }) => React.ReactElement;
}

export const BEATS: Beat[] = [
  { key: 'cover', theme: 'ink', render: CoverCard },
  { key: 'energy', theme: 'wine', render: EnergyCard },
  { key: 'number', theme: 'cream', render: NumberCard },
  { key: 'signature', theme: 'gold', render: SignatureCard },
  { key: 'breakout', theme: 'ink', render: BreakoutCard },
  { key: 'audience', theme: 'wine', render: AudienceCard },
  { key: 'comment', theme: 'gold', render: CommentCard },
  { key: 'superpower', theme: 'cream', render: SuperpowerCard },
  { key: 'finale', theme: 'ink', render: FinaleCard },
];
