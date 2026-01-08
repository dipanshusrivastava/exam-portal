const API = "http://localhost:5000/api";

function signup() {
  fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    }),
  });
}

function login() {
  if (!email.value || !password.value) {
    alert("Please enter email and password");
    return;
  }

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.token) {
        alert("Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      window.location.href = "./dashboard.html";
    });
}
