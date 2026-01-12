const {Schema, model} = require("mongoose");
const { start } = require("node:repl");

const quizSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId, // The correct way to define the type in a schema
    ref: "User", // Optional: 'ref' specifies which model this ID references, allowing population
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
  startTime: Date,
  duration: Number,
  passcode: { type: String, required: true }, 
  published: Boolean,
});

module.exports = model("Quiz", quizSchema);
