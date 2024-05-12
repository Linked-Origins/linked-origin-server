const axios = require("axios");

// Function to fetch job listings from the Job Bank API
exports.fetchJobListings = async function () {
  try {
    // Specify API endpoint and parameters (e.g., location, keywords)
    const apiUrl = "https://api.jobbank.gc.ca/v1/jobs/search";
    const params = {
      location: "Toronto", // Example: Fetch job listings in Toronto
      postedSince: "7", // Example: Fetch job listings posted within the last 7 days
      perPage: "10", // Example: Limit to 10 job listings per page
    };

    // Make GET request to Job Bank API
    const response = await axios.get(apiUrl, { params });

    // Extract job listings from response
    const jobListings = response.data.jobs;
    console.log(jobListings);
  } catch (error) {
    console.error("Error fetching job listings:", error.message);
    return [];
  }
};

// Function to display job listings
//function displayJobListings(jobListings) {
//  jobListings.forEach((job) => {
//    console.log(`Title: ${job.job_title}`);
//    console.log(`Company: ${job.employer_name}`);
//    console.log(`Location: ${job.locations[0].city}`);
//    console.log(`Posted: ${job.posted_date}`);
//    console.log('---');
//  });
//}
//
//// Main function to fetch and display job listings
//async function main() {
//  try {
//    // Fetch job listings
//    const jobListings = await fetchJobListings();
//
//    // Display job listings
//    console.log('Job Listings:');
//    displayJobListings(jobListings);
//  } catch (error) {
//    console.error('Error:', error.message);
//  }
//}

// Run main function
