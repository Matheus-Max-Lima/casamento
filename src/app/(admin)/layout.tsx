import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const role = (session.user as any).role as string | undefined
  if (role !== 'owner' && role !== 'admin') {
    redirect('/dashboard')
  }

  const navLinks = [
    { href: '/admin', label: 'Visão Geral', icon: '◈' },
    { href: '/admin/users', label: 'Usuários', icon: '◉' },
    { href: '/admin/logs', label: 'Logs', icon: '◎' },
    { href: '/admin/flags', label: 'Feature Flags', icon: '◆' },
    { href: '/admin/profile', label: 'Meu Perfil', icon: '◐' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: '2px 0 12px rgba(0,0,0,0.3)',
      }}>
        {/* Logo/Title */}
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
            Admin Panel
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
            Até ao Altar
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          <style>{`
            .admin-nav-link { display:flex; align-items:center; gap:10px; padding:10px 24px; color:rgba(255,255,255,0.75); text-decoration:none; font-size:14px; transition:background 0.15s,color 0.15s; }
            .admin-nav-link:hover { background:rgba(244,63,94,0.12); color:#f43f5e; }
          `}</style>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="admin-nav-link">
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Back to dashboard */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: 13,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              transition: 'background 0.15s',
            }}
          >
            ← Meu casamento
          </Link>
          <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
            {session.user?.name || session.user?.email}
            <span style={{
              display: 'inline-block',
              marginLeft: 6,
              padding: '1px 6px',
              background: role === 'owner' ? '#7c3aed' : '#2563eb',
              color: '#fff',
              borderRadius: 4,
              fontSize: 10,
              textTransform: 'uppercase',
            }}>
              {role}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: 240,
        flex: 1,
        background: '#f8f8fc',
        minHeight: '100vh',
        padding: '32px',
      }}>
        {children}
      </main>
    </div>
  )
}
