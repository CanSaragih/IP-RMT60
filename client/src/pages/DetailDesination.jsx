import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { https } from "../helpers/https";
import LoginModal from "../components/LoginModal";

export default function DetailDestination() {
  const { id } = useParams();

  const [destination, setDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data } = await https.get(`/pub/destinations/${id}`);
        setDestination(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchDestination();
  }, [id]);

  if (!destination)
    return (
      <div className="p-10 text-gray-600 text-xl font-semibold">Loading...</div>
    );

  const { name, DestinationDetail, latitude, longitude, imageUrl } =
    destination;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
        {/* Hero Section */}
        <div className="relative h-[600px] overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg"
            >
              {name}
            </motion.h1>
          </div>
        </div>

        {/* Detail Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Info */}
            <motion.div
              className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-gray-900">{name}</h2>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center gap-3">
                  <span className="text-green-600">📍</span>
                  <span>
                    {DestinationDetail?.address || "Address not available"}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-green-600">⏰</span>
                  <span>
                    {DestinationDetail?.opening_hours ||
                      "Opening hours not available"}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-green-600">📞</span>
                  <span>
                    {DestinationDetail?.phone_number ||
                      "Phone number not available"}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-green-600">🌐</span>
                  <a
                    href={DestinationDetail?.website || "#"}
                    className="text-blue-600 underline hover:text-blue-800 transition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {DestinationDetail?.website
                      ? "Visit Website"
                      : "Website not available"}
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Right Column: Rating & CTA */}
            <motion.div
              className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500 text-3xl">⭐</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {DestinationDetail?.rating || "N/A"} / 5
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                ({DestinationDetail?.total_reviews || "0"} reviews)
              </p>
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Plan Your Visit
              </motion.button>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Location
            </h3>
            <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                allowFullScreen
                title="Destination Location"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
