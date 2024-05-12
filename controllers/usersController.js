const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
const nodemailer = require("nodemailer");
const Users = require("./../models/userSchema");

const transporter = nodemailer.createTransport({
  host: "mail.linkedorigins.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@linkedorigins.com",
    pass: "OwenSly77",
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
  try {
    // Define a function to capitalize the first letter of a string
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Create the mail options
    const lastName = capitalizeFirstLetter(personalInfo.lastName);
    const mailOptions = {
      from: "info@linkedorigins.com",
      to: email,
      subject: "Welcome to Linked Origin!",
      text: `Dear ${lastName}, Welcome to Linked Origin, your one-stop platform for information, connections and resources empowering immigrants in Canada! We're thrilled to have you join our growing community.
  Find support:
  Find connections: Meet other immigrants who share your experiences and aspirations. Build friendships and a supportive network through Linked Origin.
  Get personalized help: Our AI assistant, Mon Ami, is here to answer your questions and guide you on your Canadian journey. Mon Ami can help you find resources, offer helpful tips, and suggest relevant discussions within the community forum.
  We offer a wealth of information curated specifically for immigrants in Canada. Explore our comprehensive directory to find information on housing, employment, education, healthcare, and more. Get started today! Welcome to your new Canadian community!
  If you have any questions, please don't hesitate to reach out to our support team at [support email address].
  We look forward to being a part of your journey!
  Warmly,
  The Linked Origin Team`,

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
        <p>The Linked Origin Team</p>
      `,
    };

    // Send the email using transporter
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message:
            "Error sending email! Please check the email or contact administrator!",
        });
      } else {
        // If the email is sent successfully, create the new user in the database
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

        // Return a success response
        return res
          .status(200)
          .json({ message: "Email sent and user saved successfully" });
      }
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    return res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Error saving to the database",
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
  // Use the authenticated user from req.user
  const user = req.user;

  if (user) {
    return res.status(200).json({
      message: "success",
      data: {
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        email: user.personalInfo.email,
        phone: user.personalInfo.phone,
      },
    });
  } else {
    return res.status(404).json({ message: "Profile not found!" });
  }
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { firstName, lastName, email, phone } = req.body;
  const update = await Users.findOneAndUpdate(
    { userId: user.userId },
    {
      "personalInfo.firstName": firstName,
      "personalInfo.lastName": lastName,
      "personalInfo.phone": phone,
    },
    { new: true }
  );
  if (update) {
    return res.status(200).json({ message: "update sucessful" });
  }
  next(new ErrorHandler(400, "error updating user's profile"));
});
