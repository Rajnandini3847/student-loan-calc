"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  COLLEGES,
  COURSE_FOCUS_LABELS,
  COLLEGE_TYPE_LABELS,
  ADMISSION_MODE_LABELS,
  NO_JEE_MAIN_MODES,
  feePeriodLabel,
  type College,
  type CityTier,
  type CourseFocus,
  type AdmissionMode,
} from "@/lib/colleges";
import { fmtINR } from "@/lib/loan";

type SortBy = "fees-asc" | "fees-desc" | "tier";

// Special "I have X% board, no JEE Main" preset
type AdmissionFilter = "all" | "no_jee" | AdmissionMode;

export default function CollegesPage() {
  // Default state targets students WITHOUT a JEE Main rank — engineering,
  // direct-admission / own-exam / state-CET routes only. IITs/NITs/IIITs
  // are still in the data but hidden by default; one filter click brings
  // them back.
  const [course, setCourse] = useState<"all" | CourseFocus>("engineering");
  const [tier, setTier] = useState<"all" | CityTier>("all");
  const [admission, setAdmission] = useState<AdmissionFilter>("no_jee");
  const [minPct, setMinPct] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("fees-asc");

  const filtered = useMemo(() => {
    let list = COLLEGES.filter((c) => {
      if (course !== "all" && c.courseFocus !== course) return false;
      if (tier !== "all" && c.cityTier !== tier) return false;
      if (admission === "no_jee" && !NO_JEE_MAIN_MODES.includes(c.admissionMode)) return false;
      if (admission !== "all" && admission !== "no_jee" && c.admissionMode !== admission) return false;
      if (minPct !== null && c.minBoardPct > minPct) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.city.toLowerCase().includes(q) &&
          !c.state.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    list = list.sort((a, b) => {
      if (sortBy === "fees-asc") return a.approxTotalFeesInr - b.approxTotalFeesInr;
      if (sortBy === "fees-desc") return b.approxTotalFeesInr - a.approxTotalFeesInr;
      return a.cityTier - b.cityTier || a.city.localeCompare(b.city);
    });
    return list;
  }, [course, tier, admission, minPct, query, sortBy]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section className="space-y-2 max-w-2xl">
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
          B.Tech colleges · no JEE rank · direct admission
        </div>
        <h1 className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight">
          B.Tech without <em className="text-accent2">JEE Main?</em> Start here.
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Defaulting to engineering colleges that accept students on 10+2 marks
          or their own entrance test — no JEE Main needed. Each fee is verified
          from the college's official site and labelled clearly as per-semester,
          per-year, or full-course. Want IITs/NITs too? Change the{" "}
          <em>admission</em> filter to "all routes".
        </p>
      </section>

      {/* ── Quick preset bar ─────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center gap-2 no-print">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted mr-1">quick:</span>
        <PresetChip
          label="No JEE Main · 60%+ board"
          active={admission === "no_jee" && minPct === 60}
          onClick={() => {
            setAdmission("no_jee");
            setMinPct(60);
            setCourse("engineering");
          }}
        />
        <PresetChip
          label="JEE Advanced only (IITs)"
          active={admission === "jee_advanced"}
          onClick={() => {
            setAdmission("jee_advanced");
            setMinPct(null);
          }}
        />
        <PresetChip
          label="Reset"
          active={admission === "all" && minPct === null && tier === "all" && course === "engineering"}
          onClick={() => {
            setAdmission("all");
            setMinPct(null);
            setTier("all");
            setCourse("engineering");
            setQuery("");
          }}
          quiet
        />
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 no-print">
        <Filter label="course">
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value as "all" | CourseFocus)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">all courses</option>
            {Object.entries(COURSE_FOCUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Filter>

        <Filter label="city tier">
          <select
            value={tier}
            onChange={(e) =>
              setTier(e.target.value === "all" ? "all" : (Number(e.target.value) as CityTier))
            }
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">all tiers</option>
            <option value={1}>Tier 1 (metros)</option>
            <option value={2}>Tier 2 (Indore, Bhopal…)</option>
            <option value={3}>Tier 3 (small towns)</option>
          </select>
        </Filter>

        <Filter label="admission">
          <select
            value={admission}
            onChange={(e) => setAdmission(e.target.value as AdmissionFilter)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">all routes</option>
            <option value="no_jee">— no JEE Main needed —</option>
            <option value="direct">Direct (board marks)</option>
            <option value="private_exam">Univ. own exam</option>
            <option value="jee_main_or_direct">JEE or direct</option>
            <option value="state_exam">State CET</option>
            <option value="jee_main">JEE Main (NITs/IIITs)</option>
            <option value="jee_advanced">JEE Advanced (IITs)</option>
          </select>
        </Filter>

        <Filter label="board %">
          <select
            value={minPct ?? "none"}
            onChange={(e) =>
              setMinPct(e.target.value === "none" ? null : Number(e.target.value))
            }
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="none">any</option>
            <option value={50}>I have ≥ 50%</option>
            <option value={55}>I have ≥ 55%</option>
            <option value={60}>I have ≥ 60%</option>
            <option value={65}>I have ≥ 65%</option>
            <option value={69}>I have ≥ 69%</option>
            <option value={75}>I have ≥ 75%</option>
          </select>
        </Filter>

        <Filter label="sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="fees-asc">cheapest first</option>
            <option value="fees-desc">priciest first</option>
            <option value="tier">tier, then city</option>
          </select>
        </Filter>

        <Filter label="search">
          <input
            type="text"
            placeholder="name, city, state…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          />
        </Filter>
      </div>

      <div className="mt-3 text-xs text-muted">
        showing <strong className="text-ink">{filtered.length}</strong> of {COLLEGES.length}{" "}
        colleges
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <CollegeCard key={c.id} c={c} userPct={minPct} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 border border-line bg-white/60 rounded-xl p-10 text-center text-muted">
            no colleges match those filters
          </div>
        )}
      </div>

      <div className="mt-10 border border-line bg-paper rounded-xl p-5 text-xs text-muted leading-relaxed">
        <strong className="text-ink">how we picked these:</strong> 60+ colleges researched
        across Tier 1, 2, and 3 cities, focused on good fee-to-reputation ratio. Each fee was
        sourced from the institution's official site and we tracked whether the published
        figure is per-semester, per-year, or full-course (shown on each card as "{" "}
        <em>published as</em>"). Many colleges have separate scholarships, income-based waivers,
        or per-branch fee variations — check the official page for your specific situation.
        Most figures are 2025-26 / 2024-25 and may have changed since.
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] uppercase tracking-[0.16em] text-muted font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function PresetChip({
  label,
  active,
  onClick,
  quiet = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  quiet?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : quiet
          ? "border-line bg-paper text-muted hover:border-muted/60"
          : "border-accent/40 bg-accent/[0.05] text-accent hover:bg-accent/[0.1]"
      }`}
    >
      {label}
    </button>
  );
}

function CollegeCard({ c, userPct }: { c: College; userPct: number | null }) {
  const loanLink = `/?fees=${c.approxTotalFeesInr}&loan=${c.approxTotalFeesInr}&course=${Math.ceil(
    c.durationYears
  )}`;
  const qualifies = userPct !== null && c.minBoardPct <= userPct;

  return (
    <article className="border border-line bg-white/60 rounded-xl p-4 sm:p-5 flex flex-col">
      <header className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg sm:text-xl leading-tight">{c.name}</h2>
          <div className="text-xs text-muted mt-0.5">
            {c.city}, {c.state} · {c.program}
          </div>
        </div>
        <TierBadge tier={c.cityTier} />
      </header>

      {/* Headline fee + period */}
      <div className="mt-3 border border-line bg-paper/60 rounded-lg px-3 py-2.5">
        <div className="flex items-baseline justify-between flex-wrap gap-x-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-2xl text-accent">{fmtINR(c.approxTotalFeesInr)}</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted">total · {c.durationYears} yrs</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
            published as <strong className="text-ink">{fmtINR(c.feePeriodAmountInr)}</strong>{" "}
            {feePeriodLabel(c.feePeriod)}
          </span>
        </div>
      </div>

      {/* Admission + eligibility */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Pill label="admission" value={ADMISSION_MODE_LABELS[c.admissionMode]} />
        <Pill
          label="board cutoff"
          value={`${c.minBoardPct}%+`}
          tint={userPct !== null ? (qualifies ? "ok" : "blocked") : undefined}
        />
        <Pill label="entrance" value={c.mainEntranceExam} small />
        <Pill label="course" value={COURSE_FOCUS_LABELS[c.courseFocus]} />
      </div>

      <p className="mt-3 text-xs text-ink/80 leading-relaxed">{c.note}</p>

      <div className="mt-auto pt-4 flex flex-wrap gap-2 items-center text-[11px]">
        <a
          href={c.feeSourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent2"
        >
          verify fee ↗
        </a>
        <span className="text-line">·</span>
        <a
          href={c.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-muted underline underline-offset-2 hover:text-ink"
        >
          official site ↗
        </a>
        <Link
          href={loanLink}
          className="ml-auto border border-accent text-accent rounded-full px-3 py-1 hover:bg-accent hover:text-white transition-colors"
        >
          calculate loan →
        </Link>
      </div>

      <div className="mt-2 text-[10px] text-muted">
        <span className="opacity-60">{COLLEGE_TYPE_LABELS[c.type]}</span>
        {c.hostelPerYearInr ? (
          <>
            <span className="mx-1.5 opacity-40">·</span>
            <span className="opacity-60">
              hostel ~{fmtINR(c.hostelPerYearInr)}/yr
            </span>
          </>
        ) : null}
      </div>
    </article>
  );
}

function Pill({
  label,
  value,
  small = false,
  tint,
}: {
  label: string;
  value: string;
  small?: boolean;
  tint?: "ok" | "blocked";
}) {
  const tintCls =
    tint === "ok"
      ? "text-accent font-semibold"
      : tint === "blocked"
      ? "text-accent2 font-semibold"
      : "text-ink";
  return (
    <div className="border border-line bg-paper/60 rounded-lg px-2.5 py-1.5 min-w-0">
      <div className="text-[9px] uppercase tracking-[0.14em] text-muted leading-none">
        {label}
      </div>
      <div className={`mt-1 font-mono ${small ? "text-[11px]" : "text-xs"} truncate ${tintCls}`}>
        {value}
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: CityTier }) {
  const colors = {
    1: "bg-accent/10 text-accent border-accent/30",
    2: "bg-accent2/10 text-accent2 border-accent2/30",
    3: "bg-muted/10 text-muted border-muted/30",
  } as const;
  return (
    <span
      className={`shrink-0 text-[9px] uppercase tracking-widest border rounded-full px-2 py-0.5 ${colors[tier]}`}
    >
      Tier {tier}
    </span>
  );
}
