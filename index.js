const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const searchRoute = require("./routes/searchRoute");
const newsRoute = require("./routes/newsRoute");
const chatRoute = require("./routes/chat");
const jobsRoute = require("./routes/jobsListingsRoute");
const matchingRoute = require("./routes/matchingRoutes/matchingRoute");
const newsletterSubscriptionRoute = require("./routes/subscriptionRoutes/newsletterSubscriptionRoute");
const forgottenPasswordRoute = require("./routes/passwordHandlingRoute/forgottenPasswordRoute");
const { getNews, getWorldNews } = require("./controllers/newsController");
const axios = require("axios");
const { googlePlaceCheck } = require("./controllers/searchController");
const {
  addCategory,
  addSubCategory,
} = require("./controllers/categoryManagement");
const cors = require("cors");

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
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res, next) => {
  return res.send("Welcome to the back end!");
});
// Call the getNews function at least once to populate the database initially
//getNews();

// Set an interval to fetch news every 2 hours
//setInterval(() => {
//  getNews();
//}, 240 * 1000);

//route middlewares
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/news-update", newsRoute);
app.use("/api/v1/users/mon-ami", chatRoute);
app.use("/api/v1/jobs", jobsRoute);
app.use("/api/v1/matching/", matchingRoute);
app.use("/api/v1/subscription/newsletter", newsletterSubscriptionRoute);
app.use("/api/v1/password-handling", forgottenPasswordRoute);

app.post("/add-category", addCategory);
app.post("/add-subcategory", addSubCategory);

// Route to fetch and scrape CBC News articles
//app.get("/cbs-news", async (req, res) => {
//  try {
//    const browser = await puppeteer.launch();
//    const page = await browser.newPage();
//    await page.goto("https://www.cbsnews.com/");
//    await page.waitForSelector(".item__title");
//
//    const articles = await page.evaluate(() => {
//      const articleElements = document.querySelectorAll(".item__title");
//      const articles = [];
//
//      articleElements.forEach((element) => {
//        const title = element.innerText.trim();
//        const link = element.parentElement.href;
//        articles.push({ title, link });
//      });
//
//      return articles;
//    });
//
//    await browser.close();
//
//    res.json(articles);
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({ error: "Failed to fetch CBS News articles" });
//  }
//});
//
app.get("/worldnews", async (req, res, next) => {
  const url =
    "https://api.worldnewsapi.com/search-news?text=employment&language=en&source-country=ca";
  const apiKey = "cc553144e273435b886fc6799140c3cb";

  try {
    // Make the GET request using axios
    const response = await axios.get(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    // Access the data from response.data
    const data = response.data;

    // Log the data to the console
    console.log(data);

    // Send the data as a JSON response to the client
    res.status(200).json(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);

    // Handle the error by sending an error response to the client
    res.status(500).json({ error: "Failed to fetch world news" });
  }
});
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
