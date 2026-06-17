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

/* Count-up for a formatted stat string like "29.2M", "16.3%", "876.4K". */
function CountUp({
  value,
  delay = 0.2,
  dur = 1150,
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
  mood,
  delay = 0,
}: {
  children: React.ReactNode;
  mood?: string;
  delay?: number;
}) {
  return (
    <div className="giavoice anim" style={d(delay)}>
      <span className="gia-ava" />
      <div>
        <span className="gia-name">GIA{mood && <em>· {mood}</em>}</span>
        <p className="gia-line">{children}</p>
      </div>
    </div>
  );
}

const d = (n: number): React.CSSProperties => ({ ['--d' as string]: `${n}s` });

/* ===================== BEATS ===================== */

function CoverCard({ w }: { w: Wrapped }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Corners />
      <div className="anim" style={d(0)}>
        <span className="eyebrow">
          <Sparkle size={13} /> {w.videoCount} hooks read
        </span>
      </div>
      <div className="spacer" />
      <h1 className="serif anim" style={{ ...d(0.12), fontSize: 60 }}>
        Your run
        <br />
        on the FYP.
      </h1>
      <p
        className="body anim"
        style={{ ...d(0.26), marginTop: 22, maxWidth: 300 }}
      >
        I watched all <strong>{w.videoCount}</strong> of your hooks. Here&apos;s
        how {w.fanTerm} really felt.
      </p>
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

function IntroCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> Your hooks, read by GIA
      </span>
      <div className="spacer" />
      <div
        className="anim"
        style={{
          ...d(0.1),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 26,
        }}
      >
        <span className="gia-hero" />
        <div>
          <div className="gia-name" style={{ fontSize: 12 }}>
            GIA · your analyst
          </div>
          <p
            className="serif"
            style={{ fontSize: 19, marginTop: 7, lineHeight: 1.15 }}
          >
            {w.voice.gia_hero_line}
          </p>
        </div>
      </div>
      <h1 className="serif anim" style={{ ...d(0.24), fontSize: 44 }}>
        {w.voice.intro_headline}
      </h1>
      <p className="body anim" style={{ ...d(0.36), marginTop: 18 }}>
        {w.voice.intro_body}
      </p>
      <p
        className="body anim"
        style={{ ...d(0.48), marginTop: 14, color: 'var(--muted)' }}
      >
        {w.voice.intro_body_muted}
      </p>
      <div className="spacer" />
    </>
  );
}

function ViewsCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> The headline number
      </span>
      <div className="spacer" />
      <p className="kicker anim" style={d(0.08)}>
        Your hooks pulled in
      </p>
      <div
        className="bignum anim blur"
        style={{ ...d(0.16), fontSize: 96, marginTop: 6 }}
      >
        <CountUp value={w.totalViews} delay={0.5} />
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.34), fontSize: 30, marginTop: 16 }}
      >
        total views.
      </p>
      <div className="spacer" />
      <div
        className="rule anim fade"
        style={{ ...d(0.62), marginBottom: 16 }}
      />
      <GiaVoice mood={w.voice.views.mood} delay={0.7}>
        {w.voice.views.line}
      </GiaVoice>
    </>
  );
}

function EngagementCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> The flex
      </span>
      <div className="spacer" />
      <div className="bignum anim pop" style={{ ...d(0.12), fontSize: 112 }}>
        <CountUp value={w.avgEngagement} delay={0.45} />
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.3), fontSize: 26, marginTop: 18 }}
      >
        average engagement rate.
      </p>
      <div className="anim" style={{ ...d(0.46), marginTop: 24 }}>
        <span className="chip">
          <Sparkle size={13} /> {w.benchmarkMult} the benchmark
        </span>
      </div>
      <p
        className="body anim"
        style={{ ...d(0.58), marginTop: 18, color: 'var(--muted)' }}
      >
        The benchmark is {w.benchmark}. You blew past it.
      </p>
      <div className="spacer" />
      <div
        className="rule anim fade"
        style={{ ...d(0.66), marginBottom: 16 }}
      />
      <GiaVoice mood={w.voice.eng.mood} delay={0.74}>
        {w.voice.eng.line}
      </GiaVoice>
    </>
  );
}

function HookCard({ w }: { w: Wrapped }) {
  const onCount = Math.round(parseFloat(w.avgHook));
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> GIA&apos;s hook score
      </span>
      <div className="spacer" />
      <div
        className="anim wipe"
        style={{ ...d(0.12), display: 'flex', alignItems: 'flex-end', gap: 6 }}
      >
        <span className="bignum" style={{ fontSize: 140 }}>
          <CountUp value={w.avgHook} delay={0.45} />
        </span>
        <span
          className="serif"
          style={{ fontSize: 46, marginBottom: 18, color: 'var(--muted)' }}
        >
          /10
        </span>
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.32), fontSize: 28, marginTop: 14 }}
      >
        Every. Single. Hook.
      </p>
      <div className="meter anim" style={{ ...d(0.56), marginTop: 22 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <i
            key={i}
            className={i < onCount ? 'on' : ''}
            style={{ ['--md' as string]: `${0.6 + i * 0.05}s` }}
          />
        ))}
      </div>
      <div className="spacer" />
      <div className="rule anim fade" style={{ ...d(0.6), marginBottom: 16 }} />
      <GiaVoice mood={w.voice.hook.mood} delay={0.68}>
        {w.voice.hook.line}
      </GiaVoice>
    </>
  );
}

function BiggestCard({ w }: { w: Wrapped }) {
  const t = w.topVideo;
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> Your biggest hook
      </span>
      <div className="spacer" />
      <p className="kicker anim" style={d(0.08)}>
        #1 most-viewed
      </p>
      <h1
        className="serif anim"
        style={{ ...d(0.16), fontSize: 32, marginTop: 8 }}
      >
        “{t.title}”
      </h1>
      <div
        className="anim mask"
        style={{
          ...d(0.34),
          marginTop: 26,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span className="bignum" style={{ fontSize: 80 }}>
          <CountUp value={t.views} delay={0.7} />
        </span>
        <span className="kicker" style={{ fontSize: 15 }}>
          views
        </span>
      </div>
      <div className="spacer" />
      <div className="statgrid anim" style={d(0.56)}>
        <div className="statbox">
          <div className="v">
            <CountUp value={t.likes} delay={0.9} />
          </div>
          <div className="l">Likes</div>
        </div>
        <div className="statbox">
          <div className="v">
            <CountUp value={t.shares} delay={1} />
          </div>
          <div className="l">Shares</div>
        </div>
      </div>
    </>
  );
}

function ArchetypesCard({ w }: { w: Wrapped }) {
  const ers = w.archetypes.map((x) => parseFloat(x.er));
  const max = Math.max(...ers, 0.0001);
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> Your top hook formulas
      </span>
      <h1
        className="serif anim"
        style={{ ...d(0.1), fontSize: 34, marginTop: 12 }}
      >
        What made them stay.
      </h1>
      <div className="grow" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {w.archetypes.map((a, i) => {
          const pct = Math.round((parseFloat(a.er) / max) * 100);
          return (
            <div key={a.name}>
              {i > 0 && (
                <div className="divider anim fade" style={d(0.24 + i * 0.12)} />
              )}
              <div
                className="anim"
                style={{ ...d(0.22 + i * 0.12), padding: '14px 0' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="idxnum">{a.emoji || `0${i + 1}`}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17.5, fontWeight: 600 }}>
                      {a.name}
                    </div>
                    <div
                      className="muted"
                      style={{ fontSize: 13.5, marginTop: 2 }}
                    >
                      {a.note}
                    </div>
                  </div>
                  <span
                    className="serif"
                    style={{ fontSize: 22, color: 'var(--accent)' }}
                  >
                    {a.er}
                  </span>
                </div>
                <div className="erbar" style={{ marginLeft: 48 }}>
                  <i
                    style={{
                      ['--w' as string]: `${pct}%`,
                      ['--bd' as string]: `${0.5 + i * 0.16}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grow" />
      <p className="kicker anim" style={d(0.7)}>
        Average engagement rate per format
      </p>
    </>
  );
}

function ShareCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> What they share
      </span>
      <div className="spacer" />
      <div className="bignum anim drop" style={{ ...d(0.12), fontSize: 104 }}>
        <CountUp value={w.share.stat} delay={0.45} />
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.3), fontSize: 24, marginTop: 20 }}
      >
        {w.share.label}.
      </p>
      <p className="body anim" style={{ ...d(0.46), marginTop: 20 }}>
        {w.share.line}
      </p>
      <div className="spacer" />
    </>
  );
}

function SaveCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> What they save
      </span>
      <div className="spacer" />
      <div className="bignum anim wipe" style={{ ...d(0.12), fontSize: 100 }}>
        <CountUp value={w.save.stat} delay={0.45} />
      </div>
      <p
        className="serif anim"
        style={{ ...d(0.3), fontSize: 22, marginTop: 20 }}
      >
        {w.save.label}.
      </p>
      <p className="body anim" style={{ ...d(0.46), marginTop: 20 }}>
        {w.save.line}
      </p>
      <div className="spacer" />
    </>
  );
}

function CommentCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> What they comment
      </span>
      <div className="spacer" />
      <h1
        className="serif anim"
        style={{ ...d(0.14), fontSize: 32, lineHeight: 1.14 }}
      >
        “{w.comment.quote}”
      </h1>
      <p className="body anim" style={{ ...d(0.34), marginTop: 22 }}>
        {w.comment.line}
      </p>
      <div className="spacer" />
      <div className="rule anim fade" style={{ ...d(0.5), marginBottom: 16 }} />
      <GiaVoice mood={w.voice.comment.mood} delay={0.56}>
        {w.voice.comment.line}
      </GiaVoice>
    </>
  );
}

function IntentCard({ w }: { w: Wrapped }) {
  return (
    <>
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> Purchase intent
      </span>
      <div className="spacer" />
      <div className="bignum anim mask" style={{ ...d(0.12), fontSize: 96 }}>
        {w.purchaseIntent}
      </div>
      <p className="body anim" style={{ ...d(0.34), marginTop: 18 }}>
        When you post with intent, {w.fanTerm} are ready to{' '}
        <strong>show up</strong>.
      </p>
      <div className="spacer" />
      <span className="chip anim" style={d(0.5)}>
        <Sparkle size={13} /> {w.emotionalTrigger}
      </span>
    </>
  );
}

function RecsCard({ w }: { w: Wrapped }) {
  return (
    <>
      <div
        className="anim"
        style={{ ...d(0), display: 'flex', alignItems: 'center', gap: 13 }}
      >
        <span className="gia-ava" />
        <div>
          <span className="eyebrow">GIA&apos;s verdict</span>
          <div className="kicker" style={{ fontSize: 12, marginTop: 3 }}>
            here&apos;s the tea, no chaser
          </div>
        </div>
      </div>
      <div className="grow" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {w.recs.map((r, i) => (
          <div
            key={i}
            className="anim"
            style={{ ...d(0.22 + i * 0.12), display: 'flex', gap: 13 }}
          >
            <span className="idxnum" style={{ fontSize: 20, width: 28 }}>
              0{i + 1}
            </span>
            <p style={{ fontSize: 16, lineHeight: 1.4 }}>{r}</p>
          </div>
        ))}
      </div>
      <div className="grow" />
      <div className="divider anim fade" style={d(0.62)} />
      <p
        className="kicker anim"
        style={{
          ...d(0.7),
          marginTop: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Sparkle size={12} /> Emotional trigger:{' '}
        <strong style={{ color: 'var(--accent)' }}>{w.emotionalTrigger}</strong>
      </p>
    </>
  );
}

function FinaleCard({ w }: { w: Wrapped }) {
  const cells: [string, string][] = [
    ['Total views', w.totalViews],
    ['Avg engagement', w.avgEngagement],
    ['Hook score', `${w.avgHook}/10`],
    ['Purchase intent', w.purchaseIntent],
  ];
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
      <span className="eyebrow anim" style={d(0)}>
        <Sparkle size={13} /> {w.videoCount} hooks read
      </span>
      <div className="grow" />
      <h1
        className="serif anim"
        style={{ ...d(0.08), fontSize: 44, lineHeight: 1.02 }}
      >
        {w.handle}
      </h1>
      <p
        className="kicker anim"
        style={{ ...d(0.16), marginTop: 10, fontSize: 14 }}
      >
        your hooks, wrapped.
      </p>
      <div
        className="anim"
        style={{
          ...d(0.24),
          marginTop: 30,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '22px 12px',
        }}
      >
        {cells.map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 34, lineHeight: 1 }}>
              {v}
            </div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginTop: 8,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      <div
        className="divider anim fade"
        style={{ ...d(0.36), margin: '26px 0 20px', width: '80%' }}
      />
      <div
        className="anim"
        style={{
          ...d(0.4),
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
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
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
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
          {w.voice.finale_signoff}
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
  { key: 'intro', theme: 'wine', render: IntroCard },
  { key: 'views', theme: 'cream', render: ViewsCard },
  { key: 'eng', theme: 'wine', render: EngagementCard },
  { key: 'hook', theme: 'gold', render: HookCard },
  { key: 'biggest', theme: 'ink', render: BiggestCard },
  { key: 'arch', theme: 'cream', render: ArchetypesCard },
  { key: 'share', theme: 'wine', render: ShareCard },
  { key: 'save', theme: 'gold', render: SaveCard },
  { key: 'comment', theme: 'ink', render: CommentCard },
  { key: 'intent', theme: 'wine', render: IntentCard },
  { key: 'recs', theme: 'cream', render: RecsCard },
  { key: 'finale', theme: 'ink', render: FinaleCard },
];
