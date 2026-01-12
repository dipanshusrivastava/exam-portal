const quizList = document.getElementById("quizList");

if (!quizList) {
  console.error("quizList element not found");
}

// Fetch all quizzes
fetch("http://localhost:5000/api/quiz")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch quizzes");
    }
    return res.json();
  })
  .then(quizzes => {
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      quizList.innerHTML = "<p>No quizzes available.</p>";
      return;
    }

    quizzes.forEach(quiz => {
      // Safety check
      if (!quiz.id || !quiz.title) return;

      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("h3");
      title.innerText = quiz.title;

      const btn = document.createElement("button");
      btn.innerText = "Start Test";
      btn.addEventListener("click", () => {
        startQuiz(quiz.id);
      });

      card.appendChild(title);
      card.appendChild(btn);
      quizList.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    quizList.innerHTML = "<p>Error loading quizzes.</p>";
  });

// Redirect to take quiz page
function startQuiz(id) {
 const inputPasscode = prompt("Enter the passcode for this quiz:");
  if (!inputPasscode) return;

  // Store entered passcode in sessionStorage temporarily
  sessionStorage.setItem("quizPasscode", inputPasscode);

  window.location.href = `./take-quiz.html?id=${id}`;
}
