'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Email ou senha inválidos.')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf8f5 0%, #fff0f2 50%, #fdf8f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '25rem', height: '25rem', background: 'rgba(244, 63, 94, 0.06)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5rem', left: '-5rem', width: '22rem', height: '22rem', background: 'rgba(212, 175, 55, 0.06)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>💍</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #f43f5e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Até o Altar
            </span>
          </Link>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Bem-vinda de volta! 💕
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 20px 60px rgba(244, 63, 94, 0.1)', border: '1px solid #fce7e7' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.5rem', textAlign: 'center' }}>
            Entrar na sua conta
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
            Continue planejando seu casamento perfeito
          </p>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <span style={{ color: '#f43f5e', fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email field */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>
                  📧
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', border: '1.5px solid #fce7e7', borderRadius: '0.75rem', fontSize: '0.95rem', color: '#1a1a2e', outline: 'none', background: '#fdf8f5', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                  onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                  Senha
                </label>
                <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: '#f43f5e', textDecoration: 'none', fontWeight: 500 }}>
                  Esqueci minha senha
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none' }}>
                  🔒
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 2.75rem', border: '1.5px solid #fce7e7', borderRadius: '0.75rem', fontSize: '0.95rem', color: '#1a1a2e', outline: 'none', background: '#fdf8f5', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#f43f5e')}
                  onBlur={e => (e.target.style.borderColor = '#fce7e7')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', color: '#9ca3af' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#fca5a5' : 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', padding: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: loading ? 'none' : '0 4px 16px rgba(244, 63, 94, 0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '1.1rem', height: '1.1rem' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar 💍'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#fce7e7' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>ou continue com</span>
            <div style={{ flex: 1, height: '1px', background: '#fce7e7' }} />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            style={{ width: '100%', padding: '0.75rem', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'background 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e5e7eb' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
            Ainda não tem conta?{' '}
            <Link href="/register" style={{ color: '#f43f5e', fontWeight: 700, textDecoration: 'none' }}>
              Cadastrar grátis
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
      `}</style>
    </div>
  )
}
