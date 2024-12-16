import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbeddings() {
  console.log("Generating embeddings using OpenAI...");

  const batchSize = 50;
  const games = await prisma.game.findMany({
    where: { vector: undefined },
  });

  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize);

    const inputs = batch.map(
      (game) =>
        `${game.name} ${game.genres.join(", ")} ${game.tags.join(", ")} ${game.slug}`,
    );

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: inputs,
      });

      await Promise.all(
        batch.map((game, idx) =>
          prisma.game.update({
            where: { id: game.id },
            data: { vector: response.data[idx].embedding },
          }),
        ),
      );

      console.log(`Successfully processed batch: ${i + 1}-${i + batchSize}`);
    } catch (error) {
      console.error("Error processing batch:", error);
    }
  }

  console.log("Embedding generation complete.");
}
