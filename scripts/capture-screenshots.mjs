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
