const mongoose = require("mongoose");
const validator = require("validator");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  name: { type: String, required: [true, "Name is required"] },
});

subscriberSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase().trim();
  next();
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
