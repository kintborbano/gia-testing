export default function FeaturesMain(): React.ReactElement {
  const features = [
    'Scroll-stopping hook score',
    'Audience curiosity gaps',
    'Retention-friendly rewrite prompts',
  ];

  return (
    <section className="w-full bg-white px-5 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-4xl font-semibold tracking-normal text-gray-950 md:text-5xl">
          Turn rough TikTok ideas into hooks people want to finish.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg border border-gray-200 p-6"
            >
              <p className="text-lg font-semibold text-gray-900">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
