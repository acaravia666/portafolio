export default function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 border border-black font-terminal text-[10px] uppercase tracking-wider">
      {children}
    </span>
  )
}
