import getSession from "@/lib/getSession";
import { GameSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import ky from "ky";
import { RawgGame } from "@/lib/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
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

    const pageSize = 25;
    const maxGames = 1000;
    const maxPages = Math.ceil(maxGames / pageSize);
    let totalGamesProcessed = 0;

    for (let page = 1; page <= maxPages; page++) {
      const response = await ky(`${RAWG_BASE_URL}/games`, {
        searchParams: {
          key: RAWG_API_KEY,
          page,
          page_size: pageSize,
        },
      }).json<{ results: RawgGame[] }>();

      if (response.results.length === 0) break;

      console.log(
        `Fetched ${response.results.length} games from page ${page}.`,
      );

      const games = response.results
        .map((game) => {
          try {
            const parsedGame = GameSchema.parse(game);

            const genres = game.genres?.map((genre) => genre.slug) || [];
            const tags = game.tags?.map((tag) => tag.slug) || [];

            return {
              ...parsedGame,
              genres,
              tags,
            };
          } catch (error) {
            console.error("Invalid game data:", error);
            return null;
          }
        })
        .filter((game) => game !== null);

      for (const game of games) {
        await prisma.game.upsert({
          where: { id: game.id },
          update: {
            slug: game.slug,
            name: game.name,
            released: game.released ? new Date(game.released) : undefined,
            tba: game.tba,
            backgroundImage: game.background_image || "",
            rating: game.rating,
            added: game.added,
            genres: game.genres,
            tags: game.tags,
          },
          create: {
            id: game.id,
            slug: game.slug,
            name: game.name,
            released: game.released ? new Date(game.released) : undefined,
            tba: game.tba,
            backgroundImage: game.background_image || "",
            rating: game.rating,
            added: game.added,
            genres: game.genres,
            tags: game.tags,
          },
        });
      }

      totalGamesProcessed += games.length;

      if (response.results.length < pageSize) break;
    }

    return new Response(
      JSON.stringify({
        message: `${totalGamesProcessed} games processed successfully.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("RAWG API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
