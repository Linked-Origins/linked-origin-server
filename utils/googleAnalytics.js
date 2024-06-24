const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const MEASUREMENT_ID = "G-M0J8EPYVFJ"; // Replace with your Measurement ID
const API_SECRET = "gqhmUAjcRNGcwEvaGMGrEw"; // Replace with your API Secret

/**
 * Sends data to Google Analytics 4.
 * @param {Object} data - The data to send.
 */

function sendToGoogleAnalytics(userId, eventName, email, location) {
  console.log(location);
  const payload = {
    client_id: userId || uuidv4(),
    events: [
      {
        event: eventName,
        email: email,
        location: { lat: location.lat, long: location.long },
      },
    ],
  };

  axios
    .post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      payload
    )
    .then((response) => {
      console.log("Google Analytics response:", response.status);
    })
    .catch((error) => {
      console.error("Error sending data to Google Analytics:", error);
    });
}
module.exports = sendToGoogleAnalytics;
