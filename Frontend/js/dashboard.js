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


//Elementos
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();
let selectedClassId = null;

const className = document.getElementById("className");
const classTrainer = document.getElementById("classTrainer");
const classAvailable = document.getElementById("classAvailable");
const classMax = document.getElementById("classMax");
const classDescription = document.getElementById("classDescription");
const reserveBtn = document.getElementById("reserveBtn");

//Meses
const months = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function renderMonth() {
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  monthTitle.textContent = `${month} de ${year}`;
}

renderMonth();

//Cambio de mes
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderMonth();
  loadClasses();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderMonth();
  loadClasses();
});

//Funciones auxiliares
function getDayFromDate(dateString) {
  const date = new Date(dateString);
  let day = date.getDay();

  if (day === 0) return null;
  return day;
}

function formatHour(timeString) {
  return timeString.slice(0, 5);
}

function isSameMonth(classDate) {
  const date = new Date(classDate);
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
}

//Cargar clases
function loadClasses() {

  Promise.all([
    fetch("http://localhost:3000/api/clases").then(res => res.json()),
    loadUserReservations()
  ])
    .then(([classes, userReservations]) => {

      const reservedClassIds = userReservations.map(r => r.class_id);

      document.querySelectorAll(".cell").forEach(cell => {
        cell.innerHTML = "";
      });

      className.textContent = "Selecciona una clase";
      classTrainer.textContent = "—";
      classAvailable.textContent = "—";
      classMax.textContent = "—";
      classDescription.textContent =
        "Haz click en una clase del calendario para ver más información.";
      reserveBtn.disabled = true;
      reserveBtn.textContent = "Reservar plaza";

      selectedClassId = null;

      classes.forEach(clase => {

        if (!isSameMonth(clase.class_date)) return;

        const day = getDayFromDate(clase.class_date);
        const hour = formatHour(clase.class_time);
        if (!day) return;

        const cell = document.querySelector(
          `.cell[data-day="${day}"][data-hour="${hour}"]`
        );
        if (!cell) return;

        const classDiv = document.createElement("div");
        classDiv.classList.add("class-item");
        classDiv.textContent = clase.name;

        //Estados visuales
        if (reservedClassIds.includes(clase.id)) {
          classDiv.classList.add("booked");
        }
        else if (clase.available_capacity <= 0) {
          classDiv.classList.add("full");
        }

        classDiv.addEventListener("click", () => {

          document.querySelectorAll(".class-item").forEach(item => {
            item.classList.remove("selected");
          });

          classDiv.classList.add("selected");
          selectedClassId = clase.id;

          className.textContent = clase.name;
          classTrainer.textContent = clase.trainer;
          classAvailable.textContent = clase.available_capacity;
          classMax.textContent = clase.max_capacity;
          classDescription.textContent = clase.description;

          //Botón reservar
          if (reservedClassIds.includes(clase.id)) {
            reserveBtn.disabled = true;
            reserveBtn.textContent = "Ya estás apuntado";
          }
          else if (clase.available_capacity <= 0) {
            reserveBtn.disabled = true;
            reserveBtn.textContent = "Clase completa";
          }
          else {
            reserveBtn.disabled = false;
            reserveBtn.textContent = "Reservar plaza";
          }
        });

        cell.appendChild(classDiv);
      });
    })
    .catch(err => {
      console.error("Error cargando datos:", err);
    });
}



//Reservar plaza
reserveBtn.addEventListener("click", () => {

  fetch("http://localhost:3000/api/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.id,
      classId: selectedClassId
    })
  })
    .then(res => res.json())
    .then(data => {

      if (data.error) {
        showToast(data.error, "error");

        return;
      }

      showToast("Reserva realizada correctamente", "success");

      loadClasses();
    })
    .catch(err => {
      console.error("Error al reservar:", err);
      showToast("Error al realizar la reserva", "error");

    });
});


//Primera carga
function loadUserReservations() {
  return fetch(`http://localhost:3000/api/reservas/${user.id}`)
    .then(res => res.json());
}

loadClasses();
