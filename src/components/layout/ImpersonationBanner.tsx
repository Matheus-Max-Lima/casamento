'use client'

import { useEffect, useState } from 'react'

export default function ImpersonationBanner() {
  const [impersonating, setImpersonating] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
      const [k, v] = c.trim().split('=')
      acc[k] = decodeURIComponent(v || '')
      return acc
    }, {})
    if (cookies['__impersonating'] === 'true') {
      setImpersonating(true)
      setUserName(cookies['__impersonated_user_name'] || 'usuário')
    }
  }, [])

  const handleStop = () => {
    // Clear impersonation cookies
    document.cookie = '__impersonating=; Max-Age=0; path=/'
    document.cookie = '__impersonated_by=; Max-Age=0; path=/'
    document.cookie = '__impersonated_by_name=; Max-Age=0; path=/'
    document.cookie = '__impersonated_user_name=; Max-Age=0; path=/'
    window.location.href = '/admin'
  }

  if (!impersonating) return null

  return (
    <div style={{
      background: '#fef08a',
      color: '#78350f',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      fontSize: 13,
      fontWeight: 600,
      borderBottom: '2px solid #fde047',
      zIndex: 999,
    }}>
      <span>⚠️ Você está visualizando como <strong>{userName}</strong></span>
      <button
        onClick={handleStop}
        style={{
          background: '#78350f',
          color: '#fef08a',
          border: 'none',
          borderRadius: 6,
          padding: '4px 14px',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        Encerrar impersonação
      </button>
    </div>
  )
}
