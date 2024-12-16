"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  id: number;
  name: string;
  slug: string;
  genres: string[];
  tags: string[];
};

export default function RecommendationsList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/recommendations");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch recommendations.",
          );
        }

        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading recommendations...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (recommendations.length === 0) {
    return (
      <p className="text-center text-gray-500">No recommendations available.</p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Recommended Games</h1>
      <ul className="space-y-4">
        {recommendations.map((game) => (
          <li
            key={game.id}
            className="rounded border p-4 shadow hover:bg-gray-100"
          >
            <h2 className="text-lg font-semibold">{game.name}</h2>
            <p className="text-sm text-gray-600">Slug: {game.slug}</p>
            <p className="text-sm text-gray-600">
              Genres: {game.genres.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Tags: {game.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
