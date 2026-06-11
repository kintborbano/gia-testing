// Gemini copy uses **double asterisks** for emphasis — render them as bold
// instead of leaking the markers.
export default function Emphasis({
  text,
}: {
  text: string;
}): React.ReactElement {
  const parts = text.split(/\*\*(.+?)\*\*/g);
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
