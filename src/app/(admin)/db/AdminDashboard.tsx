"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePopulateDB = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/db/populate", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to populate the database.");
      }

      const data = await response.json();
      setMessage(`Success: ${data.message}`);
    } catch (error) {
      console.error("Error populating database:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin: Database Management</h1>
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
  );
}
