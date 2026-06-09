'use client';

import type { ReactElement } from 'react';

type NotebookOptionProps = {
  /** Radio group name — shared by every option in the group. */
  name: string;
  /** Value submitted when this option is selected. */
  value: string;
  /** Main label, struck through with a hand-drawn line when selected. */
  label: string;
  /** Optional second line shown beneath the label (not struck through). */
  description?: string;
  /** Controlled selected state. */
  checked: boolean;
  /** Fires when this option is picked. */
  onChange: () => void;
  /** Mark the field required for native form validation. */
  required?: boolean;
};

/**
 * A single radio option styled as a hand-drawn notebook checkbox: a pencil-like
 * dot fills in and a wavy line strikes through the label when selected. The
 * rough, inked edge comes from the `#handDrawnNoise` SVG filter, which the
 * parent form renders once. Structural styles live under `.notebook-checkbox`
 * in globals.css; everything here is the native input plus its decorations.
 */
export default function NotebookOption({
  name,
  value,
  label,
  description,
  checked,
  onChange,
  required = false,
}: NotebookOptionProps): ReactElement {
  return (
    <label className="notebook-checkbox">
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        checked={checked}
        onChange={onChange}
      />
      <span className="checkmark" aria-hidden="true" />
      <span className="body">
        <span className="text">
          {label}
          <svg
            className="cut-line"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M1,11 C18,7 34,14 52,10 S86,7 99,11" />
          </svg>
        </span>
        {description && <span className="desc">{description}</span>}
      </span>
    </label>
  );
}
