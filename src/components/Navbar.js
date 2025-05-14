'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Check-In', href: '/' },
    { label: 'Ticket', href: '/ticket' },
    { label: 'Admin', href: '/admin' },
    { label: 'Demo', href: '/demo' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-500/80 backdrop-blur-md border-b border-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold tracking-wide flex items-center gap-1 drop-shadow">
          ✈️ FlyMate
        </h1>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-semibold transition ${
                  pathname === item.href
                    ? 'text-white underline underline-offset-4'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
