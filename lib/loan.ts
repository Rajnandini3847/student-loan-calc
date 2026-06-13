// Education-loan calculator with moratorium handling.
//
// How Indian education loans typically work:
//   1. During the moratorium (course duration + grace period, usually 6-12 mo),
//      no EMI is due. Interest accrues monthly and compounds. At the end of
//      the moratorium, accrued interest is "capitalized" (added to principal).
//   2. The student (or parents) can opt to pay just the interest during
//      moratorium — this avoids capitalization and saves a lot of money.
//   3. After moratorium, EMI is computed on the (possibly larger) principal
//      over the repayment tenure.
//
// Reality is messier — floating rates linked to MCLR/EBLR/repo, prepayment
// options, festival rate concessions, etc. This is a "good faith estimator"
// not a binding quote. The UI says so.

export interface LoanInput {
  /** Loan principal in rupees */
  principal: number;
  /** Annual interest rate, percent. e.g. 9.5 */
  annualRatePct: number;
  /** Course duration in years (moratorium = course + grace) */
  courseYears: number;
  /** Grace period after course ends, in months */
  gracePeriodMonths: number;
  /** Repayment tenure in years */
  repaymentYears: number;
  /** If true, student/family pays interest each month during moratorium so it
   *  doesn't capitalize. */
  payInterestDuringMoratorium: boolean;
  /** Tax slab percent for Section 80E benefit calc (0|5|10|15|20|30) */
  taxSlabPct: number;
}

export interface YearSummary {
  /** 1-indexed year from start of loan */
  year: number;
  /** "moratorium" while studying / grace, "repayment" once EMI starts */
  phase: "moratorium" | "repayment";
  emiThisYear: number;
  principalPaid: number;
  interestPaid: number;
  /** Interest that accrued and was added to outstanding (only during moratorium) */
  interestAccrued: number;
  outstanding: number;
}

export interface MonthSchedule {
  /** 1-indexed month from start of loan */
  month: number;
  phase: "moratorium" | "repayment";
  /** EMI for this month (0 during moratorium unless paying interest) */
  emi: number;
  principalPaid: number;
  interestPaid: number;
  outstanding: number;
}

export interface LoanResult {
  input: LoanInput;
  moratoriumMonths: number;
  repaymentMonths: number;
  /** EMI computed for the repayment phase (constant each month) */
  emi: number;
  /** Interest that accrued during the moratorium */
  moratoriumInterest: number;
  /** Principal at start of repayment (may equal original if paying interest during moratorium) */
  principalAtRepaymentStart: number;
  /** Total amount paid over the life of the loan (EMI sum + interest paid during moratorium) */
  totalPaid: number;
  /** Total interest paid = totalPaid - originalPrincipal */
  totalInterest: number;
  /** totalInterest / principal × 100 */
  effectiveCostPct: number;
  /** Estimated tax savings via Section 80E (interest deduction × tax slab) */
  taxSavings80E: number;
  monthly: MonthSchedule[];
  yearly: YearSummary[];
}

export function computeLoan(input: LoanInput): LoanResult {
  const {
    principal,
    annualRatePct,
    courseYears,
    gracePeriodMonths,
    repaymentYears,
    payInterestDuringMoratorium,
    taxSlabPct,
  } = input;

  const monthlyRate = annualRatePct / 12 / 100;
  const moratoriumMonths = Math.round(courseYears * 12) + Math.round(gracePeriodMonths);
  const repaymentMonths = Math.round(repaymentYears * 12);

  // ── Moratorium phase ────────────────────────────────────────────────────
  let outstanding = principal;
  let moratoriumInterest = 0;
  let totalPaid = 0;
  const monthly: MonthSchedule[] = [];

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interestThisMonth = outstanding * monthlyRate;
    moratoriumInterest += interestThisMonth;

    if (payInterestDuringMoratorium) {
      // Pay only interest — principal stays at original
      totalPaid += interestThisMonth;
      monthly.push({
        month: m,
        phase: "moratorium",
        emi: interestThisMonth,
        principalPaid: 0,
        interestPaid: interestThisMonth,
        outstanding,
      });
    } else {
      // Interest capitalises into outstanding (compounds monthly)
      outstanding += interestThisMonth;
      monthly.push({
        month: m,
        phase: "moratorium",
        emi: 0,
        principalPaid: 0,
        interestPaid: 0,
        outstanding,
      });
    }
  }

  const principalAtRepaymentStart = outstanding;

  // ── EMI computation ─────────────────────────────────────────────────────
  // Standard amortization: P × i × (1+i)^n / ((1+i)^n − 1)
  // Falls back to flat division at rate=0.
  const n = repaymentMonths;
  const i = monthlyRate;
  let emi: number;
  if (i === 0) {
    emi = outstanding / n;
  } else {
    const pow = Math.pow(1 + i, n);
    emi = (outstanding * i * pow) / (pow - 1);
  }

  // ── Repayment phase ─────────────────────────────────────────────────────
  for (let m = 1; m <= repaymentMonths; m++) {
    const interestThisMonth = outstanding * monthlyRate;
    let principalThisMonth = emi - interestThisMonth;
    // guard against negative principal on last month due to floating-point drift
    if (principalThisMonth > outstanding) principalThisMonth = outstanding;
    outstanding -= principalThisMonth;
    totalPaid += emi;
    monthly.push({
      month: moratoriumMonths + m,
      phase: "repayment",
      emi,
      principalPaid: principalThisMonth,
      interestPaid: interestThisMonth,
      outstanding: Math.max(0, outstanding),
    });
  }

  // ── Aggregate into yearly summaries ────────────────────────────────────
  const yearly: YearSummary[] = [];
  const totalMonths = monthly.length;
  for (let y = 0; y * 12 < totalMonths; y++) {
    const start = y * 12;
    const end = Math.min(start + 12, totalMonths);
    const slice = monthly.slice(start, end);
    const phase = slice.some((m) => m.phase === "repayment") ? "repayment" : "moratorium";
    const emiThisYear = slice.reduce((s, m) => s + m.emi, 0);
    const principalPaid = slice.reduce((s, m) => s + m.principalPaid, 0);
    const interestPaid = slice.reduce((s, m) => s + m.interestPaid, 0);
    // For moratorium years where interest capitalises, surface the accrued
    // interest separately (it shows up as outstanding-growth, not as paid).
    let interestAccrued = 0;
    if (phase === "moratorium" && !payInterestDuringMoratorium) {
      const startOutstanding = y === 0 ? principal : yearly[y - 1].outstanding;
      const endOutstanding = slice[slice.length - 1].outstanding;
      interestAccrued = endOutstanding - startOutstanding;
    }
    yearly.push({
      year: y + 1,
      phase,
      emiThisYear,
      principalPaid,
      interestPaid,
      interestAccrued,
      outstanding: slice[slice.length - 1].outstanding,
    });
  }

  const totalInterest = totalPaid - principal;
  const effectiveCostPct = (totalInterest / principal) * 100;
  // Section 80E: full interest is deductible. We cap the deduction window at
  // the lesser of repayment tenure and 8 years (statutory limit).
  const deductibleYears = Math.min(8, repaymentYears);
  const interestInDeductibleWindow = yearly
    .filter((y) => y.phase === "repayment")
    .slice(0, deductibleYears)
    .reduce((s, y) => s + y.interestPaid, 0);
  const taxSavings80E = (interestInDeductibleWindow * taxSlabPct) / 100;

  return {
    input,
    moratoriumMonths,
    repaymentMonths,
    emi,
    moratoriumInterest,
    principalAtRepaymentStart,
    totalPaid,
    totalInterest,
    effectiveCostPct,
    taxSavings80E,
    monthly,
    yearly,
  };
}

// ── Formatting helpers ────────────────────────────────────────────────────

export function fmtINR(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function fmtINRPrecise(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function fmtMonths(m: number): string {
  if (m < 12) return `${m} mo`;
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (r === 0) return `${y} yr`;
  return `${y} yr ${r} mo`;
}
