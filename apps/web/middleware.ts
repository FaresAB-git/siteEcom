// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Liste des routes protégées
const protectedRoutes = ['/admin','/admin/collection', '/admin/product','/admin/command', '/admin/stock']

export function middleware(request: NextRequest) {
  console.log('middleware');

  const token = request.cookies.get('access_token')?.value

  const { pathname } = request.nextUrl

  // Si la route est protégée mais qu'on n'a pas de token => redirection vers la page de login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Sinon on continue normalement
  return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'], // Applique le middleware à toutes les routes /admin/*
  }
  