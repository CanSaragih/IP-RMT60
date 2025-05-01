import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { https } from "../helpers/https";
import { toast } from "react-toastify";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { format, parseISO, differenceInDays } from "date-fns";
import { Link } from "react-router";

export default function TripOverviewPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [editTrip, setEditTrip] = useState({
    title: "",
    start_date: "",
    end_date: "",
  });
  const [itineraries, setItineraries] = useState([]);
  const [editingItinerary, setEditingItinerary] = useState(null);

  useEffect(() => {
    fetchTrip();
    fetchItineraries();
  }, [tripId]);

  const toDateInput = (isoString) => isoString?.split("T")[0];

  const fetchTrip = async () => {
    try {
      const { data } = await https.get(`/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTrip(data);
      setEditTrip({
        title: data.title,
        start_date: toDateInput(data.start_date),
        end_date: toDateInput(data.end_date),
      });
    } catch (error) {
      console.error("Failed to fetch trip:", error);
      toast.error("Failed to load trip details.");
    }
  };

  const fetchItineraries = async () => {
    try {
      const { data } = await https.get(`/trips/${tripId}/itineraries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const itineraryData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setItineraries(itineraryData);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
      toast.error("Failed to load itineraries.");
    }
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const handleDeleteItinerary = async (id) => {
    try {
      await https.delete(`/itineraries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Itinerary deleted successfully!");
      fetchItineraries();
    } catch {
      toast.error("Failed to delete itinerary");
    }
  };

  const handleEditItinerary = async (id, idx) => {
    const activity = document.getElementById(`activity-${idx}`)?.value || "";
    const notes = document.getElementById(`notes-${idx}`)?.value || "";

    try {
      await https.put(
        `/itineraries/${id}`,
        { activity, notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Itinerary updated!");
      setEditingItinerary(null);
      fetchItineraries();
    } catch {
      toast.error("Failed to update itinerary.");
    }
  };

  if (!trip)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );

  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const completedDays = itineraries.filter(
    (itinerary) => itinerary.activity?.trim() || itinerary.notes?.trim()
  ).length;
  const progressPercentage =
    totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={
            trip.photoReference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${
                  trip.photoReference
                }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
              : "/placeholder.jpg"
          }
          alt="Trip Background"
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-6">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {editTrip.title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-blue-600">📅</span>
                {format(startDate, "dd MMM yyyy")} -{" "}
                {format(endDate, "dd MMM yyyy")} ({totalDays} days)
              </p>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                {formatRupiah(trip.total_budget || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Itinerary Days
            </h3>
            <ul className="space-y-2"></ul>
            <Link
              to="/your-profile"
              className="mt-4 inline-block w-full text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Planning Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {completedDays} of {totalDays} days planned
            </p>
          </div>

          {/* Trip Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trip Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <h1 className="text-2xl md:text-2xl font-extrabold text-gray-900 bg-clip-text hover:text-blue-600 transition-all duration-300 transform hover:scale-101">
                  {editTrip.title}
                </h1>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Budget
                </label>
                <p className="text-3xl font-bold text-blue-600">
                  {formatRupiah(trip.total_budget || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Itinerary List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Itinerary List
            </h2>
            {itineraries.length === 0 ? (
              <p className="text-gray-600">
                No itineraries yet. Start planning your trip!
              </p>
            ) : (
              itineraries.map((item, idx) => (
                <div
                  key={item.id}
                  id={`day-${item.dayNumber}`}
                  className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900"></h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItinerary(idx)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit Itinerary"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteItinerary(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete Itinerary"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {editingItinerary === idx ? (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Activity
                        </label>
                        <input
                          id={`activity-${idx}`}
                          defaultValue={item.activity}
                          placeholder="Enter activity details"
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id={`notes-${idx}`}
                          defaultValue={item.notes}
                          placeholder="Add notes for this day..."
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleEditItinerary(item.id, idx)}
                        className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaSave className="mr-2" /> Save
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-700">Activity:</p>
                        <ul className="list-disc list-inside text-gray-600">
                          {item.activity?.split(",").map((act, i) => (
                            <li key={i}>{act.trim() || "No activity added"}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Notes:</p>
                        <ul className="list-disc list-inside text-gray-600">
                          {item.notes?.split(",").map((note, i) => (
                            <li key={i}>{note.trim() || "No notes added"}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
