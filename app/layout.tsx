import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://student-loan-calc.vercel.app"),
  title: "Student Loan Calculator — see your full education-loan picture",
  description:
    "Enter your fees, get the complete breakdown: monthly EMI, total interest, year-by-year repayment, and a comparison across popular Indian banks. Built so students and parents can actually understand the numbers.",
  openGraph: {
    title: "Student Loan Calculator",
    description:
      "Punch in your course fees. See your full education-loan picture — EMI, total interest, repayment timeline, bank comparison.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Student Loan Calculator" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <div className="paper-bg min-h-screen">
          <header className="border-b border-line bg-paper/80 backdrop-blur sticky top-0 z-20 no-print">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
              <Link href="/" className="font-display text-xl tracking-tight">
                <span className="text-accent">₹</span> student loan calc
              </Link>
              <nav className="flex items-center gap-5 text-sm text-muted ml-auto">
                <Link href="/" className="hover:text-ink">calculator</Link>
                <Link href="/colleges" className="hover:text-ink">colleges</Link>
                <Link href="/learn" className="hover:text-ink">learn</Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-line mt-16 py-8 text-xs text-muted no-print">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-2">
              <p>
                This is a planning tool, not a binding quote. Actual rates change with MCLR / EBLR /
                repo-rate movements, your credit profile, and the institute you're going to.
                Always verify with the bank before signing.
              </p>
              <p>
                Open source · MIT ·{" "}
                <a className="hover:text-ink" href="https://github.com/Rajnandini3847/student-loan-calc">
                  github
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
