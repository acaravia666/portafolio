import type { Metadata } from 'next'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import SectionHeader from '@/components/ui/SectionHeader'
import FlagshipCard from '@/components/projects/FlagshipCard'
import ProjectCard from '@/components/projects/ProjectCard'
import { getFeaturedProjects, getShowcaseProjects } from '@/content/getProjects'

export const metadata: Metadata = {
  title: 'Trabajo | Felipe Caravía',
  description: 'Proyectos reales: IRI5, Hex.Via CMS, QR Shirts y más.',
}

export default function WorkPage() {
  const flagships = getFeaturedProjects()
  const showcase = getShowcaseProjects()

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">SELECTED_WORK</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          TRABAJO<br />SELECCIONADO
        </h1>
      </AnimatedBlock>

      <section className="border-b border-black">
        <SectionHeader label="// FLAGSHIP_CASE_STUDIES" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 px-6 md:px-12 pb-12">
          {flagships.map((p) => (
            <AnimatedBlock key={p.slug} className="bg-background">
              <FlagshipCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader label="// SHOWCASE" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 pb-24">
          {showcase.map((p) => (
            <AnimatedBlock key={p.slug}>
              <ProjectCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </main>
  )
}
