'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon?: string
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
}

const defaultNavItems: NavItem[] = [
  { href: '/', label: 'Bandeja de entradas', icon: '' },
  { href: '/dashboard', label: 'Etiquetas', icon: '' }, 
  { href: '/configuracion', label: 'Configuracion', icon: '' },
]

export default function NavBar({ items = defaultNavItems, className = '' }: NavBarProps) {
  const pathname = usePathname()
  
  console.log('NavBar renderizado:', pathname)
  
  return (
    <nav className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 ${className}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Panel B&B 
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Dashboard Principal
          </p>
        </div>
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
                        ? 'bg-blue-200 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {item.icon && (
                      <span className="text-xl">{item.icon}</span>
                    )}
                    <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-blue-200'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <img src="" alt=""/>
            <h3>Facundo Mendez</h3>
            <p>holacomoestas@gmail.com</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
