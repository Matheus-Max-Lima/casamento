import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  const secret = process.env.NEXTAUTH_SECRET!

  let payload: any
  try {
    payload = jwt.verify(token, secret)
  } catch {
    return NextResponse.redirect(new URL('/admin?error=invalid_token', req.url))
  }

  const { sub: targetUserId, impersonatedBy: adminId } = payload

  // Look up admin name for banner display
  const adminUser = await prisma.user.findUnique({ where: { id: adminId }, select: { name: true, email: true } })
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }, select: { name: true, email: true } })

  if (!targetUser) {
    return NextResponse.redirect(new URL('/admin?error=user_not_found', req.url))
  }

  const adminName = adminUser?.name || adminUser?.email || adminId
  const targetName = targetUser?.name || targetUser?.email || targetUserId

  const response = NextResponse.redirect(new URL('/dashboard', req.url))

  // Set impersonation cookies (httpOnly for security, but readable by server)
  const oneHour = 60 * 60
  const cookieOpts = { httpOnly: false, maxAge: oneHour, path: '/', sameSite: 'lax' as const }
  response.cookies.set('__impersonating', 'true', cookieOpts)
  response.cookies.set('__impersonated_by', adminId, cookieOpts)
  response.cookies.set('__impersonated_by_name', adminName, cookieOpts)
  response.cookies.set('__impersonated_user_name', targetName, cookieOpts)
  response.cookies.set('__impersonated_user_id', targetUserId, cookieOpts)

  return response
}
