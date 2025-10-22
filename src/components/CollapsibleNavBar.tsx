'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavItem {
  href: string
  label: string
  icon?: string
  image?: string // Nueva propiedad para imágenes
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
  onToggle?: (isCollapsed: boolean) => void
}

const defaultNavItems: NavItem[] = [
  { 
    href: '/bandeja', 
    label: 'Bandeja de entradas', 
    image: '/icons/chat.png'
  },
  { 
    href: '/dashboard', 
    label: 'Etiquetas', 
    image: '/icons/tags.svg'
  }, 
  { 
    href: '/configuracion', 
    label: 'Configuración', 
    image: '/icons/settings.png'
  }
]

export default function NavBar({ items = defaultNavItems, className = '', onToggle }: NavBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem('navbar-collapsed')
    if (savedState !== null) {
      const collapsed = JSON.parse(savedState)
      setIsCollapsed(collapsed)
      onToggle?.(collapsed)
    }
    setIsLoaded(true)

    // Habilitar animaciones después de un pequeño delay
    setTimeout(() => {
      setHasAnimated(true)
    }, 100)
  }, [onToggle])


  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('navbar-collapsed', JSON.stringify(newState))
    onToggle?.(newState)
  }

  const handleLogout = () => {
    // Eliminar cookie de autenticación
    document.cookie = 'auth-token=; path=/; max-age=0'
    // Redirigir al login
    router.push('/login')
  }
  if (!isLoaded) {
    return <div className="fixed left-0 top-0 h-full w-64 bg-gray-200 shadow-lg z-50" />
  }

  return (
    <nav className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-22' : 'w-64'} bg-gray-200 text-gray-800 shadow-lg z-50 transition-all duration-300 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header del NavBar */}
        <div className="p-6 border-b border-gray-300 flex items-center justify-between">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <h2 className="text-xl font-bold text-gray-800">
              Panel B&B
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Navegación
            </p>
          </div>
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            <span className="text-xl">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>

        {/* Lista de navegación */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {items.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {/* Prioridad: imagen > icon > fallback */}
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      ) : item.icon ? (
                        <span className="text-xl">{item.icon}</span>
                      ) : (
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                    <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-blue-600'} ${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Footer del NavBar */}
        <div className="p-4 border-t border-gray-300">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="flex items-center justify-between">
              <img 
                src="/icons/profile-f.svg" 
                alt="Facundo Mendez"
                className="w-8 h-8 rounded-full m-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 truncate">Facundo Mendez</h3>
                <p className="text-xs text-gray-500 truncate">holacomoestas@gmail.com</p>
              </div>
            </div>
            <div>
              <button 
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded transition-colors"
              >
                <img src="/icons/logout.png" alt="" className="inline-block w-4 h-4 mr-2"/>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}