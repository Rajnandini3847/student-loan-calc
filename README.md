# student-loan-calc

> Punch in your course fees. See exactly what you'll pay back.

A plain-English education-loan calculator for Indian students. Shows monthly EMI, total interest, year-by-year repayment (with moratorium handling), 80E tax savings, and a live comparison across popular Indian banks.

## What it does

- **Calculator** (`/`): enter total fees, loan amount, course length, repayment tenure, and an interest rate (or pick a bank). See:
  - Monthly EMI
  - Total amount you'll repay
  - Total interest
  - Effective cost as a % over what you borrowed
  - Plain-English narrative of how the loan plays out
  - Stacked-bar chart, year-by-year
  - Live bank comparison — click any row to recalc with that bank's rate
  - Full year-by-year amortization schedule
  - Section 80E tax-savings estimate

- **Learn** (`/learn`): plain-English explainers — moratorium, capitalization, 80E, collateral thresholds, Vidya Lakshmi & PM-Vidyalaxmi, questions to ask before signing.

## Stack

- Next.js 14 (app router) + TypeScript + Tailwind
- Recharts for visualization
- No backend, no DB, no API keys. Pure client-side math.

## Calc model

- **Moratorium** = course duration + grace period. During this window, interest accrues monthly and (by default) compounds. Toggle "pay interest during moratorium" to keep principal flat.
- **Capitalization**: at the end of the moratorium, accrued interest is added to principal. EMI is then computed on the larger sum over the repayment tenure.
- **EMI formula**: `P × i × (1+i)ⁿ / ((1+i)ⁿ − 1)` where `i = annual_rate / 12 / 100`.
- **80E**: full interest deductible for up to 8 years (statutory cap). Multiplied by user-chosen tax slab.

Real loans are floating (linked to MCLR / EBLR / repo rate) — this is a planning tool, not a binding quote. The footer says so.

## Run locally

```bash
git clone https://github.com/Rajnandini3847/student-loan-calc
cd student-loan-calc
npm install
npm run dev
```

Visit http://localhost:3000.

## License

MIT.
