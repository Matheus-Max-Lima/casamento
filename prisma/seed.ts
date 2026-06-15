import { PrismaClient } from "@prisma/client/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const password = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@ateoaltar.com" },
    update: {},
    create: {
      name: "Ana Paula",
      email: "demo@ateoaltar.com",
      password,
      wedding: {
        create: {
          brideName: "Ana Paula",
          groomName: "Carlos",
          weddingDate: new Date("2025-12-14"),
          venue: "Espaço Villa Garden",
          city: "São Paulo, SP",
          totalBudget: 80000,
          theme: "Romântico Clássico",
          style: "Elegante",
          guestCount: 150,
        },
      },
    },
    include: { wedding: true },
  });

  const weddingId = user.wedding!.id;

  // Seed checklist items (12 months)
  const checklistItems = [
    // 12 months before
    { title: "Definir a data do casamento", category: "Planejamento", month: 12, priority: "high" },
    { title: "Estabelecer orçamento total", category: "Financeiro", month: 12, priority: "high" },
    { title: "Montar lista de convidados preliminar", category: "Convidados", month: 12, priority: "high" },
    { title: "Pesquisar e visitar locais para a cerimônia", category: "Local", month: 12, priority: "high" },
    { title: "Pesquisar e visitar locais para a recepção", category: "Local", month: 12, priority: "high" },
    // 10 months before
    { title: "Contratar fotógrafo", category: "Fornecedores", month: 10, priority: "high" },
    { title: "Contratar filmagem", category: "Fornecedores", month: 10, priority: "high" },
    { title: "Contratar buffet", category: "Fornecedores", month: 10, priority: "high" },
    { title: "Escolher tema e paleta de cores", category: "Decoração", month: 10, priority: "medium" },
    // 8 months before
    { title: "Começar a busca pelo vestido", category: "Visual", month: 8, priority: "high" },
    { title: "Contratar decoradora/cerimonialista", category: "Fornecedores", month: 8, priority: "high" },
    { title: "Definir cardápio com o buffet", category: "Buffet", month: 8, priority: "medium" },
    { title: "Pesquisar DJ ou banda", category: "Música", month: 8, priority: "high" },
    // 6 months before
    { title: "Enviar save-the-date digital", category: "Convidados", month: 6, priority: "high" },
    { title: "Fazer prova do vestido", category: "Visual", month: 6, priority: "high" },
    { title: "Contratar DJ/banda", category: "Música", month: 6, priority: "high" },
    { title: "Definir madrinhas e padrinhos", category: "Cerimônia", month: 6, priority: "medium" },
    { title: "Escolher alianças", category: "Joias", month: 6, priority: "high" },
    // 4 months before
    { title: "Enviar convites formais", category: "Convidados", month: 4, priority: "high" },
    { title: "Confirmar todos os fornecedores", category: "Fornecedores", month: 4, priority: "high" },
    { title: "Planejar lua de mel", category: "Lua de Mel", month: 4, priority: "medium" },
    { title: "Criar lista de presentes", category: "Presentes", month: 4, priority: "medium" },
    // 3 months before
    { title: "Segunda prova do vestido", category: "Visual", month: 3, priority: "high" },
    { title: "Definir make e cabelo", category: "Visual", month: 3, priority: "high" },
    { title: "Planejar cronograma do dia", category: "Planejamento", month: 3, priority: "high" },
    { title: "Organizar alojamento para convidados de fora", category: "Logística", month: 3, priority: "medium" },
    // 2 months before
    { title: "Confirmar presença dos convidados", category: "Convidados", month: 2, priority: "high" },
    { title: "Finalizar organização das mesas", category: "Logística", month: 2, priority: "high" },
    { title: "Fazer teste de make e cabelo", category: "Visual", month: 2, priority: "high" },
    { title: "Comprar alianças", category: "Joias", month: 2, priority: "high" },
    // 1 month before
    { title: "Reunião final com todos os fornecedores", category: "Fornecedores", month: 1, priority: "high" },
    { title: "Entrega do vestido e ajustes finais", category: "Visual", month: 1, priority: "high" },
    { title: "Preparar envelopes e pagamentos", category: "Financeiro", month: 1, priority: "high" },
    { title: "Confirmar lua de mel (passagens e hotel)", category: "Lua de Mel", month: 1, priority: "high" },
    { title: "Manicure e pedicure", category: "Visual", month: 1, priority: "medium" },
  ];

  for (const item of checklistItems) {
    await prisma.checklistItem.create({
      data: { ...item, weddingId, completed: Math.random() > 0.6 },
    });
  }

  // Seed budget items
  const budgetItems = [
    { category: "Local", title: "Espaço Villa Garden", estimatedCost: 15000, actualCost: 14500, paid: 14500, vendor: "Villa Garden" },
    { category: "Buffet", title: "Buffet Premium", estimatedCost: 20000, actualCost: 19800, paid: 10000, vendor: "Buffet Sabor & Arte" },
    { category: "Fotografia", title: "Fotógrafo principal", estimatedCost: 8000, actualCost: 7500, paid: 3750, vendor: "Studio Lumière" },
    { category: "Filmagem", title: "Filmagem cinematográfica", estimatedCost: 6000, actualCost: 6000, paid: 3000, vendor: "CineWed" },
    { category: "Decoração", title: "Decoração completa", estimatedCost: 12000, actualCost: 11500, paid: 5750, vendor: "Flor & Arte" },
    { category: "Música", title: "DJ profissional", estimatedCost: 4000, actualCost: 3800, paid: 1900, vendor: "DJ Marcos" },
    { category: "Vestido", title: "Vestido da noiva", estimatedCost: 5000, actualCost: 4800, paid: 4800, vendor: "Ateliê Sonho Branco" },
    { category: "Convites", title: "Convites personalizados", estimatedCost: 2000, actualCost: 1800, paid: 1800, vendor: "Papelaria Chic" },
  ];

  for (const item of budgetItems) {
    await prisma.budgetItem.create({ data: { ...item, weddingId } });
  }

  // Seed guests
  const guests = [
    { name: "João Pereira", email: "joao@email.com", side: "groom", status: "confirmed" },
    { name: "Maria Santos", email: "maria@email.com", side: "bride", status: "confirmed" },
    { name: "Pedro Lima", email: "pedro@email.com", side: "groom", status: "pending" },
    { name: "Clara Oliveira", email: "clara@email.com", side: "bride", status: "confirmed" },
    { name: "Roberto Silva", side: "groom", status: "declined" },
    { name: "Fernanda Costa", side: "bride", status: "pending" },
    { name: "Lucas Mendes", side: "both", status: "confirmed" },
    { name: "Julia Alves", side: "bride", status: "confirmed" },
  ];

  for (const guest of guests) {
    await prisma.guest.create({ data: { ...guest, weddingId } });
  }

  // Seed vendors
  const vendors = [
    { category: "Fotografia", name: "Studio Lumière", email: "contato@studiolumiere.com", phone: "(11) 99999-1111", price: 7500, status: "hired", rating: 5, website: "studiolumiere.com" },
    { category: "Buffet", name: "Buffet Sabor & Arte", email: "contato@saborarte.com", phone: "(11) 99999-2222", price: 19800, status: "hired", rating: 5 },
    { category: "Decoração", name: "Flor & Arte", email: "florarte@email.com", phone: "(11) 99999-3333", price: 11500, status: "hired", rating: 4 },
    { category: "Música", name: "DJ Marcos", email: "djmarcos@email.com", phone: "(11) 99999-4444", price: 3800, status: "hired", rating: 4 },
    { category: "Filmagem", name: "CineWed", email: "cinewed@email.com", phone: "(11) 99999-5555", price: 6000, status: "hired", rating: 5 },
    { category: "Vestido", name: "Ateliê Sonho Branco", email: "atelier@email.com", phone: "(11) 99999-6666", price: 4800, status: "hired", rating: 5 },
  ];

  for (const vendor of vendors) {
    await prisma.vendor.create({ data: { ...vendor, weddingId } });
  }

  // Owner account
  const ownerPassword = await bcrypt.hash('owner@2025!', 12)
  await prisma.user.upsert({
    where: { email: 'matheus.max0105@gmail.com' },
    update: { role: 'owner', plan: 'enterprise' },
    create: {
      email: 'matheus.max0105@gmail.com',
      name: 'Matheus (Owner)',
      password: ownerPassword,
      role: 'owner',
      plan: 'enterprise',
      emailVerified: new Date(),
    },
  })

  // Default feature flags
  const defaultFlags = [
    { key: 'ai_assistant', description: 'Assistente Valentina (IA)', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
    { key: 'spotify_integration', description: 'Integração com Spotify', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
    { key: 'google_calendar', description: 'Integração com Google Calendar', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
    { key: 'pdf_export', description: 'Exportar PDF', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
    { key: 'csv_import', description: 'Importar CSV', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
    { key: 'rsvp_public', description: 'RSVP público', enabled: true, plans: ['pro', 'enterprise', 'owner'] },
  ]
  for (const flag of defaultFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    })
  }

  console.log("✅ Seed completed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
