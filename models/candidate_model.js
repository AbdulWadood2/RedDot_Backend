const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: null },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
      type: String,
      default: null,
    },
    encryptOTP: {
      type: String,
      default: null,
    },
    countryOfRecidence: {
      type: String,
      default: null,
    },
    countryOfBirth: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: String,
      default: null,
    },
    whatsapp: {
      type: String,
      default: null,
    },
    telegram: {
      type: String,
      default: null,
    },
    skype: {
      type: String,
      default: null,
    },
    other: {
      type: String,
      default: null,
    },
    aboutVideo: {
      type: String,
      default: null,
    },
    cv: {
      type: String,
      default: null,
    },
    coverLetter: {
      type: String,
      default: null,
    },
    refreshToken: [
      {
        type: String,
      },
    ],
    isverified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    encryptOTP: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const candidate = mongoose.model("candidate", candidateSchema);
module.exports = candidate;
