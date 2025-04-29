import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { https } from "../helpers/https";
import { useNavigate } from "react-router";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleCredentialResponse(response) {
    const { data } = await https.post("/login/google", {
      googleToken: response.credential,
    });
    localStorage.setItem("access_token", data.access_token);
    onClose();
    navigate("/home");
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large", width: "100%" }
    );
    window.google.accounts.id.prompt();
  }, []);

  return createPortal(
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition"
        >
          ×
        </button>
        <h2 className="text-center font-extrabold text-2xl text-gray-900">
          Log in to view this page
        </h2>

        <div className="space-y-4 mt-6">
          {/* Google Login Button */}
          <motion.div
            id="google-login-button"
            className="w-full flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Form Inputs */}
          <input
            type="email"
            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400"
            placeholder="Email"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400"
              placeholder="Password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log in
          </motion.button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account yet?{" "}
            <span className="font-semibold text-green-600 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
