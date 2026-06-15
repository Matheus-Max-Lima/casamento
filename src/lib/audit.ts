import { prisma } from './prisma'
import { NextRequest } from 'next/server'

export async function logAudit(
  userId: string,
  action: string,
  options?: {
    entity?: string
    entityId?: string
    metadata?: Record<string, unknown>
    req?: NextRequest
  }
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: options?.entity,
        entityId: options?.entityId,
        metadata: (options?.metadata ?? undefined) as any,
        ip: options?.req?.headers.get('x-forwarded-for') ?? options?.req?.headers.get('x-real-ip'),
        userAgent: options?.req?.headers.get('user-agent'),
      }
    })
  } catch {
    // never throw — audit is best-effort
  }
}
