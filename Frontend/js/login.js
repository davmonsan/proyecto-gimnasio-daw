//Notificacion tipo toast
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
//Loguearse
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = "/pages/dashboard.html";
    })
    .catch(err => {
      console.error(err);
      showToast("Error de conexión con el servidor", "error");
    });
});
