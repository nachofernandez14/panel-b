import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si existe el token de autenticación
  const token = request.cookies.get('auth-token')?.value
  
  // Rutas que requieren autenticación
  const protectedPaths = ['/bandeja', '/dashboard', '/configuracion']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Si no hay token y está intentando acceder a ruta protegida
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Si hay token y está intentando acceder al login, redirigir al dashboard
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/bandeja', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}