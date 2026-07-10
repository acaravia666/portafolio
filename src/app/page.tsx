import Link from 'next/link'
import { Suspense } from 'react'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import HexPrismFallback from '@/components/three/HexPrismFallback'
import HexPrismClient from '@/components/three/HexPrismClient'
import SectionHeader from '@/components/ui/SectionHeader'
import FlagshipCard from '@/components/projects/FlagshipCard'
import LiveEmbed from '@/components/ui/LiveEmbed'
import { getFeaturedProjects, getHeroEmbedProject } from '@/content/getProjects'
import { getAllServices } from '@/content/getServices'

export default function Home() {
  const flagships = getFeaturedProjects()
  const embed = getHeroEmbedProject()
  const services = getAllServices()

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      {/* Hero */}
      <section className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-black">
        <AnimatedBlock className="md:col-span-12 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-secondary-container" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">STATUS: OPTIMIZING_FLOW</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-outline)] ml-4">FELIPE_CARAVÍA</span>
          </div>
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-primary font-headline max-w-full pb-2">
            ARQUITECTO CREATIVO DE PRODUCTOS DIGITALES Y AUTOMATIZACIÓN
          </h1>
        </AnimatedBlock>

        <div className="md:col-span-7 border border-black p-8 md:p-12 bg-white relative flex flex-col justify-center min-h-[50vh] md:min-h-[600px] overflow-hidden">
          <div className="absolute top-4 right-4 font-terminal text-[10px] text-gray-500 z-10 bg-white/80 px-2 py-1 border border-gray-200">HEXA_PRISM_01</div>
          <div className="absolute inset-0 w-full h-full" aria-hidden="true">
            <Suspense fallback={<HexPrismFallback />}>
              <HexPrismClient />
            </Suspense>
          </div>
          <AnimatedBlock delay={0.1} className="relative z-10 mt-auto pt-48 md:pt-64 pointer-events-none">
            <p className="font-body text-xl max-w-md leading-tight bg-white/90 p-4 border border-black shadow-[4px_4px_0_0_#bbe405] pointer-events-auto">
              Este prisma 3D corre en tu browser, en tiempo real. Si quieres experiencias así en tu producto, hablemos.
            </p>
          </AnimatedBlock>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <AnimatedBlock delay={0.2} className="border border-black border-l-0 border-t-0 md:border-t p-8 flex-grow bg-surface">
            <div className="font-terminal text-[10px] mb-6 uppercase tracking-widest text-gray-500">SERVICIOS</div>
            <ul className="space-y-4 font-mono text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex justify-between border-b border-black/10 pb-2 hover:pl-2 hover:border-secondary-container transition-all duration-300 group">
                    <span>{s.title}</span>
                    <span className="text-secondary-container material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedBlock>
          <AnimatedBlock delay={0.3} className="border border-black border-l-0 border-t-0 bg-black text-white group hover:bg-secondary-container hover:text-black transition-colors min-h-[250px]">
            <Link href="/contact" className="p-8 flex flex-col justify-between h-full min-h-[250px]">
              <span className="font-terminal text-[10px] uppercase text-gray-400 group-hover:text-black transition-colors">EXECUTE_PROJECT_INIT</span>
              <div className="flex justify-between items-end mt-12 w-full">
                <span className="text-4xl md:text-5xl font-headline italic">Start Session</span>
                <span className="material-symbols-outlined text-5xl">north_east</span>
              </div>
            </Link>
          </AnimatedBlock>
        </div>
      </section>

      {/* Selected Work: live embed + flagships */}
      <section className="border-b border-black">
        <SectionHeader label="// SELECTED_WORK" />
        {embed?.liveUrl && (
          <AnimatedBlock className="px-6 md:px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 border border-black">
              <div className="md:col-span-4 p-8 flex flex-col justify-between bg-surface border-b md:border-b-0 md:border-r border-black">
                <div>
                  <span className="font-terminal text-[10px] uppercase text-gray-500">LIVE_HERO</span>
                  <h2 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mt-4">{embed.name}</h2>
                  <p className="font-body text-gray-600 mt-3">{embed.tagline}</p>
                </div>
                <Link href={`/work/${embed.slug}`} className="mt-8 inline-flex items-center gap-2 font-terminal text-sm uppercase hover:text-secondary-container transition-colors">
                  VER_CASE_STUDY <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="md:col-span-8 h-[360px] md:h-[520px]">
                <LiveEmbed url={embed.liveUrl} title={`${embed.name} — sitio en vivo`} />
              </div>
            </div>
          </AnimatedBlock>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 px-6 md:px-12 pb-12">
          {flagships.filter((p) => !p.heroEmbed).map((p) => (
            <AnimatedBlock key={p.slug} className="bg-background">
              <FlagshipCard project={p} />
            </AnimatedBlock>
          ))}
        </div>
        <div className="px-6 md:px-12 pb-12">
          <Link href="/work" className="inline-flex items-center gap-2 font-terminal text-sm uppercase border border-black px-6 py-3 hover:bg-secondary-container hover:text-black transition-colors">
            VER_TODO_EL_TRABAJO <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
        <AnimatedBlock className="p-12 border-r-0 md:border-r border-black">
          <h2 className="font-headline text-4xl md:text-6xl font-black uppercase leading-none">¿Tienes un proyecto en mente?</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={0.1} className="bg-black text-white group hover:bg-secondary-container hover:text-black transition-colors">
          <Link href="/contact" className="p-12 flex items-end justify-between h-full min-h-[220px]">
            <span className="text-3xl md:text-4xl font-headline italic">Start Session</span>
            <span className="material-symbols-outlined text-5xl">north_east</span>
          </Link>
        </AnimatedBlock>
      </section>
    </main>
  )
}
