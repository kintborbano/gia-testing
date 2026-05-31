export default function Stats(): React.ReactElement {
  const stats = [
    { value: '3s', label: 'Hook window analyzed' },
    { value: '87%', label: 'Signals mapped to retention' },
    { value: '24h', label: 'Typical report turnaround' },
  ];

  return (
    <section className="w-full bg-white px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-t border-gray-200 pt-6 text-center md:text-left"
          >
            <div className="text-4xl font-semibold text-[#8c1f2e]">
              {stat.value}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
