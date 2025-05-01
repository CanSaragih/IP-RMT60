import { useEffect, useState } from "react";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { https } from "../helpers/https";
import { useNavigate, useParams } from "react-router";
import {
  ChevronDown,
  ChevronRight,
  StickyNote,
  MapPin,
  Save,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ItineraryPage() {
  let navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [openDays, setOpenDays] = useState({});
  const [notesVisible, setNotesVisible] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTrip();
    fetchItineraries();
  }, [tripId]);

  useEffect(() => {
    const stored = localStorage.getItem("user_google");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
    }
  }, []);

  const fetchTrip = async () => {
    const { data } = await https.get(`/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setTrip(data);
  };

  const fetchItineraries = async () => {
    const { data } = await https.get(`/trips/${tripId}/itineraries`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setItineraries(data.data || data);
  };

  const toggleOpenDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleNotes = (day) => {
    setNotesVisible((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveItinerary = async () => {
    try {
      const activities = [];
      const notes = [];

      dateRange.forEach((_, idx) => {
        const day = idx + 1;
        const activityInput = document.getElementById(`activity-${day}`);
        const notesInput = document.getElementById(`notes-${day}`);

        activities.push(activityInput?.value || "");
        notes.push(notesInput?.value || "");
      });

      await https.post(
        `/trips/${tripId}/itineraries`,
        {
          dayNumber: dateRange.length,
          location: trip.title,
          activity: activities.join(", "),
          notes: notes.join(", "),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success("Itinerary saved successfully! 👌");
      navigate(`/trips/${tripId}/overview`);
    } catch (error) {
      console.error("Failed to save itinerary:", error);
      toast.error(
        error.response.data.message ||
          "Failed to save trip. Please try again.😢"
      );
    }
  };

  if (!trip || !user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading trip...
      </div>
    );

  const dateRange = eachDayOfInterval({
    start: new Date(trip.start_date),
    end: new Date(trip.end_date),
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header Section */}
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
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                {trip.title}
              </h1>
              <p className="mt-2 text-gray-600 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {format(parseISO(trip.start_date), "dd MMM yyyy")} -{" "}
                {format(parseISO(trip.end_date), "dd MMM yyyy")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatarUrl || "/avatar.png"}
                className="w-12 h-12 rounded-full border-2 border-blue-600"
                alt="avatar"
                referrerPolicy="no-referrer"
              />
              <p className="font-medium text-gray-800">{user.username}</p>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Days
            </h3>
            <ul className="space-y-2">
              {dateRange.map((date, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => toggleOpenDay(idx + 1)}
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Day {idx + 1} - {format(date, "dd MMM")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Itinerary Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {dateRange.map((date, idx) => {
              const dayNumber = idx + 1;
              const existing = itineraries.find(
                (i) => i.dayNumber === dayNumber
              );
              const isOpen = openDays[dayNumber];
              const showNotes = notesVisible[dayNumber];

              return (
                <div
                  key={idx}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => toggleOpenDay(dayNumber)}
                  >
                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">
                        Day {dayNumber} - {format(date, "EEEE, dd MMM yyyy")}
                      </h2>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotes(dayNumber);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <StickyNote className="w-5 h-5" />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-4 pl-8 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Activity
                        </label>
                        <input
                          id={`activity-${dayNumber}`}
                          defaultValue={existing?.activity}
                          placeholder="Enter activity details"
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      {showNotes && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            id={`notes-${dayNumber}`}
                            defaultValue={existing?.notes}
                            placeholder="Add notes for this day..."
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={handleSaveItinerary}
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Itinerary
            </button>
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
