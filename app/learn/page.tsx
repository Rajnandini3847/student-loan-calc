import Link from "next/link";

export const dynamic = "force-static";

export default function LearnPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="space-y-2 mb-8">
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
          2-minute crash course
        </div>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight">
          Education loans, the short version.
        </h1>
      </header>

      {/* ── TL;DR card ──────────────────────────────────────────────── */}
      <div className="border border-accent/40 bg-accent/[0.05] rounded-2xl p-5 mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2">tl;dr</div>
        <ul className="space-y-1.5 text-sm leading-relaxed">
          <Bullet>You don't pay EMI while studying — but interest still piles up.</Bullet>
          <Bullet>
            Pay just the <em>interest</em> while studying → save 15–25% over the life of the loan.
          </Bullet>
          <Bullet>
            <strong>Section 80E</strong> = interest is tax-deductible for 8 years. No cap.
          </Bullet>
          <Bullet>SBI Scholar is cheapest if your college is on their premier list.</Bullet>
          <Bullet>Female students: most PSU banks knock 0.5% off the rate. Ask.</Bullet>
        </ul>
      </div>

      {/* ── Phase diagram ──────────────────────────────────────────── */}
      <Card title="The two phases of your loan">
        <div className="grid grid-cols-2 gap-3 mt-1">
          <Phase
            tag="phase 1"
            title="moratorium"
            duration="course + 6–12 mo"
            verb="no EMI"
            note="interest accrues"
            tint="muted"
          />
          <Phase
            tag="phase 2"
            title="repayment"
            duration="up to 15 yrs"
            verb="fixed EMI"
            note="like any loan"
            tint="accent"
          />
        </div>
      </Card>

      <Card title="Do you need collateral?">
        <ul className="space-y-1.5 text-sm">
          <Bullet><strong>≤ ₹4L</strong> — nothing needed.</Bullet>
          <Bullet><strong>₹4L – ₹7.5L</strong> — co-applicant only (usually a parent).</Bullet>
          <Bullet><strong>&gt; ₹7.5L</strong> — collateral required (property, FD, LIC).</Bullet>
          <Bullet>
            NBFCs (Credila unsecured, Avanse, Auxilo) skip collateral but charge 2–3% more.
          </Bullet>
        </ul>
      </Card>

      <Card title="Section 80E — the tax break to know about">
        <ul className="space-y-1.5 text-sm">
          <Bullet>Every rupee of interest you pay is tax-deductible.</Bullet>
          <Bullet>For up to 8 years after EMI starts. No upper cap.</Bullet>
          <Bullet>30% slab → effectively a 30% rebate on every interest rupee.</Bullet>
          <Bullet>
            Set your slab in the calculator — the savings show up as a separate line.
          </Bullet>
        </ul>
      </Card>

      <Card title="Government angle — don't miss this">
        <ul className="space-y-1.5 text-sm">
          <Bullet>
            <a className="text-accent underline" href="https://www.vidyalakshmi.co.in/" target="_blank" rel="noreferrer">
              Vidya Lakshmi
            </a>{" "}
            portal — one application, 40+ banks. Saves running around.
          </Bullet>
          <Bullet>
            <strong>PM Vidyalaxmi (2024)</strong> — collateral-free loans up to ₹10L for the top
            860 NIRF institutes.
          </Bullet>
          <Bullet>
            Family income &lt; ₹8L → extra 3% interest subsidy on top.
          </Bullet>
        </ul>
      </Card>

      <Card title="5 questions to ask the bank">
        <ol className="space-y-1.5 text-sm list-decimal pl-5 marker:text-accent marker:font-semibold">
          <li>What's the rate today, and how often does it reset?</li>
          <li>Processing fee — included or upfront?</li>
          <li>Any prepayment penalty?</li>
          <li>Can I pay just the interest during the moratorium for free?</li>
          <li>What happens if I drop out or switch colleges?</li>
        </ol>
      </Card>

      <Card title="Ways to bring the rate down">
        <ul className="space-y-1.5 text-sm">
          <Bullet>
            Pick a bank that lists <strong>your college</strong> as "premier" — saves 0.5–1.5%.
          </Bullet>
          <Bullet>Female applicant → 0.5% off at most PSU banks.</Bullet>
          <Bullet>Co-applicant with 750+ CIBIL → bottom of the rate band.</Bullet>
          <Bullet>Get one sanction letter, walk into another bank, ask them to beat it.</Bullet>
        </ul>
      </Card>

      <div className="text-center pt-6">
        <Link
          href="/"
          className="text-sm text-accent underline underline-offset-4 hover:text-accent2"
        >
          ← back to calculator
        </Link>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="border border-line bg-white/60 rounded-xl p-5 mb-4">
      <h2 className="font-display text-lg tracking-tight mb-3">{title}</h2>
      {children}
    </article>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-ink/90">
      <span className="text-accent shrink-0">→</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Phase({
  tag,
  title,
  duration,
  verb,
  note,
  tint,
}: {
  tag: string;
  title: string;
  duration: string;
  verb: string;
  note: string;
  tint: "muted" | "accent";
}) {
  const color = tint === "accent" ? "border-accent/40 bg-accent/[0.06]" : "border-line bg-paper";
  const verbColor = tint === "accent" ? "text-accent" : "text-muted";
  return (
    <div className={`border ${color} rounded-xl p-3`}>
      <div className="text-[9px] uppercase tracking-[0.2em] text-muted">{tag}</div>
      <div className="font-display text-xl mt-0.5">{title}</div>
      <div className="text-[11px] text-muted">{duration}</div>
      <div className={`text-sm font-medium mt-2 ${verbColor}`}>{verb}</div>
      <div className="text-[11px] text-muted leading-tight">{note}</div>
    </div>
  );
}
