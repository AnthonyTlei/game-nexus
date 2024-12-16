import prisma from "@/lib/prisma";

export async function getRecommendations(userId: string) {
  console.log(`Fetching recommendations for user: ${userId}`);

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile || !profile.games || profile.games.length === 0) {
    console.log("No owned games found for the user.");
    return [];
  }

  try {
    const recommendations = await prisma.$queryRaw`
  SELECT id, name, slug, genres, tags
  FROM games
  WHERE id NOT IN (
    SELECT UNNEST(games)
    FROM profiles
    WHERE "userId" = ${userId}
  )
  ORDER BY vector::vector <-> (
    SELECT AVG(vector::vector)
    FROM games
    WHERE id = ANY(${profile.games})
  )
  LIMIT 10;
`;

    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error("Failed to fetch recommendations.");
  }
}
