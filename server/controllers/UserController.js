const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
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
      res.json({ access_token });
    } catch (error) {
      next(error);
    }
  }
};
