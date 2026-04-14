# Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/projects` index page and four service pages (Web Engineering, UX/UI System Design, App Architecture, Auto-Ops & CRM), update the navbar to link to `/projects`, and visually differentiate HexaIA as a case study vs the service offerings.

**Architecture:** A shared `ServicePage` component holds the full layout for service pages and accepts props — the four individual page files are thin data wrappers. The index page is a standalone server component. No new dependencies.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · existing `AnimatedBlock` component

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/projects/ServicePage.tsx` | Shared layout for all 4 service pages |
| Create | `src/app/projects/page.tsx` | Index — case studies + services grid |
| Create | `src/app/projects/web-engineering/page.tsx` | Web Engineering data → ServicePage |
| Create | `src/app/projects/ux-ui-design/page.tsx` | UX/UI data → ServicePage |
| Create | `src/app/projects/app-architecture/page.tsx` | App Architecture data → ServicePage |
| Create | `src/app/projects/auto-ops-crm/page.tsx` | Auto-Ops data → ServicePage |
| Modify | `src/components/Navbar.tsx` | href + active state for PROJECTS link |

---

### Task 1: Update Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Change PROJECTS href and active state check**

In `src/components/Navbar.tsx`, the `links` array currently points to `/projects/hexaia`. Change it to `/projects`. Also fix the active state: `pathname === link.href` would never highlight PROJECTS when on `/projects/hexaia` or any service sub-page. Replace it with a `startsWith` check.

Replace the `links` array and the `aria-current` attribute:

```tsx
const links = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/contact', label: 'CONTACT' },
]
```

Change the desktop link's `aria-current` (line ~61):
```tsx
aria-current={
  link.href === '/'
    ? pathname === '/'
      ? 'page'
      : undefined
    : pathname.startsWith(link.href)
    ? 'page'
    : undefined
}
```

The mobile menu `<Link>` elements don't need aria-current, no change needed there.

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript errors. If lint errors appear, fix them before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: update PROJECTS nav link to /projects with startsWith active state"
```

---

### Task 2: Create shared ServicePage component

**Files:**
- Create: `src/components/projects/ServicePage.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/projects/ServicePage.tsx` with this exact content:

```tsx
'use client'

import Link from 'next/link'

interface Step {
  title: string
  description: string
}

export interface ServicePageProps {
  serviceId: string
  title: string
  tagline: string
  stack: string[]
  duration: string
  delivery: string
  steps: Step[]
  useCases: string[]
  ctaHeadline: string
  deliverableLabels: [string, string, string]
}

export default function ServicePage({
  serviceId,
  title,
  tagline,
  stack,
  duration,
  delivery,
  steps,
  useCases,
  ctaHeadline,
  deliverableLabels,
}: ServicePageProps) {
  return (
    <main className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="px-6 py-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-secondary-container transition-colors group"
        >
          <span
            className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            arrow_back
          </span>
          VOLVER_A_PROYECTOS
        </Link>
      </div>

      {/* Hero */}
      <section className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-0 border-y border-black">
        <div className="lg:col-span-7 border-r-0 lg:border-r border-black pb-12 lg:pb-24 pt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-tighter">
              {serviceId}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-secondary-container border border-black" />
              STATUS: AVAILABLE
            </span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase break-words">
            {title}
          </h1>
          <p className="mt-12 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
            {tagline}
          </p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-primary text-background px-8 py-4 font-mono font-bold uppercase tracking-widest border border-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              INICIAR PROYECTO
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                north_east
              </span>
            </Link>
          </div>
        </div>

        {/* Metadata sidebar */}
        <div className="lg:col-span-5 bg-surface flex flex-col justify-between font-mono">
          <div className="p-8 pt-12 flex-grow border-b border-black/10">
            <div className="space-y-12">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">
                  STACK_TÉCNICO
                </span>
                <ul className="space-y-2">
                  {stack.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between border-b border-black/5 pb-1"
                    >
                      <span className="font-bold">{item}</span>
                      <span
                        className="text-secondary-container material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">
                  DETALLES_PROYECTO
                </span>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-black/5 pb-1">
                    <span className="font-bold text-sm">DURACIÓN</span>
                    <span className="text-sm">{duration}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-black/5 pb-1 gap-4">
                    <span className="font-bold text-sm flex-shrink-0">ENTREGABLE</span>
                    <span className="text-sm text-right">{delivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-black text-white">
            <div className="flex items-center gap-4">
              <span
                className="material-symbols-outlined text-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
              <div className="text-[10px] tracking-widest">
                SERVICE_NODE_ACTIVE<br />
                LAT: 0° 13&apos; 47&quot; S | LNG: 78° 31&apos; 29&quot; W
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverable placeholder tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
        {deliverableLabels.map((label, i) => (
          <div
            key={label}
            className={`aspect-square relative bg-surface flex items-center justify-center border-black ${
              i < 2 ? 'border-b md:border-b-0 border-r-0 md:border-r' : ''
            }`}
          >
            <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">
              {label}
            </div>
            <span className="font-terminal text-[10px] text-gray-300 uppercase tracking-widest">
              {`// ${serviceId}`}
            </span>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
        <div className="lg:col-span-4 lg:sticky top-32">
          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            EL<br />PROCESO
          </h2>
          <div className="w-16 h-2 bg-secondary-container mb-6 border border-black" />
          <p className="font-mono text-sm leading-relaxed text-gray-700">
            Un flujo de trabajo estructurado que garantiza claridad en cada fase,
            entregables medibles y cero sorpresas.
          </p>
        </div>
        <div className="lg:col-span-8 space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="border border-black p-6 bg-surface flex gap-6 hover:bg-secondary-container transition-colors items-start"
            >
              <div className="font-headline text-5xl font-black text-black/20 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 uppercase">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">
          ¿PARA QUIÉN?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className="border border-black p-6 bg-white flex gap-4 items-start"
            >
              <span className="font-terminal text-[10px] text-gray-400 flex-shrink-0 mt-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-mono text-sm leading-relaxed">{useCase}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-24 px-6 text-center overflow-hidden relative border-t border-black">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden font-black text-[20vw] leading-none text-white/20 whitespace-nowrap -rotate-12 translate-y-24"
        >
          {title} {title} {title}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-2xl mx-auto leading-tight">
            {ctaHeadline}
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-secondary-container text-black px-12 py-6 font-bold uppercase tracking-widest text-lg md:text-xl hover:bg-white transition-colors border border-black shadow-[4px_4px_0_0_#FFFFFF]"
          >
            INICIAR DIAGNÓSTICO
          </Link>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ServicePage.tsx
git commit -m "feat: add shared ServicePage layout component"
```

---

### Task 3: Create `/projects` index page

**Files:**
- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Create the index page**

Create `src/app/projects/page.tsx`:

```tsx
import Link from 'next/link'
import AnimatedBlock from '@/components/ui/AnimatedBlock'

const services = [
  {
    id: 'SERVICE_01',
    icon: 'code_blocks',
    title: 'Web Engineering',
    desc: 'Arquitecturas frontend y backend de alto rendimiento. Plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.',
    href: '/projects/web-engineering',
    accent: false,
    large: true,
    stack: 'NEXT.JS / REACT / NODE',
  },
  {
    id: 'SERVICE_02',
    icon: 'design_services',
    title: 'UX/UI System Design',
    desc: 'Investigación de usuarios, wireframing y diseño de interfaces premium que fusionan estética industrial con usabilidad funcional para maximizar la retención.',
    href: '/projects/ux-ui-design',
    accent: false,
    large: false,
  },
  {
    id: 'SERVICE_03',
    icon: 'smartphone',
    title: 'App Architecture',
    desc: 'Sistemas móviles nativos y cross-platform iOS/Android construidos para durar.',
    href: '/projects/app-architecture',
    accent: false,
    large: false,
  },
  {
    id: 'SERVICE_04',
    icon: 'hub',
    title: 'Auto-Ops & CRM',
    desc: 'Automatización end-to-end e integraciones con GoHighLevel. Operaciones que se ejecutan solas.',
    href: '/projects/auto-ops-crm',
    accent: true,
    large: false,
  },
]

export default function ProjectsIndex() {
  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      {/* Page header */}
      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            ALL_WORK
          </span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          PROYECTOS &<br />SERVICIOS
        </h1>
      </AnimatedBlock>

      {/* Case Studies block */}
      <section className="border-b border-black">
        <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            // CASE_STUDIES
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <AnimatedBlock className="mx-6 md:mx-12 mb-12 border border-black bg-[#0a0a0a] text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="relative z-10 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 border border-secondary-container uppercase tracking-tighter">
                  CASE_STUDY
                </span>
                <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">
                  PROJECT_ID: 0x48657861
                </span>
              </div>
              <h2 className="font-headline text-6xl md:text-8xl font-black leading-none uppercase mb-4 group-hover:text-secondary-container transition-colors duration-300">
                HEXAIA
              </h2>
              <p className="font-body text-gray-400 text-lg max-w-xl leading-relaxed mb-8">
                Cómo una agencia de servicios eliminó el caos operativo y triplicó su tasa de cierre con automatización inteligente.
              </p>
              <div className="flex flex-wrap gap-8 mb-8">
                {[
                  { label: 'TASA CONTACTO 24H', value: '+210%' },
                  { label: 'TIEMPO ADMIN', value: '-65%' },
                  { label: 'TASA DE CIERRE', value: '18% → 47%' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <span className="font-terminal text-[10px] text-gray-500 block mb-1">{metric.label}</span>
                    <span className="font-headline text-2xl font-black text-secondary-container">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/projects/hexaia"
                className="inline-flex items-center gap-3 border border-white/30 px-6 py-3 font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black hover:border-secondary-container transition-all"
              >
                VER_CASE_STUDY
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* Services block */}
      <section>
        <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            // SERVICIOS_DISPONIBLES
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-black">
          {/* SERVICE_01 — large */}
          <AnimatedBlock
            delay={0}
            className="md:col-span-2 md:row-span-2 border border-black border-t-0 md:border-l-0 bg-[#0a0a0a] text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none mix-blend-overlay" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
              <div className="flex justify-between items-start mb-16">
                <span className="font-terminal text-[10px] uppercase border border-white/20 px-3 py-1.5 text-white flex items-center gap-2 bg-black/50 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse" />
                  SERVICE_01_CORE
                </span>
                <span className="material-symbols-outlined text-secondary-container text-5xl group-hover:scale-110 transition-transform duration-500">
                  code_blocks
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl mb-6 font-headline text-white leading-none uppercase group-hover:text-secondary-container transition-colors duration-300">
                Web Engineering
              </h3>
              <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">
                Arquitecturas frontend y backend de alto rendimiento. Desarrollo de plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.
              </p>
              <div className="mt-auto pt-16 flex justify-between items-end border-t border-white/20">
                <span className="font-terminal text-[10px] md:text-xs uppercase text-gray-500">
                  NEXT.JS / REACT / NODE
                </span>
                <Link
                  href="/projects/web-engineering"
                  className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-secondary-container transition-colors"
                  aria-label="Ver Web Engineering"
                >
                  arrow_forward
                </Link>
              </div>
            </div>
          </AnimatedBlock>

          {/* SERVICE_02, 03, 04 */}
          {services.filter((s) => !s.large).map((svc, i) => (
            <AnimatedBlock
              key={svc.id}
              delay={i * 0.08}
              className={`border border-black border-t-0 border-l-0 flex flex-col group ${
                svc.accent ? 'bg-secondary-container' : 'bg-white'
              }`}
            >
              <Link href={svc.href} className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <span
                    className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${
                      svc.accent ? 'text-primary' : ''
                    }`}
                  >
                    {svc.id}
                  </span>
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      svc.accent ? 'text-primary' : ''
                    }`}
                  >
                    {svc.icon}
                  </span>
                </div>
                <h3
                  className={`text-2xl mb-4 font-headline uppercase leading-none ${
                    svc.accent ? 'text-primary' : ''
                  }`}
                >
                  {svc.title}
                </h3>
                <p
                  className={`font-body text-sm leading-relaxed flex-1 ${
                    svc.accent ? 'text-primary/80' : 'text-gray-700'
                  }`}
                >
                  {svc.desc}
                </p>
                <div className="mt-8 flex justify-end">
                  <span
                    className={`material-symbols-outlined group-hover:translate-x-1 transition-transform ${
                      svc.accent ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    arrow_forward
                  </span>
                </div>
              </Link>
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat: add /projects index page with HexaIA case study and services grid"
```

---

### Task 4: Web Engineering page

**Files:**
- Create: `src/app/projects/web-engineering/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/projects/web-engineering/page.tsx`:

```tsx
import ServicePage from '@/components/projects/ServicePage'

export default function WebEngineeringPage() {
  return (
    <ServicePage
      serviceId="SERVICE_01"
      title="WEB ENGINEERING"
      tagline="Plataformas de alto rendimiento construidas para escalar, convertir y durar."
      stack={['Next.js', 'React', 'TypeScript', 'Supabase', 'Node.js', 'Vercel']}
      duration="4–12 semanas"
      delivery="Código fuente + deploy + documentación técnica"
      steps={[
        {
          title: 'Arquitectura & Planificación',
          description:
            'Definición de stack, estructura de datos, integraciones y roadmap técnico detallado. Entregable: documento de arquitectura aprobado.',
        },
        {
          title: 'Diseño de Sistema',
          description:
            'Componentes reutilizables, design tokens, sistema de rutas y estructura de API. Todo documentado antes de escribir la primera línea de producción.',
        },
        {
          title: 'Desarrollo & Iteración',
          description:
            'Sprints semanales con demos. Frontend, backend y base de datos construidos en paralelo con integración continua desde el día uno.',
        },
        {
          title: 'QA, Performance & Deploy',
          description:
            'Auditoría Lighthouse, optimización Core Web Vitals, configuración de CI/CD y lanzamiento a producción con monitoreo activo.',
        },
      ]}
      useCases={[
        'Startups que necesitan un MVP sólido y escalable sin deuda técnica desde el inicio.',
        'Empresas migrando de plataformas legacy que no pueden permitirse tiempo de inactividad.',
        'Productos SaaS B2B que requieren multi-tenancy, dashboards y APIs robustas.',
        'E-commerce de alto volumen donde cada 100ms de latencia impacta la conversión.',
      ]}
      ctaHeadline="ARQUITECTURA QUE ESCALA CONTIGO"
      deliverableLabels={['FRONTEND_SYSTEM', 'API_ARCHITECTURE', 'DEPLOY_CONFIG']}
    />
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, `/projects/web-engineering` route generated.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/web-engineering/page.tsx
git commit -m "feat: add Web Engineering service page"
```

---

### Task 5: UX/UI System Design page

**Files:**
- Create: `src/app/projects/ux-ui-design/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/projects/ux-ui-design/page.tsx`:

```tsx
import ServicePage from '@/components/projects/ServicePage'

export default function UXUIDesignPage() {
  return (
    <ServicePage
      serviceId="SERVICE_02"
      title="UX/UI SYSTEM DESIGN"
      tagline="Interfaces que retienen usuarios. Diseño industrial con precisión funcional."
      stack={['Figma', 'FigJam', 'Design Tokens', 'Framer', 'Lottie']}
      duration="2–6 semanas"
      delivery="Sistema de diseño + handoff de componentes + prototipo navegable"
      steps={[
        {
          title: 'Research & Discovery',
          description:
            'Entrevistas de usuario, análisis competitivo, mapas de journey y definición de métricas de retención. Entendemos el problema antes de diseñar.',
        },
        {
          title: 'Arquitectura de Información',
          description:
            'Sitemap, flujos de usuario y wireframes de baja fidelidad validados con stakeholders. Estructura sólida antes de aplicar estilo.',
        },
        {
          title: 'Sistema Visual',
          description:
            'Design tokens, biblioteca de componentes Figma, grid system y guía tipográfica. Un sistema que escala sin inconsistencias.',
        },
        {
          title: 'Prototipo & Handoff',
          description:
            'Prototipo interactivo navegable, specs de desarrollo con anotaciones de comportamiento y guía de estados. Listo para implementar sin preguntas.',
        },
      ]}
      useCases={[
        'Productos digitales con problemas de retención o altas tasas de abandono en onboarding.',
        'Rediseños de plataforma SaaS que necesitan coherencia visual sin romper flujos existentes.',
        'Apps móviles pre-desarrollo que necesitan validar flujos con usuarios antes de codificar.',
        'Startups pre-seed que necesitan un producto visualmente sólido para su pitch deck.',
      ]}
      ctaHeadline="DISEÑO QUE CONVIERTE Y RETIENE"
      deliverableLabels={['WIREFRAMES_SYSTEM', 'COMPONENT_LIBRARY', 'PROTOTYPE_FLOW']}
    />
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, `/projects/ux-ui-design` route generated.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/ux-ui-design/page.tsx
git commit -m "feat: add UX/UI System Design service page"
```

---

### Task 6: App Architecture page

**Files:**
- Create: `src/app/projects/app-architecture/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/projects/app-architecture/page.tsx`:

```tsx
import ServicePage from '@/components/projects/ServicePage'

export default function AppArchitecturePage() {
  return (
    <ServicePage
      serviceId="SERVICE_03"
      title="APP ARCHITECTURE"
      tagline="Apps nativas y cross-platform que funcionan en iOS y Android desde un solo codebase."
      stack={['React Native', 'Expo', 'TypeScript', 'Supabase', 'Push Notifications']}
      duration="8–16 semanas"
      delivery="App publicada en App Store + Google Play + código fuente"
      steps={[
        {
          title: 'Arquitectura Técnica',
          description:
            'Definición de navegación, gestión de estado, estructura de módulos y estrategia de sincronización offline. Sin sorpresas en la mitad del desarrollo.',
        },
        {
          title: 'Diseño de Pantallas',
          description:
            'Componentes nativos adaptados a las guías de iOS y Android, sistema de temas claro/oscuro y flujos de onboarding que maximizan la activación.',
        },
        {
          title: 'Desarrollo & Integraciones',
          description:
            'Autenticación, base de datos en tiempo real, push notifications, pagos in-app y conexión a APIs externas. Todo con manejo de estados de error y offline.',
        },
        {
          title: 'Testing & Publicación',
          description:
            'Pruebas en dispositivos físicos iOS y Android, optimización de performance, preparación de assets para stores y submission completo a App Store y Google Play.',
        },
      ]}
      useCases={[
        'Negocios con plataforma web exitosa que necesitan un canal móvil complementario.',
        'MVPs móviles para validar una idea con usuarios reales antes de invertir a gran escala.',
        'Empresas con procesos internos que requieren una app de campo para equipos remotos.',
        'Startups con tracción probada que quieren expandir su distribución al canal móvil.',
      ]}
      ctaHeadline="TU PRODUCTO EN TODOS LOS DISPOSITIVOS"
      deliverableLabels={['IOS_SCREENS', 'ANDROID_SCREENS', 'STORE_ASSETS']}
    />
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, `/projects/app-architecture` route generated.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/app-architecture/page.tsx
git commit -m "feat: add App Architecture service page"
```

---

### Task 7: Auto-Ops & CRM page

**Files:**
- Create: `src/app/projects/auto-ops-crm/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/projects/auto-ops-crm/page.tsx`:

```tsx
import ServicePage from '@/components/projects/ServicePage'

export default function AutoOpsCRMPage() {
  return (
    <ServicePage
      serviceId="SERVICE_04"
      title="AUTO-OPS & CRM"
      tagline="Operaciones que se ejecutan solas. Automatización end-to-end con GoHighLevel y AI."
      stack={['GoHighLevel', 'Make.com', 'Zapier', 'Claude API', 'WhatsApp API']}
      duration="2–4 semanas"
      delivery="Sistema activo + documentación de flujos + capacitación del equipo"
      steps={[
        {
          title: 'Diagnóstico Operativo',
          description:
            'Mapeo de procesos actuales, identificación de fricciones críticas y definición de KPIs a mejorar. No automatizamos el caos — primero lo ordenamos.',
        },
        {
          title: 'Arquitectura de Automatización',
          description:
            'Diseño de flujos, selección de herramientas según el stack existente y configuración del CRM como centro de comando de toda la operación.',
        },
        {
          title: 'Implementación & Conexión',
          description:
            'Construcción de workflows, integraciones de canales (email, WhatsApp, Meta, Instagram) y configuración de triggers inteligentes con lógica condicional.',
        },
        {
          title: 'Activación & Capacitación',
          description:
            'Pruebas en vivo con leads reales, ajuste fino de secuencias y entrenamiento del equipo en el nuevo sistema. Documentación completa incluida.',
        },
      ]}
      useCases={[
        'Agencias con alto volumen de leads que pierden oportunidades por respuesta tardía.',
        'Consultoras donde el equipo gasta más tiempo en admin que en entregar valor al cliente.',
        'Negocios con procesos repetitivos (seguimiento, agendamiento, cotizaciones) que consumen tiempo del equipo.',
        'Empresas que quieren integrar AI en su operación sin contratar un equipo técnico interno.',
      ]}
      ctaHeadline="OPERA MÁS, ADMINISTRA MENOS"
      deliverableLabels={['CRM_PIPELINE', 'AUTOMATION_FLOWS', 'INTEGRATION_MAP']}
    />
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, `/projects/auto-ops-crm` route generated.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/auto-ops-crm/page.tsx
git commit -m "feat: add Auto-Ops & CRM service page"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `/projects` index with HexaIA case study block + services bento → Task 3
- ✅ HexaIA visually differentiated (black card, CASE_STUDY badge, metrics visible) → Task 3
- ✅ Services as offers (OFFER-style cards with arrow links) → Task 3
- ✅ Navbar href + active state fix → Task 1
- ✅ Shared ServicePage component (DRY) → Task 2
- ✅ All 4 service pages with real content → Tasks 4–7
- ✅ Back nav links to `/projects` not `/` → Task 2 (ServicePage)
- ✅ Same visual style as hexaia/page.tsx → Task 2
- ✅ `startsWith('/projects')` active state for sub-routes → Task 1

**Placeholder scan:** No TBDs, no "implement later" — all steps contain complete code.

**Type consistency:** `ServicePageProps` defined once in `ServicePage.tsx`, exported, used directly by all 4 page files. `steps` array uses `{ title: string; description: string }` consistently. `deliverableLabels` is typed as `[string, string, string]` tuple — all callers pass exactly 3 strings.
