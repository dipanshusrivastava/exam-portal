const express = require("express");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const quiz = await Quiz.create({ ...req.body, creatorId: req.user.id });
  res.json({ quizId: quiz._id });
});

router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
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
