export default function ReportNotFound(): React.ReactElement {
  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Report not found</h1>
        <p className="mt-3 text-base text-gray-600">
          We could not find a report for that TikTok handle.
        </p>
      </section>
    </main>
  );
}
