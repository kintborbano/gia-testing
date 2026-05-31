export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-widest text-[#8c1f2e] uppercase">
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
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8c1f2e]"
      />
      <span>{text}</span>
    </li>
  );
}
