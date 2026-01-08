function createQuiz() {
  const title = document.getElementById("title").value;
  const questionsText = document.getElementById("questions").value;
  const token = localStorage.getItem("token");

  if (!title || !questionsText) {
    alert("Please fill all fields");
    return;
  }

  let questions;
  try {
    questions = JSON.parse(questionsText);
  } catch {
    alert("Invalid JSON format for questions");
    return;
  }

  fetch("http://localhost:5000/api/quiz/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title,
      questions,
      duration: 1
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Quiz created successfully");
    window.location.href = `quiz.html?id=${data.quizId}`;
  });
}
