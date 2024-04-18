const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
const nodemailer = require("nodemailer");
const Users = require("./../models/userSchema");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pokoh.ufuoma@gmail.com",
    pass: "hmfjfypstbfgaapt",
  },
});

//register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    phone,

    countryOfOrigin,
    currentImmigrationStatus,
    dateOfImmigration,
    visaType,
    typeOfStatus,

    nativeLanguage,

    highestLevelOfEducation,
    previousWorkExperience,
    aspirations,

    currentHousingSituation,
    housingPreference,

    numOfFamilyMembers,
    relationship,

    interestsAndHobbies,
    preferredSocialActivities,
    ethos,

    challenges,
    supportServices,
  } = req.body;

  const personalInfo = {
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    phone,
  };

  const immigrationInfo = {
    countryOfOrigin,
    currentImmigrationStatus,
    dateOfImmigration,
    visaType,
    typeOfStatus,
  };
  const languageProficiency = { nativeLanguage };

  const educationAndEmployment = {
    highestLevelOfEducation,
    previousWorkExperience,
    aspirations,
  };
  const housingSituation = { currentHousingSituation, housingPreference };

  const familyInfo = { numOfFamilyMembers, relationship };

  const socialIntegration = {
    interestsAndHobbies,
    preferredSocialActivities,
    ethos,
  };

  const supportNeeds = { challenges, supportServices };

  //add the new user.
  const newUser = await Users.create({
    personalInfo,
    immigrationInfo,
    languageProficiency,
    educationAndEmployment,
    housingSituation,
    familyInfo,
    socialIntegration,
    supportNeeds,
  });
  try {
    if (newUser) {
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      const lastName = capitalizeFirstLetter(newUser.personalInfo.lastName);

      const mailOptions = {
        from: "pokoh.ufuoma@gmail.com",
        to: email,
        subject: "Welcome to Linked Origin!",
        text: `Dear ${lastName}, Welcome to Linked Origin, your one-stop platform for information, connections and resources empowering immigrants in Canada!
We're thrilled to have you join our growing community.
Find support:
Find connections: Meet other immigrants who share your experiences and aspirations. Build friendships and a supportive network through Linked Origin.
Get personalized help: Our AI assistant, Mon Ami, is here to answer your questions and guide you on your Canadian journey. Mon Ami can help you find resources, offer helpful tips, and suggest relevant discussions within the community forum.
We offer a wealth of information curated specifically for immigrants in Canada. Explore our comprehensive directory to find information on housing, employment, education, healthcare, and more.
Get started today! Welcome to your new Canadian community!
If you have any questions, please don't hesitate to reach out to our support team at [support email address].
We look forward to being a part of your journey!
Warmly,
The Linked Origin Team`,

        html: `
      <p>Dear ${lastName},</p>
      <p>Welcome to Linked Origin, your one-stop platform for information, connections and resources empowering immigrants in Canada!
      We're thrilled to have you join our growing community.</p>
      <p>Find support:</p>
      <ul>
        <li>Find connections: Meet other immigrants who share your experiences and aspirations. Build friendships and a supportive network through Linked Origin.</li>
        <li>Get personalized help: Our AI assistant, Mon Ami, is here to answer your questions and guide you on your Canadian journey. Mon Ami can help you find resources, offer helpful tips, and suggest relevant discussions within the community forum.</li>
      </ul>
      <p>We offer a wealth of information curated specifically for immigrants in Canada. Explore our comprehensive directory to find information on housing, employment, education, healthcare, and more.
      Get started today! Welcome to your new Canadian community!</p>
      <p>If you have any questions, please don't hesitate to reach out to our support team at [support email address].
      We look forward to being a part of your journey!</p>
      <p>Warmly,</p>
      <p>The Linked Origin Team</p>

      `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({
            message:
              "Error sending email! or email already exists! Check email!",
          });
        } else {
          return res.status(200).json({ message: "Email sent successfully" });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Error processing images or saving to the database",
    });
  }

  //return res
  //  .status(200)
  //  .json({ message: "user created successfully", data: newUser });
  //next();
  //else {
  //res.send("error creating");
  //next();
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  if (userId) {
    const profile = await Users.findOne({ userId: userId });

    if (profile) {
      return res.status(200).json({ message: "success", data: profile });
    } else {
      return res
        .status(404)
        .json({ message: "Profile not found for that user!" });
    }
  } else {
    return res.status(404).json({ message: "Please, provide a user id!" });
  }
});
