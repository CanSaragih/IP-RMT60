const router = require("express").Router();
const AiController = require("../controllers/AiController");
const DestinationController = require("../controllers/PublicController");
const TripController = require("../controllers/TripController");
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const errorHandler = require("../middlewares/errorHandler");

router.post("/login/google", UserController.loginGoogle);
router.get("/pub/destinations", DestinationController.publicDestinations);
router.get(
  "/pub/destinations/:id",
  DestinationController.publicDestinationById
);

router.get("/trips", authentication, TripController.getFindTrip);
router.post("/trips", authentication, TripController.createTrips);
router.post("/ai/generate-plan", authentication, AiController.generatePlan);
router.get("/places", authentication, TripController.getPlacesTrip);
router.get("/places/details", authentication, TripController.getPlaceDetails);
router.get("/places/images", TripController.getImagesPlace);

router.use(errorHandler);

module.exports = router;
