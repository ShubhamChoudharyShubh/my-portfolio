import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-8 pb-10 pt-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Admin login
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Sign in with the Supabase user that has{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-900">
            app_metadata.role = admin
          </code>
          .
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-neutral-600 dark:text-neutral-400">Loading…</p>}>
        <LoginForm />
      </Suspense>

      <Link
        href="/"
        className="inline-flex text-sm font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 dark:text-neutral-100 dark:decoration-neutral-600"
      >
        Back to site
      </Link>
    </div>
  );
}
