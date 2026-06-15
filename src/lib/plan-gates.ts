import { prisma } from './prisma'

export const PLAN_LIMITS = {
  free: {
    checklist: 20,
    guests: 30,
    budgetItems: 5,
    vendors: 3,
    inspirations: 10,
    aiMessages: 0,
    sessions: 1,
  },
  pro: {
    checklist: Infinity,
    guests: Infinity,
    budgetItems: Infinity,
    vendors: Infinity,
    inspirations: Infinity,
    aiMessages: 100,
    sessions: 3,
  },
  enterprise: {
    checklist: Infinity,
    guests: Infinity,
    budgetItems: Infinity,
    vendors: Infinity,
    inspirations: Infinity,
    aiMessages: Infinity,
    sessions: Infinity,
  },
}

export function isOwnerOrAdmin(role: string) {
  return role === 'owner' || role === 'admin'
}

export function hasUnlimitedAccess(role: string) {
  return role === 'owner'
}

export async function checkFeatureFlag(key: string, plan: string, role: string): Promise<boolean> {
  if (role === 'owner') return true
  try {
    const flag = await prisma.featureFlag.findUnique({ where: { key } })
    if (!flag || !flag.enabled) return false
    return flag.plans.includes(plan) || flag.plans.includes(role)
  } catch {
    return plan !== 'free'
  }
}

export async function checkLimit(
  weddingId: string,
  resource: keyof typeof PLAN_LIMITS.free,
  plan: string,
  role: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  if (role === 'owner') return { allowed: true, current: 0, limit: Infinity }

  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]?.[resource] ?? 0
  if (limit === Infinity) return { allowed: true, current: 0, limit: Infinity }

  const countMap: Record<string, () => Promise<number>> = {
    checklist: () => prisma.checklistItem.count({ where: { weddingId } }),
    guests: () => prisma.guest.count({ where: { weddingId } }),
    budgetItems: () => prisma.budgetItem.count({ where: { weddingId } }),
    vendors: () => prisma.vendor.count({ where: { weddingId } }),
    inspirations: () => prisma.inspiration.count({ where: { weddingId } }),
  }

  const current = countMap[resource] ? await countMap[resource]() : 0
  return { allowed: current < limit, current, limit }
}
