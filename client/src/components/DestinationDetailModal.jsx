import { DotWave } from "@uiball/loaders";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  X,
  Calendar,
  Map,
  Info,
} from "lucide-react";
import { useState } from "react";
import { https } from "../helpers/https";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";

const DestinationDetailModal = ({ destination, onClose }) => {
  const [tripData, setTripData] = useState({
    start_date: null,
    end_date: null,
    city: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const baseUrl = https.defaults.baseURL;

  const imageUrl = destination.photos?.[0]?.photo_reference
    ? `${baseUrl}/places/images?ref=${destination.photos[0].photo_reference}`
    : "https://via.placeholder.com/800x500?text=No+Image";

  const hasDetails = destination.details;
  const openingHours = hasDetails
    ? destination.details.opening_hours?.weekday_text
    : null;
  const phoneNumber = hasDetails
    ? destination.details.formatted_phone_number
    : null;
  const website = hasDetails ? destination.details.website : null;
  const types = destination.types?.filter((t) => !t.includes("_")) || [];
  const currentDay = new Date().toLocaleString("en-us", { weekday: "long" });

  const handleDateChange = (date, field) => {
    setTripData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formattedStartDate = tripData.start_date?.toISOString();
      const formattedEndDate = tripData.end_date?.toISOString();

      const res = await https.post(
        "/ai/generate-plan",
        {
          destination: destination.name,
          city: tripData.city,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const aiMessage = res.data.generated_plan;

      const rupiahMatch = aiMessage.match(/Rp\s?([\d.]+)/i);
      const budget = rupiahMatch
        ? parseInt(rupiahMatch[1].replace(/\./g, ""))
        : 0;

      const tripPayload = {
        title: destination.name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        city: tripData.city,
        total_budget: budget,
        generated_plan: aiMessage,
      };

      await https.post("/trips", tripPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      alert("Trip saved successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to save trip:", error);
      alert("Failed to save trip");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <DotWave size={60} speed={1.3} color="#3B82F6" />
          <p className="text-white mt-6 text-xl font-semibold">
            Saving your trip...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-sm w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="relative group">
          <img
            src={imageUrl}
            alt={destination.name}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-gray-700" />
          </motion.button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Title Section */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {destination.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="text-yellow-500 w-4 h-4 mr-1" />
                  <span className="font-medium text-blue-800">
                    {destination.rating}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({destination.user_ratings_total?.toLocaleString()})
                  </span>
                </div>
                {types.length > 0 && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {types[0]}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Trip Planning Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={tripData.start_date}
                      onChange={(date) => handleDateChange(date, "start_date")}
                      selectsStart
                      startDate={tripData.start_date}
                      endDate={tripData.end_date}
                      minDate={new Date()}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholderText="Pilih tanggal mulai"
                      required
                      dateFormat="dd/MM/yyyy"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute left-3 top-3 text-blue-500"
                    >
                      <Calendar size={18} />
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Akhir
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={tripData.end_date}
                      onChange={(date) => handleDateChange(date, "end_date")}
                      selectsEnd
                      startDate={tripData.start_date}
                      endDate={tripData.end_date}
                      minDate={tripData.start_date || new Date()}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholderText="Pilih tanggal akhir"
                      required
                      dateFormat="dd/MM/yyyy"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute left-3 top-3 text-blue-500"
                    >
                      <Calendar size={18} />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Kota Asal
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={tripData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan kota asal Anda"
                    required
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute left-3 top-3 text-blue-500"
                  >
                    <Map size={18} />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={tripData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Tambahkan catatan untuk trip ini..."
                />
              </div>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/95 px-3 text-sm font-medium text-gray-600"></span>
              </div>
            </div>
          </div>

          {/* Footer dalam form */}
          <motion.div
            className="p-4 border-t flex justify-end bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Batal
            </motion.button>
            <motion.button
              type="submit"
              disabled={
                isSaving ||
                !tripData.start_date ||
                !tripData.end_date ||
                !tripData.city
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? "Menyimpan..." : "Simpan Trip"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DestinationDetailModal;
