'use client'

import Link from 'next/link'

interface Step {
  title: string
  description: string
}

export interface ServicePageProps {
  serviceId: string
  title: string
  tagline: string
  stack: string[]
  duration: string
  delivery: string
  steps: Step[]
  useCases: string[]
  ctaHeadline: string
  deliverableLabels: [string, string, string]
}

export default function ServicePage({
  serviceId,
  title,
  tagline,
  stack,
  duration,
  delivery,
  steps,
  useCases,
  ctaHeadline,
  deliverableLabels,
}: ServicePageProps) {
  return (
    <main className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="px-6 py-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-secondary-container transition-colors group"
        >
          <span
            className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            arrow_back
          </span>
          VOLVER_A_PROYECTOS
        </Link>
      </div>

      {/* Hero */}
      <section className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-0 border-y border-black">
        <div className="lg:col-span-7 border-r-0 lg:border-r border-black pb-12 lg:pb-24 pt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-tighter">
              {serviceId}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-secondary-container border border-black" />
              STATUS: AVAILABLE
            </span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase break-words">
            {title}
          </h1>
          <p className="mt-12 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
            {tagline}
          </p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-primary text-background px-8 py-4 font-mono font-bold uppercase tracking-widest border border-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              INICIAR PROYECTO
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                north_east
              </span>
            </Link>
          </div>
        </div>

        {/* Metadata sidebar */}
        <div className="lg:col-span-5 bg-surface flex flex-col justify-between font-mono">
          <div className="p-8 pt-12 flex-grow border-b border-black/10">
            <div className="space-y-12">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">
                  STACK_TÉCNICO
                </span>
                <ul className="space-y-2">
                  {stack.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between border-b border-black/5 pb-1"
                    >
                      <span className="font-bold">{item}</span>
                      <span
                        className="text-secondary-container material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">
                  DETALLES_PROYECTO
                </span>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-black/5 pb-1">
                    <span className="font-bold text-sm">DURACIÓN</span>
                    <span className="text-sm">{duration}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-black/5 pb-1 gap-4">
                    <span className="font-bold text-sm flex-shrink-0">ENTREGABLE</span>
                    <span className="text-sm text-right">{delivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-black text-white">
            <div className="flex items-center gap-4">
              <span
                className="material-symbols-outlined text-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
              <div className="text-[10px] tracking-widest">
                SERVICE_NODE_ACTIVE<br />
                LAT: 0° 13&apos; 47&quot; S | LNG: 78° 31&apos; 29&quot; W
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverable placeholder tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
        {deliverableLabels.map((label, i) => (
          <div
            key={label}
            className={`aspect-square relative bg-surface flex items-center justify-center border-black ${
              i < 2 ? 'border-b md:border-b-0 border-r-0 md:border-r' : ''
            }`}
          >
            <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">
              {label}
            </div>
            <span className="font-terminal text-[10px] text-gray-300 uppercase tracking-widest">
              {`// ${serviceId}`}
            </span>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
        <div className="lg:col-span-4 lg:sticky top-32">
          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            EL<br />PROCESO
          </h2>
          <div className="w-16 h-2 bg-secondary-container mb-6 border border-black" />
          <p className="font-mono text-sm leading-relaxed text-gray-700">
            Un flujo de trabajo estructurado que garantiza claridad en cada fase,
            entregables medibles y cero sorpresas.
          </p>
        </div>
        <div className="lg:col-span-8 space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="border border-black p-6 bg-surface flex gap-6 hover:bg-secondary-container transition-colors items-start"
            >
              <div className="font-headline text-5xl font-black text-black/20 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 uppercase">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">
          ¿PARA QUIÉN?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className="border border-black p-6 bg-white flex gap-4 items-start"
            >
              <span className="font-terminal text-[10px] text-gray-400 flex-shrink-0 mt-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-mono text-sm leading-relaxed">{useCase}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-24 px-6 text-center overflow-hidden relative border-t border-black">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden font-black text-[20vw] leading-none text-white/20 whitespace-nowrap -rotate-12 translate-y-24"
        >
          {title} {title} {title}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-2xl mx-auto leading-tight">
            {ctaHeadline}
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-secondary-container text-black px-12 py-6 font-bold uppercase tracking-widest text-lg md:text-xl hover:bg-white transition-colors border border-black shadow-[4px_4px_0_0_#FFFFFF]"
          >
            INICIAR DIAGNÓSTICO
          </Link>
        </div>
      </section>
    </main>
  )
}
