# Portfolio Elite — Spec de Diseño de Sistema
**Fecha:** 2026-04-13  
**Proyecto:** HexaIA Portfolio ($10K Level)  
**Stack base:** Next.js 16.2.3 · React 19 · TypeScript · Tailwind v4  
**Deploy target:** Vercel

---

## 1. Visión General

Transformar el portafolio actual (funcional, estático) en una experiencia digital de gama alta que demuestre ingeniería de IA y automatización. El resultado debe percibirse como un sitio de $10K+: backend real, animaciones avanzadas, código limpio y tipado.

**Estrategia de implementación:** Vertical Slices — cada página se completa al 100% (backend + animaciones + código limpio) antes de pasar a la siguiente.

**Orden de sprints:**
1. Home Page
2. Contact Page
3. About + Projects
4. Refactor + Polish global

---

## 2. Arquitectura de Sistema

### 2.1 Capas

```
Frontend (Vercel)          API Routes (Next.js)         Servicios Externos
─────────────────          ────────────────────         ──────────────────
Three.js Prism        →    POST /api/contact        →   Supabase (leads)
Framer Motion         →    POST /api/chat           →   Claude API (streaming)
Tailwind v4           →    GET  /api/projects       →   Supabase (projects)
Terminal Chat UI      →    POST /api/webhooks/ghl   →   GHL API (mock)
```

### 2.2 Principios de arquitectura

- Todos los Route Handlers viven en `src/app/api/`
- Validación de inputs con **Zod** en el edge de cada endpoint
- Supabase client server-side en Server Components; nunca exponer service key al cliente
- Claude API con **prompt caching** en el system prompt del chat (inmutable entre requests)
- GHL integration completamente tipada; las credenciales reales se agregan vía env vars cuando estén disponibles

---

## 3. Base de Datos — Supabase (PostgreSQL)

### 3.1 Tabla: `projects`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL
title       text NOT NULL
description text
tags        text[]
cover_url   text
metadata    jsonb          -- tech_stack, year, client, etc.
featured    boolean DEFAULT false
sort_order  int2 DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### 3.2 Tabla: `leads`
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
name           text NOT NULL
email          text NOT NULL
company        text
message        text
ai_score       int2           -- 0-100, generado por Claude
ai_summary     text           -- resumen del lead en 1 oración
ghl_contact_id text           -- null hasta que GHL esté conectado
status         text DEFAULT 'new'  -- new | contacted | qualified | closed
created_at     timestamptz DEFAULT now()
```

### 3.3 Tabla: `analytics_events`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
event_type  text NOT NULL    -- page_view | chat_start | contact_submit
page        text
session_id  text
metadata    jsonb
created_at  timestamptz DEFAULT now()
```

**Row Level Security:** Habilitado en todas las tablas. Solo el service role key puede escribir desde el servidor. Lectura de `projects` pública (anon key).

---

## 4. API Endpoints

### 4.1 `POST /api/contact`
**Flujo:**
1. Recibe `{ name, email, company, message }` — validado con Zod
2. Claude API evalúa el lead y devuelve `{ score: number, summary: string }` (prompt cacheado)
3. Inserta en `leads` con el score de IA
4. Llama a `createGHLContact()` — mock que loguea y retorna `{ id: 'mock_xxx' }`
5. Retorna `{ success: true, message: string }`

**Lead scoring prompt (system — cacheado):**
> Eres un calificador de leads para un desarrollador senior de IA y automatización. Evalúa el mensaje de contacto y devuelve JSON: `{ score: 0-100, summary: "string" }`. Score alto = proyecto serio con presupuesto. Score bajo = consulta casual.

### 4.2 `POST /api/chat`
**Flujo:**
1. Recibe `{ messages: Message[] }` — array de historial de conversación
2. Construye system prompt con contexto del portafolio (skills, disponibilidad, proyectos) — **cacheado con prompt caching de Anthropic**
3. Stream la respuesta de `claude-sonnet-4-6` via `anthropic.messages.stream()`
4. Retorna `ReadableStream` para consumo en tiempo real desde el frontend

**System prompt del chat (inmutable, cacheado):**
> Eres el asistente digital de Felipe, un experto en IA y automatización con sede en Quito, Ecuador. Respondes preguntas sobre sus skills (GoHighLevel, automatización, UX/UI, Next.js), disponibilidad y proyectos. Eres conciso, técnico y profesional. Si alguien quiere contratar, recomienda que usen el formulario de contacto.

### 4.3 `GET /api/projects`
- Fetch desde Supabase `projects` table, ordenado por `sort_order`
- Cache: `next: { revalidate: 60 }` (ISR — 60 segundos)
- Retorna array tipado de `Project`

### 4.4 `POST /api/webhooks/ghl`
- Endpoint para recibir eventos de GoHighLevel cuando esté conectado
- Verifica firma HMAC del header `X-GHL-Signature` (mock en desarrollo)
- Procesa eventos: `contact.created`, `opportunity.stageChange`
- Actualiza `leads.status` en Supabase según el evento

---

## 5. Sistema de Animaciones

### 5.1 Hero — Prisma Hexagonal (Three.js)

**Razón del cambio:** Prisma hexagonal en lugar de globo — coherente con la identidad "HexaIA".

**Especificaciones:**
```typescript
// Geometría
const geometry = new CylinderGeometry(1.2, 1.2, 2.4, 6)

// Material
const material = new MeshStandardMaterial({
  metalness: 0.95,
  roughness: 0.05,
  envMapIntensity: 1.2,
})

// Aristas en lime
const edges = new EdgesGeometry(geometry)
const lineMaterial = new LineBasicMaterial({ color: '#BBE405' })

// Comportamiento
// - Auto-rotación Y: 0.003 rad/frame
// - Inclinación X fija: 15° (para ver la cara hexagonal superior)
// - Reacción al cursor: lerp hacia mouse XY con factor 0.05
// - Damping/inercia en la rotación
```

**Integración:**
- Componente `HexPrism` cargado con `next/dynamic({ ssr: false })`
- Wrapped en `<Suspense>` con fallback: hexágono SVG estático animado con CSS rotate
- `useReducedMotion` detiene rotación y lerp si el usuario lo prefiere
- Canvas background transparente (flota sobre el layout blanco)
- Iluminación: `AmbientLight(white, 0.5)` + `SpotLight('#BBE405', 2)` desde arriba-izquierda

### 5.2 Page Transitions (Framer Motion)

```typescript
// En layout.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### 5.3 Scroll Assembly Effect

Para bloques de servicios y módulos en About:
```typescript
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}
const itemVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}
// Usado con whileInView + once: true
```

### 5.4 Terminal Typewriter

Hook custom `useTypewriter(text: string, speed: number, delay: number)`:
- Velocidad variable por carácter (más rápido en texto corto)
- Cursor parpadeante CSS `@keyframes blink`
- Aplicado al texto del terminal en Contact y al chat del asistente

### 5.5 Micro-interacciones UI

| Elemento | Comportamiento |
|---|---|
| CTA primario | `whileTap`: translate(2px, 2px) + shadow colapsa — efecto "presionado" |
| Links nav | `::after` scaleX 0→1 con color lime |
| Cards servicio | `whileHover`: border-top lime 2px + ícono desliza 4px |
| Inputs formulario | `:focus-within`: border-bottom 2px lime + label flota (scale 0.8) |
| Links contacto | `group-hover`: ícono desliza 4px derecha + border lime |

**Reglas de performance:**
- Solo animar `transform` y `opacity` (GPU only)
- `will-change: transform` en el canvas del prisma
- Todas las animaciones respetan `prefers-reduced-motion`

---

## 6. Stack Tecnológico Completo

### Dependencias a agregar
```json
{
  "three": "^0.170",
  "@react-three/fiber": "^8",
  "@react-three/drei": "^9",
  "framer-motion": "^11",
  "@supabase/supabase-js": "^2",
  "@anthropic-ai/sdk": "^0.30",
  "zod": "^3"
}
```

### Tipografía
- Noto Serif (ya configurada) — titulares H1-H3, tight leading, negative tracking
- Space Grotesk (ya configurada) — body, UI, labels
- **Geist Mono** (agregar) — exclusivo para el terminal de chat y metadata técnica
- Escala H1: `clamp(4rem, 10vw, 9rem)` para impacto en todas las pantallas

### Variables de entorno requeridas
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
GHL_API_KEY=                    # Vacía hasta tener credenciales
GHL_WEBHOOK_SECRET=             # Para verificar firma HMAC
```

---

## 7. Diseño Visual — Design System (existente, sin cambios)

El `DESIGN.md` en `Design/hexaia_brutalist/` define el sistema. Puntos clave:

- **Paleta:** Negro (#000) + Blanco (#FFF) + Lime (#BBE405)
- **Tipografía:** Serif pesada + monoespaciada fría — tensión intencional
- **Border-radius:** 0px en todo — esquinas 90° siempre
- **Sombras:** Offset hard-edged (4px down, 4px right) en negro o lime. Nunca blur.
- **Grid:** Cuadrícula técnica 32px visible como background (ya implementada con `grid-bg`)
- **Lime como "laser pointer":** Máximo 1-2 puntos de acento lime por pantalla

---

## 8. Calidad de Código & Performance

### TypeScript
- `tsconfig.json`: `"strict": true`
- Tipos Zod inferidos para todos los DTOs de API
- Sin `any` implícitos — ESLint `@typescript-eslint/no-explicit-any: error`

### Estructura de archivos
```
src/
  app/
    api/
      contact/route.ts
      chat/route.ts
      projects/route.ts
      webhooks/ghl/route.ts
    (pages)/
      page.tsx
      about/page.tsx
      contact/page.tsx
      projects/[slug]/page.tsx
    layout.tsx
  components/
    three/
      HexPrism.tsx          -- Three.js canvas (client-only)
      HexPrismFallback.tsx  -- SVG estático
    ui/
      TerminalChat.tsx
      AnimatedBlock.tsx
      PageTransition.tsx
    layout/
      Navbar.tsx
      Footer.tsx
  lib/
    supabase/
      client.ts             -- anon client (browser)
      server.ts             -- service role (server only)
    anthropic/
      client.ts
      prompts.ts            -- system prompts cacheados
    ghl/
      client.ts             -- mock + tipos
      types.ts
  types/
    project.ts
    lead.ts
```

### Core Web Vitals objetivo
- **LCP:** < 2.5s — Three.js cargado lazy, imágenes con `next/image`
- **CLS:** 0 — dimensiones explícitas en todos los media
- **FID/INP:** < 100ms — sin JS blockeante en critical path
- **Performance Lighthouse:** 90+
- **Accessibility:** WCAG 2.1 AA — contraste mínimo 4.5:1, roles ARIA en terminal chat

### Optimización de assets
- `next/image` para todas las imágenes (reemplaza los `<img>` actuales)
- Brotli compresión automática en Vercel
- `next/font` para Geist Mono (ya usado para Noto Serif y Space Grotesk)
- Bundle analysis con `@next/bundle-analyzer` en Sprint 4

---

## 9. Accesibilidad (WCAG 2.1 AA)

- Contraste monocromático: negro sobre blanco = 21:1 ✓, lime (#BBE405) sobre negro = 8.5:1 ✓
- El terminal de chat tiene `role="log"` y `aria-live="polite"` para lectores de pantalla
- El canvas Three.js tiene `aria-label="Prisma hexagonal decorativo, HexaIA"` y `aria-hidden` en su contenedor visual
- Navegación por teclado completa — focus visible con outline lime 2px
- Animaciones desactivables via `prefers-reduced-motion`

---

## 10. Scope fuera de este diseño

- Internacionalización (i18n) — portafolio en español únicamente
- Dashboard de admin para gestionar proyectos — Supabase Studio es suficiente
- Tests automatizados — fuera de scope (portafolio personal)
- Pagos o e-commerce
- Blog/CMS de artículos
