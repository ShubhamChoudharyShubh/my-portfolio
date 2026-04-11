export function DataError({ message }: { message: string }) {
  return (
    <section className="space-y-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-50">
      <h1 className="text-xl font-semibold tracking-tight">Could not load data</h1>
      <p className="text-sm leading-relaxed">{message}</p>
    </section>
  );
}
