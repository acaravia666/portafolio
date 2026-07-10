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
