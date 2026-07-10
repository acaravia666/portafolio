import Image from 'next/image'

interface BrowserFrameProps {
  src: string
  alt: string
  /** URL label shown in the chrome bar */
  url?: string
  priority?: boolean
  sizes?: string
}

export default function BrowserFrame({ src, alt, url, priority, sizes }: BrowserFrameProps) {
  return (
    <div className="group border border-black bg-white shadow-[6px_6px_0_0_#bbe405] transition-shadow duration-300 hover:shadow-[3px_3px_0_0_#bbe405]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10">
        <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
        {url && (
          <span className="ml-3 font-terminal text-[9px] text-gray-400 truncate">{url}</span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
          priority={priority}
          className="object-cover object-top grayscale contrast-110 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  )
}
