"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  Briefcase,
  ChevronRight,
  Code2,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
  BarChart3,
  TrendingUp,
  Globe,
  ExternalLink,
  Link2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Banner = { kind: "success" | "error"; text: string };

function Section({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 ${className}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
      <div className="pt-2">{children}</div>
    </section>
  );
}

const MOCK_TRAFFIC_DATA = [
  { day: "01 Apr", visitors: 120, views: 450 },
  { day: "02 Apr", visitors: 150, views: 520 },
  { day: "03 Apr", visitors: 180, views: 610 },
  { day: "04 Apr", visitors: 140, views: 480 },
  { day: "05 Apr", visitors: 210, views: 730 },
  { day: "06 Apr", visitors: 250, views: 890 },
  { day: "07 Apr", visitors: 230, views: 820 },
];

const MOCK_STATS = [
  { label: "Total Visitors", value: "2,480", icon: User, color: "text-blue-500" },
  { label: "Page Views", value: "10,240", icon: BarChart3, color: "text-purple-500" },
  { label: "Avg. Session", value: "2m 45s", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Top Region", value: "India", icon: Globe, color: "text-amber-500" },
];

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
  const [eduTags, setEduTags] = useState<string[]>([]);

  const [expEditId, setExpEditId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expTags, setExpTags] = useState<string[]>([]);

  const [projEditId, setProjEditId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projSubheading, setProjSubheading] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projTags, setProjTags] = useState<string[]>([]);
  const [projCategory, setProjCategory] = useState<string>(
    ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress",
  );
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projGithubUrl, setProjGithubUrl] = useState("");
  const [projYear, setProjYear] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");

  const aboutTextRef = useRef<HTMLTextAreaElement>(null);
  const projDescRef = useRef<HTMLTextAreaElement>(null);

  const insertLink = (ref: React.RefObject<HTMLTextAreaElement | null>, setter: (v: string) => void) => {
    const textarea = ref.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const url = window.prompt("Enter URL:", "https://");

    if (url) {
      const linkHtml = `<a href="${url}">${selectedText || "link"}</a>`;
      const newText = text.substring(0, start) + linkHtml + text.substring(end);
      setter(newText);
      // Reset focus and selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + linkHtml.length, start + linkHtml.length);
      }, 0);
    }
  };
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState({ total_views: 0, unique_visitors: 0, bounce_rate: "0%" });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "about", label: "About", icon: Info },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code2 },
  ];

  const supabase = useMemo(() => {
    if (!configured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, [configured]);

  const triggerRevalidate = async () => {
    try {
      await fetch("/api/revalidate");
    } catch (err) {
      console.error("Revalidation failed:", err);
    }
  };

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
    setEducation(
      (e.data ?? []).map((row) => ({
        ...row,
        tech_stack: Array.isArray(row.tech_stack)
          ? row.tech_stack.map(String)
          : [],
      })) as EducationRow[],
    );
    setExperience(
      (x.data ?? []).map((row) => ({
        ...row,
        tech_stack: Array.isArray(row.tech_stack)
          ? row.tech_stack.map(String)
          : [],
      })) as ExperienceRow[],
    );
    setProjects(
      (pr.data ?? []).map((row) => ({
        ...row,
        tech_stack: Array.isArray(row.tech_stack)
          ? row.tech_stack.map(String)
          : [],
      })) as ProjectRow[],
    );

    // Fallback to Dummy Traffic Stats
    setVisitorStats({
      total_views: 1248,
      unique_visitors: 482,
      bounce_rate: "32%"
    });

    setTrafficData([
      { day: "06 Apr", visitors: 45, views: 120 },
      { day: "07 Apr", visitors: 52, views: 145 },
      { day: "08 Apr", visitors: 38, views: 98 },
      { day: "09 Apr", visitors: 65, views: 180 },
      { day: "10 Apr", visitors: 48, views: 130 },
      { day: "11 Apr", visitors: 72, views: 210 },
      { day: "12 Apr", visitors: 58, views: 165 },
    ]);

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

  const renderMetricsDashboard = () => {
    const statsArr = [
      { label: "Total Page Views", value: visitorStats.total_views.toLocaleString(), icon: BarChart3, color: "text-blue-500" },
      { label: "Est. Visitors", value: Math.ceil(visitorStats.unique_visitors).toLocaleString(), icon: User, color: "text-purple-500" },
      { label: "Bounce Rate", value: visitorStats.bounce_rate, icon: TrendingUp, color: "text-emerald-500" },
      { label: "Top Region", value: "India", icon: Globe, color: "text-amber-500" },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsArr.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex items-center gap-4">
                <div className={`rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Traffic Overview" description="Monthly visitors and page views">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData.length > 0 ? trafficData : MOCK_TRAFFIC_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Visitor Activity" description="Daily unique visitors">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData.length > 0 ? trafficData : MOCK_TRAFFIC_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      </div>
    );
  };

  const renderProfileSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      {/* Left: List */}
      <div className="space-y-6 order-2 lg:order-1">
        <Section title="Existing Profiles">
          <div className="space-y-3">
            {profiles.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">{row.name}</p>
                  <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">{row.title}</p>
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
                      if (!supabase || !window.confirm("Delete?")) return;
                      setBusy(true);
                      await supabase.from("profiles").delete().eq("id", row.id);
                      await reload();
                      await triggerRevalidate();
                      setBusy(false);
                    }}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
            {profiles.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No profiles found.</p>}
          </div>
        </Section>
      </div>

      {/* Right: Form */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8">
        <Section
          title={profileEditId ? "Edit Profile" : "Add Profile"}
          description="Public identity used on the home page."
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
                ? await supabase.from("profiles").update(payload).eq("id", profileEditId)
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
                await triggerRevalidate();
              }
              setBusy(false);
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <Field label="Name">
                <TextInput value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
              </Field>
              <Field label="Title">
                <TextInput value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} />
              </Field>
              <Field label="Bio (optional lead)">
                <TextArea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} />
              </Field>
              <Field label="Image URL (optional)">
                <TextInput value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} placeholder="/shubham.png or https://…" />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton type="submit" disabled={busy}>
                {profileEditId ? "Update profile" : "Add profile"}
              </PrimaryButton>
              {profileEditId && (
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
              )}
            </div>
          </form>
        </Section>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      <div className="space-y-6 order-2 lg:order-1">
        <Section title="Current About Text">
          <div className="space-y-4">
            {aboutRows.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between">
                <p className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-200">{row.description}</p>
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
                      if (!supabase || !window.confirm("Delete?")) return;
                      setBusy(true);
                      await supabase.from("about").delete().eq("id", row.id);
                      await reload();
                      await triggerRevalidate();
                      setBusy(false);
                    }}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
            {aboutRows.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No content yet.</p>}
          </div>
        </Section>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-8">
        <Section
          title={aboutEditId ? "Edit About Copy" : "Add About Copy"}
          description="Paragraphs appear in the order created."
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
                await triggerRevalidate();
              }
              setBusy(false);
            }}
          >
            <Field
              label="Description"
              onAction={{
                icon: Link2,
                label: "Link",
                onClick: () => insertLink(aboutTextRef, setAboutDescription),
              }}
            >
              <TextArea
                ref={aboutTextRef}
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                required
                rows={6}
              />
            </Field>
            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton type="submit" disabled={busy}>
                {aboutEditId ? "Update about" : "Add about"}
              </PrimaryButton>
              {aboutEditId && (
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
              )}
            </div>
          </form>
        </Section>
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      <div className="order-2 lg:order-1 space-y-4">
        <Section title="Education List">
          <div className="space-y-3">
            {education.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{row.title}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {row.institute} · {row.start_year}-{row.end_year}
                    {row.field && ` · ${row.field}`}
                    {row.score && ` · ${row.score}`}
                  </p>
                  {row.tech_stack && row.tech_stack.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tech_stack.slice(0, 5).map((t) => (
                        <span key={t} className="rounded bg-neutral-100 px-1 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
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
                      setEduTags(row.tech_stack ?? []);
                    }}
                  >
                    Edit
                  </GhostButton>
                  <DangerButton
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (!supabase || !window.confirm("Delete?")) return;
                      setBusy(true);
                      await supabase.from("education").delete().eq("id", row.id);
                      await reload();
                      await triggerRevalidate();
                      setBusy(false);
                    }}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No entries.</p>}
          </div>
        </Section>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-8">
        <Section title={eduEditId ? "Edit Education" : "Add Education"}>
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
                tech_stack: eduTags,
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
                setEduTags([]);
                await reload();
                await triggerRevalidate();
              }
              setBusy(false);
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <Field label="Title">
                <TextInput value={eduTitle} onChange={(e) => setEduTitle(e.target.value)} required />
              </Field>
              <Field label="Institute">
                <TextInput value={eduInstitute} onChange={(e) => setEduInstitute(e.target.value)} required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Field of Study">
                  <TextInput value={eduField} onChange={(e) => setEduField(e.target.value)} placeholder="e.g. Computer Science" />
                </Field>
                <Field label="Score / GPA">
                  <TextInput value={eduScore} onChange={(e) => setEduScore(e.target.value)} placeholder="e.g. 8.5/10" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Year">
                  <TextInput value={eduStart} onChange={(e) => setEduStart(e.target.value)} required />
                </Field>
                <Field label="End Year">
                  <TextInput value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} required />
                </Field>
              </div>
              <Field label="Skills (Tags)">
                <TagInput value={eduTags} onChange={setEduTags} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton type="submit" disabled={busy}>
                {eduEditId ? "Update" : "Add Education"}
              </PrimaryButton>
              {eduEditId && (
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
                    setEduTags([]);
                  }}
                >
                  Cancel
                </GhostButton>
              )}
            </div>
          </form>
        </Section>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-start">
      <div className="order-2 lg:order-1 space-y-4">
        <Section title="Experience History">
          <div className="space-y-3">
            {experience.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-50">{row.role}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{row.company} · {row.start_year}-{row.end_year}</p>
                  {row.tech_stack && row.tech_stack.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tech_stack.slice(0, 5).map((t) => (
                        <span key={t} className="rounded bg-neutral-100 px-1 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
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
                      setExpTags(row.tech_stack ?? []);
                    }}
                  >
                    Edit
                  </GhostButton>
                  <DangerButton
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (!supabase || !window.confirm("Delete?")) return;
                      setBusy(true);
                      await supabase.from("experience").delete().eq("id", row.id);
                      await reload();
                      await triggerRevalidate();
                      setBusy(false);
                    }}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
            {experience.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No entries.</p>}
          </div>
        </Section>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-8">
        <Section title={expEditId ? "Edit Experience" : "Add Experience"}>
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
                tech_stack: expTags,
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
                setExpTags([]);
                await reload();
                await triggerRevalidate();
              }
              setBusy(false);
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <Field label="Role / Position">
                <TextInput value={expRole} onChange={(e) => setExpRole(e.target.value)} required />
              </Field>
              <Field label="Company / Organization">
                <TextInput value={expCompany} onChange={(e) => setExpCompany(e.target.value)} required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Year">
                  <TextInput value={expStart} onChange={(e) => setExpStart(e.target.value)} required />
                </Field>
                <Field label="End Year">
                  <TextInput value={expEnd} onChange={(e) => setExpEnd(e.target.value)} required />
                </Field>
              </div>
              <Field label="Skills (Tags)">
                <TagInput value={expTags} onChange={setExpTags} />
              </Field>
              <Field label="Description (one bullet per line)">
                <TextArea value={expDescription} onChange={(e) => setExpDescription(e.target.value)} required rows={4} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton type="submit" disabled={busy}>
                {expEditId ? "Update" : "Add Experience"}
              </PrimaryButton>
              {expEditId && (
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
                    setExpTags([]);
                  }}
                >
                  Cancel
                </GhostButton>
              )}
            </div>
          </form>
        </Section>
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-start">
      <div className="order-2 lg:order-1 space-y-4">
        <Section title="Project Portfolio">
          <div className="space-y-3">
            {projects.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-neutral-900 dark:text-neutral-50">{row.title}</p>
                    {row.github_url && <FaGithub className="h-3 w-3 text-neutral-400" />}
                  </div>
                  <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {row.category}
                    {row.project_year && ` · ${row.project_year}`}
                    {row.tech_stack.length > 0 && ` · ${row.tech_stack.slice(0, 3).join(", ")}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <GhostButton
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setProjEditId(row.id);
                      setProjTitle(row.title);
                      setProjSubheading(row.subheading ?? "");
                      setProjDescription(row.description);
                      setProjTags(row.tech_stack);
                      setProjCategory(row.category);
                      setProjLiveUrl(row.live_url ?? "");
                      setProjGithubUrl(row.github_url ?? "");
                      setProjYear(row.project_year ?? "");
                      setProjImageUrl(row.image_url ?? "");
                    }}
                  >
                    Edit
                  </GhostButton>
                  <DangerButton
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (!supabase || !window.confirm("Delete?")) return;
                      setBusy(true);
                      await supabase.from("projects").delete().eq("id", row.id);
                      await reload();
                      await triggerRevalidate();
                      setBusy(false);
                    }}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No projects.</p>}
          </div>
        </Section>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-8">
        <Section title={projEditId ? "Edit Project" : "Add Project"}>
          <form
            className="space-y-4"
            onSubmit={async (ev) => {
              ev.preventDefault();
              if (!supabase) return;
              setBusy(true);
              setBanner(null);
              const payload = {
                title: projTitle.trim(),
                subheading: projSubheading.trim() || null,
                description: projDescription.trim(),
                tech_stack: projTags,
                category: projCategory,
                live_url: projLiveUrl.trim() || null,
                github_url: projGithubUrl.trim() || null,
                project_year: projYear.trim() || null,
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
                setProjSubheading("");
                setProjDescription("");
                setProjTags([]);
                setProjCategory(ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress");
                setProjLiveUrl("");
                setProjGithubUrl("");
                setProjYear("");
                setProjImageUrl("");
                await reload();
                await triggerRevalidate();
              }
              setBusy(false);
            }}
          >
            <div className="space-y-4">
              <Field label="Project Title">
                <TextInput value={projTitle} onChange={(e) => setProjTitle(e.target.value)} required />
              </Field>
              <Field label="Subheading">
                <TextInput value={projSubheading} onChange={(e) => setProjSubheading(e.target.value)} placeholder="Short catchphrase or overview..." />
              </Field>
              <Field
                label="Description"
                onAction={{
                  icon: Link2,
                  label: "Link",
                  onClick: () => insertLink(projDescRef, setProjDescription),
                }}
              >
                <TextArea
                  ref={projDescRef}
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  required
                  rows={4}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select value={projCategory} onChange={(e) => setProjCategory(e.target.value)}>
                    {ADMIN_PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Project Year">
                  <TextInput value={projYear} onChange={(e) => setProjYear(e.target.value)} placeholder="e.g. 2024" />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Live URL">
                  <TextInput value={projLiveUrl} onChange={(e) => setProjLiveUrl(e.target.value)} placeholder="https://..." />
                </Field>
                <Field label="Github URL">
                  <TextInput value={projGithubUrl} onChange={(e) => setProjGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                </Field>
              </div>
              <Field label="Image URL">
                <TextInput value={projImageUrl} onChange={(e) => setProjImageUrl(e.target.value)} placeholder="Supabase URL or external..." />
              </Field>
              <Field label="Tech Stack (Tags)">
                <TagInput value={projTags} onChange={setProjTags} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton type="submit" disabled={busy}>
                {projEditId ? "Update Project" : "Add Project"}
              </PrimaryButton>
              {projEditId && (
                <GhostButton
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setProjEditId(null);
                    setProjTitle("");
                    setProjSubheading("");
                    setProjDescription("");
                    setProjTags([]);
                    setProjCategory(ADMIN_PROJECT_CATEGORIES[0] ?? "WordPress");
                    setProjLiveUrl("");
                    setProjGithubUrl("");
                    setProjYear("");
                    setProjImageUrl("");
                  }}
                >
                  Cancel Project Edit
                </GhostButton>
              )}
            </div>
          </form>
        </Section>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 transform bg-white transition-all duration-300 ease-in-out dark:bg-neutral-900 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isSidebarCollapsed ? "w-20" : "w-64"} border-r border-neutral-200 dark:border-neutral-800 flex flex-col`}>
        <div className={`flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 ${isSidebarCollapsed ? "justify-center px-0" : "px-6"}`}>
          {!isSidebarCollapsed && <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Admin</span>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`hidden lg:flex p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors rounded-lg ${isSidebarCollapsed ? "mx-auto" : "ml-auto"}`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={20} />
          </button>
          {!isSidebarCollapsed && (
            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto p-2 text-neutral-500 hover:text-neutral-900 lg:hidden dark:text-neutral-400 dark:hover:bg-neutral-50">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
              title={isSidebarCollapsed ? item.label : ""}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeSection === item.id
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md shadow-black/10"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon size={20} className="shrink-0" />
              {!isSidebarCollapsed && item.label}
              {activeSection === item.id && !isSidebarCollapsed && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <button
            onClick={() => void signOut()}
            title={isSidebarCollapsed ? "Sign out" : ""}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${isSidebarCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg border border-neutral-200 p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {navItems.find(i => i.id === activeSection)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <GhostButton onClick={() => void reload()} disabled={busy} className="hidden sm:inline-flex">
              Sync Data
            </GhostButton>
            <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              Live Site <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 dark:bg-neutral-950 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {banner && (
              <div className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${banner.kind === "error"
                ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300"
                }`}>
                {banner.text}
                <button onClick={() => setBanner(null)} className="ml-4 opacity-70 hover:opacity-100"><X size={16} /></button>
              </div>
            )}

            {initializing ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black dark:border-neutral-700 dark:border-t-white" />
              </div>
            ) : (
              <div className="space-y-6 pb-12">
                {activeSection === "dashboard" && renderMetricsDashboard()}
                {activeSection === "profile" && renderProfileSection()}
                {activeSection === "about" && renderAboutSection()}
                {activeSection === "education" && renderEducationSection()}
                {activeSection === "experience" && renderExperienceSection()}
                {activeSection === "projects" && renderProjectsSection()}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
