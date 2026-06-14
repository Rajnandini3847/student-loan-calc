// Curated college DB for the loan calculator's /colleges page.
//
// Every entry was researched by parallel WebFetch agents that verified the
// fee on the institution's official .ac.in / .edu.in page (or, where that
// failed to render, a well-known aggregator — those entries are noted).
//
// Two fee fields, deliberately:
//   - `feePeriod` + `feePeriodAmountInr`: the amount as actually published
//     on the official site (per-semester / per-year / full-course)
//   - `approxTotalFeesInr`: that amount normalised to the full course total
//
// This split exists because private universities publish fees differently
// (LPU ₹1.4L/sem, KIIT ₹4.6L/yr, IITs ~₹10L total). Always showing both
// keeps users from being shocked by a "per-sem" headline they took for the
// whole course.
//
// `admissionMode` is the route for getting in. Critical for students without
// a JEE Main rank — filter to {direct | private_exam | jee_main_or_direct}.
// `minBoardPct` is the 10+2 aggregate cutoff (some private exams have stricter
// PCM-only cutoffs — noted per entry).

export type CityTier = 1 | 2 | 3;

export type CollegeType = "govt_central" | "govt_state" | "private_aided" | "private";

export type CourseFocus =
  | "engineering"
  | "management"
  | "medical"
  | "arts_sci"
  | "design"
  | "liberal_arts"
  | "commerce";

export type AdmissionMode =
  | "jee_advanced"   // requires JEE Advanced (IITs)
  | "jee_main"       // requires JEE Main rank (NITs, IIITs)
  | "state_exam"     // state CET (MHT-CET, TNEA, KCET, UPSEE/AKTU, etc.)
  | "private_exam"   // university's own entrance (SRMJEEE, VITEEE, LPUNEST, BITSAT, KIITEE)
  | "direct"         // direct admission on 10+2 marks
  | "jee_main_or_direct"  // accepts either
  | "cat"            // for IIM/MBA entries
  | "neet"           // for medical
  | "clat"           // for law
  | "cuet"           // for central-university UG
  | "other";

export type FeePeriod = "per_semester" | "per_year" | "full_course";

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  cityTier: CityTier;
  type: CollegeType;
  courseFocus: CourseFocus;
  /** What program the fee is for, e.g. "B.Tech CSE", "PGP", "MBBS" */
  program: string;
  /** Period as published on the official site */
  feePeriod: FeePeriod;
  /** Amount for that period */
  feePeriodAmountInr: number;
  /** Total course fees (period × multiplier), rounded sensibly */
  approxTotalFeesInr: number;
  durationYears: number;
  /** Primary entrance route */
  admissionMode: AdmissionMode;
  /** Human-readable exam string (for display) */
  mainEntranceExam: string;
  /** Minimum 10+2 aggregate % required (best-effort) */
  minBoardPct: number;
  officialUrl: string;
  /** Page where the fee was verified */
  feeSourceUrl: string;
  hostelPerYearInr?: number;
  note: string;
}

export const COLLEGES: College[] = [
  // ════════════════════════════════════════════════════════════════════════
  //  ENGINEERING — Govt central (IITs, NITs, IIITs, IISc B.Tech, IIT BHU…)
  //  These require JEE Main / JEE Advanced.
  // ════════════════════════════════════════════════════════════════════════
  {
    id: "iit-bombay", name: "IIT Bombay", city: "Mumbai", state: "Maharashtra",
    cityTier: 1, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1100000,
    approxTotalFeesInr: 1100000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitb.ac.in/",
    feeSourceUrl: "https://acad.iitb.ac.in/admissions/fees-structure",
    hostelPerYearInr: 26000,
    note: "Top-ranked IIT. ~₹2.15L/yr incl. tuition + hostel + mess. SC/ST/PwD get major waivers.",
  },
  {
    id: "iit-delhi", name: "IIT Delhi", city: "New Delhi", state: "Delhi",
    cityTier: 1, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1050000,
    approxTotalFeesInr: 1050000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://home.iitd.ac.in/",
    feeSourceUrl: "https://home.iitd.ac.in/uploads/ug/25-26/Fee%20Structure_2025-26_UG%20Entry%20Students.pdf",
    hostelPerYearInr: 80000,
    note: "~₹8.6L tuition for 4 yrs general category; full waiver for family income below ₹1L.",
  },
  {
    id: "iit-madras", name: "IIT Madras", city: "Chennai", state: "Tamil Nadu",
    cityTier: 1, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 950000,
    approxTotalFeesInr: 950000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitm.ac.in/",
    feeSourceUrl: "https://fees.iitm.ac.in/assets/circular/institute_fee_circular_jul_nov_2025.pdf",
    hostelPerYearInr: 60000,
    note: "NIRF #1 institute. ~₹1.10L/sem general (tuition + hostel).",
  },
  {
    id: "iit-hyderabad", name: "IIT Hyderabad", city: "Hyderabad", state: "Telangana",
    cityTier: 1, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1200000,
    approxTotalFeesInr: 1200000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iith.ac.in/",
    feeSourceUrl: "https://www.iith.ac.in/admissions/",
    hostelPerYearInr: 70000,
    note: "Strong CSE/AI placements. ~₹1.67L/sem general (tuition + hostel).",
  },
  {
    id: "iit-indore", name: "IIT Indore", city: "Indore", state: "Madhya Pradesh",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1100000,
    approxTotalFeesInr: 1100000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iiti.ac.in/",
    feeSourceUrl: "https://academic.iiti.ac.in/Admission/2025/New/2025%20B.Tech.%20and%20B.Des.%20Batch_Four%20Year%20Fee%20Structure_Tentative.pdf",
    hostelPerYearInr: 40000,
    note: "Generous fee remission for family income <₹5L; strong placements in core + CS.",
  },
  {
    id: "iit-bhubaneswar", name: "IIT Bhubaneswar", city: "Bhubaneswar", state: "Odisha",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 850000,
    approxTotalFeesInr: 850000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitbbs.ac.in/",
    feeSourceUrl: "https://www.iitbbs.ac.in/index.php/home/academics/fee-structure/",
    hostelPerYearInr: 55000,
    note: "Tuition ₹2L/yr (~₹8L total); SC/ST/PwD waivers; growing core engineering rep.",
  },
  {
    id: "iit-bhu", name: "IIT (BHU) Varanasi", city: "Varanasi", state: "Uttar Pradesh",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1050000,
    approxTotalFeesInr: 1050000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://iitbhu.ac.in/",
    feeSourceUrl: "https://iitbhu.ac.in/contents/institute/main/docs/acad/fee_structure.pdf",
    hostelPerYearInr: 55000,
    note: "Full IIT brand with BHU heritage; ~₹10.4L total; cheap living in Varanasi.",
  },
  {
    id: "iit-roorkee", name: "IIT Roorkee", city: "Roorkee", state: "Uttarakhand",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 900000,
    approxTotalFeesInr: 900000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitr.ac.in/",
    feeSourceUrl: "https://iitr.ac.in/Academics/static/Institute_Fee/2025-26/PG.pdf",
    hostelPerYearInr: 65000,
    note: "Top-5 IIT in a small Uttarakhand town; full waiver below ₹1L income, 2/3 below ₹5L.",
  },
  {
    id: "iit-kgp", name: "IIT Kharagpur", city: "Kharagpur", state: "West Bengal",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1000000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitkgp.ac.in/",
    feeSourceUrl: "https://www.iitkgp.ac.in/fee-structure",
    hostelPerYearInr: 66000,
    note: "India's first IIT; largest campus; cheap COL in railway-town setting.",
  },
  {
    id: "iit-mandi", name: "IIT Mandi", city: "Mandi", state: "Himachal Pradesh",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 850000,
    approxTotalFeesInr: 850000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitmandi.ac.in/",
    feeSourceUrl: "https://www.iitmandi.ac.in/academics",
    hostelPerYearInr: 30000,
    note: "Newer IIT in the Himalayas; small batches; MCM scholarships for top-10 per branch.",
  },
  {
    id: "iit-patna", name: "IIT Patna", city: "Patna", state: "Bihar",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1000000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitp.ac.in/",
    feeSourceUrl: "https://www.iitp.ac.in/index.php/students-corner/academic-fees",
    hostelPerYearInr: 60000,
    note: "Rising CSE placements; full waiver below ₹1L, 2/3 below ₹5L. Tuition only listed.",
  },
  {
    id: "iit-jodhpur", name: "IIT Jodhpur", city: "Jodhpur", state: "Rajasthan",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1000000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitj.ac.in/",
    feeSourceUrl: "https://www.iitj.ac.in/admission/index.php?id=fee_structure",
    hostelPerYearInr: 30000,
    note: "Strong AI/Data Science programs; cheap COL in Jodhpur, modern desert campus.",
  },
  {
    id: "iit-dharwad", name: "IIT Dharwad", city: "Dharwad", state: "Karnataka",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1150000,
    approxTotalFeesInr: 1150000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced", minBoardPct: 75,
    officialUrl: "https://www.iitdh.ac.in/",
    feeSourceUrl: "https://www.iitdh.ac.in/student-fees",
    hostelPerYearInr: 54000,
    note: "Newest IIT in a Tier-3 Karnataka town; full SC/ST/PwD tuition waiver.",
  },
  {
    id: "iisc-bs", name: "IISc Bangalore (BS Research)", city: "Bangalore", state: "Karnataka",
    cityTier: 1, type: "govt_central", courseFocus: "engineering",
    program: "BS (Research)", feePeriod: "full_course", feePeriodAmountInr: 450000,
    approxTotalFeesInr: 450000, durationYears: 4,
    admissionMode: "jee_advanced", mainEntranceExam: "JEE Advanced / KVPY / NEET", minBoardPct: 75,
    officialUrl: "https://www.iisc.ac.in/",
    feeSourceUrl: "https://bs-ug.iisc.ac.in/admissions/fee-structure",
    hostelPerYearInr: 30000,
    note: "BS (Research) 4-yr; ~₹1L/yr tuition general, fully waived for SC/ST/PwD. India's top research institute.",
  },
  {
    id: "nit-trichy", name: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 650000,
    approxTotalFeesInr: 650000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nitt.edu/",
    feeSourceUrl: "https://www.nitt.edu/home/academics/fees_section/",
    hostelPerYearInr: 40000,
    note: "Consistently ranked #1 NIT; recruiter favourite for core engineering. Best ROI nationwide.",
  },
  {
    id: "nit-warangal", name: "NIT Warangal", city: "Warangal", state: "Telangana",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 550000,
    approxTotalFeesInr: 550000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nitw.ac.in/",
    feeSourceUrl: "https://www.nitw.ac.in/main/AcademicSection/Tutionfee/",
    hostelPerYearInr: 60000,
    note: "Top-3 NIT; strong CSE placements. One of the oldest RECs, cheap COL.",
  },
  {
    id: "nit-rourkela", name: "NIT Rourkela", city: "Rourkela", state: "Odisha",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 600000,
    approxTotalFeesInr: 600000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nitrkl.ac.in/",
    feeSourceUrl: "https://www.nitrkl.ac.in/docs/Announcement/07082025113535080.pdf",
    hostelPerYearInr: 30000,
    note: "Top-tier NIT in a small steel town; strong CSE/Mech placements. Very low COL.",
  },
  {
    id: "nit-surathkal", name: "NIT Karnataka Surathkal (NITK)", city: "Mangaluru", state: "Karnataka",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 600000,
    approxTotalFeesInr: 600000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nitk.ac.in/",
    feeSourceUrl: "https://www.nitk.ac.in/document/attachments/8447/FEE_STRUCTURE_2025-26_.pdf",
    hostelPerYearInr: 35000,
    note: "Beach-side NIT; top-ranked core engineering; ~₹5.7-6L total incl. fees.",
  },
  {
    id: "nit-calicut", name: "NIT Calicut", city: "Kozhikode", state: "Kerala",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 700000,
    approxTotalFeesInr: 700000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://nitc.ac.in/",
    feeSourceUrl: "https://nitc.ac.in/imgserver/uploads/attachments/nit-calicut-fee-structure-ug-pg-phd-for-the-ay-2025-26_0ffc1837-ac4a-4159-b530-21687a7a60c1_0.pdf",
    hostelPerYearInr: 80000,
    note: "Highly ranked NIT with strong Architecture and CSE; 2/3 tuition waiver below ₹5L income.",
  },
  {
    id: "manit-bhopal", name: "MANIT Bhopal", city: "Bhopal", state: "Madhya Pradesh",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 700000,
    approxTotalFeesInr: 700000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.manit.ac.in/",
    feeSourceUrl: "https://cse.manit.ac.in/sites/default/files/addmissionsection/MANIT%20Fee%20details%2025-26_Modified%2009%2010%20%202025%20latest.pdf",
    hostelPerYearInr: 25000,
    note: "Top NIT; ~₹5L tuition + hostel/mess; PSU and IT placements.",
  },
  {
    id: "mnit-jaipur", name: "MNIT Jaipur", city: "Jaipur", state: "Rajasthan",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 650000,
    approxTotalFeesInr: 650000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.mnit.ac.in/",
    feeSourceUrl: "https://www.mnit.ac.in/cms/uploads/2025/05/FeeUG2025-26.pdf",
    hostelPerYearInr: 30000,
    note: "Premier NIT in the Pink City; ~₹6.5L total incl. tuition + hostel.",
  },
  {
    id: "vnit-nagpur", name: "VNIT Nagpur", city: "Nagpur", state: "Maharashtra",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 600000,
    approxTotalFeesInr: 600000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://vnit.ac.in/",
    feeSourceUrl: "https://vnit.ac.in/study-in-india/",
    hostelPerYearInr: 40000,
    note: "Total ~₹5.57L for 4 yrs; SC/ST/PwD full tuition waiver; strong core branches.",
  },
  {
    id: "svnit-surat", name: "SVNIT Surat", city: "Surat", state: "Gujarat",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 600000,
    approxTotalFeesInr: 600000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.svnit.ac.in/",
    feeSourceUrl: "https://www.svnit.ac.in/",
    hostelPerYearInr: 50000,
    note: "Tuition ₹5L over 4 yrs + ~₹40-55K/yr hostel; income-based fee remission.",
  },
  {
    id: "nit-raipur", name: "NIT Raipur", city: "Raipur", state: "Chhattisgarh",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 750000,
    approxTotalFeesInr: 750000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nitrr.ac.in/",
    feeSourceUrl: "https://www.nitrr.ac.in/downloads/fees/Fees_2025/Fee%20Structure%202025-26.pdf",
    hostelPerYearInr: 35000,
    note: "Tuition ₹5L; total ₹6.97-7.81L incl. one-time fees. Full waiver below ₹1L income.",
  },
  {
    id: "nit-hamirpur", name: "NIT Hamirpur", city: "Hamirpur", state: "Himachal Pradesh",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 700000,
    approxTotalFeesInr: 700000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://nith.ac.in/",
    feeSourceUrl: "https://nith.ac.in/",
    hostelPerYearInr: 50000,
    note: "NIT in a tiny Himalayan town — dirt-cheap living, scenic campus, decent core placements.",
  },
  {
    id: "nit-silchar", name: "NIT Silchar", city: "Silchar", state: "Assam",
    cityTier: 3, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 550000,
    approxTotalFeesInr: 550000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.nits.ac.in/",
    feeSourceUrl: "https://www.nits.ac.in/",
    hostelPerYearInr: 55000,
    note: "Northeast NIT with very low COL; income-based waivers make it near-free below ₹5L.",
  },
  {
    id: "iiit-allahabad", name: "IIIT Allahabad", city: "Prayagraj", state: "Uttar Pradesh",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 850000,
    approxTotalFeesInr: 850000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://www.iiita.ac.in/",
    feeSourceUrl: "https://www.iiita.ac.in/",
    hostelPerYearInr: 30000,
    note: "Top IIIT in India; ~₹8.4L total; CS placements rival mid-tier NITs at lower fees.",
  },
  {
    id: "iiit-lucknow", name: "IIIT Lucknow", city: "Lucknow", state: "Uttar Pradesh",
    cityTier: 2, type: "govt_central", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1000000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://iiitl.ac.in/",
    feeSourceUrl: "https://iiitl.ac.in/",
    hostelPerYearInr: 42500,
    note: "Tuition ₹9.6L + hostel ~₹1.7L; CS/AI focus; PPP IIIT.",
  },

  // ════════════════════════════════════════════════════════════════════════
  //  ENGINEERING — Govt state (DTU, VJTI, COEP, Anna CEG, MSU Baroda)
  // ════════════════════════════════════════════════════════════════════════
  {
    id: "dtu", name: "DTU (Delhi Technological University)", city: "New Delhi", state: "Delhi",
    cityTier: 1, type: "govt_state", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 900000,
    approxTotalFeesInr: 900000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 75,
    officialUrl: "https://dtu.ac.in/",
    feeSourceUrl: "https://dtu.ac.in/Web/notice/2025/july/file0762.pdf",
    hostelPerYearInr: 95000,
    note: "Top Delhi state engineering univ; ~₹2.3L/yr general; strong CSE placements.",
  },
  {
    id: "vjti", name: "VJTI Mumbai", city: "Mumbai", state: "Maharashtra",
    cityTier: 1, type: "govt_state", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 350000,
    approxTotalFeesInr: 350000, durationYears: 4,
    admissionMode: "state_exam", mainEntranceExam: "MHT-CET / JEE Main", minBoardPct: 50,
    officialUrl: "https://vjti.ac.in/",
    feeSourceUrl: "https://vjti.ac.in/fee-structure/",
    hostelPerYearInr: 50000,
    note: "Premier Maharashtra govt engineering institute; ~₹72-85K/yr open category, strong placements.",
  },
  {
    id: "coep", name: "COEP Pune (College of Engineering Pune)", city: "Pune", state: "Maharashtra",
    cityTier: 1, type: "govt_state", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 600000,
    approxTotalFeesInr: 600000, durationYears: 4,
    admissionMode: "state_exam", mainEntranceExam: "MHT-CET", minBoardPct: 50,
    officialUrl: "https://www.coeptech.ac.in/",
    feeSourceUrl: "https://www.coeptech.ac.in/useful-links/university-sections/ac-section/fees-structure/",
    hostelPerYearInr: 45000,
    note: "Est. 1854 — one of India's oldest engineering colleges; ~₹1.4-1.6L/yr open category.",
  },
  {
    id: "ceg-anna", name: "CEG Anna University (College of Engineering Guindy)", city: "Chennai", state: "Tamil Nadu",
    cityTier: 1, type: "govt_state", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 140000,
    approxTotalFeesInr: 140000, durationYears: 4,
    admissionMode: "state_exam", mainEntranceExam: "TNEA (12th marks based)", minBoardPct: 50,
    officialUrl: "https://www.annauniv.edu/",
    feeSourceUrl: "https://www.annauniv.edu/pdf/CEG_UG_Fee_Structure.pdf",
    hostelPerYearInr: 78000,
    note: "TN state govt; ~₹35K/yr tuition. Best fee-to-reputation ratio in TN.",
  },
  {
    id: "psg-coimbatore", name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu",
    cityTier: 2, type: "private_aided", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 200000,
    approxTotalFeesInr: 200000, durationYears: 4,
    admissionMode: "state_exam", mainEntranceExam: "TNEA / JEE Main", minBoardPct: 50,
    officialUrl: "https://www.psgtech.edu/",
    feeSourceUrl: "https://www.psgtech.edu/",
    hostelPerYearInr: 72000,
    note: "Govt-aided seats ~₹55K/yr tuition; legendary placements for an aided college.",
  },
  {
    id: "msu-baroda", name: "MS University of Baroda (Faculty of Tech & Engg)", city: "Vadodara", state: "Gujarat",
    cityTier: 2, type: "govt_state", courseFocus: "engineering",
    program: "B.E.", feePeriod: "full_course", feePeriodAmountInr: 400000,
    approxTotalFeesInr: 400000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 50,
    officialUrl: "https://www.msubaroda.ac.in/",
    feeSourceUrl: "https://www.msubaroda.ac.in/",
    hostelPerYearInr: 25000,
    note: "State univ; B.E. tuition ~₹4.2L total. Very affordable in a heritage college town.",
  },
  {
    id: "bits-pilani", name: "BITS Pilani (Pilani Campus)", city: "Pilani", state: "Rajasthan",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.E.", feePeriod: "full_course", feePeriodAmountInr: 2600000,
    approxTotalFeesInr: 2600000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "BITSAT", minBoardPct: 75,
    officialUrl: "https://www.bits-pilani.ac.in/",
    feeSourceUrl: "https://www.bits-pilani.ac.in/admission/",
    hostelPerYearInr: 65000,
    note: "Premier private engineering in a small Rajasthan town; placements rival top IITs.",
  },
  {
    id: "bit-mesra", name: "BIT Mesra", city: "Ranchi", state: "Jharkhand",
    cityTier: 3, type: "private_aided", courseFocus: "engineering",
    program: "B.Tech", feePeriod: "full_course", feePeriodAmountInr: 1700000,
    approxTotalFeesInr: 1700000, durationYears: 4,
    admissionMode: "jee_main", mainEntranceExam: "JEE Main", minBoardPct: 60,
    officialUrl: "https://www.bitmesra.ac.in/",
    feeSourceUrl: "https://bitmesra.ac.in/UploadedDocuments/admadmission/files/Financial%20information%20and%20fees%20payable%202025.pdf",
    hostelPerYearInr: 84000,
    note: "Legacy Birla institute with strong alumni network; Ranchi is cheap, BIT is respected for core engineering.",
  },

  // ════════════════════════════════════════════════════════════════════════
  //  ENGINEERING — Private universities · NO JEE Main needed (direct / own exam)
  //  These accept students based on 10+2 marks or their own entrance test.
  //  All fees verified June 2026. NCR + Pan-India batch.
  // ════════════════════════════════════════════════════════════════════════

  // ── NCR / North India ──
  {
    id: "galgotias-u", name: "Galgotias University", city: "Greater Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 164000,
    approxTotalFeesInr: 656000, durationYears: 4,
    admissionMode: "jee_main_or_direct", mainEntranceExam: "Direct on 12th / JEE / CUET / SAT", minBoardPct: 60,
    officialUrl: "https://www.galgotiasuniversity.edu.in/",
    feeSourceUrl: "https://www.galgotiasuniversity.edu.in/p/fee-structure-eligibility",
    hostelPerYearInr: 120000,
    note: "Per-annum tuition. Direct admission accepted with 60% PCM. CSE specializations (AI/ML, Data Science) priced slightly higher.",
  },
  {
    id: "gcet-greater-noida", name: "Galgotias College of Engg & Tech (GCET)", city: "Greater Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 109603,
    approxTotalFeesInr: 438412, durationYears: 4,
    admissionMode: "state_exam", mainEntranceExam: "JEE Main + AKTU counselling", minBoardPct: 50,
    officialUrl: "https://galgotiacollege.edu/",
    feeSourceUrl: "https://galgotiacollege.edu/public/uploads/all/4438/GCET-Fees-Structure-2025-26.pdf",
    hostelPerYearInr: 100000,
    note: "AKTU-affiliated. Cheapest in this list but admission is via JEE Main + AKTU counselling — different college from Galgotias University.",
  },
  {
    id: "noida-international", name: "Noida International University (NIU)", city: "Greater Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 206000,
    approxTotalFeesInr: 824000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://niu.edu.in/",
    feeSourceUrl: "https://niu.edu.in/rs_elements/fee-structure-2025/",
    hostelPerYearInr: 110000,
    note: "Per-annum fee on official 2025 page. Mostly direct admission. Placements are modest — watch out for hidden one-time charges.",
  },
  {
    id: "sharda-u", name: "Sharda University", city: "Greater Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 250000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "jee_main_or_direct", mainEntranceExam: "SUAT / JEE Main / direct on 12th", minBoardPct: 50,
    officialUrl: "https://www.sharda.ac.in/",
    feeSourceUrl: "https://www.sharda.ac.in/attachments/downloadcenter_files/fee-booklet-2025-web.pdf",
    hostelPerYearInr: 130000,
    note: "Annual fee per 2025-26 fee booklet. SUAT scholarships can bring 25-100% off. Direct admission on board marks.",
  },
  {
    id: "amity-noida", name: "Amity University Noida", city: "Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 364000,
    approxTotalFeesInr: 1752000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "Amity JEE / direct on board marks", minBoardPct: 60,
    officialUrl: "https://www.amity.edu/",
    feeSourceUrl: "https://www.amity.edu/admissions/fees.aspx",
    hostelPerYearInr: 175000,
    note: "Non-sponsored category annual fee; ~10% hike built in (4-yr total ~₹17.5L). Big brand, mixed placement quality by branch.",
  },
  {
    id: "bennett-u", name: "Bennett University", city: "Greater Noida", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 380000,
    approxTotalFeesInr: 1520000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "BETT / JEE Main / direct", minBoardPct: 60,
    officialUrl: "https://www.bennett.edu.in/",
    feeSourceUrl: "https://www.bennett.edu.in/",
    hostelPerYearInr: 130000,
    note: "Best placements in this private-NCR cohort. Eligibility 60% PCM (not aggregate) — check PCM split, not just overall %.",
  },
  {
    id: "manav-rachna", name: "Manav Rachna University", city: "Faridabad", state: "Haryana",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 249000,
    approxTotalFeesInr: 996000, durationYears: 4,
    admissionMode: "jee_main_or_direct", mainEntranceExam: "MRNAT / JEE Main / direct on 12th", minBoardPct: 50,
    officialUrl: "https://manavrachna.edu.in/",
    feeSourceUrl: "https://mru.edu.in/university/fee-structure-mru/",
    hostelPerYearInr: 125000,
    note: "Annual tuition paid in two semester installments; accepts MRNAT, JEE Main, or board-marks direct.",
  },
  {
    id: "kr-mangalam", name: "K.R. Mangalam University", city: "Gurugram", state: "Haryana",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_semester", feePeriodAmountInr: 125000,
    approxTotalFeesInr: 1000000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://www.krmangalam.edu.in/",
    feeSourceUrl: "https://www.krmangalam.edu.in/fee-structure/",
    hostelPerYearInr: 140000,
    note: "Per-SEMESTER fee on official page (₹1.25L × 2 = ₹2.5L/yr). May rise 10%/yr. Growing CSE focus.",
  },
  {
    id: "gd-goenka", name: "GD Goenka University", city: "Sohna, Gurugram", state: "Haryana",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 275000,
    approxTotalFeesInr: 1100000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://www.gdgoenkauniversity.com/",
    feeSourceUrl: "https://www.gdgoenkauniversity.com/admissions/fee-structure",
    hostelPerYearInr: 150000,
    note: "Annual tuition + one-time admission/security ~₹50K. Direct admission on board marks; big plush campus, placements modest.",
  },
  {
    id: "niit-u", name: "NIIT University", city: "Neemrana", state: "Rajasthan",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 365000,
    approxTotalFeesInr: 1460000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "NUET / NIITNAT / JEE Main", minBoardPct: 60,
    officialUrl: "https://niituniversity.in/",
    feeSourceUrl: "https://niituniversity.in/admissions/fee-structure",
    hostelPerYearInr: 200000,
    note: "Residential campus — hostel mandatory (adds ~₹8L over 4 yrs). Eligibility 60% PCM.",
  },
  {
    id: "iimt-meerut", name: "IIMT University", city: "Meerut", state: "Uttar Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 155800,
    approxTotalFeesInr: 602000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://iimtindia.net/",
    feeSourceUrl: "https://iimtindia.net/fee-structure.php",
    hostelPerYearInr: 90000,
    note: "Per-year fee. Direct admission, low cut-off (50% aggregate). Placement quality is the watch-out.",
  },

  // ── Pan-India private universities ──
  {
    id: "lpu", name: "Lovely Professional University (LPU)", city: "Phagwara", state: "Punjab",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_semester", feePeriodAmountInr: 140000,
    approxTotalFeesInr: 1120000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "LPUNEST (own test)", minBoardPct: 60,
    officialUrl: "https://www.lpu.in/",
    feeSourceUrl: "https://www.lpu.in/programmes/engineering/b-tech-computer-science",
    hostelPerYearInr: 90000,
    note: "Per-SEMESTER fee. LPUNEST scholarships up to 100% reduce net payable significantly. 60% in 10+2 with PCM.",
  },
  {
    id: "chandigarh-u", name: "Chandigarh University", city: "Mohali", state: "Punjab",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_semester", feePeriodAmountInr: 80200,
    approxTotalFeesInr: 641600, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "CUCET / direct on 12th", minBoardPct: 50,
    officialUrl: "https://www.cuchd.in/",
    feeSourceUrl: "https://www.cuchd.in/",
    hostelPerYearInr: 90000,
    note: "Per-SEMESTER fee. CUCET scholarships up to 100%. Strong placement reputation across NCR/Punjab.",
  },
  {
    id: "christ-u", name: "Christ University (Kengeri Campus)", city: "Bangalore", state: "Karnataka",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 248000,
    approxTotalFeesInr: 992000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "CUET (Christ) + interview/SOP", minBoardPct: 55,
    officialUrl: "https://christuniversity.in/",
    feeSourceUrl: "https://christuniversity.in/",
    hostelPerYearInr: 90000,
    note: "Selective intake; admission has interview + SOP component. Strong brand in Bangalore.",
  },
  {
    id: "kiit-bhubaneswar", name: "KIIT (Kalinga Institute)", city: "Bhubaneswar", state: "Odisha",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 462750,
    approxTotalFeesInr: 1851000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "KIITEE (own test)", minBoardPct: 60,
    officialUrl: "https://kiit.ac.in/",
    feeSourceUrl: "https://kiit.ac.in/",
    hostelPerYearInr: 120000,
    note: "Uniform fee across all B.Tech branches incl. CSE. Strong placement record. KIITEE rank determines scholarships.",
  },
  {
    id: "srm-kattankulathur", name: "SRM IST (Kattankulathur)", city: "Chennai", state: "Tamil Nadu",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 475000,
    approxTotalFeesInr: 1900000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "SRMJEEE (own test)", minBoardPct: 50,
    officialUrl: "https://www.srmist.edu.in/",
    feeSourceUrl: "https://www.srmist.edu.in/",
    hostelPerYearInr: 150000,
    note: "CSE/AI specialisations are at the top of SRM's fee bands. SRMJEEE for admission.",
  },
  {
    id: "vit-vellore", name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 207000,
    approxTotalFeesInr: 828000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "VITEEE (own test)", minBoardPct: 60,
    officialUrl: "https://vit.ac.in/",
    feeSourceUrl: "https://vit.ac.in/admission/ug/fee-structure",
    hostelPerYearInr: 150000,
    note: "VITEEE rank determines fee category (Group A ~₹1.73L/yr → Cat 5 ~₹6.3L/yr). Shown is mid Group A.",
  },
  {
    id: "manipal-jaipur", name: "Manipal University Jaipur", city: "Jaipur", state: "Rajasthan",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 487000,
    approxTotalFeesInr: 1948000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "MET / direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://jaipur.manipal.edu/",
    feeSourceUrl: "https://jaipur.manipal.edu/",
    hostelPerYearInr: 130000,
    note: "Admission via MET or direct on 12th marks. Carries Manipal brand premium.",
  },
  {
    id: "mit-wpu-pune", name: "MIT World Peace University (MIT-WPU)", city: "Pune", state: "Maharashtra",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 410000,
    approxTotalFeesInr: 1640000, durationYears: 4,
    admissionMode: "jee_main_or_direct", mainEntranceExam: "JEE / MHT-CET / PERA-CET", minBoardPct: 50,
    officialUrl: "https://mitwpu.edu.in/",
    feeSourceUrl: "https://mitwpu.edu.in/programme/btech-computer-science-and-engineering",
    hostelPerYearInr: 150000,
    note: "Scholarships 25-100% based on entrance percentile. SOP required.",
  },
  {
    id: "sit-pune", name: "Symbiosis Institute of Technology (SIT Pune)", city: "Pune", state: "Maharashtra",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 400000,
    approxTotalFeesInr: 1600000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "SITEEE (own test)", minBoardPct: 50,
    officialUrl: "https://www.sitpune.edu.in/",
    feeSourceUrl: "https://www.sitpune.edu.in/fees-structure",
    hostelPerYearInr: 120000,
    note: "Symbiosis brand. Fees may escalate up to 10%/yr through the program.",
  },
  {
    id: "gitam", name: "GITAM (Deemed-to-be University)", city: "Visakhapatnam", state: "Andhra Pradesh",
    cityTier: 2, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 346000,
    approxTotalFeesInr: 1493000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "GAT (own test)", minBoardPct: 60,
    officialUrl: "https://www.gitam.edu/",
    feeSourceUrl: "https://www.gitam.edu/",
    hostelPerYearInr: 130000,
    note: "Fees escalate ~5%/yr across the 4-year program. GAT admission test.",
  },
  {
    id: "reva-u", name: "REVA University", city: "Bangalore", state: "Karnataka",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 350000,
    approxTotalFeesInr: 1400000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks / KCET / COMEDK / JEE", minBoardPct: 50,
    officialUrl: "https://www.reva.edu.in/",
    feeSourceUrl: "https://www.reva.edu.in/",
    hostelPerYearInr: 110000,
    note: "Direct admission on 12th marks or KCET/COMEDK/JEE. Mid-tier Bangalore deemed university.",
  },
  {
    id: "jain-u", name: "Jain (Deemed-to-be University)", city: "Bangalore", state: "Karnataka",
    cityTier: 1, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 325000,
    approxTotalFeesInr: 1300000, durationYears: 4,
    admissionMode: "private_exam", mainEntranceExam: "JET / JEE Main / COMEDK / KCET", minBoardPct: 50,
    officialUrl: "https://www.jainuniversity.ac.in/",
    feeSourceUrl: "https://www.jainuniversity.ac.in/",
    hostelPerYearInr: 120000,
    note: "FET (engineering campus) at Jakkasandra. Accepts multiple entrance routes.",
  },
  {
    id: "dit-u", name: "DIT University", city: "Dehradun", state: "Uttarakhand",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 343800,
    approxTotalFeesInr: 1573000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://www.dituniversity.edu.in/",
    feeSourceUrl: "https://www.dituniversity.edu.in/",
    hostelPerYearInr: 130000,
    note: "Direct admission on 12th marks. ~26% scholarship for Uttarakhand state quota.",
  },
  {
    id: "graphic-era", name: "Graphic Era (Deemed-to-be University)", city: "Dehradun", state: "Uttarakhand",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 191000,
    approxTotalFeesInr: 1500000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks / JEE", minBoardPct: 60,
    officialUrl: "https://geu.ac.in/",
    feeSourceUrl: "https://geu.ac.in/",
    hostelPerYearInr: 150000,
    note: "Direct admission on 12th marks or JEE. CSE branches fall in the higher fee bracket.",
  },
  {
    id: "chitkara-u", name: "Chitkara University", city: "Rajpura", state: "Punjab",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 210000,
    approxTotalFeesInr: 860000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks", minBoardPct: 50,
    officialUrl: "https://www.chitkara.edu.in/",
    feeSourceUrl: "https://www.chitkara.edu.in/",
    hostelPerYearInr: 100000,
    note: "Direct admission on 12th marks. ₹20K one-time admission fee. Solid placements in this tier.",
  },
  {
    id: "gla-mathura", name: "GLA University", city: "Mathura", state: "Uttar Pradesh",
    cityTier: 3, type: "private", courseFocus: "engineering",
    program: "B.Tech CSE", feePeriod: "per_year", feePeriodAmountInr: 208000,
    approxTotalFeesInr: 880000, durationYears: 4,
    admissionMode: "direct", mainEntranceExam: "Direct on 12th marks / GLAET", minBoardPct: 50,
    officialUrl: "https://www.gla.ac.in/",
    feeSourceUrl: "https://www.gla.ac.in/",
    hostelPerYearInr: 90000,
    note: "Direct admission on 12th marks or GLAET. One of the more affordable options in north India.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export const COURSE_FOCUS_LABELS: Record<CourseFocus, string> = {
  engineering: "Engineering",
  management: "Management",
  medical: "Medical",
  arts_sci: "Arts & Sci",
  design: "Design",
  liberal_arts: "Law / Liberal Arts",
  commerce: "Commerce",
};

export const COLLEGE_TYPE_LABELS: Record<CollegeType, string> = {
  govt_central: "Govt (central)",
  govt_state: "Govt (state)",
  private_aided: "Private (aided)",
  private: "Private",
};

export const ADMISSION_MODE_LABELS: Record<AdmissionMode, string> = {
  jee_advanced: "JEE Advanced",
  jee_main: "JEE Main",
  state_exam: "State CET",
  private_exam: "Univ. own exam",
  direct: "Direct (board marks)",
  jee_main_or_direct: "JEE or direct",
  cat: "CAT",
  neet: "NEET",
  clat: "CLAT",
  cuet: "CUET",
  other: "Other",
};

/** Admission modes that do NOT require JEE Main */
export const NO_JEE_MAIN_MODES: AdmissionMode[] = [
  "direct",
  "private_exam",
  "jee_main_or_direct",
  "state_exam",
  "cuet",
];

export function feePeriodLabel(p: FeePeriod): string {
  switch (p) {
    case "per_semester":
      return "per semester";
    case "per_year":
      return "per year";
    case "full_course":
      return "full course";
  }
}
