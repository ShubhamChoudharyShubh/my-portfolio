import Link from "next/link";
import { socialLinks } from "../config";
import { DataError } from "../components/data-error";
import { SupabaseMissing } from "../components/supabase-missing";
import { fetchAbout, fetchProfile } from "@/lib/data/portfolio";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { DotPortrait } from "../components/dot-portrait";

export const revalidate = 3600; // Revalidate every hour

function splitParagraphs(text: string) {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length > 0) return parts;
  return text
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function Page() {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return <SupabaseMissing />;
  }

  let profile;
  let about;
  try {
    [profile, about] = await Promise.all([
      fetchProfile(supabase),
      fetchAbout(supabase),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return <DataError message={message} />;
  }

  if (!profile || !about) {
    return (
      <section className="space-y-4 rounded-2xl border border-neutral-200 px-5 py-6 dark:border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          No portfolio content yet
        </h1>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Add a row in{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-900">
            profiles
          </code>{" "}
          and{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-900">
            about
          </code>{" "}
          from the admin dashboard, or run the optional seed SQL.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex text-sm font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 dark:text-neutral-100 dark:decoration-neutral-600"
        >
          Admin login
        </Link>
      </section>
    );
  }

  const paragraphs = splitParagraphs(about.description);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 lg:items-start">
        {/* Dot Portrait — right side on desktop, top on mobile */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:shrink-0 lg:w-[260px]">
          <div className="w-full max-w-[260px] lg:max-w-none">
            <DotPortrait />
          </div>
        </div>

        {/* Text — left side on desktop, below portrait on mobile */}
        <div className="order-2 lg:order-1 flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              About Me
            </h1>
            <div className="mt-2 h-px w-16 bg-neutral-900 dark:bg-neutral-100" />
            {profile.title ? (
              <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {profile.title}
              </p>
            ) : null}
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-pretty prose-a:font-medium prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-400 prose-a:underline-offset-4 dark:prose-a:text-neutral-100 dark:prose-a:decoration-neutral-500">
            {profile.bio ? <p>{profile.bio}</p> : null}
            {paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          View My Work
        </Link>
        <a
          href={socialLinks.email}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        >
          Let’s Talk
        </a>
      </div>
    </section>
  );
}
