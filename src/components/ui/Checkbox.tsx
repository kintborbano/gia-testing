'use client';

import type { ReactElement } from 'react';

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
  /** Extra classes merged onto the box wrapper (e.g. `mt-0.5` for alignment). */
  className?: string;
};

/**
 * Square consent checkbox for the brand-maroon surface: a white-outlined box
 * with a hard offset shadow that fills gold and reveals a maroon tick when
 * ticked. Structural styles live under `.consent-checkbox` in globals.css.
 * Render it inside a <label> alongside the caption text — the root is a <span>
 * so it never nests a second <label>.
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
    <span className={`consent-checkbox ${className}`}>
      <input
        type="checkbox"
        name={name}
        required={required}
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="checkmark" aria-hidden="true" />
    </span>
  );
}
