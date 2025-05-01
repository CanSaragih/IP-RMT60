const { geminiApi } = require("../helpers/geminiAPI");
const { Trip, Itinerary } = require("../models");

module.exports = class AiController {
  static async generatePlan(req, res, next) {
    try {
      const { destination, city, start_date, end_date } = req.body;
      if (!destination || !city || !start_date || !end_date) {
        throw { name: "BadRequest", message: "Incomplete data" };
      }

      const prompt = `
        Buatlah rencana perjalanan ke tempat wisata bernama "${destination}" dari kota "${city}".
        Perjalanan dimulai pada tanggal ${start_date} hingga ${end_date}.
        Tolong berikan itinerary singkat dan estimasi total biaya secara ringkas dalam format seperti:

        Rencana:
        - Hari 1: ...
        - Hari 2: ...
        Total budget: Rp 1.500.000
        `;

      const geminiResponse = await geminiApi({ prompt });

      return res.status(200).json({
        generated_plan: geminiResponse,
      });
    } catch (error) {
      console.log("GENERATE PLAN ERROR >>> ", error);

      next(error);
    }
  }

  static async regenerateTripPlan(req, res, next) {
    try {
      console.log("params:", req.params); // debug
      console.log("body:", req.body);

      const { tripId } = req.params;
      const trip = await Trip.findByPk(tripId);
      if (!trip) throw { name: "NotFound", message: "Trip not found" };

      const itineraries = await Itinerary.findAll({ where: { tripId } });

      // Format data untuk prompt
      const formattedData = itineraries
        .map(
          (item) =>
            `Day ${item.dayNumber}: ${item.activity} (${
              item.notes || "no notes"
            })`
        )
        .join("\n");

      const prompt = `
        Given the following itinerary details for a trip titled "${trip.title}" from ${trip.start_date} to ${trip.end_date}, estimate a total budget in USD and write a brief AI-generated summary plan:
        
        ${formattedData}
        
        Respond with a JSON format:
        {
          "total_budget": number,
          "generated_plan": string
        }
      `;

      const aiResult = await geminiApi({ prompt });

      const cleanedResult = aiResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Parsing response
      const { total_budget, generated_plan } = JSON.parse(cleanedResult);

      // Update trip
      await trip.update({ total_budget, generated_plan });

      res.status(200).json({
        message: "Trip updated with AI results",
        total_budget,
        generated_plan,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
