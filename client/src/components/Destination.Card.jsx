import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";

export default function DestinationCard({ dest, delay }) {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay }} // Transition untuk animasi muncul
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3, ease: "easeOut" }, // Transition khusus untuk hover
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/destination/${dest.id}`)}
      className="relative bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl"
    >
      {/* Image with gradient overlay */}
      <div className="relative">
        <img
          src={
            dest.imageUrl ||
            `https://source.unsplash.com/600x400/?${dest.name},travel`
          }
          alt={dest.name}
          className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="text-2xl font-bold text-gray-900 truncate">
          {dest.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {dest.DestinationDetail?.address || "Unknown location"}
        </p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400 text-lg">⭐</span>
          <span className="ml-1 text-gray-700 font-medium">
            {dest.DestinationDetail?.rating || "N/A"}
          </span>
        </div>
      </div>

      {/* Hover effect badge */}
      <motion.div
        className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Explore Now
      </motion.div>
    </motion.div>
  );
}
