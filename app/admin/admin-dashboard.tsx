"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DangerButton,
  Field,
  GhostButton,
  PrimaryButton,
  Select,
  TextArea,
  TextInput,
} from "@/app/components/forms/fields";
import { TagInput } from "@/app/components/forms/tag-input";
import { SupabaseMissing } from "@/app/components/supabase-missing";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type {
  AboutRow,
  EducationRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
} from "@/lib/types/portfolio";
import { ADMIN_PROJECT_CATEGORIES } from "@/lib/types/portfolio";

type Banner = { kind: "success" | "error"; text: string };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const configured = useMemo(() => getSupabaseEnv().isConfigured, []);

  const [banner, setBanner] = useState<Banner | null>(null);
  const [busy, setBusy] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [aboutRows, setAboutRows] = useState<AboutRow[]>([]);
  const [education, setEducation] = useState<EducationRow[]>([]);
  const [experience, setExperience] = useState<ExperienceRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const [profileEditId, setProfileEditId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [aboutEditId, setAboutEditId] = useState<string | null>(null);
  const [aboutDescription, setAboutDescription] = useState("");

  const [eduEditId, setEduEditId] = useState<string | null>(null);
  const [eduTitle, setEduTitle] = useState("");
  const [eduInstitute, setEduInstitute] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduScore, setEduScore] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");

  const [expEditId, setExpEditId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");

  const [projEditId, setProjEditId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projTags, setProjTags] = useState<string[]>([]);
  const [projCategory, setProjCategory] = useState<string>(
    ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress",
  );
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");

  const supabase = useMemo(() => {
    if (!configured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, [configured]);

  const reload = useCallback(async () => {
    if (!supabase) return;
    setBusy(true);
    setBanner(null);

    const [p, a, e, x, pr] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("about").select("*").order("created_at", { ascending: false }),
      supabase.from("education").select("*").order("created_at", { ascending: false }),
      supabase.from("experience").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
    ]);

    const firstError =
      p.error || a.error || e.error || x.error || pr.error || null;
    if (firstError) {
      setBanner({ kind: "error", text: firstError.message });
    }

    setProfiles((p.data ?? []) as ProfileRow[]);
    setAboutRows((a.data ?? []) as AboutRow[]);
    setEducation((e.data ?? []) as EducationRow[]);
    setExperience((x.data ?? []) as ExperienceRow[]);
    setProjects(
      (pr.data ?? []).map((row) => ({
        ...row,
        tech_stack: Array.isArray(row.tech_stack)
          ? row.tech_stack.map(String)
          : [],
      })) as ProjectRow[],
    );

    setBusy(false);
    setInitializing(false);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }
    void reload();
  }, [reload, supabase]);

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    router.replace("/");
    router.refresh();
  }

  if (!configured || !supabase) {
    return <SupabaseMissing />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Admin dashboard
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage public portfolio content stored in Supabase.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GhostButton type="button" onClick={() => void reload()} disabled={busy}>
            Refresh
          </GhostButton>
          <GhostButton type="button" onClick={() => void signOut()} disabled={busy}>
            Sign out
          </GhostButton>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          >
            View site
          </Link>
        </div>
      </header>

      {banner ? (
        <div
          className={
            banner.kind === "error"
              ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-50"
              : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-50"
          }
        >
          {banner.text}
        </div>
      ) : null}

      {initializing ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading…</p>
      ) : null}

      <Section
        title="Profile"
        description="Public identity used on the home page (latest row wins for the public site)."
      >
        <form
          className="space-y-4"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!supabase) return;
            setBusy(true);
            setBanner(null);
            const payload = {
              name: profileName.trim(),
              title: profileTitle.trim() || null,
              bio: profileBio.trim() || null,
              image_url: profileImageUrl.trim() || null,
            };
            const res = profileEditId
              ? await supabase
                .from("profiles")
                .update(payload)
                .eq("id", profileEditId)
              : await supabase.from("profiles").insert(payload);
            if (res.error) setBanner({ kind: "error", text: res.error.message });
            else {
              setBanner({ kind: "success", text: "Profile saved." });
              setProfileEditId(null);
              setProfileName("");
              setProfileTitle("");
              setProfileBio("");
              setProfileImageUrl("");
              await reload();
            }
            setBusy(false);
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <TextInput
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </Field>
            <Field label="Title">
              <TextInput
                value={profileTitle}
                onChange={(e) => setProfileTitle(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Bio (optional lead)">
            <TextArea
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
            />
          </Field>
          <Field label="Image URL (optional)">
            <TextInput
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="/shubham.png or https://…"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit" disabled={busy}>
              {profileEditId ? "Update profile" : "Add profile"}
            </PrimaryButton>
            {profileEditId ? (
              <GhostButton
                type="button"
                disabled={busy}
                onClick={() => {
                  setProfileEditId(null);
                  setProfileName("");
                  setProfileTitle("");
                  setProfileBio("");
                  setProfileImageUrl("");
                }}
              >
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {profiles.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {row.name}
                </p>
                <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                  {row.title ?? "—"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setProfileEditId(row.id);
                    setProfileName(row.name);
                    setProfileTitle(row.title ?? "");
                    setProfileBio(row.bio ?? "");
                    setProfileImageUrl(row.image_url ?? "");
                  }}
                >
                  Edit
                </GhostButton>
                <DangerButton
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase) return;
                    if (!window.confirm("Delete this profile row?")) return;
                    setBusy(true);
                    const res = await supabase.from("profiles").delete().eq("id", row.id);
                    if (res.error) setBanner({ kind: "error", text: res.error.message });
                    else {
                      setBanner({ kind: "success", text: "Deleted." });
                      await reload();
                    }
                    setBusy(false);
                  }}
                >
                  Delete
                </DangerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="About"
        description="Long-form about copy (latest row wins on the public site). Use blank lines between paragraphs."
      >
        <form
          className="space-y-4"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!supabase) return;
            setBusy(true);
            setBanner(null);
            const payload = { description: aboutDescription.trim() };
            const res = aboutEditId
              ? await supabase.from("about").update(payload).eq("id", aboutEditId)
              : await supabase.from("about").insert(payload);
            if (res.error) setBanner({ kind: "error", text: res.error.message });
            else {
              setBanner({ kind: "success", text: "About saved." });
              setAboutEditId(null);
              setAboutDescription("");
              await reload();
            }
            setBusy(false);
          }}
        >
          <Field label="Description">
            <TextArea
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              required
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit" disabled={busy}>
              {aboutEditId ? "Update about" : "Add about"}
            </PrimaryButton>
            {aboutEditId ? (
              <GhostButton
                type="button"
                disabled={busy}
                onClick={() => {
                  setAboutEditId(null);
                  setAboutDescription("");
                }}
              >
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {aboutRows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between"
            >
              <p className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-200">
                {row.description}
              </p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setAboutEditId(row.id);
                    setAboutDescription(row.description);
                  }}
                >
                  Edit
                </GhostButton>
                <DangerButton
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase) return;
                    if (!window.confirm("Delete this about row?")) return;
                    setBusy(true);
                    const res = await supabase.from("about").delete().eq("id", row.id);
                    if (res.error) setBanner({ kind: "error", text: res.error.message });
                    else {
                      setBanner({ kind: "success", text: "Deleted." });
                      await reload();
                    }
                    setBusy(false);
                  }}
                >
                  Delete
                </DangerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <form
          className="space-y-4"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!supabase) return;
            setBusy(true);
            setBanner(null);
            const payload = {
              title: eduTitle.trim(),
              institute: eduInstitute.trim(),
              field: eduField.trim() || null,
              score: eduScore.trim() || null,
              start_year: eduStart.trim(),
              end_year: eduEnd.trim(),
            };
            const res = eduEditId
              ? await supabase.from("education").update(payload).eq("id", eduEditId)
              : await supabase.from("education").insert(payload);
            if (res.error) setBanner({ kind: "error", text: res.error.message });
            else {
              setBanner({ kind: "success", text: "Education saved." });
              setEduEditId(null);
              setEduTitle("");
              setEduInstitute("");
              setEduField("");
              setEduScore("");
              setEduStart("");
              setEduEnd("");
              await reload();
            }
            setBusy(false);
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title (degree / program)">
              <TextInput value={eduTitle} onChange={(e) => setEduTitle(e.target.value)} required />
            </Field>
            <Field label="Institute">
              <TextInput
                value={eduInstitute}
                onChange={(e) => setEduInstitute(e.target.value)}
                required
              />
            </Field>
            <Field label="Field">
              <TextInput value={eduField} onChange={(e) => setEduField(e.target.value)} />
            </Field>
            <Field label="Score / highlights (optional)">
              <TextInput value={eduScore} onChange={(e) => setEduScore(e.target.value)} />
            </Field>
            <Field label="Start year">
              <TextInput value={eduStart} onChange={(e) => setEduStart(e.target.value)} required />
            </Field>
            <Field label="End year">
              <TextInput value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} required />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit" disabled={busy}>
              {eduEditId ? "Update education" : "Add education"}
            </PrimaryButton>
            {eduEditId ? (
              <GhostButton
                type="button"
                disabled={busy}
                onClick={() => {
                  setEduEditId(null);
                  setEduTitle("");
                  setEduInstitute("");
                  setEduField("");
                  setEduScore("");
                  setEduStart("");
                  setEduEnd("");
                }}
              >
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {education.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {row.title}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {row.institute} · {row.start_year}–{row.end_year}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setEduEditId(row.id);
                    setEduTitle(row.title);
                    setEduInstitute(row.institute);
                    setEduField(row.field ?? "");
                    setEduScore(row.score ?? "");
                    setEduStart(row.start_year);
                    setEduEnd(row.end_year);
                  }}
                >
                  Edit
                </GhostButton>
                <DangerButton
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase) return;
                    if (!window.confirm("Delete this education row?")) return;
                    setBusy(true);
                    const res = await supabase.from("education").delete().eq("id", row.id);
                    if (res.error) setBanner({ kind: "error", text: res.error.message });
                    else {
                      setBanner({ kind: "success", text: "Deleted." });
                      await reload();
                    }
                    setBusy(false);
                  }}
                >
                  Delete
                </DangerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Experience"
        description="Put each bullet on its own line in the description field."
      >
        <form
          className="space-y-4"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!supabase) return;
            setBusy(true);
            setBanner(null);
            const payload = {
              role: expRole.trim(),
              company: expCompany.trim(),
              description: expDescription.trim(),
              start_year: expStart.trim(),
              end_year: expEnd.trim(),
            };
            const res = expEditId
              ? await supabase.from("experience").update(payload).eq("id", expEditId)
              : await supabase.from("experience").insert(payload);
            if (res.error) setBanner({ kind: "error", text: res.error.message });
            else {
              setBanner({ kind: "success", text: "Experience saved." });
              setExpEditId(null);
              setExpRole("");
              setExpCompany("");
              setExpDescription("");
              setExpStart("");
              setExpEnd("");
              await reload();
            }
            setBusy(false);
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Role">
              <TextInput value={expRole} onChange={(e) => setExpRole(e.target.value)} required />
            </Field>
            <Field label="Company">
              <TextInput
                value={expCompany}
                onChange={(e) => setExpCompany(e.target.value)}
                required
              />
            </Field>
            <Field label="Start">
              <TextInput value={expStart} onChange={(e) => setExpStart(e.target.value)} required />
            </Field>
            <Field label="End">
              <TextInput value={expEnd} onChange={(e) => setExpEnd(e.target.value)} required />
            </Field>
          </div>
          <Field label="Description (one bullet per line)">
            <TextArea
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              required
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit" disabled={busy}>
              {expEditId ? "Update experience" : "Add experience"}
            </PrimaryButton>
            {expEditId ? (
              <GhostButton
                type="button"
                disabled={busy}
                onClick={() => {
                  setExpEditId(null);
                  setExpRole("");
                  setExpCompany("");
                  setExpDescription("");
                  setExpStart("");
                  setExpEnd("");
                }}
              >
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {experience.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {row.role}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {row.company} · {row.start_year}–{row.end_year}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setExpEditId(row.id);
                    setExpRole(row.role);
                    setExpCompany(row.company);
                    setExpDescription(row.description);
                    setExpStart(row.start_year);
                    setExpEnd(row.end_year);
                  }}
                >
                  Edit
                </GhostButton>
                <DangerButton
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase) return;
                    if (!window.confirm("Delete this experience row?")) return;
                    setBusy(true);
                    const res = await supabase.from("experience").delete().eq("id", row.id);
                    if (res.error) setBanner({ kind: "error", text: res.error.message });
                    else {
                      setBanner({ kind: "success", text: "Deleted." });
                      await reload();
                    }
                    setBusy(false);
                  }}
                >
                  Delete
                </DangerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <form
          className="space-y-4"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!supabase) return;
            setBusy(true);
            setBanner(null);
            const payload = {
              title: projTitle.trim(),
              description: projDescription.trim(),
              tech_stack: projTags,
              category: projCategory,
              live_url: projLiveUrl.trim() || null,
              image_url: projImageUrl.trim() || null,
            };
            const res = projEditId
              ? await supabase.from("projects").update(payload).eq("id", projEditId)
              : await supabase.from("projects").insert(payload);
            if (res.error) setBanner({ kind: "error", text: res.error.message });
            else {
              setBanner({ kind: "success", text: "Project saved." });
              setProjEditId(null);
              setProjTitle("");
              setProjDescription("");
              setProjTags([]);
              setProjCategory(ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress");
              setProjLiveUrl("");
              setProjImageUrl("");
              await reload();
            }
            setBusy(false);
          }}
        >
          <Field label="Title">
            <TextInput value={projTitle} onChange={(e) => setProjTitle(e.target.value)} required />
          </Field>
          <Field label="Description">
            <TextArea
              value={projDescription}
              onChange={(e) => setProjDescription(e.target.value)}
              required
            />
          </Field>
          <Field label="Tech stack">
            <TagInput value={projTags} onChange={setProjTags} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select
                value={projCategory}
                onChange={(e) => setProjCategory(e.target.value)}
              >
                {ADMIN_PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Live URL (optional)">
              <TextInput
                value={projLiveUrl}
                onChange={(e) => setProjLiveUrl(e.target.value)}
                placeholder="https://"
              />
            </Field>
            <Field label="Image URL (optional)">
              <TextInput
                value={projImageUrl}
                onChange={(e) => setProjImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit" disabled={busy}>
              {projEditId ? "Update project" : "Add project"}
            </PrimaryButton>
            {projEditId ? (
              <GhostButton
                type="button"
                disabled={busy}
                onClick={() => {
                  setProjEditId(null);
                  setProjTitle("");
                  setProjDescription("");
                  setProjTags([]);
                  setProjCategory(ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress");
                  setProjLiveUrl("");
                  setProjImageUrl("");
                }}
              >
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {projects.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {row.title}
                </p>
                <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                  {row.category}
                  {row.tech_stack.length
                    ? ` · ${row.tech_stack.join(", ")}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setProjEditId(row.id);
                    setProjTitle(row.title);
                    setProjDescription(row.description);
                    setProjTags(row.tech_stack ?? []);
                    setProjCategory(row.category);
                    setProjLiveUrl(row.live_url ?? "");
                    setProjImageUrl(row.image_url ?? "");
                  }}
                >
                  Edit
                </GhostButton>
                <DangerButton
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase) return;
                    if (!window.confirm("Delete this project?")) return;
                    setBusy(true);
                    const res = await supabase.from("projects").delete().eq("id", row.id);
                    if (res.error) setBanner({ kind: "error", text: res.error.message });
                    else {
                      setBanner({ kind: "success", text: "Deleted." });
                      await reload();
                    }
                    setBusy(false);
                  }}
                >
                  Delete
                </DangerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
