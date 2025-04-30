import { useState } from "react";
import getGeneratedTrip from "../services/TripServices";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      const result = await getGeneratedTrip(prompt);
      setGenerated(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Ketik prompt misalnya: Itinerary 3 hari di Jepang"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Trip Plan"}
      </button>

      {generated && (
        <div className="mt-4 p-4 border rounded bg-gray-100 whitespace-pre-line">
          {generated}
        </div>
      )}
    </div>
  );
}
