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

  static async publicDestinationById(req, res, next) {
    try {
      const { id } = req.params;
      const destination = await Destination.findByPk(id, {
        include: DestinationDetail,
      });

      if (!destination) {
        throw { name: "NotFound", message: "Destination not found" };
      }

      res.status(200).json(destination);
    } catch (error) {
      next(error);
    }
  }
};
