/* Variables */
// Elementos necesarios del DOM
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskListItems = document.querySelector("#taskListItems");
const taskCount = document.querySelector("#taskCount");
const showAllButton = document.querySelector("#showAllButton");
const showActiveButton = document.querySelector("#showActiveButton");
const showCompletedButton = document.querySelector("#showCompletedButton");
const deleteCompletedButton = document.querySelector("#deleteCompletedButton");
// Lista de tareas
const tasks = [
  { id: 1, name: "Revisar la agenda", completed: true },
  { id: 2, name: "Preparar los materiales necesarios para el trabajo", completed: true },
  { id: 3, name: "Asistir a la reunión de estudios", completed: false },
  { id: 4, name: "Realizar compras necesarias para la cena", completed: false },
  { id: 5, name: "Realizar pagos de servicios", completed: false },
];
// Contador de id de tareas
let idCounter = tasks.length;
// Filtro de lista de tareas
let taskFilter = "all";

/* Funciones */
// Mostrar lista de tareas
function showTaskList() {
  taskListItems.innerHTML = ""; // Vaciando lista de tareas en el DOM
  // Filtrando tareas activas y completadas
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  // Mostrando tareas en el DOM
  switch (taskFilter) {
    case "all":
      showTasks(activeTasks, "ellipse-outline", true);
      showTasks(completedTasks, "checkmark-circle-outline", false);
      taskCount.textContent = tasks.length + " tareas"; // Mostrando cantidad de tareas
      break;
    case "active":
      showTasks(activeTasks, "ellipse-outline", true);
      taskCount.textContent = activeTasks.length + " tareas"; // Mostrando cantidad de tareas activas
      break;
    case "completed":
      showTasks(completedTasks, "checkmark-circle-outline", false);
      taskCount.textContent = completedTasks.length + " tareas"; // Mostrando cantidad de tareas completadas
      break;
  }
}

// Mostrar tareas
function showTasks(tasksList, nameIcon, isTaskActive) {
  for (let i = 0; i < tasksList.length; i++) {
    // Creando item de tarea
    const taskItem = `
      <li class="task-item${isTaskActive ? "" : " done"}">
        <div class="task-item__id">${tasksList[i].id}</div>
          <button class="task-item__button${
            isTaskActive ? "" : " done"
          }" aria-label="Completar o descompletar tarea">
            <ion-icon
              class="task-item__icon"
              name="${nameIcon}"
            ></ion-icon>
          </button>
        ${tasksList[i].name}
      </li>
    `;
    // Insertando item de tarea en la lista de tareas
    taskListItems.insertAdjacentHTML("beforeend", taskItem);
  }
}

/* Eventos */
// Cargar lista de tareas al cargar la página
document.addEventListener("DOMContentLoaded", showTaskList);

// Limitando el número de caracteres en el input
taskInput.addEventListener("input", function (event) {
  if (event.target.value.length > 255) {
    event.target.value = event.target.value.slice(0, 255);
  }
});

// Agregar una nueva tarea
taskForm.addEventListener("submit", function (event) {
  // Evitar que el formulario se envíe
  event.preventDefault();
  // Validar que la tarea no esté vacía y no se repita
  const isRepeatedTask = tasks.some((task) => task.name === taskInput.value);
  if (taskInput.value.trim() !== "" && !isRepeatedTask) {
    // Quitar error si la tarea no está vacía y no se repite
    taskForm.classList.remove("invalid");
    idCounter++; // Incrementar el contador de id
    // Crear nueva tarea
    const newTask = {
      id: idCounter,
      name: taskInput.value,
      completed: false,
    };
    tasks.push(newTask); // Agregar nueva tarea a la lista de tareas
    taskInput.value = ""; // Limpiar input
    showTaskList(); // Mostrar lista de tareas actualizada
  } else {
    // Activar error si la tarea está vacía o se repite
    taskForm.classList.add("invalid");
  }
});

// Marcar una tarea como completada o activa
taskListItems.addEventListener("click", function (event) {
  // Validar si se hizo clic en el botón de la tarea
  if (event.target.matches(".task-item__button")) {
    // Obtener el id de la tarea, la tarea y el índice de la tarea
    const previousSibling = event.target.previousElementSibling;
    const taskId = Number(previousSibling.textContent);
    const task = tasks.find((task) => task.id === taskId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    // Validar si la tarea está completada o activa
    if (!task.completed) {
      // Marcar la tarea como completada
      tasks[taskIndex].completed = true;
      showTaskList();
    } else {
      // Marcar la tarea como activa o descompletada
      tasks[taskIndex].completed = false;
      showTaskList();
    }
  }
});

// Filtro mostrar todas las tareas
showAllButton.addEventListener("click", function () {
  taskFilter = "all";
  showTaskList();
});

// Filtro mostrar tareas activas
showActiveButton.addEventListener("click", function () {
  taskFilter = "active";
  showTaskList();
});

// Filtro mostrar tareas completadas
showCompletedButton.addEventListener("click", function () {
  taskFilter = "completed";
  showTaskList();
});

// Eliminar tareas completadas
deleteCompletedButton.addEventListener("click", function () {
  // Filtrando y obteniendo solo tareas activas
  const activeTasks = tasks.filter((task) => !task.completed);
  tasks.length = 0; // Vaciar lista de tareas
  tasks.push(...activeTasks); // Agregar tareas activas a la lista de tareas
  showTaskList();
});
