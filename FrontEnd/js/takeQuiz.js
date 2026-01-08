const id = new URLSearchParams(location.search).get("id");
let answers = [];

fetch(`http://localhost:5000/api/quiz/${id}`)
.then(res => res.json())
.then(quiz => {
  quiz.questions.forEach((q, i) => {
    document.body.innerHTML += `<p>${q.question}</p>`;
    q.options.forEach((o, j) => {
      document.body.innerHTML +=
        `<input type="radio" name="${i}" onclick="answers[${i}]=${j}">${o}`;
    });
  });
});

function submit() {
  fetch(`http://localhost:5000/api/quiz/submit/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({ answers })
  });
}
