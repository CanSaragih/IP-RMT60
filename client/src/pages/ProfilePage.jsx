import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { https } from "../helpers/https";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user_google");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const { data } = await https.get(`/trips/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTrips(data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  const formatDateIndo = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateTripDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${duration} hari`;
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
    navigate("/");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/travel-hero.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 animate-pulse"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900">
              Selamat Datang, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Jelajahi dunia dengan rencana perjalanan yang sempurna bersama{" "}
              <span className="font-bold text-blue-500">Planorama</span>.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <motion.div
          className="lg:w-1/3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl mb-4"></div>
          <div className="relative -mt-16">
            <img
              src={user?.avatarUrl || "/avatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            {user?.username}
          </h2>
          <p className="text-gray-600 mt-2">
            {user?.email || "user@example.com"}
          </p>
          <div className="mt-4 w-full">
            <div className="flex justify-center text-sm text-gray-600">
              <p>
                Total Perjalanan:{" "}
                <span className="font-semibold text-blue-600">
                  {trips.length}
                </span>
              </p>
            </div>
          </div>
          <motion.button
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all relative overflow-hidden"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Edit Profil</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 hover:opacity-20 transition-opacity"></span>
          </motion.button>
        </motion.div>

        {/* Trips Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Perjalanan Anda
            </h2>
            <motion.button
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/plan")}
            >
              <Plus className="w-5 h-5" />
              Buat Perjalanan Baru
            </motion.button>
          </div>
          {trips.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-white/80 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/no-trips.svg"
                alt="No trips"
                className="w-48 mx-auto mb-4"
              />
              <p className="text-gray-600 text-lg">
                Belum ada perjalanan. Mulai rencanakan petualangan Anda!
              </p>
              <motion.button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/plan")}
              >
                Mulai Sekarang
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <Tilt
                  key={trip.id}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  scale={1.02}
                >
                  <motion.div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/trips/${trip.id}/overview`)}
                  >
                    <div className="relative h-56">
                      <motion.img
                        src={
                          trip.photoReference
                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${
                                trip.photoReference
                              }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                            : "/placeholder.jpg"
                        }
                        alt="Trip"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <motion.button
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-red-500 hover:text-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                      <span className="absolute bottom-3 right-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {calculateTripDuration(trip.start_date, trip.end_date)}
                      </span>
                    </div>
                    <motion.div
                      className="p-5 bg-white/95"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDateIndo(trip.start_date)} –{" "}
                        {formatDateIndo(trip.end_date)}
                      </p>
                    </motion.div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
