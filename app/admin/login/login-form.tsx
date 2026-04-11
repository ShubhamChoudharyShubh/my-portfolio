"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Field,
  PrimaryButton,
  TextInput,
} from "@/app/components/forms/fields";
import { SupabaseMissing } from "@/app/components/supabase-missing";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const configured = useMemo(() => getSupabaseEnv().isConfigured, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    if (!configured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, [configured]);

  if (!configured || !supabase) {
    return <SupabaseMissing />;
  }

  const nextPath = params.get("next") || "/admin";

  return (
    <form
      className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const res = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (res.error) {
          setError(res.error.message);
          setBusy(false);
          return;
        }
        router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
        router.refresh();
        setBusy(false);
      }}
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-50">
          {error}
        </div>
      ) : null}

      <Field label="Email">
        <TextInput
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
      </Field>
      <Field label="Password">
        <TextInput
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
      </Field>

      <PrimaryButton type="submit" disabled={busy} className="w-full">
        Sign in
      </PrimaryButton>
    </form>
  );
}
