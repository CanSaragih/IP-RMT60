import { useEffect, useState } from "react";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { https } from "../helpers/https";
import { useParams } from "react-router";
import { ChevronDown, ChevronRight, StickyNote } from "lucide-react";

export default function ItineraryPage() {
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

  if (!trip || !user) return <div>Loading trip...</div>;

  const dateRange = eachDayOfInterval({
    start: new Date(trip.start_date),
    end: new Date(trip.end_date),
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Trip Info */}
      <div className="relative">
        <img
          src={
            trip.photoReference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${
                  trip.photoReference
                }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
              : "/placeholder.jpg"
          }
          alt="Trip Background"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[200px] bg-white rounded-2xl shadow-xl px-6 py-4 w-[90%] max-w-3xl flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h1
                contentEditable
                suppressContentEditableWarning
                className="text-3xl font-bold bg-gray-100 px-3 py-1 rounded-lg"
              >
                {trip.title}
              </h1>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-pen text-sm"></i>
              </button>
            </div>
            <p className="mt-2 text-gray-600 flex items-center gap-2">
              <i className="fas fa-calendar-alt"></i>
              {format(parseISO(trip.start_date), "dd/MM")} -{" "}
              {format(parseISO(trip.end_date), "dd/MM")}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <img
              src={user?.avatarUrl || "/avatar.png"}
              className="w-12 h-12 rounded-full"
              alt="avatar"
              referrerPolicy="no-referrer"
            />
            <p className="font-medium">{user.username}</p>
          </div>
        </div>
      </div>

      {/* Itinerary Form Per Day */}
      <div className="mt-16 space-y-4">
        {dateRange.map((date, idx) => {
          const dayNumber = idx + 1;
          const existing = itineraries.find((i) => i.dayNumber === dayNumber);
          const isOpen = openDays[dayNumber];
          const showNotes = notesVisible[dayNumber];

          return (
            <div key={idx} className="border-b pb-4">
              {/* Header - collapsible */}
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => toggleOpenDay(dayNumber)}
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown /> : <ChevronRight />}
                  <h2 className="text-lg font-semibold">
                    Day {dayNumber} - {format(date, "EEEE, dd MMM")}
                  </h2>
                </div>
                {isOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNotes(dayNumber);
                    }}
                    className="text-gray-500 hover:text-black"
                  >
                    <StickyNote className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Detail form */}
              {isOpen && (
                <div className="mt-3 space-y-2 pl-6">
                  <input
                    defaultValue={existing?.activity}
                    placeholder="Activity"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                  {showNotes && (
                    <textarea
                      defaultValue={existing?.notes}
                      placeholder="Notes..."
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
