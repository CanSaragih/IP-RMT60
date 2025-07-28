console.log({ env: process.env.NODE_ENV });
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://planorama-brown.vercel.app"],
    credentials: "true",
  })
);

app.use(router);

module.exports = app;
