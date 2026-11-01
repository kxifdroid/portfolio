/**
 * Centralized site copy.
 *
 * This file holds the repeating, list-shaped content rendered across the
 * portfolio — nav links, projects, capabilities, the stack, footer columns,
 * and so on. One-off strings (headlines, section intros, CTA labels) stay
 * inline in their components; only data with a repeating pattern lives here so
 * it's easy to edit, translate, or hand off in one place.
 *
 * Each export is consumed by the component named in its comment.
 */

// --- Site header ----------------------------------------------------------
// components/site-header.tsx — primary + mobile nav.

// --- Practice strip -------------------------------------------------------
// components/practice-strip.tsx — the thin band of practice areas.
export const PRACTICE_AREAS = [
  { k: "01", v: "AI Engineering" },
  { k: "02", v: "Full-stack Development" },
  { k: "03", v: "Workflow automation" },
  { k: "04", v: "Product UI" },
  { k: "05", v: "API-first architecture" },
] as const

// --- Selected work --------------------------------------------------------
// components/selected-work.tsx — the project carousel.
export type Project = {
  index: string
  title: string
  description: string
  year: string
  status: string
  tags: readonly string[]
  href: string
  image: string
  imageAlt: string
}

export const PROJECTS: readonly Project[] = [
  {
    index: "01",
    title: "StoreIt: Storage Management Solution",
    description:
      "A simple, secure home for all your files. Upload PDFs, images, spreadsheets, and more, then find them instantly, share them in a click, and access them from anywhere, with safe passwordless sign-in.",
    year: "2026",
    status: "Live",
    tags: ["Cloud Storage", "UI/UX", "File Sharing"],
    href: "https://storage-app-theta.vercel.app/",
    image: "/assets/projects/drive-thumbnail.png",
    imageAlt:
      "StoreIt file manager UI showing a dashboard of uploaded PDFs, images, and spreadsheets with search, sharing controls, and a storage usage overview.",
  },
  {
    index: "02",
    title: "Frontend Intern at Hiring Bazzaar",
    description:
      "Designed and built responsive UI interfaces for an AI-powered hiring platform, working in a collaborative environment",
    year: "2026",
    status: "Live",
    tags: ["Dashboard", "Collaboration", "UI", "Industry"],
    href: "https://hiringbazaar.in/",
    image: "/assets/projects/intern-thumbnail.png",
    imageAlt:
      "Data labeling platform annotating a room scene with bounding boxes, a reviewer queue, and a quality score panel.",
  },
  {
    index: "03",
    title: "Automated Reconciliation in Finance",
    description:
      "Month-end matching without the manual grind. Bring in bank statements, payment records, and invoices, and the system pairs them up automatically, flags what doesn't match, and gives finance teams a clear view of upcoming cash flow.",
    year: "2026",
    status: "Live",
    tags: ["Finance", "Automation", "Reconciliation", "Forecasting"],
    href: "https://reconcilation-model.vercel.app/",
    image: "/assets/projects/finance-thumbnail.png",
    imageAlt:
      "Finance dashboard showing matched and unmatched transactions across bank, payment, and invoice records alongside a cash flow forecast chart.",
  },
  {
    index: "04",
    title: "MovieVault: Movie Discovery Platform",
    description:
      "A fast, friendly way to find your next watch. Search any title, browse what's trending, and filter by language, year, and rating, all in a clean experience that works on any screen.",
    year: "2025",
    status: "Live",
    tags: ["Movie Discovery", "Product UX", "Search"],
    href: "https://movie-app-seven-pied-69.vercel.app/",
    image: "/assets/projects/movie-thumbnail.png",
    imageAlt:
      "MovieVault UI showing a grid of trending movie posters with a search bar and language, year, and rating filters.",
  },

  {
    index: "05",
    title: "NCC IIT Roorkee UI/UX",
    description:
      "Designed UI of NCC IIT Roorkee Website improving visual identity and UX. Added new sections including FAQs and Blogs, and restructured team layout for better clarity.",
    year: "2024",
    status: "Live",
    tags: ["UI/UX", "Figma", "Design"],
    href: "https://ncc.iitr.ac.in/",
    image: "/assets/projects/ncc-thumbnail.png",
    imageAlt:
      "Document intelligence UI extracting structured fields from an invoice, with a review queue and confidence indicators.",
  },
]

// --- Capabilities ---------------------------------------------------------
// components/capabilities.tsx — the three practice cards. Cards map to the
// icons in components/capability-icons.tsx by position.
export const CAPABILITIES = [
  {
    num: "— 01",
    title: "Strong Fundamentals",
    body: "I have not skipped the fundamentals and have a great command of HTML, CSS, JavaScript and TypeScript",
    items: [
      "Next.js",
      "React.js",
      "TypeScript",
      "Shadcn UI",
      "MongoDB",
      "C++ & Python",
    ],
  },
  {
    num: "— 02",
    title: "AI Engineering",
    body: " I have a strong command of integrating GPT, OpenRouter models and Open source models & transformers, and I am a certified AI (Artificial Intelligence) engineer.",
    items: [
      "OpenAI",
      "Embeddings",
      "Vercel AI SDK",
      "Hugging Face",
      "Agents",
      "Vector DBs",
    ],
  },
  {
    num: "— 03",
    title: "UI/UX",
    body: "Calm, opinionated product UI with restraint. Typography, hierarchy, and motion treated as engineering disciplines — not decoration applied at the end.",
    items: [
      "Design systems",
      "Tailwind",
      "Figma",
      "UX Research",
      "Photoshop",
      "Prototyping",
    ],
  },
] as const

// --- Approach -------------------------------------------------------------
// components/approach.tsx — the four ordered process steps.
export const APPROACH_STEPS = [
  {
    k: "— Step 01",
    t: "Understand the business goal",
    d: "Before any UI or schema. What does this product change for the people using it, and how do we know it worked?",
  },
  {
    k: "— Step 02",
    t: "Design the smallest useful product",
    d: "The shortest path between a real user and a real outcome. Everything else is deferred until the core is honest.",
  },
  {
    k: "— Step 03",
    t: "Build with production architecture",
    d: "Type-safe from edge to database. Observability, retries, and migrations as first-class — not bolted on under pressure.",
  },
  {
    k: "— Step 04",
    t: "Refine until it feels effortless",
    d: "The last 20% is where products stop feeling like demos. Latency, copy, motion, edge cases — sanded down until they disappear.",
  },
] as const

// --- Stack ----------------------------------------------------------------
// components/stack.tsx — the editor-mockup panes. Each item is [name, tag].
export const STACK_PANES = [
  {
    title: "Application",
    items: [
      ["Next.js", "framework"],
      ["TypeScript", "language"],
      ["React 19", "ui"],
      ["Tailwind CSS", "styling"],
      ["shadcn", "primitives"],
    ],
  },
  {
    title: "Server & data",
    items: [
      ["Node.js", "runtime"],
      ["MongoDB", "database"],
      ["Drizzle ORM", "data"],
      ["Cloudflare", "edge"],
      ["Vercel", "deploy"],
    ],
  },
  {
    title: "AI & workflows",
    items: [
      ["Vercel AI SDK", "orchestration"],
      ["OpenAI / Open-Source", "models"],
      ["Replicate", "image"],
      ["Inngest", "workflows"],
    ],
  },
  {
    title: "Infra",
    items: [
      ["Docker", "runtime"],
      ["Resend", "email"],
      ["Stripe", "payments"],
      ["Sentry", "observability"],
    ],
  },
] as const

// --- About ----------------------------------------------------------------
// components/contact.tsx (About band) — the meta definition list. [key, value].
export const ABOUT_META = [
  ["Based", "India · GMT +5:30"],
  ["Practice", "AI-first learning Engineer"],
  ["Availability", "Open for new work"],
  ["Preferred Location", "Delhi/Gurgaon or Remote"],
] as const

// --- Site footer ----------------------------------------------------------
// components/site-footer.tsx — link columns. Each link is [label, href].
export const FOOTER_COLUMNS = [
  {
    title: "Site",
    links: [
      ["Work", "#work"],
      ["Capabilities", "#capabilities"],
      ["Approach", "#process"],
      ["Stack", "#stack"],
      ["About", "#about"],
    ],
  },
  {
    title: "Contact",
    links: [
      ["Email", "mailto:kxifiit@gmail.com"],
      ["Phone", "tel:+917979058639"],
    ],
  },
  {
    title: "Social",
    links: [
      ["GitHub ↗", "https://github.com/kxifdroid"],
      ["LinkedIn ↗", "https://www.linkedin.com/in/mk076465"],
      ["LeetCode ↗", "https://leetcode.com/u/kxif"],
    ],
  },
] as const
