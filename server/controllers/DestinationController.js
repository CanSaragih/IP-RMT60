const { Destination, DestinationDetail } = require("../models");

module.exports = class DestinationController {
  static async publicDestinations(req, res, next) {
    try {
      const destinations = await Destination.findAll({
        include: DestinationDetail,
      });

      res.status(200).json(destinations);
    } catch (error) {
      next(error);
    }
  }
};
