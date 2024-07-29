const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const businessDetailsSchema = new mongoose.Schema({
  businessName: { type: String },
  businessType: { type: String },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
});

const contactInfoSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
});
const additionalDetailsSchema = new mongoose.Schema({
  businessDescription: { type: String },
  uniquesellingpoint: { type: String },
});

const vendorRegSchema = new mongoose.Schema({
  businessDetails: businessDetailsSchema,
  contactInfo: contactInfoSchema,
  additionalDetails: additionalDetailsSchema,

  id: { type: String, default: uuidv4(), unique: true },
});

const Vendor = mongoose.model("vendor", vendorRegSchema);

module.exports = Vendor;
