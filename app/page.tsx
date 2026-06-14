"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeLoan, fmtINR, fmtINRPrecise, fmtMonths, type LoanInput } from "@/lib/loan";
import { BANKS } from "@/lib/banks";
import { YearlyChart } from "@/components/YearlyChart";
import { PrincipalVsInterest } from "@/components/PrincipalVsInterest";

export default function CalculatorPage() {
  const [fees, setFees] = useState(15_00_000);
  const [loanAmount, setLoanAmount] = useState(15_00_000);
  const [courseYears, setCourseYears] = useState(4);
  const [graceMonths, setGraceMonths] = useState(6);
  const [repaymentYears, setRepaymentYears] = useState(10);
  const [rate, setRate] = useState(9.5);
  const [bankId, setBankId] = useState<string>("custom");
  const [payInterestDuringMoratorium, setPayInterestDuringMoratorium] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const onFeesChange = (next: number) => {
    setFees(next);
    if (loanAmount > next || loanAmount === fees) setLoanAmount(next);
  };

  const onBankSelect = (id: string) => {
    setBankId(id);
    if (id !== "custom") {
      const bank = BANKS.find((b) => b.id === id);
      if (bank) setRate(bank.rateMid);
    }
  };

  const onRateChange = (n: number) => {
    setRate(n);
    setBankId("custom");
  };

  const input: LoanInput = {
    principal: loanAmount,
    annualRatePct: rate,
    courseYears,
    gracePeriodMonths: graceMonths,
    repaymentYears,
    payInterestDuringMoratorium,
    taxSlabPct: taxSlab,
  };

  const result = useMemo(() => computeLoan(input), [
    loanAmount,
    rate,
    courseYears,
    graceMonths,
    repaymentYears,
    payInterestDuringMoratorium,
    taxSlab,
  ]);

  // Compute both interest-strategy scenarios so the user can see savings
  // side-by-side without flipping the toggle to find out.
  const scenarios = useMemo(() => {
    const baseInput = { ...input };
    return {
      pileUp: computeLoan({ ...baseInput, payInterestDuringMoratorium: false }),
      payNow: computeLoan({ ...baseInput, payInterestDuringMoratorium: true }),
    };
  }, [loanAmount, rate, courseYears, graceMonths, repaymentYears, taxSlab]);

  const comparison = useMemo(() => {
    return BANKS.map((b) => ({
      bank: b,
      result: computeLoan({ ...input, annualRatePct: b.rateMid }),
    }));
  }, [loanAmount, courseYears, graceMonths, repaymentYears, payInterestDuringMoratorium, taxSlab]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* ── Hero (compact) ─────────────────────────────────────────────── */}
      <section className="space-y-2 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight">
          Your fees, your <em className="text-accent2">real</em> EMI.
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Punch in the numbers below. The chart updates instantly.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-8">
        {/* ── Inputs ─────────────────────────────────────────────────── */}
        <section className="lg:col-span-2 space-y-4 bg-white/60 border border-line rounded-2xl p-5 no-print">
          <Field label="Total course fees">
            <RupeeInput value={fees} onChange={onFeesChange} />
          </Field>

          <Field label="Loan amount">
            <RupeeInput value={loanAmount} onChange={setLoanAmount} max={fees} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Course">
              <select
                value={courseYears}
                onChange={(e) => setCourseYears(Number(e.target.value))}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>{y} yr</option>
                ))}
              </select>
            </Field>
            <Field label="Grace after">
              <select
                value={graceMonths}
                onChange={(e) => setGraceMonths(Number(e.target.value))}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
              >
                {[0, 6, 12].map((m) => (
                  <option key={m} value={m}>{m === 0 ? "none" : `${m} mo`}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={`Repayment: ${repaymentYears} years`}>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={repaymentYears}
              onChange={(e) => setRepaymentYears(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </Field>

          <Field label={`Interest rate: ${rate.toFixed(2)}%`}>
            <select
              value={bankId}
              onChange={(e) => onBankSelect(e.target.value)}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm mb-2"
            >
              <option value="custom">— set manually —</option>
              {BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.rateMid}%)
                </option>
              ))}
            </select>
            <input
              type="range"
              min={6}
              max={16}
              step={0.05}
              value={rate}
              onChange={(e) => onRateChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </Field>

          <Field label="Tax slab (for 80E)">
            <select
              value={taxSlab}
              onChange={(e) => setTaxSlab(Number(e.target.value))}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>none</option>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
            </select>
          </Field>
        </section>

        {/* ── Results ────────────────────────────────────────────────── */}
        <section className="lg:col-span-3 space-y-5">
          {/* Big EMI */}
          <div className="border border-accent/40 bg-accent/[0.04] rounded-2xl p-5 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted">your monthly EMI</div>
            <div className="font-display text-5xl sm:text-6xl text-accent leading-none mt-1">
              {fmtINRPrecise(result.emi)}
            </div>
            <div className="text-xs text-muted mt-2">
              for {repaymentYears} years · starts after {fmtMonths(result.moratoriumMonths)}
            </div>
          </div>

          {/* Interest strategy chooser */}
          <StrategyChooser
            pileUp={scenarios.pileUp}
            payNow={scenarios.payNow}
            selected={payInterestDuringMoratorium ? "pay" : "pile"}
            onSelect={(v) => setPayInterestDuringMoratorium(v === "pay")}
            courseYears={courseYears}
            graceMonths={graceMonths}
          />

          {/* 3 supporting stats */}
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="you'll repay" value={fmtINR(result.totalPaid)} />
            <MiniStat label="of that, interest" value={fmtINR(result.totalInterest)} tint="accent2" />
            <MiniStat
              label="extra over loan"
              value={`${result.effectiveCostPct.toFixed(0)}%`}
              tint="muted"
            />
          </div>

          {/* Yearly chart */}
          <Panel title="year-by-year">
            <Legend />
            <YearlyChart yearly={result.yearly} />
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Panel title="where the money goes">
              <PrincipalVsInterest principal={loanAmount} interest={result.totalInterest} />
            </Panel>

            <Panel title="the key numbers">
              <dl className="text-sm divide-y divide-line">
                <DL term="Loan" desc={fmtINR(loanAmount)} />
                <DL term="Moratorium" desc={fmtMonths(result.moratoriumMonths)} />
                <DL
                  term={payInterestDuringMoratorium ? "Paid while studying" : "Accrues while studying"}
                  desc={fmtINR(result.moratoriumInterest)}
                  tint={payInterestDuringMoratorium ? undefined : "accent2"}
                />
                {!payInterestDuringMoratorium && (
                  <DL
                    term="Owed when EMI starts"
                    desc={fmtINR(result.principalAtRepaymentStart)}
                    tint="accent2"
                  />
                )}
                <DL term="EMI tenure" desc={`${repaymentYears} years`} />
                {taxSlab > 0 && (
                  <DL
                    term="80E tax saved (est.)"
                    desc={`− ${fmtINR(result.taxSavings80E)}`}
                    tint="accent"
                  />
                )}
              </dl>
            </Panel>
          </div>

          <BankComparison
            comparison={comparison}
            selectedBankId={bankId}
            onSelect={onBankSelect}
          />

          <Schedule
            yearly={result.yearly}
            showFull={showFullSchedule}
            onToggle={() => setShowFullSchedule((v) => !v)}
          />

          <div className="text-center pt-3 no-print">
            <Link
              href="/learn"
              className="inline-block text-sm text-accent underline underline-offset-4 hover:text-accent2"
            >
              new to all this? → 2-minute crash course
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.14em] text-muted font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function RupeeInput({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(isNaN(n) ? 0 : n);
        }}
        className="w-full bg-paper border border-line rounded-lg pl-7 pr-3 py-2 text-sm font-mono"
      />
      {value > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted font-mono">
          {fmtINR(value)}
        </span>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint?: "accent" | "accent2" | "muted";
}) {
  const color =
    tint === "accent2" ? "text-accent2" : tint === "muted" ? "text-muted" : "text-ink";
  return (
    <div className="border border-line bg-white/60 rounded-xl px-3 py-3">
      <div className="text-[9px] uppercase tracking-[0.16em] text-muted leading-tight">
        {label}
      </div>
      <div className={`mt-1 font-display text-xl sm:text-2xl ${color}`}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-white/60 rounded-xl p-4 sm:p-5">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">{title}</h3>
      {children}
    </div>
  );
}

function DL({ term, desc, tint }: { term: string; desc: string; tint?: "accent" | "accent2" }) {
  const color = tint === "accent" ? "text-accent" : tint === "accent2" ? "text-accent2" : "text-ink";
  return (
    <div className="flex items-baseline justify-between py-2 first:pt-0 last:pb-0">
      <dt className="text-muted">{term}</dt>
      <dd className={`font-mono ${color}`}>{desc}</dd>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted mb-2">
      <LegendDot color="#1E5F3F" label="principal paid" />
      <LegendDot color="#C46A4B" label="interest paid" />
      <LegendDot color="#E6DFD0" label="accruing (no EMI yet)" />
    </div>
  );
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function BankComparison({
  comparison,
  selectedBankId,
  onSelect,
}: {
  comparison: { bank: typeof BANKS[number]; result: ReturnType<typeof computeLoan> }[];
  selectedBankId: string;
  onSelect: (id: string) => void;
}) {
  const sorted = [...comparison].sort((a, b) => a.result.totalPaid - b.result.totalPaid);
  const cheapest = sorted[0]?.result.totalPaid ?? 0;

  return (
    <Panel title="popular banks · sorted cheapest first · tap to use">
      <div className="overflow-x-auto -mx-1 scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.16em] text-muted text-left">
              <th className="px-2 py-2 font-normal">bank</th>
              <th className="px-2 py-2 font-normal text-right">rate</th>
              <th className="px-2 py-2 font-normal text-right">EMI</th>
              <th className="px-2 py-2 font-normal text-right">+vs cheapest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map(({ bank, result }) => {
              const extra = result.totalPaid - cheapest;
              const selected = bank.id === selectedBankId;
              return (
                <tr
                  key={bank.id}
                  onClick={() => onSelect(bank.id)}
                  className={`cursor-pointer transition-colors ${
                    selected ? "bg-accent/[0.08]" : "hover:bg-line/40"
                  }`}
                >
                  <td className="px-2 py-2.5">
                    <div className="font-medium text-sm leading-tight">{bank.name}</div>
                    <div className="text-[10px] text-muted leading-tight">{shortScheme(bank.scheme)}</div>
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono text-xs">{bank.rateMid}%</td>
                  <td className="px-2 py-2.5 text-right font-mono">{fmtINRPrecise(result.emi)}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-xs">
                    {extra === 0 ? (
                      <span className="text-accent">cheapest</span>
                    ) : (
                      <span className="text-accent2">+{fmtINR(extra)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function shortScheme(s: string): string {
  // trim long scheme names for the compact table
  return s
    .replace(/Education Loan/i, "")
    .replace(/Loan/i, "")
    .replace(/\([^)]+\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function StrategyChooser({
  pileUp,
  payNow,
  selected,
  onSelect,
  courseYears,
  graceMonths,
}: {
  pileUp: ReturnType<typeof computeLoan>;
  payNow: ReturnType<typeof computeLoan>;
  selected: "pile" | "pay";
  onSelect: (v: "pile" | "pay") => void;
  courseYears: number;
  graceMonths: number;
}) {
  const savings = pileUp.totalPaid - payNow.totalPaid;
  const monthlyInterestDuringStudy =
    payNow.moratoriumInterest / Math.max(1, payNow.moratoriumMonths);

  return (
    <div className="border border-line bg-white/60 rounded-2xl p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted">
          while you're studying
        </h3>
        {savings > 0 && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
            pick right · save {fmtINR(savings)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StrategyCard
          active={selected === "pile"}
          onClick={() => onSelect("pile")}
          title="Pay nothing"
          subtitle={`for ${courseYears} yrs + ${graceMonths} mo`}
          headline="₹0 / month while studying"
          headlineTint="muted"
          totalLabel="total you'll repay"
          totalValue={fmtINR(pileUp.totalPaid)}
          note="Interest piles up and gets added to what you owe."
        />
        <StrategyCard
          active={selected === "pay"}
          onClick={() => onSelect("pay")}
          title="Pay just the interest"
          subtitle="from day 1, every month"
          headline={`~${fmtINRPrecise(monthlyInterestDuringStudy)} / month while studying`}
          headlineTint="accent"
          totalLabel="total you'll repay"
          totalValue={fmtINR(payNow.totalPaid)}
          badge={savings > 0 ? `saves ${fmtINR(savings)}` : undefined}
          note="Principal stays flat. EMI later is exactly what you borrowed × rate."
        />
      </div>
    </div>
  );
}

function StrategyCard({
  active,
  onClick,
  title,
  subtitle,
  headline,
  headlineTint,
  totalLabel,
  totalValue,
  badge,
  note,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  headline: string;
  headlineTint: "accent" | "muted";
  totalLabel: string;
  totalValue: string;
  badge?: string;
  note: string;
}) {
  const headlineColor = headlineTint === "accent" ? "text-accent" : "text-muted";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-xl p-4 border-2 transition-all ${
        active
          ? "border-accent bg-accent/[0.06]"
          : "border-line bg-paper hover:border-muted/40"
      }`}
    >
      {badge && (
        <span className="absolute -top-2 right-3 text-[9px] uppercase tracking-widest bg-accent text-white px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`inline-block w-3 h-3 rounded-full border-2 shrink-0 ${
            active ? "border-accent bg-accent" : "border-muted/40"
          }`}
        />
        <span className="font-display text-base sm:text-lg">{title}</span>
      </div>
      <div className="text-[11px] text-muted ml-5">{subtitle}</div>
      <div className={`mt-3 ml-5 font-mono text-sm ${headlineColor}`}>{headline}</div>
      <div className="mt-3 ml-5 pt-3 border-t border-line">
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{totalLabel}</div>
        <div className="font-display text-xl mt-0.5">{totalValue}</div>
      </div>
      <div className="text-[11px] text-muted mt-2 ml-5 leading-snug">{note}</div>
    </button>
  );
}

function Schedule({
  yearly,
  showFull,
  onToggle,
}: {
  yearly: ReturnType<typeof computeLoan>["yearly"];
  showFull: boolean;
  onToggle: () => void;
}) {
  const visible = showFull ? yearly : yearly.slice(0, 5);
  return (
    <Panel title="year-by-year detail">
      <div className="overflow-x-auto -mx-1 scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.16em] text-muted text-left">
              <th className="px-2 py-2 font-normal">yr</th>
              <th className="px-2 py-2 font-normal">phase</th>
              <th className="px-2 py-2 font-normal text-right">paid</th>
              <th className="px-2 py-2 font-normal text-right">principal</th>
              <th className="px-2 py-2 font-normal text-right">interest</th>
              <th className="px-2 py-2 font-normal text-right">left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((y) => (
              <tr key={y.year}>
                <td className="px-2 py-2 font-mono text-xs">Y{y.year}</td>
                <td className="px-2 py-2">
                  {y.phase === "moratorium" ? (
                    <span className="text-[10px] uppercase tracking-widest text-muted">study</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-accent">pay</span>
                  )}
                </td>
                <td className="px-2 py-2 text-right font-mono text-xs">{fmtINR(y.emiThisYear)}</td>
                <td className="px-2 py-2 text-right font-mono text-xs text-accent">{fmtINR(y.principalPaid)}</td>
                <td className="px-2 py-2 text-right font-mono text-xs text-accent2">
                  {y.phase === "moratorium" && y.interestAccrued > 0
                    ? `+${fmtINR(y.interestAccrued)}`
                    : fmtINR(y.interestPaid)}
                </td>
                <td className="px-2 py-2 text-right font-mono text-xs text-muted">{fmtINR(y.outstanding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {yearly.length > 5 && (
        <button
          onClick={onToggle}
          className="mt-3 text-xs text-muted underline underline-offset-4 hover:text-ink no-print"
        >
          {showFull ? "← collapse" : `show all ${yearly.length} years →`}
        </button>
      )}
    </Panel>
  );
}
