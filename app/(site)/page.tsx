import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "../config";
import { DataError } from "../components/data-error";
import { SupabaseMissing } from "../components/supabase-missing";
import { fetchAbout, fetchProfile } from "@/lib/data/portfolio";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
  const supabase = await createServerSupabaseClient();
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

  const imageSrc = profile.image_url?.trim() || "/shubham.png";
  const isRemote = /^https?:\/\//i.test(imageSrc);
  const paragraphs = splitParagraphs(about.description);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-8 lg:block">
        <div className="order-2 flex justify-start lg:order-none lg:float-right lg:ml-8 lg:mb-6 lg:w-[40%] lg:max-w-[208px] lg:shrink-0 lg:justify-end lg:[shape-outside:margin-box]">
          <div className="group h-[236px] w-full max-w-[220px] overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-600 lg:h-[228px] lg:max-w-none lg:w-full">
            {isRemote ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={profile.name}
                className="h-full w-full object-cover object-top grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
              />
            ) : (
              <Image
                src={imageSrc}
                alt={profile.name}
                width={400}
                height={600}
                unoptimized
                priority
                className="h-full w-full object-cover object-top grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
              />
            )}
          </div>
        </div>

        <div className="order-1 space-y-4 lg:order-none">
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
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              Check out my <Link href="/projects">Projects</Link> to see my work
              or <a href={socialLinks.email}>get in touch</a> to collaborate.
            </p>
          </div>
        </div>
      </div>

      <div className="clear-both flex flex-wrap gap-3 pt-1">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          View Projects
        </Link>
        <a
          href={socialLinks.email}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
