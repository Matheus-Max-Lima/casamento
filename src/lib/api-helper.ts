import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function getSessionAndWedding() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  }

  let userId = (session.user as any).id as string;

  // If an admin is impersonating, use the target user's ID for all data operations
  const cookieStore = await cookies();
  const isImpersonating = cookieStore.get('__impersonating')?.value === 'true';
  const impersonatedById = cookieStore.get('__impersonated_by')?.value;
  const impersonatedUserId = cookieStore.get('__impersonated_user_id')?.value;
  if (isImpersonating && impersonatedById === userId && impersonatedUserId) {
    userId = impersonatedUserId;
  }

  const wedding = await prisma.wedding.findUnique({ where: { userId } });
  if (!wedding) {
    return { error: NextResponse.json({ error: "Casamento não encontrado" }, { status: 404 }) };
  }
  const userMeta = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, plan: true }
  });
  return { userId, wedding, weddingId: wedding.id, role: userMeta?.role ?? 'user', plan: userMeta?.plan ?? 'free' };
}
