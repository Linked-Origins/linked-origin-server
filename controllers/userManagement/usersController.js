const catchAsync = require("../../utils/catchAsync");
const ErrorHandler = require("../../utils/ErrorHandler");
const nodemailer = require("nodemailer");
const Users = require("../../models/userSchema");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@linkedorigins.ca",
    pass: "T#sdmvw7",
  },
});

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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

  try {
    // Create the mail options
    const lastName = capitalizeFirstLetter(personalInfo.lastName);
    const mailOptions = {
      from: "info@linkedorigins.ca",
      to: email,
      subject: "Welcome to Linked Origins: Your Gateway to Thriving in Canada!",
      text: `Hi ${lastName},
  We're thrilled to welcome you to Linked Origins, your one-stop platform designed to empower 
  newcomers like you to settle in and succeed in Canada! 🇨🇦
  
  AI by Your Side, Community at Your Back
  Linked Origins aims to leverage the power of artificial intelligence (AI) to connect you with the 
  resources and support you need. Our friendly AI guide, Mon-Ami, is here to assist you in your 
  search for information, navigate government services, and find relevant community resources.
  
  Empowering Your Journey
  Whether you're looking for information on immigration, healthcare, housing, education, or legal
  services, Mon-Ami can help you find the right answers and resources. Explore our comprehensive 
  directory as we build our platform to help you connect with locals and other newcomers on a similar path.
  
  Join the Linked Origins Community
  We are working to build a vibrant community of welcoming individuals and organizations ready 
  to support you. Our coming soon features, discussion forums and matching system is being designed to 
  help you network with fellow newcomers, share experiences with locals and build meaningful connections.
  
  Get Started Today!
  Explore our Resource Directory: Search for information on a variety of topics relevant to newcomers in Canada.
  Connect with Mon-Ami: Ask your questions and get personalized assistance on your journey.
  Join the Community Forum: Connect with other newcomers and share experiences. (coming soon feature)
  Subscribe to our Newsletter: Stay updated on the latest resources, events, and stories.
  
  We're confident that Linked Origins will be a valuable resource as you navigate your new life in Canada. Welcome aboard!
  
  The Linked Origins Team
  `,
      html: `
        <p>Hi ${lastName},</p>
  
        <p>We're thrilled to welcome you to Linked Origins, your one-stop platform designed to empower newcomers like you to settle in and succeed in Canada! 🇨🇦</p>
  
        <p><strong>AI by Your Side, Community at Your Back</strong></p>
        <p>Linked Origins aims to leverage the power of artificial intelligence (AI) to connect you with the resources and support you need. Our friendly AI guide, Mon-Ami, is here to assist you in your search for information, navigate government services, and find relevant community resources.</p>
  
        <p><strong>Empowering Your Journey</strong></p>
        <p>Whether you're looking for information on immigration, healthcare, housing, education, or legal services, Mon-Ami can help you find the right answers and resources. Explore our comprehensive directory as we build our platform to help you connect with locals and other newcomers on a similar path.</p>
  
        <p><strong>Join the Linked Origins Community</strong></p>
        <p>We are working to build a vibrant community of welcoming individuals and organizations ready to support you. Our coming soon features, discussion forums and matching system is being designed to help you network with fellow newcomers, share experiences with locals and build meaningful connections.</p>
  
        <p><strong>Get Started Today!</strong></p>
        <ul>
          <li>Explore our Resource Directory: Search for information on a variety of topics relevant to newcomers in Canada.</li>
          <li>Connect with Mon-Ami: Ask your questions and get personalized assistance on your journey.</li>
          <li>Join the Community Forum: Connect with other newcomers and share experiences. (coming soon feature)</li>
          <li>Subscribe to our Newsletter: Stay updated on the latest resources, events, and stories.</li>
        </ul>
  
        <p>We're confident that Linked Origins will be a valuable resource as you navigate your new life in Canada. Welcome aboard!</p>
  
        <p>The Linked Origins Team</p>
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
});

exports.getProfile = catchAsync(async (req, res, next) => {
  // Use the authenticated user from req.user
  const currentUser = req.user;

  if (currentUser) {
    return res.status(200).json({
      message: "success",
      data: {
        firstName: currentUser.personalInfo.firstName,
        lastName: currentUser.personalInfo.lastName,
        email: currentUser.personalInfo.email,
        phone: currentUser.personalInfo.phone,
      },
    });
  } else {
    return res.status(404).json({ message: "Profile not found!" });
  }
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  const imageUrl = req.file.path;

  const {
    phone,
    address,
    countryOfOrigin,
    currentImmigrationStatus,
    dateOfImmigration,
    visaType,
    typeOfStatus,
    highestLevelOfEducation,
    previousWorkExperience,
    currentHousingSituation,
    housingPreference,
    numOfFamilyMembers,
    relationship,
    interestsAndHobbies,
    preferredSocialActivities,
    ethos,
  } = req.body;

  const update = await Users.findOneAndUpdate(
    { userId: user.userId },
    {
      "personalInfo.address": address,
      "personalInfo.phone": phone,
      "immigrationInfo.countryOfOrigin": countryOfOrigin,
      "immigrationInfo.currentImmigrationStatus": currentImmigrationStatus,
      "immigrationInfo.dateOfImmigration": dateOfImmigration,
      "immigrationInfo.visaType": visaType,
      "immigrationInfo.typeOfStatus": typeOfStatus,
      "educationAndEmployment.highestLevelOfEducation": highestLevelOfEducation,
      "educationAndEmployment.previousWorkExperience": previousWorkExperience,
      "housingSituation.currentHousingSituation": currentHousingSituation,
      "housingSituation.housingPreference": housingPreference,
      "familyInfo.numOfFamilyMembers": numOfFamilyMembers,
      "familyInfo.relationship": relationship,
      "socialIntegration.interestsAndHobbies": interestsAndHobbies,
      "socialIntegration.preferredSocialActivities": preferredSocialActivities,
      "socialIntegration.ethos": ethos,
      profilePicture: imageUrl,
    },
    { new: true }
  );
  if (update) {
    return res.status(200).json({ message: "update sucessful" });
  }
  next(new ErrorHandler(400, "error updating user's profile"));
});
