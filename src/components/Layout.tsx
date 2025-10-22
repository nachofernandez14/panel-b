'use client'

import { useState, useEffect } from 'react'
import CollapsibleNavBar from './CollapsibleNavBar'

interface LayoutProps {
  children: React.ReactNode
  showNavBar?: boolean
}

export default function Layout({ children, showNavBar = true }: LayoutProps) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Recuperar el estado del navbar desde localStorage
    const savedState = localStorage.getItem('navbar-collapsed')
    if (savedState !== null) {
      setNavbarCollapsed(JSON.parse(savedState))
    }
    setIsLoaded(true)

    // Habilitar animaciones después de un pequeño delay
    setTimeout(() => {
      setHasAnimated(true)
    }, 100)
  }, [])

  const handleNavbarToggle = (isCollapsed: boolean) => {
    setNavbarCollapsed(isCollapsed)
  }

  // Mostrar loading state mientras se carga el estado inicial
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        {showNavBar && <div className="fixed left-0 top-0 h-full w-64 bg-gray-200 shadow-lg z-50" />}
        <main className="ml-64">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavBar && (
        <CollapsibleNavBar onToggle={handleNavbarToggle} />
      )}
      <main className={`${
        showNavBar 
          ? navbarCollapsed 
            ? 'ml-20' 
            : 'ml-64'
          : ''
      } ${hasAnimated ? 'transition-all duration-300' : ''}`}>
        {children}
      </main>
    </div>
  )
}