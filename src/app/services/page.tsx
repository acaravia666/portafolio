import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedBlock from '@/components/ui/AnimatedBlock'
import { getAllServices } from '@/content/getServices'

export const metadata: Metadata = {
  title: 'Servicios | Felipe Caravía',
  description: 'Web engineering, UX/UI, apps, automatización y CRM, y consultoría.',
}

export default function ServicesIndex() {
  const services = getAllServices()
  const [lead, ...rest] = services

  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">SERVICIOS_DISPONIBLES</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          SERVICIOS
        </h1>
      </AnimatedBlock>

      <section className="grid grid-cols-1 md:grid-cols-4 border-b border-black">
        <AnimatedBlock className="md:col-span-2 md:row-span-2 border border-black border-t-0 md:border-l-0 bg-[#0a0a0a] text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden texture-carbon">
          <Link href={`/services/${lead.slug}`} className="relative z-10 p-8 md:p-12 flex flex-col h-full">
            <div className="flex justify-between items-start mb-16">
              <span className="font-terminal text-[10px] uppercase border border-white/20 px-3 py-1.5 flex items-center gap-2 bg-black/50 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse" />
                {lead.serviceId}_CORE
              </span>
              <span className="material-symbols-outlined text-secondary-container text-5xl group-hover:scale-110 transition-transform duration-500">{lead.icon}</span>
            </div>
            <h3 className="text-4xl md:text-6xl mb-6 font-headline leading-none uppercase group-hover:text-secondary-container transition-colors duration-300">{lead.title}</h3>
            <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">{lead.desc}</p>
            <div className="mt-auto pt-16 flex justify-between items-end border-t border-white/20">
              <span className="font-terminal text-[10px] md:text-xs uppercase text-gray-500">{lead.stack.slice(0, 3).join(' / ')}</span>
              <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-secondary-container transition-colors">arrow_forward</span>
            </div>
          </Link>
        </AnimatedBlock>

        {rest.map((svc, i) => (
          <AnimatedBlock key={svc.slug} delay={i * 0.08} className={`border border-black border-t-0 border-l-0 flex flex-col group ${svc.accent ? 'bg-secondary-container' : 'bg-white'}`}>
            <Link href={`/services/${svc.slug}`} className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <span className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${svc.accent ? 'text-primary' : ''}`}>{svc.serviceId}</span>
                <span className={`material-symbols-outlined text-2xl ${svc.accent ? 'text-primary' : ''}`}>{svc.icon}</span>
              </div>
              <h3 className={`text-2xl mb-4 font-headline uppercase leading-none ${svc.accent ? 'text-primary' : ''}`}>{svc.title}</h3>
              <p className={`font-body text-sm leading-relaxed flex-1 ${svc.accent ? 'text-primary/80' : 'text-gray-700'}`}>{svc.desc}</p>
              <div className="mt-8 flex justify-end">
                <span className={`material-symbols-outlined group-hover:translate-x-1 transition-transform ${svc.accent ? 'text-primary' : 'text-gray-400'}`}>arrow_forward</span>
              </div>
            </Link>
          </AnimatedBlock>
        ))}
      </section>
    </main>
  )
}
