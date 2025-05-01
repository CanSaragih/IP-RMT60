import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, Settings, LogOut } from "lucide-react";
import { toast } from "react-toastify";

export default function NavbarPrivate() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user_google");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_google");
    navigate("/");
    toast.success("Logout successful 👌");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 px-6 py-4 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img src="/src/assets/logo2.png" alt="logo" className="w-12 h-12" />
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            <Link to="/">Planorama</Link>
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Nav Links */}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-700"
            />
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <motion.img
              src={user?.avatarUrl || "/avatar.png"}
              referrerPolicy="no-referrer"
              alt="avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-blue-500 hover:border-blue-600 transition-all"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      navigate("/your-profile");
                      setDropdownOpen(false);
                    }}
                  >
                    <User className="w-5 h-5" />
                    Your Profile
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-700"
                />
              </div>

              {/* Dropdown Items */}
              <button
                className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-blue-600 py-2 transition-colors"
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-5 h-5" />
                Your Profile
              </button>
              <button
                className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-blue-600 py-2 transition-colors"
                onClick={() => {
                  navigate("/settings");
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                className="flex items-center gap-2 w-full text-left text-red-500 hover:text-red-600 py-2 transition-colors"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
