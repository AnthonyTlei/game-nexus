import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma"; // Assuming Prisma client is set up in lib/prisma.ts
import { GamesPage } from "@/lib/types";
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

    const cursor = parseInt(req.nextUrl.searchParams.get("cursor") || "1", 10);
    const pageSize = 20;

    const games = await prisma.game.findMany({
      skip: (cursor - 1) * pageSize,
      take: pageSize,
    });

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
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
