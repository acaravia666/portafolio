# Portfolio Revamp — Design Spec

**Fecha:** 2026-07-09
**Autor:** Felipe Caravía (acaravia666) + Claude
**Repo:** portfolio_app (Next.js 16.2.3, React 19, Tailwind 4, Three.js, Framer Motion)

## 1. Objetivo

Elevar el portfolio en **diseño** y **calidad de código** ("exponencialmente"), y convertirlo en un
escaparate de **trabajo real** tomado de GitHub (Hex.Via CMS, IRI5, QR Shirts y más), en vez de
describir servicios en abstracto. Se conserva y pule el ADN visual actual (brutalismo industrial /
terminal, acento lima `#bbe405`) y toda la infraestructura funcional existente (contacto + CRM + email,
chat AI, prisma 3D).

No es un rediseño desde cero: es una evolución + inyección de contenido real + limpieza de arquitectura.

## 2. Decisiones cerradas (fuente de verdad)

| Tema | Decisión |
|---|---|
| Dirección de diseño | **Brutalismo refinado** (evolución del look actual) |
| Identidad de marca | **Felipe Caravía** (personal); `hex.via.sys` como tag/sistema sutil |
| Idioma | Contenido en **español**; labels de nav en inglés (convención actual) |
| Datos de proyectos | **Contenido local tipado** en el repo. Supabase se conserva **solo** para leads |
| Profundidad | **Híbrido**: 3 case studies flagship + grid de vitrina para el resto |
| Proyecto hero | **QR Shirts** como **embed en vivo** en el home |
| Visuals | **Screenshots reales** (sitios públicos) + **IRI5 con tarjeta tipográfica** de fallback (sin screenshots por ahora) |
| Rutas | Separar **`/work`** (proyectos) y **`/services`** (servicios); redirects desde rutas viejas |
| Proveedor de IA | **Provider-agnostic**: Claude por defecto + adaptador OpenAI, elegible por env |
| Prisma 3D | Mantener look iridiscente; optimizar **rendimiento** + **código** + a11y |
| Se mantiene y pule | Prisma 3D · Contacto+CRM+email (GHL/Resend) · Página About · Chat AI |

## 3. Curaduría de proyectos

### Flagship — case study completa en `/work/[slug]`
1. **IRI5** — Plataforma de inteligencia de audiencias (visión AI en el navegador: emociones,
   demografía, seguridad; Face-API.js, YOLOv8n, TensorFlow.js, Supabase multi-tenant).
   → **Tarjeta tipográfica / branded** (sin screenshots; sitio tras login de Vercel).
2. **Hex.Via CMS** — CMS multi-tenant con editor visual sobre el sitio real, RLS, rollback,
   media library, SDK. → Screenshots del landing público (auto).
3. **QR Shirts** — Convierte cualquier camiseta en una página editable vía QR (Next.js, Supabase,
   Zustand, Framer Motion). → Screenshots (auto) **+ embed en vivo** en el home.

### Vitrina — grid con enlace externo (sin página propia)
- **Pops Café** (order & pickup), **Experto Tax & Bookkeeping** (sitio Figma), **CrisisApp**,
  **Shalom Mendieta**, **La Botica Ibarra**.
- Verificar en implementación que cada `liveUrl` responde 200 antes de incluirlo. Excluir los caídos.
- **Excluido:** Irina López (deployment 404).

### Datos de origen
Contenido tomado de los README de cada repo (leídos durante brainstorming) + metadata de GitHub.

## 4. Arquitectura de rutas (IA)

```
/                     Home
/work                 Índice de proyectos reales (3 flagship + grid vitrina)
/work/[slug]          Case study (iri5, hex-via-cms, qr-shirts) desde contenido local
/services             Índice de los 5 servicios
/services/[slug]      Página de servicio (web-engineering, ux-ui-design, app-architecture,
                      auto-ops-crm, consulting) — movidas desde /projects/*
/about                Sobre mí (pulir)
/contact              Contacto: chat AI + formulario + CRM (se mantiene)
```

**Redirects** (en `next.config.ts`):
- `/projects` → `/work`
- `/projects/web-engineering` → `/services/web-engineering` (y las otras 4 análogas)
- `/projects/:slug` (dinámica vieja de Supabase) → `/work/:slug`
- `/projects/hexaia` → `/work` (la case study ficticia se elimina)

**Navbar:** marca `FELIPE CARAVÍA` (con `hex.via.sys` sutil); links `HOME · WORK · SERVICES · ABOUT · CONTACT`.

## 5. Modelo de contenido (local tipado)

`src/content/projects.ts` — reemplaza el fetch a Supabase. Tipos en `src/types/project.ts` (repointados).

```ts
export type ProjectStatus = 'live' | 'wip' | 'archived'

export interface ProjectMetric { label: string; value: string }

export interface Screenshot { src: string; alt: string; device: 'desktop' | 'mobile' }

export interface CaseStudy {
  problem: string
  approach: string
  highlights: string[]
  results?: ProjectMetric[]
}

export interface Project {
  slug: string
  name: string
  tagline: string
  summary: string
  category: string            // 'SaaS' | 'CMS' | 'E-commerce' | 'Sitio cliente' ...
  year: number
  role: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  status: ProjectStatus
  featured: boolean           // flagship → tiene página /work/[slug]
  heroEmbed?: boolean         // se muestra como iframe en vivo en el home (QR Shirts)
  visual: 'screenshot' | 'typographic'   // IRI5 = 'typographic'
  accent?: string             // color de marca para la tarjeta typographic
  screenshots: Screenshot[]   // [] cuando visual === 'typographic'
  caseStudy?: CaseStudy       // presente en flagships
}
```

`src/content/services.ts` — los 5 servicios (data compartida entre home y `/services`), reemplaza los
arrays duplicados en `page.tsx` y `projects/page.tsx`.

**Consumo:** los server components importan el contenido directamente (elimina el anti-patrón de
*self-fetch* a `/api/projects`). Se elimina `src/app/api/projects/route.ts` y el uso de Supabase para
`projects`; Supabase queda solo en `contact` y `webhooks/ghl` (tabla `leads`).

## 6. Screenshots + embed en vivo

### Captura
- Script `scripts/capture-screenshots.mjs` (Playwright + chromium) recorre los proyectos con
  `visual === 'screenshot'` y `liveUrl` público; captura **desktop (1440×900)** y **móvil (390×844)**
  → `public/screenshots/<slug>-desktop.png` / `<slug>-mobile.png`. PNGs versionados en git.
- Dependencias nuevas: `playwright` (dev). Script npm: `"capture": "node scripts/capture-screenshots.mjs"`.
- IRI5 no se captura (visual typographic). Si en el futuro hay imágenes, se dejan en
  `public/screenshots/iri5-*.png` y se cambia su `visual` a `'screenshot'`.

### Componente `LiveEmbed`
- iframe **lazy** (IntersectionObserver: monta el iframe solo al entrar en viewport), con skeleton,
  `sandbox` apropiado, `title` accesible, y overlay "abrir en vivo ↗".
- Usado para **QR Shirts** en el home. Fallback a screenshot si el iframe falla.

## 7. Sistema de diseño (Refined Brutalism)

### Tokens (`globals.css`)
- Conservar paleta: negro/blanco, lima `#bbe405`, secondary `#526600`, error, surface.
- Formalizar superficie oscura (`--color-ink: #0a0a0a`, hoy inline en varios sitios).
- Definir escala tipográfica y de espaciado consistentes (variables + utilidades).
- Fuentes actuales: Noto Serif (headline), Space Grotesk (body), Geist Mono (terminal). Se mantienen.
- Quitar textura externa `transparenttextures.com/carbon-fibre.png` → patrón CSS local o asset propio.

### Componentes nuevos (`src/components/ui` y `src/components/projects`)
- `BrowserFrame` — screenshot en chrome de ventana: borde negro + sombra lima, grayscale→color en hover, label de URL.
- `LiveEmbed` — iframe lazy (sección 6).
- `ProjectCard` — tarjeta de vitrina (usa `BrowserFrame` o variante typographic + meta/stack).
- `FlagshipCard` — teaser grande de case study.
- `SectionHeader` / `Label` — headers `// SECCIÓN` mono (dedupe de markup repetido).
- `TechTag`, `Metric`, `Marquee` (texto scrolling del CTA, hoy inline).

### Motion
- Conservar `AnimatedBlock` + `PageTransition`. Añadir scroll-reveal para el grid de trabajo y micro-interacciones de hover. Respetar `prefers-reduced-motion` (ya soportado en `globals.css`).

## 8. Prisma 3D — mejora (mantener look iridiscente)

Archivo: `src/components/three/HexPrism.tsx` (+ `HexPrismClient`, `HexPrismFallback`).

- **Rendimiento:**
  - Calidad adaptativa con `PerformanceMonitor` / `AdaptiveDpr` (drei): baja `dpr`/samples si cae el FPS.
  - **Pausar el render cuando el canvas está fuera de viewport** (IntersectionObserver); hoy incluso el
    listener de `mousemove` está en `window` global — scoparlo y limpiarlo.
  - Reducir `samples`/`resolution` de `MeshTransmissionMaterial` en móvil / gama baja.
  - Fallback **estático** (imagen/CSS) cuando `prefers-reduced-motion` o dispositivo de baja potencia,
    en vez de renderizar el material pesado.
- **Correctness / A11y:** resolver el conflicto aria (wrapper `aria-hidden` vs `role="img"` interno);
  dejar el canvas decorativo (`aria-hidden`) de forma coherente.
- **Limpieza:** extraer magic numbers a un objeto de config, documentar, separar lighting/materiales si aclara.
- **Colores:** se mantienen (magenta/cyan iridiscente + glow lima). Solo perf/código/a11y.

## 9. Proveedor de IA — provider-agnostic

- Nueva capa `src/lib/ai/` con una interfaz de proveedor:
  - `type ChatMessage`, `streamChat(messages, system)`, `scoreLead(input)`.
  - Adaptador **Anthropic** (por defecto, ya construido) y adaptador **OpenAI** (`openai` SDK).
  - Selección por env `AI_PROVIDER=anthropic|openai`; model IDs por env
    (`ANTHROPIC_MODEL`, `OPENAI_MODEL`) con defaults vigentes.
- Rutas `api/chat/route.ts` (streaming SSE) y `api/contact/route.ts` (scoring) consumen la capa `ai`,
  no el SDK directo.
- **Model IDs:** el código usa `claude-sonnet-4-6` (desactualizado). Al implementar, consultar la skill
  **`claude-api`** para el ID de Claude vigente, y la doc de OpenAI (Context7 `openai`) para el SDK y
  modelo (p. ej. gpt-4o / gpt-4.1-mini). Claude sigue siendo el default operativo hasta que exista API
  key de OpenAI.
- Dependencia nueva: `openai`.
- **Nota importante para el usuario:** una suscripción de ChatGPT **no** habilita la API; para usar
  OpenAI hace falta una **API key** de platform.openai.com (billing por tokens).

## 10. Calidad de código ("exponencial") — checklist

1. Eliminar self-fetch de `/api/projects` en server components → import de contenido local.
2. Deduplicar el bloque de servicios (hoy repetido en `page.tsx` y `projects/page.tsx`) → `services.ts` + componente.
3. Componentizar labels de sección y CTAs repetidos.
4. Capa `ai` provider-agnostic + actualizar model IDs (sección 9).
5. A11y: `title` en iframes, `alt` en imágenes, focus states, `aria` en tarjetas interactivas, arreglo del prisma.
6. Perf: `next/image` para screenshots, quitar textura externa, lazy embed, prisma adaptativo.
7. SEO: metadata por página, OG images (usando screenshots), `sitemap.ts`, `robots`, JSON-LD `Person`.
8. Reemplazar case study ficticia "HEXAIA" por las reales; borrar rutas/artefactos muertos.
9. Tipado: tipos de contenido compartidos; desacoplar del tipo Supabase.

## 11. Fuera de alcance (YAGNI)

- Sin CMS/dashboard para editar proyectos (contenido local).
- Sin blog.
- Sin rediseño total de paleta ni de fuentes.
- Sin reescribir la lógica de CRM/leads (solo pulir UI + capa `ai`).
- No se implementa el proveedor OpenAI "en caliente" sin API key: se deja el adaptador listo y Claude activo.

## 12. Verificación

- `npm run lint`, typecheck (`tsc`), `npm run build` sin errores.
- Correr `npm run dev` y recorrer: Home (hero 3D + embed QR Shirts + selected work), `/work`,
  `/work/[slug]` (los 3), `/services` + un `/services/[slug]`, `/about`, `/contact`.
- Confirmar que **contacto + chat AI siguen funcionando** (no romper el pipeline de leads).
- Correr `npm run capture` y verificar que se generan los screenshots de los sitios públicos.
- Verificar redirects de rutas viejas.
- Revisar rendimiento del prisma (viewport pause + reduced-motion fallback).

## 13. Riesgos / supuestos

- Algún sitio de vitrina puede estar caído al momento de capturar → se excluye (verificar 200 primero).
- Playwright requiere descargar chromium en el entorno de build/local; la captura es un paso manual
  previo al deploy (los PNG quedan versionados), no en runtime.
- El embed en vivo de QR Shirts depende de que el sitio no active `X-Frame-Options` en el futuro
  (hoy no lo hace); fallback a screenshot si cambia.
- Screenshots de IRI5 pendientes del usuario (no bloquea: usa tarjeta typographic).
