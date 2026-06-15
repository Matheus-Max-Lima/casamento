import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    activeUsers,
    freePlan,
    proPlan,
    enterprisePlan,
    activeWeddings,
    completedWeddings,
    aiMessages,
    recentUsers,
    recentLogs,
    allUsersForChart,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastLoginAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { plan: 'free' } }),
    prisma.user.count({ where: { plan: 'pro' } }),
    prisma.user.count({ where: { plan: 'enterprise' } }),
    prisma.wedding.count({ where: { weddingDate: { gt: now } } }),
    prisma.wedding.count({ where: { weddingDate: { lt: now } } }),
    prisma.auditLog.count({ where: { action: 'ai.chat' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Group registrations by day (last 30 days)
  const registrationsByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    registrationsByDay[key] = 0
  }
  for (const u of allUsersForChart) {
    const key = u.createdAt.toISOString().slice(0, 10)
    if (key in registrationsByDay) registrationsByDay[key]++
  }

  const chartData = Object.entries(registrationsByDay).map(([date, count]) => ({ date, count }))

  return NextResponse.json({
    totalUsers,
    activeUsers,
    plans: { free: freePlan, pro: proPlan, enterprise: enterprisePlan },
    activeWeddings,
    completedWeddings,
    aiMessages,
    recentUsers,
    recentLogs,
    chartData,
  })
}
