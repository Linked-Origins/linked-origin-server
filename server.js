const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 5000;

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

//app middlewares
app.use(morgan("dev"));

//server listening for changes
app.listen(port, () => {
  console.log(`Server is listening for changes on ${port}`);
});
