import { NextRequest, NextResponse } from "next/server";
import { getSessionAndWedding } from "@/lib/api-helper";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/plan-gates";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const [items, wedding] = await Promise.all([
    prisma.budgetItem.findMany({
      where: { weddingId: ctx.weddingId },
      include: { installments: { orderBy: { dueDate: "asc" } } },
      orderBy: { category: "asc" },
    }),
    prisma.wedding.findUnique({
      where: { id: ctx.weddingId },
      select: { totalBudget: true },
    }),
  ]);

  return NextResponse.json({ items, totalBudget: wedding?.totalBudget ?? 0 });
}

export async function POST(req: NextRequest) {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const gate = await checkLimit(ctx.weddingId, 'budgetItems', ctx.plan, ctx.role);
  if (!gate.allowed) {
    return NextResponse.json({ error: 'LIMIT_REACHED', resource: 'budgetItems', current: gate.current, limit: gate.limit, plan: ctx.plan }, { status: 402 });
  }

  const data = await req.json();
  const item = await prisma.budgetItem.create({
    data: {
      weddingId: ctx.weddingId,
      category: data.category,
      title: data.title,
      estimatedCost: Number(data.estimatedCost) || 0,
      actualCost: Number(data.actualCost) || 0,
      paid: Number(data.paid) || 0,
      vendor: data.vendor || null,
      notes: data.notes || null,
    },
    include: { installments: true },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const data = await req.json();
  const updated = await prisma.wedding.update({
    where: { id: ctx.weddingId },
    data: { totalBudget: Number(data.totalBudget) || 0 },
    select: { totalBudget: true },
  });

  return NextResponse.json(updated);
}
