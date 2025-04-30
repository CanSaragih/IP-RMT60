import { useState } from "react";
import { getGeneratedTrip, getPlacesTrip } from "../services/TripServices";
import { https } from "../helpers/https";
import DestinationGeneratedCard from "../components/DestinationGeneratedCard";
import DestinationDetailModal from "../components/DestinationDetailModal";
import { DotWave } from "@uiball/loaders";
import { motion } from "framer-motion";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = https.defaults.baseURL;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const userMsg = { from: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await getGeneratedTrip(prompt);
      const aiMsg = { from: "ai", text: result };
      setMessages((prev) => [...prev, aiMsg]);
      setHasGenerated(true);

      const places = await getPlacesTrip(prompt);
      setDestinations(places);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <DotWave size={47} speed={1.3} color="#3B82F6" />
          <p className="text-white mt-4 text-lg font-semibold">
            Generating your trip...
          </p>
        </div>
      </div>
    );
  }

  const handleCardClick = async (destination) => {
    try {
      // Fetch more detailed place information
      const { data } = await https.get(
        `/places/details?place_id=${destination.place_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setSelectedDestination({
        ...destination,
        details: data.result,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching place details:", error);
      setSelectedDestination(destination);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {!hasGenerated ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L50 50L100 0L150 50L200 0L250 50L300 0L350 50L400 0L450 50L500 0L550 50L600 0L650 50L700 0L750 50L800 0"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  opacity="0.1"
                />
              </svg>
            </div>

            {/* Travel Icons */}
            <motion.div
              className="absolute top-10 left-10 text-blue-200 text-6xl"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 0.3, rotate: 0 }}
              transition={{ duration: 1 }}
            >
              ✈️
            </motion.div>
            <motion.div
              className="absolute bottom-10 right-10 text-blue-200 text-6xl"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 0.3, rotate: 0 }}
              transition={{ duration: 1 }}
            >
              🗺️
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">🌍</span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900">
                  Hey, I'm Planorama your personal trip planner
                </h1>
                <span className="text-4xl">✈️</span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg">
                Beri tahu saya apa yang Anda inginkan, dan saya akan mengurus
                sisanya — penerbangan, hotel, rencana perjalanan, dalam hitungan
                detik.
              </p>
              <p className="text-blue-600 max-w-2xl mx-auto mb-8 italic text-sm">
                "Explore the World with Ease! ✈️"
              </p>

              <div className="w-full max-w-2xl relative">
                <motion.textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="e.g. Rekomendasi tempat wisata..."
                  rows={3}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <motion.button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    "..."
                  ) : (
                    <>
                      Generate <span>✈️</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen gap-6 p-4 bg-white">
            {/* LEFT: CHAT */}
            <motion.div
              className="flex flex-col h-screen"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-blue-900">
                  Chat Assistant
                </h2>
                <span className="text-blue-500">💬</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    className={`whitespace-pre-wrap text-sm max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white self-end ml-auto"
                        : "bg-gray-100 text-gray-900 self-start"
                    }`}
                    style={{
                      alignSelf:
                        msg.from === "user" ? "flex-end" : "flex-start",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.text),
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="Tanya sesuatu..."
                  rows={2}
                />
                <motion.button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    "..."
                  ) : (
                    <>
                      Send <span>➤</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* RIGHT: DESTINATIONS */}
            <div className="flex flex-col h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                Recommended Destinations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.isArray(destinations) &&
                  destinations.map((place, idx) => {
                    const photoRef = place.photos?.[0]?.photo_reference;
                    const imageUrl = photoRef
                      ? `${baseUrl}/places/images?ref=${photoRef}`
                      : "https://via.placeholder.com/400x300?text=No+Image";

                    return (
                      <div
                        key={idx}
                        className="cursor-pointer"
                        onClick={() => handleCardClick(place)}
                      >
                        <DestinationGeneratedCard
                          title={place.name}
                          img={imageUrl}
                          rating={place.rating}
                          totalReviews={place.user_ratings_total}
                          address={place.vicinity}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DestinationDetailModal
          destination={selectedDestination}
          onClose={() => setShowModal(false)}
          messages={messages}
        />
      )}
    </>
  );
}

function formatMessage(text) {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  const lines = formatted.split("\n").filter(Boolean);
  let result = "";
  let isList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.match(/^\d+\./)) {
      if (!isList) {
        result += "<ol class='list-decimal list-inside space-y-1 mb-2'>";
        isList = true;
      }
      result += `<li>${trimmed.replace(/^\d+\.\s*/, "")}</li>`;
    } else {
      if (isList) {
        result += "</ol>";
        isList = false;
      }
      result += `<p class="mb-2">${trimmed}</p>`;
    }
  });

  if (isList) result += "</ol>";
  return result;
}
