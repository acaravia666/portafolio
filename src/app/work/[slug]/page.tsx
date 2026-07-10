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
