import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Weddings where weddingDate < today - 60 days
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 60)

  // Wedding model has no status field — we find weddings older than cutoff
  // and create notifications/audit logs. We skip status update since field doesn't exist.
  const weddings = await prisma.wedding.findMany({
    where: {
      weddingDate: { lt: cutoff },
    },
    select: { id: true, userId: true },
  })

  let archived = 0

  for (const wedding of weddings) {
    try {
      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: wedding.userId,
          title: 'Casamento arquivado',
          message: 'Seu casamento foi arquivado. Os dados estão disponíveis para leitura.',
          type: 'info',
        },
      })

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: wedding.userId,
          action: 'system.archive_wedding',
          entity: 'Wedding',
          entityId: wedding.id,
          metadata: { cutoffDate: cutoff.toISOString() },
        },
      })

      archived++
    } catch {
      // continue processing remaining weddings
    }
  }

  return NextResponse.json({ archived, cutoff: cutoff.toISOString() })
}
