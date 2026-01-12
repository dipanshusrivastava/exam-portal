const express = require("express");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const quizzes = await Quiz.find().select("title _id");
  res.json(quizzes);
});

router.post("/create", auth, async (req, res) => {
  const quiz = await Quiz.create({ ...req.body, creatorId: req.user.id });
  res.json({ quizId: quiz._id });
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id); // ❗ NO .select()
    console.log(
      "QUESTIONS TYPE:",
      Array.isArray(quiz.questions),
      quiz.questions
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check passcode
    const enteredPasscode = req.headers["x-passcode"]; // get from frontend
    if (!enteredPasscode || enteredPasscode !== quiz.passcode) {
      return res.status(403).json({ message: "Incorrect passcode" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: "Invalid quiz id" });
  }
});

router.post("/submit/:id", auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  let score = 0;

  quiz.questions.forEach((q, i) => {
    if (q.correctAnswer === req.body.answers[i]) score++;
  });
  res.json({ score });
});

module.exports = router;
