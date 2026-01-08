const quizId = new URLSearchParams(window.location.search).get("id");
const tbody = document.getElementById("leaderboardBody");

fetch(`http://localhost:5000/api/result/${quizId}`)
  .then(res => res.json())
  .then(results => {
    tbody.innerHTML = "";

    results.forEach((r, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${r.userId}</td>
        <td>${r.score}</td>
      `;
      tbody.appendChild(row);
    });
  });
