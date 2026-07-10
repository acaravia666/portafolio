'use client'

import { useEffect, useRef, useState } from 'react'

interface LiveEmbedProps {
  url: string
  title: string
}

export default function LiveEmbed({ url, title }: LiveEmbedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full h-full border border-black bg-surface overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">
            LOADING_LIVE_PREVIEW…
          </span>
        </div>
      )}
      {inView && (
        <iframe
          src={url}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="w-full h-full"
        />
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-secondary-container text-black border border-black px-4 py-2 font-terminal text-[10px] uppercase hover:bg-black hover:text-secondary-container transition-colors"
      >
        Abrir en vivo
        <span className="material-symbols-outlined text-sm">north_east</span>
      </a>
    </div>
  )
}
