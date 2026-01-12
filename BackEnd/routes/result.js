// const express = require("express");
// const Result = require("../models/Result");

// const router = express.Router();

// router.get("/:quizId", async(req, res) => {
//     const results = (await Result.find({quizId: req.params.quizId})).toSorted({score: -1});
//     res.json(results);
// });

// module.exports = router;