import getSession from "@/lib/getSession";
import { GamesPage } from "@/lib/types";
import { GameType, GameSchema } from "@/lib/validation";
import ky from "ky";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    const RAWG_BASE_URL = process.env.RAWG_BASE_URL;

    if (!RAWG_API_KEY || !RAWG_BASE_URL) {
      return new Response(
        JSON.stringify({ error: "Missing API configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const cursor = parseInt(req.nextUrl.searchParams.get("cursor") || "1", 10);
    const pageSize = 20;

    const response = await ky(`${RAWG_BASE_URL}/games`, {
      searchParams: {
        key: RAWG_API_KEY,
        page: cursor,
        page_size: pageSize,
      },
    }).json<{ results: GameType[] }>();

    const games = response.results.map((game) => GameSchema.parse(game));

    const nextCursor = games.length === pageSize ? String(cursor + 1) : null;

    const data: GamesPage = {
      games,
      nextCursor,
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RAWG API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
