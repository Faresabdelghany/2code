// ── Page ──────────────────────────────────────────────
export interface Page {
  id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

// ── Section ───────────────────────────────────────────
export type SectionType =
  | "hero"
  | "statement"
  | "marquee"
  | "services"
  | "process"
  | "stats"
  | "trust"
  | "testimonials"
  | "faq"
  | "cta"
  | "contact";

export interface Section<T = unknown> {
  id: string;
  page_id: string;
  type: SectionType;
  title: string;
  content: T;
  sort_order: number;
  visible: boolean;
  updated_at: string;
  previous_content: T | null;
}

// ── Section Content Schemas ───────────────────────────

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta_primary: { text: string; url: string };
  cta_secondary: { text: string; url: string };
}

export interface StatementContent {
  title_line1: string;
  title_line2: string;
  title_accent: string;
  body: string;
  proof_point: string;
  mockup_type: "browser" | "cart" | "dashboard" | "phones";
}

export interface MarqueeContent {
  tags: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface ServicesContent {
  items: ServiceItem[];
}

export interface ProcessItem {
  title: string;
  description: string;
}

export interface ProcessContent {
  items: ProcessItem[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  note: string;
}

export interface StatsContent {
  items: StatItem[];
}

export interface TrustClient {
  name: string;
  logo_url: string | null;
}

export interface TrustContent {
  header: string;
  clients: TrustClient[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

export interface TestimonialsContent {
  items: TestimonialItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  items: FaqItem[];
}

export interface CtaContent {
  headline: string;
  subtext: string;
  button_text: string;
  button_url: string;
}

export interface ContactContent {
  heading: string;
  subtext: string;
  button_text: string;
  success_title: string;
  success_message: string;
}

// ── Media ─────────────────────────────────────────────
export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt_text: string | null;
  size: number | null;
  mime_type: string | null;
  folder: string | null;
  created_at: string;
}

// ── Submissions ───────────────────────────────────────
export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ── Settings ──────────────────────────────────────────
export interface NavLink {
  text: string;
  url: string;
}

export interface FooterSettings {
  brand_description: string;
  service_links: { text: string; url: string }[];
  company_links: { text: string; url: string }[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  whatsapp: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SettingsMap {
  navbar_links: NavLink[];
  footer: FooterSettings;
  contact_info: ContactInfo;
  social_links: SocialLink[];
}

export interface SettingsRow {
  key: string;
  value: unknown;
  updated_at: string;
  previous_value: unknown | null;
}

// ── Content type map (section type → content interface) ──
export interface SectionContentMap {
  hero: HeroContent;
  statement: StatementContent;
  marquee: MarqueeContent;
  services: ServicesContent;
  process: ProcessContent;
  stats: StatsContent;
  trust: TrustContent;
  testimonials: TestimonialsContent;
  faq: FaqContent;
  cta: CtaContent;
  contact: ContactContent;
}
