import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/users', process.env.NEXTAUTH_URL ?? 'http://localhost:3000'))

  const clearOpts = { maxAge: 0, path: '/', httpOnly: false, sameSite: 'lax' as const }
  response.cookies.set('__impersonating', '', clearOpts)
  response.cookies.set('__impersonated_by', '', clearOpts)
  response.cookies.set('__impersonated_by_name', '', clearOpts)
  response.cookies.set('__impersonated_user_name', '', clearOpts)
  response.cookies.set('__impersonated_user_id', '', clearOpts)

  return response
}
