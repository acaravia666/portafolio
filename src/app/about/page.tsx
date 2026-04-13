import Link from "next/link";

export default function About() {
  return (
    <main className="flex-grow flex flex-col pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Background Decoration */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      {/* Hero Section */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
        <div className="md:col-span-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-secondary-container"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-mono text-gray-500">PERFIL_PROFESIONAL</span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-8">
            ESTRATEGA DIGITAL & DESARROLLADOR
          </h1>
          <p className="font-mono text-xl max-w-3xl leading-relaxed text-gray-700 text-left mb-6">
            Soy Felipe, un estratega digital y desarrollador especializado en la intersección de la <strong>Inteligencia Artificial</strong> y la <strong>automatización de procesos</strong>. Mi enfoque no es solo construir herramientas, sino diseñar arquitectura lógica que permita a las empresas operar a una escala superior sin incrementar su carga operativa.
          </p>
          <p className="font-mono text-xl max-w-3xl leading-relaxed text-gray-700 text-left">
            Como fundador de <strong>HexaIA</strong>, transformo la infraestructura de negocios mediante la implementación de soluciones de marca blanca sobre GoHighLevel, integrando flujos de trabajo inteligentes que convierten la complejidad técnica en simplicidad operativa.
          </p>
        </div>
        
        {/* Status / Metadata Block */}
        <div className="md:col-span-4 flex flex-col justify-end">
          <div className="border border-black p-6 bg-white relative shadow-[4px_4px_0_0_#000] flex flex-col font-mono text-sm leading-relaxed space-y-4">
            <div className="absolute -top-3 -left-3 bg-secondary-container px-2 py-1 border border-black text-[10px] font-bold font-mono text-black">
               ESTATUS_SISTEMA_2026
            </div>
            
            <div className="pt-2">
              <span className="font-bold text-gray-500">OPERADOR:</span> Felipe [ID_030789]
            </div>
            <div>
              <span className="font-bold text-gray-500">UBICACIÓN:</span> Quito, Ecuador <br/>
              <span className="text-xs text-gray-400">[0° 13' 47" S, 78° 31' 29" W]</span>
            </div>
            <div>
              <span className="font-bold text-gray-500">ZONA HORARIA:</span> GMT-5
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">ESTADO:</span> 
              <span className="bg-secondary-container text-black font-bold px-1 py-0.5 text-xs animate-pulse">
                OPEN_TO_WORK
              </span>
            </div>
            <div>
              <span className="font-bold text-gray-500">PROYECTOS ACTIVOS:</span><br/>
              HexaIA, La Agenda 6, Toilet Hunter.
            </div>
          </div>
        </div>
      </section>

      {/* Quote / Philosophy Section */}
      <section className="relative z-10 w-full bg-black text-white p-12 mb-32 border-l-[16px] border-secondary-container">
        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-6 block">FILOSOFÍA_DE_DISEÑO</span>
        <blockquote className="font-headline text-4xl md:text-5xl italic leading-tight mb-8">
          "La tecnología debe ser invisible para el usuario final, pero invencible para el negocio."
        </blockquote>
        <p className="font-mono text-lg max-w-3xl leading-relaxed text-gray-300">
          Mi proceso combina el rigor técnico con una estética minimalista. Creo que la eficiencia no está en añadir más funciones, sino en eliminar las innecesarias. Cada línea de código tiene un único propósito: <strong>generar resultados tangibles y medibles.</strong>
        </p>
      </section>

      {/* Capabilities Section */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-black pt-12 pb-24">
        <div className="md:col-span-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest sticky top-32 text-gray-500">
            CAPACIDADES_ESTRATEGICAS
          </h2>
        </div>
        <div className="md:col-span-9 space-y-px bg-black border border-black">
          {/* Capability 01 */}
          <div className="bg-white p-8 md:p-12 flex flex-col gap-6 items-start hover:bg-surface transition-colors duration-200 group">
            <div className="flex items-center gap-4 w-full">
              <div className="w-16 h-16 border border-black flex items-center justify-center bg-secondary-container group-hover:bg-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 0"}}>api</span>
              </div>
              <div className="flex-grow flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-gray-500">01</span>
                <h3 className="font-headline text-3xl md:text-4xl font-bold uppercase">DESARROLLO_A_MEDIDA</h3>
              </div>
            </div>
            <div className="font-mono text-[15px] leading-relaxed max-w-3xl text-gray-700 pl-0 md:pl-20">
              <p className="mb-4">Diseño soluciones de software específicas para eliminar el "trabajo fantasma". Mi enfoque es la cirugía de precisión operativa:</p>
              <ul className="space-y-3 list-none">
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> <strong>Ingeniería de Puentes (APIs):</strong> Conexión de ecosistemas desconectados para flujo de datos sin intervención humana.</li>
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> <strong>Automatización de Decisiones:</strong> Lógica algorítmica aplicada a leads, soporte y gestión de inventarios.</li>
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> <strong>Eliminación de Fricción:</strong> Transformo procesos manuales de horas en ejecuciones de segundos.</li>
              </ul>
            </div>
          </div>

          {/* Capability 02 */}
          <div className="bg-white p-8 md:p-12 flex flex-col gap-6 items-start hover:bg-surface transition-colors duration-200 group">
            <div className="flex items-center gap-4 w-full">
              <div className="w-16 h-16 border border-black flex items-center justify-center bg-secondary-container group-hover:bg-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 0"}}>neurology</span>
              </div>
              <div className="flex-grow flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-gray-500">02</span>
                <h3 className="font-headline text-3xl md:text-4xl font-bold uppercase">ARQUITECTURA_DE_IA</h3>
              </div>
            </div>
            <div className="font-mono text-[15px] leading-relaxed max-w-3xl text-gray-700 pl-0 md:pl-20">
              <ul className="space-y-3 list-none">
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> Implementación de capas de IA para procesar datos no estructurados (emails, facturas, tickets).</li>
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> Creación de agentes inteligentes que ejecutan tareas basadas en reglas de negocio específicas.</li>
              </ul>
            </div>
          </div>

          {/* Capability 03 */}
          <div className="bg-white p-8 md:p-12 flex flex-col gap-6 items-start hover:bg-surface transition-colors duration-200 group">
            <div className="flex items-center gap-4 w-full">
              <div className="w-16 h-16 border border-black flex items-center justify-center bg-secondary-container group-hover:bg-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 0"}}>cloud_sync</span>
              </div>
              <div className="flex-grow flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-gray-500">03</span>
                <h3 className="font-headline text-3xl md:text-4xl font-bold uppercase">ECOSISTEMAS_SAAS</h3>
              </div>
            </div>
            <div className="font-mono text-[15px] leading-relaxed max-w-3xl text-gray-700 pl-0 md:pl-20">
              <ul className="space-y-3 list-none">
                <li className="flex gap-2"><span className="text-secondary-container font-bold">&gt;</span> Especialista en despliegue y personalización de plataformas GHL para agencias y servicios profesionales.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section className="relative z-10 w-full mb-32 grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
        <div className="p-8 bg-black text-white flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-widest text-secondary-container mb-12">STACK_TECNICO // CORE</span>
          <h3 className="font-headline text-3xl uppercase mb-4">AI Automation & Infra structure</h3>
          <p className="font-mono text-sm text-gray-400">Custom Scripts · GHL Infrastructure · LLMs Integration</p>
        </div>
        <div className="p-8 bg-surface border-x md:border-x-black border-y-black md:border-y-0 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-widest text-primary mb-12">STACK_TECNICO // WEB</span>
          <h3 className="font-headline text-3xl uppercase mb-4">Frontend & Experience</h3>
          <p className="font-mono text-sm text-gray-700">UX/UI Design · React / Next.js · High-Conversion Landing Pages</p>
        </div>
        <div className="p-8 bg-secondary-container text-black flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-widest text-primary mb-12">STACK_TECNICO // TOOLS</span>
          <h3 className="font-headline text-3xl uppercase mb-4">Integrations & Data</h3>
          <p className="font-mono text-sm text-primary/80">API Rest · Webhooks · Serverless Functions</p>
        </div>
      </section>
    </main>
  );
}
