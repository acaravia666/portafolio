import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black flex justify-between items-center px-6 py-4 max-w-full">
      <div className="text-2xl font-black text-black font-mono tracking-tighter leading-none">
        <Link href="/">HEX.vIA.sys[06]</Link>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <Link
          className="font-mono tracking-tighter leading-none text-gray-500 hover:text-black hover:border-b-2 hover:border-lime-400 hover:pb-1 cursor-crosshair transition-colors duration-75"
          href="/"
        >
          WELCOME
        </Link>
        <Link
          className="font-mono tracking-tighter leading-none text-gray-500 hover:text-black hover:border-b-2 hover:border-lime-400 hover:pb-1 cursor-crosshair transition-colors duration-75"
          href="/about"
        >
          ABOUT
        </Link>
        <Link
          className="font-mono tracking-tighter leading-none text-gray-500 hover:text-black hover:border-b-2 hover:border-lime-400 hover:pb-1 cursor-crosshair transition-colors duration-75"
          href="/projects/hexaia"
        >
          PROJECTS
        </Link>
        <Link
          className="font-mono tracking-tighter leading-none text-gray-500 hover:text-black hover:border-b-2 hover:border-lime-400 hover:pb-1 cursor-crosshair transition-colors duration-75"
          href="/contact"
        >
          CONTACT
        </Link>
      </div>
      <div className="font-mono tracking-tighter leading-none text-black hover:bg-secondary-container p-1 transition-colors cursor-crosshair">
        EN/ES
      </div>
    </nav>
  );
}
