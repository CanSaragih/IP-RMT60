require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const UserController = require("./controllers/UserController");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/login/google", UserController.loginGoogle);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
