interface TiktokInputStepProps {
  value: string;
  error: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}

export default function TiktokInputStep({
  value,
  error,
  onValueChange,
  onSubmit,
}: TiktokInputStepProps): React.ReactElement {
  return (
    <section className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Step 1: Enter TikTok URL
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="https://www.tiktok.com/@username/video/..."
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={onSubmit}
          className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600"
        >
          Analyze hook
        </button>
      </div>
    </section>
  );
}
