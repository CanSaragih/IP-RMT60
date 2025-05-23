const { signToken } = require("../helpers/jwt");
const { User, Trip } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = class UserController {
  static async loginGoogle(req, res, next) {
    try {
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      let user = await User.findOne({ where: { email: payload.email } });

      if (!user) {
        user = await User.create({
          email: payload.email,
          username: payload.name,
          avatarUrl: payload.picture,
          provider: "google",
          providerId: payload.sub,
        });
      }

      const access_token = signToken({ id: user.id });
      res.json({
        access_token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTripByUserId(req, res, next) {
    try {
      const userId = req.user.id;
      const trips = await Trip.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      res.json(trips);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { username, email, avatarUrl } = req.body;
      await User.update(
        { username, email, avatarUrl },
        { where: { id: req.user.id } }
      );
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
