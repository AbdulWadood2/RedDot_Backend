const { required } = require("joi");
const mongoose = require("mongoose");

const jobApplySchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, required: true },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
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
    availabilityDate: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

const job = mongoose.model("jobapply", jobApplySchema);
module.exports = job;
