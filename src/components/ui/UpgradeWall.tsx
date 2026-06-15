'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UpgradeWallProps {
  resource: string
  current: number
  limit: number
  plan: string
  feature?: string
}

export function UpgradeWall({ resource, current, limit, plan, feature }: UpgradeWallProps) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  if (!open) return null

  const resourceLabels: Record<string, string> = {
    checklist: 'itens do checklist',
    guests: 'convidados',
    budgetItems: 'itens do orçamento',
    vendors: 'fornecedores',
    inspirations: 'inspirações',
  }
  const label = resourceLabels[resource] ?? resource

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          background: '#fdf8f5',
          borderRadius: 16,
          padding: '2rem',
          maxWidth: 420,
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1c1917',
            marginBottom: 8,
          }}
        >
          Você atingiu o limite do plano gratuito
        </h2>

        {feature && (
          <p style={{ color: '#7c3aed', fontWeight: 600, marginBottom: 8 }}>
            Esta funcionalidade requer o plano Pro
          </p>
        )}

        <p style={{ color: '#78716c', marginBottom: 16 }}>
          {current} de {limit} {label} utilizados
        </p>

        {/* Progress bar */}
        <div
          style={{
            background: '#e7e5e4',
            borderRadius: 999,
            height: 8,
            marginBottom: 24,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#f43f5e',
              borderRadius: 999,
            }}
          />
        </div>

        <button
          onClick={() => router.push('/pricing')}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 0',
            background: '#f43f5e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          Fazer upgrade para Pro — R$ 39/mês
        </button>

        <button
          onClick={() => setOpen(false)}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 0',
            background: 'transparent',
            color: '#78716c',
            border: '1px solid #d6d3d1',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Continuar no gratuito
        </button>
      </div>
    </div>
  )
}

export function PlanBadge({ plan }: { plan: string }) {
  const config: Record<string, { label: string; bg: string; color: string }> = {
    free: { label: 'Gratuito', bg: '#e7e5e4', color: '#78716c' },
    pro: { label: 'Pro', bg: '#ffe4e6', color: '#f43f5e' },
    enterprise: { label: 'Enterprise', bg: '#fef9c3', color: '#d4af37' },
    owner: { label: 'Owner', bg: '#ede9fe', color: '#7c3aed' },
  }

  const { label, bg, color } = config[plan] ?? config.free

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  )
}
