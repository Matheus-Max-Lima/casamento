import { NextRequest, NextResponse } from "next/server";
import { getSessionAndWedding } from "@/lib/api-helper";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/plan-gates";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const guests = await prisma.guest.findMany({
    where: { weddingId: ctx.weddingId },
    include: { table: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const gate = await checkLimit(ctx.weddingId, 'guests', ctx.plan, ctx.role);
  if (!gate.allowed) {
    return NextResponse.json({ error: 'LIMIT_REACHED', resource: 'guests', current: gate.current, limit: gate.limit, plan: ctx.plan }, { status: 402 });
  }

  const data = await req.json();
  const guest = await prisma.guest.create({
    data: {
      weddingId: ctx.weddingId,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      side: data.side || "both",
      status: data.status || "pending",
      plusOne: data.plusOne || false,
      plusOneName: data.plusOneName || null,
      dietary: data.dietary || null,
      notes: data.notes || null,
    },
    include: { table: { select: { id: true, name: true } } },
  });

  return NextResponse.json(guest, { status: 201 });
}
