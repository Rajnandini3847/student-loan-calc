import Link from "next/link";

export const dynamic = "force-static";

export default function LearnPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="space-y-2 mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-accent">in plain english</div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          What you actually need to know about education loans.
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed">
          No jargon, no scare tactics. Just the things that change how much you'll pay.
        </p>
      </header>

      <Card title="What is an education loan, in 60 seconds">
        <p>
          A bank or NBFC lends you money to pay your college fees. You don't pay anything back while
          you're studying. After you graduate (plus a small grace period — usually 6 months to a
          year), you start paying it back in fixed monthly installments called EMIs. The catch:
          interest keeps adding up the whole time, including while you're still in college.
        </p>
      </Card>

      <Card title="The moratorium — the most misunderstood part">
        <p>
          The moratorium is the no-EMI window: your full course duration <strong>plus</strong>{" "}
          a 6–12 month grace period after you finish. During this time you don't owe a monthly
          payment. But interest is still piling up on the loan, every single month.
        </p>
        <p>
          What most banks do at the end of the moratorium: they take all that accrued interest and
          add it to the principal. So if you borrowed ₹20L for a 4-year course at 9.5%, after
          4.5 years of accrual you actually owe closer to ₹30L when your first EMI hits. You're
          paying interest on top of interest.
        </p>
      </Card>

      <Card title='Why "pay interest during the moratorium" is the cheat code'>
        <p>
          Most banks let you (or your parents) pay just the monthly interest while you're studying.
          It's a small amount each month — at ₹20L and 9.5%, around ₹16,000/mo. Doing this means
          interest never gets capitalized, so when EMI starts, you're still paying off the original
          ₹20L instead of the bloated ₹30L.
        </p>
        <p className="text-sm text-accent">
          Try both options in the calculator and watch the "total interest" number move. The
          savings are usually 10–20% of the entire loan cost.
        </p>
      </Card>

      <Card title="Section 80E — a tax break almost no one talks about">
        <p>
          Every rupee of interest you pay on your education loan is fully deductible from your
          taxable income, for up to 8 years after you start repaying. There's no upper cap.
        </p>
        <p>
          If you (or whoever's repaying, usually the student once they start earning) are in the
          30% slab, that's effectively a 30% rebate on every interest rupee. Set your tax slab in
          the calculator and you'll see the 80E savings broken out.
        </p>
        <p className="text-sm text-muted">
          One catch: 80E applies only to the <em>interest</em> portion, not the principal. And the
          loan has to be from a recognised financial institution or approved charitable institution.
        </p>
      </Card>

      <Card title="When you need collateral (and when you don't)">
        <p>The standard thresholds in India:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-accent">
          <li>
            <strong>Up to ₹4 lakh:</strong> no collateral, no co-applicant guarantor required.
          </li>
          <li>
            <strong>₹4–7.5 lakh:</strong> still no collateral, but you need a co-applicant
            (usually a parent) as a guarantor.
          </li>
          <li>
            <strong>Above ₹7.5 lakh:</strong> tangible collateral required — typically a property,
            FD, LIC policy, or government securities worth at least the loan amount. Some NBFCs
            (HDFC Credila unsecured, Avanse, Auxilo) will go higher without collateral but charge
            a meaningfully higher rate to compensate.
          </li>
        </ul>
      </Card>

      <Card title="Vidya Lakshmi & PM-Vidyalaxmi — the government angle">
        <p>
          The{" "}
          <a className="text-accent underline" href="https://www.vidyalakshmi.co.in/" target="_blank" rel="noreferrer">
            Vidya Lakshmi portal
          </a>{" "}
          is a single application gateway to over 40 banks for education loans — saves the
          shoe-leather of walking into each one.
        </p>
        <p>
          The newer <strong>PM Vidyalaxmi scheme</strong> (rolled out 2024–25) covers students at
          the top 860 institutes on NIRF rankings with collateral-free, guarantor-free loans up to
          ₹10L, plus a 3% interest subvention if your family income is under ₹8L. Worth checking
          if your institute is on the list before you go to a private NBFC.
        </p>
      </Card>

      <Card title="5 questions to ask before signing">
        <ol className="list-decimal pl-5 space-y-1.5 marker:text-accent marker:font-semibold">
          <li>
            What's the all-in rate today — and how often does it reset? (Most loans float with
            MCLR or repo; your rate today is not your rate forever.)
          </li>
          <li>
            What's the processing fee, and is it included in the loan or paid upfront?
          </li>
          <li>
            Is there a prepayment penalty? (RBI banned this for floating-rate retail loans, but
            fixed-rate ones and NBFCs sometimes charge.)
          </li>
          <li>
            Can I pay just the interest during the moratorium without an extra fee?
          </li>
          <li>
            What happens if I drop the course, switch colleges, or take a break? (You want to know
            this before signing, not after.)
          </li>
        </ol>
      </Card>

      <Card title="Things that change your rate (and how to negotiate)">
        <ul className="list-disc pl-5 space-y-1.5 marker:text-accent">
          <li>
            <strong>Your institute.</strong> SBI, BoB, and ICICI maintain "premier" lists (IITs,
            IIMs, top global B-schools, QS top-100) that get the best rate. Check if your school
            is on it before applying.
          </li>
          <li>
            <strong>Female student discount.</strong> Most PSU banks offer a 0.5% concession for
            female applicants. It's automatic — don't forget to claim it.
          </li>
          <li>
            <strong>Co-applicant's credit score.</strong> A parent with a 750+ CIBIL score helps
            you get the lower end of the rate band.
          </li>
          <li>
            <strong>Multiple offers.</strong> Get a sanction letter from one bank, then walk into
            a second and ask if they'll beat it. They often will.
          </li>
        </ul>
      </Card>

      <div className="border border-line bg-paper rounded-xl p-5 mt-10">
        <h3 className="font-display text-lg mb-2">a small disclaimer</h3>
        <p className="text-sm text-muted leading-relaxed">
          Rates change. Schemes change. NBFCs come and go. The numbers shown in the calculator are
          mid-band 2026 estimates. Always verify with the bank, read the sanction letter carefully,
          and ask a chartered accountant about the tax angle before you make a big decision.
        </p>
      </div>

      <div className="text-center pt-8">
        <Link href="/" className="text-sm text-accent underline underline-offset-4 hover:text-accent2">
          ← back to the calculator
        </Link>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="border border-line bg-white/60 rounded-xl p-5 sm:p-6 mb-5 space-y-3">
      <h2 className="font-display text-xl tracking-tight">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 text-ink/90">{children}</div>
    </article>
  );
}
