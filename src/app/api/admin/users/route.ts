import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdminOrOwner(role: string) {
  return role === 'owner' || role === 'admin'
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (!isAdminOrOwner(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        wedding: {
          select: {
            brideName: true,
            groomName: true,
            weddingDate: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, page, pageSize })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const callerRole = (session.user as any).role as string
  if (!isAdminOrOwner(callerRole)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const body = await req.json()
  const data: Record<string, string> = {}
  if (body.plan) data.plan = body.plan
  if (body.role) {
    // Only owner can assign admin/owner roles
    if (body.role === 'owner' && callerRole !== 'owner') {
      return NextResponse.json({ error: 'Only owner can assign owner role' }, { status: 403 })
    }
    data.role = body.role
  }

  const updated = await prisma.user.update({ where: { id: userId }, data })
  return NextResponse.json({ success: true, user: updated })
}
