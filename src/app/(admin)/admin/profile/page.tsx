'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AdminProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const role = (session?.user as any)?.role as string

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setName(data.user?.name || '')
        setEmail(data.user?.email || '')
      })
  }, [])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setSaving(false)
    setSaveMsg(res.ok ? 'Nome atualizado!' : 'Erro ao salvar.')
    if (res.ok) await updateSession()
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function handleChangePw(e: React.FormEvent) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { setPwMsg('As senhas não coincidem'); return }
    if (pwForm.next.length < 6) { setPwMsg('Mínimo 6 caracteres'); return }
    setSavingPw(true)
    setPwMsg('')
    const res = await fetch('/api/settings/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    })
    const data = await res.json()
    setSavingPw(false)
    setPwMsg(res.ok ? 'Senha alterada com sucesso!' : (data.error || 'Erro ao alterar senha'))
    if (res.ok) setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwMsg(''), 4000)
  }

  const roleBg: Record<string, string> = { owner: '#7c3aed', admin: '#2563eb', user: '#888' }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ color: '#1a1a2e', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Meu Perfil</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Configurações da sua conta de administrador</p>

      {/* Identity card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, flexShrink: 0 }}>
          {(name || email || '?')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 18 }}>{name || '—'}</div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{email}</div>
          <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', background: roleBg[role] || '#888', color: '#fff', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {role}
          </span>
        </div>
      </div>

      {/* Name */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: 20 }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Informações pessoais</h2>
        <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Email <span style={{ color: '#bbb', fontWeight: 400 }}>(somente leitura)</span></label>
            <input
              type="email"
              value={email}
              readOnly
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, background: '#f9f9f9', color: '#aaa', boxSizing: 'border-box' as const }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="submit"
              disabled={saving}
              style={{ background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Salvando...' : 'Salvar nome'}
            </button>
            {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('!') ? '#16a34a' : '#f43f5e', fontWeight: 600 }}>{saveMsg}</span>}
          </div>
        </form>
      </div>

      {/* Password */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Alterar senha</h2>
        <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Senha atual', key: 'current', placeholder: 'Sua senha atual' },
            { label: 'Nova senha', key: 'next', placeholder: 'Mínimo 6 caracteres' },
            { label: 'Confirmar nova senha', key: 'confirm', placeholder: 'Repita a nova senha' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>{label}</label>
              <input
                type="password"
                value={pwForm[key as keyof typeof pwForm]}
                onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              disabled={savingPw || !pwForm.next}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: savingPw || !pwForm.next ? 'default' : 'pointer', opacity: savingPw || !pwForm.next ? 0.6 : 1 }}
            >
              {savingPw ? 'Salvando...' : 'Alterar senha'}
            </button>
            {pwMsg && <span style={{ fontSize: 13, color: pwMsg.includes('sucesso') ? '#16a34a' : '#f43f5e', fontWeight: 600 }}>{pwMsg}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
