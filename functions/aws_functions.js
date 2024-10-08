const {
  S3Client,
  GetObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Load environment variables from .env file
require("dotenv").config();

// Initialize and export S3 client with provided credentials
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// models
const employer_model = require("../models/employer_model.js");
const job_model = require("../models/job_model.js");
const helpguideemployer_model = require("../models/help&guideEmployer_model.js");
const jobApply_model = require("../models/jobApply_model.js");
const contract_model = require("../models/contract_model.js");

// functions
const checkDuplicateAwsImgsInRecords = async (fileNames, fieldName) => {
  try {
    const promises = fileNames.map(async (fileName) => {
      const [employerAvatar, job, helpguideemployer, jobApply, contract] =
        await Promise.all([
          employer_model.findOne({ avatar: fileName }),
          job_model.findOne({
            $or: [
              { "specification.video": fileName },
              { "specification.docs": fileName },
              { "training.video": fileName },
              { "training.docs": fileName },
              { "contract.video": fileName },
            ],
          }),
          helpguideemployer_model.findOne({
            video: fileName,
          }),
          jobApply_model.findOne({
            $or: [{ aboutVideo: fileName }, { cv: fileName }],
          }),
          contract_model.findOne({
            $or: [
              { governmentIdFront: fileName },
              { governmentIdBack: fileName },
              { proofOfAddress: fileName },
              { signature: fileName },
            ],
          }),
        ]);
      if (employerAvatar || job || helpguideemployer || jobApply || contract) {
        return fileName;
      }
    });

    const results = await Promise.all(promises);

    const duplicates = results.filter((fileName) => fileName);
    if (duplicates.length > 0) {
      return {
        message: `These ${fieldName} are already used: ${duplicates.join(
          ", "
        )}`,
        success: false,
      };
    }

    // If none of the promises find a match, return some success message or proceed with other logic.
    return {
      message: `${fieldName} is unique and can be used.`,
      success: true,
    };
  } catch (error) {
    return {
      message: `An error occurred while checking ${fieldName}`,
      success: false,
    };
  }
};

/**
 * Check if an image exists in the specified S3 bucket.
 * @param {string} imageName - The name of the image file to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the image exists, otherwise false.
 */
async function checkImageExists(imageNames) {
  try {
    const promises = imageNames.map(async (imageName) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Replace with your S3 bucket name
        Key: imageName,
      };

      // Check if the object exists
      await s3.send(new HeadObjectCommand(params));

      // If the object exists, return true
      return true;
    });

    // Wait for all promises to resolve
    return await Promise.all(promises);
  } catch (error) {
    // If the object does not exist or there is an error, return false for each image
    if (error.name === "NotFound") {
      return imageNames.map(() => false);
    } else {
      throw error; // Propagate other errors
    }
  }
}

/**
 * Generate a pre-signed URL for accessing an object in the specified S3 bucket.
 * @param {string} objectKey - The key of the object in the S3 bucket.
 * @returns {Promise<string>} - A promise that resolves to the pre-signed URL.
 */
async function generateSignedUrl(objectKeys) {
  try {
    if (objectKeys.length === 0) return [];
    const signedUrls = await Promise.all(
      objectKeys.map(async (objectKey) => {
        if (!objectKey) return null;
        // const params = {
        //   Bucket: process.env.AWS_BUCKET_NAME, // Replace with your S3 bucket name
        //   Key: objectKey,
        // };

        // // Generate pre-signed URL
        // const command = new GetObjectCommand(params);
        // return await getSignedUrl(s3, command);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
      })
    );
    return signedUrls;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete multiple objects from the specified S3 bucket based on an array of keys.
 * @param {string[]} objectKeys - Array of object keys to delete from the S3 bucket.
 * @returns {Promise<void>} - A promise that resolves when all objects are deleted successfully.
 */
async function deleteObjects(objectKeys) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Replace with your S3 bucket name
      Delete: {
        Objects: objectKeys.map((Key) => ({ Key })),
        Quiet: false,
      },
    };

    // Delete objects from S3 bucket
    await s3.send(new DeleteObjectsCommand(params));

    // Log success
    console.log("Deletion successful!");
  } catch (error) {
    throw error;
  }
}

function getFileName(url) {
  let fileName = [];
  url.map((url) => {
    // Split the URL by '/'
    const parts = url.split("/");
    // Get the last part of the URL which contains the file name
    fileName.push(parts[parts.length - 1]);
  });
  return fileName;
}

module.exports = {
  s3,
  checkImageExists,
  generateSignedUrl,
  deleteObjects,
  getFileName,
  checkDuplicateAwsImgsInRecords,
};
