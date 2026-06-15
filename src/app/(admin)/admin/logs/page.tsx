'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface LogRow {
  id: string
  action: string
  entity: string | null
  entityId: string | null
  ip: string | null
  userAgent: string | null
  createdAt: string
  user: { name: string | null; email: string | null }
}

function actionColor(action: string) {
  if (action.includes('login')) return { bg: '#dbeafe', color: '#1e40af' }
  if (action.includes('create')) return { bg: '#dcfce7', color: '#15803d' }
  if (action.includes('delete')) return { bg: '#fee2e2', color: '#b91c1c' }
  if (action.includes('export')) return { bg: '#fef9c3', color: '#854d0e' }
  if (action.includes('ai')) return { bg: '#ede9fe', color: '#6d28d9' }
  return { bg: '#f3f4f6', color: '#374151' }
}

const ACTION_OPTIONS = [
  '', 'login', 'create', 'delete', 'export', 'ai.chat', 'update', 'import',
]

export default function AdminLogsPage() {
  const searchParams = useSearchParams()
  const initialUserId = searchParams.get('userId') || ''

  const [logs, setLogs] = useState<LogRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [userId, setUserId] = useState(initialUserId)
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const fetchLogs = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (userId) params.set('userId', userId)
    if (action) params.set('action', action)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    fetch(`/api/admin/logs?${params}`)
      .then((r) => r.json())
      .then((data) => { setLogs(data.logs || []); setTotal(data.total || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [page, userId, action, from, to])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleExportCSV = async () => {
    setExporting(true)
    const params = new URLSearchParams({ format: 'csv' })
    if (userId) params.set('userId', userId)
    if (action) params.set('action', action)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const res = await fetch(`/api/admin/logs?${params}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }

  const totalPages = Math.ceil(total / 50)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ color: '#1a1a2e', fontSize: 24, fontWeight: 700 }}>Logs de Auditoria</h1>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          style={{
            background: '#d4af37', color: '#fff', border: 'none',
            borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 13,
            cursor: exporting ? 'default' : 'pointer', opacity: exporting ? 0.7 : 1,
          }}
        >
          {exporting ? 'Exportando...' : '⬇ Exportar CSV'}
        </button>
      </div>
      <p style={{ color: '#888', marginBottom: 24 }}>{total} registro(s)</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <input
          type="text"
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setPage(1) }}
          placeholder="Filtrar por userId..."
          style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid #e0e0e0', fontSize: 13, width: 200, outline: 'none' }}
        />
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
          style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none' }}
        >
          {ACTION_OPTIONS.map((a) => (
            <option key={a} value={a}>{a || 'Todas as ações'}</option>
          ))}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888' }}>De</label>
          <input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setPage(1) }}
            style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888' }}>Até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); setPage(1) }}
            style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none' }}
          />
        </div>
        {(userId || action || from || to) && (
          <button
            onClick={() => { setUserId(''); setAction(''); setFrom(''); setTo(''); setPage(1) }}
            style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid #e0e0e0', background: '#f5f5f5', cursor: 'pointer', fontSize: 13 }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, color: '#888', textAlign: 'center' }}>Carregando...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                {['Data/hora', 'Usuário', 'Ação', 'Entidade', 'IP', 'Browser'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const colors = actionColor(log.action)
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '10px 16px', color: '#888', whiteSpace: 'nowrap', fontSize: 12 }}>
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 13 }}>{log.user?.name || '—'}</div>
                      <div style={{ color: '#888', fontSize: 11 }}>{log.user?.email}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: colors.bg, color: colors.color, borderRadius: 4, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#666', fontSize: 12 }}>
                      {log.entity || '—'}{log.entityId ? <span style={{ color: '#bbb' }}> #{log.entityId.slice(0, 6)}</span> : ''}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#888', fontSize: 12 }}>{log.ip || '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#888', fontSize: 11, maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.userAgent || ''}>
                        {log.userAgent ? log.userAgent.slice(0, 60) + (log.userAgent.length > 60 ? '…' : '') : '—'}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {logs.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#bbb' }}>Nenhum log encontrado.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'default' : 'pointer' }}>
            ← Anterior
          </button>
          <span style={{ padding: '6px 14px', color: '#888', fontSize: 13 }}>Página {page} de {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'default' : 'pointer' }}>
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}
