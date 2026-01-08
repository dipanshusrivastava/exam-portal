const {Schema, model} = require("mongoose");

const resultSchema = Schema({
  quizId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  score: Number,
  submittedAt: Date,
});

module.exports = model("Result", resultSchema);