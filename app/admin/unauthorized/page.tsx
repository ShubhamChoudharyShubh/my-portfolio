import Link from "next/link";

export default function AdminUnauthorizedPage() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4 pb-10 pt-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Not authorized
      </h1>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        You are signed in, but this account is not marked as an admin. In Supabase,
        open{" "}
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          Authentication → Users
        </span>
        , select the user, and set{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-900">
          app_metadata
        </code>{" "}
        to include{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-900">
          {JSON.stringify({ role: "admin" })}
        </code>
        .
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Back to login
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
