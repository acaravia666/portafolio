import Link from 'next/link'
import type { Project } from '@/types/project'
import BrowserFrame from '@/components/ui/BrowserFrame'

function hostOf(url?: string) {
  if (!url) return ''
  try { return new URL(url).host } catch { return url }
}

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.featured ? `/work/${project.slug}` : (project.liveUrl ?? '#')
  const external = !project.featured
  const shot = project.screenshots.find((s) => s.device === 'desktop')

  const inner = (
    <div className="flex flex-col h-full">
      {project.visual === 'screenshot' && shot ? (
        <BrowserFrame src={shot.src} alt={shot.alt} url={hostOf(project.liveUrl)} />
      ) : (
        <div className="border border-black bg-ink text-white p-8 min-h-[260px] flex flex-col justify-between">
          <div className="flex justify-between font-terminal text-[10px] text-gray-400 uppercase">
            <span>{project.category}</span>
            <span className="text-secondary-container">● {project.status}</span>
          </div>
          <h3 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mt-8">
            {project.name}
          </h3>
        </div>
      )}
      <div className="pt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-headline text-xl font-black uppercase leading-none">{project.name}</h3>
          <p className="font-body text-sm text-gray-600 mt-1">{project.tagline}</p>
        </div>
        <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">
          {external ? 'north_east' : 'arrow_forward'}
        </span>
      </div>
    </div>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <Link href={href} className="group block">{inner}</Link>
  )
}
