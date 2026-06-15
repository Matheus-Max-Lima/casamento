import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wedding: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user, wedding: user.wedding });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const body = await req.json();

  // Update user profile
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      ...(body.image !== undefined && { image: body.image }),
    },
  });

  // Update or create wedding record
  const wedding = await prisma.wedding.upsert({
    where: { userId },
    create: {
      userId,
      brideName: body.brideName || "Noiva",
      groomName: body.groomName || "Noivo",
      weddingDate: body.weddingDate ? new Date(body.weddingDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      venue: body.venue || null,
      city: body.city || null,
      totalBudget: body.totalBudget ?? 0,
      guestCount: body.guestCount ?? 0,
      theme: body.theme || null,
      style: body.style || null,
    },
    update: {
      ...(body.brideName !== undefined && { brideName: body.brideName }),
      ...(body.groomName !== undefined && { groomName: body.groomName }),
      ...(body.weddingDate !== undefined && {
        weddingDate: body.weddingDate ? new Date(body.weddingDate) : undefined,
      }),
      ...(body.venue !== undefined && { venue: body.venue }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.totalBudget !== undefined && { totalBudget: body.totalBudget }),
      ...(body.guestCount !== undefined && { guestCount: body.guestCount }),
      ...(body.theme !== undefined && { theme: body.theme }),
      ...(body.style !== undefined && { style: body.style }),
    },
  });

  return NextResponse.json({ success: true, wedding });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  // Cascade deletes are handled by Prisma schema (onDelete: Cascade)
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}
