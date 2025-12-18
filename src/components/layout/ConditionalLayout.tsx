'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import ParticleBackground from './ParticleBackground'
import Navbar from './Navbar'
import Footer from './Footer'

interface ConditionalLayoutProps {
  children: ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // Admin routes: no navbar, no footer, no particles, no main padding
  if (isAdminRoute) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }

  // Public routes: full layout with navbar, footer, particles
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
