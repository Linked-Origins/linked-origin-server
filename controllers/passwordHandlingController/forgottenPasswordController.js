const nodemailer = require("nodemailer");
const Users = require("./../../models/userSchema");
const crypto = require("crypto");
const base64url = require("base64url");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  const user = await Users.findOne({ "personalInfo.email": email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const passwordResetToken = user.createPasswordResetToken();

  await user.save();

  const encodedToken = base64url.encode(passwordResetToken);

  const resetUrl = `https://linked-origin-server.vercel.app/api/v1/password-handling/handle-forgotten-password/${encodedToken}`;

  try {
    const name = capitalizeFirstLetter(user.personalInfo.lastName);
    const mailOptions = {
      from: "info@linkedorigins.com",
      to: email,
      subject: "Password Reset Request",
      text: `Hi ${name},
You are receiving this email because you (or someone else) have requested a password reset. 
Please click on the following link, or paste it into your browser to complete the process: 
\n\n${resetUrl}\n\nIf you did not request this, 
please ignore this email and your password will remain unchanged.

The Linked Origins Team`,

      html: `
      <p>Hi ${name},</p>
      <p>You are receiving this email because you (or someone else) have requested a password reset. 
      Please click on the following link to complete the process:</p>
      <p><a href="${resetUrl}">reset password</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>The Linked Origins Team.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message:
            "Error sending email! Please check the email or contact administrator!",
        });
      } else {
        res
          .status(200)
          .json({ message: "Password reset email sent, check your email." });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Error saving to the database",
    });
  }
};

exports.handleForgotPassword = async (req, res) => {
  const token = req.params.token;
  const decodedToken = base64url.decode(token);

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(decodedToken)
      .digest("hex");
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }
    const email = user.personalInfo.email;
    res
      .status(200)
      .json({ message: "token valid", email: email })
      .redirect("https://linkedorigins.ca/auth/change-password");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  function validatePassword(value) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(value);
  }
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Email and password are required" });
    }
    if (!validatePassword(password)) {
      return res.status(401).json({
        message:
          "Password must meet the specified requirements: Must contain at least one uppercase letter, lowercase letter, one number between 0-9 and must be at least 8 characters long",
      });

      const changedPassword = await Users.findOneAndUpdate(
        { "personalInfo.email": email },
        { "personalInfo.Password": password },
        { new: true }
      );
      if (!changedPassword) {
        return res
          .status(400)
          .json({ message: "Couldn't update password or email not found" });
      }
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
