const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

//app middlewares
app.use(morgan("dev"));

//server listening for changes
app.listen(port, () => {
  console.log(`Server is listening for changes on ${port}`);
});
