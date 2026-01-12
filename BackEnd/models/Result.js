const { Schema, model } = require("mongoose");

const resultSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },       // Student name
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = model("Result", resultSchema);
