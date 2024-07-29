const Contact = require("./../models/contactSchema");
const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
exports.newContact = catchAsync(async (req, res, next) => {
  const { name, email, tellUs } = req.body;
  const newMessage = await Contact.create({
    name: name,
    email: email,
    tellUs: tellUs,
  });
  if (newMessage) {
    return res.status(200).json({ message: "message received" });
  } else throw new ErrorHandler("Couldn't save message! Contact admin", 500);
});
