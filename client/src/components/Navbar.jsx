import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import LoginModal from "./LoginModal";
import logo from "../assets/logo2.png";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-10 py-6 bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            <Link to="/"> Planorama</Link>
          </span>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </nav>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
