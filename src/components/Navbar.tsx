'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md border-b border-black shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent border-transparent'
      }`}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between"
      >
        <Link
          href="/"
          className="font-mono text-xl md:text-2xl font-black uppercase tracking-tighter hover:scale-105 transition-transform"
          aria-label="HEX.vIA.sys[06] — Home"
        >
          HEX.vIA.sys[06]
        </Link>
        
        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-terminal text-[11px] uppercase tracking-widest nav-link-underline hover:text-secondary-container transition-colors"
                aria-current={
                  link.href === '/'
                    ? pathname === '/'
                      ? 'page'
                      : undefined
                    : pathname.startsWith(link.href)
                    ? 'page'
                    : undefined
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden p-2 text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-20 left-0 w-full bg-background border-t border-black overflow-hidden flex flex-col"
          >
            <div className="flex-grow flex flex-col items-center justify-center gap-8 pb-32">
              <span className="font-terminal text-[10px] uppercase text-gray-500 mb-8 blink">
                // SYSTEM_NAVIGATION_ACTIVE
              </span>
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="font-headline text-4xl uppercase font-black hover:text-secondary-container transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute bottom-10 w-full flex justify-center">
               <span className="font-terminal text-xs text-gray-400">STATUS: ONLINE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
