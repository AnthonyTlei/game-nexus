import getSession from "@/lib/getSession";
import { generateEmbeddings } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    await generateEmbeddings();
    return NextResponse.json({ message: "Embeddings generated successfully." });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings." },
      { status: 500 },
    );
  }
}
