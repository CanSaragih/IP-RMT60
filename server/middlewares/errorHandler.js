function errorHandler(error, req, res, next) {
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  if (error.name === "NotFound") {
    return res.status(404).json({ message: error.message });
  }

  if (error.name === "BadRequest") {
    return res.status(400).json({ message: error.message });
  }

  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
}

module.exports = errorHandler;
