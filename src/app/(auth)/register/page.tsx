'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  partnerName: string
  weddingDate: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    partnerName: '',
    weddingDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  function validateStep1() {
    if (!form.name.trim()) return 'Por favor, informe seu nome completo.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Por favor, informe um email válido.'
    if (form.password.length < 6) return 'A senha deve ter no mínimo 6 caracteres.'
    if (form.password !== form.confirmPassword) return 'As senhas não coincidem.'
    return null
  }

  function handleNextStep() {
    const err = validateStep1()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          partnerName: form.partnerName || undefined,
          weddingDate: form.weddingDate || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta. Tente novamente.')
        return
      }

      const signInResult = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (signInResult?.ok) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    border: '1.5px solid #fce7e7',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    outline: 'none',
    background: '#fdf8f5',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.5rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf8f5 0%, #fff0f2 50%, #fdf8f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-5rem', left: '-5rem', width: '25rem', height: '25rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5rem', right: '-5rem', width: '22rem', height: '22rem', background: 'rgba(212, 175, 55, 0.06)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>💍</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #f43f5e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Até o Altar
            </span>
          </Link>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Crie sua conta gratuitamente ✨
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 20px 60px rgba(244, 63, 94, 0.1)', border: '1px solid #fce7e7' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.5rem', textAlign: 'center' }}>
            Criar sua conta
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.75rem' }}>
            Comece a planejar o casamento dos seus sonhos
          </p>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>Sua conta</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: step === 2 ? '#f43f5e' : '#fce7e7', transition: 'background 0.3s', marginBottom: '1.125rem' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: step === 2 ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : '#fce7e7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step === 2 ? 'white' : '#9ca3af', fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.3s' }}>
                2
              </div>
              <span style={{ fontSize: '0.75rem', color: step === 2 ? '#f43f5e' : '#9ca3af', fontWeight: 600 }}>Seu casamento</span>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <span style={{ color: '#f43f5e', fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>Nome completo</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>👤</span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>📧</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" style={labelStyle}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>🔒</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#9ca3af', padding: '0.25rem' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: form.password.length >= i * 2 ? (form.password.length >= 8 ? '#10b981' : '#f59e0b') : '#fce7e7', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" style={labelStyle}>Confirmar senha</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>🔒</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: '3rem', borderColor: form.confirmPassword && form.confirmPassword !== form.password ? '#f43f5e' : '#fce7e7' }}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password ? '#f43f5e' : '#fce7e7')}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#9ca3af', padding: '0.25rem' }}>
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.confirmPassword && form.confirmPassword === form.password && (
                  <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ✓ Senhas coincidem
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', padding: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(244, 63, 94, 0.35)', marginTop: '0.25rem' }}
              >
                Continuar →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.04)', border: '1px dashed rgba(244, 63, 94, 0.25)', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>💡</span>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Informações opcionais — você pode adicionar depois!</span>
              </div>

              {/* Partner name */}
              <div>
                <label htmlFor="partnerName" style={labelStyle}>
                  Nome do noivo(a){' '}
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>💑</span>
                  <input
                    id="partnerName"
                    name="partnerName"
                    type="text"
                    value={form.partnerName}
                    onChange={handleChange}
                    placeholder="Nome do seu amor"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                  />
                </div>
              </div>

              {/* Wedding date */}
              <div>
                <label htmlFor="weddingDate" style={labelStyle}>
                  Data do casamento{' '}
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>📅</span>
                  <input
                    id="weddingDate"
                    name="weddingDate"
                    type="date"
                    value={form.weddingDate}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                    onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                  />
                </div>
              </div>

              {/* Terms */}
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.5 }}>
                Ao criar sua conta, você concorda com nossos{' '}
                <a href="/terms" style={{ color: '#f43f5e', textDecoration: 'none' }}>Termos de Uso</a>{' '}
                e{' '}
                <a href="/privacy" style={{ color: '#f43f5e', textDecoration: 'none' }}>Política de Privacidade</a>.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError('') }}
                  style={{ flex: '0 0 auto', padding: '0.875rem 1.25rem', background: 'white', border: '1.5px solid #fce7e7', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#6b7280' }}
                >
                  ←
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, background: loading ? '#fca5a5' : 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', padding: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: loading ? 'none' : '0 4px 16px rgba(244, 63, 94, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 1s linear infinite', width: '1.1rem', height: '1.1rem' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                      </svg>
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta grátis 🎉'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: '#f43f5e', fontWeight: 700, textDecoration: 'none' }}>
              Entrar
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            ← Voltar para o início
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
