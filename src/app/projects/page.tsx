import Link from 'next/link'
import AnimatedBlock from '@/components/ui/AnimatedBlock'

const services = [
  {
    id: 'SERVICE_01',
    icon: 'code_blocks',
    title: 'Web Engineering',
    desc: 'Arquitecturas frontend y backend de alto rendimiento. Plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.',
    href: '/projects/web-engineering',
    accent: false,
    large: true,
    stack: 'NEXT.JS / REACT / NODE',
  },
  {
    id: 'SERVICE_02',
    icon: 'design_services',
    title: 'UX/UI System Design',
    desc: 'Investigación de usuarios, wireframing y diseño de interfaces premium que fusionan estética industrial con usabilidad funcional para maximizar la retención.',
    href: '/projects/ux-ui-design',
    accent: false,
    large: false,
  },
  {
    id: 'SERVICE_03',
    icon: 'smartphone',
    title: 'App Architecture',
    desc: 'Sistemas móviles nativos y cross-platform iOS/Android construidos para durar.',
    href: '/projects/app-architecture',
    accent: false,
    large: false,
  },
  {
    id: 'SERVICE_04',
    icon: 'hub',
    title: 'Auto-Ops & CRM',
    desc: 'Automatización end-to-end e integraciones con GoHighLevel. Operaciones que se ejecutan solas.',
    href: '/projects/auto-ops-crm',
    accent: true,
    large: false,
  },
  {
    id: 'SERVICE_05',
    icon: 'school',
    title: 'Consultoría & Capacitación',
    desc: 'Estrategia, mentoría y formación para equipos que quieren operar con AI desde adentro.',
    href: '/projects/consulting',
    accent: false,
    large: false,
  },
]

export default function ProjectsIndex() {
  return (
    <main className="flex-grow flex flex-col pt-20">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]" />

      {/* Page header */}
      <AnimatedBlock className="px-6 md:px-12 py-12 border-b border-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary-container" />
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            ALL_WORK
          </span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          PROYECTOS &<br />SERVICIOS
        </h1>
      </AnimatedBlock>

      {/* Case Studies block */}
      <section className="border-b border-black">
        <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            // CASE_STUDIES
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <AnimatedBlock className="mx-6 md:mx-12 mb-12 border border-black bg-[#0a0a0a] text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="relative z-10 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 border border-secondary-container uppercase tracking-tighter">
                  CASE_STUDY
                </span>
                <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">
                  PROJECT_ID: 0x48657861
                </span>
              </div>
              <h2 className="font-headline text-6xl md:text-8xl font-black leading-none uppercase mb-4 group-hover:text-secondary-container transition-colors duration-300">
                HEXAIA
              </h2>
              <p className="font-body text-gray-400 text-lg max-w-xl leading-relaxed mb-8">
                Cómo una agencia de servicios eliminó el caos operativo y triplicó su tasa de cierre con automatización inteligente.
              </p>
              <div className="flex flex-wrap gap-8 mb-8">
                {[
                  { label: 'TASA CONTACTO 24H', value: '+210%' },
                  { label: 'TIEMPO ADMIN', value: '-65%' },
                  { label: 'TASA DE CIERRE', value: '18% → 47%' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <span className="font-terminal text-[10px] text-gray-500 block mb-1">{metric.label}</span>
                    <span className="font-headline text-2xl font-black text-secondary-container">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/projects/hexaia"
                className="inline-flex items-center gap-3 border border-white/30 px-6 py-3 font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black hover:border-secondary-container transition-all"
              >
                VER_CASE_STUDY
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* Services block */}
      <section>
        <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
            // SERVICIOS_DISPONIBLES
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-black">
          {/* SERVICE_01 — large */}
          <AnimatedBlock
            delay={0}
            className="md:col-span-2 md:row-span-2 border border-black border-t-0 md:border-l-0 bg-[#0a0a0a] text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none mix-blend-overlay" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
              <div className="flex justify-between items-start mb-16">
                <span className="font-terminal text-[10px] uppercase border border-white/20 px-3 py-1.5 text-white flex items-center gap-2 bg-black/50 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse" />
                  SERVICE_01_CORE
                </span>
                <span className="material-symbols-outlined text-secondary-container text-5xl group-hover:scale-110 transition-transform duration-500">
                  code_blocks
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl mb-6 font-headline text-white leading-none uppercase group-hover:text-secondary-container transition-colors duration-300">
                Web Engineering
              </h3>
              <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">
                Arquitecturas frontend y backend de alto rendimiento. Desarrollo de plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.
              </p>
              <div className="mt-auto pt-16 flex justify-between items-end border-t border-white/20">
                <span className="font-terminal text-[10px] md:text-xs uppercase text-gray-500">
                  NEXT.JS / REACT / NODE
                </span>
                <Link
                  href="/projects/web-engineering"
                  className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-secondary-container transition-colors"
                  aria-label="Ver Web Engineering"
                >
                  arrow_forward
                </Link>
              </div>
            </div>
          </AnimatedBlock>

          {/* SERVICE_02, 03, 04 */}
          {services.filter((s) => !s.large).map((svc, i) => (
            <AnimatedBlock
              key={svc.id}
              delay={i * 0.08}
              className={`border border-black border-t-0 border-l-0 flex flex-col group ${
                svc.accent ? 'bg-secondary-container' : 'bg-white'
              }`}
            >
              <Link href={svc.href} className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <span
                    className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${
                      svc.accent ? 'text-primary' : ''
                    }`}
                  >
                    {svc.id}
                  </span>
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      svc.accent ? 'text-primary' : ''
                    }`}
                  >
                    {svc.icon}
                  </span>
                </div>
                <h3
                  className={`text-2xl mb-4 font-headline uppercase leading-none ${
                    svc.accent ? 'text-primary' : ''
                  }`}
                >
                  {svc.title}
                </h3>
                <p
                  className={`font-body text-sm leading-relaxed flex-1 ${
                    svc.accent ? 'text-primary/80' : 'text-gray-700'
                  }`}
                >
                  {svc.desc}
                </p>
                <div className="mt-8 flex justify-end">
                  <span
                    className={`material-symbols-outlined group-hover:translate-x-1 transition-transform ${
                      svc.accent ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    arrow_forward
                  </span>
                </div>
              </Link>
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </main>
  )
}
