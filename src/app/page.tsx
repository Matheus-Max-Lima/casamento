import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#fdf8f5', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: 'rgba(253, 248, 245, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #fce7e7', position: 'sticky', top: 0, zIndex: 50, padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem' }}>💍</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #f43f5e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Até o Altar
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#funcionalidades" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
              Funcionalidades
            </a>
            <a href="#precos" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
              Preços
            </a>
            <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
              Login
            </Link>
            <Link href="/register" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Cadastrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '6rem 1.5rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(244, 63, 94, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5rem', left: '5%', width: '20rem', height: '20rem', background: 'rgba(244, 63, 94, 0.04)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '3rem', right: '5%', width: '18rem', height: '18rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '2rem', padding: '0.4rem 1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.9rem' }}>✨</span>
            <span style={{ color: '#f43f5e', fontSize: '0.875rem', fontWeight: 600 }}>Transformando planos em memórias.</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Planeje o casamento{' '}
            <span style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              dos seus sonhos
            </span>
            <br />sem perder o controle
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#6b7280', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Checklist inteligente, controle financeiro e gestão de convidados em um só lugar.
            Planeje cada detalhe com tranquilidade e chegue no grande dia sem estresse.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', padding: '0.875rem 2.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.35)', display: 'inline-block' }}>
              Começar Grátis 🎉
            </Link>
            <a href="#demo" style={{ background: 'white', color: '#f43f5e', padding: '0.875rem 2.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', border: '2px solid #fce7e7', display: 'inline-block' }}>
              ▶ Ver Demo
            </a>
          </div>

          <p style={{ marginTop: '1.25rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            Grátis por 30 dias • Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>

        {/* Hero Dashboard Preview */}
        <div style={{ marginTop: '4rem', maxWidth: '900px', margin: '4rem auto 0', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 20px 60px rgba(244, 63, 94, 0.1)', border: '1px solid #fce7e7', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', borderRadius: '0 0 0.75rem 0.75rem', padding: '0.25rem 1.25rem', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
            Preview do Dashboard
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { emoji: '✅', label: 'Checklist', value: '85% concluído', color: '#10b981' },
              { emoji: '💰', label: 'Orçamento', value: 'R$ 45.000', color: '#f43f5e' },
              { emoji: '👥', label: 'Convidados', value: '120 / 150', color: '#d4af37' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#fdf8f5', borderRadius: '1rem', padding: '1.25rem', textAlign: 'left' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ color: item.color, fontSize: '1.1rem', fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fdf8f5', borderRadius: '1rem', padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📋</span>
              <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>Próximas tarefas</span>
            </div>
            {[
              { task: 'Confirmar buffet "Sabor & Arte"', done: true },
              { task: 'Enviar convites para lista B', done: false },
              { task: 'Reunião com fotógrafo', done: false },
            ].map((item) => (
              <div key={item.task} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid #fce7e7' }}>
                <span style={{ color: item.done ? '#10b981' : '#d1d5db', fontSize: '1rem' }}>{item.done ? '✅' : '⬜'}</span>
                <span style={{ color: item.done ? '#9ca3af' : '#374151', fontSize: '0.9rem', textDecoration: item.done ? 'line-through' : 'none' }}>{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(244, 63, 94, 0.08)', color: '#f43f5e', borderRadius: '2rem', padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              Funcionalidades
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: '1rem' }}>
              Tudo que você precisa para{' '}
              <span style={{ color: '#f43f5e' }}>planejar</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>
              De forma simples, elegante e organizada — do primeiro sim ao altar.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                emoji: '✅',
                title: 'Checklist Completo',
                description: 'Lista inteligente com mais de 200 tarefas organizadas por fase. Do noivado ao pós-casamento, nunca esqueça um detalhe importante.',
                color: '#10b981',
                bg: 'rgba(16, 185, 129, 0.06)',
                border: 'rgba(16, 185, 129, 0.15)',
              },
              {
                emoji: '💰',
                title: 'Controle Financeiro',
                description: 'Defina seu orçamento e acompanhe cada gasto em tempo real. Relatórios detalhados e alertas quando se aproximar do limite.',
                color: '#f43f5e',
                bg: 'rgba(244, 63, 94, 0.06)',
                border: 'rgba(244, 63, 94, 0.15)',
              },
              {
                emoji: '👥',
                title: 'Gestão de Convidados',
                description: 'Importe sua lista, envie confirmações digitais, gerencie mesas e acompanhe respostas em tempo real com relatórios completos.',
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.06)',
                border: 'rgba(139, 92, 246, 0.15)',
              },
              {
                emoji: '🤝',
                title: 'Fornecedores',
                description: 'Compare orçamentos, salve contatos e avalie cada fornecedor. Acesse nosso diretório com os melhores profissionais da sua região.',
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.06)',
                border: 'rgba(245, 158, 11, 0.15)',
              },
              {
                emoji: '🎨',
                title: 'Inspirações',
                description: 'Salve ideias, organize por categoria e crie seu moodboard perfeito. Compartilhe com seu parceiro e fornecedores em um clique.',
                color: '#ec4899',
                bg: 'rgba(236, 72, 153, 0.06)',
                border: 'rgba(236, 72, 153, 0.15)',
              },
              {
                emoji: '🤖',
                title: 'IA Assistente',
                description: 'Nossa inteligência artificial responde dúvidas, sugere fornecedores, estima custos e ajuda você a tomar as melhores decisões.',
                color: '#0ea5e9',
                bg: 'rgba(14, 165, 233, 0.06)',
                border: 'rgba(14, 165, 233, 0.15)',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{ background: feature.bg, border: `1px solid ${feature.border}`, borderRadius: '1.25rem', padding: '2rem' }}
              >
                <div style={{ width: '3.5rem', height: '3.5rem', background: 'white', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem', boxShadow: `0 4px 16px ${feature.border}` }}>
                  {feature.emoji}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.75rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.65, fontSize: '0.95rem', margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b3e 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Casais que confiam em nós
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3.5rem', fontSize: '1.05rem' }}>
            Números que falam por si só
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { value: '500+', label: 'Casais Planejaram Aqui', emoji: '💑' },
              { value: '98%', label: 'Taxa de Satisfação', emoji: '⭐' },
              { value: 'R$ 50k+', label: 'Economizados em Média', emoji: '💰' },
              { value: '200+', label: 'Tarefas no Checklist', emoji: '✅' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '2rem 1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.emoji}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #f43f5e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 1.5rem', background: '#fdf8f5' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(244, 63, 94, 0.08)', color: '#f43f5e', borderRadius: '2rem', padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              Depoimentos
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#1a1a2e' }}>
              O que nossos casais dizem
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                name: 'Ana Clara & Pedro Henrique',
                wedding: 'Casaram em março de 2025',
                avatar: '👰',
                stars: 5,
                text: 'O Até o Altar transformou completamente o nosso planejamento! Conseguimos organizar tudo sem briga nenhuma. O controle financeiro nos ajudou a economizar quase R$ 8.000. Recomendo demais!',
              },
              {
                name: 'Juliana & Rafael Costa',
                wedding: 'Casaram em junho de 2025',
                avatar: '💑',
                stars: 5,
                text: 'Nunca imaginei que planejar um casamento pudesse ser tão tranquilo. O checklist inteligente é incrível — parecia que tinha uma consultora de casamentos particular do meu lado o tempo todo.',
              },
              {
                name: 'Mariana & Lucas Alves',
                wedding: 'Casarão em dezembro de 2025',
                avatar: '🥂',
                stars: 5,
                text: 'Ainda vamos casar, mas já posso dizer que esse app é indispensável. A gestão de convidados sozinha já valeu cada centavo. Minha mãe está usando também para acompanhar o progresso!',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.06)', border: '1px solid #fce7e7', position: 'relative' }}>
                <div style={{ color: '#d4af37', fontSize: '1.25rem', marginBottom: '1rem' }}>
                  {'★'.repeat(testimonial.stars)}
                </div>
                <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', background: 'linear-gradient(135deg, #fce7e7, #fdf4ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid #fce7e7', flexShrink: 0 }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.9rem' }}>{testimonial.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{testimonial.wedding}</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'rgba(244, 63, 94, 0.15)', fontSize: '3rem', lineHeight: 1, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(244, 63, 94, 0.08)', color: '#f43f5e', borderRadius: '2rem', padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
            Preços
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: '1rem' }}>
            Planos simples e transparentes
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1.05rem' }}>
            Sem pegadinhas, sem letras miúdas. Escolha o que funciona para você.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {[
              {
                name: 'Grátis',
                price: 'R$ 0',
                period: '/sempre',
                description: 'Para começar a planejar',
                color: '#6b7280',
                highlighted: false,
                badge: null,
                features: ['Checklist básico (50 tarefas)', 'Até 50 convidados', 'Controle de orçamento básico', '1 usuário'],
                cta: 'Começar Grátis',
                href: '/register',
              },
              {
                name: 'Premium',
                price: 'R$ 29',
                period: '/mês',
                description: 'Para o casamento perfeito',
                color: '#f43f5e',
                highlighted: true,
                badge: 'Mais Popular',
                features: ['Checklist completo (200+ tarefas)', 'Convidados ilimitados', 'Controle financeiro avançado', '2 usuários (casal)', 'IA Assistente', 'Gestão de fornecedores', 'Moodboard de inspirações', 'Suporte prioritário'],
                cta: 'Começar Premium',
                href: '/register?plan=premium',
              },
              {
                name: 'VIP',
                price: 'R$ 79',
                period: '/mês',
                description: 'Para experiência completa',
                color: '#d4af37',
                highlighted: false,
                badge: null,
                features: ['Tudo do Premium', 'Consultoria personalizada', 'Relatórios avançados', 'Integrações (WhatsApp, Email)', 'Múltiplos casamentos', 'API de acesso'],
                cta: 'Falar com Consultor',
                href: '/contact',
              },
            ].map((plan) => (
              <div key={plan.name} style={{ background: plan.highlighted ? 'linear-gradient(135deg, #fff5f6, #fdf0f0)' : '#fdf8f5', border: plan.highlighted ? '2px solid #f43f5e' : '1px solid #fce7e7', borderRadius: '1.5rem', padding: '2rem', position: 'relative', transform: plan.highlighted ? 'scale(1.03)' : 'scale(1)' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: 'white', borderRadius: '2rem', padding: '0.25rem 1rem', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: plan.color, marginBottom: '0.5rem' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e' }}>{plan.price}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{plan.period}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{plan.description}</div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', textAlign: 'left' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.4rem 0', color: '#374151', fontSize: '0.9rem' }}>
                      <span style={{ color: plan.highlighted ? '#f43f5e' : '#10b981', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{ display: 'block', textAlign: 'center', background: plan.highlighted ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : 'white', color: plan.highlighted ? 'white' : plan.color, padding: '0.875rem', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', border: `2px solid ${plan.highlighted ? 'transparent' : plan.color}`, boxShadow: plan.highlighted ? '0 4px 16px rgba(244, 63, 94, 0.3)' : 'none' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #d4af37 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💍</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            Comece a planejar hoje
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Junte-se a centenas de casais que já estão planejando o casamento dos sonhos com tranquilidade e organização.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'white', color: '#f43f5e', padding: '0.9rem 2.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              Criar Conta Grátis 🎊
            </Link>
            <Link href="/login" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.9rem 2.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', border: '2px solid rgba(255,255,255,0.4)' }}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', padding: '3rem 1.5rem 2rem', color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💍</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Até o Altar</span>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                A plataforma mais completa para planejar o casamento dos seus sonhos com tranquilidade.
              </p>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Produto</div>
              {['Funcionalidades', 'Preços', 'Changelog', 'Roadmap'].map(link => (
                <div key={link} style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    {link}
                  </a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Empresa</div>
              {['Sobre nós', 'Blog', 'Carreiras', 'Parceiros'].map(link => (
                <div key={link} style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    {link}
                  </a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Suporte</div>
              {['Central de Ajuda', 'Contato', 'Privacidade', 'Termos de Uso'].map(link => (
                <div key={link} style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    {link}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              © {new Date().getFullYear()} Até o Altar. Todos os direitos reservados.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['💬', '📸', '🐦', '📘'].map((icon, i) => (
                <a key={i} href="#" style={{ width: '2rem', height: '2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', textDecoration: 'none' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
