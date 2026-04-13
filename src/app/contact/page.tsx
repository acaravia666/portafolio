import Link from "next/link";

export default function Contact() {
  return (
    <main className="flex-grow flex flex-col pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      {/* Background Decoration */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 pb-32">
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-secondary-container border border-black"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-mono text-gray-500">INITIATE_HANDSHAKE</span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-16 break-words">
            HABLEMOS DE TU PRÓXIMO PROYECTO
          </h1>
          
          <div className="space-y-6 flex flex-col font-mono text-lg font-bold">
            <a href="mailto:contact@felipe.ai" className="border-b-2 border-black pb-2 w-fit hover:text-secondary hover:border-secondary-container transition-colors inline-flex items-center gap-4">
              EMAIL_CONNECTION
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="border-b-2 border-black pb-2 w-fit hover:text-secondary hover:border-secondary-container transition-colors inline-flex items-center gap-4">
              LINKEDIN_NETWORK
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>public</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="border-b-2 border-black pb-2 w-fit hover:text-secondary hover:border-secondary-container transition-colors inline-flex items-center gap-4">
              GITHUB_REPOSITORY
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>code</span>
            </a>
          </div>
        </div>
        
        <div className="flex flex-col justify-end">
          <div className="bg-black text-white p-8 md:p-12 shadow-[8px_8px_0_0_#bbe405] relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <span className="text-[10px] tracking-widest font-mono text-gray-400 mb-6 block">SYSTEM_MESSAGE_RECIEVED</span>
            <p className="font-mono text-sm leading-relaxed mb-8">
              &gt; La automatización no es solo optimizar tiempo, es redefinir lo que tu negocio es capaz de lograr sin escalar linealmente los costos.
              <br/><br/>
              &gt; Gracias por tu interés. Los sistemas están online y listos para procesar nuevos requerimientos. Permanece a la espera de la sincronización.
            </p>
            <div className="flex justify-between items-center border-t border-white/20 pt-6">
              <span className="font-mono text-xs text-secondary-container animate-pulse">STATUS: LISTENING</span>
              <span className="font-mono text-xs text-gray-500">END_OF_TRANSMISSION</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
