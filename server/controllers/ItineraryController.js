const { Itinerary } = require("../models");

module.exports = class ItineraryController {
  static async getItinerariesByTripId(req, res, next) {
    try {
      const { tripId } = req.params;
      const itinerary = await Itinerary.findAll({
        where: {
          tripId: tripId,
        },
        order: [["dayNumber", "ASC"]],
      });
      res.json(itinerary);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createItinerary(req, res, next) {
    try {
      const { tripId } = req.params;
      const { dayNumber, location, activity, notes } = req.body;
      const itinerary = await Itinerary.create({
        tripId,
        dayNumber,
        location,
        activity,
        notes,
      });
      res.status(201).json(itinerary);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateItinerary(req, res, next) {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteItinerary(req, res, next) {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
