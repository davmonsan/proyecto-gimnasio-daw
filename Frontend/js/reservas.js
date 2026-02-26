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

//Notificacion tipo toast
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


document.addEventListener("DOMContentLoaded", () => {

  console.log("mis reservas cargado");

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("usuario:", user);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const reservasGrid = document.getElementById("reservasGrid");

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  //Cargar reservas
  function loadReservas() {
    fetch(`/api/reservas/${user.id}`)
      .then(res => res.json())
      .then(reservas => {
        reservasGrid.innerHTML = "";

        if (!reservas || reservas.length === 0) {
          reservasGrid.innerHTML = "<p>No tienes reservas activas.</p>";
          return;
        }

        reservas.forEach(reserva => {
          const card = createReservaCard(reserva);
          reservasGrid.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Error cargando reservas:", err);
      });
  }
  //Crear tarjeta reserva
  function createReservaCard(reserva) {
    const card = document.createElement("div");
    card.classList.add("class-card");

    const date = new Date(reserva.class_date);
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const hour = reserva.class_time.slice(0, 5);

    card.innerHTML = `
      <h3>${reserva.name}</h3>
      <p class="trainer">${reserva.trainer}</p>

      <div class="class-meta">
        <span class="meta-item meta-date">
          <img src="../imagenes/calendar.png" class="meta-icon">
          ${dayName} ${hour} · ${monthName}
        </span>

        <span class="meta-item meta-capacity">
          <img src="../imagenes/person.png" class="meta-icon">
          ${reserva.available_capacity} / ${reserva.max_capacity} plazas
        </span>
      </div>

      <button type="button" class="cancel-btn">Cancelar reserva</button>

    `;

    card.querySelector(".cancel-btn").addEventListener("click", () => {
      cancelReserva(reserva.reservation_id);
    });

    return card;
  }
  //Cancelar reserva
  function cancelReserva(reservationId) {
  fetch(`/api/reservas/${reservationId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {

      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      showToast("Reserva cancelada correctamente", "success");

      loadReservas(); // recargar tarjetas
    })
    .catch(err => {
      console.error("Error cancelando reserva:", err);
      showToast("Error al cancelar la reserva", "error");
    });
}


  loadReservas();
});
