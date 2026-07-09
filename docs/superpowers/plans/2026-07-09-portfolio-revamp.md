# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a real-work showcase (IRI5, Hex.Via CMS, QR Shirts + a grid) on an elevated "refined brutalism" design, backed by a local typed content model, a `/work` + `/services` route split, a provider-agnostic AI layer, and an optimized 3D prism — without breaking the existing contact/CRM/AI pipeline.

**Architecture:** Next.js 16 App Router. Project/service content moves from Supabase to typed local modules imported directly by server components (kills the self-fetch anti-pattern). Supabase stays only for `leads`. Screenshots of public projects are captured offline with Playwright into `/public/screenshots` and rendered via `next/image`; the hero project (QR Shirts) also renders as a lazy live `<iframe>`. AI (chat stream + lead scoring) goes through a small provider adapter selectable via env (Anthropic default, OpenAI optional).

**Tech Stack:** Next.js 16.2.3, React 19, TypeScript (strict), Tailwind v4, Framer Motion, @react-three/fiber + drei + postprocessing, @anthropic-ai/sdk, openai, Playwright (dev), Vitest (dev).

**Testing philosophy:** This is a mostly-visual project with no existing test runner. We add **Vitest** and write real unit tests for pure logic (content getters, AI provider selection, screenshot-target filtering, lead-score parsing). Presentational components and pages are verified with `tsc --noEmit`, `next lint`, `next build`, and a `next dev` visual pass. Commit after every task.

**Branch:** `feat/portfolio-revamp` (already created; the design spec is committed there).

**Reference:** Design spec at `docs/superpowers/specs/2026-07-09-portfolio-revamp-design.md`. Next 16 bundled docs live in `node_modules/next/dist/docs/01-app/` — consult before using an unfamiliar API.

---

## Milestone 0 — Setup & tooling

### Task 0.1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev deps**

Run:
```bash
npm install openai
npm install -D vitest @vitejs/plugin-react playwright
npx playwright install chromium
```
Expected: installs succeed; `openai` under dependencies, `vitest`/`@vitejs/plugin-react`/`playwright` under devDependencies.

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest",
"capture": "node scripts/capture-screenshots.mjs"
```

- [ ] **Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: add openai, vitest, playwright and scripts"
```

### Task 0.2: Vitest config

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Write config**
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 2: Verify runner boots**

Run: `npm test`
Expected: Vitest runs and reports "No test files found" (exit 0) — the runner works.

- [ ] **Step 3: Commit**
```bash
git add vitest.config.ts
git commit -m "chore: configure vitest"
```

### Task 0.3: Environment variables

**Files:**
- Modify: `.env.local` (local only; do NOT commit secrets)
- Create: `.env.example`

- [ ] **Step 1: Document env in `.env.example`** (safe placeholders, committed)
```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI provider selection: "anthropic" (default) | "openai"
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
OPENAI_API_KEY=
OPENAI_MODEL=

# Leads pipeline
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

- [ ] **Step 2: Add the same keys (with real/blank values) to local `.env.local`** so `AI_PROVIDER`, `ANTHROPIC_MODEL`, `OPENAI_MODEL` exist locally. Leave `AI_PROVIDER=anthropic`.

- [ ] **Step 3: Commit example only**
```bash
git add .env.example
git commit -m "docs: add .env.example"
```

---

## Milestone 1 — Content model

### Task 1.1: Project + service types

**Files:**
- Modify: `src/types/project.ts` (replace Supabase-shaped type with content model)
- Create: `src/types/service.ts`

- [ ] **Step 1: Replace `src/types/project.ts`**
```ts
export type ProjectStatus = 'live' | 'wip' | 'archived'

export interface ProjectMetric {
  label: string
  value: string
}

export interface Screenshot {
  src: string
  alt: string
  device: 'desktop' | 'mobile'
}

export interface CaseStudy {
  problem: string
  approach: string
  highlights: string[]
  results?: ProjectMetric[]
}

/** How the project renders its visual: real screenshots, or a branded typographic card. */
export type ProjectVisual = 'screenshot' | 'typographic'

export interface Project {
  slug: string
  name: string
  tagline: string
  summary: string
  category: string
  year: number
  role: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  status: ProjectStatus
  /** flagship → gets a /work/[slug] case study page */
  featured: boolean
  /** shown as a live <iframe> on the home page */
  heroEmbed?: boolean
  visual: ProjectVisual
  /** brand color used by the typographic card variant */
  accent?: string
  screenshots: Screenshot[]
  caseStudy?: CaseStudy
}
```

- [ ] **Step 2: Create `src/types/service.ts`**
```ts
export interface ServiceStep {
  title: string
  description: string
}

export interface Service {
  slug: string
  serviceId: string        // e.g. "SERVICE_01"
  icon: string             // material symbol name
  title: string
  tagline: string
  desc: string             // short description for cards
  stack: string[]
  duration: string
  delivery: string
  steps: ServiceStep[]
  useCases: string[]
  ctaHeadline: string
  accent?: boolean
}
```

- [ ] **Step 3: Typecheck** — Run: `npx tsc --noEmit`. Expected: errors ONLY in files still importing the old `Project` shape (`src/app/page.tsx`, `src/app/projects/**`, `src/app/api/projects/route.ts`). These are fixed/removed in later tasks. Note them and continue.

- [ ] **Step 4: Commit**
```bash
git add src/types/project.ts src/types/service.ts
git commit -m "feat: content model types for projects and services"
```

### Task 1.2: Projects content data

**Files:**
- Create: `src/content/projects.ts`

- [ ] **Step 1: Write curated project data** (content sourced from each repo's README)
```ts
import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    slug: 'qr-shirts',
    name: 'QR Shirts',
    tagline: 'Convierte cualquier camiseta en una experiencia digital',
    summary:
      'Webapp para crear, personalizar y vender camisetas con un QR único que resuelve a una página pública totalmente editable.',
    category: 'SaaS · E-commerce',
    year: 2026,
    role: 'Creador · Full-stack',
    stack: ['Next.js (App Router)', 'TypeScript strict', 'Tailwind', 'Framer Motion', 'Zustand', 'Supabase (RLS)', 'qrcode.react'],
    liveUrl: 'https://q-rshirts.vercel.app',
    repoUrl: 'https://github.com/acaravia666/QRshirts',
    status: 'live',
    featured: true,
    heroEmbed: true,
    visual: 'screenshot',
    accent: '#bbe405',
    screenshots: [
      { src: '/screenshots/qr-shirts-desktop.png', alt: 'QR Shirts — landing y configurador', device: 'desktop' },
      { src: '/screenshots/qr-shirts-mobile.png', alt: 'QR Shirts en móvil', device: 'mobile' },
    ],
    caseStudy: {
      problem:
        'Una camiseta es un lienzo estático: no puede apuntar a tu portfolio, tu tienda o tu perfil, ni cambiar después de imprimirse.',
      approach:
        'Un configurador con preview en vivo de la camiseta + QR (Zustand para el estado, qrcode.react para generar y exportar PNG/SVG). Cada QR resuelve a /q/[slug], una página pública editable desde un dashboard protegido. Lecturas públicas y logging de escaneos vía RPCs SECURITY DEFINER en Supabase.',
      highlights: [
        'Configurador con preview en vivo de camiseta + QR',
        'Export del QR en PNG y SVG',
        'Página pública escaneable /q/[slug], editable',
        'Dashboard con auth: estadísticas y edición',
        'Supabase con RLS y RPCs SECURITY DEFINER para escaneos',
      ],
    },
  },
  {
    slug: 'iri5',
    name: 'IRI5',
    tagline: 'Inteligencia de audiencias en tiempo real',
    summary:
      'SaaS B2B multi-tenant que procesa video de cámaras web/IP para detectar emociones, demografía y amenazas de seguridad directamente en el navegador — sin enviar imágenes a ningún servidor.',
    category: 'SaaS · Visión AI',
    year: 2026,
    role: 'Fundador · Full-stack & ML',
    stack: ['React 18', 'TypeScript', 'Tailwind v4', 'Face-API.js', 'YOLOv8n (ONNX)', 'TensorFlow.js', 'Supabase', 'Recharts'],
    repoUrl: 'https://github.com/acaravia666/iri5',
    status: 'live',
    featured: true,
    visual: 'typographic',
    accent: '#bbe405',
    screenshots: [],
    caseStudy: {
      problem:
        'Retail, restaurantes y espacios públicos en LatAm no tienen forma accesible y privada de medir quién entra, cómo reacciona y qué riesgos de seguridad hay — las soluciones existentes envían el video a la nube.',
      approach:
        'Toda la inferencia corre en el navegador con WebGL/ONNX: Face-API.js para emociones y demografía, YOLOv8n para conteo "body-first" sin rostro, y un motor de reglas con cooldown y webhooks. Multi-tenant con RLS en Supabase y control granular de qué datos se recopilan.',
      highlights: [
        'Emociones, edad y género por cuadro, 100% en el navegador',
        'Modo body-first con YOLOv8n para conteo sin detección facial',
        'Motor de reglas con triggers, cooldown y webhooks',
        'Cámaras IP vía WHEP/RTSP (MediaMTX)',
        'Multi-workspace con RLS e invitaciones por token',
        'Privacidad: control de qué datos se recopilan',
      ],
    },
  },
  {
    slug: 'hex-via-cms',
    name: 'Hex.Via CMS',
    tagline: 'CMS multi-tenant con editor visual sobre el sitio real',
    summary:
      'Plataforma CMS independiente para que los clientes administren el contenido de sus sitios — textos, imágenes y tarjetas — sin tocar código ni diseño.',
    category: 'SaaS · CMS',
    year: 2026,
    role: 'Fundador · Arquitecto & Full-stack',
    stack: ['Next.js', 'TypeScript', 'Supabase (RLS)', 'pnpm monorepo', '@hexvia/site-kit SDK', 'Docker'],
    liveUrl: 'https://hexvia-cms-admin.vercel.app',
    repoUrl: 'https://github.com/acaravia666/hexvia-cms',
    status: 'live',
    featured: true,
    visual: 'screenshot',
    accent: '#bbe405',
    screenshots: [
      { src: '/screenshots/hex-via-cms-desktop.png', alt: 'Hex.Via CMS — landing', device: 'desktop' },
      { src: '/screenshots/hex-via-cms-mobile.png', alt: 'Hex.Via CMS en móvil', device: 'mobile' },
    ],
    caseStudy: {
      problem:
        'Las agencias que entregan sitios a medida quedan atrapadas como el cuello de botella: cada cambio de texto o imagen del cliente vuelve al desarrollador.',
      approach:
        'Un panel multi-tenant con RLS probado y un editor visual que trabaja sobre el sitio real (no un formulario aparte): textos, imágenes y tarjetas, con historial/rollback, biblioteca de medios, gestión de usuarios y un kit de conexión (@hexvia/site-kit) para enchufar cualquier sitio.',
      highlights: [
        'Editor visual sobre el sitio real, no un formulario aparte',
        'Multi-tenant con Row Level Security probado',
        'Historial y rollback de cambios',
        'Biblioteca de medios y gestión de usuarios',
        'SDK @hexvia/site-kit para conectar sitios existentes',
      ],
    },
  },
  {
    slug: 'pops-cafe',
    name: 'Pops Café',
    tagline: 'Pedidos y pickup para un café de postres',
    summary: 'App de pedidos y recogida en tienda con actualizaciones en tiempo real para un café de postres.',
    category: 'App · E-commerce',
    year: 2026,
    role: 'Full-stack',
    stack: ['Next.js 14', 'TypeScript', 'Supabase (Postgres + Realtime)', 'Vercel'],
    liveUrl: 'https://pops-cafe.vercel.app',
    repoUrl: 'https://github.com/acaravia666/pops-cafe',
    status: 'live',
    featured: false,
    visual: 'screenshot',
    screenshots: [
      { src: '/screenshots/pops-cafe-desktop.png', alt: 'Pops Café', device: 'desktop' },
    ],
  },
  {
    slug: 'experto-tax',
    name: 'Experto Tax & Bookkeeping',
    tagline: 'Sitio para una firma de impuestos y contabilidad',
    summary: 'Sitio corporativo para una firma de impuestos y contabilidad, implementado desde diseño en Figma.',
    category: 'Sitio cliente',
    year: 2026,
    role: 'Diseño a código',
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://experto-tax-bookkeeping.vercel.app',
    repoUrl: 'https://github.com/acaravia666/experto-tax-bookkeeping',
    status: 'live',
    featured: false,
    visual: 'screenshot',
    screenshots: [
      { src: '/screenshots/experto-tax-desktop.png', alt: 'Experto Tax & Bookkeeping', device: 'desktop' },
    ],
  },
  {
    slug: 'crisisapp',
    name: 'CrisisApp',
    tagline: 'Gestión de equipo (gear) para situaciones críticas',
    summary: 'Aplicación para organizar equipo y recursos ante emergencias.',
    category: 'App',
    year: 2026,
    role: 'Full-stack',
    stack: ['Next.js', 'TypeScript'],
    liveUrl: 'https://crisisapp.vercel.app',
    repoUrl: 'https://github.com/acaravia666/crisisapp',
    status: 'live',
    featured: false,
    visual: 'screenshot',
    screenshots: [
      { src: '/screenshots/crisisapp-desktop.png', alt: 'CrisisApp', device: 'desktop' },
    ],
  },
]
```

> **Note for implementer:** `CrisisApp`, `Experto Tax` and `Pops Café` liveUrls were 200 at spec time. Before the capture step (Task 3.2), re-verify each returns HTTP 200; drop any that are down. `Shalom Mendieta` / `La Botica Ibarra` may be added the same way if their deployments are confirmed live.

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` (ignore pre-existing errors in old pages). Expected: `src/content/projects.ts` has no type errors.

- [ ] **Step 3: Commit**
```bash
git add src/content/projects.ts
git commit -m "feat: curated local project content"
```

### Task 1.3: Project getters (TDD)

**Files:**
- Create: `src/content/getProjects.ts`
- Test: `src/content/getProjects.test.ts`

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect } from 'vitest'
import {
  getAllProjects,
  getFeaturedProjects,
  getShowcaseProjects,
  getProjectBySlug,
  getHeroEmbedProject,
} from './getProjects'

describe('project getters', () => {
  it('returns all projects', () => {
    expect(getAllProjects().length).toBeGreaterThan(0)
  })
  it('featured projects are all featured', () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true)
  })
  it('showcase projects are all non-featured', () => {
    expect(getShowcaseProjects().every((p) => !p.featured)).toBe(true)
  })
  it('finds a project by slug', () => {
    expect(getProjectBySlug('qr-shirts')?.name).toBe('QR Shirts')
  })
  it('returns undefined for unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })
  it('hero embed project has heroEmbed=true', () => {
    expect(getHeroEmbedProject()?.heroEmbed).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — Run: `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**
```ts
import type { Project } from '@/types/project'
import { projects } from './projects'

export function getAllProjects(): Project[] {
  return projects
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getShowcaseProjects(): Project[] {
  return projects.filter((p) => !p.featured)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getHeroEmbedProject(): Project | undefined {
  return projects.find((p) => p.heroEmbed)
}
```

- [ ] **Step 4: Run test** — Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/content/getProjects.ts src/content/getProjects.test.ts
git commit -m "feat: project content getters with tests"
```

### Task 1.4: Services content + getters (TDD)

**Files:**
- Create: `src/content/services.ts`
- Create: `src/content/getServices.ts`
- Test: `src/content/getServices.test.ts`

- [ ] **Step 1: Write `src/content/services.ts`** — port the 5 services from the current `src/app/projects/page.tsx` array and the individual service pages, into typed `Service[]`. Slugs must equal the current route folders so redirects map 1:1: `web-engineering`, `ux-ui-design`, `app-architecture`, `auto-ops-crm`, `consulting`.
```ts
import type { Service } from '@/types/service'

export const services: Service[] = [
  {
    slug: 'web-engineering',
    serviceId: 'SERVICE_01',
    icon: 'code_blocks',
    title: 'Web Engineering',
    tagline: 'Arquitecturas frontend y backend de alto rendimiento, orientadas a velocidad, escalabilidad y conversión.',
    desc: 'Plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.',
    stack: ['Next.js', 'React', 'Node', 'TypeScript', 'Supabase'],
    duration: '3–8 semanas',
    delivery: 'Plataforma en producción + handoff',
    steps: [
      { title: 'Discovery', description: 'Definimos objetivos, métricas de éxito y arquitectura.' },
      { title: 'Build', description: 'Desarrollo iterativo con entregables semanales verificables.' },
      { title: 'Launch', description: 'Deploy, monitoreo y traspaso documentado.' },
    ],
    useCases: [
      'Startups que necesitan un MVP sólido y escalable.',
      'Negocios con un sitio lento que pierde conversiones.',
      'Equipos que necesitan una plataforma interna a medida.',
    ],
    ctaHeadline: 'Construyamos algo que aguante crecimiento real.',
    accent: false,
  },
  {
    slug: 'ux-ui-design',
    serviceId: 'SERVICE_02',
    icon: 'design_services',
    title: 'UX/UI System Design',
    tagline: 'Investigación, wireframing y sistemas de interfaz premium que fusionan estética industrial con usabilidad.',
    desc: 'Interfaces premium que fusionan estética industrial con usabilidad funcional para maximizar la retención.',
    stack: ['Figma', 'Design Systems', 'Prototyping', 'Tailwind'],
    duration: '2–5 semanas',
    delivery: 'Design system + prototipo navegable',
    steps: [
      { title: 'Research', description: 'Entendemos a tus usuarios y su contexto real.' },
      { title: 'Design', description: 'Wireframes, sistema visual y prototipo de alta fidelidad.' },
      { title: 'Handoff', description: 'Tokens, componentes y specs listos para desarrollo.' },
    ],
    useCases: [
      'Productos con mala retención por fricción de UX.',
      'Marcas que necesitan un sistema visual coherente.',
      'Equipos sin design system que quieren escalar.',
    ],
    ctaHeadline: 'Diseñemos una interfaz que la gente quiera usar.',
    accent: false,
  },
  {
    slug: 'app-architecture',
    serviceId: 'SERVICE_03',
    icon: 'smartphone',
    title: 'App Architecture',
    tagline: 'Sistemas móviles nativos y cross-platform iOS/Android construidos para durar.',
    desc: 'Sistemas móviles nativos y cross-platform iOS/Android construidos para durar.',
    stack: ['React Native', 'TypeScript', 'Supabase', 'Expo'],
    duration: '4–10 semanas',
    delivery: 'App publicable + backend',
    steps: [
      { title: 'Arquitectura', description: 'Definimos stack, datos y flujos offline-first.' },
      { title: 'Build', description: 'Desarrollo cross-platform con builds de prueba continuas.' },
      { title: 'Publish', description: 'Preparación y envío a las tiendas.' },
    ],
    useCases: [
      'Ideas que necesitan estar en iOS y Android sin duplicar equipo.',
      'Negocios que necesitan una app conectada a su operación.',
      'MVPs móviles que deben validar rápido.',
    ],
    ctaHeadline: 'Llevemos tu producto al bolsillo de tus usuarios.',
    accent: false,
  },
  {
    slug: 'auto-ops-crm',
    serviceId: 'SERVICE_04',
    icon: 'hub',
    title: 'Auto-Ops & CRM',
    tagline: 'Automatización end-to-end e integraciones con GoHighLevel. Operaciones que se ejecutan solas.',
    desc: 'Automatización end-to-end e integraciones con GoHighLevel. Operaciones que se ejecutan solas.',
    stack: ['GoHighLevel', 'Make.com', 'Webhooks', 'APIs', 'Zapier'],
    duration: '2–6 semanas',
    delivery: 'Automatizaciones + CRM configurado',
    steps: [
      { title: 'Auditoría', description: 'Mapeamos tus procesos manuales y cuellos de botella.' },
      { title: 'Automatización', description: 'Construimos flujos, pipelines y secuencias.' },
      { title: 'Optimización', description: 'Medimos, ajustamos y documentamos.' },
    ],
    useCases: [
      'Agencias que pierden tiempo en tareas repetitivas.',
      'Equipos de ventas sin seguimiento automatizado.',
      'Negocios que quieren operar con menos fricción humana.',
    ],
    ctaHeadline: 'Automaticemos lo que hoy te quita horas cada día.',
    accent: true,
  },
  {
    slug: 'consulting',
    serviceId: 'SERVICE_05',
    icon: 'school',
    title: 'Consultoría & Capacitación',
    tagline: 'Estrategia, mentoría y formación para equipos que quieren operar con AI desde adentro.',
    desc: 'Estrategia, mentoría y formación para equipos que quieren operar con AI desde adentro.',
    stack: ['Estrategia', 'AI', 'Workshops', 'Mentoría'],
    duration: 'Por sesión o retainer',
    delivery: 'Workshops + roadmap accionable',
    steps: [
      { title: 'Diagnóstico', description: 'Evaluamos dónde la AI puede mover la aguja en tu operación.' },
      { title: 'Formación', description: 'Workshops prácticos con tu equipo, no teoría.' },
      { title: 'Roadmap', description: 'Plan de adopción medible y por fases.' },
    ],
    useCases: [
      'Equipos que quieren adoptar AI sin saber por dónde empezar.',
      'Fundadores que necesitan una estrategia técnica clara.',
      'Empresas que quieren capacitar a su equipo interno.',
    ],
    ctaHeadline: 'Preparemos a tu equipo para operar con AI de verdad.',
    accent: false,
  },
]
```

- [ ] **Step 2: Write the failing test `src/content/getServices.test.ts`**
```ts
import { describe, it, expect } from 'vitest'
import { getAllServices, getServiceBySlug } from './getServices'

describe('service getters', () => {
  it('returns 5 services', () => {
    expect(getAllServices()).toHaveLength(5)
  })
  it('finds a service by slug', () => {
    expect(getServiceBySlug('web-engineering')?.serviceId).toBe('SERVICE_01')
  })
  it('returns undefined for unknown slug', () => {
    expect(getServiceBySlug('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run test to verify it fails** — Run: `npm test`. Expected: FAIL (module not found).

- [ ] **Step 4: Implement `src/content/getServices.ts`**
```ts
import type { Service } from '@/types/service'
import { services } from './services'

export function getAllServices(): Service[] {
  return services
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
```

- [ ] **Step 5: Run test** — Run: `npm test`. Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add src/content/services.ts src/content/getServices.ts src/content/getServices.test.ts
git commit -m "feat: services content and getters with tests"
```

---

## Milestone 2 — Design-system primitives

### Task 2.1: Refine tokens & remove external texture

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add tokens + a local "carbon" pattern.** In the `@theme` block add `--color-ink: #0a0a0a;`. After the `.grid-bg` rule add:
```css
/* Local carbon-fibre-ish texture (replaces external transparenttextures.com asset) */
.texture-carbon {
  background-image:
    linear-gradient(27deg, rgba(255,255,255,0.03) 5px, transparent 5px),
    linear-gradient(207deg, rgba(255,255,255,0.03) 5px, transparent 5px);
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
}
```

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit` (CSS not type-checked; this just confirms nothing else broke) and `npm run lint`. Expected: no new errors.

- [ ] **Step 3: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: design tokens (--color-ink) and local carbon texture"
```

### Task 2.2: SectionHeader, TechTag, Metric

**Files:**
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/ui/TechTag.tsx`
- Create: `src/components/ui/Metric.tsx`

- [ ] **Step 1: `SectionHeader.tsx`** (server component — the repeated `// SECTION` mono label + rule)
```tsx
export default function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
      <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <div className="flex-1 h-px bg-black/10" />
    </div>
  )
}
```

- [ ] **Step 2: `TechTag.tsx`**
```tsx
export default function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 border border-black font-terminal text-[10px] uppercase tracking-wider">
      {children}
    </span>
  )
}
```

- [ ] **Step 3: `Metric.tsx`**
```tsx
import type { ProjectMetric } from '@/types/project'

export default function Metric({ label, value }: ProjectMetric) {
  return (
    <div>
      <span className="font-terminal text-[10px] text-gray-500 block mb-1">{label}</span>
      <span className="font-headline text-2xl font-black text-secondary-container">{value}</span>
    </div>
  )
}
```

- [ ] **Step 4: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors in these 3 files.

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/SectionHeader.tsx src/components/ui/TechTag.tsx src/components/ui/Metric.tsx
git commit -m "feat: SectionHeader, TechTag, Metric primitives"
```

### Task 2.3: BrowserFrame

**Files:**
- Create: `src/components/ui/BrowserFrame.tsx`

- [ ] **Step 1: Write component** (screenshot inside window chrome; black border + lime shadow; grayscale→color on hover). Uses `next/image`.
```tsx
import Image from 'next/image'

interface BrowserFrameProps {
  src: string
  alt: string
  /** URL label shown in the chrome bar */
  url?: string
  priority?: boolean
  sizes?: string
}

export default function BrowserFrame({ src, alt, url, priority, sizes }: BrowserFrameProps) {
  return (
    <div className="group border border-black bg-white shadow-[6px_6px_0_0_#bbe405] transition-shadow duration-300 hover:shadow-[3px_3px_0_0_#bbe405]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10">
        <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
        {url && (
          <span className="ml-3 font-terminal text-[9px] text-gray-400 truncate">{url}</span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
          priority={priority}
          className="object-cover object-top grayscale contrast-110 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/ui/BrowserFrame.tsx
git commit -m "feat: BrowserFrame component"
```

---

## Milestone 3 — Screenshots & live embed

### Task 3.1: Screenshot capture target filter (TDD)

**Files:**
- Create: `src/content/captureTargets.ts`
- Test: `src/content/captureTargets.test.ts`

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect } from 'vitest'
import { getCaptureTargets } from './captureTargets'

describe('getCaptureTargets', () => {
  const targets = getCaptureTargets()
  it('only includes projects with a liveUrl and screenshot visual', () => {
    expect(targets.every((t) => t.liveUrl && t.visual === 'screenshot')).toBe(true)
  })
  it('excludes the typographic IRI5 project', () => {
    expect(targets.find((t) => t.slug === 'iri5')).toBeUndefined()
  })
  it('includes qr-shirts', () => {
    expect(targets.find((t) => t.slug === 'qr-shirts')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — Run: `npm test`. Expected: FAIL.

- [ ] **Step 3: Implement**
```ts
import { projects } from './projects'

export interface CaptureTarget {
  slug: string
  liveUrl: string
  visual: 'screenshot' | 'typographic'
}

export function getCaptureTargets(): CaptureTarget[] {
  return projects
    .filter((p) => p.visual === 'screenshot' && p.liveUrl)
    .map((p) => ({ slug: p.slug, liveUrl: p.liveUrl as string, visual: p.visual }))
}
```

- [ ] **Step 4: Run test** — Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/content/captureTargets.ts src/content/captureTargets.test.ts
git commit -m "feat: screenshot capture target selection with tests"
```

### Task 3.2: Playwright capture script

**Files:**
- Create: `scripts/capture-screenshots.mjs`
- Create: `public/screenshots/.gitkeep`

- [ ] **Step 1: Write the script.** It reads targets from the compiled content is awkward in an `.mjs`, so hard-code the target list inline to avoid TS transpile at runtime, but keep it in sync with `captureTargets.ts`.
```js
// scripts/capture-screenshots.mjs
// Captures desktop + mobile screenshots of public project sites into public/screenshots.
// Run: npm run capture   (requires: npx playwright install chromium)
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'screenshots')

// Keep in sync with src/content/captureTargets.ts
const targets = [
  { slug: 'qr-shirts', url: 'https://q-rshirts.vercel.app' },
  { slug: 'hex-via-cms', url: 'https://hexvia-cms-admin.vercel.app' },
  { slug: 'pops-cafe', url: 'https://pops-cafe.vercel.app' },
  { slug: 'experto-tax', url: 'https://experto-tax-bookkeeping.vercel.app' },
  { slug: 'crisisapp', url: 'https://crisisapp.vercel.app' },
]

const viewports = [
  { device: 'desktop', width: 1440, height: 900 },
  { device: 'mobile', width: 390, height: 844 },
]

async function reachable(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' })
    return res.status >= 200 && res.status < 400
  } catch {
    return false
  }
}

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

for (const t of targets) {
  if (!(await reachable(t.url))) {
    console.warn(`SKIP ${t.slug} — ${t.url} not reachable`)
    continue
  }
  for (const v of viewports) {
    const page = await browser.newPage({ viewport: { width: v.width, height: v.height } })
    try {
      await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(1500)
      const out = join(OUT, `${t.slug}-${v.device}.png`)
      await page.screenshot({ path: out })
      console.log(`OK   ${out}`)
    } catch (err) {
      console.warn(`FAIL ${t.slug} ${v.device}:`, err.message)
    } finally {
      await page.close()
    }
  }
}

await browser.close()
console.log('Done.')
```

- [ ] **Step 2: Run capture** — Run: `npm run capture`. Expected: `OK .../public/screenshots/qr-shirts-desktop.png` etc. Sites that are down print `SKIP`. If a needed screenshot is missing, either the site is down (remove that project from content) or retry.

- [ ] **Step 3: Verify files exist** — Run: `ls public/screenshots`. Expected: `<slug>-desktop.png` / `<slug>-mobile.png` for reachable targets.

- [ ] **Step 4: Commit**
```bash
git add scripts/capture-screenshots.mjs public/screenshots
git commit -m "feat: playwright screenshot capture + captured images"
```

### Task 3.3: LiveEmbed component

**Files:**
- Create: `src/components/ui/LiveEmbed.tsx`

- [ ] **Step 1: Write component** — client; lazy-mounts the iframe when scrolled into view; skeleton; accessible title; "abrir ↗" overlay.
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface LiveEmbedProps {
  url: string
  title: string
}

export default function LiveEmbed({ url, title }: LiveEmbedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full h-full border border-black bg-surface overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">
            LOADING_LIVE_PREVIEW…
          </span>
        </div>
      )}
      {inView && (
        <iframe
          src={url}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="w-full h-full"
        />
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-secondary-container text-black border border-black px-4 py-2 font-terminal text-[10px] uppercase hover:bg-black hover:text-secondary-container transition-colors"
      >
        Abrir en vivo
        <span className="material-symbols-outlined text-sm">north_east</span>
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/ui/LiveEmbed.tsx
git commit -m "feat: LiveEmbed lazy iframe component"
```

---

## Milestone 4 — Work section (project cards + pages)

### Task 4.1: ProjectCard (screenshot + typographic variants)

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`

- [ ] **Step 1: Write component** — server component. If `visual === 'screenshot'` and a screenshot exists, render `BrowserFrame`; else render a branded typographic card. Links to case study (`/work/[slug]`) for featured, else external `liveUrl`.
```tsx
import Link from 'next/link'
import type { Project } from '@/types/project'
import BrowserFrame from '@/components/ui/BrowserFrame'

function hostOf(url?: string) {
  if (!url) return ''
  try { return new URL(url).host } catch { return url }
}

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.featured ? `/work/${project.slug}` : (project.liveUrl ?? project.repoUrl ?? '#')
  const external = !project.featured
  const shot = project.screenshots.find((s) => s.device === 'desktop')

  const inner = (
    <div className="flex flex-col h-full">
      {project.visual === 'screenshot' && shot ? (
        <BrowserFrame src={shot.src} alt={shot.alt} url={hostOf(project.liveUrl)} />
      ) : (
        <div className="border border-black bg-ink text-white p-8 min-h-[260px] flex flex-col justify-between">
          <div className="flex justify-between font-terminal text-[10px] text-gray-400 uppercase">
            <span>{project.category}</span>
            <span className="text-secondary-container">● {project.status}</span>
          </div>
          <h3 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mt-8">
            {project.name}
          </h3>
        </div>
      )}
      <div className="pt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-headline text-xl font-black uppercase leading-none">{project.name}</h3>
          <p className="font-body text-sm text-gray-600 mt-1">{project.tagline}</p>
        </div>
        <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">
          {external ? 'north_east' : 'arrow_forward'}
        </span>
      </div>
    </div>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <Link href={href} className="group block">{inner}</Link>
  )
}
```

> Uses Tailwind `bg-ink` / `text-secondary-container` — `--color-ink` was added in Task 2.1 so `bg-ink` resolves. If Tailwind v4 doesn't emit `bg-ink` from the theme var, use `className="... bg-[#0a0a0a] ..."` instead.

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/projects/ProjectCard.tsx
git commit -m "feat: ProjectCard with screenshot and typographic variants"
```

### Task 4.2: FlagshipCard

**Files:**
- Create: `src/components/projects/FlagshipCard.tsx`

- [ ] **Step 1: Write component** — larger dark teaser used on `/work` and home for featured projects.
```tsx
import Link from 'next/link'
import type { Project } from '@/types/project'

export default function FlagshipCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative block border border-black bg-[#0a0a0a] text-white overflow-hidden texture-carbon"
    >
      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full min-h-[280px]">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
            CASE_STUDY
          </span>
          <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">
            {project.category}
          </span>
        </div>
        <h3 className="font-headline text-4xl md:text-6xl font-black uppercase leading-none group-hover:text-secondary-container transition-colors">
          {project.name}
        </h3>
        <p className="font-body text-gray-400 text-base md:text-lg max-w-md mt-4">{project.tagline}</p>
        <div className="mt-auto pt-10 flex justify-between items-end border-t border-white/15">
          <span className="font-terminal text-[10px] text-gray-500 uppercase">{project.stack.slice(0, 3).join(' · ')}</span>
          <span className="material-symbols-outlined text-3xl text-gray-500 group-hover:text-secondary-container transition-colors">arrow_forward</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/projects/FlagshipCard.tsx
git commit -m "feat: FlagshipCard component"
```

### Task 4.3: `/work` index page

**Files:**
- Create: `src/app/work/page.tsx`

- [ ] **Step 1: Write page** — header + flagship grid + showcase grid, all from local content.
```tsx
import type { Metadata } from 'next'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import SectionHeader from '@/components/ui/SectionHeader'
import FlagshipCard from '@/components/projects/FlagshipCard'
import ProjectCard from '@/components/projects/ProjectCard'
import { getFeaturedProjects, getShowcaseProjects } from '@/content/getProjects'

export const metadata: Metadata = {
  title: 'Trabajo | Felipe Caravía',
  description: 'Proyectos reales: IRI5, Hex.Via CMS, QR Shirts y más.',
}

export default function WorkPage() {
  const flagships = getFeaturedProjects()
  const showcase = getShowcaseProjects()

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">SELECTED_WORK</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          TRABAJO<br />SELECCIONADO
        </h1>
      </AnimatedBlock>

      <section className="border-b border-black">
        <SectionHeader label="// FLAGSHIP_CASE_STUDIES" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 px-6 md:px-12 pb-12">
          {flagships.map((p) => (
            <AnimatedBlock key={p.slug} className="bg-background">
              <FlagshipCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader label="// SHOWCASE" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 pb-24">
          {showcase.map((p) => (
            <AnimatedBlock key={p.slug}>
              <ProjectCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors in `work/page.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/app/work/page.tsx
git commit -m "feat: /work index page"
```

### Task 4.4: `/work/[slug]` case study page

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Write page** — static params from featured projects; full case study with screenshots, metadata grid, highlights, stack, CTA.
```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import TechTag from '@/components/ui/TechTag'
import Metric from '@/components/ui/Metric'
import { getFeaturedProjects, getProjectBySlug } from '@/content/getProjects'

export function generateStaticParams() {
  return getFeaturedProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Proyecto no encontrado' }
  return {
    title: `${project.name} | Felipe Caravía`,
    description: project.summary,
    openGraph: project.screenshots[0]
      ? { images: [{ url: project.screenshots[0].src }] }
      : undefined,
  }
}

export default async function CaseStudy(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project || !project.featured) notFound()
  const cs = project.caseStudy

  return (
    <main className="flex-grow flex flex-col pt-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      <Link href="/work" className="inline-flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors">
        <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
        BACK_TO_WORK
      </Link>

      <AnimatedBlock className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-0.5 bg-black text-white text-[10px] font-terminal">CASE_STUDY</span>
          <span className="px-2 py-0.5 border border-black text-[10px] font-terminal">{project.category}</span>
        </div>
        <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-8">
          {project.name}
        </h1>
        <p className="font-body text-xl text-gray-700 max-w-2xl leading-relaxed">{project.summary}</p>
      </AnimatedBlock>

      {project.screenshots[0] && (
        <AnimatedBlock delay={0.1} className="relative w-full aspect-[16/9] mb-16 border border-black overflow-hidden">
          <Image src={project.screenshots[0].src} alt={project.screenshots[0].alt} fill sizes="(max-width:768px) 100vw, 80vw" className="object-cover object-top" priority />
        </AnimatedBlock>
      )}

      <AnimatedBlock delay={0.2} className="grid grid-cols-2 md:grid-cols-4 border border-black mb-16">
        {[
          { label: 'ROL', value: project.role },
          { label: 'AÑO', value: String(project.year) },
          { label: 'CATEGORÍA', value: project.category },
          { label: 'STACK', value: project.stack.slice(0, 2).join(', ') },
        ].map((item) => (
          <div key={item.label} className="p-6 border-r border-black last:border-r-0">
            <div className="font-terminal text-[9px] uppercase tracking-widest text-gray-400 mb-2">{item.label}</div>
            <div className="font-terminal text-sm font-bold">{item.value}</div>
          </div>
        ))}
      </AnimatedBlock>

      {cs && (
        <AnimatedBlock delay={0.25} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-headline text-2xl font-black uppercase mb-3">El problema</h2>
            <p className="font-body text-gray-700 leading-relaxed">{cs.problem}</p>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-black uppercase mb-3">El enfoque</h2>
            <p className="font-body text-gray-700 leading-relaxed">{cs.approach}</p>
          </div>
        </AnimatedBlock>
      )}

      {cs && (
        <AnimatedBlock delay={0.3} className="mb-16">
          <h2 className="font-headline text-2xl font-black uppercase mb-6">Lo destacado</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cs.highlights.map((h) => (
              <li key={h} className="flex gap-3 border border-black p-4 bg-surface">
                <span className="material-symbols-outlined text-secondary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-body text-sm">{h}</span>
              </li>
            ))}
          </ul>
        </AnimatedBlock>
      )}

      {cs?.results && cs.results.length > 0 && (
        <AnimatedBlock delay={0.32} className="flex flex-wrap gap-10 mb-16 border-y border-black py-8">
          {cs.results.map((m) => <Metric key={m.label} {...m} />)}
        </AnimatedBlock>
      )}

      <AnimatedBlock delay={0.35} className="mb-16">
        <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-3">STACK</div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((t) => <TechTag key={t}>{t}</TechTag>)}
        </div>
      </AnimatedBlock>

      {project.screenshots[1] && (
        <AnimatedBlock delay={0.38} className="relative w-full aspect-[9/16] max-w-xs mx-auto mb-16 border border-black overflow-hidden">
          <Image src={project.screenshots[1].src} alt={project.screenshots[1].alt} fill sizes="320px" className="object-cover object-top" />
        </AnimatedBlock>
      )}

      <AnimatedBlock delay={0.4} className="border-t border-black pt-12 pb-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-wrap gap-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-black text-white font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black transition-colors flex items-center gap-2">
              VER_EN_VIVO <span className="material-symbols-outlined text-sm">north_east</span>
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-black font-terminal text-sm uppercase hover:bg-surface transition-colors flex items-center gap-2">
              CÓDIGO <span className="material-symbols-outlined text-sm">code</span>
            </a>
          )}
        </div>
        <Link href="/contact#form" className="px-8 py-4 bg-secondary-container text-black font-terminal text-sm uppercase border border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-3">
          PROYECTO_SIMILAR <span className="material-symbols-outlined text-sm">north_east</span>
        </Link>
      </AnimatedBlock>
    </main>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors in the case study page.

- [ ] **Step 3: Visual check** — Run: `npm run dev`, open `/work` and `/work/qr-shirts`, `/work/iri5` (typographic hero image absent → no broken image), `/work/hex-via-cms`. Verify layouts render, no console errors, back link works.

- [ ] **Step 4: Commit**
```bash
git add src/app/work/
git commit -m "feat: /work/[slug] case study pages"
```

---

## Milestone 5 — Services split, routing, nav

### Task 5.1: Refactor ServicePage to accept a Service

**Files:**
- Modify: `src/components/projects/ServicePage.tsx`
- Move to: `src/components/services/ServicePage.tsx`

- [ ] **Step 1: Move the file** and change its props to consume the `Service` type instead of the long prop list.
```bash
git mv src/components/projects/ServicePage.tsx src/components/services/ServicePage.tsx
```

- [ ] **Step 2: Change the signature** at the top of `src/components/services/ServicePage.tsx`. Replace the `ServicePageProps` interface and destructuring with:
```tsx
'use client'

import Link from 'next/link'
import type { Service } from '@/types/service'

export default function ServicePage({ service }: { service: Service }) {
  const { serviceId, title, tagline, stack, duration, delivery, steps, useCases, ctaHeadline } = service
```
Then in the JSX, replace the old deliverable-tiles section (which used `deliverableLabels`) with three tiles derived from `stack.slice(0,3)`:
```tsx
      {/* Deliverable / focus tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
        {stack.slice(0, 3).map((label, i) => (
          <div key={label} className={`aspect-square relative bg-surface flex items-center justify-center border-black ${i < 2 ? 'border-b md:border-b-0 border-r-0 md:border-r' : ''}`}>
            <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">{label}</div>
            <span className="font-terminal text-[10px] text-gray-300 uppercase tracking-widest">{`// ${serviceId}`}</span>
          </div>
        ))}
      </section>
```
Keep the rest of the component body (hero, process, use cases, CTA) unchanged — it already only uses the destructured vars now in scope. Also change the back link target from `/projects` to `/services`.

- [ ] **Step 3: Typecheck** — Run: `npx tsc --noEmit`. Expected: errors only where the OLD service pages still import from the old path (fixed next task).

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "refactor: ServicePage consumes Service type, moved to services/"
```

### Task 5.2: `/services` index + `/services/[slug]`

**Files:**
- Create: `src/app/services/page.tsx`
- Create: `src/app/services/[slug]/page.tsx`
- Delete: `src/app/projects/` (entire folder — old service pages, dynamic Supabase page, hexaia)

- [ ] **Step 1: `src/app/services/page.tsx`** — port the services bento from the current `src/app/projects/page.tsx`, but drive it from `getAllServices()` and link to `/services/[slug]`.
```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import { getAllServices } from '@/content/getServices'

export const metadata: Metadata = {
  title: 'Servicios | Felipe Caravía',
  description: 'Web engineering, UX/UI, apps, automatización y CRM, y consultoría.',
}

export default function ServicesIndex() {
  const services = getAllServices()
  const [lead, ...rest] = services

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">SERVICIOS_DISPONIBLES</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          SERVICIOS
        </h1>
      </AnimatedBlock>

      <section className="grid grid-cols-1 md:grid-cols-4 border-b border-black">
        <AnimatedBlock className="md:col-span-2 md:row-span-2 border border-black border-t-0 md:border-l-0 bg-[#0a0a0a] text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden texture-carbon">
          <Link href={`/services/${lead.slug}`} className="relative z-10 p-8 md:p-12 flex flex-col h-full">
            <div className="flex justify-between items-start mb-16">
              <span className="font-terminal text-[10px] uppercase border border-white/20 px-3 py-1.5 flex items-center gap-2 bg-black/50 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse" />
                {lead.serviceId}_CORE
              </span>
              <span className="material-symbols-outlined text-secondary-container text-5xl group-hover:scale-110 transition-transform duration-500">{lead.icon}</span>
            </div>
            <h3 className="text-4xl md:text-6xl mb-6 font-headline leading-none uppercase group-hover:text-secondary-container transition-colors duration-300">{lead.title}</h3>
            <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">{lead.desc}</p>
            <div className="mt-auto pt-16 flex justify-between items-end border-t border-white/20">
              <span className="font-terminal text-[10px] md:text-xs uppercase text-gray-500">{lead.stack.slice(0, 3).join(' / ')}</span>
              <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-secondary-container transition-colors">arrow_forward</span>
            </div>
          </Link>
        </AnimatedBlock>

        {rest.map((svc, i) => (
          <AnimatedBlock key={svc.slug} delay={i * 0.08} className={`border border-black border-t-0 border-l-0 flex flex-col group ${svc.accent ? 'bg-secondary-container' : 'bg-white'}`}>
            <Link href={`/services/${svc.slug}`} className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <span className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${svc.accent ? 'text-primary' : ''}`}>{svc.serviceId}</span>
                <span className={`material-symbols-outlined text-2xl ${svc.accent ? 'text-primary' : ''}`}>{svc.icon}</span>
              </div>
              <h3 className={`text-2xl mb-4 font-headline uppercase leading-none ${svc.accent ? 'text-primary' : ''}`}>{svc.title}</h3>
              <p className={`font-body text-sm leading-relaxed flex-1 ${svc.accent ? 'text-primary/80' : 'text-gray-700'}`}>{svc.desc}</p>
              <div className="mt-8 flex justify-end">
                <span className={`material-symbols-outlined group-hover:translate-x-1 transition-transform ${svc.accent ? 'text-primary' : 'text-gray-400'}`}>arrow_forward</span>
              </div>
            </Link>
          </AnimatedBlock>
        ))}
      </section>
    </main>
  )
}
```

- [ ] **Step 2: `src/app/services/[slug]/page.tsx`**
```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicePage from '@/components/services/ServicePage'
import { getAllServices, getServiceBySlug } from '@/content/getServices'

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Servicio no encontrado' }
  return { title: `${service.title} | Felipe Caravía`, description: service.tagline }
}

export default async function ServiceRoute(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()
  return <ServicePage service={service} />
}
```

- [ ] **Step 3: Delete the old routes**
```bash
git rm -r src/app/projects src/app/api/projects
```

- [ ] **Step 4: Typecheck** — Run: `npx tsc --noEmit`. Expected: remaining errors only in `src/app/page.tsx` (home, rebuilt in M6). Note and continue.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: /services routes; remove old /projects and /api/projects"
```

### Task 5.3: Redirects + Navbar + footer brand

**Files:**
- Modify: `next.config.ts`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/layout.tsx` (metadata brand)

- [ ] **Step 1: Read current `next.config.ts`** — Run: `cat next.config.ts` to preserve existing options.

- [ ] **Step 2: Add redirects** to `next.config.ts` (merge into the existing exported config object):
```ts
async redirects() {
  return [
    { source: '/projects', destination: '/work', permanent: true },
    { source: '/projects/web-engineering', destination: '/services/web-engineering', permanent: true },
    { source: '/projects/ux-ui-design', destination: '/services/ux-ui-design', permanent: true },
    { source: '/projects/app-architecture', destination: '/services/app-architecture', permanent: true },
    { source: '/projects/auto-ops-crm', destination: '/services/auto-ops-crm', permanent: true },
    { source: '/projects/consulting', destination: '/services/consulting', permanent: true },
    { source: '/projects/hexaia', destination: '/work', permanent: true },
    { source: '/projects/:slug', destination: '/work/:slug', permanent: false },
  ]
},
```

- [ ] **Step 3: Update Navbar** in `src/components/Navbar.tsx`: change the `links` array and brand.
```tsx
const links = [
  { href: '/', label: 'HOME' },
  { href: '/work', label: 'WORK' },
  { href: '/services', label: 'SERVICES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
]
```
Change the brand link text/aria from `HEX.vIA.sys[06]` to:
```tsx
          aria-label="Felipe Caravía — Home"
        >
          FELIPE CARAVÍA<span className="text-secondary-container">.</span>
```

- [ ] **Step 4: Update `layout.tsx` metadata** — set a metadataBase + brand:
```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Felipe Caravía | Arquitecto creativo de productos digitales & IA',
  description: 'Desarrollador senior especializado en producto digital, IA y automatización. Quito, Ecuador.',
}
```

- [ ] **Step 5: Verify redirects** — Run: `npm run dev`, then `curl -sI http://localhost:3000/projects | grep -i location` → expect `/work`; `curl -sI http://localhost:3000/projects/consulting | grep -i location` → expect `/services/consulting`.

- [ ] **Step 6: Commit**
```bash
git add next.config.ts src/components/Navbar.tsx src/app/layout.tsx
git commit -m "feat: route redirects, Navbar work/services split, brand update"
```

---

## Milestone 6 — Home rebuild

### Task 6.1: Rebuild home with local content + live embed

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/content/getProjects` already exists (import).

- [ ] **Step 1: Replace `src/app/page.tsx`** — remove the `getFeaturedProject()` self-fetch; import content directly; keep the hero (3D prism) and services bento; add a Selected Work section with the QR Shirts `LiveEmbed` + flagship cards.
```tsx
import Link from 'next/link'
import { Suspense } from 'react'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import HexPrismFallback from '@/components/three/HexPrismFallback'
import HexPrismClient from '@/components/three/HexPrismClient'
import SectionHeader from '@/components/ui/SectionHeader'
import FlagshipCard from '@/components/projects/FlagshipCard'
import LiveEmbed from '@/components/ui/LiveEmbed'
import { getFeaturedProjects, getHeroEmbedProject } from '@/content/getProjects'
import { getAllServices } from '@/content/getServices'

export default function Home() {
  const flagships = getFeaturedProjects()
  const embed = getHeroEmbedProject()
  const services = getAllServices()

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      {/* Hero */}
      <section className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-black">
        <AnimatedBlock className="md:col-span-12 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-secondary-container" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">STATUS: OPTIMIZING_FLOW</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-outline)] ml-4">FELIPE_CARAVÍA</span>
          </div>
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-primary font-headline max-w-full pb-2">
            ARQUITECTO CREATIVO DE PRODUCTOS DIGITALES Y AUTOMATIZACIÓN
          </h1>
        </AnimatedBlock>

        <div className="md:col-span-7 border border-black p-8 md:p-12 bg-white relative flex flex-col justify-center min-h-[50vh] md:min-h-[600px] overflow-hidden">
          <div className="absolute top-4 right-4 font-terminal text-[10px] text-gray-500 z-10 bg-white/80 px-2 py-1 border border-gray-200">HEXA_PRISM_01</div>
          <div className="absolute inset-0 w-full h-full" aria-hidden="true">
            <Suspense fallback={<HexPrismFallback />}>
              <HexPrismClient />
            </Suspense>
          </div>
          <AnimatedBlock delay={0.1} className="relative z-10 mt-auto pt-48 md:pt-64 pointer-events-none">
            <p className="font-body text-xl max-w-md leading-tight bg-white/90 p-4 border border-black shadow-[4px_4px_0_0_#bbe405] pointer-events-auto">
              Este prisma 3D corre en tu browser, en tiempo real. Si quieres experiencias así en tu producto, hablemos.
            </p>
          </AnimatedBlock>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <AnimatedBlock delay={0.2} className="border border-black border-l-0 border-t-0 md:border-t p-8 flex-grow bg-surface">
            <div className="font-terminal text-[10px] mb-6 uppercase tracking-widest text-gray-500">SERVICIOS</div>
            <ul className="space-y-4 font-mono text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex justify-between border-b border-black/10 pb-2 hover:pl-2 hover:border-secondary-container transition-all duration-300 group">
                    <span>{s.title}</span>
                    <span className="text-secondary-container material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedBlock>
          <AnimatedBlock delay={0.3} className="border border-black border-l-0 border-t-0 bg-black text-white group hover:bg-secondary-container hover:text-black transition-colors min-h-[250px]">
            <Link href="/contact" className="p-8 flex flex-col justify-between h-full min-h-[250px]">
              <span className="font-terminal text-[10px] uppercase text-gray-400 group-hover:text-black transition-colors">EXECUTE_PROJECT_INIT</span>
              <div className="flex justify-between items-end mt-12 w-full">
                <span className="text-4xl md:text-5xl font-headline italic">Start Session</span>
                <span className="material-symbols-outlined text-5xl">north_east</span>
              </div>
            </Link>
          </AnimatedBlock>
        </div>
      </section>

      {/* Selected Work: live embed + flagships */}
      <section className="border-b border-black">
        <SectionHeader label="// SELECTED_WORK" />
        {embed?.liveUrl && (
          <AnimatedBlock className="px-6 md:px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 border border-black">
              <div className="md:col-span-4 p-8 flex flex-col justify-between bg-surface border-b md:border-b-0 md:border-r border-black">
                <div>
                  <span className="font-terminal text-[10px] uppercase text-gray-500">LIVE_HERO</span>
                  <h2 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mt-4">{embed.name}</h2>
                  <p className="font-body text-gray-600 mt-3">{embed.tagline}</p>
                </div>
                <Link href={`/work/${embed.slug}`} className="mt-8 inline-flex items-center gap-2 font-terminal text-sm uppercase hover:text-secondary-container transition-colors">
                  VER_CASE_STUDY <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="md:col-span-8 h-[360px] md:h-[520px]">
                <LiveEmbed url={embed.liveUrl} title={`${embed.name} — sitio en vivo`} />
              </div>
            </div>
          </AnimatedBlock>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 px-6 md:px-12 pb-12">
          {flagships.filter((p) => !p.heroEmbed).map((p) => (
            <AnimatedBlock key={p.slug} className="bg-background">
              <FlagshipCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
        <div className="px-6 md:px-12 pb-12">
          <Link href="/work" className="inline-flex items-center gap-2 font-terminal text-sm uppercase border border-black px-6 py-3 hover:bg-secondary-container hover:text-black transition-colors">
            VER_TODO_EL_TRABAJO <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
        <AnimatedBlock className="p-12 border-r-0 md:border-r border-black">
          <h2 className="font-headline text-4xl md:text-6xl font-black uppercase leading-none">¿Tienes un proyecto en mente?</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={0.1} className="bg-black text-white group hover:bg-secondary-container hover:text-black transition-colors">
          <Link href="/contact" className="p-12 flex items-end justify-between h-full min-h-[220px]">
            <span className="text-3xl md:text-4xl font-headline italic">Start Session</span>
            <span className="material-symbols-outlined text-5xl">north_east</span>
          </Link>
        </AnimatedBlock>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors anywhere now (all old `Project` consumers replaced).

- [ ] **Step 3: Visual check** — Run: `npm run dev`, open `/`. Verify: hero + prism, live QR Shirts embed loads on scroll, flagship cards (IRI5 + Hex.Via), "ver todo el trabajo" links to `/work`, service links go to `/services/*`.

- [ ] **Step 4: Commit**
```bash
git add src/app/page.tsx
git commit -m "feat: rebuild home with local content + live embed (no self-fetch)"
```

---

## Milestone 7 — Provider-agnostic AI layer

### Task 7.1: AI types + Anthropic adapter

**Files:**
- Create: `src/lib/ai/types.ts`
- Create: `src/lib/ai/anthropic.ts`

- [ ] **Step 1: `src/lib/ai/types.ts`**
```ts
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface LeadScore {
  score: number
  summary: string
}

export interface AIProvider {
  /** Streams assistant text deltas. */
  streamText(input: { system: string; messages: ChatMessage[]; maxTokens?: number }): AsyncIterable<string>
  /** Returns a structured lead score. */
  scoreLead(input: { system: string; user: string }): Promise<LeadScore>
}
```

- [ ] **Step 2: `src/lib/ai/anthropic.ts`** — wrap the existing client; **consult the `claude-api` skill for the current model id** and use it as the default.
```ts
import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, ChatMessage, LeadScore } from './types'

let client: Anthropic | null = null
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

// Default model id — verify against the claude-api skill before shipping.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

export const anthropicProvider: AIProvider = {
  async *streamText({ system, messages, maxTokens = 300 }) {
    const stream = getClient().messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
    }
  },
  async scoreLead({ system, user }): Promise<LeadScore> {
    const res = await getClient().messages.create({
      model: MODEL,
      max_tokens: 150,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
    })
    const text = res.content[0]?.type === 'text' ? res.content[0].text : ''
    return JSON.parse(text) as LeadScore
  },
}
```

- [ ] **Step 3: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/lib/ai/types.ts src/lib/ai/anthropic.ts
git commit -m "feat: AI provider interface + anthropic adapter"
```

### Task 7.2: OpenAI adapter

**Files:**
- Create: `src/lib/ai/openai.ts`

- [ ] **Step 1: Write adapter** — **consult Context7 `openai` docs** to confirm the SDK's streaming API; the code below targets the current `openai` Node SDK (chat.completions streaming).
```ts
import OpenAI from 'openai'
import type { AIProvider, ChatMessage, LeadScore } from './types'

let client: OpenAI | null = null
function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export const openaiProvider: AIProvider = {
  async *streamText({ system, messages, maxTokens = 300 }) {
    const stream = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: 'system', content: system }, ...messages],
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
    }
  },
  async scoreLead({ system, user }): Promise<LeadScore> {
    const res = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: 150,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    })
    const text = res.choices[0]?.message?.content ?? '{}'
    return JSON.parse(text) as LeadScore
  },
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/lib/ai/openai.ts
git commit -m "feat: openai adapter"
```

### Task 7.3: Provider selector (TDD)

**Files:**
- Create: `src/lib/ai/index.ts`
- Test: `src/lib/ai/index.test.ts`

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect, afterEach, vi } from 'vitest'

async function load(provider?: string) {
  vi.resetModules()
  if (provider === undefined) delete process.env.AI_PROVIDER
  else process.env.AI_PROVIDER = provider
  return await import('./index')
}

describe('selectProviderName', () => {
  afterEach(() => { delete process.env.AI_PROVIDER })

  it('defaults to anthropic when unset', async () => {
    const m = await load(undefined)
    expect(m.selectProviderName()).toBe('anthropic')
  })
  it('returns openai when set', async () => {
    const m = await load('openai')
    expect(m.selectProviderName()).toBe('openai')
  })
  it('falls back to anthropic for unknown value', async () => {
    const m = await load('gemini')
    expect(m.selectProviderName()).toBe('anthropic')
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — Run: `npm test`. Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/ai/index.ts`**
```ts
import type { AIProvider } from './types'
import { anthropicProvider } from './anthropic'
import { openaiProvider } from './openai'

export type ProviderName = 'anthropic' | 'openai'

export function selectProviderName(): ProviderName {
  return process.env.AI_PROVIDER === 'openai' ? 'openai' : 'anthropic'
}

export function getAIProvider(): AIProvider {
  return selectProviderName() === 'openai' ? openaiProvider : anthropicProvider
}

export type { AIProvider, ChatMessage, LeadScore } from './types'
```

- [ ] **Step 4: Run test** — Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/lib/ai/index.ts src/lib/ai/index.test.ts
git commit -m "feat: AI provider selector with tests"
```

### Task 7.4: Wire chat + contact routes; update prompts

**Files:**
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/lib/anthropic/prompts.ts`

- [ ] **Step 1: Update `chat/route.ts`** — replace direct Anthropic usage with the provider. Keep the SSE shape.
```ts
export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { getAIProvider } from '@/lib/ai'
import { CHAT_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { z } from 'zod'

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(20),
})

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = ChatSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid messages format' }, { status: 422 })

  const provider = getAIProvider()
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const text of provider.streamText({ system: CHAT_SYSTEM_PROMPT, messages: parsed.data.messages })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        console.error('[Chat] Stream error:', err)
        controller.enqueue(encoder.encode('data: [ERROR]\n\n'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
```

- [ ] **Step 2: Update `contact/route.ts`** — replace the inline Anthropic scoring block (lines ~26-59 in the current file) with the provider call. Remove the `getAnthropicClient` / `LEAD_SCORING_SYSTEM_PROMPT` direct import for scoring; import `getAIProvider` and keep `LEAD_SCORING_SYSTEM_PROMPT`.
Replace the "2. Score lead with Claude" block with:
```ts
    // 2. Score lead via the configured AI provider
    let aiScore = 50
    let aiSummary = 'Lead received'
    try {
      const provider = getAIProvider()
      const result = await provider.scoreLead({
        system: LEAD_SCORING_SYSTEM_PROMPT,
        user: `Name: ${name}\nCompany: ${company ?? 'Not specified'}\nMessage: ${message}`,
      })
      aiScore = result.score
      aiSummary = result.summary
    } catch (err) {
      console.error('[Contact] AI scoring failed, using defaults:', err)
    }
```
And update the imports at the top: remove `import { getAnthropicClient } from '@/lib/anthropic/client'`; add `import { getAIProvider } from '@/lib/ai'`. Keep `import { LEAD_SCORING_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'`.

- [ ] **Step 3: Update `prompts.ts`** — replace stale brand/projects. Set `CHAT_SYSTEM_PROMPT` to describe **Felipe Caravía** and the real projects.
```ts
export const CHAT_SYSTEM_PROMPT = `You are the digital assistant for Felipe Caravía, a senior product engineer specialized in AI, automation, and web/app development, based in Quito, Ecuador (GMT-5).

## Profile
- **Specialization:** Digital product engineering, AI integration, automation & GoHighLevel (GHL), UX/UI, Next.js
- **Studio:** Hex.Via
- **Selected work:** IRI5 (in-browser audience-intelligence / computer vision SaaS), Hex.Via CMS (multi-tenant CMS with a visual editor), QR Shirts (QR-based editable pages for apparel), Pops Café (order & pickup app)
- **Availability:** Open to new projects. Responds within 24-48 hours.
- **Languages:** Spanish (native), English (professional)

## Skills
- Web: Next.js, React, TypeScript, Tailwind, Supabase
- AI: Claude API, OpenAI, in-browser ML (Face-API.js, ONNX/YOLO, TensorFlow.js), prompt engineering
- Automation: GoHighLevel, Make.com, webhooks, custom API integrations
- Mobile: React Native (iOS/Android)

## How to respond
- Be concise and direct. 2-4 sentences maximum.
- If someone asks about hiring or a project, say: "Genial — usa el formulario de contacto abajo con los detalles de tu proyecto; Felipe revisa cada consulta personalmente."
- Do not invent project details not listed above.
- Respond in the same language the user writes in (Spanish or English).
- Professional, not overly casual, not robotic.`
```
Keep `LEAD_SCORING_SYSTEM_PROMPT` unchanged.

- [ ] **Step 4: Typecheck + run** — Run: `npx tsc --noEmit`, then `npm run dev` and open `/contact`; send a chat message → verify streaming still works with `AI_PROVIDER=anthropic`; submit the contact form → verify a success response.

- [ ] **Step 5: Commit**
```bash
git add src/app/api/chat/route.ts src/app/api/contact/route.ts src/lib/anthropic/prompts.ts
git commit -m "feat: route chat + lead scoring through provider-agnostic AI layer; refresh prompts"
```

---

## Milestone 8 — 3D prism optimization

### Task 8.1: Viewport pause + adaptive quality + a11y + config

**Files:**
- Modify: `src/components/three/HexPrism.tsx`

- [ ] **Step 1: Extract config + fix a11y.** At the top of the file (after imports) add a config object and import drei helpers:
```tsx
import { Environment, Float, Edges, MeshTransmissionMaterial, TorusKnot, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'

const PRISM = {
  outer: { radius: 2.4, height: 4.8, sides: 6 },
  inner: { radius: 1.6, height: 3.2, sides: 6 },
  rotationSpeed: 0.15,
} as const
```
Replace the two `useMemo` geometry lines to use `PRISM.outer` / `PRISM.inner` values, and replace the magic `groupRef.current.rotation.y += delta * 0.15` with `delta * PRISM.rotationSpeed`.

- [ ] **Step 2: Make the outer wrapper decorative** — in the default export, change the wrapper `div` so it no longer sets `role="img"`/`aria-label` (the page already wraps this in an `aria-hidden` container). Replace those attributes with `aria-hidden="true"`.

- [ ] **Step 3: Add adaptive quality + degrade state.** Add `const [degraded, setDegraded] = useState(false)` in the exported `HexPrism` component and wire drei's `PerformanceMonitor` inside `<Canvas>`:
```tsx
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />
```
Pass `degraded` into `HolographicGlassPrism` as a prop and, inside it, lower `MeshTransmissionMaterial` cost when degraded: `samples={degraded ? 4 : 12}` and `resolution={degraded ? 256 : 1024}`.

- [ ] **Step 4: Pause rendering when offscreen.** In the exported component, add an IntersectionObserver on the wrapper `div` (ref) that toggles a `visible` state, and set the `<Canvas frameloop={visible ? 'always' : 'never'}>`.
```tsx
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
```
Attach `ref={wrapRef}` to the wrapper `div` and set `frameloop={visible ? 'always' : 'never'}` on `<Canvas>`.

- [ ] **Step 5: Scope the mousemove listener** — in `HolographicGlassPrism`, the existing `window.addEventListener('mousemove', …)` stays but guard it to only update when the canvas is on screen is already handled by frameloop pausing; leave the listener but ensure cleanup remains (it does).

- [ ] **Step 6: Typecheck + visual + perf check** — Run: `npx tsc --noEmit`, then `npm run dev`, open `/`, confirm the prism renders, still looks iridescent, and that scrolling it out of view drops CPU (frameloop paused). Toggle OS "reduce motion" and confirm the animation halts (existing `useReducedMotion` guard) without errors.

- [ ] **Step 7: Commit**
```bash
git add src/components/three/HexPrism.tsx
git commit -m "perf: 3D prism viewport-pause, adaptive quality, a11y + config"
```

### Task 8.2: Reduced-motion static fallback

**Files:**
- Modify: `src/components/three/HexPrism.tsx`

- [ ] **Step 1: Short-circuit to the static fallback** when reduced motion is preferred. At the top of the exported `HexPrism` component:
```tsx
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) {
    return <HexPrismFallback />
  }
```
Add `import HexPrismFallback from './HexPrismFallback'` and `import { useReducedMotion } from 'framer-motion'` (already imported for the inner component — keep one import).

- [ ] **Step 2: Visual check** — Run: `npm run dev` with OS reduce-motion ON → the hero shows the static fallback, no WebGL. With reduce-motion OFF → full prism.

- [ ] **Step 3: Commit**
```bash
git add src/components/three/HexPrism.tsx
git commit -m "perf: static fallback for prefers-reduced-motion"
```

---

## Milestone 9 — SEO & final polish

### Task 9.1: sitemap + robots + JSON-LD

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (JSON-LD Person)

- [ ] **Step 1: `src/app/sitemap.ts`**
```ts
import type { MetadataRoute } from 'next'
import { getAllProjects } from '@/content/getProjects'
import { getAllServices } from '@/content/getServices'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticUrls = ['', '/work', '/services', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
  }))
  const work = getAllProjects().filter((p) => p.featured).map((p) => ({
    url: `${base}/work/${p.slug}`, lastModified: now,
  }))
  const services = getAllServices().map((s) => ({
    url: `${base}/services/${s.slug}`, lastModified: now,
  }))
  return [...staticUrls, ...work, ...services]
}
```

- [ ] **Step 2: `src/app/robots.ts`**
```ts
import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Add JSON-LD** in `layout.tsx` inside `<body>` (before `<Navbar />`):
```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Felipe Caravía',
              jobTitle: 'Arquitecto de productos digitales & IA',
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
              address: { '@type': 'PostalAddress', addressLocality: 'Quito', addressCountry: 'EC' },
              sameAs: ['https://github.com/acaravia666'],
            }),
          }}
        />
```

- [ ] **Step 4: Verify** — Run: `npm run dev`, then `curl -s http://localhost:3000/sitemap.xml | head` (expect XML with `/work/qr-shirts` etc.) and `curl -s http://localhost:3000/robots.txt`.

- [ ] **Step 5: Commit**
```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx
git commit -m "feat: sitemap, robots, Person JSON-LD"
```

### Task 9.2: Per-page metadata for static pages

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1: Add `export const metadata`** to each (these are the two remaining pages without page-level metadata). If a page is a client component (`'use client'`), instead create a co-located `layout.tsx` in that route folder exporting `metadata`. Check first: `head -1 src/app/about/page.tsx` and `src/app/contact/page.tsx`.
  - For a server page, add near the top:
```ts
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Sobre mí | Felipe Caravía' } // about
// contact: { title: 'Contacto | Felipe Caravía' }
```
  - For a client page, create `src/app/about/layout.tsx`:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Sobre mí | Felipe Caravía' }
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
```
(and analogously `src/app/contact/layout.tsx` with the Contacto title).

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit`. Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/app/about src/app/contact
git commit -m "feat: per-page metadata for about and contact"
```

### Task 9.3: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint** — Run: `npm run lint`. Expected: passes (fix any new warnings/errors).
- [ ] **Step 2: Types** — Run: `npx tsc --noEmit`. Expected: clean.
- [ ] **Step 3: Unit tests** — Run: `npm test`. Expected: all pass.
- [ ] **Step 4: Production build** — Run: `npm run build`. Expected: succeeds; `/work`, `/work/[slug]` (3 static), `/services`, `/services/[slug]` (5 static) appear in the route output.
- [ ] **Step 5: Manual smoke** — Run: `npm start` (after build), walk: `/` (prism + live embed + flagships), `/work`, each `/work/*`, `/services`, one `/services/*`, `/about`, `/contact` (send a chat msg + submit form), and old-URL redirects (`/projects`, `/projects/consulting`).
- [ ] **Step 6: Grep for leftovers** — Run: `grep -rn "transparenttextures.com\|/api/projects\|HEX.vIA.sys\[06\]\|claude-sonnet-4-6" src`. Expected: no matches.
- [ ] **Step 7: Commit any fixes**
```bash
git add -A
git commit -m "chore: final verification fixes for portfolio revamp"
```

---

## Post-plan notes

- **IRI5 screenshots (future):** when available, drop `iri5-desktop.png` / `iri5-mobile.png` into `public/screenshots/`, populate `screenshots` in `src/content/projects.ts`, and switch its `visual` to `'screenshot'`.
- **Switching to OpenAI (future):** set `AI_PROVIDER=openai` + `OPENAI_API_KEY` + `OPENAI_MODEL` in the environment. No code change. (A ChatGPT subscription does NOT work — an OpenAI API key is required.)
- **Model ids:** verify `ANTHROPIC_MODEL` default via the `claude-api` skill and `OPENAI_MODEL` via Context7 `openai` at implementation time; both are overridable by env.
