'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface UserRow {
  id: string
  name: string | null
  email: string | null
  plan: string
  role: string
  createdAt: string
  lastLoginAt: string | null
  wedding: { brideName: string; groomName: string; weddingDate: string } | null
}

interface ImpersonateModal {
  userId: string
  userName: string
}

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  free: { bg: '#e5e7eb', color: '#374151' },
  pro: { bg: '#fda4af', color: '#9f1239' },
  enterprise: { bg: '#fde68a', color: '#78350f' },
}
const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  owner: { bg: '#ddd6fe', color: '#5b21b6' },
  admin: { bg: '#bfdbfe', color: '#1e40af' },
  user: { bg: '#e5e7eb', color: '#374151' },
}

function Badge({ label, colors }: { label: string; colors: { bg: string; color: string } }) {
  return (
    <span style={{
      background: colors.bg,
      color: colors.color,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase' as const,
    }}>{label}</span>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [impersonateModal, setImpersonateModal] = useState<ImpersonateModal | null>(null)
  const [impersonateReason, setImpersonateReason] = useState('')
  const [impersonating, setImpersonating] = useState(false)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => { setUsers(data.users || []); setTotal(data.total || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handlePlanChange = async (userId: string, plan: string) => {
    await fetch(`/api/admin/users?userId=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    fetchUsers()
  }

  const handleRoleChange = async (userId: string, role: string) => {
    await fetch(`/api/admin/users?userId=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    fetchUsers()
  }

  const handleImpersonate = async () => {
    if (!impersonateModal) return
    setImpersonating(true)
    const res = await fetch('/api/admin/users/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: impersonateModal.userId, reason: impersonateReason }),
    })
    const data = await res.json()
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl
    }
    setImpersonating(false)
    setImpersonateModal(null)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Usuários</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>{total} usuário(s) no total</p>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar por nome ou email..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#f43f5e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Buscar
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
            style={{ background: '#e5e7eb', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 }}
          >
            Limpar
          </button>
        )}
      </form>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, color: '#888', textAlign: 'center' }}>Carregando...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                {['Avatar', 'Nome / Email', 'Plano', 'Role', 'Cadastro', 'Último acesso', 'Casamento', 'Ações'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: '#fda4af', color: '#9f1239',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14,
                    }}>
                      {(u.name || u.email || '?')[0].toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{u.name || '—'}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={u.plan}
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13 }}
                    >
                      {['free', 'pro', 'enterprise'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <div><Badge label={u.plan} colors={PLAN_COLORS[u.plan] || PLAN_COLORS.free} /></div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {u.role !== 'owner' ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13 }}
                      >
                        {['user', 'admin'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : null}
                    <div><Badge label={u.role} colors={ROLE_COLORS[u.role] || ROLE_COLORS.user} /></div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {u.wedding ? (
                      <>
                        <div style={{ fontSize: 12, color: '#1a1a2e' }}>{u.wedding.brideName} & {u.wedding.groomName}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{new Date(u.wedding.weddingDate).toLocaleDateString('pt-BR')}</div>
                      </>
                    ) : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => { setImpersonateModal({ userId: u.id, userName: u.name || u.email || u.id }); setImpersonateReason('') }}
                        style={{ background: '#fde68a', color: '#78350f', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Impersonar
                      </button>
                      <Link
                        href={`/admin/logs?userId=${u.id}`}
                        style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}
                      >
                        Ver logs
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#bbb' }}>Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'default' : 'pointer' }}
          >
            ← Anterior
          </button>
          <span style={{ padding: '6px 14px', color: '#888', fontSize: 13 }}>Página {page} de {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'default' : 'pointer' }}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Impersonate Modal */}
      {impersonateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, maxWidth: '90vw' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Confirmar Impersonação</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
              Você está prestes a visualizar o sistema como <strong>{impersonateModal.userName}</strong>.
              Todas as ações serão registradas.
            </p>
            <label style={{ display: 'block', color: '#444', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Motivo (obrigatório)
            </label>
            <textarea
              value={impersonateReason}
              onChange={(e) => setImpersonateReason(e.target.value)}
              placeholder="Ex: Suporte técnico solicitado pelo usuário"
              rows={3}
              style={{
                width: '100%', border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 12px',
                fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setImpersonateModal(null)}
                style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleImpersonate}
                disabled={!impersonateReason.trim() || impersonating}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: impersonateReason.trim() ? '#f43f5e' : '#e5e7eb',
                  color: impersonateReason.trim() ? '#fff' : '#aaa',
                  cursor: impersonateReason.trim() ? 'pointer' : 'default',
                  fontWeight: 600, fontSize: 14,
                }}
              >
                {impersonating ? 'Aguarde...' : 'Confirmar impersonação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
