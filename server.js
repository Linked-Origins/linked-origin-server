const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const usersRoute = require("./routes/usersRoute");

const app = express();

//import environment variables.
const port = process.env.PORT || 5000;
const uri = process.env.URI;

// mongodb connection.
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

//app middlewares.
app.use(morgan("dev"));
app.use(express.json());

//route middlewares
app.use("/api/v1/users", usersRoute);
//unhandled routes
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.errCode = 404;
  err.status = "fail!";

  next(err);
});

//error handler
app.use((err, req, res, next) => {
  const errorMessage = err.message;
  const errorStatus = err.status || "INTERNAL SERVER ERROR";
  const errorCode = err.errCode || 500;
  const stack = err.stack;
  return res
    .status(errorCode)
    .json({ status: errorStatus, message: errorMessage, stack: stack });
});

//server listening for changes.
app.listen(port, () => {
  console.log(`Server is listening for changes on ${port}`);
});
