export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
      {children}
    </h2>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
      {children}
    </span>
  );
}

export function Bullet({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-gray-700">
      <span
        aria-hidden
        className="bg-brand-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
      />
      <span>{text}</span>
    </li>
  );
}
