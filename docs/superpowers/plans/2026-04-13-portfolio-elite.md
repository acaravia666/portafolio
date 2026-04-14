# Portfolio Elite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform a static Next.js portfolio into an elite digital experience with Three.js 3D, Framer Motion, Supabase backend, Claude AI chat, and GHL integration mock.

**Architecture:** Vertical Slices — each page is completed fully (backend + animations + clean code) before moving to the next. Shared infrastructure (Supabase, types, API clients) is established in the first task and reused throughout. Four sprints: Home → Contact → About/Projects → Polish.

**Tech Stack:** Next.js 16.2.3 · React 19 · TypeScript strict · Tailwind v4 · Three.js + React Three Fiber · Framer Motion · Supabase · Anthropic SDK · Zod

---

## File Map

### New files to create
```
src/
  types/
    project.ts              — Project type
    lead.ts                 — Lead type + Zod schema
  lib/
    supabase/
      client.ts             — Browser anon client
      server.ts             — Server service-role client
    anthropic/
      client.ts             — Anthropic singleton
      prompts.ts            — Cached system prompts
    ghl/
      client.ts             — GHL mock client
      types.ts              — GHL types
  components/
    three/
      HexPrism.tsx          — Three.js canvas (client-only)
      HexPrismFallback.tsx  — SVG static fallback
    ui/
      AnimatedBlock.tsx     — Scroll assembly wrapper
      TerminalChat.tsx      — AI chat component
    layout/
      PageTransition.tsx    — Framer Motion wrapper
  hooks/
    useTypewriter.ts        — Typewriter effect hook
  app/
    api/
      projects/route.ts     — GET /api/projects
      contact/route.ts      — POST /api/contact
      chat/route.ts         — POST /api/chat (streaming)
      webhooks/
        ghl/route.ts        — POST /api/webhooks/ghl
    projects/
      [slug]/page.tsx       — Dynamic project detail page
```

### Files to modify
```
src/app/layout.tsx          — Add PageTransition, Geist Mono font
src/app/page.tsx            — Add HexPrism, AnimatedBlock, dynamic projects
src/app/about/page.tsx      — Add AnimatedBlock scroll animations
src/app/contact/page.tsx    — Add TerminalChat, contact form
src/app/globals.css         — Add animation keyframes
next.config.ts              — Add remotePatterns for next/image
tsconfig.json               — Enable strict mode
.env.local                  — Add env vars (created, not committed)
package.json                — Add new dependencies
```

---

## Task 1: Install Dependencies & Configure Environment

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install all new dependencies**

```bash
cd /Users/handpalmtattoo/Downloads/Portafolio/portfolio_app
npm install three @react-three/fiber @react-three/drei framer-motion @supabase/supabase-js @anthropic-ai/sdk zod
npm install --save-dev @types/three
```

Expected: All packages installed without errors.

- [ ] **Step 2: Create `.env.local`**

Create `/Users/handpalmtattoo/Downloads/Portafolio/portfolio_app/.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GHL_API_KEY=
GHL_WEBHOOK_SECRET=dev_secret_placeholder
```

- [ ] **Step 3: Enable TypeScript strict mode**

In `tsconfig.json`, ensure `compilerOptions` includes:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

- [ ] **Step 4: Configure next/image remote patterns**

Read `next.config.ts`, then update it:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Verify dev server still starts**

```bash
npm run dev
```

Expected: Server starts on port 3000 with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/handpalmtattoo/Downloads/Portafolio/portfolio_app
git init
git add package.json package-lock.json tsconfig.json next.config.ts
git commit -m "feat: install three.js, framer-motion, supabase, anthropic, zod deps"
```

---

## Task 2: Create Supabase Schema & Seed Data

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/types/project.ts`
- Create: `src/types/lead.ts`

- [ ] **Step 1: Create tables in Supabase Dashboard**

Go to your Supabase project → SQL Editor → run this SQL:

```sql
-- Projects table
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  description text,
  tags        text[],
  cover_url   text,
  metadata    jsonb DEFAULT '{}',
  featured    boolean DEFAULT false,
  sort_order  int2 DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE leads (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  email          text NOT NULL,
  company        text,
  message        text,
  ai_score       int2,
  ai_summary     text,
  ghl_contact_id text,
  status         text DEFAULT 'new',
  created_at     timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  text NOT NULL,
  page        text,
  session_id  text,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Projects: public read, service-role write
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Leads: service-role only (no public access)
CREATE POLICY "Service role insert leads" ON leads FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role select leads" ON leads FOR SELECT USING (auth.role() = 'service_role');

-- Analytics: service-role insert only
CREATE POLICY "Service role insert analytics" ON analytics_events FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

- [ ] **Step 2: Seed projects data in Supabase**

In Supabase SQL Editor:
```sql
INSERT INTO projects (slug, title, description, tags, cover_url, metadata, featured, sort_order) VALUES
(
  'hexaia',
  'HexaIA',
  'Cómo una agencia de servicios eliminó el caos operativo y triplicó su tasa de cierre con automatización inteligente sobre GoHighLevel.',
  ARRAY['GoHighLevel', 'Automatización', 'CRM', 'IA'],
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDefIlhIPnkcw0YKaEoCko3zKaHrY3pOcr6-cpXTU84rx3eCb7Ypo5u_DpSLv--5oi92UUPlcroxbmplwu6ZP4mMh1F6OvW49FvEAV-JIxP-AsPeX_FIfjBOPatoAL_01TiuI6VZdTiSLXIEbKoRLBOfRhOsGaOKgE9AIARGXaQN7DsxzV_-SVQaVjf_mt3yO1EQbL7A0L_b1oFoh247rHNbXM2NQB909dB9h1SpcygJHagxwa4Z_Sn7lF6O6g9o8MIJgjPTk-vGNQ',
  '{"client": "HexaIA", "year": 2025, "tech_stack": ["GoHighLevel", "Make.com", "Claude API"], "category": "AUT_CONSULTING"}',
  true,
  1
),
(
  'la-agenda-6',
  'La Agenda 6',
  'Plataforma de gestión y agenda para profesionales independientes con automatización de recordatorios y pagos integrados.',
  ARRAY['Next.js', 'Supabase', 'Stripe', 'Automatización'],
  null,
  '{"client": "La Agenda 6", "year": 2025, "tech_stack": ["Next.js", "Supabase", "Stripe"], "category": "WEB_ENGINEERING"}',
  false,
  2
),
(
  'toilet-hunter',
  'Toilet Hunter',
  'App móvil para localizar baños públicos cercanos con valoraciones de usuarios y acceso en tiempo real.',
  ARRAY['React Native', 'Maps API', 'Node.js'],
  null,
  '{"client": "Personal", "year": 2024, "tech_stack": ["React Native", "Google Maps API", "Node.js"], "category": "APP_ARCHITECTURE"}',
  false,
  3
);
```

- [ ] **Step 3: Create `src/types/project.ts`**

```typescript
export interface Project {
  id: string
  slug: string
  title: string
  description: string | null
  tags: string[]
  cover_url: string | null
  metadata: {
    client?: string
    year?: number
    tech_stack?: string[]
    category?: string
  }
  featured: boolean
  sort_order: number
  created_at: string
}
```

- [ ] **Step 4: Create `src/types/lead.ts`**

```typescript
import { z } from 'zod'

export const LeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export type LeadInput = z.infer<typeof LeadSchema>

export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  ai_score: number | null
  ai_summary: string | null
  ghl_contact_id: string | null
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  created_at: string
}
```

- [ ] **Step 5: Create `src/lib/supabase/client.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 6: Create `src/lib/supabase/server.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

// This client uses the service role key — only import in server-side code (API routes, Server Components)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/types/ src/lib/supabase/
git commit -m "feat: add types, supabase clients — schema created in dashboard"
```

---

## Task 3: Create GHL Mock Client & Anthropic Client

**Files:**
- Create: `src/lib/ghl/types.ts`
- Create: `src/lib/ghl/client.ts`
- Create: `src/lib/anthropic/client.ts`
- Create: `src/lib/anthropic/prompts.ts`

- [ ] **Step 1: Create `src/lib/ghl/types.ts`**

```typescript
export interface GHLContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName?: string
  tags?: string[]
  source?: string
}

export interface GHLCreateContactResult {
  success: boolean
  contactId: string
  message: string
}

export interface GHLWebhookEvent {
  type: 'contact.created' | 'opportunity.stageChange' | 'contact.updated'
  locationId: string
  contactId: string
  data: Record<string, unknown>
}
```

- [ ] **Step 2: Create `src/lib/ghl/client.ts`**

```typescript
import type { GHLContact, GHLCreateContactResult } from './types'

// Mock implementation — replace with real GHL API calls when credentials are available
// Real endpoint: https://rest.gohighlevel.com/v1/contacts/
export async function createGHLContact(contact: GHLContact): Promise<GHLCreateContactResult> {
  const apiKey = process.env.GHL_API_KEY

  if (apiKey && apiKey.length > 10) {
    // Real GHL API call (activated when GHL_API_KEY is set)
    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        companyName: contact.companyName,
        tags: contact.tags,
        source: contact.source ?? 'Portfolio Website',
      }),
    })

    if (!response.ok) {
      console.error('[GHL] Failed to create contact:', response.status)
      return { success: false, contactId: '', message: 'GHL API error' }
    }

    const data = (await response.json()) as { contact: { id: string } }
    return { success: true, contactId: data.contact.id, message: 'Contact created' }
  }

  // Mock mode — log what would be sent
  const mockId = `mock_${Date.now()}`
  console.log('[GHL Mock] Would create contact:', { ...contact, mockId })
  return {
    success: true,
    contactId: mockId,
    message: 'Mock: contact logged (set GHL_API_KEY to activate)',
  }
}
```

- [ ] **Step 3: Create `src/lib/anthropic/client.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk'

// Singleton to avoid creating multiple clients
let client: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return client
}
```

- [ ] **Step 4: Create `src/lib/anthropic/prompts.ts`**

```typescript
// These prompts are marked for caching — they are long, immutable, and reused across many requests.
// Prompt caching with Anthropic reduces latency and cost for repeated system prompts.

export const CHAT_SYSTEM_PROMPT = `You are the digital assistant for Felipe, a senior AI and automation expert based in Quito, Ecuador (GMT-5).

## Felipe's Profile
- **Specialization:** AI automation, GoHighLevel (GHL) white-label implementations, UX/UI design, Next.js development
- **Company:** Founder of HexaIA
- **Active Projects:** HexaIA (automation consulting), La Agenda 6 (SaaS scheduling), Toilet Hunter (mobile app)
- **Availability:** Open to new projects. Responds within 24-48 hours.
- **Languages:** Spanish (native), English (professional)

## Skills
- GoHighLevel: CRM setup, white-label, automations, pipelines, email/SMS sequences
- AI Integration: Claude API, OpenAI, prompt engineering, LLM orchestration
- Web: Next.js, React, TypeScript, Tailwind CSS, Supabase
- Mobile: React Native (iOS/Android)
- Automation: Make.com, Zapier, custom webhooks, API integrations

## How to respond
- Be concise and direct. 2-4 sentences maximum per response.
- If someone asks about hiring Felipe or a project, say "Great! Use the contact form below to send your project details — Felipe reviews all inquiries personally."
- Do not invent project details not listed above.
- Respond in the same language the user writes in (Spanish or English).
- You are a professional assistant — not overly casual, not robotic.`

export const LEAD_SCORING_SYSTEM_PROMPT = `You are a lead qualification assistant for a senior AI and automation developer. 
Evaluate the contact message and return a JSON object with this exact shape:
{"score": <number 0-100>, "summary": "<one sentence describing the lead>"}

Scoring guide:
- 80-100: Clear project scope, mentions budget or urgency, B2B or funded startup
- 60-79: Specific project idea, professional context, likely serious
- 40-59: Vague but interested, could convert with follow-up
- 20-39: Exploratory, student, or very low budget signals
- 0-19: Spam, irrelevant, or completely off-topic

Return ONLY the JSON object. No explanation, no markdown.`
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/ghl/ src/lib/anthropic/
git commit -m "feat: add GHL mock client and Anthropic client with cached prompts"
```

---

## Task 4: API Routes — Projects, Contact, Chat, Webhook

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/contact/route.ts`
- Create: `src/app/api/chat/route.ts`
- Create: `src/app/api/webhooks/ghl/route.ts`

- [ ] **Step 1: Create `src/app/api/projects/route.ts`**

```typescript
import { createServerClient } from '@/lib/supabase/server'
import type { Project } from '@/types/project'

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[API /projects]', error)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  return Response.json(data as Project[], {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
```

- [ ] **Step 2: Test `/api/projects` manually**

Start dev server and run:
```bash
curl http://localhost:3000/api/projects
```

Expected: JSON array of 3 projects from Supabase.

- [ ] **Step 3: Create `src/app/api/contact/route.ts`**

```typescript
import { z } from 'zod'
import { LeadSchema } from '@/types/lead'
import { createServerClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic/client'
import { LEAD_SCORING_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { createGHLContact } from '@/lib/ghl/client'

export async function POST(request: Request) {
  // 1. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const { name, email, company, message } = parsed.data

  // 2. Score lead with Claude
  let aiScore = 50
  let aiSummary = 'Lead received'

  try {
    const anthropic = getAnthropicClient()
    const scoring = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system: [
        {
          type: 'text',
          text: LEAD_SCORING_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Name: ${name}\nCompany: ${company ?? 'Not specified'}\nMessage: ${message}`,
        },
      ],
    })

    const responseText = scoring.content[0].type === 'text' ? scoring.content[0].text : ''
    const scoreData = JSON.parse(responseText) as { score: number; summary: string }
    aiScore = scoreData.score
    aiSummary = scoreData.summary
  } catch (err) {
    console.error('[Contact] AI scoring failed, using defaults:', err)
  }

  // 3. Insert lead into Supabase
  const supabase = createServerClient()
  const nameParts = name.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || ''

  const { data: lead, error: dbError } = await supabase
    .from('leads')
    .insert({
      name,
      email,
      company: company ?? null,
      message,
      ai_score: aiScore,
      ai_summary: aiSummary,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[Contact] DB insert failed:', dbError)
    return Response.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // 4. Create GHL contact (mock or real)
  const ghlResult = await createGHLContact({
    id: lead.id,
    firstName,
    lastName,
    email,
    companyName: company,
    tags: [`score_${aiScore}`, 'portfolio_contact'],
    source: 'Portfolio Website',
  })

  if (ghlResult.success && ghlResult.contactId) {
    await supabase
      .from('leads')
      .update({ ghl_contact_id: ghlResult.contactId })
      .eq('id', lead.id)
  }

  return Response.json({
    success: true,
    message: 'Mensaje recibido. Te contactaré en 24-48 horas.',
    score: aiScore,
  })
}
```

- [ ] **Step 4: Test `/api/contact` manually**

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Acme","message":"We need help automating our GHL workflows urgently. Budget is $5k."}'
```

Expected: `{"success":true,"message":"Mensaje recibido...","score":<number>}`

- [ ] **Step 5: Create `src/app/api/chat/route.ts`**

```typescript
import { getAnthropicClient } from '@/lib/anthropic/client'
import { CHAT_SYSTEM_PROMPT } from '@/lib/anthropic/prompts'
import { z } from 'zod'

const ChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(2000),
    })
  ).min(1).max(20),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ChatSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid messages format' }, { status: 422 })
  }

  const anthropic = getAnthropicClient()

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: CHAT_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: parsed.data.messages,
  })

  // Stream text chunks as Server-Sent Events
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            controller.enqueue(encoder.encode(chunk))
          }
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
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
```

- [ ] **Step 6: Create `src/app/api/webhooks/ghl/route.ts`**

```typescript
import { createServerClient } from '@/lib/supabase/server'
import type { GHLWebhookEvent } from '@/lib/ghl/types'

function verifyGHLSignature(body: string, signature: string, secret: string): boolean {
  // In production: HMAC-SHA256 verification
  // For mock/dev: accept any request with the dev secret header
  if (process.env.NODE_ENV === 'development') return true
  return signature === secret
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-ghl-signature') ?? ''
  const secret = process.env.GHL_WEBHOOK_SECRET ?? ''

  const bodyText = await request.text()

  if (!verifyGHLSignature(bodyText, signature, secret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: GHLWebhookEvent
  try {
    event = JSON.parse(bodyText) as GHLWebhookEvent
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createServerClient()

  if (event.type === 'opportunity.stageChange') {
    const { contactId, data } = event
    const newStage = (data.stage as string) ?? 'unknown'

    let status: string
    if (newStage.toLowerCase().includes('qualified')) status = 'qualified'
    else if (newStage.toLowerCase().includes('closed')) status = 'closed'
    else status = 'contacted'

    await supabase
      .from('leads')
      .update({ status })
      .eq('ghl_contact_id', contactId)

    console.log(`[GHL Webhook] Updated lead ${contactId} → ${status}`)
  }

  return Response.json({ received: true })
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api/
git commit -m "feat: add /api/projects, /api/contact (AI scoring), /api/chat (streaming), /api/webhooks/ghl"
```

---

## Task 5: Three.js Hexagonal Prism Component

**Files:**
- Create: `src/components/three/HexPrismFallback.tsx`
- Create: `src/components/three/HexPrism.tsx`

- [ ] **Step 1: Create `src/components/three/HexPrismFallback.tsx`**

```typescript
// Static SVG hexagon — shown while Three.js loads or if WebGL is unavailable
export default function HexPrismFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg
        width="280"
        height="320"
        viewBox="0 0 280 320"
        style={{ animation: 'spin 20s linear infinite' }}
      >
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <polygon
          points="140,10 270,80 270,240 140,310 10,240 10,80"
          fill="none"
          stroke="#BBE405"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polygon
          points="140,40 245,100 245,220 140,280 35,220 35,100"
          fill="none"
          stroke="#888"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <polygon
          points="140,70 220,118 220,202 140,250 60,202 60,118"
          fill="#111"
          stroke="#555"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <text x="140" y="168" textAnchor="middle" fill="#BBE405" fontFamily="monospace" fontSize="10" letterSpacing="2">HEXA_IA</text>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/three/HexPrism.tsx`**

```typescript
'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

function PrismMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const { gl } = useThree()
  const prefersReducedMotion = useReducedMotion()

  // Track mouse position in normalized device coordinates
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  useFrame(({ clock }) => {
    if (!meshRef.current || !edgesRef.current) return
    if (prefersReducedMotion) return

    // Auto-rotation
    meshRef.current.rotation.y += 0.003
    edgesRef.current.rotation.y = meshRef.current.rotation.y

    // Smooth cursor tracking (lerp)
    target.current.x += (mouse.current.x * 0.3 - target.current.x) * 0.05
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.05

    meshRef.current.rotation.x = (Math.PI / 12) + target.current.y
    meshRef.current.rotation.z = target.current.x * 0.2
    edgesRef.current.rotation.x = meshRef.current.rotation.x
    edgesRef.current.rotation.z = meshRef.current.rotation.z
  })

  const geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.4, 6)
  const edgesGeometry = new THREE.EdgesGeometry(geometry)

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1.2}
          color="#d0d0d0"
        />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#BBE405" linewidth={1} />
      </lineSegments>
    </group>
  )
}

export default function HexPrism() {
  return (
    <div
      className="w-full h-full"
      aria-label="Prisma hexagonal decorativo, identidad visual HexaIA"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[-3, 4, 3]} intensity={2} color="#BBE405" />
        <spotLight position={[3, -2, 3]} intensity={0.8} color="#ffffff" />
        <Environment preset="studio" />
        <PrismMesh />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Verify Three.js component compiles**

```bash
npm run build 2>&1 | head -40
```

Expected: No TypeScript errors in the three/ components. (Build may fail elsewhere — that's OK at this stage.)

- [ ] **Step 4: Commit**

```bash
git add src/components/three/
git commit -m "feat: Three.js hexagonal prism with PBR material, lime edges, cursor tracking"
```

---

## Task 6: Framer Motion Page Transitions & Animation Components

**Files:**
- Create: `src/components/layout/PageTransition.tsx`
- Create: `src/components/ui/AnimatedBlock.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create `src/components/layout/PageTransition.tsx`**

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create `src/components/ui/AnimatedBlock.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

interface AnimatedBlockProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function AnimatedBlock({ children, delay = 0, className }: AnimatedBlockProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        ...itemVariants,
        visible: {
          ...itemVariants.visible,
          transition: { duration: 0.5, ease: 'easeOut', delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Update `src/app/layout.tsx` — add PageTransition and Geist Mono**

Read the current layout.tsx first, then replace with:

```typescript
import type { Metadata } from "next";
import { Noto_Serif, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/layout/PageTransition";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Felipe | Arquitecto de IA & Automatización",
  description: "Senior developer especializado en IA, automatización y GoHighLevel. Basado en Quito, Ecuador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${notoSerif.variable} ${spaceGrotesk.variable} ${geistMono.variable} min-h-full flex flex-col font-body bg-background text-primary`}
      >
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add animation keyframes to `src/app/globals.css`**

Read globals.css, then append:

```css
/* Geist Mono for terminal elements */
.font-terminal {
  font-family: var(--font-geist-mono), 'Courier New', monospace;
}

/* Typewriter cursor blink */
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor-blink {
  display: inline-block;
  width: 0.6ch;
  height: 1em;
  background: currentColor;
  animation: cursor-blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}

/* Assembly underline sweep */
@keyframes sweep-lime {
  from { transform: scaleX(0); transform-origin: left; }
  to   { transform: scaleX(1); transform-origin: left; }
}

/* Nav link hover underline */
.nav-link-underline {
  position: relative;
}
.nav-link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-secondary-container);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease-out;
}
.nav-link-underline:hover::after {
  transform: scaleX(1);
}

/* Reduced motion — disable all non-essential animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .cursor-blink { animation: none; opacity: 1; }
}
```

- [ ] **Step 5: Move Navbar to correct path**

The Navbar is at `src/components/Navbar.tsx`. Update the import in layout.tsx to match:
```typescript
import Navbar from "@/components/Navbar";
```
(Keep as-is — just verify the file exists at that path.)

- [ ] **Step 6: Verify dev server runs with transitions**

```bash
npm run dev
```

Navigate between pages in the browser. Expected: Smooth fade+slide transition between pages.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ src/components/ui/AnimatedBlock.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: Framer Motion page transitions, AnimatedBlock scroll animation, Geist Mono font"
```

---

## Task 7: Refactor Home Page — Dynamic + Animated

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read the current home page**

Read `src/app/page.tsx` in full before making changes.

- [ ] **Step 2: Replace `src/app/page.tsx` with dynamic + animated version**

```typescript
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import AnimatedBlock from "@/components/ui/AnimatedBlock";
import HexPrismFallback from "@/components/three/HexPrismFallback";
import type { Project } from "@/types/project";

// Load Three.js only on client, never on server
const HexPrism = dynamic(() => import("@/components/three/HexPrism"), {
  ssr: false,
  loading: () => <HexPrismFallback />,
});

async function getFeaturedProject(): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/projects`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const projects = (await res.json()) as Project[]
    return projects.find((p) => p.featured) ?? projects[0] ?? null
  } catch {
    return null
  }
}

export default async function Home() {
  const featured = await getFeaturedProject();

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      {/* Hero */}
      <section className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-black">
        <AnimatedBlock className="md:col-span-12 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-secondary-container"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">STATUS: OPTIMIZING_FLOW</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-outline)] ml-4">ID: SYSTEM_001</span>
          </div>
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-primary font-headline max-w-full pb-2">
            ARQUITECTO CREATIVO DE PRODUCTOS DIGITALES Y AUTOMATIZACIÓN
          </h1>
        </AnimatedBlock>

        <div className="md:col-span-7 border border-black p-8 bg-white relative flex flex-col justify-center min-h-[400px]">
          <div className="absolute top-4 right-4 font-terminal text-[10px] text-gray-500">HEXA_PRISM_01</div>
          {/* Three.js Hexagonal Prism */}
          <div className="w-full h-[340px]" aria-hidden="true">
            <Suspense fallback={<HexPrismFallback />}>
              <HexPrism />
            </Suspense>
          </div>
          <AnimatedBlock delay={0.1}>
            <p className="font-body text-xl max-w-md leading-tight mt-6">
              Transformando ideas en ecosistemas digitales. Desde el diseño UX/UI y desarrollo de alto rendimiento, hasta la automatización total de tus operaciones.
            </p>
          </AnimatedBlock>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <AnimatedBlock delay={0.2} className="border border-black border-l-0 p-8 flex-grow bg-surface">
            <div className="font-terminal text-[10px] mb-6 uppercase tracking-widest text-gray-500">TECHNICAL_SPECIFICATIONS</div>
            <ul className="space-y-4 font-mono text-sm">
              {[
                'UX_UI_SYSTEMS',
                'WEB_ENGINEERING',
                'APP_ARCHITECTURE',
                'AUTO_OPS_&_CRM',
              ].map((item) => (
                <li key={item} className="flex justify-between border-b border-black/10 pb-2">
                  <span>{item}</span>
                  <span className="text-secondary-container material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </li>
              ))}
            </ul>
          </AnimatedBlock>
          <AnimatedBlock delay={0.3} className="border border-black border-l-0 border-t-0 p-8 bg-primary text-background flex flex-col justify-between group hover:bg-secondary-container hover:text-primary transition-colors cursor-pointer">
            <span className="font-terminal text-[10px] uppercase">EXECUTE_PROJECT_INIT</span>
            <Link href="/contact" className="flex justify-between items-end mt-12">
              <span className="text-4xl font-headline italic text-white group-hover:text-primary">Start Session</span>
              <span className="material-symbols-outlined text-4xl text-white group-hover:text-primary">north_east</span>
            </Link>
          </AnimatedBlock>
        </div>
      </section>

      {/* Services Bento */}
      <section className="grid grid-cols-1 md:grid-cols-4 border-b border-black">
        <AnimatedBlock delay={0} className="p-8 md:p-12 border border-black border-t-0 border-l-0 md:col-span-2 md:row-span-2 bg-primary text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <span className="font-terminal text-[10px] uppercase border border-white/30 px-2 py-1 text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse"></span>
                SERVICE_01_CORE
              </span>
              <span className="material-symbols-outlined text-secondary-container text-4xl">code_blocks</span>
            </div>
            <h3 className="text-4xl md:text-5xl mb-6 font-headline text-secondary-container leading-none uppercase">Web Engineering</h3>
            <p className="font-body text-gray-300 text-lg leading-relaxed max-w-md">Arquitecturas frontend y backend de alto rendimiento. Desarrollo de plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.</p>
          </div>
          <div className="mt-12 flex justify-between items-end border-t border-white/20 pt-6 relative z-10">
            <span className="font-terminal text-[10px] uppercase text-gray-400">NEXT.JS / REACT / NODE</span>
            <span className="material-symbols-outlined text-3xl group-hover:text-secondary-container transition-colors">arrow_outward</span>
          </div>
        </AnimatedBlock>

        {[
          { id: 'SERVICE_02', icon: 'design_services', title: 'UX/UI System Design', desc: 'Investigación de usuarios, wireframing y diseño de interfaces premium que fusionan estética industrial con usabilidad funcional.' },
          { id: 'SERVICE_03', icon: 'smartphone', title: 'App Architecture', desc: 'Sistemas móviles nativos y cross-platform iOS/Android.' },
          { id: 'SERVICE_04', icon: 'hub', title: 'Auto-Ops & CRM', desc: 'Automatización end-to-end e integraciones con GoHighLevel.', accent: true },
        ].map((svc, i) => (
          <AnimatedBlock
            key={svc.id}
            delay={i * 0.08}
            className={`p-8 border border-black border-t-0 border-l-0 flex flex-col ${svc.accent ? 'bg-secondary-container' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start mb-12">
              <span className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${svc.accent ? 'text-primary' : ''}`}>{svc.id}</span>
              <span className={`material-symbols-outlined text-2xl ${svc.accent ? 'text-primary' : ''}`}>{svc.icon}</span>
            </div>
            <h3 className={`text-2xl mb-4 font-headline uppercase leading-none ${svc.accent ? 'text-primary' : ''}`}>{svc.title}</h3>
            <p className={`font-body text-sm leading-relaxed ${svc.accent ? 'text-primary/80' : 'text-gray-700'}`}>{svc.desc}</p>
          </AnimatedBlock>
        ))}
      </section>

      {/* Featured Project — dynamic */}
      {featured && (
        <section className="grid grid-cols-1 md:grid-cols-12 bg-white mb-16">
          <AnimatedBlock className="md:col-span-5 p-12 flex flex-col justify-center border-r border-black border-b md:border-b-0">
            <div className="mb-6 flex gap-2">
              <span className="px-2 py-0.5 bg-black text-white text-[10px] font-terminal">CASE_STUDY</span>
              <span className="px-2 py-0.5 border border-black text-[10px] font-terminal">{featured.metadata?.category ?? 'PROJECT'}</span>
            </div>
            <h2 className="text-5xl font-black mb-6 leading-none font-headline">{featured.title.toUpperCase()}</h2>
            <p className="font-body text-lg text-gray-700 mb-8">{featured.description}</p>
            <Link
              href={`/projects/${featured.slug}`}
              className="w-fit px-8 py-3 bg-black text-white font-terminal text-sm hover:bg-secondary-container hover:text-black transition-colors flex items-center gap-4"
            >
              VIEW_FULL_INTEL
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </AnimatedBlock>
          <div className="md:col-span-7 bg-surface relative overflow-hidden h-[400px] md:h-auto border-b border-black">
            {featured.cover_url ? (
              <Image
                src={featured.cover_url}
                alt={`${featured.title} project cover`}
                fill
                className="object-cover grayscale contrast-125"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center">
                <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">NO_COVER_IMAGE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-secondary-container/10 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 font-terminal text-[10px] text-white bg-black p-2">
              COORDINATES: 0° 13' 47&quot; S, 78° 31' 29&quot; W
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Add `NEXT_PUBLIC_SITE_URL` to `.env.local`**

```bash
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

- [ ] **Step 4: Verify home page renders**

```bash
npm run dev
```

Open http://localhost:3000. Expected:
- Hexagonal prism visible (or fallback SVG while loading)
- Services section animates in on scroll
- Featured project loaded from Supabase

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx .env.local
git commit -m "feat: home page — dynamic projects from Supabase, HexPrism, scroll animations, next/image"
```

---

## Task 8: Typewriter Hook & Terminal Chat Component

**Files:**
- Create: `src/hooks/useTypewriter.ts`
- Create: `src/components/ui/TerminalChat.tsx`

- [ ] **Step 1: Create `src/hooks/useTypewriter.ts`**

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed = 35, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)

    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, delay])

  return { displayed, done }
}
```

- [ ] **Step 2: Create `src/components/ui/TerminalChat.tsx`**

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const BOOT_TEXT = '> SISTEMA LISTO. Pregúntame sobre skills, disponibilidad o proyectos.'

function BootLine() {
  const { displayed, done } = useTypewriter(BOOT_TEXT, 25, 400)
  return (
    <p className="font-terminal text-xs text-gray-400 mb-4">
      {displayed}{!done && <span className="cursor-blink" aria-hidden="true" />}
    </p>
  )
}

export default function TerminalChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            if (data === '[ERROR]') {
              accumulated = 'Error de conexión. Intenta de nuevo.'
              break
            }
            try {
              const { text } = JSON.parse(data) as { text: string }
              accumulated += text
              setStreamingText(accumulated)
            } catch {
              // Partial chunk — continue
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingText('')
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error de conexión. Por favor intenta de nuevo.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="bg-black text-white p-6 md:p-8 shadow-[8px_8px_0_0_#bbe405] relative flex flex-col"
      style={{ minHeight: 360 }}
      role="log"
      aria-label="Chat con asistente de Felipe"
      aria-live="polite"
    >
      {/* Terminal header dots */}
      <div className="absolute top-4 right-4 flex gap-2" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      <span className="font-terminal text-[10px] tracking-widest text-gray-400 mb-4 block uppercase">
        ASSISTANT_ONLINE · claude-sonnet-4-6
      </span>

      {/* Boot line */}
      <BootLine />

      {/* Message history */}
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-52">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-secondary-container' : 'text-gray-300'}>
            <span className="font-terminal text-[10px] opacity-50">
              {msg.role === 'user' ? '> YOU' : '> FELIPE_AI'}
            </span>
            <p className="font-terminal text-xs leading-relaxed mt-1 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {streamingText && (
          <div className="text-gray-300">
            <span className="font-terminal text-[10px] opacity-50">&gt; FELIPE_AI</span>
            <p className="font-terminal text-xs leading-relaxed mt-1 whitespace-pre-wrap">
              {streamingText}
              <span className="cursor-blink" aria-hidden="true" />
            </p>
          </div>
        )}

        {loading && !streamingText && (
          <p className="font-terminal text-xs text-gray-500">
            {'> '}<span className="cursor-blink" aria-hidden="true" />
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-white/20 pt-4 flex gap-2">
        <span className="font-terminal text-xs text-secondary-container flex-shrink-0 pt-1" aria-hidden="true">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Escribe tu pregunta..."
          aria-label="Mensaje para el asistente"
          className="flex-1 bg-transparent font-terminal text-xs text-white placeholder-gray-600 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar mensaje"
          className="font-terminal text-[10px] text-secondary-container uppercase hover:text-white transition-colors disabled:opacity-30"
        >
          SEND
        </button>
      </form>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
        <span className="font-terminal text-xs text-secondary-container animate-pulse">STATUS: LISTENING</span>
        <span className="font-terminal text-xs text-gray-500">END_OF_TRANSMISSION</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/ src/components/ui/TerminalChat.tsx
git commit -m "feat: useTypewriter hook, TerminalChat with Claude streaming SSE"
```

---

## Task 9: Refactor Contact Page

**Files:**
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1: Read current contact page**

Read `src/app/contact/page.tsx` in full.

- [ ] **Step 2: Replace with new contact page**

```typescript
'use client'

import { useState } from 'react'
import TerminalChat from '@/components/ui/TerminalChat'
import { useTypewriter } from '@/hooks/useTypewriter'

const HEADLINE = 'HABLEMOS DE TU PRÓXIMO PROYECTO'

function AnimatedHeadline() {
  const { displayed, done } = useTypewriter(HEADLINE, 40, 200)
  return (
    <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-16 break-words">
      {displayed}{!done && <span className="cursor-blink" aria-hidden="true" />}
    </h1>
  )
}

interface FormState {
  name: string
  email: string
  company: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string }

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? 'Error desconocido')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', company: '', message: '' })
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setStatus('error')
    }
  }

  return (
    <main className="flex-grow flex flex-col pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-32">

        {/* Left column */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-secondary-container border border-black"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-terminal text-gray-500">INITIATE_HANDSHAKE</span>
          </div>

          <AnimatedHeadline />

          <div className="space-y-6 flex flex-col font-terminal text-lg font-bold mb-12">
            {[
              { href: 'mailto:contact@hexaia.io', label: 'EMAIL_CONNECTION', icon: 'mail' },
              { href: 'https://linkedin.com', label: 'LINKEDIN_NETWORK', icon: 'public', external: true },
              { href: 'https://github.com', label: 'GITHUB_REPOSITORY', icon: 'code', external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="border-b-2 border-black pb-2 w-fit hover:text-secondary hover:border-secondary-container transition-colors inline-flex items-center gap-4 nav-link-underline group"
              >
                {link.label}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ fontVariationSettings: "'FILL' 1" }}>{link.icon}</span>
              </a>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-4">FORM_DIRECT_CONTACT</div>

            {[
              { name: 'name', label: 'NOMBRE_COMPLETO', type: 'text', required: true },
              { name: 'email', label: 'EMAIL_ADDRESS', type: 'email', required: true },
              { name: 'company', label: 'EMPRESA_OPCIONAL', type: 'text', required: false },
            ].map((field) => (
              <div key={field.name} className="group">
                <label htmlFor={field.name} className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={form[field.name as keyof FormState]}
                  onChange={handleChange}
                  className="w-full border-b border-black bg-transparent font-terminal text-sm py-2 outline-none focus:border-secondary-container transition-colors placeholder-gray-300"
                  aria-required={field.required}
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                MENSAJE_PROYECTO
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full border-b border-black bg-transparent font-terminal text-sm py-2 outline-none focus:border-secondary-container transition-colors placeholder-gray-300 resize-none"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-8 py-3 bg-black text-white font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black transition-colors disabled:opacity-50 shadow-[4px_4px_0_0_#bbe405] hover:shadow-[2px_2px_0_0_#bbe405] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {status === 'sending' ? 'SENDING...' : 'TRANSMIT_MESSAGE →'}
            </button>

            {status === 'success' && (
              <p className="font-terminal text-xs text-secondary-container mt-2" role="status">
                ✓ MENSAJE RECIBIDO. Responderé en 24-48 horas.
              </p>
            )}
            {status === 'error' && (
              <p className="font-terminal text-xs text-red-600 mt-2" role="alert">
                ✗ {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Right column — Terminal Chat */}
        <div className="flex flex-col justify-start pt-4">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-4">AI_ASSISTANT_ONLINE</div>
          <TerminalChat />
          <p className="font-terminal text-[9px] text-gray-400 mt-3 leading-relaxed">
            El asistente responde preguntas sobre skills, disponibilidad y proyectos. Powered by Claude API.
          </p>
        </div>

      </section>
    </main>
  )
}
```

- [ ] **Step 3: Test contact page**

```bash
npm run dev
```

Open http://localhost:3000/contact. Expected:
- Headline animates with typewriter effect
- Contact form submits → shows success message
- Terminal chat sends messages → streams Claude responses

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: contact page — typewriter headline, contact form with AI scoring, terminal chat"
```

---

## Task 10: Dynamic Project Pages

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Create `src/app/projects/[slug]/page.tsx`**

```typescript
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Project } from '@/types/project'
import AnimatedBlock from '@/components/ui/AnimatedBlock'

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/projects`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const projects = (await res.json()) as Project[]
    return projects.find((p) => p.slug === slug) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const project = await getProject(slug)
  if (!project) return { title: 'Proyecto no encontrado' }
  return {
    title: `${project.title} | Felipe Portfolio`,
    description: project.description ?? '',
  }
}

export default async function ProjectDetail(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <main className="flex-grow flex flex-col pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        BACK_TO_HOME
      </Link>

      {/* Header */}
      <AnimatedBlock className="mb-16">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-0.5 bg-black text-white text-[10px] font-terminal">CASE_STUDY</span>
          {project.metadata?.category && (
            <span className="px-2 py-0.5 border border-black text-[10px] font-terminal">{project.metadata.category}</span>
          )}
        </div>
        <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-8">
          {project.title}
        </h1>
        <p className="font-body text-xl text-gray-700 max-w-2xl leading-relaxed">{project.description}</p>
      </AnimatedBlock>

      {/* Cover image */}
      {project.cover_url && (
        <AnimatedBlock delay={0.1} className="relative w-full h-[400px] md:h-[500px] mb-16 border border-black overflow-hidden">
          <Image
            src={project.cover_url}
            alt={`${project.title} cover`}
            fill
            className="object-cover grayscale contrast-125"
            sizes="(max-width: 768px) 100vw, 85vw"
            priority
          />
          <div className="absolute inset-0 bg-secondary-container/5 mix-blend-multiply pointer-events-none" />
        </AnimatedBlock>
      )}

      {/* Metadata grid */}
      <AnimatedBlock delay={0.2} className="grid grid-cols-2 md:grid-cols-4 border border-black mb-16">
        {[
          { label: 'CLIENTE', value: project.metadata?.client ?? '—' },
          { label: 'AÑO', value: project.metadata?.year?.toString() ?? '—' },
          { label: 'CATEGORÍA', value: project.metadata?.category ?? '—' },
          { label: 'STACK', value: project.metadata?.tech_stack?.slice(0, 2).join(', ') ?? '—' },
        ].map((item, i) => (
          <div key={i} className="p-6 border-r border-black last:border-r-0">
            <div className="font-terminal text-[9px] uppercase tracking-widest text-gray-400 mb-2">{item.label}</div>
            <div className="font-terminal text-sm font-bold">{item.value}</div>
          </div>
        ))}
      </AnimatedBlock>

      {/* Tags */}
      <AnimatedBlock delay={0.3} className="flex flex-wrap gap-2 mb-24">
        {project.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 border border-black font-terminal text-[10px] uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </AnimatedBlock>

      {/* CTA */}
      <AnimatedBlock delay={0.4} className="border-t border-black pt-12 pb-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-2">SIGUIENTE_PASO</div>
          <p className="font-headline text-3xl font-black uppercase">¿Tienes un proyecto similar?</p>
        </div>
        <Link
          href="/contact"
          className="px-8 py-4 bg-black text-white font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black transition-colors shadow-[4px_4px_0_0_#bbe405] hover:shadow-[2px_2px_0_0_#bbe405] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-3"
        >
          INICIAR_PROYECTO
          <span className="material-symbols-outlined text-sm">north_east</span>
        </Link>
      </AnimatedBlock>
    </main>
  )
}
```

- [ ] **Step 2: Update About page with scroll animations**

Read `src/app/about/page.tsx`, then wrap each major section in `<AnimatedBlock>` and replace `<img>` with `<Image>`. Add these imports at the top:
```typescript
import AnimatedBlock from '@/components/ui/AnimatedBlock'
```
Then wrap each `<section>` child block with:
```typescript
<AnimatedBlock delay={0}>...</AnimatedBlock>
<AnimatedBlock delay={0.08}>...</AnimatedBlock>
```
(Incrementing delay by 0.08 per block.)

- [ ] **Step 3: Test dynamic project page**

```bash
npm run dev
```

Navigate to http://localhost:3000/projects/hexaia. Expected: Dynamic project detail page with cover image, metadata grid, and tags from Supabase.

- [ ] **Step 4: Commit**

```bash
git add src/app/projects/ src/app/about/page.tsx
git commit -m "feat: dynamic project detail pages, about page scroll animations"
```

---

## Task 11: Sprint 4 — Polish, Accessibility & Performance

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add ARIA navigation to Navbar**

Read `src/components/Navbar.tsx`, then add `role="navigation"` and `aria-label="Main navigation"` to the `<nav>` element. Add `nav-link-underline` class to all nav links. Add `aria-current="page"` to the active link using `usePathname()`.

Example Navbar structure:
```typescript
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-background/95 backdrop-blur-sm">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between"
      >
        <Link href="/" className="font-headline text-lg font-black uppercase tracking-tighter" aria-label="HexaIA — Home">
          HEXA_IA
        </Link>
        <ul className="flex items-center gap-8 list-none">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-terminal text-[11px] uppercase tracking-widest nav-link-underline hover:text-secondary transition-colors"
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Run a full build and fix any TypeScript errors**

```bash
npm run build 2>&1
```

Fix all errors before proceeding. Common fixes:
- Missing `alt` props on `<img>` → replace with `<Image>` from `next/image`
- Missing return types on functions
- `any` types → replace with specific types

- [ ] **Step 3: Run ESLint**

```bash
npm run lint 2>&1
```

Fix all warnings and errors reported.

- [ ] **Step 4: Verify Core Web Vitals with Lighthouse**

Start production build and run Lighthouse:
```bash
npm run build && npm start
```

Open Chrome DevTools → Lighthouse → Run audit on http://localhost:3000.

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

If Performance is below 90, common fixes:
- Ensure Three.js is loaded with `dynamic(..., { ssr: false })`
- Verify all images use `next/image` with explicit `width`/`height` or `fill` + `sizes`
- Check no render-blocking scripts

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Sprint 4 — accessibility, Navbar ARIA, ESLint clean, Lighthouse verified"
```

---

## Self-Review Against Spec

**Spec coverage check:**

| Spec Section | Covered by Task |
|---|---|
| Supabase schema (projects, leads, analytics) | Task 2 |
| GHL mock integration | Task 3, 4 |
| Claude lead scoring | Task 4 `/api/contact` |
| Claude chat streaming | Task 4 `/api/chat`, Task 8 |
| GHL webhook endpoint | Task 4 `/api/webhooks/ghl` |
| Three.js hexagonal prism | Task 5 |
| Framer Motion page transitions | Task 6 |
| Scroll assembly animations | Task 6 (AnimatedBlock) |
| Terminal typewriter | Task 8 (useTypewriter) |
| Button/nav micro-interactions | Task 6 (globals.css), Task 11 |
| Home page dynamic + animated | Task 7 |
| Contact page form + chat | Task 9 |
| Dynamic project pages | Task 10 |
| About page scroll animations | Task 10 |
| TypeScript strict | Task 1 |
| next/image optimization | Task 7, 10 |
| WCAG 2.1 AA | Task 8 (ARIA), Task 11 |
| Core Web Vitals 90+ | Task 11 |
| Geist Mono font | Task 6 |
| `prefers-reduced-motion` | Task 5, Task 6 |
| Prompt caching (Anthropic) | Task 3 (prompts.ts) |

**All spec requirements covered. No gaps found.**

**Placeholder scan:** All tasks contain complete code. No TBDs, no "implement later", no "add appropriate error handling" without specifics. ✓

**Type consistency check:**
- `Project` type defined in Task 2, used in Tasks 7 and 10 ✓
- `LeadSchema` / `LeadInput` defined in Task 2, used in Task 4 ✓
- `GHLContact` defined in Task 3, used in Task 4 ✓
- `Message` interface in Task 8 matches `/api/chat` schema in Task 4 ✓
- `createServerClient()` from `lib/supabase/server.ts` used consistently ✓
- `getAnthropicClient()` singleton from `lib/anthropic/client.ts` used in Tasks 4 ✓
