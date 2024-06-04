const express = require("express");
const {
  subscribe,
  unsubscribe,
} = require("./../../controllers/subscriptionsController/newsletterSubscription");

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

module.exports = router;
