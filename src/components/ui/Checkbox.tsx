'use client';

import type { ReactElement } from 'react';
import { Check } from 'lucide-react';

type CheckboxProps = {
  /** Form field name submitted with the surrounding form. */
  name?: string;
  /** Controlled checked state. */
  checked: boolean;
  /** Fires with the next checked value. */
  onChange: (checked: boolean) => void;
  /** Mark the field required for native form validation. */
  required?: boolean;
  /** Accessible label when there's no associated visible <label> text. */
  'aria-label'?: string;
  /** Extra classes merged onto the 18px box (e.g. `mt-0.5` for text alignment). */
  className?: string;
};

/**
 * Minimal square checkbox for the brand-maroon surface: a thin white-bordered
 * box that reveals a white check when ticked — no fill, no chrome. Render it
 * inside a <label> alongside the caption text.
 */
export default function Checkbox({
  name,
  checked,
  onChange,
  required = false,
  className = '',
  'aria-label': ariaLabel,
}: CheckboxProps): ReactElement {
  return (
    <span
      className={`relative inline-flex size-[18px] shrink-0 items-center justify-center ${className}`}
    >
      <input
        type="checkbox"
        name={name}
        required={required}
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-[4px] border border-white bg-transparent transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      />
      <Check
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none relative size-[12px] text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
      />
    </span>
  );
}
