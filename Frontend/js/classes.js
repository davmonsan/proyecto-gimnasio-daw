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
const classesGrid = document.getElementById("classesGrid");

const months = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];


//Cargar clases
function loadClasses() {
  fetch("/api/clases")
    .then(res => res.json())
    .then(classes => {
      classesGrid.innerHTML = "";

      classes.forEach(clase => {
        const card = createClassCard(clase);
        classesGrid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error cargando clases:", err);
    });
}

//Crear tarjetas
function createClassCard(clase) {
  const card = document.createElement("div");
  card.classList.add("class-card");

  const ratio = clase.available_capacity / clase.max_capacity;
  const isLowCapacity = ratio <= 0.3;
  const date = new Date(clase.class_date);
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const hour = clase.class_time.slice(0, 5);

  card.innerHTML = `
  <h3>${clase.name}</h3>
  <p class="trainer">${clase.trainer}</p>

  <div class="class-meta">

    <span class="meta-item meta-date">
      <img src="../imagenes/clock.png" class="meta-icon">
      ${dayName} ${hour} · ${monthName}
    </span>

    <span class="meta-item meta-capacity ${isLowCapacity ? "danger" : ""}">
        <img src="../imagenes/person.png" class="meta-icon">
        ${clase.available_capacity} / ${clase.max_capacity} plazas
    </span>

  </div>
`;

  return card;
}

loadClasses();
