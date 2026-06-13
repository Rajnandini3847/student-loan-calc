// Indian education loan landscape — approximate 2026 rates. Floating rates
// linked to MCLR/EBLR/repo move with the market, so these are mid-band
// estimates. Always verify with the bank before signing.

export interface Bank {
  id: string;
  name: string;
  scheme: string;
  /** Annual rate range in percent */
  rateMin: number;
  rateMax: number;
  /** Mid-band rate the calculator uses when this bank is selected */
  rateMid: number;
  /** Max loan amount in rupees */
  maxAmount: number;
  /** Tenure max in years */
  tenureMaxYears: number;
  /** Collateral threshold in rupees — above this, collateral is usually required */
  collateralThreshold: number;
  type: "psu-bank" | "private-bank" | "nbfc";
  /** One-line USP / what they're known for */
  note: string;
  /** Whether they're known for being friendly to study-abroad applications */
  abroadFriendly: boolean;
}

export const BANKS: Bank[] = [
  {
    id: "sbi-scholar",
    name: "SBI",
    scheme: "Scholar Loan (premier institutes — IITs, NITs, IIMs, AIIMS)",
    rateMin: 8.15,
    rateMax: 10.15,
    rateMid: 8.65,
    maxAmount: 50_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 7_50_000,
    type: "psu-bank",
    note: "Cheapest rate in India if your college is on SBI's premier list.",
    abroadFriendly: false,
  },
  {
    id: "sbi-global",
    name: "SBI",
    scheme: "Global Ed-Vantage (study abroad)",
    rateMin: 8.65,
    rateMax: 11.65,
    rateMid: 10.15,
    maxAmount: 1_50_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 7_50_000,
    type: "psu-bank",
    note: "Up to ₹1.5 Cr for foreign universities. Tangible collateral usually needed.",
    abroadFriendly: true,
  },
  {
    id: "bob-scholar",
    name: "Bank of Baroda",
    scheme: "Baroda Scholar (study abroad)",
    rateMin: 8.0,
    rateMax: 11.5,
    rateMid: 9.7,
    maxAmount: 1_50_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 7_50_000,
    type: "psu-bank",
    note: "Strong rates for top global universities (QS rank, FT MBA list).",
    abroadFriendly: true,
  },
  {
    id: "pnb-saraswati",
    name: "PNB",
    scheme: "PNB Saraswati",
    rateMin: 8.55,
    rateMax: 11.5,
    rateMid: 9.75,
    maxAmount: 50_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 7_50_000,
    type: "psu-bank",
    note: "Standard PSU offering, predictable terms.",
    abroadFriendly: true,
  },
  {
    id: "canara-vidya",
    name: "Canara Bank",
    scheme: "Vidya Loan",
    rateMin: 9.25,
    rateMax: 11.5,
    rateMid: 10.25,
    maxAmount: 1_50_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 7_50_000,
    type: "psu-bank",
    note: "Good for South-India students. Includes IBA scheme.",
    abroadFriendly: true,
  },
  {
    id: "icici",
    name: "ICICI Bank",
    scheme: "Education Loan",
    rateMin: 9.75,
    rateMax: 11.75,
    rateMid: 10.75,
    maxAmount: 1_00_00_000,
    tenureMaxYears: 14,
    collateralThreshold: 40_00_000,
    type: "private-bank",
    note: "Faster processing than PSUs. Unsecured up to ₹40L for select courses.",
    abroadFriendly: true,
  },
  {
    id: "axis",
    name: "Axis Bank",
    scheme: "Education Loan",
    rateMin: 9.7,
    rateMax: 13.5,
    rateMid: 11.5,
    maxAmount: 75_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 40_00_000,
    type: "private-bank",
    note: "Flexible eligibility, especially for non-premier institutes.",
    abroadFriendly: true,
  },
  {
    id: "hdfc-credila",
    name: "HDFC Credila",
    scheme: "Secured Loan",
    rateMin: 9.95,
    rateMax: 11.95,
    rateMid: 10.5,
    maxAmount: 5_00_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 0,
    type: "nbfc",
    note: "Specialist for abroad studies. Very high ceilings. Secured = with collateral.",
    abroadFriendly: true,
  },
  {
    id: "hdfc-credila-unsecured",
    name: "HDFC Credila",
    scheme: "Unsecured Loan (no collateral)",
    rateMin: 11.25,
    rateMax: 13.5,
    rateMid: 12.25,
    maxAmount: 75_00_000,
    tenureMaxYears: 15,
    collateralThreshold: 0,
    type: "nbfc",
    note: "No collateral, faster sanction, but higher rate.",
    abroadFriendly: true,
  },
  {
    id: "avanse",
    name: "Avanse",
    scheme: "Education Loan",
    rateMin: 10.5,
    rateMax: 13.5,
    rateMid: 11.75,
    maxAmount: 75_00_000,
    tenureMaxYears: 12,
    collateralThreshold: 0,
    type: "nbfc",
    note: "5-10 day processing. Known for flexibility on co-applicant requirements.",
    abroadFriendly: true,
  },
  {
    id: "auxilo",
    name: "Auxilo",
    scheme: "Education Loan",
    rateMin: 12.0,
    rateMax: 14.0,
    rateMid: 13.0,
    maxAmount: 80_00_000,
    tenureMaxYears: 12,
    collateralThreshold: 0,
    type: "nbfc",
    note: "Higher rate but often approves cases other lenders reject.",
    abroadFriendly: true,
  },
  {
    id: "incred",
    name: "InCred",
    scheme: "Education Loan",
    rateMin: 11.25,
    rateMax: 15.0,
    rateMid: 12.5,
    maxAmount: 60_00_000,
    tenureMaxYears: 10,
    collateralThreshold: 0,
    type: "nbfc",
    note: "Tech-first NBFC, quick digital process.",
    abroadFriendly: true,
  },
];
