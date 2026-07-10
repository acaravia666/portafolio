export default function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-6 md:px-12 pt-12 pb-6 flex items-center gap-4">
      <span className="font-terminal text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <div className="flex-1 h-px bg-black/10" />
    </div>
  )
}
