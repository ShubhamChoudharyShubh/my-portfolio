export function SupabaseMissing() {
  return (
    <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-50">
      <h1 className="text-xl font-semibold tracking-tight">
        Supabase is not configured
      </h1>
      <p className="text-sm leading-relaxed">
        Add{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-900/80">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-900/80">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to your environment, restart the dev server, and run the SQL migration
        in the Supabase SQL editor.
      </p>
    </section>
  );
}
