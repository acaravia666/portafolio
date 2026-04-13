export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-black flex justify-between items-center px-6 py-2 z-50">
      <div className="font-mono text-[10px] uppercase tracking-widest text-black">
        ©2024 FELIPE_AI
      </div>
      <div className="flex gap-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-black hover:underline decoration-secondary-container decoration-2">
          LOC: MADRID, ES
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-black hover:underline decoration-secondary-container decoration-2">
          GMT: +1
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-black hover:underline decoration-secondary-container decoration-2">
          VER: 2.0.4-BETA
        </span>
      </div>
    </footer>
  );
}
