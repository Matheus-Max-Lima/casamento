'use client'

import { useEffect, useState } from 'react'

interface FeatureFlag {
  id: string
  key: string
  description: string | null
  enabled: boolean
  plans: string[]
}

const ALL_PLANS = ['free', 'pro', 'enterprise', 'owner']
const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  free: { bg: '#e5e7eb', color: '#374151' },
  pro: { bg: '#fda4af', color: '#9f1239' },
  enterprise: { bg: '#fde68a', color: '#78350f' },
  owner: { bg: '#ddd6fe', color: '#5b21b6' },
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPlans, setNewPlans] = useState<string[]>(['pro', 'enterprise', 'owner'])
  const [saving, setSaving] = useState(false)

  const fetchFlags = () => {
    setLoading(true)
    fetch('/api/admin/flags')
      .then((r) => r.json())
      .then((data) => { setFlags(data.flags || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFlags() }, [])

  const toggleEnabled = async (key: string, enabled: boolean) => {
    await fetch(`/api/admin/flags?key=${encodeURIComponent(key)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
    fetchFlags()
  }

  const togglePlan = async (key: string, plan: string, currentPlans: string[]) => {
    const plans = currentPlans.includes(plan)
      ? currentPlans.filter((p) => p !== plan)
      : [...currentPlans, plan]
    await fetch(`/api/admin/flags?key=${encodeURIComponent(key)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plans }),
    })
    fetchFlags()
  }

  const handleDelete = async (key: string) => {
    if (!confirm(`Remover flag "${key}"?`)) return
    await fetch(`/api/admin/flags?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
    fetchFlags()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey.trim()) return
    setSaving(true)
    await fetch('/api/admin/flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: newKey.trim(), description: newDesc.trim() || null, plans: newPlans }),
    })
    setShowModal(false)
    setNewKey('')
    setNewDesc('')
    setNewPlans(['pro', 'enterprise', 'owner'])
    setSaving(false)
    fetchFlags()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#1a1a2e', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Feature Flags</h1>
          <p style={{ color: '#888' }}>{flags.length} flag(s) configurada(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}
        >
          + Nova flag
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#888', padding: 40 }}>Carregando...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {flags.map((flag) => (
            <div key={flag.key} style={{
              background: '#fff', borderRadius: 12, padding: '20px 24px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
              borderLeft: `4px solid ${flag.enabled ? '#16a34a' : '#d1d5db'}`,
              display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            }}>
              {/* Toggle */}
              <button
                onClick={() => toggleEnabled(flag.key, !flag.enabled)}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: flag.enabled ? '#16a34a' : '#d1d5db',
                  border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                title={flag.enabled ? 'Desativar' : 'Ativar'}
              >
                <span style={{
                  position: 'absolute', top: 3, left: flag.enabled ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s',
                }} />
              </button>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, color: '#1a1a2e', fontFamily: 'monospace', fontSize: 14 }}>
                  {flag.key}
                </div>
                {flag.description && (
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{flag.description}</div>
                )}
              </div>

              {/* Plans chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ALL_PLANS.map((plan) => {
                  const active = flag.plans.includes(plan)
                  const colors = PLAN_COLORS[plan]
                  return (
                    <button
                      key={plan}
                      onClick={() => togglePlan(flag.key, plan, flag.plans)}
                      style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        border: active ? 'none' : '1px dashed #d1d5db',
                        background: active ? colors.bg : 'transparent',
                        color: active ? colors.color : '#9ca3af',
                        cursor: 'pointer', textTransform: 'uppercase' as const,
                        transition: 'all 0.15s',
                      }}
                    >
                      {plan}
                    </button>
                  )
                })}
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(flag.key)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1 }}
                title="Remover flag"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New flag modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, maxWidth: '90vw' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Nova Feature Flag</h2>
            <form onSubmit={handleCreate}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 4 }}>Key (snake_case)</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="ex: new_feature"
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, outline: 'none', marginBottom: 14, boxSizing: 'border-box' as const }}
              />
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 4 }}>Descrição</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Descrição opcional..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, outline: 'none', marginBottom: 14, boxSizing: 'border-box' as const }}
              />
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Planos com acesso</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {ALL_PLANS.map((plan) => {
                  const active = newPlans.includes(plan)
                  const colors = PLAN_COLORS[plan]
                  return (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setNewPlans(active ? newPlans.filter(p => p !== plan) : [...newPlans, plan])}
                      style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        border: active ? 'none' : '1px dashed #d1d5db',
                        background: active ? colors.bg : 'transparent',
                        color: active ? colors.color : '#9ca3af',
                        cursor: 'pointer', textTransform: 'uppercase' as const,
                      }}
                    >
                      {plan}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving || !newKey.trim()}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: newKey.trim() ? '#f43f5e' : '#e5e7eb', color: newKey.trim() ? '#fff' : '#aaa', fontWeight: 600, fontSize: 14, cursor: newKey.trim() ? 'pointer' : 'default' }}>
                  {saving ? 'Criando...' : 'Criar flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
