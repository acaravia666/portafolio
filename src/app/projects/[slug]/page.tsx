import { cache } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Project } from '@/types/project'
import AnimatedBlock from '@/components/ui/AnimatedBlock'

const getProject = cache(async function getProject(slug: string): Promise<Project | null> {
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
})

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
        <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
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
        <p className="font-body text-xl text-gray-700 max-w-2xl leading-relaxed">{project.description ?? ''}</p>
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
        ].map((item) => (
          <div key={item.label} className="p-6 border-r border-black last:border-r-0">
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
