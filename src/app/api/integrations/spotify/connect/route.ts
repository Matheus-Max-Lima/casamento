import { NextResponse } from "next/server";
import { getSessionAndWedding } from "@/lib/api-helper";

export async function GET() {
  const ctx = await getSessionAndWedding();
  if ("error" in ctx) return ctx.error;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Spotify não configurado" }, { status: 503 });
  }

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/spotify/callback`;
  const scope = "playlist-read-private playlist-modify-public playlist-modify-private";

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope,
    state: ctx.userId,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
