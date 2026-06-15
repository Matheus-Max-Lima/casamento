import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminRole = (session.user as any).role as string
  if (adminRole !== 'owner' && adminRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const adminId = (session.user as any).id as string
  const { targetUserId, reason } = await req.json()

  if (!targetUserId) return NextResponse.json({ error: 'targetUserId required' }, { status: 400 })

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, name: true, email: true } })
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Create impersonation log
  await prisma.impersonationLog.create({
    data: {
      adminUserId: adminId,
      impersonatedId: targetUserId,
      reason: reason || null,
    },
  })

  // Sign a short-lived impersonation token
  const secret = process.env.NEXTAUTH_SECRET!
  const token = jwt.sign(
    { sub: targetUserId, impersonatedBy: adminId },
    secret,
    { expiresIn: '1h' }
  )

  const callbackUrl = `/api/auth/impersonate-callback?token=${encodeURIComponent(token)}`
  return NextResponse.json({ redirectUrl: callbackUrl })
}
