import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Resume",
  description: "View the mKasif resume.",
}

export default function ResumePage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-canvas px-6 pt-28 pb-16 sm:px-10 lg:px-14">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-ink">Resume</p>
            <h1 className="mt-3 text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
              Professional resume
            </h1>
          </div>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-body underline underline-offset-4 transition-colors hover:text-ink"
          >
            Open PDF in a new tab
          </Link>
        </div>

        <object
          data="/resume.pdf"
          type="application/pdf"
          aria-label="mKasif resume"
          className="h-[calc(100vh-220px)] min-h-[680px] w-full rounded-lg border border-hairline bg-surface-card"
        >
          <p className="p-6 text-body">
            Your browser cannot display the PDF inline.{" "}
            <Link
              href="/resume.pdf"
              className="text-ink underline underline-offset-4"
            >
              Download the resume
            </Link>
            .
          </p>
        </object>
      </div>
    </main>
  )
}
