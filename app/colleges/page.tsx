"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  COLLEGES,
  COURSE_FOCUS_LABELS,
  COLLEGE_TYPE_LABELS,
  type College,
  type CityTier,
  type CourseFocus,
} from "@/lib/colleges";
import { fmtINR } from "@/lib/loan";

type SortBy = "fees-asc" | "fees-desc" | "tier";

export default function CollegesPage() {
  const [tier, setTier] = useState<"all" | CityTier>("all");
  const [course, setCourse] = useState<"all" | CourseFocus>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("fees-asc");

  const filtered = useMemo(() => {
    let list = COLLEGES.filter((c) => {
      if (tier !== "all" && c.cityTier !== tier) return false;
      if (course !== "all" && c.courseFocus !== course) return false;
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
  }, [tier, course, query, sortBy]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="space-y-2 max-w-2xl">
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
          colleges · value-for-money picks
        </div>
        <h1 className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight">
          Good college, <em className="text-accent2">livable</em> city.
        </h1>
        <p className="text-muted text-sm sm:text-base">
          {COLLEGES.length} hand-picked colleges across India where the fees vs
          reputation actually makes sense. Every fee was verified from the
          college's official site — link on each card.
        </p>
      </section>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 no-print">
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
            <option value={2}>Tier 2 (Indore, Bhopal, Jaipur…)</option>
            <option value={3}>Tier 3 (small towns)</option>
          </select>
        </Filter>
        <Filter label="course type">
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
        <Filter label="search">
          <input
            type="text"
            placeholder="name, city, state…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          />
        </Filter>
        <Filter label="sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="fees-asc">fees: cheapest first</option>
            <option value="fees-desc">fees: priciest first</option>
            <option value="tier">tier, then city</option>
          </select>
        </Filter>
      </div>

      <div className="mt-3 text-xs text-muted">
        showing <strong className="text-ink">{filtered.length}</strong> of {COLLEGES.length}{" "}
        colleges
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <CollegeCard key={c.id} c={c} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 border border-line bg-white/60 rounded-xl p-10 text-center text-muted">
            no colleges match those filters
          </div>
        )}
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <div className="mt-10 border border-line bg-paper rounded-xl p-5 text-xs text-muted leading-relaxed">
        <strong className="text-ink">how we picked these:</strong> 60+ colleges
        researched across Tier 1, 2, and 3 cities — focused on good
        fee-to-reputation ratio. Fees are total course fees (not per year),
        verified from the official site each time and rounded to the nearest
        ₹50K for the larger ones. Many colleges have separate scholarships or
        income-based waivers that bring fees down further — check the official
        page for your situation. Numbers are 2025-26 / 2024-25 wherever
        available and may have changed since.
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

function CollegeCard({ c }: { c: College }) {
  // Per-year fee for display (only if total / duration makes sense)
  const perYear = c.approxTotalFeesInr / Math.max(1, c.durationYears);
  const loanLink = `/?fees=${c.approxTotalFeesInr}&loan=${c.approxTotalFeesInr}&course=${Math.ceil(
    c.durationYears
  )}`;

  return (
    <article className="border border-line bg-white/60 rounded-xl p-4 sm:p-5 flex flex-col">
      <header className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg sm:text-xl leading-tight">{c.name}</h2>
          <div className="text-xs text-muted mt-0.5">
            {c.city}, {c.state}
          </div>
        </div>
        <TierBadge tier={c.cityTier} />
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <Pill label="total fees" value={fmtINR(c.approxTotalFeesInr)} accent />
        <Pill label="per year (est.)" value={fmtINR(perYear)} />
        <Pill label="course" value={COURSE_FOCUS_LABELS[c.courseFocus]} />
        <Pill label="entrance" value={c.mainEntranceExam} />
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

function Pill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-line bg-paper/60 rounded-lg px-2.5 py-1.5 min-w-0">
      <div className="text-[9px] uppercase tracking-[0.14em] text-muted leading-none">
        {label}
      </div>
      <div className={`mt-1 font-mono text-xs truncate ${accent ? "text-accent font-semibold" : "text-ink"}`}>
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
