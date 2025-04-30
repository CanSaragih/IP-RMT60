import { Star } from "lucide-react";

const DestinationGeneratedCard = ({
  title,
  img,
  price,
  rating,
  reviews,
  address,
  openNowText,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition">
      <img
        src={img}
        alt={title}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>

      <div className="flex items-center text-sm text-gray-500 mb-1">
        <Star size={16} className="text-yellow-500 mr-1" />
        {rating} ({reviews?.toLocaleString()} reviews)
      </div>

      {address && (
        <p className="text-sm text-gray-600 truncate mb-1">{address}</p>
      )}

      {openNowText && (
        <p
          className={`text-sm ${
            openNowText.includes("Tutup") ? "text-red-500" : "text-green-600"
          }`}
        >
          {openNowText}
        </p>
      )}
    </div>
  );
};

export default DestinationGeneratedCard;
