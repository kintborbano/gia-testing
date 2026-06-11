'use client';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Odometer-style number reveal: each digit is a vertical 0-9 strip that rolls
 * to its target when `start` flips true. Non-digit characters render inline.
 */
export default function SlotNumber({
  value,
  start,
  delay = 0,
  className,
}: {
  value: string;
  start: boolean;
  delay?: number;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={`inline-flex h-[1em] items-start overflow-hidden leading-none ${className ?? ''}`}
      aria-label={value}
    >
      {value.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <span
            key={i}
            aria-hidden
            className="report-slot-col inline-flex flex-col"
            style={{
              transform: start
                ? `translateY(-${Number(ch) * 10}%)`
                : 'translateY(0)',
              transition: `transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay + i * 120}ms`,
            }}
          >
            {DIGITS.map((d) => (
              <span
                key={d}
                className="leading-none"
                style={{
                  // Serif numerals overshoot their line box, so neighboring
                  // digits can bleed into view at rest — fade them out once
                  // this column's roll has landed.
                  opacity: !start || d === ch ? 1 : 0,
                  transition: `opacity 0.25s ease ${delay + i * 120 + 1200}ms`,
                }}
              >
                {d}
              </span>
            ))}
          </span>
        ) : (
          <span key={i} aria-hidden className="leading-none">
            {ch}
          </span>
        )
      )}
    </span>
  );
}
