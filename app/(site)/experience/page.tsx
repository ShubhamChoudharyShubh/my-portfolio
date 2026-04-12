import { DataError } from "../../components/data-error";
import { SupabaseMissing } from "../../components/supabase-missing";
import { fetchExperience, parseDescriptionLines } from "@/lib/data/portfolio";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 3600;

const yearBadgeClass =
  "inline-flex w-fit shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 sm:px-3 sm:text-[13px] md:absolute md:right-4 md:top-4 md:mt-0";

export default async function ExperiencePage() {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return <SupabaseMissing />;
  }

  let experience;
  try {
    experience = await fetchExperience(supabase);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return <DataError message={message} />;
  }

  if (experience.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Experience
          </h1>
          <div className="mt-2 h-px w-16 bg-neutral-900 dark:bg-neutral-100" />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No experience entries yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Experience
        </h1>
        <div className="mt-2 h-px w-16 bg-neutral-900 dark:bg-neutral-100" />
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute bottom-6 right-[calc(1rem-0.5px)] top-4 w-px bg-neutral-300 dark:bg-neutral-600 sm:right-[calc(1.125rem-0.5px)]"
          aria-hidden
        />

        <ul>
          {experience.map((exp, index) => {
            const isLast = index === experience.length - 1;
            const bullets = parseDescriptionLines(exp.description);
            return (
              <li
                key={exp.id}
                className={`grid grid-cols-[minmax(0,1fr)_2rem] gap-x-4 sm:grid-cols-[minmax(0,1fr)_2.25rem] sm:gap-x-6 ${isLast ? "pb-0" : "pb-10"
                  }`}
              >
                <article className="relative min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-950 sm:px-5 sm:py-6">
                  <h2 className="text-lg font-semibold leading-snug text-neutral-900 dark:text-white md:pr-28">
                    {exp.role}
                  </h2>

                  <span className={`mt-2 ${yearBadgeClass}`}>
                    {exp.start_year} – {exp.end_year}
                  </span>

                  <p className="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {exp.company}
                  </p>

                  {bullets.length > 0 ? (
                    <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {bullets.map((item) => (
                        <li key={item} className="pl-1">
                          <span className="relative -left-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {exp.tech_stack && exp.tech_stack.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>

                <div
                  className="relative z-[1] flex justify-center sm:pt-1"
                  aria-hidden
                >
                  <div className="mt-5 flex h-6 w-6 items-center justify-center sm:mt-6">
                    <span className="h-2 w-2 rounded-full border-2 border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-900" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
