import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || ''
  const action = searchParams.get('action') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const format = searchParams.get('format') || ''

  const pageSize = 50

  const where: any = {}

  if (userId) {
    where.userId = userId
  }
  if (action) {
    where.action = { contains: action, mode: 'insensitive' }
  }
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(23, 59, 59, 999)
      where.createdAt.lte = toDate
    }
  }

  // CSV export — no pagination, max 10000
  if (format === 'csv') {
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10000,
      include: { user: { select: { name: true, email: true } } },
    })

    const header = ['Data/hora', 'Usuário', 'Email', 'Ação', 'Entidade', 'EntityId', 'IP', 'UserAgent']
    const rows = logs.map((l) => [
      new Date(l.createdAt).toISOString(),
      l.user?.name || '',
      l.user?.email || '',
      l.action,
      l.entity || '',
      l.entityId || '',
      l.ip || '',
      (l.userAgent || '').replace(/,/g, ';'),
    ])

    const csvContent = [header, ...rows].map((r) => r.join(',')).join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  const skip = (page - 1) * pageSize
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ])

  return NextResponse.json({ logs, total, page, pageSize })
}
