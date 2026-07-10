import Link from 'next/link'
import type { Project } from '@/types/project'

export default function FlagshipCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative flex flex-col h-full border border-black bg-[#0a0a0a] text-white overflow-hidden texture-carbon"
    >
      <div className="relative z-10 p-8 md:p-10 flex flex-col flex-1 min-h-[280px]">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-secondary-container text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
            CASE_STUDY
          </span>
          <span className="font-terminal text-[10px] text-gray-400 uppercase tracking-widest">
            {project.category}
          </span>
        </div>
        <h3 className="font-headline text-4xl md:text-6xl font-black uppercase leading-none group-hover:text-secondary-container transition-colors">
          {project.name}
        </h3>
        <p className="font-body text-gray-400 text-base md:text-lg max-w-md mt-4">{project.tagline}</p>
        <div className="mt-auto pt-10 flex justify-between items-end border-t border-white/15">
          <span className="font-terminal text-[10px] text-gray-500 uppercase">{project.stack.slice(0, 3).join(' · ')}</span>
          <span className="material-symbols-outlined text-3xl text-gray-500 group-hover:text-secondary-container transition-colors">arrow_forward</span>
        </div>
      </div>
    </Link>
  )
}
