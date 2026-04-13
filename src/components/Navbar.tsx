'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/projects/hexaia', label: 'PROJECTS' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-background/95 backdrop-blur-sm">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between"
      >
        <Link
          href="/"
          className="font-headline text-lg font-black uppercase tracking-tighter"
          aria-label="HexaIA — Home"
        >
          HEXA_IA
        </Link>
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-terminal text-[11px] uppercase tracking-widest nav-link-underline hover:text-secondary-container transition-colors"
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
