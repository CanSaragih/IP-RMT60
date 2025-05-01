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
      const { id } = req.params;
      const { dayNumber, location, activity, notes } = req.body;
      const itinerary = await Itinerary.findByPk(id);
      if (!itinerary)
        throw { name: "NotFound", message: "Itinerary not found" };

      itinerary.dayNumber = dayNumber || itinerary.dayNumber;
      itinerary.location = location || itinerary.location;
      itinerary.activity = activity || itinerary.activity;
      itinerary.notes = notes || itinerary.notes;

      await itinerary.save();
      res.status(200).json(itinerary);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteItinerary(req, res, next) {
    try {
      const { id } = req.params;
      const itinerary = await Itinerary.findByPk(id);
      if (!itinerary)
        throw { name: "NotFound", message: "Itinerary not found" };
      await itinerary.destroy();
      res.status(200).json({ message: "Itinerary deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
