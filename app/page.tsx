"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeLoan, fmtINR, fmtINRPrecise, fmtMonths, type LoanInput } from "@/lib/loan";
import { BANKS } from "@/lib/banks";
import { YearlyChart } from "@/components/YearlyChart";
import { PrincipalVsInterest } from "@/components/PrincipalVsInterest";

export default function CalculatorPage() {
  const [fees, setFees] = useState(20_00_000);
  const [loanAmount, setLoanAmount] = useState(20_00_000);
  const [courseYears, setCourseYears] = useState(4);
  const [graceMonths, setGraceMonths] = useState(6);
  const [repaymentYears, setRepaymentYears] = useState(10);
  const [rate, setRate] = useState(9.5);
  const [bankId, setBankId] = useState<string>("custom");
  const [payInterestDuringMoratorium, setPayInterestDuringMoratorium] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // When loanAmount > fees, gently clamp the loanAmount to fees on next fee change
  // Conversely if fees increases, bump loanAmount to match
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

  // Compare same loan across all banks at their mid-rate (with the user's other settings)
  const comparison = useMemo(() => {
    return BANKS.map((b) => ({
      bank: b,
      result: computeLoan({ ...input, annualRatePct: b.rateMid }),
    }));
  }, [loanAmount, courseYears, graceMonths, repaymentYears, payInterestDuringMoratorium, taxSlab]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Hero />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-10">
        {/* ── Input form ───────────────────────────────────────────────── */}
        <section className="lg:col-span-2 space-y-5 bg-white/60 border border-line rounded-2xl p-5 sm:p-6 no-print">
          <h2 className="font-display text-xl">your situation</h2>

          <Field label="Total course fees (₹)" hint="Tuition + hostel + materials over the whole course.">
            <RupeeInput value={fees} onChange={onFeesChange} />
          </Field>

          <Field label="Loan amount you need (₹)" hint="Defaults to fees. Reduce if you have savings or a scholarship.">
            <RupeeInput value={loanAmount} onChange={setLoanAmount} max={fees} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Course length">
              <select
                value={courseYears}
                onChange={(e) => setCourseYears(Number(e.target.value))}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>{y} year{y > 1 ? "s" : ""}</option>
                ))}
              </select>
            </Field>
            <Field label="Grace period">
              <select
                value={graceMonths}
                onChange={(e) => setGraceMonths(Number(e.target.value))}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
              >
                {[0, 6, 12].map((m) => (
                  <option key={m} value={m}>{m === 0 ? "none" : `${m} months`}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Repayment tenure" hint="How many years to pay back, after the moratorium ends.">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={repaymentYears}
                onChange={(e) => setRepaymentYears(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="font-mono text-sm w-14 text-right">{repaymentYears} yr</span>
            </div>
          </Field>

          <Field label="Bank / interest rate">
            <select
              value={bankId}
              onChange={(e) => onBankSelect(e.target.value)}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm mb-2"
            >
              <option value="custom">— set rate manually —</option>
              {BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} · {b.scheme} ({b.rateMid}%)
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={6}
                max={16}
                step={0.05}
                value={rate}
                onChange={(e) => onRateChange(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="font-mono text-sm w-16 text-right">{rate.toFixed(2)}%</span>
            </div>
          </Field>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={payInterestDuringMoratorium}
              onChange={(e) => setPayInterestDuringMoratorium(e.target.checked)}
              className="mt-1 accent-accent"
            />
            <span className="text-sm">
              <span className="font-medium">Pay interest during the moratorium</span>
              <span className="block text-xs text-muted mt-0.5">
                If you (or your parents) can pay just the monthly interest while you study,
                your principal doesn't balloon — saves a lot in the long run.
              </span>
            </span>
          </label>

          <Field label="Your future tax bracket (for the 80E benefit)" hint="Interest on education loans is fully tax-deductible for 8 years.">
            <select
              value={taxSlab}
              onChange={(e) => setTaxSlab(Number(e.target.value))}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>none / not earning yet</option>
              <option value={5}>5% slab (₹3–7L income)</option>
              <option value={10}>10% slab (₹7–10L)</option>
              <option value={15}>15% slab (₹10–12L)</option>
              <option value={20}>20% slab (₹12–15L)</option>
              <option value={30}>30% slab (above ₹15L)</option>
            </select>
          </Field>
        </section>

        {/* ── Results ───────────────────────────────────────────────────── */}
        <section className="lg:col-span-3 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="monthly EMI" value={fmtINRPrecise(result.emi)} accent />
            <Stat label="total you'll repay" value={fmtINR(result.totalPaid)} />
            <Stat label="total interest" value={fmtINR(result.totalInterest)} accent2 />
            <Stat
              label="effective cost"
              value={`${result.effectiveCostPct.toFixed(1)}%`}
              hint="extra over what you borrow"
            />
          </div>

          <Narrative
            principal={loanAmount}
            rate={rate}
            courseYears={courseYears}
            graceMonths={graceMonths}
            repaymentYears={repaymentYears}
            emi={result.emi}
            totalInterest={result.totalInterest}
            totalPaid={result.totalPaid}
            moratoriumInterest={result.moratoriumInterest}
            payInterestDuringMoratorium={payInterestDuringMoratorium}
            principalAtRepaymentStart={result.principalAtRepaymentStart}
            taxSavings={result.taxSavings80E}
            taxSlab={taxSlab}
          />

          <Panel title="year-by-year breakdown" subtitle="green = principal paid · orange = interest paid · grey = interest accruing during your course (no EMI yet)">
            <YearlyChart yearly={result.yearly} />
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Panel title="where your money goes">
              <PrincipalVsInterest principal={loanAmount} interest={result.totalInterest} />
            </Panel>

            <Panel title="the maths, briefly">
              <ul className="text-sm space-y-2.5">
                <Row label="Principal you borrow" value={fmtINR(loanAmount)} />
                <Row label="Moratorium period" value={fmtMonths(result.moratoriumMonths)} />
                <Row
                  label={payInterestDuringMoratorium ? "Interest paid while studying" : "Interest that piles up while studying"}
                  value={fmtINR(result.moratoriumInterest)}
                />
                {!payInterestDuringMoratorium && (
                  <Row label="Principal when EMI kicks in" value={fmtINR(result.principalAtRepaymentStart)} sub />
                )}
                <Row label="Repayment tenure" value={`${repaymentYears} years`} />
                <Row label="Monthly EMI" value={fmtINRPrecise(result.emi)} accent />
              </ul>
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

          <div className="text-center pt-4 no-print">
            <Link href="/learn" className="inline-block text-sm text-accent underline underline-offset-4 hover:text-accent2">
              don't get half of this? → read the plain-English explainer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="space-y-3 max-w-3xl">
      <div className="text-xs uppercase tracking-[0.25em] text-accent">
        education loan, in plain english
      </div>
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
        Punch in your fees. See <em className="text-accent2">exactly</em> what you'll pay back.
      </h1>
      <p className="text-muted text-base sm:text-lg leading-relaxed">
        Most loan calculators give you one number and call it a day. This one shows you the whole
        picture — moratorium interest, year-by-year breakdown, what the same loan would cost at every
        major Indian bank — so you (and the parents looking over your shoulder) can actually
        understand the numbers.
      </p>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted leading-snug">{hint}</p>}
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
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted font-mono">
          {fmtINR(value)}
        </span>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent = false,
  accent2 = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
  accent2?: boolean;
}) {
  const color = accent ? "text-accent" : accent2 ? "text-accent2" : "text-ink";
  return (
    <div className="border border-line bg-white/60 rounded-xl p-4 sm:p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className={`mt-1.5 font-display text-2xl sm:text-3xl ${color}`}>{value}</div>
      {hint && <div className="text-[11px] text-muted mt-1">{hint}</div>}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-white/60 rounded-xl p-4 sm:p-5">
      <h3 className="font-display text-lg">{title}</h3>
      {subtitle && <p className="text-xs text-muted mt-1 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
  sub = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  sub?: boolean;
}) {
  return (
    <li className={`flex items-baseline justify-between ${sub ? "text-muted" : ""}`}>
      <span>{label}</span>
      <span className={`font-mono ${accent ? "text-accent font-semibold" : ""}`}>{value}</span>
    </li>
  );
}

function Narrative(props: {
  principal: number;
  rate: number;
  courseYears: number;
  graceMonths: number;
  repaymentYears: number;
  emi: number;
  totalInterest: number;
  totalPaid: number;
  moratoriumInterest: number;
  payInterestDuringMoratorium: boolean;
  principalAtRepaymentStart: number;
  taxSavings: number;
  taxSlab: number;
}) {
  const {
    principal,
    rate,
    courseYears,
    graceMonths,
    repaymentYears,
    emi,
    totalInterest,
    totalPaid,
    moratoriumInterest,
    payInterestDuringMoratorium,
    principalAtRepaymentStart,
    taxSavings,
    taxSlab,
  } = props;

  return (
    <div className="border border-accent/30 bg-accent/[0.04] rounded-xl p-5">
      <h3 className="font-display text-lg mb-2">here's how this plays out</h3>
      <p className="text-sm leading-relaxed">
        You borrow <strong>{fmtINR(principal)}</strong> at <strong>{rate.toFixed(2)}%</strong> per year.
        While you study ({courseYears} year{courseYears > 1 ? "s" : ""}) plus the {graceMonths}-month grace
        period after,{" "}
        {payInterestDuringMoratorium ? (
          <>
            you pay only the monthly interest — about <strong>{fmtINR(moratoriumInterest)}</strong> over
            that whole stretch — so your principal stays flat.
          </>
        ) : (
          <>
            no EMI is due — but <strong>{fmtINR(moratoriumInterest)}</strong> of interest quietly accrues
            and gets added to what you owe, so when EMI starts you're actually paying off{" "}
            <strong>{fmtINR(principalAtRepaymentStart)}</strong>.
          </>
        )}{" "}
        From then on, your EMI is <strong>{fmtINRPrecise(emi)}</strong> a month for {repaymentYears} years.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        Total: you'll pay <strong>{fmtINR(totalPaid)}</strong> — of which <strong>{fmtINR(totalInterest)}</strong>{" "}
        is interest. That's roughly <strong>{((totalInterest / principal) * 100).toFixed(0)}%</strong> more
        than what you borrowed.
        {taxSlab > 0 && (
          <>
            {" "}Under <strong>Section 80E</strong>, the interest you pay during the first 8 years is fully
            tax-deductible — at your {taxSlab}% slab that's about <strong>{fmtINR(taxSavings)}</strong>{" "}
            saved on income tax, bringing your real cost down to ~<strong>{fmtINR(totalPaid - taxSavings)}</strong>.
          </>
        )}
      </p>
    </div>
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
    <Panel title="how popular banks compare" subtitle="Click a row to recalculate with that bank's mid-band rate. Rates are 2026 estimates; actual rate depends on your institute, profile, and the day you apply.">
      <div className="overflow-x-auto -mx-1 scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.18em] text-muted text-left">
              <th className="px-2 py-2 font-normal">bank · scheme</th>
              <th className="px-2 py-2 font-normal text-right">rate</th>
              <th className="px-2 py-2 font-normal text-right">EMI</th>
              <th className="px-2 py-2 font-normal text-right">total interest</th>
              <th className="px-2 py-2 font-normal text-right">extra cost</th>
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
                    <div className="font-medium">{bank.name}</div>
                    <div className="text-[11px] text-muted">{bank.scheme}</div>
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono">
                    {bank.rateMin}–{bank.rateMax}%
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono">
                    {fmtINRPrecise(result.emi)}
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono text-accent2">
                    {fmtINR(result.totalInterest)}
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono text-xs">
                    {extra === 0 ? (
                      <span className="text-accent">cheapest</span>
                    ) : (
                      `+${fmtINR(extra)}`
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
    <Panel title="repayment schedule, year by year">
      <div className="overflow-x-auto -mx-1 scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.18em] text-muted text-left">
              <th className="px-2 py-2 font-normal">year</th>
              <th className="px-2 py-2 font-normal">phase</th>
              <th className="px-2 py-2 font-normal text-right">EMI paid</th>
              <th className="px-2 py-2 font-normal text-right">principal</th>
              <th className="px-2 py-2 font-normal text-right">interest</th>
              <th className="px-2 py-2 font-normal text-right">outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((y) => (
              <tr key={y.year}>
                <td className="px-2 py-2 font-mono">Y{y.year}</td>
                <td className="px-2 py-2">
                  {y.phase === "moratorium" ? (
                    <span className="inline-block text-[10px] uppercase tracking-widest border border-line rounded px-1.5 py-0.5 text-muted">
                      studying
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] uppercase tracking-widest border border-accent/30 text-accent rounded px-1.5 py-0.5">
                      repaying
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 text-right font-mono">{fmtINR(y.emiThisYear)}</td>
                <td className="px-2 py-2 text-right font-mono text-accent">{fmtINR(y.principalPaid)}</td>
                <td className="px-2 py-2 text-right font-mono text-accent2">
                  {y.phase === "moratorium" && y.interestAccrued > 0 ? (
                    <span title="accruing — not yet paid">+{fmtINR(y.interestAccrued)}</span>
                  ) : (
                    fmtINR(y.interestPaid)
                  )}
                </td>
                <td className="px-2 py-2 text-right font-mono text-muted">{fmtINR(y.outstanding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {yearly.length > 5 && (
        <button
          onClick={onToggle}
          className="mt-4 text-xs text-muted underline underline-offset-4 hover:text-ink no-print"
        >
          {showFull ? "show only first 5 years" : `show all ${yearly.length} years`}
        </button>
      )}
    </Panel>
  );
}
