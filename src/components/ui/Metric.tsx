import type { ProjectMetric } from '@/types/project'

export default function Metric({ label, value }: ProjectMetric) {
  return (
    <div>
      <span className="font-terminal text-[10px] text-gray-500 block mb-1">{label}</span>
      <span className="font-headline text-2xl font-black text-secondary-container">{value}</span>
    </div>
  )
}
