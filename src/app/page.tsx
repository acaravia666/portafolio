import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AnimatedBlock from "@/components/ui/AnimatedBlock";
import HexPrismFallback from "@/components/three/HexPrismFallback";
import HexPrismClient from "@/components/three/HexPrismClient";
import type { Project } from "@/types/project";

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

        <div className="md:col-span-7 border border-black p-8 md:p-12 bg-white relative flex flex-col justify-center min-h-[50vh] md:min-h-[600px] overflow-hidden">
          <div className="absolute top-4 right-4 font-terminal text-[10px] text-gray-500 z-10 bg-white/80 px-2 py-1 border border-gray-200">HEXA_PRISM_01</div>
          {/* Three.js Hexagonal Prism */}
          <div className="absolute inset-0 w-full h-full" aria-hidden="true">
            <Suspense fallback={<HexPrismFallback />}>
              <HexPrismClient />
            </Suspense>
          </div>
          <AnimatedBlock delay={0.1} className="relative z-10 mt-auto pt-48 md:pt-64 pointer-events-none">
            <p className="font-body text-xl max-w-md leading-tight bg-white/90 p-4 border border-black shadow-[4px_4px_0_0_#bbe405] pointer-events-auto">
              Transformando ideas en ecosistemas digitales. Desde el diseño UX/UI y desarrollo de alto rendimiento, hasta la automatización total de tus operaciones.
            </p>
          </AnimatedBlock>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <AnimatedBlock delay={0.2} className="border border-black border-l-0 border-t-0 md:border-t p-8 flex-grow bg-surface">
            <div className="font-terminal text-[10px] mb-6 uppercase tracking-widest text-gray-500">TECHNICAL_SPECIFICATIONS</div>
            <ul className="space-y-4 font-mono text-sm">
              {[
                { label: 'UX_UI_SYSTEMS', href: '/projects/ux-ui-design' },
                { label: 'WEB_ENGINEERING', href: '/projects/web-engineering' },
                { label: 'APP_ARCHITECTURE', href: '/projects/app-architecture' },
                { label: 'AUTO_OPS_&_CRM', href: '/projects/auto-ops-crm' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex justify-between border-b border-black/10 pb-2 hover:pl-2 hover:border-secondary-container transition-all duration-300 group">
                    <span>{item.label}</span>
                    <span className="text-secondary-container material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedBlock>
          <AnimatedBlock delay={0.3} className="border border-black border-l-0 border-t-0 p-8 bg-black text-white flex flex-col justify-between group hover:bg-secondary-container hover:text-black transition-colors cursor-pointer min-h-[250px]">
            <span className="font-terminal text-[10px] uppercase text-gray-400 group-hover:text-black transition-colors">EXECUTE_PROJECT_INIT</span>
            <Link href="/contact" className="flex justify-between items-end mt-12 w-full">
              <span className="text-4xl md:text-5xl font-headline italic">Start Session</span>
              <span className="material-symbols-outlined text-5xl">north_east</span>
            </Link>
          </AnimatedBlock>
        </div>
      </section>

      {/* Services Bento */}
      <section className="grid grid-cols-1 md:grid-cols-4 border-b border-black">
        <AnimatedBlock delay={0} className="border border-black border-t-0 md:border-l-0 md:col-span-2 md:row-span-2 bg-[#0a0a0a] text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
          <Link href="/projects/web-engineering" className="p-8 md:p-12 flex flex-col h-full relative z-10">
            <div className="flex justify-between items-start mb-16">
              <span className="font-terminal text-[10px] uppercase border border-white/20 px-3 py-1.5 text-white flex items-center gap-2 bg-black/50 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse"></span>
                SERVICE_01_CORE
              </span>
              <span className="material-symbols-outlined text-secondary-container text-5xl group-hover:scale-110 transition-transform duration-500">code_blocks</span>
            </div>
            <h3 className="text-4xl md:text-6xl mb-6 font-headline text-white leading-none uppercase group-hover:text-secondary-container transition-colors duration-300">Web Engineering</h3>
            <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">Arquitecturas frontend y backend de alto rendimiento. Desarrollo de plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.</p>
            <div className="mt-auto pt-16 flex justify-between items-end border-t border-white/20">
              <span className="font-terminal text-[10px] md:text-xs uppercase text-gray-500">NEXT.JS / REACT / NODE</span>
              <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-secondary-container transition-colors">arrow_forward</span>
            </div>
          </Link>
        </AnimatedBlock>

        {[
          { id: 'SERVICE_02', icon: 'design_services', title: 'UX/UI System Design', desc: 'Investigación de usuarios, wireframing y diseño de interfaces premium que fusionan estética industrial con usabilidad funcional para maximizar la retención.', accent: false, href: '/projects/ux-ui-design' },
          { id: 'SERVICE_03', icon: 'smartphone', title: 'App Architecture', desc: 'Sistemas móviles nativos y cross-platform iOS/Android.', accent: false, href: '/projects/app-architecture' },
          { id: 'SERVICE_04', icon: 'hub', title: 'Auto-Ops & CRM', desc: 'Automatización end-to-end e integraciones con GoHighLevel.', accent: true, href: '/projects/auto-ops-crm' },
        ].map((svc, i) => (
          <AnimatedBlock
            key={svc.id}
            delay={i * 0.08}
            className={`border border-black border-t-0 border-l-0 flex flex-col group ${svc.accent ? 'bg-secondary-container' : 'bg-white'}`}
          >
            <Link href={svc.href} className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <span className={`font-terminal text-[10px] uppercase border border-black px-2 py-1 ${svc.accent ? 'text-primary' : ''}`}>{svc.id}</span>
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

      {/* Featured Project — dynamic from Supabase */}
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
              <div className="w-full h-full bg-surface flex items-center justify-center min-h-[300px]">
                <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">NO_COVER_IMAGE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-secondary-container/10 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 font-terminal text-[10px] text-white bg-black p-2">
              COORDINATES: 0° 13&apos; 47&quot; S, 78° 31&apos; 29&quot; W
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
