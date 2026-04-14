'use client'

import { useState } from 'react'
import TerminalChat from '@/components/ui/TerminalChat'
import { useTypewriter } from '@/hooks/useTypewriter'

const HEADLINE = 'HABLEMOS DE TU PRÓXIMO PROYECTO'

function AnimatedHeadline() {
  const { displayed, done } = useTypewriter(HEADLINE, 40, 200)
  return (
    <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-16 break-words">
      {displayed}{!done && <span className="cursor-blink" aria-hidden="true" />}
    </h1>
  )
}

interface FormState {
  name: string
  email: string
  company: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string }

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? 'Error desconocido')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', company: '', message: '' })
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setStatus('error')
    }
  }

  return (
    <main className="flex-grow flex flex-col pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <div className="fixed inset-0 grid-bg pointer-events-none z-[-1]"></div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-32">

        {/* Left column */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-secondary-container border border-black"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-terminal text-gray-500">INITIATE_HANDSHAKE</span>
          </div>

          <AnimatedHeadline />

          <div className="space-y-6 flex flex-col font-terminal text-lg font-bold mb-12">
            {[
              { href: 'mailto:contact@hexaia.io', label: 'EMAIL_CONNECTION', icon: 'mail', external: false },
              { href: 'https://linkedin.com', label: 'LINKEDIN_NETWORK', icon: 'public', external: true },
              { href: 'https://github.com', label: 'GITHUB_REPOSITORY', icon: 'code', external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="border-b-2 border-black pb-2 w-fit hover:text-secondary hover:border-secondary-container transition-colors inline-flex items-center gap-4 group nav-link-underline"
              >
                {link.label}
                <span
                  className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {link.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Contact form CTA */}
          <div className="mb-8 flex flex-col items-start border-l-4 border-secondary-container pl-4">
            <h2 className="font-headline text-2xl md:text-3xl font-black uppercase flex items-center gap-3">
              LLENA ESTE FORMULARIO
              <span className="material-symbols-outlined text-secondary-container animate-bounce">arrow_downward</span>
            </h2>
            <p className="font-terminal text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wider">
              Y hablemos de los detalles de tu proyecto
            </p>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-4">FORM_DIRECT_CONTACT</div>

            {[
              { name: 'name', label: 'NOMBRE_COMPLETO', type: 'text', required: true },
              { name: 'email', label: 'EMAIL_ADDRESS', type: 'email', required: true },
              { name: 'company', label: 'EMPRESA_OPCIONAL', type: 'text', required: false },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 block mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={form[field.name as keyof FormState]}
                  onChange={handleChange}
                  className="w-full border-b border-black bg-transparent font-terminal text-sm py-2 outline-none focus:border-secondary-container transition-colors placeholder-gray-300"
                  aria-required={field.required}
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="message"
                className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 block mb-1"
              >
                MENSAJE_PROYECTO
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full border-b border-black bg-transparent font-terminal text-sm py-2 outline-none focus:border-secondary-container transition-colors placeholder-gray-300 resize-none"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-8 py-3 bg-black text-white font-terminal text-sm uppercase hover:bg-secondary-container hover:text-black transition-all shadow-[4px_4px_0_0_#bbe405] hover:shadow-[2px_2px_0_0_#bbe405] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
            >
              {status === 'sending' ? 'SENDING...' : 'TRANSMIT_MESSAGE →'}
            </button>

            {status === 'success' && (
              <p className="font-terminal text-xs text-secondary-container mt-2" role="status">
                ✓ MENSAJE RECIBIDO. Responderé en 24-48 horas.
              </p>
            )}
            {status === 'error' && (
              <p className="font-terminal text-xs text-red-600 mt-2" role="alert">
                ✗ {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Right column — Terminal Chat */}
        <div className="flex flex-col justify-start pt-4">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-gray-500 mb-4">AI_ASSISTANT_ONLINE</div>
          <div className="mb-6">
            <h2 className="font-headline text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter mb-2">
              ¿TIENES PREGUNTAS?<br />HABLA CON MI IA.
            </h2>
            <p className="font-terminal text-xs text-gray-500 leading-relaxed">
              Pregúntale sobre servicios, disponibilidad, stack técnico o cómo puedo ayudarte con tu proyecto.
            </p>
          </div>
          <TerminalChat />
          <p className="font-terminal text-[9px] text-gray-400 mt-3 leading-relaxed">
            El asistente responde preguntas sobre skills, disponibilidad y proyectos. Powered by Claude API.
          </p>
        </div>

      </section>
    </main>
  )
}
