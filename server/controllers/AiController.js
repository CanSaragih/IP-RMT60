const { geminiApi } = require("../helpers/geminiAPI");

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
};
