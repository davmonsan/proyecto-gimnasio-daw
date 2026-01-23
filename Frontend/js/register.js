//Notificacion tipo toast
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
//Registrarse
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const full_name = document.getElementById("full_name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const termsAccepted = document.getElementById("terms").checked;

  fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      full_name,
      email,
      phone,
      password,
      confirmPassword,
      termsAccepted
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      showToast("Cuenta creada correctamente", "success");

      setTimeout(() => {
        window.location.href = "../pages/login.html";
      }, 2000);
    })
    .catch(err => {
      console.error(err);
      showToast("Error de conexión con el servidor", "error");
    });
});


