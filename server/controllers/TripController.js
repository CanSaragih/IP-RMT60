const { geminiApi } = require("../helpers/geminiAPI");

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
};
