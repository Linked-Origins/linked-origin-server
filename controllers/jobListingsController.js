const axios = require("axios");
const job_id = process.env.JOBS_ID;
const job_api = process.env.JOB_API_KEY;
const catchAsync = require("./../utils/catchAsync");

exports.fetchJobListings = catchAsync(async function (req, res, next) {
  const searchParams = req.body;
  let page = 1;
  if (searchParams && searchParams.page) {
    page = searchParams.page;

    delete searchParams.page;
  }

  const paramsArray = [];
  for (const key in searchParams) {
    if (searchParams.hasOwnProperty(key)) {
      paramsArray.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`
      );
    }
  }
  const url = `https://api.adzuna.com/v1/api/jobs/ca/search/${page}?app_id=${job_id}&app_key=${job_api}`;

  const hasParams = url.includes("?");

  let newUrl = url;
  if (hasParams) {
    newUrl += "&" + paramsArray.join("&");
  } else {
    newUrl += "?" + paramsArray.join("&");
  }
  console.log(newUrl);

  let response = await axios(newUrl);

  response = JSON.stringify(response.data);

  response = JSON.parse(response);
  const parsedResponse = response.results;
  const jobs = parsedResponse.map((job) => ({
    title: job.title || "",
    description: job.description || "",
    company: job.company ? job.company.display_name : "",
    location: job.location ? job.location.display_name : "",
    redirectUrl: job.redirect_url || "",
    created: job.created || "",
  }));
  return res.status(200).json({ count: jobs.length, jobs: jobs });
});
