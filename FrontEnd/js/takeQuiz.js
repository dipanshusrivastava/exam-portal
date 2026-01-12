const params = new URLSearchParams(window.location.search);
const quizId = params.get("id");
const quizPasscode = sessionStorage.getItem("quizPasscode"); // from prompt

const quizTitle = document.getElementById("quizTitle");
const quizForm = document.getElementById("quizForm");

let answers = [];

if (!quizId) {
  alert("Invalid quiz link");
  window.location.href = "./available-quizzes.html";
}

// Fetch quiz
fetch(`http://localhost:5000/api/quiz/${quizId}`, {
  headers: {
    "x-passcode": quizPasscode,
  },
})
  .then((res) => {
    if (!res.ok) {
      throw new Error("Incorrect passcode or quiz not found");
    }
    return res.json(); // ✅ MISSING STEP
  })
  .then((quiz) => {
    console.log("Quiz data:", quiz);

    if (!quiz.questions || quiz.questions.length === 0) {
      quizForm.innerHTML = "<p>No questions found in this quiz.</p>";
      return;
    }

    quizTitle.innerText = quiz.title;
    quizForm.innerHTML = "";

    quiz.questions.forEach((q, i) => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <p><b>${i + 1}. ${q.question}</b></p>
        ${q.options
          .map(
            (opt, j) => `
          <label>
            <input type="radio" name="q${i}" value="${j}">
            ${opt}
          </label><br>
        `
          )
          .join("")}
      `;

      quizForm.appendChild(div);
    });

    quizForm.addEventListener("change", (e) => {
      if (e.target.type === "radio") {
        const index = e.target.name.replace("q", "");
        answers[index] = Number(e.target.value);
      }
    });
  })
  .catch((err) => {
    console.error(err);
    quizForm.innerHTML = "<p>Unable to load quiz.</p>";
  });

function submitQuiz() {
  fetch(`http://localhost:5000/api/quiz/submit/${quizId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ answers }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(`Quiz submitted! Your score: ${data.score}`);

      // Force reliable redirect
      setTimeout(() => {
        window.location.replace(
          "/exam-portal-platform/FrontEnd/pages/leaderboard.html?id=" + quizId
        );
      }, 0);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to submit quiz");
    });
}

