const { geminiApi } = require("../helpers/geminiAPI");
const { Trip, User } = require("../models");

const axios = require("axios");

module.exports = class TripController {
  static async getFindTrip(req, res, next) {
    try {
      const { prompt } = req.query;

      if (!prompt) {
        throw { name: "BadRequest", message: "Prompt is required" };
      }

      const geminiResponse = await geminiApi({ prompt });
      res.status(200).json({ result: geminiResponse });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getTripById(req, res, next) {
    try {
      const { tripId } = req.params;
      const trip = await Trip.findByPk(tripId);
      if (!trip) throw { name: "NotFound" };
      res.json(trip);
    } catch (err) {
      next(err);
    }
  }

  static async createTrips(req, res, next) {
    try {
      const {
        title,
        start_date,
        end_date,
        total_budget,
        generated_plan,
        photoReference,
      } = req.body;
      const userId = req.user.id;
      const newTrip = await Trip.create({
        userId,
        title,
        start_date,
        end_date,
        total_budget,
        generated_plan,
        photoReference,
        userId: req.user.id,
      });

      res.status(201).json(newTrip);
    } catch (error) {
      console.log("CREATE TRIP ERROR >>> ", error);
      next(error);
    }
  }

  static async getPlacesTrip(req, res, next) {
    try {
      const { query } = req.query;
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const location = query;

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        location
      )}&key=${apiKey}`;

      const { data } = await axios.get(url);

      if (!data || !data.results) {
        return res
          .status(500)
          .json({ message: "No results from Google Places API" });
      }

      res.json(data.results);
    } catch (error) {
      next(error);
    }
  }

  static async getImagesPlace(req, res, next) {
    try {
      const { ref } = req.query;
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${apiKey}`;

      const response = await axios.get(photoUrl, { responseType: "stream" });
      response.data.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  static async getPlaceDetails(req, res, next) {
    const { place_id } = req.query;

    if (!place_id) throw { name: "BadRequest", message: "Missing place_id" };

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id,
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: "id",
            fields:
              "name,rating,formatted_address,opening_hours,photos,types,geometry,review,user_ratings_total,website", // pilih fields penting
          },
        }
      );

      res.json(response.data.result);
    } catch (error) {
      next(error);
    }
  }

  static async updateTrip(req, res, next) {
    try {
      const { tripId } = req.params;
      const { title, start_date, end_date } = req.body;

      const trip = await Trip.findByPk(tripId);
      if (!trip) throw { name: "NotFound", message: "Trip not found" };

      trip.title = title;
      trip.start_date = start_date || trip.start_date;
      trip.end_date = end_date || trip.end_date;

      await trip.save();
      res.status(200).json(trip);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteTrip(req, res, next) {
    try {
      await Trip.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
