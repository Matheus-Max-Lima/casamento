import { NextResponse } from "next/server";
import { getSessionAndWedding } from "@/lib/api-helper";
import { getValidGoogleCalendarToken } from "@/lib/google-calendar";
import { prisma } from "@/lib/prisma";

async function ensureCalendar(token: string, existingCalendarId: string | null): Promise<string> {
  if (existingCalendarId) return existingCalendarId;

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ summary: "Casamento 💍", timeZone: "America/Sao_Paulo" }),
  });

  if (!res.ok) return "primary";

  const cal = await res.json();
  return cal.id as string;
}

function buildEventDateTime(weddingDate: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const dt = new Date(weddingDate);
  dt.setHours(h, m, 0, 0);
  return dt.toISOString();
}

export async function POST() {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const token = await getValidGoogleCalendarToken(ctx.weddingId);
  if (!token) {
    return NextResponse.json({ error: "Google Calendar não conectado" }, { status: 401 });
  }

  const { wedding } = ctx;

  const calendarId = await ensureCalendar(token, wedding.googleCalendarId);

  // Save calendarId if new
  if (!wedding.googleCalendarId) {
    await prisma.wedding.update({
      where: { id: ctx.weddingId },
      data: { googleCalendarId: calendarId },
    });
  }

  const items = await prisma.timelineItem.findMany({
    where: { weddingId: ctx.weddingId },
    orderBy: { order: "asc" },
  });

  if (items.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  const weddingDate = wedding.weddingDate;
  let synced = 0;

  for (const item of items) {
    const startDateTime = buildEventDateTime(weddingDate, item.startTime);
    const endDateTime = item.endTime
      ? buildEventDateTime(weddingDate, item.endTime)
      : new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

    const event = {
      summary: item.title,
      description: [item.description, item.responsible ? `Responsável: ${item.responsible}` : null]
        .filter(Boolean)
        .join("\n") || undefined,
      location: item.location ?? undefined,
      start: { dateTime: startDateTime, timeZone: "America/Sao_Paulo" },
      end: { dateTime: endDateTime, timeZone: "America/Sao_Paulo" },
    };

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (res.ok) synced++;
  }

  return NextResponse.json({ synced });
}
