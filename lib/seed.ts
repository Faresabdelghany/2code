/**
 * lib/seed.ts
 *
 * Standalone seed script — populates Supabase with all content that was
 * previously hardcoded in the FORMA site components.
 *
 * Usage (after setting up .env.local with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY):
 *   npm run seed
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY\n" +
      "Make sure .env.local is present with these values."
  );
  process.exit(1);
}

// Service-role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertPage() {
  console.log("Upserting page: home…");
  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        title: "Landing Page",
        slug: "home",
        meta_title:
          "FORMA — Web Development Agency in Egypt | Landing Pages, E-Commerce, Custom Software & Apps",
        meta_description:
          "2Code is a web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East. Get a free consultation today.",
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (error) throw new Error(`Failed to upsert page: ${error.message}`);
  console.log(`  → page id: ${data.id}`);
  return data.id as string;
}

async function upsertSection(
  pageId: string,
  sortOrder: number,
  type: string,
  title: string,
  content: unknown
) {
  const { error } = await supabase.from("sections").upsert(
    {
      page_id: pageId,
      sort_order: sortOrder,
      type,
      title,
      content,
      visible: true,
    },
    // Conflict on (page_id, sort_order) keeps re-runs idempotent
    { onConflict: "page_id,sort_order" }
  );
  if (error)
    throw new Error(
      `Failed to upsert section "${title}" (order ${sortOrder}): ${error.message}`
    );
  console.log(`  [${sortOrder}] ${type}: ${title}`);
}

async function upsertSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error)
    throw new Error(`Failed to upsert setting "${key}": ${error.message}`);
  console.log(`  setting: ${key}`);
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n=== FORMA Seed Script ===\n");

  // 1. Page
  const pageId = await upsertPage();

  // 2. Sections
  console.log("\nUpserting sections…");

  // ── 0. Hero ──────────────────────────────────────────────────────────────
  await upsertSection(pageId, 0, "hero", "Hero", {
    eyebrow: "50+ Projects Delivered \u00a0\u00b7\u00a0 Up to 3x Conversion Lift",
    headline: "We Build Things That Convert.",
    subheadline:
      "A web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps \u2014 built to perform, not just impress.",
    cta_primary: { text: "Get a Free Consultation", url: "#contact" },
    cta_secondary: { text: "See What We Build", url: "#services" },
  });

  // ── 1. Statement — Landing Pages ────────────────────────────────────────
  await upsertSection(pageId, 1, "statement", "Statement — Landing Pages", {
    title_line1: "Landing Pages",
    title_accent: "That",
    title_line2: "Convert.",
    body: "We design and build landing pages in Egypt that turn visitors into leads \u2014 every element tested, every interaction optimized for conversion.",
    proof_point: "Up to 3x conversion lift across 15+ landing page projects",
    mockup_type: "browser",
  });

  // ── 2. Statement — E-Commerce ────────────────────────────────────────────
  await upsertSection(pageId, 2, "statement", "Statement — E-Commerce", {
    title_line1: "",
    title_accent: "E-Commerce",
    title_line2: "That Sells.",
    body: "We build e-commerce stores on Shopify, WooCommerce, and custom platforms \u2014 from product catalogs to checkout flows, optimized for every click.",
    proof_point: "40% sales increase for Harvest & Co within 3 months of launch",
    mockup_type: "cart",
  });

  // ── 3. Statement — Custom Software ───────────────────────────────────────
  await upsertSection(
    pageId,
    3,
    "statement",
    "Statement — Custom Software",
    {
      title_line1: "Custom Software",
      title_accent: "Development.",
      title_line2: "Zero Compromise.",
      body: "Custom software built around your business logic using .NET, Node.js, and cloud platforms like AWS and Azure \u2014 no templates, no workarounds. Scalable, secure, and precisely shaped to how you operate.",
      proof_point: "98% client satisfaction based on post-project surveys",
      mockup_type: "dashboard",
    }
  );

  // ── 4. Statement — Mobile Apps ───────────────────────────────────────────
  await upsertSection(pageId, 4, "statement", "Statement — Mobile Apps", {
    title_line1: "",
    title_accent: "Mobile App",
    title_line2: "Development.",
    body: "We build native and cross-platform mobile apps with Flutter and React Native \u2014 smooth, fast, and designed to keep users coming back. iOS, Android, or both.",
    proof_point:
      "Serving fintech, e-commerce, real estate, healthcare, education & more",
    mockup_type: "phones",
  });

  // ── 5. Marquee ───────────────────────────────────────────────────────────
  await upsertSection(pageId, 5, "marquee", "Marquee", {
    tags: [
      "Landing Pages",
      "Web Apps",
      "Mobile Apps",
      "Custom Software",
      "UI/UX Design",
      "Brand Identity",
    ],
  });

  // ── 6. CTA (mid-page) ────────────────────────────────────────────────────
  await upsertSection(pageId, 6, "cta", "Mid-Page CTA", {
    headline: "Ready to build something that actually converts?",
    subtext: "",
    button_text: "Start Your Project",
    button_url: "#contact",
  });

  // ── 7. Services ──────────────────────────────────────────────────────────
  await upsertSection(pageId, 7, "services", "Services", {
    items: [
      {
        title: "Landing Pages & Web Design",
        description:
          "High-converting landing pages and marketing sites built with React and Next.js. We handle everything from wireframes to A/B testing \u2014 every element optimized for conversion, responsive across all devices.",
        tags: [
          "Conversion Optimization",
          "Responsive Design",
          "A/B Testing",
          "React",
        ],
        icon: "",
      },
      {
        title: "E-Commerce Solutions",
        description:
          "E-commerce stores built on Shopify, WooCommerce, or fully custom platforms. From product catalogs to checkout flows and payment gateway integration \u2014 every interaction designed to drive revenue and reduce cart abandonment.",
        tags: ["Shopify", "WooCommerce", "Payment Gateways", "Conversion"],
        icon: "",
      },
      {
        title: "Custom Software Development",
        description:
          "Custom software built to solve the problems templates can\u2019t. From internal tools to customer-facing platforms \u2014 engineered with .NET, Node.js, and cloud infrastructure on AWS and Azure for scale and security.",
        tags: ["Full-Stack", "Cloud Native", ".NET", "Node.js"],
        icon: "",
      },
      {
        title: "Mobile App Development",
        description:
          "Native and cross-platform mobile apps built with Flutter and React Native for iOS and Android. Smooth performance, beautiful interfaces, and users who actually keep your app on their home screen.",
        tags: ["iOS & Android", "Flutter", "React Native", "Cross-Platform"],
        icon: "",
      },
    ],
  });

  // ── 8. Process ───────────────────────────────────────────────────────────
  await upsertSection(pageId, 8, "process", "Process", {
    items: [
      {
        title: "Discover",
        description:
          "We immerse ourselves in your world. Business goals, user needs, market landscape \u2014 every insight shapes the strategy.",
      },
      {
        title: "Design",
        description:
          "Wireframes to high-fidelity prototypes. We design interfaces that feel inevitable \u2014 like they couldn\u2019t exist any other way.",
      },
      {
        title: "Develop",
        description:
          "Clean, scalable code built for performance. Every interaction is smooth, every load is fast.",
      },
      {
        title: "Deliver",
        description:
          "Launch is just the beginning. We optimize, iterate, and refine based on real-world performance data.",
      },
    ],
  });

  // ── 9. Stats ─────────────────────────────────────────────────────────────
  await upsertSection(pageId, 9, "stats", "Stats", {
    items: [
      {
        value: 50,
        suffix: "+",
        label: "Projects Delivered",
        note: "since 2023 across Egypt & the Middle East",
      },
      {
        value: 3,
        suffix: "x",
        label: "Avg. Conversion Lift",
        note: "across 15+ landing page & e-commerce projects",
      },
      {
        value: 98,
        suffix: "%",
        label: "Client Satisfaction",
        note: "based on post-project client surveys",
      },
      {
        value: 12,
        suffix: "+",
        label: "Industries Served",
        note: "fintech, e-commerce, healthcare & more",
      },
    ],
  });

  // ── 10. Trust ────────────────────────────────────────────────────────────
  await upsertSection(pageId, 10, "trust", "Trust", {
    header:
      "Trusted by 50+ companies across Egypt, UAE & Saudi Arabia",
    clients: [
      { name: "FinanceFlow", logo_url: null },
      { name: "Meridian Group", logo_url: null },
      { name: "NeuralDesk", logo_url: null },
      { name: "Harvest & Co", logo_url: null },
      { name: "Vaultline", logo_url: null },
      { name: "ONYX Digital", logo_url: null },
    ],
  });

  // ── 11. Testimonials ─────────────────────────────────────────────────────
  await upsertSection(pageId, 11, "testimonials", "Testimonials", {
    items: [
      {
        quote:
          "2Code didn\u2019t just build our platform \u2014 they redefined what we thought was possible. The attention to craft is unmatched.",
        name: "Sarah Mitchell",
        role: "CEO, FinanceFlow",
        avatar_url: null,
      },
      {
        quote:
          "Working with 2Code felt like having an in-house team that actually cared. Our conversion rate tripled in the first quarter after launch.",
        name: "Ahmed Karim",
        role: "Founder, Meridian Group",
        avatar_url: null,
      },
      {
        quote:
          "Our online store went from a clunky checkout to a seamless experience. Sales jumped 40% in the first month after 2Code rebuilt it.",
        name: "Omar Fayed",
        role: "Founder, Harvest & Co",
        avatar_url: null,
      },
      {
        quote:
          "They took a complex vision and turned it into the most intuitive app our users have ever experienced. Truly world-class work.",
        name: "Layla Hassan",
        role: "CTO, NeuralDesk",
        avatar_url: null,
      },
    ],
  });

  // ── 12. FAQ ──────────────────────────────────────────────────────────────
  await upsertSection(pageId, 12, "faq", "FAQ", {
    items: [
      {
        question: "How long does a typical project take?",
        answer:
          "It depends on scope. A landing page typically takes 2\u20134 weeks. A custom software project or mobile app ranges from 2\u20135 months. We\u2019ll give you a clear timeline during our discovery phase.",
      },
      {
        question: "What\u2019s your pricing structure?",
        answer:
          "We work on a project basis with transparent pricing. After a free consultation, you\u2019ll receive a detailed proposal with fixed costs for each phase \u2014 no hidden fees, no surprises. Not sure if we fit your budget? Reach out and we\u2019ll tell you straight.",
      },
      {
        question: "Do you offer ongoing support after launch?",
        answer:
          "Absolutely. Bug fixes within 24 hours, monthly feature updates, and uptime monitoring \u2014 so you can focus on running your business while we keep everything running smoothly.",
      },
      {
        question: "What e-commerce platforms do you work with?",
        answer:
          "We work with Shopify, WooCommerce, and custom-built storefronts. Whether you need a turnkey solution or a fully custom checkout experience, we\u2019ll recommend the right platform for your business and budget.",
      },
      {
        question: "What technologies do you work with?",
        answer:
          "We pick the best tool for your project \u2014 not the one we\u2019re most comfortable with. That means faster builds and better results. Our stack commonly includes React, Next.js, .NET, Flutter, React Native, Node.js, and cloud platforms like AWS and Azure.",
      },
      {
        question: "Can you work with our existing team?",
        answer:
          "Yes. We plug into your Slack, join your standups, and ship alongside your devs \u2014 no friction, no ramp-up time. Whether it\u2019s a handoff, co-development, or augmenting your workflow, we fit right in.",
      },
      {
        question: "How much does a landing page cost in Egypt?",
        answer:
          "Landing page pricing depends on complexity, content depth, and interactivity. A single high-converting landing page typically ranges from $1,500 to $5,000. We provide a detailed fixed-cost proposal after a free consultation \u2014 no hidden fees, no surprises.",
      },
      {
        question: "Do you offer UI/UX design services?",
        answer:
          "Yes \u2014 UI/UX design is core to everything we build. We handle wireframes, user research, prototyping, and high-fidelity interface design. Whether it\u2019s a standalone design engagement or part of a full development project, we design interfaces that users love.",
      },
      {
        question: "What industries do you serve?",
        answer:
          "We\u2019ve delivered projects across fintech, e-commerce, real estate, healthcare, education, logistics, and SaaS \u2014 serving businesses in Egypt and across the Middle East. Our process starts with deep discovery to understand your specific market and users.",
      },
      {
        question: "How much does it cost to build a mobile app in Egypt?",
        answer:
          "Mobile app costs depend on complexity, platform (iOS, Android, or both), and features. A cross-platform app built with Flutter or React Native typically ranges from $8,000 to $40,000. We\u2019ll give you a clear breakdown during our free consultation.",
      },
    ],
  });

  // ── 13. Contact ──────────────────────────────────────────────────────────
  await upsertSection(pageId, 13, "contact", "Contact", {
    heading: "Got a Project? Let\u2019s Talk.",
    subtext:
      "Tell us about your project and we\u2019ll get back to you within 24 hours.",
    button_text: "Send My Brief",
    success_title: "Message Sent",
    success_message:
      "Thank you. We\u2019ll get back to you within 24 hours.",
  });

  // 3. Settings
  console.log("\nUpserting settings…");

  await upsertSetting("navbar_links", [
    { text: "Services", url: "#services" },
    { text: "Process", url: "#process" },
    { text: "Testimonials", url: "#testimonials" },
    { text: "FAQ", url: "#faq" },
    { text: "Contact", url: "#contact" },
  ]);

  await upsertSetting("contact_info", {
    email: "hello@2code.agency",
    phone: "+20 100 790 5654",
    location: "Giza, Egypt",
    whatsapp: "201007905654",
  });

  await upsertSetting("social_links", [
    { platform: "LinkedIn", url: "#" },
    { platform: "Dribbble", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "X", url: "#" },
  ]);

  await upsertSetting("footer", {
    brand_description:
      "2Code is a web development agency in Giza, Egypt \u2014 building high-converting landing pages, e-commerce stores, custom software, and mobile apps for businesses across the Middle East.",
    service_links: [
      { text: "Landing Pages", url: "#services" },
      { text: "E-Commerce", url: "#services" },
      { text: "Custom Software", url: "#services" },
      { text: "Mobile Apps", url: "#services" },
      { text: "UI/UX Design", url: "#services" },
    ],
    company_links: [
      { text: "About", url: "#hero" },
      { text: "Process", url: "#process" },
      { text: "FAQ", url: "#faq" },
      { text: "Contact", url: "#contact" },
    ],
  });

  console.log("\n=== Seed complete ===\n");
}

seed().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
