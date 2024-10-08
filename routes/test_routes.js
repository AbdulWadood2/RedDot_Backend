const express = require("express");
const {
  getTestForPerform,
  submitTest,
  getSubmittedTest,
  markQuestionCorrectUnCorrect,
} = require("../controllers/test_controller");
const route = express.Router();

// model
const candidate_model = require("../models/candidate_model");
const employer_model = require("../models/employer_model");

const { verifyToken } = require("../authorization/verifyToken");

/**
 * @swagger
 * /api/v1/test:
 *   get:
 *     summary: Get test details for a job application.
 *     description: Fetches the test associated with a job application for a candidate to perform.
 *     tags:
 *       - Candidate/Test
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobApplyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job application.
 *     responses:
 *       200:
 *         description: Test fetched successfully.
 */
route.get("/", verifyToken([candidate_model]), getTestForPerform);

/**
 * @swagger
 * /api/v1/test:
 *   post:
 *     summary: Submit test answers for a job application.
 *     description: Submits the answers for a test related to a job application.
 *     tags:
 *       - Candidate/Test
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobApplyId:
 *                 type: string
 *                 description: The ID of the job application.
 *                 example: "60d5ec49f5f63b1b0c8d2e3f"
 *               recordedVideo:
 *                 type: string
 *                 description: recordedVideo.
 *                 example: "ok.mp4"
 *               questions:
 *                 type: array
 *                 description: List of questions and answers to submit.
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: integer
 *                       description: The type of question (0 for essay, 1 for multiple-choice, 2 for true/false).
 *                       example: 1
 *                     questionText:
 *                       type: string
 *                       description: The text of the question.
 *                       example: "What is the capital of France?"
 *                     wordLimit:
 *                       type: integer
 *                       description: Word limit for essay questions (only required for type 0).
 *                       example: 100
 *                     options:
 *                       type: array
 *                       description: Options for multiple-choice questions (only required for type 1).
 *                       items:
 *                         type: string
 *                       example: ["Paris", "Berlin", "Rome"]
 *                     correctAnswer:
 *                       type: integer
 *                       description: Index of the correct answer for multiple-choice questions (only required for type 1).
 *                       example: 0
 *                     allowFile:
 *                       type: boolean
 *                       description: Whether file uploads are allowed for essay questions (only required for type 0).
 *                       example: true
 *                     fileAnswer:
 *                       type: string
 *                       description: Indicates fileAnswer.
 *                       example: string
 *                     answer:
 *                       type: string
 *                       description: Indicates answer.
 *                       example: string
 *                     isCorrect:
 *                       type: boolean
 *                       description: is correct answer.
 *                       example: null
 *     responses:
 *       202:
 *         description: Test submitted successfully.
 */
route.post("/", verifyToken([candidate_model]), submitTest);

/**
 * @swagger
 * /api/v1/test/submitted:
 *   get:
 *     summary: Get a submitted test for a job application.
 *     description: Retrieves a submitted test associated with a specific job application and candidate.
 *     tags:
 *       - Employer/Tests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobApplyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job application.
 *         example: "60d5ec49f5f63b1b0c8d2e3f"
 *       - in: query
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the candidate who submitted the test.
 *         example: "60d5ec49f5f63b1b0c8d2e40"
 *     responses:
 *       202:
 *         description: Submitted test fetched successfully.
 */
route.get("/submitted", verifyToken([employer_model]), getSubmittedTest);

/**
 * @swagger
 * /api/v1/test/markQuestionCorrectUnCorrect:
 *   put:
 *     summary: Mark a question as correct or incorrect
 *     description: Update the "isCorrect" field for a specific question within a test result.
 *     tags:
 *       - Employer/Tests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testId:
 *                 type: string
 *                 description: The ID of the test result document.
 *                 example: 66d0bd625e8a5d7b58acfac4
 *               questionId:
 *                 type: string
 *                 description: The ID of the specific question within the test result.
 *                 example: 66d0bd625e8a5d7b58acfac5
 *               isCorrect:
 *                 type: boolean
 *                 description: Whether the question is marked correct (true) or incorrect (false).
 *                 example: true
 *     responses:
 *       202:
 *         description: Question updated successfully
 */
route.put(
  "/markQuestionCorrectUnCorrect",
  verifyToken([employer_model]),
  markQuestionCorrectUnCorrect
);

module.exports = route;
