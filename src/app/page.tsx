import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col pt-20">
      {/* Background Decoration */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>
      
      {/* Hero Section */}
      <section className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-black">
        <div className="md:col-span-12 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-secondary-container"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">STATUS: OPTIMIZING_FLOW</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-outline)] ml-4">ID: SYSTEM_001</span>
          </div>
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-primary font-headline max-w-full pb-2">
            ARQUITECTO CREATIVO DE PRODUCTOS DIGITALES Y AUTOMATIZACIÓN
          </h1>
        </div>
        <div className="md:col-span-7 border border-black p-8 bg-white relative flex flex-col justify-center min-h-[400px]">
          <div className="absolute top-4 right-4 font-mono text-[10px] text-gray-500">CORE_VISUAL_01</div>
          <img 
            alt="3D metallic mechanical brain" 
            className="w-full h-full object-contain mix-blend-multiply" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvaXcrq-xC8tDLsOAX9uG98CIyi1A-gepOw79c88hckFPr4083gAAVxTSkPUaXWX4qlarMafcpAJ8nEeg4QfeDgQsEEZ9ZRINtrRViiSIXNlSozr2wenfjYddnEmutrQgtSmO9H8jk_hXYtktF39tN01kX1gxU3i1JFZkTIM0m7CeS6OE4XX7zAPZjjXWK_C5GtB_Oe7Mh6-XULkRe_ylLZ4GDIUb76X4n-AirCCCWAfp_xWiw9bKJK5122rresj-25eb1UXKgQMo"
          />
          <div className="mt-8">
            <p className="font-body text-xl max-w-md leading-tight">
              Transformando ideas en ecosistemas digitales. Desde el diseño UX/UI y desarrollo de alto rendimiento, hasta la automatización total de tus operaciones.
            </p>
          </div>
        </div>
        <div className="md:col-span-5 flex flex-col">
          <div className="border border-black border-l-0 p-8 flex-grow bg-surface">
            <div className="font-mono text-[10px] mb-6 uppercase tracking-widest text-gray-500">TECHNICAL_SPECIFICATIONS</div>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between border-b border-black/10 pb-2">
                <span>UX_UI_SYSTEMS</span>
                <span className="text-secondary-container material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </li>
              <li className="flex justify-between border-b border-black/10 pb-2">
                <span>WEB_ENGINEERING</span>
                <span className="text-secondary-container material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </li>
              <li className="flex justify-between border-b border-black/10 pb-2">
                <span>APP_ARCHITECTURE</span>
                <span className="text-secondary-container material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </li>
              <li className="flex justify-between border-b border-black/10 pb-2">
                <span>AUTO_OPS_&_CRM</span>
                <span className="text-secondary-container material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </li>
            </ul>
          </div>
          <div className="border border-black border-l-0 border-t-0 p-8 bg-primary text-background flex flex-col justify-between group hover:bg-secondary-container hover:text-primary transition-colors cursor-pointer">
            <span className="font-mono text-[10px] uppercase">EXECUTE_PROJECT_INIT</span>
            <div className="flex justify-between items-end mt-12">
              <span className="text-4xl font-headline italic text-white group-hover:text-primary">Start Session</span>
              <span className="material-symbols-outlined text-4xl text-white group-hover:text-primary">north_east</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid / Services */}
      <section className="grid grid-cols-1 md:grid-cols-4 border-b border-black">
        {/* Highlighted Service: Web Development */}
        <div className="p-8 md:p-12 border border-black border-t-0 border-l-0 md:col-span-2 md:row-span-2 bg-primary text-white flex flex-col justify-between group cursor-crosshair relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <span className="font-mono text-[10px] uppercase border border-white/30 px-2 py-1 text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-pulse"></span>
                SERVICE_01_CORE
              </span>
              <span className="material-symbols-outlined text-secondary-container text-4xl">code_blocks</span>
            </div>
            <h3 className="text-4xl md:text-5xl mb-6 font-headline text-secondary-container leading-none uppercase">Web Engineering</h3>
            <p className="font-body text-gray-300 text-lg leading-relaxed max-w-md">Arquitecturas frontend y backend de alto rendimiento. Desarrollo de plataformas a medida orientadas a velocidad extrema, escalabilidad y conversiones implacables.</p>
          </div>
          <div className="mt-12 flex justify-between items-end border-t border-white/20 pt-6 relative z-10">
            <span className="font-mono text-[10px] uppercase text-gray-400">NEXT.JS / REACT / NODE</span>
            <span className="material-symbols-outlined text-3xl group-hover:text-secondary-container transition-colors">arrow_outward</span>
          </div>
        </div>

        <div className="p-8 border border-black border-t-0 border-l-0 md:col-span-2 bg-white flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <span className="font-mono text-[10px] uppercase border border-black px-2 py-1">SERVICE_02</span>
            <span className="material-symbols-outlined text-2xl">design_services</span>
          </div>
          <h3 className="text-3xl mb-4 font-headline uppercase leading-none">UX/UI System Design</h3>
          <p className="font-body text-gray-700 leading-relaxed">Investigación de usuarios, wireframing y diseño de interfaces premium que fusionan estética industrial con usabilidad funcional para maximizar la retención.</p>
        </div>

        <div className="p-8 border border-black border-t-0 border-l-0 bg-white flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <span className="font-mono text-[10px] uppercase border border-black px-2 py-1">SERVICE_03</span>
            <span className="material-symbols-outlined text-2xl">smartphone</span>
          </div>
          <h3 className="text-2xl mb-4 font-headline uppercase leading-none">App Architecture</h3>
          <p className="font-body text-gray-700 text-sm leading-relaxed">Sistemas móviles nativos y cross-platform iOS/Android.</p>
        </div>

        <div className="p-8 border border-black border-t-0 border-l-0 bg-secondary-container flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <span className="font-mono text-[10px] uppercase border border-black px-2 py-1 text-primary">SERVICE_04</span>
            <span className="material-symbols-outlined text-primary text-2xl">hub</span>
          </div>
          <h3 className="text-2xl mb-4 text-primary font-headline uppercase leading-none">Auto-Ops & CRM</h3>
          <p className="font-body text-primary/80 text-sm leading-relaxed">Automatización end-to-end e integraciones con GoHighLevel.</p>
        </div>
      </section>

      {/* Featured Project */}
      <section className="grid grid-cols-1 md:grid-cols-12 bg-white mb-16">
        <div className="md:col-span-5 p-12 flex flex-col justify-center border-r border-black border-b md:border-b-0">
          <div className="mb-6 flex gap-2">
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono">CASE_STUDY</span>
            <span className="px-2 py-0.5 border border-black text-[10px] font-mono">AUT_CONSULTING</span>
          </div>
          <h2 className="text-5xl font-black mb-6 leading-none font-headline">HEXA_IA</h2>
          <p className="font-body text-lg text-gray-700 mb-8">
            Cómo una agencia de servicios eliminó el caos operativo y triplicó su tasa de cierre con automatización inteligente.
          </p>
          <Link href="/projects/hexaia" className="w-fit px-8 py-3 bg-black text-white font-mono text-sm hover:bg-secondary-container hover:text-black transition-colors flex items-center gap-4">
            VIEW_FULL_INTEL
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="md:col-span-7 bg-surface relative overflow-hidden h-[400px] md:h-auto border-b border-black">
          <img 
            alt="Industrial automation arm" 
            className="w-full h-full object-cover grayscale contrast-125" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDefIlhIPnkcw0YKaEoCko3zKaHrY3pOcr6-cpXTU84rx3eCb7Ypo5u_DpSLv--5oi92UUPlcroxbmplwu6ZP4mMh1F6OvW49FvEAV-JIxP-AsPeX_FIfjBOPatoAL_01TiuI6VZdTiSLXIEbKoRLBOfRhOsGaOKgE9AIARGXaQN7DsxzV_-SVQaVjf_mt3yO1EQbL7A0L_b1oFoh247rHNbXM2NQB909dB9h1SpcygJHagxwa4Z_Sn7lF6O6g9o8MIJgjPTk-vGNQ"
          />
          <div className="absolute inset-0 bg-secondary-container/10 mix-blend-multiply"></div>
          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white bg-black p-2">
            COORDINATES: 40.4168° N, 3.7038° W
          </div>
        </div>
      </section>
    </main>
  );
}
