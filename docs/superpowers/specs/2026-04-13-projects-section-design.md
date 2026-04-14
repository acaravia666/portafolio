# Projects Section — Design Spec
**Date:** 2026-04-13  
**Status:** Approved

---

## Overview

Add a `/projects` index page and four individual service pages to the portfolio. Update the navbar "PROJECTS" link to point to the index. HexaIA remains as the existing case study; the four services (Web Engineering, UX/UI System Design, App Architecture, Auto-Ops & CRM) become individual offer pages.

---

## Routes

| Route | Type | Status |
|---|---|---|
| `/projects` | Index — all work | New |
| `/projects/hexaia` | Case study | Exists |
| `/projects/web-engineering` | Service offer | New |
| `/projects/ux-ui-design` | Service offer | New |
| `/projects/app-architecture` | Service offer | New |
| `/projects/auto-ops-crm` | Service offer | New |

---

## Navbar Change

`src/components/Navbar.tsx` — change the PROJECTS link `href` from `/projects/hexaia` to `/projects`.

---

## `/projects` — Index Page

### Layout

Two visually distinct blocks separated by labeled section headers.

**Block 1 — CASE STUDIES**  
Full-width card (col-span-12). Background black. Badge `CASE_STUDY` in lime green (`bg-secondary-container text-black`). Shows HexaIA title, one-line description, three key metrics (+210% contacto, -65% tiempo admin, 18%→47% cierre) in a terminal-style row. Arrow CTA to `/projects/hexaia`. Label `PROJECT_ID: 0x48657861` in top-left terminal style.

**Block 2 — SERVICES**  
Section header: `// SERVICIOS_DISPONIBLES`. Grid bento identical to the homepage services bento:
- SERVICE_01 (Web Engineering): col-span-2 row-span-2, dark background, large title — links to `/projects/web-engineering`
- SERVICE_02 (UX/UI System Design): standard card — links to `/projects/ux-ui-design`
- SERVICE_03 (App Architecture): standard card — links to `/projects/app-architecture`
- SERVICE_04 (Auto-Ops & CRM): lime accent card — links to `/projects/auto-ops-crm`

Each service card adds an `arrow_forward` icon and becomes a `<Link>` wrapper. No other change to card content vs the homepage.

---

## Individual Service Pages

### Shared anatomy (matches `hexaia/page.tsx` structure)

1. **Back nav** — `← VOLVER_A_PROYECTOS` linking to `/projects`
2. **Hero section** — `border-y border-black`, 12-col grid:
   - Left (col-span-7): badge row (`SERVICE_0X` + `STATUS: AVAILABLE`), giant title (same 6xl→8xl→10rem size as HEXAIA), tagline paragraph, CTA button `INICIAR PROYECTO →` linking to `/contact`
   - Right (col-span-5): metadata sidebar — stack list, typical duration, delivery type; terminal footer strip (black bg)
3. **Image grid** — 3 placeholder tiles (`bg-surface`), labeled `DELIVERABLE_01/02/03`, same grid as HexaIA mockup section
4. **Detail section** — 12-col grid, sticky left heading + right content:
   - Left: `EL PROCESO` heading + accent bar
   - Right: 3–4 numbered steps (same `border border-black p-6 bg-surface flex gap-6` cards as HexaIA's "La Solución")
5. **"¿Para quién?" grid** — 2×2 grid of use-case cards (`border border-black p-6`)
6. **CTA section** — black bg, large headline, `INICIAR DIAGNÓSTICO` button to `/contact` (identical to HexaIA's bottom CTA)

---

## Content per service page

### Web Engineering (`SERVICE_01`)
- **Title:** WEB ENGINEERING
- **Tagline:** Plataformas de alto rendimiento construidas para escalar, convertir y durar.
- **Sidebar stack:** Next.js · React · TypeScript · Supabase · Node.js · Vercel
- **Sidebar duration:** 4–12 semanas
- **Sidebar delivery:** Código fuente + deploy + documentación técnica
- **Process steps:**
  1. Arquitectura & Planificación — Definición de stack, estructura de datos, integraciones y roadmap técnico detallado.
  2. Diseño de Sistema — Componentes reutilizables, design tokens, sistema de rutas y estructura de API.
  3. Desarrollo & Iteración — Sprints semanales con demos. Frontend, backend y base de datos construidos en paralelo.
  4. QA, Performance & Deploy — Auditoría Lighthouse, optimización Core Web Vitals, CI/CD y lanzamiento.
- **¿Para quién?:** Startups que necesitan MVP sólido / Empresas migrando de plataformas legacy / Productos SaaS B2B / E-commerce de alto volumen

### UX/UI System Design (`SERVICE_02`)
- **Title:** UX/UI SYSTEM DESIGN
- **Tagline:** Interfaces que retienen usuarios. Diseño industrial con precisión funcional.
- **Sidebar stack:** Figma · FigJam · Design Tokens · Framer · Lottie
- **Sidebar duration:** 2–6 semanas
- **Sidebar delivery:** Sistema de diseño + handoff de componentes + prototipo navegable
- **Process steps:**
  1. Research & Discovery — Entrevistas de usuario, análisis competitivo, mapas de journey y definición de métricas de retención.
  2. Arquitectura de Información — Sitemap, flujos de usuario y wireframes de baja fidelidad validados.
  3. Sistema Visual — Design tokens, componentes Figma, grid system y guía tipográfica.
  4. Prototipo & Handoff — Prototipo interactivo navegable, specs de desarrollo y anotaciones de comportamiento.
- **¿Para quién?:** Productos con problemas de retención / Rediseños de plataforma SaaS / Apps móviles pre-desarrollo / Startups pre-seed que necesitan pitch deck visual

### App Architecture (`SERVICE_03`)
- **Title:** APP ARCHITECTURE
- **Tagline:** Apps nativas y cross-platform que funcionan en iOS y Android desde un solo codebase.
- **Sidebar stack:** React Native · Expo · TypeScript · Supabase · Push Notifications
- **Sidebar duration:** 8–16 semanas
- **Sidebar delivery:** App publicada en App Store + Google Play + código fuente
- **Process steps:**
  1. Arquitectura Técnica — Definición de navegación, gestión de estado, estructura de módulos y estrategia de sincronización offline.
  2. Diseño de Pantallas — Componentes nativos adaptados a iOS/Android, sistema de temas y flujos de onboarding.
  3. Desarrollo & Integraciones — Autenticación, base de datos, push notifications, pagos y APIs externas.
  4. Testing & Publicación — Pruebas en dispositivos reales, optimización de performance y submission a ambas stores.
- **¿Para quién?:** Negocios que necesitan app complementaria a su web / MVPs móviles para validar idea / Empresas con procesos internos que requieren app de campo / Startups con tracción que quieren canal móvil

### Auto-Ops & CRM (`SERVICE_04`)
- **Title:** AUTO-OPS & CRM
- **Tagline:** Operaciones que se ejecutan solas. Automatización end-to-end con GoHighLevel y AI.
- **Sidebar stack:** GoHighLevel · Make.com · Zapier · Claude API · WhatsApp API
- **Sidebar duration:** 2–4 semanas
- **Sidebar delivery:** Sistema activo + documentación de flujos + capacitación del equipo
- **Process steps:**
  1. Diagnóstico Operativo — Mapeo de procesos actuales, identificación de fricciones y definición de KPIs a mejorar.
  2. Arquitectura de Automatización — Diseño de flujos, selección de herramientas y configuración del CRM central.
  3. Implementación & Conexión — Construcción de workflows, integraciones de canales (email, WhatsApp, Meta) y triggers.
  4. Activación & Capacitación — Pruebas en vivo, ajuste fino y entrenamiento del equipo en el nuevo sistema.
- **¿Para quién?:** Agencias con alto volumen de leads / Consultoras que pierden prospectos por seguimiento manual / Negocios con procesos repetitivos que consumen tiempo del equipo / Empresas que quieren implementar AI en su operación

---

## File structure to create

```
src/app/projects/
  page.tsx                        ← index (new)
  hexaia/page.tsx                 ← unchanged
  web-engineering/page.tsx        ← new
  ux-ui-design/page.tsx           ← new
  app-architecture/page.tsx       ← new
  auto-ops-crm/page.tsx           ← new
```

Shared layout component `src/components/projects/ServicePage.tsx` accepts props for all variable content so the 4 service pages stay DRY.

---

## Constraints

- No new dependencies. Use existing Framer Motion, Tailwind, Next.js Link/Image.
- All service pages are `'use client'` only if they use `AnimatedBlock` (which is already a client component). Otherwise keep as server components.
- Placeholder image tiles use `bg-surface` with terminal-style labels — no external image URLs needed.
- Active nav state: `/projects/*` should highlight the PROJECTS nav link. Current `pathname === link.href` check needs to change to `pathname.startsWith('/projects')` for the PROJECTS entry.
