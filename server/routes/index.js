const router = require("express").Router();
const DestinationController = require("../controllers/PublicController");
const UserController = require("../controllers/UserController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/login/google", UserController.loginGoogle);
router.get("/pub/destinations", DestinationController.publicDestinations);
router.get(
  "/pub/destinations/:id",
  DestinationController.publicDestinationById
);

router.use(errorHandler);

module.exports = router;
