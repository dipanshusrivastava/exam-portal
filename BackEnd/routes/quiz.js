const express = require("express");
const { Quiz, Question, Option, Result } = require("../models");

const router = express.Router();

/*
-----------------------------------
GET all quizzes (titles only)
-----------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      attributes: ["id", "title", "startTime"],
    });

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

/*
-----------------------------------
CREATE QUIZ
-----------------------------------
Expected body:
{
  title: "Math Quiz",
  passcode: "1234",
  questions: [
    {
      question: "2 + 2 = ?",
      options: ["1","2","3","4"],
      correctAnswer: 3
    }
  ]
}
-----------------------------------
*/
router.post("/create", async (req, res) => {
  try {
    const { title, passcode, questions, duration, startTime } = req.body;

    console.log("REQ BODY:", req.body);

    if (!title || !passcode || !questions?.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // 1. Create quiz
    const quiz = await Quiz.create({
      title,
      passcode,
      duration: Number(duration) || 10,
      startTime: startTime || null,
    });

    // 2. Create questions + options
    for (const q of questions) {
      const question = await Question.create({
        text: q.question,
        QuizId: quiz.id,
      });

      for (let i = 0; i < q.options.length; i++) {
        await Option.create({
          text: q.options[i],
          isCorrect: i === q.correctAnswer,
          QuestionId: question.id,
        });
      }
    }

    res.json({ message: "Quiz created successfully", quizId: quiz.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create quiz" });
  }
});

// GET LEADERBOARD FOR A QUIZ
router.get("/leaderboard/:id", async (req, res) => {
  try {
    const quizId = req.params.id;

    const results = await Result.findAll({
      where: { QuizId: quizId },
      order: [["score", "DESC"]],
    });

    // Add rank manually
    const leaderboard = results.map((r, index) => ({
      rank: index + 1,
      name: r.name || "Anonymous",
      score: r.score,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
});

/*
-----------------------------------
GET QUIZ BY ID (with passcode)
-----------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: {
        model: Question,
        include: Option,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    // startTime
    if (quiz.startTime) {
      const now = new Date();
      const start = new Date(quiz.startTime);

      if (now < start) {
        return res.status(403).json({
          message: "Quiz has not started yet",
          startsIn: start - now,
        });
      }
    }

    // Passcode check
    const enteredPasscode = req.headers["x-passcode"];
    if (enteredPasscode !== quiz.passcode) {
      return res.status(403).json({ message: "Incorrect passcode" });
    }

    // Convert SQL format → frontend format
    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      duration: quiz.duration, // 👈 THIS LINE FIXES THE TIMER
      questions: quiz.Questions.map((q) => ({
        question: q.text,
        options: q.Options.map((o) => o.text),
        correctAnswer: q.Options.findIndex((o) => o.isCorrect),
      })),
    };

    res.json(formattedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

/*
-----------------------------------
SUBMIT QUIZ
-----------------------------------
*/
router.post("/submit/:id", async (req, res) => {
  console.log("Submit route hit"); // 👈 add this temporarily
  try {
    const quizId = req.params.id;
    const { answers } = req.body;

    const quiz = await Quiz.findByPk(quizId, {
      include: {
        model: Question,
        include: Option,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    quiz.Questions.forEach((question, index) => {
      const correctIndex = question.Options.findIndex((opt) => opt.isCorrect);
      if (answers[index] === correctIndex) {
        score++;
      }
    });

    // Save result (optional but good)
    await Result.create({
      score,
      QuizId: quiz.id,
    });

    res.json({ score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
});

module.exports = router;
