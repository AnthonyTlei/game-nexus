import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendations";
import getSession from "@/lib/getSession";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendations = await getRecommendations(session.user.id);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations." },
      { status: 500 },
    );
  }
}
