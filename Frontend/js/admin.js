//Comprobar Login
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
  window.location.href = "../pages/login.html";
}
//Rol admin
const adminBtn = document.getElementById("adminBtn");

if (user.role === "admin") {
  adminBtn.style.display = "flex";
}

//Elementos
const tableBody = document.getElementById("classesTableBody");
const modal = document.getElementById("classModal");
const modalTitle = document.getElementById("modalTitle");
const classForm = document.getElementById("classForm");

const addClassBtn = document.getElementById("addClassBtn");
const cancelModal = document.getElementById("cancelModal");

const className = document.getElementById("className");
const classTrainer = document.getElementById("classTrainer");
const classDay = document.getElementById("classDay");
const classMonth = document.getElementById("classMonth");
const classHour = document.getElementById("classHour");
const classCapacity = document.getElementById("classCapacity");
const classDescription = document.getElementById("classDescription");

let editingClassId = null;

//Dias/meses
const days = [
  "Lunes", "Martes", "Miércoles",
  "Jueves", "Viernes", "Sábado"
];

const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

//Rellenar selects
days.forEach((d, i) => {
  const opt = document.createElement("option");
  opt.value = i + 1;
  opt.textContent = d;
  classDay.appendChild(opt);
});

months.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  classMonth.appendChild(opt);
});

//Cargar clases
function loadClasses() {
  fetch("/api/clases")
    .then(res => res.json())
    .then(classes => {
      tableBody.innerHTML = "";

      classes.forEach(c => {

        const date = new Date(c.class_date);

const allDays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

const dayName = allDays[date.getDay()];
const monthName = months[date.getMonth()];


        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.name}</td>
          <td>${c.trainer}</td>
          <td>${dayName}</td>
          <td>${monthName}</td>
          <td>${c.class_time.slice(0,5)}</td>
          <td>${c.available_capacity}/${c.max_capacity}</td>
          <td class="actions">
            <button onclick="editClass(${c.id})">✏️</button>
            <button onclick="deleteClass(${c.id})">🗑</button>
          </td>
        `;

        tableBody.appendChild(tr);
      });
    });
}

//Nueva clase
addClassBtn.onclick = () => {
  editingClassId = null;
  modalTitle.textContent = "Nueva Clase";
  classForm.reset();
  modal.classList.remove("hidden");
};

cancelModal.onclick = () => modal.classList.add("hidden");

//Editar clase
window.editClass = (id) => {
  fetch(`/api/clases/${id}`)
    .then(res => res.json())
    .then(c => {

      const [year, month, day] = c.class_date.split("-").map(Number);
      const safeDate = new Date(year, month - 1, day, 12);

      const jsDay = safeDate.getDay();

      editingClassId = id;
      modalTitle.textContent = "Editar Clase";

      className.value = c.name;
      classTrainer.value = c.trainer;

      if (jsDay >= 1 && jsDay <= 6) {
        classDay.value = jsDay;
      }

      classMonth.value = month - 1;
      classHour.value = c.class_time.slice(0,5);
      classCapacity.value = c.max_capacity;
      classDescription.value = c.description;

      modal.classList.remove("hidden");
    });
};

//Guardar clase
classForm.onsubmit = (e) => {
  e.preventDefault();

  const selectedDay = parseInt(classDay.value);
  const selectedMonth = parseInt(classMonth.value);

  if (isNaN(selectedDay) || isNaN(selectedMonth)) {
    alert("Selecciona día y mes");
    return;
  }

  const now = new Date();
  let year = now.getFullYear();

  if (selectedMonth < now.getMonth()) {
    year += 1;
  }

  let date = new Date(year, selectedMonth, 1, 12);
  let safety = 0;

  while (date.getDay() !== selectedDay && safety < 7) {
    date.setDate(date.getDate() + 1);
    safety++;
  }

  if (safety === 7) {
    alert("Error calculando la fecha");
    return;
  }

  const data = {
    name: className.value,
    trainer: classTrainer.value,
    class_date: date.toISOString().split("T")[0],
    class_time: classHour.value,
    max_capacity: classCapacity.value,
    description: classDescription.value
  };

  const method = editingClassId ? "PUT" : "POST";
  const url = editingClassId
    ? `/api/clases/${editingClassId}`
    : `/api/clases`;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      modal.classList.add("hidden");
      loadClasses();
    })
    .catch(() => {
      alert("Error guardando la clase");
    });
};


//Eliminar clase
function deleteClass(classId) {

  if (!confirm("Esta acción eliminará la clase y todas sus reservas.\n\n¿Deseas continuar?")) {
    return;
  }

  fetch(`/api/clases/${classId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => {
      alert("Clase eliminada correctamente");
      loadClasses();
    })
    .catch(() => {
      alert("Error del servidor");
    });
}

loadClasses();
