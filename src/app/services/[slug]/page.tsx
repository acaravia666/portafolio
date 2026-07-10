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
