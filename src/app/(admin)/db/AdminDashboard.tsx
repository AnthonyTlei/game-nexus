"use client";

import { useState } from "react";
import ky from "ky";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [embeddingLoading, setEmbeddingLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [embeddingMessage, setEmbeddingMessage] = useState<string | null>(null);

  const handlePopulateDB = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await ky
        .get("/api/db/populate")
        .json<{ message: string }>();
      setMessage(`Success: ${response.message}`);
    } catch (error) {
      console.error("Error populating database:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    setEmbeddingLoading(true);
    setEmbeddingMessage(null);

    try {
      const response = await ky
        .post("/api/generate-embeddings")
        .json<{ message: string }>();
      setEmbeddingMessage(`Success: ${response.message}`);
    } catch (error) {
      console.error("Error generating embeddings:", error);
      setEmbeddingMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setEmbeddingLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin: Database Management</h1>

      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Populate Database</h2>
        <button
          onClick={handlePopulateDB}
          disabled={loading}
          className={`rounded px-4 py-2 text-white ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Populating..." : "Populate DB"}
        </button>
        {message && (
          <p
            className={`mt-4 ${
              message.startsWith("Success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">Generate Game Embeddings</h2>
        <button
          onClick={handleGenerateEmbeddings}
          disabled={embeddingLoading}
          className={`rounded px-4 py-2 text-white ${
            embeddingLoading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {embeddingLoading ? "Generating..." : "Generate Embeddings"}
        </button>
        {embeddingMessage && (
          <p
            className={`mt-4 ${
              embeddingMessage.startsWith("Success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {embeddingMessage}
          </p>
        )}
      </div>
    </div>
  );
}
