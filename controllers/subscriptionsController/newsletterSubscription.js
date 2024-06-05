const Subscriber = require("../../models/subscriptionModels/newsletterSubscribersSchema");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.linkedorigins.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@linkedorigins.com",
    pass: "OwenSly77",
  },
});

exports.subscribe = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const newSubscriber = await Subscriber.create({ email, name });

    const mailOptions = {
      from: "info@linkedorigins.com",
      to: email,
      subject: "Unlock Your Canadian Dream: Linked Origins Has You Covered!",
      text: `Hi,

LinkedOrigins - Powered by AI, connected by you!

We're thrilled to have you join our innovative platform designed to help newcomers thrive in Canada. LinkedOrigins aims to leverage the power of artificial intelligence (AI) to connect you with the resources and support you need to feel welcome and empowered.

Be the first to know! As a subscriber, you'll receive exclusive updates and resources straight to your inbox, including:
- The latest information on immigration policies and procedures to help you navigate your journey in Canada.
- Inspiring stories from fellow newcomers who have successfully settled in.
- Upcoming events and workshops designed to connect you with your community and unlock valuable resources.

Look forward to receiving:
- Valuable tips and guides for newcomers
- Spotlights on local businesses catering to immigrants
- Exciting opportunities to connect with others in your community

Get ready to explore, connect, and succeed!

With AI enhancing your needs, you are on your way to calling Canada home.

The LinkedOrigins Team
`,

      html: `
        <p>Hi,</p>
        <p><strong>LinkedOrigins - Powered by AI, connected by you!</strong></p>
        <p>We're thrilled to have you join our innovative platform designed to help newcomers thrive in Canada. LinkedOrigins aims to leverage the power of artificial intelligence (AI) to connect you with the resources and support you need to feel welcome and empowered.</p>
        <p><strong>Be the first to know!</strong> As a subscriber, you'll receive exclusive updates and resources straight to your inbox, including:</p>
        <ul>
          <li>The latest information on immigration policies and procedures to help you navigate your journey in Canada.</li>
          <li>Inspiring stories from fellow newcomers who have successfully settled in.</li>
          <li>Upcoming events and workshops designed to connect you with your community and unlock valuable resources.</li>
        </ul>
        <p><strong>Look forward to receiving:</strong></p>
        <ul>
          <li>Valuable tips and guides for newcomers</li>
          <li>Spotlights on local businesses catering to immigrants</li>
          <li>Exciting opportunities to connect with others in your community</li>
        </ul>
        <p>Get ready to explore, connect, and succeed!</p>
        <p>With AI enhancing your needs, you are on your way to calling Canada home.</p>
        <p>The LinkedOrigins Team</p>
      `,
    };

    // Send the email using transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message:
            "Error sending email! Please check the email or contact the administrator!",
        });
      } else {
        // If the email is sent successfully, return a success response
        return res
          .status(201)
          .json({ message: "Subscribed successfully and email sent" });
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already subscribed" });
    } else {
      console.error("Error subscribing user:", error);
      return res.status(500).json(error.errors);
    }
  }
});

exports.unsubscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const result = await Subscriber.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "email not found" });
    }
    res.status(200).json({ message: "unsubscribed successfully" });
  } catch (error) {
    res.status(500).json(error.errors);
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json({ subscribers: subscribers });
  } catch (error) {
    res.status(500).json(error.errors);
  }
};
