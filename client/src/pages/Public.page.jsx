import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; // Tambahkan ini untuk mendeteksi scroll
import { https } from "../helpers/https";
import DestinationCard from "../components/Destination.Card";
import LoginModal from "../components/LoginModal";
import logo from "../assets/logo.png";

export default function PublicPage() {
  const [destinations, setDestinations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const { ref: featureRef, inView: featureInView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const { ref: destinationRef, inView: destinationInView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await https.get("/pub/destinations");
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  // Variants untuk animasi
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 snap-center"
        >
          <motion.img
            src={logo}
            alt="layla"
            className="w-60 mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Your Next Journey,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
              Optimized
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mb-10 text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Susun, personalisasikan, dan optimalkan rencana perjalanan Anda
            dengan perencana perjalanan bertenaga AI kami. Sempurna untuk
            liburan, bekerja, dan petualangan sehari-hari.
          </motion.p>
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.section>

        {/* Feature Section */}
        <motion.section
          ref={featureRef}
          initial="hidden"
          animate={featureInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white snap-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              AI-Powered
            </span>{" "}
            Adventure
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
            <motion.div
              className="p-6 bg-gray-50 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-lime-200 to-lime-300 inline-block px-3 py-1 rounded-lg mb-4">
                Kesempurnaan yang Disesuaikan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritme canggih kami menganalisis preferensi Anda terhadap
                tempat wisata, tempat makan, dan penginapan untuk menyusun
                rencana perjalanan yang sesuai dengan keinginan Anda.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-gray-50 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-lime-200 to-lime-300 inline-block px-3 py-1 rounded-lg mb-4">
                Petualangan yang Lebih Cerdas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nikmati pengalaman perjalanan yang lebih efisien dengan
                rekomendasi berbasis AI yang menghemat waktu, biaya, dan tenaga,
                sehingga Anda bisa fokus menikmati setiap momen.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 max-w-lg mx-auto">
            <motion.div
              className="p-6 bg-gray-50 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-lime-200 to-lime-300 inline-block px-3 py-1 rounded-lg mb-4">
                Perjalanan Tanpa Khawatir
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan panduan real-time untuk menghindari kerumunan,
                menemukan rute alternatif, dan memastikan perjalanan Anda aman
                dan nyaman di mana saja.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Destination Cards Section */}
        <motion.section
          ref={destinationRef}
          initial="hidden"
          animate={destinationInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="min-h-screen flex flex-col justify-center py-20 px-6 bg-gradient-to-b from-gray-50 to-white snap-center"
        >
          <motion.h2
            className="text-4xl font-extrabold text-center mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Discover Global Adventures
          </motion.h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Jelajahi rencana perjalanan unik yang dibuat oleh wisatawan di
            seluruh dunia. Temukan inspirasi untuk perjalanan Anda berikutnya
            dan bagikan kisah Anda sendiri.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {destinations.map((dest, index) => (
              <DestinationCard key={dest.id} dest={dest} delay={index * 0.2} />
            ))}
          </div>
        </motion.section>
      </div>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
