const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw { name: "Unauthorized", message: "Please login first" };
    }

    const access_token = bearerToken.split(" ")[1];

    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw { name: "Unauthorized", message: "User not found" };
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;
