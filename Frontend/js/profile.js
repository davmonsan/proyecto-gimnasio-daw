//Comprobar Login
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../pages/login.html";
}

//Rol admin
const adminBtn = document.getElementById("adminBtn");

if (user.role === "admin") {
  adminBtn.style.display = "flex";
}

//Elementos
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileMemberSince = document.getElementById("profileMemberSince");
const profileStatusText = document.getElementById("profileStatusText");
const profileImage = document.getElementById("profileImage");

const avatarOverlay = document.getElementById("avatarOverlay");
const avatarInput = document.getElementById("avatarInput");

//Fecha
function formatMemberSince(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

//Cargar perfil
function loadProfile() {

  profileName.textContent = user.full_name || "—";
  profileEmail.textContent = user.email || "—";
  profilePhone.textContent = user.phone || "—";
  profileStatusText.textContent = "Miembro activo";
  profileMemberSince.textContent = formatMemberSince(user.created_at);

  if (user.profile_image) {
    profileImage.src =
      `${user.profile_image}?t=${Date.now()}`;
  } else {
    profileImage.src = "../imagenes/person.png";
  }
}

//Subir imagen

avatarOverlay.addEventListener("click", () => {
  avatarInput.click();
});

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profileImage.src = reader.result;
  };
  reader.readAsDataURL(file);

  uploadProfileImage(file);
});

function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("userId", user.id);

  fetch(`/api/users/${user.id}/profile-image`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.imageUrl) {

        user.profile_image = data.imageUrl;
        localStorage.setItem("user", JSON.stringify(user));

        profileImage.src =
          `${data.imageUrl}?t=${Date.now()}`;
      }
    })
    .catch(err => {
      console.error("Error subiendo imagen:", err);
    });
}

//Cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();

  window.location.href = "login.html";
});

loadProfile();

