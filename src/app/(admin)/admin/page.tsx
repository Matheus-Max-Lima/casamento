'use client'

import { useEffect, useState } from 'react'

interface Metrics {
  totalUsers: number
  activeUsers: number
  plans: { free: number; pro: number; enterprise: number }
  activeWeddings: number
  completedWeddings: number
  aiMessages: number
  recentUsers: Array<{ id: string; name: string | null; email: string | null; plan: string; role: string; createdAt: string }>
  recentLogs: Array<{ id: string; action: string; entity: string | null; createdAt: string; user: { name: string | null; email: string | null } }>
  chartData: Array<{ date: string; count: number }>
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
      borderLeft: `4px solid ${color || '#f43f5e'}`,
    }}>
      <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ color: '#1a1a2e', fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  )
}

function planBadge(plan: string) {
  const colors: Record<string, string> = { free: '#888', pro: '#f43f5e', enterprise: '#d4af37' }
  return (
    <span style={{
      background: colors[plan] || '#888',
      color: '#fff',
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
    }}>{plan}</span>
  )
}

function actionColor(action: string) {
  if (action.includes('login')) return '#2563eb'
  if (action.includes('create')) return '#16a34a'
  if (action.includes('delete')) return '#dc2626'
  if (action.includes('export')) return '#d4af37'
  if (action.includes('ai')) return '#7c3aed'
  return '#888'
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((r) => r.json())
      .then((data) => { setMetrics(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ color: '#888', padding: 40 }}>Carregando métricas...</div>
  }

  if (!metrics || (metrics as any).error) {
    return <div style={{ color: '#f43f5e', padding: 40 }}>Erro ao carregar métricas.</div>
  }

  const maxChart = Math.max(...metrics.chartData.map((d) => d.count), 1)

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Visão Geral</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Painel administrativo do Até ao Altar</p>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard label="Total de usuários" value={metrics.totalUsers} color="#f43f5e" />
        <MetricCard label="Ativos (30 dias)" value={metrics.activeUsers} color="#16a34a" />
        <MetricCard label="Plano Free" value={metrics.plans.free} color="#888" />
        <MetricCard label="Plano Pro" value={metrics.plans.pro} color="#f43f5e" />
        <MetricCard label="Plano Enterprise" value={metrics.plans.enterprise} color="#d4af37" />
        <MetricCard label="Casamentos ativos" value={metrics.activeWeddings} color="#2563eb" />
        <MetricCard label="Casamentos concluídos" value={metrics.completedWeddings} color="#7c3aed" />
        <MetricCard label="Msgs Valentina (AI)" value={metrics.aiMessages} color="#7c3aed" />
      </div>

      {/* Chart */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: 32 }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cadastros nos últimos 30 dias</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100, overflowX: 'auto' }}>
          {metrics.chartData.map((d) => (
            <div key={d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 18px' }}>
              <div
                title={`${d.date}: ${d.count} cadastros`}
                style={{
                  width: '100%',
                  background: '#f43f5e',
                  borderRadius: '3px 3px 0 0',
                  height: `${Math.max((d.count / maxChart) * 80, d.count > 0 ? 4 : 0)}px`,
                  opacity: d.count > 0 ? 1 : 0.15,
                  transition: 'height 0.3s',
                  cursor: 'default',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: '#bbb', fontSize: 10 }}>
          <span>{metrics.chartData[0]?.date?.slice(5)}</span>
          <span>{metrics.chartData[metrics.chartData.length - 1]?.date?.slice(5)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent users */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Usuários recentes</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {metrics.recentUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 0' }}>
                    <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{u.name || '—'}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>{u.email}</div>
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px 0' }}>{planBadge(u.plan)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent audit logs */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Auditoria recente</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {metrics.recentLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 0' }}>
                    <span style={{ background: actionColor(log.action), color: '#fff', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>
                      {log.action}
                    </span>
                    <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{log.user?.name || log.user?.email}</div>
                  </td>
                  <td style={{ textAlign: 'right', color: '#bbb', fontSize: 11, padding: '8px 0' }}>
                    {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
