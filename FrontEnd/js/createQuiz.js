function createQuiz() {
  const title = document.getElementById("title").value.trim();
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
      duration: 10,
      published: true
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Quiz created successfully");
      // ✅ Redirect to dashboard (best UX)
      window.location.href = "./dashboard.html";
    })
    .catch(() => {
      alert("Failed to create quiz");
    });
}
