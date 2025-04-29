const router = require("express").Router();
const DestinationController = require("../controllers/DestinationController");
const UserController = require("../controllers/UserController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/login/google", UserController.loginGoogle);
router.get("/pub/destinations", DestinationController.publicDestinations);

router.use(errorHandler);

module.exports = router;
