import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEFAULT_FLAGS = [
  { key: 'ai_assistant', description: 'Assistente Valentina (IA)', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  { key: 'spotify_integration', description: 'Integração com Spotify', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  { key: 'google_calendar', description: 'Integração com Google Calendar', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  { key: 'pdf_export', description: 'Exportar PDF', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  { key: 'csv_import', description: 'Importar CSV', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  { key: 'rsvp_public', description: 'RSVP público', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
]

async function ensureDefaultFlags() {
  for (const flag of DEFAULT_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    })
  }
}

function isAdminOrOwner(role: string) {
  return role === 'owner' || role === 'admin'
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (!isAdminOrOwner(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await ensureDefaultFlags()

  const flags = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json({ flags })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (!isAdminOrOwner(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { key, description, plans, enabled } = await req.json()
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const flag = await prisma.featureFlag.create({
    data: {
      key,
      description: description || null,
      plans: plans || [],
      enabled: enabled !== undefined ? enabled : true,
    },
  })
  return NextResponse.json({ flag })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (!isAdminOrOwner(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const body = await req.json()
  const data: any = {}
  if (body.enabled !== undefined) data.enabled = body.enabled
  if (body.plans !== undefined) data.plans = body.plans
  if (body.description !== undefined) data.description = body.description

  const flag = await prisma.featureFlag.update({ where: { key }, data })
  return NextResponse.json({ flag })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (role !== 'owner') return NextResponse.json({ error: 'Only owner can delete flags' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  await prisma.featureFlag.delete({ where: { key } })
  return NextResponse.json({ success: true })
}
