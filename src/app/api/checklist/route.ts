import { NextRequest, NextResponse } from "next/server";
import { getSessionAndWedding } from "@/lib/api-helper";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/plan-gates";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const items = await prisma.checklistItem.findMany({
    where: { weddingId: ctx.weddingId },
    orderBy: [{ month: "desc" }, { priority: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const gate = await checkLimit(ctx.weddingId, 'checklist', ctx.plan, ctx.role);
  if (!gate.allowed) {
    return NextResponse.json({ error: 'LIMIT_REACHED', resource: 'checklist', current: gate.current, limit: gate.limit, plan: ctx.plan }, { status: 402 });
  }

  const body = await req.json();

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json(
      { error: "O título é obrigatório" },
      { status: 400 }
    );
  }

  const month = Number(body.month);
  if (isNaN(month) || month < 1 || month > 24) {
    return NextResponse.json(
      { error: "Mês inválido. Deve ser entre 1 e 24." },
      { status: 400 }
    );
  }

  const validPriorities = ["low", "medium", "high"];
  const priority =
    body.priority && validPriorities.includes(body.priority)
      ? body.priority
      : "medium";

  const item = await prisma.checklistItem.create({
    data: {
      weddingId: ctx.weddingId,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      category: body.category?.trim() || "Geral",
      month,
      priority,
      completed: false,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
