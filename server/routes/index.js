const router = require("express").Router();
const AiController = require("../controllers/AiController");
const ItineraryController = require("../controllers/ItineraryController");
const DestinationController = require("../controllers/PublicController");
const TripController = require("../controllers/TripController");
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const errorHandler = require("../middlewares/errorHandler");

// Public routes
router.post("/login/google", UserController.loginGoogle);
router.get("/pub/destinations", DestinationController.publicDestinations);
router.get(
  "/pub/destinations/:id",
  DestinationController.publicDestinationById
);

// Destination Generator AI
router.get("/trips", authentication, TripController.getFindTrip);
router.post("/trips", authentication, TripController.createTrips);
router.post("/ai/generate-plan", authentication, AiController.generatePlan);
router.get("/places", authentication, TripController.getPlacesTrip);
router.get("/places/details", authentication, TripController.getPlaceDetails);
router.get("/places/images", TripController.getImagesPlace);

//Itinerary Crud
router.get("/trips/:tripId", authentication, TripController.getTripById);

router.get(
  "/trips/:tripId/itineraries",
  authentication,
  ItineraryController.getItinerariesByTripId
);
router.post(
  "/trips/:tripId/itineraries",
  authentication,
  ItineraryController.createItinerary
);

// Trip Overview
router.put("/trips/:tripId", authentication, TripController.updateTrip);
router.put(
  "/itineraries/:id",
  authentication,
  ItineraryController.updateItinerary
);
router.put("/trips/:tripId/regenerate", AiController.regenerateTripPlan);
router.delete(
  "/itineraries/:id",
  authentication,
  ItineraryController.deleteItinerary
);

router.use(errorHandler);

module.exports = router;
