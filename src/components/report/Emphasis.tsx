import { toText } from '@/lib/text';

// Gemini copy uses **double asterisks** for emphasis — render them as bold
// instead of leaking the markers. Accepts unknown because the payload shape
// occasionally drifts (arrays/objects where strings were prompted).
export default function Emphasis({
  text,
}: {
  text: unknown;
}): React.ReactElement {
  const parts = toText(text).split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}
