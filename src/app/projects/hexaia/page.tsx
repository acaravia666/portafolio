import Link from "next/link";
import Image from "next/image";

export default function HexaIAProject() {
  return (
    <main className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="px-6 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-secondary-container transition-colors group"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1" style={{fontVariationSettings: "'FILL' 1"}}>arrow_back</span>
          VOLVER_AL_INICIO
        </Link>
      </div>

      {/* Project Hero Section */}
      <section className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-0 border-y border-black">
        {/* Project Title & Description */}
        <div className="lg:col-span-7 border-r-0 lg:border-r border-black pb-12 lg:pb-24 pt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-tighter">PROJECT_ID: 0x48657861</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-secondary-container border border-black"></span>
              STATUS: COMPLETED
            </span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase break-words">
            HEXAIA
          </h1>
          <p className="mt-12 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
            Cómo una agencia de servicios eliminó el caos operativo y triplicó su tasa de cierre con automatización inteligente.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <button className="bg-primary text-background px-8 py-4 font-mono font-bold uppercase tracking-widest border border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000] flex items-center gap-3">
              VER_PLATAFORMA
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>north_east</span>
            </button>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="lg:col-span-5 bg-surface flex flex-col justify-between font-mono">
          <div className="p-8 border-b border-black/10 flex-grow pt-12">
            <div className="space-y-12">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">DETALLES_CLAVE</span>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between border-b border-black/5 pb-1">
                    <span className="font-bold">INDUSTRIA</span>
                    <span className="text-secondary uppercase">Consultoría</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-black/5 pb-1">
                    <span className="font-bold">TAMAÑO</span>
                    <span>3–8 personas</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-black/5 pb-1">
                    <span className="font-bold">SOLUCIÓN</span>
                    <span className="text-right">Automatización & CRM<br/>(GoHighLevel)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block mb-4">MÉTRICAS_LOGRADAS</span>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] font-bold block">TASA CONTACTO 24H</span>
                    <span className="text-xl font-bold uppercase text-secondary-container bg-black px-1 mt-1 inline-block">+210%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block">TIEMPO ADMIN</span>
                    <span className="text-xl font-bold uppercase">-65%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block">TASA DE CIERRE</span>
                    <span className="text-xl font-bold uppercase">18% &rarr; 47%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-black text-white">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
              <div className="text-[10px] tracking-widest">
                AUTOMATION_NODE_ACTIVE<br/>
                LAT: 40.4168° N | LNG: 3.7038° W
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Imagery Layout - Photorealistic Mockups */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-black">
        <div className="aspect-square border-b md:border-b-0 border-r-0 md:border-r border-black relative group overflow-hidden bg-surface">
          <Image
            className="w-full h-full object-cover grayscale transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9O6Uvl1cpVmbLcsTZ45uejnnVQBDA81iogBzxvWq3CEuhEY7BBqWzDUf8fUqW7RD94wAukE8kIY_UA4pQfawDjpMTCfgrXTLLoFYq-zAwBS4BWMZTapywBhddMXMlvLahIBu_Q_-GDeee2IUh7EypQwchO31LLkVgJ5RuA-DufLCcJ9BX3WDXLU80MPfssdJhCn-6iCyXk6LJfuGe-wsVeEG2SE6-DEP6FrwtUJNIgmV5eGBw3d_cm7R6OVrS8x0kCNPalfyOQ34"
            alt="HexaIA interface mockup"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">MOCKUP_01</div>
        </div>
        <div className="aspect-square border-b md:border-b-0 border-r-0 lg:border-r border-black relative group overflow-hidden bg-surface">
          <Image
            className="w-full h-full object-cover grayscale transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdhduk1GJBqUDWic5c4qcxhu4Pt7BePhQLONXE2_yQ90s0LLcRgzO9CJ1uR4ieGsvSTHMjdYSPA7REuNak53pymDwvmnuW0wWkKC_vCazbM0IJvo41h2D-us15mmM4aplTzT5QgKCQh8Gr0Q5wClohTnJZsMaye3WiEtXOYDqQRNEr2CZMQk0_VK7RnrwkGIBfStkPB1k7mmlVhLftMMIp7Axb3_Dinr3ClNqbjKIRUz2Wn6sLX_1yhA6a9wTJ6eMbFAexsXZ38w0"
            alt="Node architecture schematic"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">SYSTEM_NODES_02</div>
        </div>
        <div className="aspect-square col-span-1 md:col-span-2 lg:col-span-1 relative group overflow-hidden bg-surface">
          <Image
            className="w-full h-full object-cover grayscale transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqqCcma-59r1-A-BXEZq1ig9zknQmk-nfPry29gG9U0XkYlyCE0kHFSusGgUHXUfu6t_X3J25chsL1HY6zp7FkL-nuQpCByBa44bhUTeMfL0zCh5A6uUZERwQG0MBMsezB4fb31QbCvKA6JoSBpZwdPGPusjJhKetxONC_2jyB74bbsxducX47gx-t5sjClUoBERozx7CrZXkKqsT9AZoIzEqXbDu_GghlkA5PiJSVV_If-EpaeTkwX1lZRszjQ-Rotkz4IVFV1yU"
            alt="HexaIA architecture contextual"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-4 left-4 font-mono text-[10px] bg-white px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] z-10">CONTEXTUAL_03</div>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className="px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24 max-w-7xl mx-auto">
        <div className="lg:col-span-4 sticky top-32">
          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            EL<br/>PROBLEMA
          </h2>
          <div className="w-16 h-2 bg-secondary-container mb-6 border border-black"></div>
          <p className="font-mono text-sm leading-relaxed text-gray-700">
            Nexo Consultores era una firma boutique con un producto sólido y clientes satisfechos. Sin embargo, a medida que aumentaba su volumen de prospectos, el equipo se enfrentaba a una paradoja: cuanto más leads generaban, menos cerraban. La raíz no era la calidad de su servicio, era la ausencia de sistemas.
          </p>
        </div>
        
        <div className="lg:col-span-8 space-y-12">
          {/* Fricciones Element */}
          <div className="border border-black p-8 bg-white shadow-[4px_4px_0_0_#000000]">
            <h3 className="font-bold font-headline text-3xl mb-8 flex items-center gap-3">
              <span className="w-4 h-4 bg-secondary-container border border-black"></span>
              4 FRICCIONES CRÍTICAS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-2 font-mono uppercase">1. Seguimiento Manual</h4>
                <p className="text-gray-700">Dependencia de hojas de cálculo. Tiempo promedio de primer contacto superior a 6 horas, resultando en leads perdidos.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 font-mono uppercase">2. Agenda Fragmentada</h4>
                <p className="text-gray-700">Coordinación manual por WhatsApp. 35% de prospectos no se presentaba a la llamada. Alto consumo de tiempo para reagendar.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 font-mono uppercase">3. Comunicación en Silos</h4>
                <p className="text-gray-700">WhatsApp, Instagram, email y CRM desconectados. Experiencia inconsistente para el prospecto y frustrante para el equipo.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 font-mono uppercase">4. Operación a Ciegas</h4>
                <p className="text-gray-700">Sin visibilidad del pipeline. Decisiones de inversión en marketing tomadas por pura intuición, sin medición de conversión por fuente.</p>
              </div>
            </div>
          </div>

          <div className="mt-24 mb-16 h-px w-full bg-black/20"></div>

          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-12">
            LA SOLUCIÓN
          </h2>

          <div className="space-y-6">
            <div className="border border-black p-6 bg-surface flex gap-6 hover:bg-secondary-container transition-colors items-start">
              <div className="font-headline text-5xl font-black text-black/20">01</div>
              <div>
                <h3 className="font-bold text-xl mb-2 uppercase">Centralización de Canales</h3>
                <p className="text-gray-700">Bandeja omnicanal de HexaIA unificando Meta, Instagram, email y WhatsApp en un solo hilo. Visión 360 del prospecto (Semana 1-2).</p>
              </div>
            </div>
            <div className="border border-black p-6 bg-surface flex gap-6 hover:bg-secondary-container transition-colors items-start">
              <div className="font-headline text-5xl font-black text-black/20">02</div>
              <div>
                <h3 className="font-bold text-xl mb-2 uppercase">Automatización y Nurturing</h3>
                <p className="text-gray-700">Respuesta instantánea en menos de 90s, envío automático de lead magnet, y secuencias de 5 días. Notificación al equipo solo cuando el lead está listo (Semana 2-3).</p>
              </div>
            </div>
            <div className="border border-black p-6 bg-surface flex gap-6 hover:bg-secondary-container transition-colors items-start">
              <div className="font-headline text-5xl font-black text-black/20">03</div>
              <div>
                <h3 className="font-bold text-xl mb-2 uppercase">Sistema de Agendamiento</h3>
                <p className="text-gray-700">Calendario inteligente con confirmaciones y recordatorios automáticos (24h/1h antes), opción de reagendamiento 1-clic. Cero intervención humana (Semana 3-4).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-24 px-6 text-center overflow-hidden relative border-t border-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden font-black text-[20vw] leading-none text-white/20 whitespace-nowrap -rotate-12 translate-y-24">
          HEXAIA HEXAIA HEXAIA
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-2xl mx-auto leading-tight">
            ESCALABILIDAD SIN CAOS OPERATIVO
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/contact" className="bg-secondary-container text-black px-12 py-6 font-bold uppercase tracking-widest text-lg md:text-xl hover:bg-white transition-colors border border-black shadow-[4px_4px_0_0_#FFFFFF]">
              INICIAR DIAGNÓSTICO
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
